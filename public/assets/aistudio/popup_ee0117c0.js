// Translate words, texts & convert to MP3 Chrome Extension Engine v1.1.0
// Features: Genuine MP3 Download, Windows-1256 Arabic Decoder, 2x/1x Pronunciation, Delete Words Functionality

let words = [
  { orig: "by far", trans: "بفارق كبير", sl: "en", tl: "ar" },
  { orig: "plugging in", trans: "توصيل بالكهرباء", sl: "en", tl: "ar" },
  { orig: "vast", trans: "واسع وشاسع", sl: "en", tl: "ar" },
  { orig: "Perseverance", trans: "المثابرة", sl: "en", tl: "ar" }
];

// Elements
const sourceText = document.getElementById('sourceText');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const translateBtn = document.getElementById('translateBtn');
const listenBtn = document.getElementById('listenBtn');
const downloadSingleMp3 = document.getElementById('downloadSingleMp3');
const downloadBatchMp3 = document.getElementById('downloadBatchMp3');
const resultBox = document.getElementById('resultBox');
const addToListBtn = document.getElementById('addToListBtn');
const tabTranslate = document.getElementById('tabTranslate');
const tabDeck = document.getElementById('tabDeck');
const tabImport = document.getElementById('tabImport');
const viewTranslate = document.getElementById('viewTranslate');
const viewDeck = document.getElementById('viewDeck');
const viewImport = document.getElementById('viewImport');
const deckListContainer = document.getElementById('deckListContainer');
const deckCountBadge = document.getElementById('deckCountBadge');
const deckSearch = document.getElementById('deckSearch');
const playAllBtn = document.getElementById('playAllBtn');
const uploadFileBtn = document.getElementById('uploadFileBtn');
const fileUploadInput = document.getElementById('fileUploadInput');
const bulkPasteText = document.getElementById('bulkPasteText');
const submitImportBtn = document.getElementById('submitImportBtn');
const clearAllDeckBtn = document.getElementById('clearAllDeckBtn');
const themeToggle = document.getElementById('themeToggle');
const swapBtn = document.getElementById('swapBtn');
const statusToast = document.getElementById('statusToast');

sourceLang.value = "en";
targetLang.value = "ar";

function showToast(msg, type = "info") {
  statusToast.textContent = msg;
  statusToast.className = "status-toast show " + type;
  setTimeout(() => {
    statusToast.className = "status-toast";
  }, 4000);
}

// Load stored vocabulary
chrome.storage.local.get(['lingoWords', 'lastSelection'], (res) => {
  if (res.lingoWords && Array.isArray(res.lingoWords)) {
    words = res.lingoWords;
  }
  if (res.lastSelection) {
    sourceText.value = res.lastSelection;
    doTranslate();
    chrome.storage.local.remove('lastSelection');
  }
  renderDeck();
});

// Free Translation
async function doTranslate() {
  const text = sourceText.value.trim();
  if (!text) return;
  resultBox.textContent = "Translating...";
  try {
    const sl = sourceLang.value;
    const tl = targetLang.value;
    const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + encodeURIComponent(sl) + "&tl=" + encodeURIComponent(tl) + "&dt=t&q=" + encodeURIComponent(text);
    const response = await fetch(url);
    const data = await response.json();
    let translated = "";
    if (data && data[0]) {
      for (let item of data[0]) {
        if (item[0]) translated += item[0];
      }
    }
    resultBox.textContent = translated || "No translation found.";
  } catch (err) {
    resultBox.textContent = "Translation failed. Check connection.";
  }
}

// Voice matcher
function getBestVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  const clean = lang.split('-')[0].toLowerCase();
  return voices.find(v => v.lang.toLowerCase().startsWith(clean)) || null;
}

// Play Word Pair strictly: Original TWICE + Translation ONCE
function speakWordPair(orig, trans, sl, tl, callback) {
  window.speechSynthesis.cancel();
  const u1 = new SpeechSynthesisUtterance(orig);
  const voice1 = getBestVoice(sl);
  if (voice1) u1.voice = voice1;
  u1.lang = sl;

  const u2 = new SpeechSynthesisUtterance(orig);
  if (voice1) u2.voice = voice1;
  u2.lang = sl;

  const u3 = new SpeechSynthesisUtterance(trans);
  const voice3 = getBestVoice(tl);
  if (voice3) u3.voice = voice3;
  u3.lang = tl;

  u3.onend = () => {
    if (callback) callback();
  };

  window.speechSynthesis.speak(u1);
  setTimeout(() => window.speechSynthesis.speak(u2), 650);
  setTimeout(() => window.speechSynthesis.speak(u3), 1450);
}

