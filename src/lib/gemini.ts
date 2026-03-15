import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const humanizeText = async (
  text: string, 
  mode: string, 
  level: number,
  onProgress?: (progress: number, message: string) => void
) => {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Temperature based on level
  const temperature = level <= 3 ? 0.5 : level <= 6 ? 0.75 : level <= 9 ? 0.9 : 1.0;

  let modeInstruction = "";
  switch (mode.toLowerCase()) {
    case 'academic':
      modeInstruction = "Use scholarly but genuine language. Add hedging: suggests, indicates, appears to show...";
      break;
    case 'casual':
      modeInstruction = "Like texting a friend. Short sentences. Contractions. Maybe even start with Well or So or Look...";
      break;
    case 'business':
      modeInstruction = "Confident, clear, warm tone. No corporate jargon...";
      break;
    case 'creative':
      modeInstruction = "Expressive and vivid language. Use metaphors and analogies.";
      break;
    case 'aggressive':
      modeInstruction = "Maximum restructuring. Change every sentence structure. Completely rearrange paragraphs.";
      break;
    default:
      modeInstruction = "Balance professional clarity with approachable warmth.";
  }

  // PASS 1: DETECTION ANALYSIS
  if (onProgress) onProgress(10, "🔍 Analyzing AI patterns...");
  const pass1Prompt = `Analyze this text and identify every AI-generated pattern:
- Uniform sentence lengths
- Robotic transition words
- Overused formal phrases
- Repetitive paragraph structures
- Missing contractions
- Perfect grammar patterns
- Predictable word choices
Return JSON:
{
  "aiPatterns": ["string"],
  "roboticWords": ["string"],
  "uniformSentences": [number],
  "overallAIScore": number
}

Text to analyze:
${text}`;

  const pass1Response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: pass1Prompt }] }],
    config: { responseMimeType: "application/json" }
  });
  const pass1Data = JSON.parse(pass1Response.text || "{}");

  // PASS 2: DEEP HUMANIZATION (STEALTH & BYPASS LOGIC)
  if (onProgress) onProgress(40, "✍️ Applying StealthWriter & Turnitin-bypass logic...");
  const pass2Prompt = `You are a world-class human editor specializing in bypassing advanced AI detectors like Turnitin, GPTZero, and Originality.ai. 
Your goal is to rewrite the input text so it is completely indistinguishable from high-level human writing.

STYLE: ${modeInstruction}

CORE HUMANIZATION LOGIC:
1. PERPLEXITY MAXIMIZATION (Lexical Diversity):
   - Avoid "LLM-standard" vocabulary. Instead of "pivotal," use "crucial" or "at the heart of."
   - Use nuanced synonyms that carry specific emotional or contextual weight.
   - Inject "low-probability" word pairings that make sense but aren't predicted by standard probability models.

2. BURSTINESS OPTIMIZATION (Syntactic Variance):
   - Create extreme variation in sentence length. 
   - Follow a 40-word complex sentence with a 3-word punchy fragment.
   - Use varied openers: Prepositional phrases, gerunds, and dependent clauses. Never start three sentences in a row with the same part of speech.

3. COGNITIVE ANCHORING:
   - Add subtle "human" markers: "To be fair," "In my experience," "It's worth considering that," or "The reality is."
   - Use natural transitions that flow logically rather than mechanically (avoid: "Firstly," "In addition," "Consequently").

4. STEALTHWRITER TECHNIQUES:
   - Break the "perfect" rhythm of AI. Humans often have a slightly "messy" but coherent flow.
   - Use active voice primarily, but strategically use passive voice where a human would naturally shift focus.
   - Ensure the "voice" feels consistent and authoritative, not just a collection of facts.

5. TURNITIN-SPECIFIC BYPASS:
   - Rearrange the conceptual flow. Don't just swap words; swap the order of ideas within paragraphs.
   - Paraphrase complex ideas using unique analogies.

Preserve ALL original meaning and data.
Return ONLY the rewritten text.

Original text:
${text}

Pass 1 Analysis:
${JSON.stringify(pass1Data)}`;

  const pass2Response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: pass2Prompt }] }],
    config: { temperature }
  });
  const pass2Result = pass2Response.text || text;

  // PASS 3: FINAL POLISH
  if (onProgress) onProgress(80, "✨ Final polish...");
  const pass3Prompt = `Review this text for any remaining AI patterns.
Fix these specific issues:
1. Any sentence starting with 'The' three times in a row
2. Any remaining formal transition words
3. Any paragraph over 5 sentences (break it up)
4. Any missing contractions where natural
5. Any overly perfect grammar (add slight natural variation)
Return ONLY the polished text.

Text to polish:
${pass2Result}`;

  const pass3Response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: pass3Prompt }] }],
  });

  if (onProgress) onProgress(100, "Done!");
  return pass3Response.text || pass2Result;
};

