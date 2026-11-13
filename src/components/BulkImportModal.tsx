import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  UploadCloud,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Loader2,
  Globe,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';
import { VocabularyItem } from '../types.ts';
import {
  importFileUniversal,
  parseRawTextAsync,
  parseUniversalLine,
  validateFileSecurity,
  SAFE_VOCAB_FILE_ACCEPT,
  ENCODING_CHOICES,
  ImportedFileResult,
  ParsedWordEntry,
} from '../utils/fileImporter.ts';
import { detectBatchDominantLanguages } from '../data/languages.ts';

export { parseUniversalLine };

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: Omit<VocabularyItem, 'id' | 'createdAt'>[], replaceExisting: boolean) => void;
  sourceLangName?: string;
  targetLangName?: string;
  preferredLangs?: string[];
  initialFile?: File | null;
  onClearInitialFile?: () => void;
  theme?: 'dark' | 'light';
}

const DEFAULT_SAMPLE_TEXT = `depression\tdeep sadness and despondency
perseverance\tcontinued effort despite difficulties
awesome\textremely impressive or daunting
opportunity\ta set of circumstances making something possible
challenge\ta demanding task or situation
reliable\tconsistently good in quality or performance
take your time\tdo not hurry, take as long as needed
no problem\tno difficulty or trouble at all`;

