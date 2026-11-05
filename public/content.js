/**
 * VocabFlow Chrome Extension - Content Script
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SPEAK_SELECTED_TEXT') {
    const text = request.text;
    if (!text) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
    showToastNotification(`🔊 Pronouncing: "${text}"`);
    sendResponse({ success: true });
  }
});

function showToastNotification(message) {
  const existing = document.getElementById('vocabflow-floating-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'vocabflow-floating-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999999;
    background: #0f172a;
    color: #f8fafc;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 10px 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    pointer-events: none;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