// Fetch TTS Audio Buffer for a given text and language
async function fetchAudioBuffer(audioCtx, text, lang) {
  const clean = lang.split('-')[0];
  const url = "https://translate.google.com/translate_tts?ie=UTF-8&q=" + encodeURIComponent(text) + "&tl=" + encodeURIComponent(clean) + "&client=tw-ob";
  const res = await fetch(url);
  if (!res.ok) throw new Error("TTS fetch failed with HTTP " + res.status);
  const ab = await res.arrayBuffer();
  return await audioCtx.decodeAudioData(ab);
}

// Convert AudioBuffer to Genuine MP3 using LAME encoder
function audioBufferToMp3Blob(audioBuffer, kbps = 128) {
  const channels = 1;
  const sampleRate = audioBuffer.sampleRate;
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);
  const mp3Data = [];

  const rawData = audioBuffer.getChannelData(0);
  const int16 = new Int16Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    const s = Math.max(-1, Math.min(1, rawData[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  const sampleBlockSize = 1152;
  for (let i = 0; i < int16.length; i += sampleBlockSize) {
    const chunk = int16.subarray(i, i + sampleBlockSize);
    const buf = encoder.encodeBuffer(chunk);
    if (buf.length > 0) mp3Data.push(new Uint8Array(buf));
  }

  const flush = encoder.flush();
  if (flush.length > 0) mp3Data.push(new Uint8Array(flush));

  return new Blob(mp3Data, { type: 'audio/mp3' });
}

// Trigger direct download via chrome.downloads or fallback anchor
function triggerDownload(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);
  if (chrome.downloads && chrome.downloads.download) {
    chrome.downloads.download({
      url: blobUrl,
      filename: filename,
      saveAs: false
    }, () => {
      if (chrome.runtime.lastError) {
        fallbackAnchorDownload(blobUrl, filename);
      }
    });
  } else {
    fallbackAnchorDownload(blobUrl, filename);
  }
}

function fallbackAnchorDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 300);
}

// Download Genuine MP3 File (Word 2x + Translation 1x)
async function downloadMp3(orig, trans, sl, tl, buttonElement) {
  const btn = buttonElement || downloadSingleMp3;
  const prevText = btn.textContent;
  btn.textContent = "Encoding MP3...";
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();

    const b1 = await fetchAudioBuffer(audioCtx, orig, sl);
    const b2 = await fetchAudioBuffer(audioCtx, trans, tl);
    const sampleRate = b1.sampleRate;
    const pauseSamples = Math.floor(sampleRate * 0.55);

    const totalSamples = b1.length + pauseSamples + b1.length + pauseSamples + b2.length + Math.floor(sampleRate * 0.25);
    const comb = audioCtx.createBuffer(1, totalSamples, sampleRate);
    const out = comb.getChannelData(0);

    let offset = 0;
    out.set(b1.getChannelData(0), offset);
    offset += b1.length + pauseSamples;
    out.set(b1.getChannelData(0), offset);
    offset += b1.length + pauseSamples;
    out.set(b2.getChannelData(0), offset);

    const mp3Blob = audioBufferToMp3Blob(comb, 128);
    const safeName = orig.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    triggerDownload(mp3Blob, "lingoboost_" + safeName + "_2x1x.mp3");

    btn.textContent = "✓ Downloaded!";
    showToast("MP3 file downloaded successfully!", "success");
    setTimeout(() => { btn.textContent = prevText; }, 2500);
  } catch(e) {
    console.error(e);
    btn.textContent = "Error!";
    showToast("Failed to generate MP3. Check internet connection.", "error");
    setTimeout(() => { btn.textContent = prevText; }, 2500);
  }
}

