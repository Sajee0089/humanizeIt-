import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase Admin (Service Role)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase credentials missing. Server-side operations will fail.");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // PayPal Payment Verification
  app.post("/api/verify-payment", async (req, res) => {
    try {
      const { paymentId, token, plan, billing } = req.body;

      if (!paymentId || !token || !plan || !billing) {
        return res.status(400).json({ verified: false, error: 'Missing required parameters' });
      }

      // 1. Check token exists in Supabase
      const { data: pending, error: pendingError } = await supabaseAdmin
        .from('pending_payments')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (pendingError || !pending) {
        return res.status(404).json({ verified: false, error: 'Invalid or expired session' });
      }

      // 2. Check token not expired
      if (new Date() > new Date(pending.expires_at)) {
        return res.status(400).json({ verified: false, error: 'Session expired' });
      }

      // 3. Verify with PayPal API
      const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
      const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

      if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
        console.error("PayPal credentials not configured");
        return res.status(500).json({ verified: false, error: 'Server configuration error' });
      }

      // Get PayPal access token
      const authResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });
      
      if (!authResponse.ok) {
        throw new Error('Failed to authenticate with PayPal');
      }
      
      const auth = await authResponse.json();
      const accessToken = auth.access_token;

      // 4. Verify payment with PayPal
      const orderResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to fetch order from PayPal');
      }
      
      const order = await orderResponse.json();

      // 5. Check payment is completed
      if (order.status === 'COMPLETED' || order.status === 'APPROVED') {
        
        // 6. Verify amount matches
        let paidAmount = 0;
        if (order.purchase_units && order.purchase_units.length > 0) {
          paidAmount = parseFloat(order.purchase_units[0].amount.value);
        }
        
        const expectedAmounts: Record<string, number> = {
          'pro-monthly': 9.99,
          'pro-yearly': 79.00,
          'unlimited-monthly': 19.99,
          'unlimited-yearly': 159.00
        };
        
        const planKey = `${plan}-${billing}`;
        const expectedAmount = expectedAmounts[planKey];
        
        if (!expectedAmount || Math.abs(paidAmount - expectedAmount) > 0.01) {
          console.error(`Amount mismatch: Paid ${paidAmount}, Expected ${expectedAmount}`);
          return res.status(400).json({ verified: false, error: 'Amount mismatch' });
        }

        // 7. ACTIVATE PLAN!
        const wordsLimit = plan === 'pro' ? 10000 : 999999;
        const expiresAt = new Date();
        if (billing === 'monthly') {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        await supabaseAdmin
          .from('profiles')
          .update({
            plan: plan,
            words_limit: wordsLimit,
            plan_expires: expiresAt.toISOString(),
            paypal_transaction_id: paymentId
          })
          .eq('id', pending.user_id);

        // 8. Update pending payment
        await supabaseAdmin
          .from('pending_payments')
          .update({ 
            status: 'completed',
            paypal_payment_id: paymentId
          })
          .eq('id', pending.id);

        return res.json({ verified: true });
      }

      return res.status(400).json({ verified: false, error: 'Payment not completed' });

    } catch (error) {
      console.error("Verification error:", error);
      return res.status(500).json({ verified: false, error: 'Verification failed' });
    }
  });

  // PayPal REST Webhook (Modern)
  app.post("/api/paypal-webhook", async (req, res) => {
    try {
      const headers = req.headers;
      const eventBody = req.body;
      const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

      if (!WEBHOOK_ID) {
        console.error("PAYPAL_WEBHOOK_ID not configured");
        return res.status(500).send('Webhook ID not configured');
      }

      // 1. Get Access Token
      const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
      const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
      
      const authResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });
      
      const auth = await authResponse.json();
      const accessToken = auth.access_token;

      // 2. Verify Webhook Signature with PayPal
      const verifyResponse = await fetch('https://api-m.paypal.com/v1/notifications/verify-webhook-signature', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transmission_id: headers['paypal-transmission-id'],
          transmission_time: headers['paypal-transmission-time'],
          cert_url: headers['paypal-cert-url'],
          auth_algo: headers['paypal-auth-algo'],
          transmission_sig: headers['paypal-transmission-sig'],
          webhook_id: WEBHOOK_ID,
          webhook_event: eventBody
        })
      });

      const verification = await verifyResponse.json();

      if (verification.verification_status !== 'SUCCESS') {
        console.error("PayPal Webhook verification failed:", verification);
        return res.status(401).send('Invalid signature');
      }

      // 3. Process Event
      console.log("PayPal Webhook Verified:", eventBody.event_type);

      if (eventBody.event_type === 'CHECKOUT.ORDER.APPROVED' || eventBody.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const resource = eventBody.resource;
        const customId = resource.custom_id || (resource.purchase_units && resource.purchase_units[0].custom_id);
        
        if (customId) {
          const { data: pending, error: pendingError } = await supabaseAdmin
            .from('pending_payments')
            .select('*')
            .eq('token', customId)
            .eq('status', 'pending')
            .single();
          
          if (!pendingError && pending) {
            const wordsLimit = pending.plan === 'pro' ? 10000 : 999999;
            const expiresAt = new Date();
            if (pending.billing === 'monthly') {
              expiresAt.setMonth(expiresAt.getMonth() + 1);
            } else {
              expiresAt.setFullYear(expiresAt.getFullYear() + 1);
            }

            await supabaseAdmin
              .from('profiles')
              .update({
                plan: pending.plan,
                words_limit: wordsLimit,
                plan_expires: expiresAt.toISOString(),
                paypal_transaction_id: resource.id
              })
              .eq('id', pending.user_id);

            await supabaseAdmin
              .from('pending_payments')
              .update({ 
                status: 'completed',
                paypal_payment_id: resource.id
              })
              .eq('id', pending.id);
            
            console.log(`Plan activated via Webhook for user ${pending.user_id}`);
          }
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