const SYNC_TEXT_LINE_LIMIT = 400;

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  sourceLangName = 'Source',
  targetLangName = 'Target',
  preferredLangs = [],
  initialFile = null,
  onClearInitialFile,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [text, setText] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);

  // Attached file & universal parsing state
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [manualEncoding, setManualEncoding] = useState<string>('auto');
  const [fileResult, setFileResult] = useState<ImportedFileResult | null>(null);
  const [largePasteItems, setLargePasteItems] = useState<ParsedWordEntry[] | null>(null);

  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [parseStage, setParseStage] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [isConfirmingImport, setIsConfirmingImport] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const parseRunIdRef = useRef(0);

  // Process a File asynchronously across safe Text & Document formats (Images, executables, HTML & macros blocked)
  const processFile = async (file: File, encodingOverride: string) => {
    const runId = ++parseRunIdRef.current;
    setFileResult(null);
    setLargePasteItems(null);
    setParseError(null);

    try {
      validateFileSecurity(file);
    } catch (secErr: any) {
      setActiveFile(null);
      setIsParsing(false);
      setParseProgress(0);
      setParseStage('');
      setParseError(
        secErr?.message || 'Blocked: Only safe text and vocabulary document files are allowed (images & unsafe files blocked).'
      );
      return;
    }

    setActiveFile(file);
    setIsParsing(true);
    setParseProgress(5);
    setParseStage(`Scanning & opening ${file.name}...`);

    try {
      const result = await importFileUniversal(file, {
        manualEncoding: encodingOverride,
        preferredLangs,
        onProgress: (pct, stage) => {
          if (parseRunIdRef.current === runId) {
            setParseProgress(pct);
            setParseStage(stage);
          }
        },
      });

      if (parseRunIdRef.current !== runId) return;

      setFileResult(result);
      // Only populate <textarea> for small files so mobile never hangs on 9,000+ DOM lines
      if (result.items.length <= SYNC_TEXT_LINE_LIMIT) {
        const serialized = result.items
          .map((it) => (it.targetText ? `${it.sourceText}\t${it.targetText}` : it.sourceText))
          .join('\n');
        setText(serialized);
      } else {
        setText('');
      }

      if (result.items.length === 0) {
        setParseError(
          'No valid words could be extracted from this file. If this is a text/CSV file in an older encoding, try selecting a different encoding below.'
        );
      }
    } catch (err: any) {
      if (parseRunIdRef.current !== runId) return;
      console.error('Universal file import error:', err);
      setParseError(
        err?.message
          ? `Could not read file: ${err.message}`
          : 'Could not read this file. Please ensure it is not password-protected or corrupted.'
      );
    } finally {
      if (parseRunIdRef.current === runId) {
        setIsParsing(false);
        setParseProgress(100);
        setParseStage('');
      }
    }
  };

  // Trigger parsing automatically when modal is opened with an initial file (e.g. from Bulk Workstation)
  useEffect(() => {
    if (isOpen && initialFile) {
      setManualEncoding('auto');
      processFile(initialFile, 'auto');
      onClearInitialFile?.();
    }
  }, [isOpen, initialFile]);

  // Synchronous memoized parsing only for small manual edits (< 400 lines)
  const smallManualParsed = useMemo(() => {
    if (fileResult || largePasteItems || !text.trim()) return [];
    const lines = text.split('\n');
    if (lines.length > SYNC_TEXT_LINE_LIMIT) return [];
    const out: ParsedWordEntry[] = [];
    for (const line of lines) {
      const res = parseUniversalLine(line);
      if (res && res.sourceText) out.push(res);
    }
    return out;
  }, [text, fileResult, largePasteItems]);

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setManualEncoding('auto');
    processFile(file, 'auto');
    if (e.target) e.target.value = '';
  };

  const handleModalDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      const droppedFile = e.dataTransfer.files[0];
      setManualEncoding('auto');
      processFile(droppedFile, 'auto');
    }
  };

  const handleEncodingChange = (nextEnc: string) => {
    setManualEncoding(nextEnc);
    if (activeFile) {
      processFile(activeFile, nextEnc);
    }
  };

  const handleManualTextChange = async (val: string) => {
    // Clear attached file metadata if user edits manually
    if (fileResult) setFileResult(null);
    if (activeFile) setActiveFile(null);
    setParseError(null);

    const estimatedLines = val.split('\n').length;
    if (estimatedLines > SYNC_TEXT_LINE_LIMIT) {
      const runId = ++parseRunIdRef.current;
      setText('');
      setIsParsing(true);
      setParseProgress(15);
      setParseStage(`Processing ${estimatedLines.toLocaleString()} pasted lines...`);
      try {
        const parsed = await parseRawTextAsync(val, (pct, st) => {
          if (parseRunIdRef.current === runId) {
            setParseProgress(pct);
            setParseStage(st);
          }
        });
        if (parseRunIdRef.current === runId) {
          setLargePasteItems(parsed);
        }
      } finally {
        if (parseRunIdRef.current === runId) {
          setIsParsing(false);
          setParseProgress(100);
          setParseStage('');
        }
      }
      return;
    }

    setLargePasteItems(null);
    setText(val);
  };

  const handleClearSelection = () => {
    parseRunIdRef.current += 1;
    setActiveFile(null);
    setFileResult(null);
    setLargePasteItems(null);
    setText('');
    setParseError(null);
    setIsParsing(false);
    setManualEncoding('auto');
  };

  const loadSample = () => {
    handleClearSelection();
    setText(DEFAULT_SAMPLE_TEXT);
  };

  const effectiveItems: ParsedWordEntry[] = fileResult
    ? fileResult.items
    : largePasteItems
    ? largePasteItems
    : smallManualParsed;

  const detectedPairLabel = useMemo(() => {
    if (effectiveItems.length === 0) return `${sourceLangName} ➔ ${targetLangName}`;
    const prefSrc = preferredLangs[0] || 'en-US';
    const prefTgt = preferredLangs[1] || 'es-ES';
    const { dominantSource, dominantTarget } = detectBatchDominantLanguages(
      effectiveItems,
      prefSrc,
      prefTgt
    );
    const hasTranslations = effectiveItems.slice(0, 50).some((it) => Boolean(it.targetText?.trim()));
    return hasTranslations
      ? `Detected: ${dominantSource.name} ➔ ${dominantTarget.name}`
      : `Detected Language: ${dominantSource.name}`;
  }, [effectiveItems, preferredLangs, sourceLangName, targetLangName]);

  if (!isOpen) return null;

  const handleConfirmImport = () => {
    if (effectiveItems.length === 0 || isParsing || isConfirmingImport) return;
    setIsConfirmingImport(true);

    // Yield one frame so mobile shows "Importing..." feedback cleanly before closing
    setTimeout(() => {
      try {
        const itemsToImport = effectiveItems.map((item) => ({
          sourceText: item.sourceText,
          targetText: item.targetText,
          english: item.sourceText,
          arabic: item.targetText,
          mastered: false,
        }));

        onImport(itemsToImport, replaceExisting);
        handleClearSelection();
        onClose();
      } finally {
        setIsConfirmingImport(false);
      }
    }, 20);
  };

  const previewSample = effectiveItems.slice(0, 6);
  const previewTail = effectiveItems.length > 8 ? effectiveItems.slice(-2) : [];
  const isLargeFileSummaryMode = Boolean(
    (fileResult && fileResult.items.length > SYNC_TEXT_LINE_LIMIT) || largePasteItems
  );

  const fileSizeLabel = activeFile
    ? activeFile.size >= 1024 * 1024
      ? `${(activeFile.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.max(1, Math.round(activeFile.size / 1024))} KB`
    : '';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-left"
      role="dialog"
      aria-modal="true"
      aria-label="Bulk Vocabulary Import"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`border w-full sm:max-w-2xl max-h-[92dvh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* Sticky Header */}
        <div
          className={`shrink-0 flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b gap-2 ${
            isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${
                isLight ? 'bg-[#1a73e8] text-white' : 'bg-indigo-600/20 text-indigo-400'
              }`}
            >
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className={`text-sm sm:text-base font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Universal Vocabulary Import (10,000+ Words)
              </h3>
              <p className={`text-[11px] sm:text-xs truncate ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Text &amp; Vocabulary Documents Only (TXT, CSV, Word, Excel, PDF) &bull; Images &amp; Unsafe Files Blocked
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Middle Body */}
        <div
          onDragOver={(e) => {
            if (e.dataTransfer?.types?.includes('Files')) e.preventDefault();
          }}
          onDrop={handleModalDrop}
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3.5 sm:space-y-4"
        >
          {/* Hardened File Input (Strictly restricts picker to Text & Safe Document formats — Images blocked) */}
          <input
            id="bulk-modal-file-input"
            ref={fileInputRef}
            type="file"
            accept={SAFE_VOCAB_FILE_ACCEPT}
            onChange={handleFileAttach}
            className="sr-only"
          />

          {/* Device File Attachment Box + Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="bulk-modal-file-input"
                className="keep-amber-btn w-full sm:w-auto justify-center px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-400/20 border border-amber-500/50 transition-all flex items-center gap-2 cursor-pointer select-none"
                title="Choose TXT, CSV, TSV, JSON, Word (.docx/.doc/.rtf), Excel (.xlsx/.xls), or PDF (Images blocked)"
              >
                <Upload className="w-4 h-4 stroke-[2.5] text-slate-950 shrink-0" />
                <span>Choose Text / Document File</span>
              </label>

              <button
                type="button"
                onClick={loadSample}
                className={`px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors border ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Demo Sample</span>
              </button>
            </div>

            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${
                effectiveItems.length > 0
                  ? 'bg-red-600 border-red-700 text-[#ffffff]'
                  : isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-600'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {detectedPairLabel}
            </span>
          </div>

          {/* Supported Formats & Security Shield Strip */}
          <div
            className={`px-3 py-2 rounded-xl border text-[11px] flex flex-wrap items-center gap-x-2.5 gap-y-1 ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <span className="font-semibold flex items-center gap-1">
              <ShieldCheck className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
              Protected Import:
            </span>
            <span>TXT / CSV / TSV / JSON / SRT</span>
            <span>&bull;</span>
            <span>Word (.docx, .doc, .rtf)</span>
            <span>&bull;</span>
            <span>Excel (.xlsx, .xls, .ods)</span>
            <span>&bull;</span>
            <span>PDF</span>
            <span className={`font-semibold ${isLight ? 'text-red-600' : 'text-red-400'}`}>
              (No Images / No Macros / No Scripts)
            </span>
          </div>

          {/* Async Progress Bar for Large Files (e.g. 9,000+ words on Mobile) */}
          {isParsing && (
            <div
              className={`p-3.5 rounded-2xl border space-y-2 ${
                isLight
                  ? 'bg-[#e8f0fe] border-[#aecbfa] text-[#1967d2]'
                  : 'bg-indigo-950/50 border-indigo-700/60 text-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold gap-2">
                <span className="flex items-center gap-2 truncate">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span className="truncate">{parseStage || 'Reading & decoding file...'}</span>
                </span>
                <span className="font-mono shrink-0">{parseProgress}%</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-blue-200' : 'bg-slate-800'}`}>
                <div
                  className={`h-full transition-all duration-150 ${isLight ? 'bg-[#1a73e8]' : 'bg-amber-400'}`}
                  style={{ width: `${Math.max(5, parseProgress)}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Banner */}
          {parseError && (
            <div className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Attached File Info + Encoding Selector */}
          {(activeFile || largePasteItems) && !isParsing && (
            <div
              className={`p-3 rounded-2xl border space-y-2.5 text-xs ${
                isLight
                  ? 'bg-[#e8f0fe]/70 border-[#aecbfa] text-slate-800'
                  : 'bg-indigo-950/40 border-indigo-700/50 text-indigo-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#1a73e8]' : 'text-amber-400'}`} />
                  <div className="min-w-0">
                    <div className="font-bold truncate">
                      {activeFile ? activeFile.name : 'Large Pasted Word List'}
                    </div>
                    <div className={`text-[11px] flex flex-wrap items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {fileResult && <span>{fileResult.formatLabel}</span>}
                      {fileSizeLabel && (
                        <>
                          <span>&bull;</span>
                          <span>{fileSizeLabel}</span>
                        </>
                      )}
                      {fileResult?.detectedEncoding && (
                        <>
                          <span>&bull;</span>
                          <span className="font-mono">{fileResult.detectedEncoding}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 text-[#1967d2] border border-[#aecbfa]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  Clear
                </button>
              </div>

              {/* Encoding Override Dropdown for Text / CSV / HTML / XML / JSON files across ALL world languages */}
              {fileResult?.supportsEncodingOverride && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-500/20">
                  <label
                    htmlFor="encoding-select"
                    className={`flex items-center gap-1.5 text-[11px] font-semibold shrink-0 ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Character Encoding:</span>
                  </label>
                  <select
                    id="encoding-select"
                    value={manualEncoding}
                    onChange={(e) => handleEncodingChange(e.target.value)}
                    className={`w-full sm:w-72 border rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-[#1a73e8]'
                        : 'bg-slate-950 border-slate-700 text-slate-100 focus:border-amber-400'
                    }`}
                  >
                    {ENCODING_CHOICES.map((enc) => (
                      <option key={enc.id} value={enc.id}>
                        {enc.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Fast Summary Card for Large Files (> 400 words, e.g. 9,000 words) OR Editable Textarea for smaller lists */}
          {isLargeFileSummaryMode ? (
            <div
              className={`border rounded-2xl p-3.5 space-y-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Preview of Parsed Words (Fast Mobile Mode)
                </span>
                <span className={`text-[11px] font-mono ${isLight ? 'text-[#1967d2]' : 'text-amber-300'}`}>
                  {effectiveItems.length.toLocaleString()} words ready
                </span>
              </div>

              <div className={`divide-y rounded-xl border overflow-hidden text-xs ${isLight ? 'bg-white border-slate-200 divide-slate-100' : 'bg-slate-900 border-slate-800 divide-slate-800'}`}>
                {previewSample.map((row, idx) => (
                  <div key={idx} className="px-3 py-2 flex items-center justify-between gap-3">
                    <span className="font-semibold truncate max-w-[48%]">{row.sourceText}</span>
                    <span className={`truncate max-w-[48%] ${isLight ? 'text-[#1967d2]' : 'text-amber-300'}`}>
                      {row.targetText || '—'}
                    </span>
                  </div>
                ))}
                {previewTail.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-center text-[11px] text-slate-500 font-mono">
                      &bull;&bull;&bull; {(effectiveItems.length - previewSample.length - previewTail.length).toLocaleString()} more words &bull;&bull;&bull;
                    </div>
                    {previewTail.map((row, idx) => (
                      <div key={`tail-${idx}`} className="px-3 py-2 flex items-center justify-between gap-3">
                        <span className="font-semibold truncate max-w-[48%]">{row.sourceText}</span>
                        <span className={`truncate max-w-[48%] ${isLight ? 'text-[#1967d2]' : 'text-amber-300'}`}>
                          {row.targetText || '—'}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ) : (
            <textarea
              value={text}
              onChange={(e) => handleManualTextChange(e.target.value)}
              placeholder={`Attach any file above (Excel, Word, PDF, TXT, CSV, JSON...) or paste words here:\ndepression\tdeep sadness\nperseverance\tcontinued effort\nopportunity, favorable circumstances`}
              rows={7}
              className={`w-full border rounded-xl p-3.5 text-sm font-mono outline-none transition-colors ${
                isLight
                  ? 'bg-slate-50 border-slate-300 focus:border-[#1a73e8] text-slate-900 placeholder:text-slate-500'
                  : 'bg-slate-950 border-slate-700 focus:border-amber-500 text-slate-100 placeholder-slate-600'
              }`}
            />
          )}

          {/* Validation & Preview banner */}
          <div
            className={`border rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-xs ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-slate-950/80 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {effectiveItems.length > 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className={`font-medium ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
                    Recognized{' '}
                    <strong className={`font-mono text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {effectiveItems.length.toLocaleString()}
                    </strong>{' '}
                    valid words
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 shrink-0 text-slate-500" />
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                    Attach any file or paste your word list to validate
                  </span>
                </>
              )}
            </div>

            {effectiveItems.length > 0 && (
              <span
                className={`text-[11px] px-2.5 py-1 rounded-md border truncate max-w-full ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                1st item: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{effectiveItems[0].sourceText}</strong> ➔{' '}
                <span className={isLight ? 'text-[#1967d2] font-semibold' : 'text-amber-300'}>
                  {effectiveItems[0].targetText || 'No translation'}
                </span>
              </span>
            )}
          </div>

          {/* Replace vs Append Option */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <label className={`flex items-center gap-2 cursor-pointer select-none ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
              <input
                type="checkbox"
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500/20 cursor-pointer"
              />
              <span>Replace entire existing list</span>
            </label>
            <span className="text-[11px] text-slate-500">
              High throughput: handles 10,000+ words on Mobile &amp; Desktop
            </span>
          </div>
        </div>

        {/* Sticky Confirmation Footer (Always visible & tappable on Mobile, Tablet & Desktop) */}
        <div
          className={`shrink-0 flex items-center justify-end gap-2.5 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 border-t ${
            isLight ? 'border-slate-200 bg-slate-50/90' : 'border-slate-800 bg-slate-950/90'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmImport}
            disabled={isParsing || isConfirmingImport || effectiveItems.length === 0}
            className="keep-amber-btn flex-1 sm:flex-none justify-center px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-amber-400/20 border border-amber-500/50 flex items-center gap-2 cursor-pointer"
          >
            {isConfirmingImport || isParsing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>{isParsing ? 'Reading File...' : 'Importing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Confirm &amp; Import {effectiveItems.length.toLocaleString()} Words</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
