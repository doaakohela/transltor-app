// Background service worker for Translate words, texts & convert to MP3 (Manifest V3)
// Strictly audited permissions: storage, contextMenus, downloads. No activeTab or broad host permissions.

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate_selection",
    title: "Translate & Pronounce: '%s'",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate_selection" && info.selectionText) {
    chrome.storage.local.set({ lastSelection: info.selectionText }, () => {
      if (chrome.action && chrome.action.openPopup) {
        chrome.action.openPopup().catch(() => {
          chrome.windows.create({
            url: chrome.runtime.getURL('popup.html?mode=window'),
            type: 'popup',
            width: 500,
            height: 720,
            focused: true
          });
        });
      }
    });
  }
});

// Listener to spawn standalone persistent window (does not close automatically on focus loss)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'open_persistent_window') {
    chrome.windows.create({
      url: chrome.runtime.getURL('popup.html?mode=window'),
      type: 'popup',
      width: 500,
      height: 720,
      focused: true
    });
    sendResponse({ status: 'ok' });
  }
  return true;
});