// Download Batch MP3 for playlist
async function downloadPlaylistMp3() {
  if (words.length === 0) return;
  const btn = downloadBatchMp3;
  btn.textContent = "Encoding Playlist...";
  showToast("Compiling MP3 playlist...", "info");

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const slice = words.slice(0, 20);
    const buffers = [];
    const pause = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * 0.55), audioCtx.sampleRate);
    const wordPause = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * 1.2), audioCtx.sampleRate);

    for (let i = 0; i < slice.length; i++) {
      const w = slice[i];
      btn.textContent = "Encoding (" + (i + 1) + "/" + slice.length + ")...";
      try {
        const bOrig = await fetchAudioBuffer(audioCtx, w.orig, w.sl);
        const bTrans = await fetchAudioBuffer(audioCtx, w.trans, w.tl);

        buffers.push(bOrig);
        buffers.push(pause);
        buffers.push(bOrig);
        buffers.push(pause);
        buffers.push(bTrans);
        buffers.push(wordPause);
      } catch(e) {
        console.warn("Item error:", w.orig, e);
      }
    }

    if (buffers.length > 0) {
      const totalLen = buffers.reduce((a, b) => a + b.length, 0);
      const comb = audioCtx.createBuffer(1, totalLen, audioCtx.sampleRate);
      const out = comb.getChannelData(0);
      let offset = 0;
      for (let b of buffers) {
        out.set(b.getChannelData(0), offset);
        offset += b.length;
      }

      const mp3Blob = audioBufferToMp3Blob(comb, 128);
      triggerDownload(mp3Blob, "lingoboost_study_playlist_" + slice.length + "_words.mp3");
      btn.textContent = "✓ Downloaded!";
      showToast("Playlist MP3 downloaded successfully!", "success");
      setTimeout(() => { btn.textContent = "⬇ Playlist MP3"; }, 2500);
    }
  } catch(e) {
    console.error(e);
    btn.textContent = "Error!";
    showToast("Playlist MP3 export failed.", "error");
    setTimeout(() => { btn.textContent = "⬇ Playlist MP3"; }, 2500);
  }
}

// SMART AUTO-DECODE: Solves Arabic Windows-1256 ANSI
function autoDecodeBuffer(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(bytes.subarray(3));
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch (err) {
    try {
      return new TextDecoder('windows-1256').decode(bytes);
    } catch (e2) {
      return new TextDecoder('utf-8').decode(bytes);
    }
  }
}

function cleanField(str) {
  if (!str) return '';
  let s = str.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s.replace(/""/g, '"').trim();
}

function parseAndImportText(text) {
  const lines = text.split(/\r?\n/);
  let count = 0;
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    let parts = [];
    if (line.includes('\t')) parts = line.split('\t');
    else if (line.includes(' - ')) parts = line.split(' - ');
    else if (line.includes(' – ')) parts = line.split(' – ');
    else if (line.includes(' — ')) parts = line.split(' — ');
    else if (line.includes(' : ')) parts = line.split(' : ');
    else if (line.includes(':')) parts = line.split(':');
    else if (line.includes('=')) parts = line.split('=');
    else if (line.includes(';')) parts = line.split(';');
    else if (line.includes(',')) parts = line.split(',');
    else if (line.includes('-')) parts = line.split('-');

    if (parts.length >= 2) {
      const orig = cleanField(parts[0]);
      const trans = cleanField(parts.slice(1).join(' '));
      if (orig && trans) {
        words.push({ orig, trans, sl: sourceLang.value, tl: targetLang.value });
        count++;
      }
    }
  }

  words = words.slice(0, 10000);
  chrome.storage.local.set({ lingoWords: words });
  renderDeck();
  bulkPasteText.value = '';
  showToast("Successfully imported " + count + " words! Total: " + words.length, "success");
  tabDeck.click();
}

// Render Vocab Deck with Individual Delete Button (🗑)
function renderDeck() {
  deckCountBadge.textContent = words.length;
  deckListContainer.innerHTML = '';
  const query = (deckSearch.value || '').toLowerCase().trim();
  const filtered = query
    ? words.filter(w => w.orig.toLowerCase().includes(query) || w.trans.toLowerCase().includes(query))
    : words;

  filtered.forEach((w, idx) => {
    const actualIndex = words.indexOf(w);
    const row = document.createElement('div');
    row.className = 'word-row';
    row.innerHTML = `
      <div style="flex: 1; min-width: 0; padding-right: 8px;">
        <strong style="display: block; font-size: 13px;">${w.orig}</strong>
        <div style="font-size: 12px; color: #34d399; font-weight: 600;">${w.trans}</div>
      </div>
      <div style="display: flex; gap: 4px; align-items: center;">
        <button class="btn btn-secondary play-btn" style="padding: 4px 7px; font-size: 10px;" title="Listen Audio">🔊 2x/1x</button>
        <button class="btn btn-success mp3-btn" style="padding: 4px 7px; font-size: 10px;" title="Download MP3">⬇ MP3</button>
        <button class="btn btn-danger delete-btn" style="padding: 4px 7px; font-size: 10px;" title="Delete Word">🗑</button>
      </div>
    `;
    
    row.querySelector('.play-btn').addEventListener('click', () => {
      speakWordPair(w.orig, w.trans, w.sl, w.tl);
    });
    
    row.querySelector('.mp3-btn').addEventListener('click', function() {
      downloadMp3(w.orig, w.trans, w.sl, w.tl, this);
    });

    row.querySelector('.delete-btn').addEventListener('click', () => {
      if (actualIndex > -1) {
        words.splice(actualIndex, 1);
        chrome.storage.local.set({ lingoWords: words }, () => {
          renderDeck();
          showToast("Word removed from deck.", "info");
        });
      }
    });

    deckListContainer.appendChild(row);
  });
}

