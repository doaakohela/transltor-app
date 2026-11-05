import JSZip from 'jszip';

export interface ExtensionFileSummary {
  name: string;
  size: string;
  type: string;
}

export const MANIFEST_CONTENT = `{
  "manifest_version": 3,
  "name": "Pronounce Words, Texts & Convert to MP3",
  "short_name": "Pronounce & MP3",
  "version": "2.0.0",
  "description": "Pronounce Words, Texts & Convert to MP3 in all world languages with 100% free lifetime studio voices and zero limits.",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "popup.html",
    "default_title": "Pronounce Words, Texts & Convert to MP3",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "permissions": [
    "storage",
    "activeTab",
    "contextMenus"
  ],
  "host_permissions": [
    "https://translate.googleapis.com/*",
    "https://*/*",
    "http://*/*"
  ]
}`;

export const BACKGROUND_JS_CONTENT = `/**
 * VocabFlow Chrome Extension - Background Service Worker (Manifest V3)
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'vocabflow_add_word',
    title: '➕ Add "%s" to VocabFlow',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'vocabflow_quick_speak',
    title: '🔊 Pronounce selected text with AI',
    contexts: ['selection'],
  });

  console.log('VocabFlow Chrome Extension installed successfully!');
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selectedText = (info.selectionText || '').trim();
  if (!selectedText) return;

  if (info.menuItemId === 'vocabflow_add_word') {
    chrome.storage.local.get({ vocabflow_words: [] }, (data) => {
      const words = data.vocabflow_words || [];
      const newWord = {
        id: 'ext-' + Date.now(),
        sourceText: selectedText,
        targetText: '',
        createdAt: Date.now(),
        fromUrl: tab?.url || '',
      };
      words.unshift(newWord);
      chrome.storage.local.set({ vocabflow_words: words }, () => {
        chrome.action.setBadgeText({ text: String(words.length) });
        chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
      });
    });
  } else if (info.menuItemId === 'vocabflow_quick_speak') {
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'SPEAK_SELECTED_TEXT',
        text: selectedText,
      }).catch((err) => console.log('Tab message error:', err));
    }
  }
});
`;

export const CONTENT_JS_CONTENT = `/**
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
    showToastNotification(\`🔊 Pronouncing: "\${text}"\`);
    sendResponse({ success: true });
  }
});

function showToastNotification(message) {
  const existing = document.getElementById('vocabflow-floating-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'vocabflow-floating-toast';
  toast.textContent = message;
  toast.style.cssText = \`
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
  \`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
`;

