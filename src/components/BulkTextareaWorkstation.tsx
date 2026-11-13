import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Trash2,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { VocabularyItem } from '../types.ts';
import {
  parseUniversalLine,
  parseRawTextAsync,
  validateFileSecurity,
  SAFE_VOCAB_FILE_ACCEPT,
} from '../utils/fileImporter.ts';
import {
  getLanguageByCode,
  resolveSmartFieldLanguage,
  detectBatchDominantLanguages,
} from '../data/languages.ts';

interface BulkTextareaWorkstationProps {
  items: VocabularyItem[];
  onSetItems: (items: VocabularyItem[]) => void;
  onImportFileRequest?: (file: File) => void;
  onOpenBulkImport?: () => void;
  sourceLangName: string;
  targetLangName: string;
  sourceLangCode?: string;
  targetLangCode?: string;
  sourceVoice?: string;
  targetVoice?: string;
  theme?: 'dark' | 'light';
}

const DEMO_SAMPLE_WORDS = `plugging in\tconnecting
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

const LARGE_LIST_THRESHOLD = 400;

export const BulkTextareaWorkstation: React.FC<BulkTextareaWorkstationProps> = ({
  items,
  onSetItems,
  onImportFileRequest,
  onOpenBulkImport,
  sourceLangName,
  targetLangName,
  sourceLangCode = 'en-US',
  targetLangCode = 'es-ES',
  sourceVoice,
  targetVoice,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const isLargeList = items.length > LARGE_LIST_THRESHOLD;

  // Local raw text state only populated for <= 400 items so 9,000+ words never hang mobile DOM/textarea
  const [rawText, setRawText] = useState(() => {
    if (items.length > LARGE_LIST_THRESHOLD) return '';
    return items
      .map((it) => {
        const src = it.sourceText || it.english || '';
        const tgt = it.targetText || it.arabic || '';
        return tgt ? `${src}\t${tgt}` : src;
      })
      .join('\n');
  });

  const [copied, setCopied] = useState(false);
  const [isPastingLarge, setIsPastingLarge] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isTypingRef = useRef(false);

  // Sync rawText cleanly when small/medium items change externally
  useEffect(() => {
    if (isTypingRef.current) return;

    if (items.length > LARGE_LIST_THRESHOLD) {
      if (rawText !== '') setRawText('');
      return;
    }

    const serialized = items
      .map((it) => {
        const src = it.sourceText || it.english || '';
        const tgt = it.targetText || it.arabic || '';
        return tgt ? `${src}\t${tgt}` : src;
      })
      .join('\n');

    const currentParsedSerialized = rawText
      .split('\n')
      .map((line) => parseUniversalLine(line))
      .filter((p): p is { sourceText: string; targetText: string } => Boolean(p && p.sourceText))
      .map((p) => (p.targetText ? `${p.sourceText}\t${p.targetText}` : p.sourceText))
      .join('\n');

    if (serialized !== currentParsedSerialized) {
      setRawText(serialized);
    }
  }, [items]);

  // Handle live textarea change with async protection and smart language detection
  const handleTextChange = async (newText: string) => {
    const lineCount = newText.split('\n').length;
    const prefSrcObj = getLanguageByCode(sourceLangCode);
    const prefTgtObj = getLanguageByCode(targetLangCode);

    const buildSmartItem = (
      id: string,
      sourceText: string,
      targetText: string,
      dominantSource: ReturnType<typeof getLanguageByCode>,
      dominantTarget: ReturnType<typeof getLanguageByCode>,
      hasSourceLetters: boolean,
      hasTargetLetters: boolean,
      createdAt: number
    ): VocabularyItem => {
      const detectedSrc = resolveSmartFieldLanguage(
        sourceText,
        prefSrcObj,
        prefTgtObj,
        dominantSource,
        targetText,
        hasSourceLetters
      );
      const detectedTgt = targetText.trim()
        ? resolveSmartFieldLanguage(
            targetText,
            prefTgtObj,
            prefSrcObj,
            dominantTarget,
            sourceText,
            hasTargetLetters
          )
        : prefTgtObj;

      const resolvedSrcVoice =
        detectedSrc.code === prefSrcObj.code && sourceVoice
          ? sourceVoice
          : detectedSrc.code === prefTgtObj.code && targetVoice
          ? targetVoice
          : detectedSrc.defaultVoice;
      const resolvedTgtVoice =
        detectedTgt.code === prefTgtObj.code && targetVoice
          ? targetVoice
          : detectedTgt.code === prefSrcObj.code && sourceVoice
          ? sourceVoice
          : detectedTgt.defaultVoice;

      return {
        id,
        sourceText,
        targetText,
        english: sourceText,
        arabic: targetText,
        mastered: false,
        sourceLang: detectedSrc.code,
        targetLang: detectedTgt.code,
        sourceVoice: resolvedSrcVoice,
        targetVoice: resolvedTgtVoice,
        createdAt,
      };
    };

    if (lineCount > LARGE_LIST_THRESHOLD) {
      isTypingRef.current = true;
      setIsPastingLarge(true);
      try {
        const parsed = await parseRawTextAsync(newText);
        const { dominantSource, dominantTarget, hasSourceLetters, hasTargetLetters } =
          detectBatchDominantLanguages(parsed, sourceLangCode, targetLangCode);
        const now = Date.now();
        const newItems: VocabularyItem[] = parsed.map((p, idx) =>
          buildSmartItem(
            'w-' + now + '-' + idx,
            p.sourceText,
            p.targetText || '',
            dominantSource,
            dominantTarget,
            hasSourceLetters,
            hasTargetLetters,
            now + idx
          )
        );
        setRawText('');
        onSetItems(newItems);
      } finally {
        setIsPastingLarge(false);
        setTimeout(() => {
          isTypingRef.current = false;
        }, 300);
      }
      return;
    }

    isTypingRef.current = true;
    setRawText(newText);
    const lines = newText.split('\n');

    const existingBuckets = new Map<string, VocabularyItem[]>();
    items.forEach((it) => {
      const s = (it.sourceText || it.english || '').trim();
      const t = (it.targetText || it.arabic || '').trim();
      const key = `${s}||${t}`;
      const bucket = existingBuckets.get(key) || [];
      bucket.push(it);
      existingBuckets.set(key, bucket);
    });

    const parsedEntries = lines
      .map((line) => parseUniversalLine(line))
      .filter((p): p is { sourceText: string; targetText: string } => Boolean(p && p.sourceText));

    const { dominantSource, dominantTarget, hasSourceLetters, hasTargetLetters } =
      detectBatchDominantLanguages(parsedEntries, sourceLangCode, targetLangCode);

    const newItems: VocabularyItem[] = [];
    const now = Date.now();

    parsedEntries.forEach((parsed, idx) => {
      const key = `${parsed.sourceText.trim()}||${(parsed.targetText || '').trim()}`;
      const bucket = existingBuckets.get(key);
      const existingMatch = bucket && bucket.length > 0 ? bucket.shift() : undefined;

      if (existingMatch) {
        newItems.push(existingMatch);
      } else {
        newItems.push(
          buildSmartItem(
            'w-' + now + '-' + idx + '-' + Math.random().toString(36).substring(2, 6),
            parsed.sourceText,
            parsed.targetText || '',
            dominantSource,
            dominantTarget,
            hasSourceLetters,
            hasTargetLetters,
            now + idx
          )
        );
      }
    });

    onSetItems(newItems);
    setTimeout(() => {
      isTypingRef.current = false;
    }, 300);
  };

  // Universal file selection -> validate security first (block images & unsafe files), then open Confirmation Modal
  const handleFileCandidate = (file: File) => {
    setSecurityError(null);
    try {
      validateFileSecurity(file);
    } catch (secErr: any) {
      setSecurityError(
        secErr?.message || 'Blocked: Only safe text and vocabulary document files are allowed (images & unsafe files blocked).'
      );
      return;
    }

    if (onImportFileRequest) {
      onImportFileRequest(file);
    } else if (onOpenBulkImport) {
      onOpenBulkImport();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileCandidate(file);
    if (e.target) e.target.value = '';
  };

  const handleWorkstationDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      handleFileCandidate(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = () => {
    handleTextChange(DEMO_SAMPLE_WORDS);
  };

  const handleClearAll = () => {
    setRawText('');
    onSetItems([]);
  };

  const handleCopyAll = () => {
    if (items.length === 0) return;
    const textToCopy =
      rawText.trim() ||
      items
        .map((it) => {
          const s = it.sourceText || it.english || '';
          const t = it.targetText || it.arabic || '';
          return t ? `${s}\t${t}` : s;
        })
        .join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalParts = Math.max(1, Math.ceil(items.length / 100));

  return (
    <div
      onDragOver={(e) => {
        if (e.dataTransfer?.types?.includes('Files')) e.preventDefault();
      }}
      onDrop={handleWorkstationDrop}
      className={`border rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-md text-left space-y-4 ${
        isLight
          ? 'bg-white border-slate-200'
          : 'bg-slate-900/90 border-slate-800'
      }`}
    >
      {/* Top Header & Action Buttons */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full shadow-md shrink-0 ${
                isLight ? 'bg-[#1a73e8] shadow-blue-500/30' : 'bg-amber-400 shadow-amber-400/30'
              }`}
            ></span>
            <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Bulk Word &amp; Text Input ({sourceLangName} ➔ {targetLangName})
            </h3>
          </div>
          <p className={`text-xs mt-1 flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
            <span>
              Text &amp; Safe Documents Only (TXT, CSV, Word, Excel, PDF) up to 10,000+ words &bull; Images &amp; unsafe files blocked.
            </span>
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Hardened File Input (Strictly allows Text & Safe Vocabulary Documents only; blocks Images/Executables) */}
          <input
            id="workstation-file-input"
            type="file"
            ref={fileInputRef}
            accept={SAFE_VOCAB_FILE_ACCEPT}
            onChange={handleFileUpload}
            className="sr-only"
          />

          {/* Native Label Trigger for Upload Button (Reliable tap gesture across iOS Safari, Android, Tablet & Desktop) */}
          <label
            htmlFor="workstation-file-input"
            className="keep-amber-btn px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer select-none"
            title="Import safe TXT, CSV, TSV, JSON, Word (.docx/.doc/.rtf), Excel (.xlsx/.xls), or PDF (Images blocked)"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Import Text / Document File</span>
          </label>

          {/* Load Sample Button */}
          <button
            type="button"
            onClick={handleLoadSample}
            className={`px-3 py-2 border rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Fill with high-frequency sample vocabulary"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-amber-400'}`} />
            <span>Demo Sample</span>
          </button>

          {/* Copy All Button */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleCopyAll}
              className={`px-3 py-2 border rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isLight
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Copy current list to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}

          {/* Clear Button */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                isLight
                  ? 'bg-[#1a73e8] hover:bg-red-600 text-white border-[#1a73e8] hover:border-red-600'
                  : 'text-slate-400 hover:text-red-400 hover:bg-slate-800 border-transparent'
              }`}
              title="Clear entire vocabulary input"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Security / Format Block Alert */}
      {securityError && (
        <div
          role="alert"
          className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
            isLight
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-red-500/10 border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-semibold">{securityError}</span>
          </div>
          <button
            type="button"
            onClick={() => setSecurityError(null)}
            className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-red-500/20 hover:bg-red-500/30 shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Fast View for Large Lists (> 400 words) vs Live Textarea */}
      {isPastingLarge ? (
        <div
          className={`border rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-xs font-semibold ${
            isLight ? 'bg-slate-50 border-slate-200 text-[#1967d2]' : 'bg-slate-950 border-slate-800 text-amber-300'
          }`}
        >
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Processing large vocabulary list smoothly...</span>
        </div>
      ) : isLargeList ? (
        <div
          className={`border rounded-2xl p-4 sm:p-5 space-y-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className={`w-5 h-5 shrink-0 ${isLight ? 'text-[#1a73e8]' : 'text-amber-400'}`} />
              <div>
                <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Large Vocabulary List Active ({items.length.toLocaleString()} Words)
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Optimized mobile performance mode enabled. Browse, search, and listen using the paginated Word List above.
                </p>
              </div>
            </div>

            {onOpenBulkImport && (
              <button
                type="button"
                onClick={onOpenBulkImport}
                className="keep-amber-btn px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Import More / Replace File</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <textarea
            value={rawText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={`Paste your words here (one word per line, up to 10,000+ words):\nplugging in\tconnecting\nby far\tby a large margin\nvast\thuge\naesthetically\taesthetically pleasing`}
            rows={8}
            className={`w-full border rounded-2xl p-4 text-sm font-mono outline-none transition-all leading-relaxed custom-scrollbar shadow-inner ${
              isLight
                ? 'bg-slate-50 border-slate-300 focus:border-[#1a73e8] text-slate-900 placeholder:text-slate-400'
                : 'bg-slate-950 border-slate-800 focus:border-amber-400/80 text-slate-100 placeholder-slate-600'
            }`}
            spellCheck={false}
          />

          <div
            className={`hidden sm:block absolute right-3.5 bottom-3.5 pointer-events-none text-[11px] px-2 py-0.5 rounded-md border ${
              isLight
                ? 'text-slate-600 bg-white/95 border-slate-200'
                : 'text-slate-500 bg-slate-900/80 border-slate-800'
            }`}
          >
            Format:{' '}
            <code className={`font-mono ${isLight ? 'text-[#1967d2] font-semibold' : 'text-amber-400'}`}>
              word [tab/comma/space] translation
            </code>
          </div>
        </div>
      )}

      {/* Summary Status Bar */}
      <div
        className={`border rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-950/80 border-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#1a73e8]' : 'text-emerald-400'}`} />
          <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
            Total Recognized Words:{' '}
            <strong className={`font-mono text-sm ml-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {items.length.toLocaleString()} words
            </strong>
          </span>
        </div>

        <div className={`text-right text-[11px] font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#1a73e8]' : 'bg-amber-400'}`}></span>
          <span>
            Auto-partitioned for fast MP3 download into{' '}
            <strong className={`font-mono ${isLight ? 'text-[#1967d2]' : 'text-amber-300'}`}>({totalParts})</strong>{' '}
            parts (100 words per file)
          </span>
        </div>
      </div>
    </div>
  );
};
