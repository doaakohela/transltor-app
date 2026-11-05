/**
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