export const POPUP_HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pronounce Words, Texts &amp; Convert to MP3</title>
  <style>
    :root {
      --bg: #090d16;
      --card: #0f172a;
      --card-alt: #1e293b;
      --border: #1e293b;
      --border-light: #334155;
      --accent: #f59e0b;
      --accent-hover: #fbbf24;
      --indigo: #6366f1;
      --indigo-hover: #4f46e5;
      --emerald: #10b981;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 580px;
      min-height: 590px;
      max-height: 600px;
      overflow-y: auto;
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      padding: 14px;
      transition: width 0.25s ease;
    }
    body.expanded {
      width: 780px;
    }
    /* Custom Scrollbar */
    body::-webkit-scrollbar, .scrollable::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    body::-webkit-scrollbar-track, .scrollable::-webkit-scrollbar-track {
      background: #090d16;
    }
    body::-webkit-scrollbar-thumb, .scrollable::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 4px;
    }

    /* Top Navigation Header */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 10px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6366f1, #f59e0b);
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      flex-shrink: 0;
    }
    .title {
      font-size: 13px;
      font-weight: 800;
      line-height: 1.2;
      color: #fff;
    }
    .title span {
      color: var(--accent);
    }
    .badge-v3 {
      font-size: 9px;
      font-weight: 700;
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.4);
      padding: 2px 5px;
      border-radius: 4px;
      margin-left: 4px;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-toggle-expand {
      font-size: 11px;
      font-weight: 600;
      background: var(--card-alt);
      border: 1px solid var(--border-light);
      color: var(--text);
      padding: 4px 8px;
      border-radius: 7px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-toggle-expand:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    /* VIP Sponsor Bar */
    .vip-banner {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(99, 102, 241, 0.16));
      border: 1px solid rgba(245, 158, 11, 0.4);
      border-radius: 11px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 12px;
    }
    .vip-left {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #fde68a;
      font-weight: 600;
    }
    .vip-tag {
      background: var(--accent);
      color: #000;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 5px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .vip-btn {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #000;
      font-size: 11px;
      font-weight: 800;
      padding: 5px 11px;
      border-radius: 7px;
      text-decoration: none;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .vip-btn:hover {
      filter: brightness(1.12);
      transform: translateY(-1px);
    }

    /* Cards */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 13px;
      padding: 12px 14px;
      margin-bottom: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--border);
    }
    .card-title {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .badge-pill {
      font-size: 10px;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
    }

    /* Google Translate Section */
    .gt-lang-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }
    .select-sm {
      flex: 1;
      background: #060911;
      border: 1px solid var(--border-light);
      border-radius: 7px;
      padding: 5px 8px;
      color: var(--text);
      font-size: 11px;
      outline: none;
      cursor: pointer;
    }
    .select-sm:focus {
      border-color: var(--accent);
    }
    .btn-swap {
      background: var(--card-alt);
      border: 1px solid var(--border-light);
      color: var(--muted);
      width: 28px;
      height: 28px;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
    }
    .btn-swap:hover {
      color: var(--accent);
      border-color: var(--accent);
    }
    .gt-dual-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .gt-pane {
      background: #060911;
      border: 1px solid var(--border);
      border-radius: 9px;
      padding: 8px;
      display: flex;
      flex-col;
      flex-direction: column;
      justify-content: space-between;
      min-height: 85px;
    }
    .gt-textarea {
      width: 100%;
      background: transparent;
      border: none;
      color: #fff;
      font-size: 12px;
      resize: none;
      outline: none;
      min-height: 55px;
      font-family: inherit;
    }
    .gt-pane-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 4px;
      border-top: 1px solid #131d31;
      font-size: 11px;
    }
    .gt-actions-group {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .btn-icon-sm {
      background: transparent;
      border: 1px solid #1e293b;
      color: var(--muted);
      border-radius: 5px;
      padding: 2px 6px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-icon-sm:hover {
      color: #fff;
      border-color: var(--indigo);
      background: rgba(99, 102, 241, 0.15);
    }
    .btn-add-word {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-add-word:hover {
      filter: brightness(1.1);
    }

    /* Bulk Textarea Workstation */
    .bulk-textarea {
      width: 100%;
      background: #060911;
      border: 1px solid var(--border);
      border-radius: 9px;
      padding: 8px 10px;
      color: #f1f5f9;
      font-family: monospace;
      font-size: 11px;
      line-height: 1.4;
      resize: vertical;
      outline: none;
      min-height: 85px;
    }
    .bulk-textarea:focus {
      border-color: var(--accent);
    }
    .bulk-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 6px;
      font-size: 11px;
    }
    .toolbar-buttons {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .btn-tool {
      background: var(--card-alt);
      border: 1px solid var(--border-light);
      color: var(--text);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    .btn-tool:hover {
      color: var(--accent);
      border-color: var(--accent);
    }
    .btn-tool-accent {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #000;
      border: none;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-tool-accent:hover {
      filter: brightness(1.1);
    }

    /* Dual Cards: Player + MP3 Downloader (Screenshot 3) */
    .dual-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
    }
    @media (max-width: 600px) {
      .dual-cards-grid {
        grid-template-columns: 1fr;
      }
    }
    .action-card {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(9, 13, 22, 0.98));
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .action-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 8px;
      padding-bottom: 5px;
      border-bottom: 1px solid var(--border);
    }
    .action-card-header .card-subtitle {
      font-size: 9px;
      color: var(--accent);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .player-display-box {
      background: #060911;
      border: 1px solid #131d31;
      border-radius: 9px;
      padding: 10px;
      text-align: center;
      margin-bottom: 10px;
      min-height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .current-word {
      font-size: 17px;
      font-weight: 800;
      color: #fff;
      word-break: break-word;
      line-height: 1.2;
    }
    .current-translation {
      font-size: 13px;
      font-weight: 600;
      color: var(--accent);
      margin-top: 4px;
      word-break: break-word;
    }
    .player-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .btn-nav {
      background: var(--card-alt);
      border: 1px solid var(--border-light);
      color: var(--text);
      width: 30px;
      height: 30px;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 11px;
    }
    .btn-nav:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    .btn-play-all {
      flex: 1;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(99, 102, 241, 0.25);
    }
    .btn-play-all.playing {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #000;
    }

    /* Downloader Card Controls */
    .downloader-box {
      background: #060911;
      border: 1px solid #131d31;
      border-radius: 9px;
      padding: 8px;
      margin-bottom: 10px;
    }
    .downloader-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      margin-bottom: 6px;
    }
    .downloader-row span {
      color: var(--muted);
    }
    .btn-download-part {
      width: 100%;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #000;
      border: none;
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      box-shadow: 0 3px 10px rgba(245, 158, 11, 0.25);
      margin-bottom: 6px;
    }
    .btn-download-part:hover {
      filter: brightness(1.1);
    }
    .btn-download-all {
      width: 100%;
      background: var(--card-alt);
      border: 1px solid var(--border-light);
      color: var(--text);
      border-radius: 7px;
      padding: 5px 10px;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .btn-download-all:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    /* Discovered Vocabulary Table (Screenshot 2) */
    .table-container {
      max-height: 160px;
      overflow-y: auto;
      border: 1px solid var(--border);
      border-radius: 9px;
      background: #060911;
    }
    body.expanded .table-container {
      max-height: 240px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    th {
      background: #0b1120;
      padding: 6px 8px;
      text-align: left;
      font-weight: 700;
      color: var(--muted);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 2;
    }
    td {
      padding: 6px 8px;
      border-bottom: 1px solid #131d31;
    }
    tr:hover {
      background: rgba(99, 102, 241, 0.05);
    }
    .btn-speak-row {
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.35);
      color: #a5b4fc;
      border-radius: 6px;
      padding: 3px 7px;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      white-space: nowrap;
    }
    .btn-speak-row:hover {
      background: rgba(99, 102, 241, 0.35);
      color: #fff;
    }
    .btn-download-row {
      background: transparent;
      border: 1px solid #1e293b;
      color: var(--muted);
      border-radius: 6px;
      padding: 3px 5px;
      font-size: 10px;
      cursor: pointer;
    }
    .btn-download-row:hover {
      color: var(--accent);
      border-color: var(--accent);
    }
    .inline-edit {
      background: transparent;
      border: 1px solid transparent;
      color: var(--accent);
      font-size: 11px;
      font-weight: 600;
      width: 100%;
      padding: 2px 4px;
      border-radius: 4px;
      outline: none;
    }
    .inline-edit:focus {
      background: #0b1120;
      border-color: var(--border-light);
    }
    .search-input {
      background: #060911;
      border: 1px solid var(--border-light);
      border-radius: 6px;
      padding: 3px 7px;
      color: var(--text);
      font-size: 11px;
      outline: none;
      width: 140px;
    }

    /* Waveform Animation */
    .wave-bars {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      height: 12px;
    }
    .wave-bar {
      width: 2px;
      height: 100%;
      background: var(--accent);
      border-radius: 1px;
      animation: wave 0.8s ease-in-out infinite alternate;
    }
    .wave-bar:nth-child(2) { animation-delay: 0.2s; height: 60%; background: var(--indigo); }
    .wave-bar:nth-child(3) { animation-delay: 0.4s; height: 80%; background: var(--accent); }
    @keyframes wave {
      from { transform: scaleY(0.3); }
      to { transform: scaleY(1); }
    }

    /* Settings Details Collapsible */
    details {
      margin-top: 8px;
      font-size: 11px;
      color: var(--muted);
    }
    details summary {
      cursor: pointer;
      user-select: none;
      outline: none;
    }
    details summary:hover {
      color: var(--text);
    }
  </style>
</head>
<body>
  <!-- Top Navigation Header -->
  <div class="header">
    <div class="brand">
      <div class="brand-icon">🌐</div>
      <div>
        <div class="title">Pronounce Words, Texts &amp; <span>MP3</span><span class="badge-v3">V3</span></div>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn-toggle-expand" id="expandBtn" title="Toggle wide view">⤢ Expand</button>
    </div>
  </div>

  <!-- High-Converting VIP Monetization Link -->
  <div class="vip-banner">
    <div class="vip-left">
      <span class="vip-tag">VIP Offer</span>
      <span>Claim Free High-Speed Cloud Server &amp; Audio Perks</span>
    </div>
    <a href="https://uplcm.com/4/12174511" target="_blank" rel="noopener noreferrer" class="vip-btn" id="vipBtn">
      Claim VIP Perks ↗
    </a>
  </div>

  <!-- Real-Time Google Translate Section -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <span>Google-Style Instant Translation</span>
        <span class="badge-pill">Free Lifetime</span>
      </div>
      <div style="font-size:10px;color:var(--muted);">Auto Detect &amp; All World Languages</div>
    </div>

    <!-- Language selection & swap bar -->
    <div class="gt-lang-bar">
      <select id="gtSourceLang" class="select-sm">
        <option value="auto">🌐 Auto Detect</option>
        <option value="en-US" selected>English (US)</option>
        <option value="ar-EG">Arabic (Egypt)</option>
        <option value="es-ES">Spanish (Spain)</option>
        <option value="fr-FR">French (France)</option>
        <option value="de-DE">German (Germany)</option>
        <option value="it-IT">Italian (Italy)</option>
        <option value="pt-BR">Portuguese (Brazil)</option>
        <option value="tr-TR">Turkish (Turkey)</option>
        <option value="ru-RU">Russian (Russia)</option>
        <option value="ja-JP">Japanese (Japan)</option>
        <option value="ko-KR">Korean (South Korea)</option>
        <option value="zh-CN">Chinese (Simplified)</option>
        <option value="hi-IN">Hindi (India)</option>
      </select>

      <button class="btn-swap" id="gtSwapBtn" title="Swap languages">⇄</button>

      <select id="gtTargetLang" class="select-sm">
        <option value="ar-EG" selected>Arabic (Egypt)</option>
        <option value="en-US">English (US)</option>
        <option value="es-ES">Spanish (Spain)</option>
        <option value="fr-FR">French (France)</option>
        <option value="de-DE">German (Germany)</option>
        <option value="it-IT">Italian (Italy)</option>
        <option value="pt-BR">Portuguese (Brazil)</option>
        <option value="tr-TR">Turkish (Turkey)</option>
        <option value="ru-RU">Russian (Russia)</option>
        <option value="ja-JP">Japanese (Japan)</option>
        <option value="ko-KR">Korean (South Korea)</option>
        <option value="zh-CN">Chinese (Simplified)</option>
        <option value="hi-IN">Hindi (India)</option>
      </select>
    </div>

    <!-- Dual Translation Panes -->
    <div class="gt-dual-grid">
      <!-- Source Pane -->
      <div class="gt-pane">
        <textarea id="gtSourceText" class="gt-textarea" placeholder="Type word or text to translate..."></textarea>
        <div class="gt-pane-footer">
          <span id="gtCharCount" style="color:var(--muted);font-size:10px;">0 chars</span>
          <div class="gt-actions-group">
            <button class="btn-icon-sm" id="gtSpeakSourceBtn" title="Listen source pronunciation">🔊</button>
            <button class="btn-icon-sm" id="gtClearSourceBtn" title="Clear">✕</button>
          </div>
        </div>
      </div>

      <!-- Target Pane -->
      <div class="gt-pane">
        <textarea id="gtTargetText" class="gt-textarea" placeholder="Translation will appear instantly..." readonly></textarea>
        <div class="gt-pane-footer">
          <div class="gt-actions-group">
            <button class="btn-icon-sm" id="gtSpeakTargetBtn" title="Listen target pronunciation">🔊</button>
            <button class="btn-icon-sm" id="gtCopyTargetBtn" title="Copy translation">📋</button>
          </div>
          <button class="btn-add-word" id="gtAddWordBtn" title="Add this word pair to the bulk workstation below">
            ➕ Add to List
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Large Bulk Input Textarea (Screenshot 1) -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <span>Bulk Word Input (Up to 10,000 Words)</span>
      </div>
      <input type="file" id="bulkFileInput" accept=".txt,.csv" style="display:none;" />
      <div class="toolbar-buttons">
        <button class="btn-tool-accent" id="uploadFileBtn" title="Upload TXT or CSV file">
          ⬆ Upload File
        </button>
        <button class="btn-tool" id="sampleBtn" title="Load sample vocabulary">
          ✨ Demo List
        </button>
        <button class="btn-tool" id="clearBtn" title="Clear list">
          🗑️ Clear
        </button>
      </div>
    </div>

    <textarea id="bulkTextarea" class="bulk-textarea" placeholder="Paste your words here (one word per line, up to 10,000 words):&#10;plugging in&#9;connecting&#10;by far&#9;by a large margin&#10;vast&#9;huge&#10;aesthetically&#9;aesthetically pleasing&#10;widens&#9;broadens&#10;conceived&#9;imagined&#10;thrill&#9;excitement"></textarea>

    <div class="bulk-toolbar">
      <span id="wordsCountBadge" style="color:var(--emerald);font-weight:700;">0 words recognized</span>
      <span id="partsCountBadge" style="color:var(--muted);font-size:10px;">(0 MP3 parts)</span>
    </div>
  </div>

  <!-- Dual Cards: Live Continuous Player & MP3 Downloader (Screenshot 3) -->
  <div class="dual-cards-grid">
    <!-- CARD 1 (LEFT): LIVE CONTINUOUS PLAYER -->
    <div class="action-card">
      <div>
        <div class="action-card-header">
          <span class="card-subtitle">Live Listening</span>
          <span id="playerWordCounter">Word: 0 / 0</span>
        </div>
        <div class="player-display-box">
          <div id="waveIndicator" style="display:none;margin-bottom:4px;">
            <div class="wave-bars">
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
            </div>
          </div>
          <div class="current-word" id="currentSourceWord">Ready to Pronounce</div>
          <div class="current-translation" id="currentTargetWord">Add words above to begin</div>
        </div>
      </div>

      <div class="player-controls">
        <button class="btn-nav" id="prevWordBtn" title="Previous word">◀</button>
        <button class="btn-play-all" id="playAllBtn">▶ Start Listening</button>
        <button class="btn-nav" id="nextWordBtn" title="Next word">▶</button>
      </div>
    </div>

    <!-- CARD 2 (RIGHT): COMPLETE MP3 AUDIO DOWNLOADER -->
    <div class="action-card">
      <div>
        <div class="action-card-header">
          <span class="card-subtitle">Audio Downloader</span>
          <span class="badge-pill">MP3 Studio</span>
        </div>
        <div class="downloader-box">
          <div class="downloader-row">
            <span>Select Chunk (100 words):</span>
          </div>
          <select id="partSelector" class="select-sm" style="width:100%;margin-bottom:6px;">
            <option value="0">Part 1 (Words 1 - 100)</option>
          </select>
          <div style="font-size:10px;color:var(--muted);line-height:1.3;">
            2x Source + 1x Target repetitions in natural studio voice.
          </div>
        </div>
      </div>

      <div>
        <button class="btn-download-part" id="downloadPartBtn">
          <span>⬇ Download This Part MP3</span>
        </button>
        <button class="btn-download-all" id="downloadAllBtn">
          <span>⬇ Download All Parts Master MP3</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Discovered Vocabulary Table with Individual Pronunciation (Screenshot 2) -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <span>Discovered Vocabulary</span>
      </div>
      <input type="text" id="tableSearchInput" class="search-input" placeholder="Search words..." />
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width:28px;">#</th>
            <th>Word</th>
            <th>Translation (Editable)</th>
            <th style="text-align:right;width:110px;">Actions</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr>
            <td colspan="4" style="text-align:center;color:var(--muted);padding:18px;">
              No words added yet. Type or paste in the box above!
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Collapsible Voice & API Settings -->
  <details>
    <summary>⚙️ Voice Studio &amp; Backend Server Settings</summary>
    <div style="padding:8px 0;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <div>
        <label style="font-size:10px;color:var(--muted);display:block;margin-bottom:2px;">Source Voice:</label>
        <select id="sourceVoiceSelect" class="select-sm" style="width:100%;">
          <option value="en-US-GuyNeural">English (Guy - Studio Male)</option>
          <option value="en-US-JennyNeural">English (Jenny - Studio Female)</option>
          <option value="ar-EG-SalmaNeural">Arabic Egyptian (Salma - Female)</option>
          <option value="ar-EG-ShakirNeural">Arabic Egyptian (Shakir - Male)</option>
          <option value="es-ES-ElviraNeural">Spanish (Elvira - Female)</option>
          <option value="fr-FR-DeniseNeural">French (Denise - Female)</option>
          <option value="de-DE-ConradNeural">German (Conrad - Male)</option>
        </select>
      </div>
      <div>
        <label style="font-size:10px;color:var(--muted);display:block;margin-bottom:2px;">Target Voice:</label>
        <select id="targetVoiceSelect" class="select-sm" style="width:100%;">
          <option value="ar-EG-ShakirNeural" selected>Arabic Egyptian (Shakir - Male)</option>
          <option value="ar-EG-SalmaNeural">Arabic Egyptian (Salma - Female)</option>
          <option value="en-US-GuyNeural">English (Guy - Studio Male)</option>
          <option value="en-US-JennyNeural">English (Jenny - Studio Female)</option>
          <option value="es-ES-ElviraNeural">Spanish (Elvira - Female)</option>
          <option value="fr-FR-DeniseNeural">French (Denise - Female)</option>
          <option value="de-DE-ConradNeural">German (Conrad - Male)</option>
        </select>
      </div>
    </div>
    <div style="margin-top:4px;">
      <label style="font-size:10px;color:var(--muted);display:block;margin-bottom:2px;">API Server URL (for Neural MP3):</label>
      <input type="text" id="apiServerInput" class="select-sm" style="width:100%;font-family:monospace;" value="https://ais-dev-gypxlvk2hkszgxion77dcf-854327782652.europe-west2.run.app" />
    </div>
  </details>

  <script>
    // Elements
    const bulkTextarea = document.getElementById('bulkTextarea');
    const wordsCountBadge = document.getElementById('wordsCountBadge');
    const partsCountBadge = document.getElementById('partsCountBadge');
    const sampleBtn = document.getElementById('sampleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const uploadFileBtn = document.getElementById('uploadFileBtn');
    const bulkFileInput = document.getElementById('bulkFileInput');
    const expandBtn = document.getElementById('expandBtn');
    const tableBody = document.getElementById('tableBody');
    const tableSearchInput = document.getElementById('tableSearchInput');
    const currentSourceWord = document.getElementById('currentSourceWord');
    const currentTargetWord = document.getElementById('currentTargetWord');
    const playerWordCounter = document.getElementById('playerWordCounter');
    const waveIndicator = document.getElementById('waveIndicator');
    const playAllBtn = document.getElementById('playAllBtn');
    const prevWordBtn = document.getElementById('prevWordBtn');
    const nextWordBtn = document.getElementById('nextWordBtn');
    const partSelector = document.getElementById('partSelector');
    const downloadPartBtn = document.getElementById('downloadPartBtn');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const sourceVoiceSelect = document.getElementById('sourceVoiceSelect');
    const targetVoiceSelect = document.getElementById('targetVoiceSelect');
    const apiServerInput = document.getElementById('apiServerInput');

    // Google Translate Elements
    const gtSourceLang = document.getElementById('gtSourceLang');
    const gtTargetLang = document.getElementById('gtTargetLang');
    const gtSwapBtn = document.getElementById('gtSwapBtn');
    const gtSourceText = document.getElementById('gtSourceText');
    const gtTargetText = document.getElementById('gtTargetText');
    const gtCharCount = document.getElementById('gtCharCount');
    const gtSpeakSourceBtn = document.getElementById('gtSpeakSourceBtn');
    const gtSpeakTargetBtn = document.getElementById('gtSpeakTargetBtn');
    const gtClearSourceBtn = document.getElementById('gtClearSourceBtn');
    const gtCopyTargetBtn = document.getElementById('gtCopyTargetBtn');
    const gtAddWordBtn = document.getElementById('gtAddWordBtn');

    let words = [];
    let currentIndex = 0;
    let isPlaying = false;
    let playbackTimeout = null;
    let currentAudioElement = null;
    let gtDebounceTimer = null;

    const CHUNK_SIZE = 100;

    const SAMPLE_DATA = \`plugging in\\tconnecting
plugging\\tblocking
by far\\tby a large margin
vast\\thuge
aesthetically\\taesthetically pleasing
widens\\tbroadens
conceived\\timagined
conceived\\tformulated
thrill\\texcitement
perseverance\\tcontinued effort
resilience\\trecovery ability
opportunity\\tfavorable circumstances
profound\\tdeep and meaningful
versatile\\tadaptable to many uses
captivating\\textremely attractive\`;

    // Detect API Base
    function getApiBase() {
      const custom = (apiServerInput.value || '').trim();
      if (custom) return custom.replace(/\\/$/, '');
      if (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http')) {
        return window.location.origin;
      }
      return 'https://ais-dev-gypxlvk2hkszgxion77dcf-854327782652.europe-west2.run.app';
    }

    // In-Place Maximize Toggle (No new window!)
    expandBtn.addEventListener('click', () => {
      document.body.classList.toggle('expanded');
      expandBtn.textContent = document.body.classList.contains('expanded') ? '⤡ Compact' : '⤢ Expand';
    });

    // Parse Input Lines with Smart Auto-Detection
    function parseUniversalLine(line) {
      const trimmed = line.trim();
      if (!trimmed) return null;
      // Tab, comma, double-space, dash, colon
      const parts = trimmed.split(/[\\t,:]|\\s{2,}|\\s+-\\s+/);
      if (parts.length >= 2) {
        return {
          sourceText: parts[0].trim(),
          targetText: parts.slice(1).join(' ').trim()
        };
      }
      // Space between Latin and Arabic/Non-Latin
      const latinMatch = trimmed.match(/^([a-zA-Z0-9\\s'-]+)\\s+([\\u0600-\\u06FF\\u4e00-\\u9fa5\\u3040-\\u30ff].*)$/);
      if (latinMatch) {
        return {
          sourceText: latinMatch[1].trim(),
          targetText: latinMatch[2].trim()
        };
      }
      // Single word fallback
      return {
        sourceText: trimmed,
        targetText: ''
      };
    }

    function parseInput(text) {
      const lines = text.split('\\n');
      const parsed = [];
      lines.forEach((line, idx) => {
        const res = parseUniversalLine(line);
        if (res && res.sourceText) {
          parsed.push({
            id: 'w-' + idx + '-' + Math.random().toString(36).substring(2, 6),
            sourceText: res.sourceText,
            targetText: res.targetText || ''
          });
        }
      });
      return parsed;
    }

    function updateWordsFromText() {
      words = parseInput(bulkTextarea.value);
      wordsCountBadge.textContent = words.length + ' words recognized';
      const partsCount = Math.max(1, Math.ceil(words.length / CHUNK_SIZE));
      partsCountBadge.textContent = \`(\${partsCount} MP3 parts)\`;

      updatePartSelector(partsCount);
      if (currentIndex >= words.length) currentIndex = 0;
      updatePlayerDisplay();
      renderTable();
      saveToStorage();
    }

    function updatePartSelector(totalParts) {
      partSelector.innerHTML = '';
      for (let i = 0; i < totalParts; i++) {
        const start = i * CHUNK_SIZE + 1;
        const end = Math.min(words.length, (i + 1) * CHUNK_SIZE);
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = \`Part \${i + 1} (Words \${start} - \${end || 100})\`;
        partSelector.appendChild(opt);
      }
    }

    function updatePlayerDisplay() {
      if (words.length === 0) {
        currentSourceWord.textContent = 'Ready to Pronounce';
        currentTargetWord.textContent = 'Add words above to begin';
        playerWordCounter.textContent = 'Word: 0 / 0';
        return;
      }
      const item = words[currentIndex] || words[0];
      currentSourceWord.textContent = item.sourceText || '';
      currentTargetWord.textContent = item.targetText || 'No translation';
      playerWordCounter.textContent = 'Word: ' + (currentIndex + 1) + ' / ' + words.length;
    }

    // Render Table with Individual Pronunciation & Download Button (Screenshot 2)
    function renderTable() {
      const filter = (tableSearchInput.value || '').toLowerCase().trim();
      const filtered = words.filter(w =>
        w.sourceText.toLowerCase().includes(filter) ||
        w.targetText.toLowerCase().includes(filter)
      );

      if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:18px;">No matching words found.</td></tr>';
        return;
      }

      tableBody.innerHTML = filtered.map((w, idx) => \`
        <tr>
          <td style="color:var(--muted);font-family:monospace;">\${idx + 1}</td>
          <td style="font-weight:700;color:#fff;">\${escapeHtml(w.sourceText)}</td>
          <td>
            <input type="text" class="inline-edit" value="\${escapeHtml(w.targetText)}" data-id="\${w.id}" placeholder="Add translation..." />
          </td>
          <td style="text-align:right;">
            <div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;">
              <button class="btn-speak-row" data-id="\${w.id}" title="Pronounce 2x source + 1x target">
                🔊 Listen
              </button>
              <button class="btn-download-row" data-id="\${w.id}" title="Download single word MP3">
                ⬇
              </button>
            </div>
          </td>
        </tr>
      \`).join('');

      // Attach Listen Button Events
      document.querySelectorAll('.btn-speak-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const item = words.find(w => w.id === id);
          if (item) {
            const idx = words.indexOf(item);
            if (idx !== -1) currentIndex = idx;
            updatePlayerDisplay();
            speakFullWordSequence(item);
          }
        });
      });

      // Attach Single Word Download Button
      document.querySelectorAll('.btn-download-row').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const item = words.find(w => w.id === id);
          if (item) {
            downloadSingleWordMp3(item, e.currentTarget);
          }
        });
      });

      // Attach Inline Edit Events
      document.querySelectorAll('.inline-edit').forEach(input => {
        input.addEventListener('change', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const item = words.find(w => w.id === id);
          if (item) {
            item.targetText = e.currentTarget.value.trim();
            bulkTextarea.value = words.map(w => \`\${w.sourceText}\\t\${w.targetText}\`).join('\\n');
            saveToStorage();
            if (words[currentIndex]?.id === id) {
              currentTargetWord.textContent = item.targetText;
            }
          }
        });
      });
    }

    function escapeHtml(str) {
      if (!str) return '';
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // High Purity Speech Synthesis: Calls Server for Neural MP3 or Browser Fallback
    async function speakFullWordSequence(item, onDone) {
      if (waveIndicator) waveIndicator.style.display = 'block';

      // 1. Try High Purity Neural Server Route (/api/tts/full-word)
      try {
        const apiBase = getApiBase();
        const res = await fetch(\`\${apiBase}/api/tts/full-word\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceText: item.sourceText,
            targetText: item.targetText,
            sourceVoice: sourceVoiceSelect.value,
            targetVoice: targetVoiceSelect.value,
            sourceRepeats: 2,
            targetRepeats: 1,
            pauseSourceMs: 600,
            pauseTargetMs: 800
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.audioBase64) {
            playBase64Mp3(data.audioBase64, () => {
              if (waveIndicator) waveIndicator.style.display = 'none';
              if (onDone) onDone();
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Server TTS failed, using browser synthesis:', err);
      }

      // 2. Client Browser Fallback (2x Source + 1x Target)
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const sLang = gtSourceLang.value === 'auto' ? 'en-US' : gtSourceLang.value;
        const tLang = gtTargetLang.value || 'ar-EG';

        const u1 = new SpeechSynthesisUtterance(item.sourceText);
        u1.lang = sLang;
        u1.rate = 0.95;

        const u2 = new SpeechSynthesisUtterance(item.sourceText);
        u2.lang = sLang;
        u2.rate = 0.95;

        u1.onend = () => {
          setTimeout(() => window.speechSynthesis.speak(u2), 500);
        };

        if (item.targetText) {
          const u3 = new SpeechSynthesisUtterance(item.targetText);
          u3.lang = tLang;
          u3.rate = 0.95;

          u2.onend = () => {
            setTimeout(() => {
              u3.onend = () => {
                if (waveIndicator) waveIndicator.style.display = 'none';
                if (onDone) onDone();
              };
              window.speechSynthesis.speak(u3);
            }, 600);
          };
        } else {
          u2.onend = () => {
            if (waveIndicator) waveIndicator.style.display = 'none';
            if (onDone) onDone();
          };
        }

        window.speechSynthesis.speak(u1);
      } else {
        if (waveIndicator) waveIndicator.style.display = 'none';
        if (onDone) onDone();
      }
    }

    function playBase64Mp3(base64, onEnd) {
      if (currentAudioElement) {
        currentAudioElement.pause();
        currentAudioElement = null;
      }
      const audio = new Audio(\`data:audio/mp3;base64,\${base64}\`);
      currentAudioElement = audio;
      audio.onended = () => {
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        if (onEnd) onEnd();
      };
      audio.play().catch(e => {
        console.warn('Audio play prevented:', e);
        if (onEnd) onEnd();
      });
    }

    // Download Single Word MP3
    async function downloadSingleWordMp3(item, btnElement) {
      const originalText = btnElement.textContent;
      btnElement.textContent = '⏳';
      try {
        const apiBase = getApiBase();
        const res = await fetch(\`\${apiBase}/api/tts/full-word\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceText: item.sourceText,
            targetText: item.targetText,
            sourceVoice: sourceVoiceSelect.value,
            targetVoice: targetVoiceSelect.value,
            sourceRepeats: 2,
            targetRepeats: 1
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            triggerDownload(data.audioBase64, data.filename || \`\${item.sourceText}_repetition.mp3\`);
            btnElement.textContent = '✓';
            setTimeout(() => { btnElement.textContent = originalText; }, 2000);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      btnElement.textContent = originalText;
    }

    // Download Selected Part MP3 (100 Words)
    downloadPartBtn.addEventListener('click', async () => {
      if (words.length === 0) {
        alert('Please add words first!');
        return;
      }
      const partIdx = Number(partSelector.value) || 0;
      const start = partIdx * CHUNK_SIZE;
      const end = Math.min(words.length, (partIdx + 1) * CHUNK_SIZE);
      const partWords = words.slice(start, end);

      downloadPartBtn.disabled = true;
      downloadPartBtn.innerHTML = '<span>⏳ Generating Part MP3...</span>';

      try {
        const apiBase = getApiBase();
        const res = await fetch(\`\${apiBase}/api/tts/batch-download\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: partWords,
            sourceVoice: sourceVoiceSelect.value,
            targetVoice: targetVoiceSelect.value,
            sourceRepeats: 2,
            targetRepeats: 1,
            filename: \`part_\${partIdx + 1}_words_\${start + 1}_to_\${end}.mp3\`
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            triggerDownload(data.audioBase64, data.filename || \`part_\${partIdx + 1}_words.mp3\`);
            downloadPartBtn.innerHTML = '<span>✓ Downloaded Successfully!</span>';
            setTimeout(() => {
              downloadPartBtn.disabled = false;
              downloadPartBtn.innerHTML = '<span>⬇ Download This Part MP3</span>';
            }, 3000);
            return;
          }
        }
        throw new Error('Server returned invalid response');
      } catch (err) {
        alert('Could not download part MP3 from server: ' + err.message);
        downloadPartBtn.disabled = false;
        downloadPartBtn.innerHTML = '<span>⬇ Download This Part MP3</span>';
      }
    });

    // Download All Parts Master MP3
    downloadAllBtn.addEventListener('click', async () => {
      if (words.length === 0) {
        alert('Please add words first!');
        return;
      }
      downloadAllBtn.disabled = true;
      downloadAllBtn.innerHTML = '<span>⏳ Building Master MP3...</span>';

      try {
        const apiBase = getApiBase();
        const res = await fetch(\`\${apiBase}/api/tts/batch-download\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: words,
            sourceVoice: sourceVoiceSelect.value,
            targetVoice: targetVoiceSelect.value,
            sourceRepeats: 2,
            targetRepeats: 1,
            filename: \`all_\${words.length}_words_master.mp3\`
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            triggerDownload(data.audioBase64, data.filename || \`all_\${words.length}_words_master.mp3\`);
            downloadAllBtn.innerHTML = '<span>✓ Master MP3 Downloaded!</span>';
            setTimeout(() => {
              downloadAllBtn.disabled = false;
              downloadAllBtn.innerHTML = '<span>⬇ Download All Parts Master MP3</span>';
            }, 3000);
            return;
          }
        }
        throw new Error('Batch server failure');
      } catch (err) {
        alert('Could not generate all parts: ' + err.message);
        downloadAllBtn.disabled = false;
        downloadAllBtn.innerHTML = '<span>⬇ Download All Parts Master MP3</span>';
      }
    });

    function triggerDownload(base64, filename) {
      const a = document.createElement('a');
      a.href = \`data:audio/mp3;base64,\${base64}\`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Continuous Playback Loop
    function startPlayback() {
      if (words.length === 0) return;
      isPlaying = true;
      playAllBtn.textContent = '⏸ Pause Playback';
      playAllBtn.classList.add('playing');
      playNextStep();
    }

    function stopPlayback() {
      isPlaying = false;
      playAllBtn.textContent = '▶ Start Listening';
      playAllBtn.classList.remove('playing');
      if (playbackTimeout) clearTimeout(playbackTimeout);
      if (currentAudioElement) {
        currentAudioElement.pause();
        currentAudioElement = null;
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (waveIndicator) waveIndicator.style.display = 'none';
    }

    function playNextStep() {
      if (!isPlaying || words.length === 0) return;
      updatePlayerDisplay();
      const item = words[currentIndex];
      speakFullWordSequence(item, () => {
        if (!isPlaying) return;
        playbackTimeout = setTimeout(() => {
          if (currentIndex + 1 < words.length) {
            currentIndex++;
            playNextStep();
          } else {
            stopPlayback();
          }
        }, 1200);
      });
    }

    playAllBtn.addEventListener('click', () => {
      if (isPlaying) stopPlayback();
      else startPlayback();
    });

    prevWordBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updatePlayerDisplay();
        if (isPlaying) playNextStep();
      }
    });

    nextWordBtn.addEventListener('click', () => {
      if (currentIndex + 1 < words.length) {
        currentIndex++;
        updatePlayerDisplay();
        if (isPlaying) playNextStep();
      }
    });

    sampleBtn.addEventListener('click', () => {
      bulkTextarea.value = SAMPLE_DATA;
      updateWordsFromText();
    });

    clearBtn.addEventListener('click', () => {
      bulkTextarea.value = '';
      stopPlayback();
      updateWordsFromText();
    });

    // Upload TXT / CSV File
    uploadFileBtn.addEventListener('click', () => {
      bulkFileInput.click();
    });

    bulkFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target && evt.target.result;
        if (typeof text === 'string') {
          bulkTextarea.value = text;
          updateWordsFromText();
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    bulkTextarea.addEventListener('input', updateWordsFromText);
    tableSearchInput.addEventListener('input', renderTable);

    // Google Translate Auto-Translate with Debounce
    gtSourceText.addEventListener('input', () => {
      const text = gtSourceText.value;
      gtCharCount.textContent = \`\${text.length} chars\`;
      if (gtDebounceTimer) clearTimeout(gtDebounceTimer);
      if (!text.trim()) {
        gtTargetText.value = '';
        return;
      }
      gtDebounceTimer = setTimeout(() => {
        triggerTranslation(text.trim());
      }, 400);
    });

    async function triggerTranslation(text) {
      const sl = gtSourceLang.value === 'auto' ? 'auto' : gtSourceLang.value.split('-')[0];
      const tl = gtTargetLang.value.split('-')[0];

      // 1. Try Direct Google Translate (Native browser query - matches Google Translate 100%)
      try {
        const gUrl = \`https://translate.googleapis.com/translate_a/single?client=gtx&sl=\${encodeURIComponent(sl)}&tl=\${encodeURIComponent(tl)}&dt=t&q=\${encodeURIComponent(text)}\`;
        const res = await fetch(gUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data[0])) {
            const tr = data[0].map(item => item[0]).join('');
            if (tr) {
              gtTargetText.value = tr;
              return;
            }
          }
        }
      } catch (e) {}

      // 2. Server Proxy Fallback
      try {
        const apiBase = getApiBase();
        const res = await fetch(\`\${apiBase}/api/translate\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, sourceLang: sl, targetLang: tl })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.translatedText) {
            gtTargetText.value = data.translatedText;
          }
        }
      } catch (err) {}
    }

    gtSwapBtn.addEventListener('click', () => {
      const temp = gtSourceLang.value === 'auto' ? 'en-US' : gtSourceLang.value;
      gtSourceLang.value = gtTargetLang.value;
      gtTargetLang.value = temp;
      const sVal = gtSourceText.value;
      gtSourceText.value = gtTargetText.value;
      gtTargetText.value = sVal;
      if (gtSourceText.value.trim()) {
        triggerTranslation(gtSourceText.value.trim());
      }
    });

    gtClearSourceBtn.addEventListener('click', () => {
      gtSourceText.value = '';
      gtTargetText.value = '';
      gtCharCount.textContent = '0 chars';
    });

    gtCopyTargetBtn.addEventListener('click', () => {
      if (gtTargetText.value) {
        navigator.clipboard.writeText(gtTargetText.value);
        gtCopyTargetBtn.textContent = '✓';
        setTimeout(() => { gtCopyTargetBtn.textContent = '📋'; }, 1500);
      }
    });

    gtAddWordBtn.addEventListener('click', () => {
      const src = gtSourceText.value.trim();
      const tgt = gtTargetText.value.trim();
      if (!src) return;
      const current = bulkTextarea.value.trim();
      const line = \`\${src}\\t\${tgt}\`;
      bulkTextarea.value = current ? \`\${line}\\n\${current}\` : line;
      updateWordsFromText();
      gtAddWordBtn.textContent = '✓ Added!';
      setTimeout(() => { gtAddWordBtn.textContent = '➕ Add to List'; }, 2000);
    });

    gtSpeakSourceBtn.addEventListener('click', () => {
      const text = gtSourceText.value.trim();
      if (!text) return;
      speakSingleText(text, gtSourceLang.value === 'auto' ? 'en-US' : gtSourceLang.value);
    });

    gtSpeakTargetBtn.addEventListener('click', () => {
      const text = gtTargetText.value.trim();
      if (!text) return;
      speakSingleText(text, gtTargetLang.value);
    });

    function speakSingleText(text, lang) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    }

    // Storage Sync
    function saveToStorage() {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({
            vocabflow_raw: bulkTextarea.value,
            vocabflow_server: apiServerInput.value
          });
        } else {
          localStorage.setItem('vocabflow_raw', bulkTextarea.value);
          localStorage.setItem('vocabflow_server', apiServerInput.value);
        }
      } catch(e) {}
    }

    function loadFromStorage() {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get({ vocabflow_raw: '', vocabflow_server: '' }, (data) => {
            if (data.vocabflow_raw) {
              bulkTextarea.value = data.vocabflow_raw;
              updateWordsFromText();
            }
            if (data.vocabflow_server) {
              apiServerInput.value = data.vocabflow_server;
            }
          });
        } else {
          const saved = localStorage.getItem('vocabflow_raw');
          if (saved) {
            bulkTextarea.value = saved;
            updateWordsFromText();
          }
          const savedServer = localStorage.getItem('vocabflow_server');
          if (savedServer) {
            apiServerInput.value = savedServer;
          }
        }
      } catch(e) {}
    }

    apiServerInput.addEventListener('change', saveToStorage);
    loadFromStorage();
  </script>
</body>
</html>
`;

export const EXTENSION_README_CONTENT = `# Pronounce Words, Texts & Convert to MP3 - Chrome Extension 🚀

A high-performance Chrome extension for real-time translation, vocabulary retention, and double-repetition neural audio playback in all world languages with 100% free lifetime usage.

---

## 🛠️ Installation Instructions for Google Chrome (1 Minute):

1. **Unzip the downloaded package**:
   - Extract \`pronounce-words-texts-mp3-extension.zip\` into any folder on your computer.

2. **Open Extensions in Chrome**:
   - In Chrome's address bar, type: \`chrome://extensions\` and press Enter.
   - Alternatively, open the Chrome Menu (three dots) ➔ **Extensions** ➔ **Manage Extensions**.

3. **Enable Developer Mode**:
   - In the top-right corner, toggle on **Developer mode**.

4. **Load the Unpacked Extension**:
   - Click the **"Load unpacked"** button.
   - Select the extracted folder containing \`manifest.json\`.

5. **Ready to use! 🥳**:
   - The **Pronounce Words & MP3** icon will appear in your Chrome toolbar.
   - Pin it for 1-click access from any web page.
   - Select any text on any webpage and right-click to add or pronounce instantly!
`;

/**
 * Downloads a ready-to-load ZIP file containing ONLY the files needed for Chrome extensions
 */
export async function downloadExtensionZip(): Promise<boolean> {
  try {
    const zip = new JSZip();

    // Fetch live popup.html and popup.js to ensure 100% exact parity with public/
    let popupHtml = POPUP_HTML_CONTENT;
    let popupJs = '';
    try {
      const [popupRes, jsRes] = await Promise.all([
        fetch('/popup.html'),
        fetch('/popup.js')
      ]);
      if (popupRes.ok) {
        popupHtml = await popupRes.text();
      }
      if (jsRes.ok) {
        popupJs = await jsRes.text();
      }
    } catch (e) {
      console.warn('Using embedded popup HTML/JS fallback:', e);
    }

    // Essential Chrome Extension files ONLY
    zip.file('manifest.json', MANIFEST_CONTENT);
    zip.file('background.js', BACKGROUND_JS_CONTENT);
    zip.file('content.js', CONTENT_JS_CONTENT);
    zip.file('popup.html', popupHtml);
    if (popupJs) {
      zip.file('popup.js', popupJs);
    }
    zip.file('README.md', EXTENSION_README_CONTENT);

    const iconFolder = zip.folder('icons');
    if (iconFolder) {
      try {
        const [res16, res48, res128] = await Promise.all([
          fetch('/icons/icon16.png').then((r) => (r.ok ? r.blob() : null)),
          fetch('/icons/icon48.png').then((r) => (r.ok ? r.blob() : null)),
          fetch('/icons/icon128.png').then((r) => (r.ok ? r.blob() : null)),
        ]);

        if (res16) iconFolder.file('icon16.png', res16);
        if (res48) iconFolder.file('icon48.png', res48);
        if (res128) iconFolder.file('icon128.png', res128);
      } catch (e) {
        console.warn('Could not bundle icons from public folder:', e);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pronounce-words-texts-mp3-extension.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to create extension ZIP:', err);
    return false;
  }
}