// Clear All Deck Event
clearAllDeckBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear all words from the deck?")) {
    words = [];
    chrome.storage.local.set({ lingoWords: words }, () => {
      renderDeck();
      showToast("Vocabulary deck cleared successfully.", "success");
    });
  }
});

// Events
translateBtn.addEventListener('click', doTranslate);
sourceText.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) doTranslate();
});

listenBtn.addEventListener('click', () => {
  const orig = sourceText.value.trim();
  const trans = resultBox.textContent.trim();
  if (orig && trans && !trans.includes('will appear')) {
    speakWordPair(orig, trans, sourceLang.value === 'auto' ? 'en' : sourceLang.value, targetLang.value);
  }
});

downloadSingleMp3.addEventListener('click', () => {
  const orig = sourceText.value.trim();
  const trans = resultBox.textContent.trim();
  if (orig && trans && !trans.includes('will appear')) {
    downloadMp3(orig, trans, sourceLang.value === 'auto' ? 'en' : sourceLang.value, targetLang.value, downloadSingleMp3);
  }
});

downloadBatchMp3.addEventListener('click', downloadPlaylistMp3);

swapBtn.addEventListener('click', () => {
  if (sourceLang.value === 'auto') return;
  const temp = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = temp;
});

addToListBtn.addEventListener('click', () => {
  const orig = sourceText.value.trim();
  const trans = resultBox.textContent.trim();
  if (!orig || !trans || trans.includes('will appear')) return;
  words.unshift({ orig, trans, sl: sourceLang.value === 'auto' ? 'en' : sourceLang.value, tl: targetLang.value });
  chrome.storage.local.set({ lingoWords: words });
  renderDeck();
  showToast("Word saved to vocabulary deck!", "success");
});

uploadFileBtn.addEventListener('click', () => fileUploadInput.click());
fileUploadInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const text = autoDecodeBuffer(arrayBuffer);
    parseAndImportText(text);
  } catch(err) {
    console.error(err);
    showToast("Error reading file.", "error");
  }
});

submitImportBtn.addEventListener('click', () => {
  const text = bulkPasteText.value.trim();
  if (!text) return;
  parseAndImportText(text);
});

deckSearch.addEventListener('input', renderDeck);

let playingAll = false;
playAllBtn.addEventListener('click', () => {
  if (playingAll) {
    window.speechSynthesis.cancel();
    playingAll = false;
    playAllBtn.textContent = "▶ Play All";
    return;
  }
  if (words.length === 0) return;
  playingAll = true;
  playAllBtn.textContent = "⏹ Stop";
  let idx = 0;
  function next() {
    if (!playingAll || idx >= words.length) {
      playingAll = false;
      playAllBtn.textContent = "▶ Play All";
      return;
    }
    const item = words[idx++];
    speakWordPair(item.orig, item.trans, item.sl, item.tl, () => {
      setTimeout(next, 750);
    });
  }
  next();
});

// Tabs
tabTranslate.addEventListener('click', () => {
  tabTranslate.classList.add('active');
  tabDeck.classList.remove('active');
  tabImport.classList.remove('active');
  viewTranslate.style.display = 'block';
  viewDeck.style.display = 'none';
  viewImport.style.display = 'none';
});

tabDeck.addEventListener('click', () => {
  tabDeck.classList.add('active');
  tabTranslate.classList.remove('active');
  tabImport.classList.remove('active');
  viewTranslate.style.display = 'none';
  viewDeck.style.display = 'block';
  viewImport.style.display = 'none';
  renderDeck();
});

tabImport.addEventListener('click', () => {
  tabImport.classList.add('active');
  tabTranslate.classList.remove('active');
  tabDeck.classList.remove('active');
  viewTranslate.style.display = 'none';
  viewDeck.style.display = 'none';
  viewImport.style.display = 'block';
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});