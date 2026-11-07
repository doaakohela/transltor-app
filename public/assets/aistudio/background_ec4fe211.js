// Background service worker for Translate words, texts & convert to MP3 Manifest V3
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate_selection",
    title: "Translate words, texts & convert to MP3: '%s'",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate_selection" && info.selectionText) {
    chrome.storage.local.set({ lastSelection: info.selectionText });
    chrome.action.openPopup();
  }
});