export const deepHumanizeText = async (
  text: string, 
  mode: string, 
  level: number
) => {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  // Pass 1: Initial Humanization
  const pass1Result = await humanizeText(text, mode, level);

  // Pass 2: Refinement
  const ai = new GoogleGenAI({ apiKey });
  const refinementPrompt = `You are a world-class editor. I have a text that has been partially humanized, but it might still have subtle AI patterns.
Your task is to perform a second pass to:
1. Identify and fix any remaining "robotic" rhythms or overly perfect syntax.
2. Inject more natural "burstiness" (sentence length variety).
3. Ensure the tone is consistent with the ${mode} style.
4. Make it indistinguishable from a text written by a native human speaker in a hurry but with high intelligence.

Return ONLY the refined text with zero explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `${refinementPrompt}\n\nText to refine:\n${pass1Result}` }] }],
    });

    return response.text || pass1Result;
  } catch (error) {
    console.error("Deep Humanize Refinement Error:", error);
    return pass1Result; // Fallback to pass 1 if pass 2 fails
  }
};

/**
 * Refined AI Detection Heuristic
 * Measures Perplexity (Vocabulary Diversity) and Burstiness (Sentence Structure Variance)
 */
export const calculateAiScore = (text: string): { perplexity: number, burstiness: number, totalScore: number } => {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  if (words.length < 10) return { perplexity: 50, burstiness: 50, totalScore: 50 };

  // 1. Perplexity Heuristic: Vocabulary Diversity (Type-Token Ratio + Unique N-grams)
  const uniqueWords = new Set(words);
  const ttr = uniqueWords.size / words.length;
  
  // Advanced perplexity: check for "rare" words (length > 7 and not in common list)
  const commonWords = new Set(['the', 'and', 'for', 'that', 'with', 'this', 'from', 'have', 'they', 'will']);
  const rareWords = words.filter(w => w.length > 7 && !commonWords.has(w));
  const rareRatio = rareWords.length / words.length;
  
  // AI typically has lower TTR and fewer rare words
  const perplexityScore = Math.max(0, 100 - (ttr * 120) - (rareRatio * 200));

  // 2. Burstiness: Sentence Length Variance + Rhythmic Patterns
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let burstinessScore = 50;
  
  if (sentences.length >= 2) {
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / sentenceLengths.length;
    const stdDev = Math.sqrt(variance);
    
    // Check for "robotic" rhythm (sentences of similar length in sequence)
    let sequencePenalty = 0;
    for (let i = 0; i < sentenceLengths.length - 1; i++) {
      if (Math.abs(sentenceLengths[i] - sentenceLengths[i+1]) < 3) {
        sequencePenalty += 10;
      }
    }
    
    // High StdDev (Burstiness) -> Lower AI score
    burstinessScore = Math.max(0, 100 - (stdDev * 15) + (sequencePenalty / sentences.length));
  }

  // 3. AI Fingerprints (Turnitin-style markers)
  const aiBuzzwords = [
    'delve', 'tapestry', 'testament', 'leverage', 'moreover', 
    'furthermore', 'consequently', 'in conclusion', 'it is important to note',
    'comprehensive', 'pivotal', 'underscores', 'vibrant', 'seamless', 'enhance',
    'not only', 'but also', 'in order to', 'due to the fact'
  ];
  let fingerprintCount = 0;
  aiBuzzwords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) fingerprintCount += matches.length;
  });
  const fingerprintScore = Math.min(100, (fingerprintCount / words.length) * 1000);

  // Weighted Average
  let finalScore = (perplexityScore * 0.4) + (burstinessScore * 0.4) + (fingerprintScore * 0.2);

  return {
    perplexity: Math.round(perplexityScore),
    burstiness: Math.round(burstinessScore),
    totalScore: Math.round(Math.min(99, Math.max(1, finalScore)))
  };
};

/**
 * Deep Scan AI Detection using Gemini API
 * Performs semantic analysis to detect AI patterns
 */
export const detectAiDeepScan = async (text: string): Promise<number> => {
  if (!apiKey) return calculateAiScore(text).totalScore;

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Analyze the following text and determine the probability that it was generated by an AI (0-100).
Consider perplexity, burstiness, and common LLM linguistic patterns.
Return ONLY a single number representing the percentage (e.g., "85").

Text to analyze:
"${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    const score = parseInt(response.text?.trim() || "0");
    return isNaN(score) ? calculateAiScore(text).totalScore : score;
  } catch (error) {
    console.error("Deep Scan Error:", error);
    return calculateAiScore(text).totalScore;
  }
};

export const detectAiContent = async (text: string) => {
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Analyze this text and determine what percentage was written by AI.
Look for: repetitive patterns, lack of personal experience, overly formal transitions, perfect grammar, no contractions.
Return JSON: {score: number, reasoning: string, sentences: [{text: string, isAI: boolean}]}` }, { text }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            sentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  isAI: { type: Type.BOOLEAN }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Detect Error:", error);
    throw error;
  }
};

