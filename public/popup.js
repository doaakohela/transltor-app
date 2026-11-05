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

    const SAMPLE_DATA = `plugging in\tconnecting
plugging\tblocking
by far\tby a large margin
vast\thuge
aesthetically\taesthetically pleasing
widens\tbroadens
conceived\timagined
conceived\tformulated
thrill\texcitement
perseverance\tcontinued effort
resilience\trecovery ability
opportunity\tfavorable circumstances
profound\tdeep and meaningful
versatile\tadaptable to many uses
captivating\textremely attractive`;

    // Detect API Base
    function getApiBase() {
      const custom = (apiServerInput.value || '').trim();
      if (custom) return custom.replace(/\/$/, '');
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
      const parts = trimmed.split(/[\t,:]|\s{2,}|\s+-\s+/);
      if (parts.length >= 2) {
        return {
          sourceText: parts[0].trim(),
          targetText: parts.slice(1).join(' ').trim()
        };
      }
      // Space between Latin and Arabic/Non-Latin
      const latinMatch = trimmed.match(/^([a-zA-Z0-9\s'-]+)\s+([\u0600-\u06FF\u4e00-\u9fa5\u3040-\u30ff].*)$/);
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
      const lines = text.split('\n');
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
      partsCountBadge.textContent = `(${partsCount} MP3 parts)`;

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
        opt.textContent = `Part ${i + 1} (Words ${start} - ${end || 100})`;
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

      tableBody.innerHTML = filtered.map((w, idx) => `
        <tr>
          <td style="color:var(--muted);font-family:monospace;">${idx + 1}</td>
          <td style="font-weight:700;color:#fff;">${escapeHtml(w.sourceText)}</td>
          <td>
            <input type="text" class="inline-edit" value="${escapeHtml(w.targetText)}" data-id="${w.id}" placeholder="Add translation..." />
          </td>
          <td style="text-align:right;">
            <div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;">
              <button class="btn-speak-row" data-id="${w.id}" title="Pronounce 2x source + 1x target">
                🔊 Listen
              </button>
              <button class="btn-download-row" data-id="${w.id}" title="Download single word MP3">
                ⬇
              </button>
            </div>
          </td>
        </tr>
      `).join('');

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
            bulkTextarea.value = words.map(w => `${w.sourceText}\t${w.targetText}`).join('\n');
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
        const res = await fetch(`${apiBase}/api/tts/full-word`, {
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
      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
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
        const res = await fetch(`${apiBase}/api/tts/full-word`, {
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
            triggerDownload(data.audioBase64, data.filename || `${item.sourceText}_repetition.mp3`);
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
        const res = await fetch(`${apiBase}/api/tts/batch-download`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: partWords,
            sourceVoice: sourceVoiceSelect.value,
            targetVoice: targetVoiceSelect.value,
            sourceRepeats: 2,
            targetRepeats: 1,
            filename: `part_${partIdx + 1}_words_${start + 1}_to_${end}.mp3`
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            triggerDownload(data.audioBase64, data.filename || `part_${partIdx + 1}_words.mp3`);
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
        const res = await fetch(`${apiBase}/api/tts/batch-download`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: words,
            sourceVoice: sourceVoiceSelect.value,
            targetVoice: targetVoiceSelect.value,
            sourceRepeats: 2,
            targetRepeats: 1,
            filename: `all_${words.length}_words_master.mp3`
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            triggerDownload(data.audioBase64, data.filename || `all_${words.length}_words_master.mp3`);
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
      a.href = `data:audio/mp3;base64,${base64}`;
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
      gtCharCount.textContent = `${text.length} chars`;
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
        const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
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
        const res = await fetch(`${apiBase}/api/translate`, {
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
      const line = `${src}\t${tgt}`;
      bulkTextarea.value = current ? `${line}\n${current}` : line;
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