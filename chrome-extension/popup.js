document.getElementById('humanizeBtn').addEventListener('click', () => {
  const text = document.getElementById('input').value;
  if (!text) return;
  
  // In a real extension, we might call the API directly, 
  // but for this MVP we'll redirect to the web app with the text
  const url = `https://ais-dev-jflief5ldtvcke32tj3d7n-706046704241.asia-southeast1.run.app/humanize?text=${encodeURIComponent(text)}`;
  chrome.tabs.create({ url });
});