export const detectAiImage = async (base64Image: string, mimeType: string) => {
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          { text: `Analyze this image carefully to determine if it is AI-generated or a real photograph.
Examine:
1. Anatomical errors (hands, eyes, teeth).
2. Background textures and coherence.
3. Lighting and shadow consistency.
4. Edge sharpness and blending artifacts.
5. Semantic inconsistencies.

Return a JSON object with:
- aiProbability: A number from 0 to 100 representing the likelihood it is AI-generated.
- reasons: An array of strings explaining the findings.
- artifacts: An array of specific AI artifacts found.` },
          { inlineData: { data: base64Image, mimeType } }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiProbability: { type: Type.NUMBER },
            reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
            artifacts: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["aiProbability", "reasons", "artifacts"]
        }
      }
    });
    
    const data = JSON.parse(response.text || "{}");
    // Derive isAI and confidence for backward compatibility or UI convenience
    return {
      ...data,
      isAI: data.aiProbability > 50,
      confidence: data.aiProbability > 50 ? data.aiProbability : 100 - data.aiProbability
    };
  } catch (error) {
    console.error("Image Detect Error:", error);
    throw error;
  }
};

export const checkPlagiarism = async (text: string) => {
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Analyze this text for potential plagiarism indicators. Look for: common phrases, well known quotes, textbook language, copied patterns.
Return JSON: {plagiarismScore: number, originalityScore: number, suspiciousPhrases: string[], suggestions: string[]}` }, { text }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plagiarismScore: { type: Type.NUMBER },
            originalityScore: { type: Type.NUMBER },
            suspiciousPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Plagiarism Check Error:", error);
    throw error;
  }
};

export const summarizeText = async (
  text: string,
  mode: 'paragraph' | 'bullets',
  length: 'short' | 'medium' | 'long',
  keywords?: string,
  isRegenerate: boolean = false
) => {
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey });

  let prompt = "";
  if (mode === 'paragraph') {
    prompt = `You are an expert summarizer.
Summarize the following text into a clear coherent paragraph.

Rules:
1. Extract only the most important main points and key ideas
2. Maintain the original meaning and context completely
3. Use clear simple language
4. Target length: [${length.toUpperCase()}: ${length === 'short' ? '25%' : length === 'medium' ? '50%' : '75%'}] of original word count
5. If focus keywords provided: [${keywords || 'NONE'}] — make sure these topics are included
6. Write as flowing paragraph(s) not as a list
7. Start with the main idea
8. Return ONLY the summary`;
  } else {
    prompt = `You are an expert summarizer.
Summarize the following text into clear bullet points.

Rules:
1. Extract the most important key points only
2. Each bullet = one key idea
3. Keep each bullet concise: max 20 words per bullet
4. Target: [${length.toUpperCase()}: ${length === 'short' ? '3-5 bullets' : length === 'medium' ? '6-8 bullets' : '9-12 bullets'}]
5. If focus keywords provided: [${keywords || 'NONE'}] — include these topics
6. Order bullets by importance (most important first)
7. Start each bullet with action verb when possible
8. Return ONLY the bullet points formatted as: • point here`;
  }

  if (keywords) {
    prompt += `\n\nPay special attention to these topics: ${keywords}. Make sure they appear prominently in the summary.`;
  }

  if (isRegenerate) {
    prompt += `\n\nCreate a DIFFERENT summary of the same text. Use different sentences and different angle of approach. Focus on different aspects than before.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }, { text }] }],
    });
    return response.text || "";
  } catch (error) {
    console.error("Summarize Error:", error);
    throw error;
  }
};
