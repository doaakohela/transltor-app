import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Volume2,
  Trash2,
  CheckCircle,
  Download,
  FileDown,
  Check,
  Loader2,
  FolderDown,
  Repeat,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AudioSettings, VocabularyItem } from '../types.ts';
import { speechService } from '../services/speechService.ts';
import { getLanguageByCode } from '../data/languages.ts';

interface WordListTableProps {
  items: VocabularyItem[];
  settings: AudioSettings;
  onDeleteItem: (id: string) => void;
  onClearAll?: () => void;
  onToggleMastered: (id: string) => void;
  onUpdateSettings: (newSettings: Partial<AudioSettings>) => void;
  onPlayItem: (item: VocabularyItem) => void;
  theme?: 'dark' | 'light';
}

export const WordListTable: React.FC<WordListTableProps> = ({
  items,
  settings,
  onDeleteItem,
  onClearAll,
  onToggleMastered,
  onUpdateSettings,
  onPlayItem,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'learning' | 'mastered'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);

  const sourceLang = getLanguageByCode(settings.sourceLang || 'en-US');
  const targetLang = getLanguageByCode(settings.targetLang || 'es-ES');

  const is2x1x = (settings.sourceRepeats ?? 2) === 2 && (settings.targetRepeats ?? 1) === 1;

  const handleToggleRepetitionPattern = () => {
    if (is2x1x) {
      onUpdateSettings({ sourceRepeats: 1, targetRepeats: 2 });
    } else {
      onUpdateSettings({ sourceRepeats: 2, targetRepeats: 1 });
    }
  };

  // Memoized counts so 9,000+ items never double-iterate on every render
  const { learningCount, masteredCount } = useMemo(() => {
    let learning = 0;
    let mastered = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].mastered) mastered++;
      else learning++;
    }
    return { learningCount: learning, masteredCount: mastered };
  }, [items]);

  // Filter items (memoized for 10,000+ words)
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q && filterType === 'all') return items;
    return items.filter((item) => {
      if (filterType === 'learning' && item.mastered) return false;
      if (filterType === 'mastered' && !item.mastered) return false;
      if (!q) return true;
      const src = item.sourceText || item.english || '';
      const tgt = item.targetText || item.arabic || '';
      return src.toLowerCase().includes(q) || tgt.toLowerCase().includes(q);
    });
  }, [items, searchQuery, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;

  const paginatedItems = useMemo(
    () => filteredItems.slice(startIdx, startIdx + pageSize),
    [filteredItems, startIdx, pageSize]
  );

  // Reset to page 1 when filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, pageSize]);

  // Clamp page if items are deleted
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Export list as text file (word, translation)
  const handleExportText = () => {
    const lines = items
      .map((it) => `${it.sourceText || it.english}\t${it.targetText || it.arabic}`)
      .join('\n');
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vocabflow_${sourceLang.code}_to_${targetLang.code}_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Batch download entire list as single MP3 file
  const handleBatchDownload = async () => {
    if (isBatchDownloading) return;
    setIsBatchDownloading(true);
    setBatchSuccess(false);

    try {
      const ok = await speechService.downloadBatchAudio(
        items,
        settings,
        300,
        `vocabflow_${items.length}_words_master.mp3`
      );
      if (ok) {
        setBatchSuccess(true);
        setTimeout(() => setBatchSuccess(false), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBatchDownloading(false);
    }
  };

  // Download audio for a specific item
  const handleDownloadRow = async (item: VocabularyItem) => {
    if (downloadingId) return;
    setDownloadingId(item.id);
    try {
      await speechService.downloadSequenceAudio(item, settings);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-2.5 sm:space-y-4 text-left">
      {/* Table Title & Guidance Banner (Compact 1-line on Mobile <640px; Full on Tablet/Desktop) */}
      <div
        className={`border rounded-2xl px-3.5 py-2.5 sm:p-5 shadow-lg flex flex-row items-center justify-between gap-2 sm:gap-3 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
            <h3 className={`text-sm sm:text-base font-bold tracking-tight truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span className="sm:hidden">Word List ({items.length})</span>
              <span className="hidden sm:inline">Discovered Vocabulary Table ({items.length} Words)</span>
            </h3>
          </div>
          <p className={`hidden sm:block text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            💡 Each word is separated below. Click <strong className={isLight ? 'text-[#1967d2]' : 'text-amber-400'}>🔊 Listen</strong> to pronounce any word separately on demand!
          </p>
        </div>

        {/* Short mobile hint + full Desktop/Tablet badge */}
        <span
          className={`sm:hidden px-2 py-0.5 text-[11px] font-semibold rounded-md shrink-0 whitespace-nowrap border ${
            isLight
              ? 'bg-[#e8f0fe] text-[#1967d2] border-[#aecbfa]'
              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
          }`}
        >
          🔊 Tap Listen
        </span>
        <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 rounded-lg shrink-0">
          Individual Word Pronunciation Active
        </span>
      </div>

      {/* Top search & filter bar */}
      <div
        className={`border rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shadow-lg ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}
      >
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search
            className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-[#1a73e8]' : 'text-slate-500'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words or translations..."
            className={`w-full border rounded-xl pl-10 pr-3 py-2 text-xs transition-colors outline-none ${
              isLight
                ? 'bg-slate-50 border-slate-300 focus:border-[#1a73e8] text-slate-900 placeholder:text-slate-500'
                : 'bg-slate-950 border-slate-700 focus:border-amber-400 text-white placeholder-slate-500'
            }`}
          />
        </div>

        {/* Filter buttons & Batch Export (Single row of 4 buttons on Mobile; full layout on Tablet/Desktop) */}
        <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div
            className={`flex items-center gap-1 border rounded-xl p-0.5 sm:p-1 text-[11px] sm:text-xs shrink-0 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <button
              onClick={() => setFilterType('all')}
              className={`hidden sm:inline-flex px-3 py-1 rounded-lg transition-colors cursor-pointer border whitespace-nowrap ${
                filterType === 'all'
                  ? isLight
                    ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] font-bold'
                    : 'bg-slate-800 text-white border-transparent font-medium'
                  : isLight
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              All ({items.length})
            </button>

            <button
              onClick={() => setFilterType(filterType === 'learning' ? 'all' : 'learning')}
              className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg transition-colors cursor-pointer border whitespace-nowrap ${
                filterType === 'learning'
                  ? isLight
                    ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] font-bold'
                    : 'bg-indigo-600/30 text-indigo-300 border-transparent font-medium'
                  : isLight
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <span className="sm:hidden">Learn ({learningCount})</span>
              <span className="hidden sm:inline">Learning ({learningCount})</span>
            </button>

            <button
              onClick={() => setFilterType(filterType === 'mastered' ? 'all' : 'mastered')}
              className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg transition-colors cursor-pointer border whitespace-nowrap ${
                filterType === 'mastered'
                  ? isLight
                    ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] font-bold'
                    : 'bg-emerald-600/30 text-emerald-300 border-transparent font-medium'
                  : isLight
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <span className="sm:hidden">Master ({masteredCount})</span>
              <span className="hidden sm:inline">Mastered ({masteredCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Batch MP3 Button (Kept Amber as Download Action; short label on mobile) */}
            <button
              onClick={handleBatchDownload}
              disabled={isBatchDownloading || items.length === 0}
              className={`keep-amber-btn px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap cursor-pointer border ${
                isLight
                  ? 'keep-amber-outline bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-500'
                  : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-400/30'
              }`}
              title="Download all words as a single sequential MP3 file"
            >
              {isBatchDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700 shrink-0" />
              ) : batchSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <FolderDown className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-amber-800' : 'text-amber-400'}`} />
              )}
              <span className="sm:hidden">MP3</span>
              <span className="hidden sm:inline">Download Master MP3</span>
            </button>

            {/* Clear Entire Vocabulary List Button (Next to MP3 on Mobile, Tablet & Desktop) */}
            {onClearAll && (
              <button
                type="button"
                onClick={onClearAll}
                disabled={items.length === 0}
                className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border shrink-0 ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-red-600 disabled:hover:bg-[#1a73e8] text-white border-[#1a73e8] hover:border-red-600'
                    : 'bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border-slate-700/80 hover:border-red-500/40'
                }`}
                title="Clear entire vocabulary list"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {/* Export Text */}
            <button
              onClick={handleExportText}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isLight
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-transparent'
              }`}
              title="Export word list as tab-delimited text file"
            >
              <FileDown className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-slate-400'}`} />
              <span className="hidden md:inline">Export TXT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div
        className={`border rounded-2xl overflow-hidden shadow-xl ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-xs ${
                  isLight
                    ? 'border-slate-200 bg-slate-50 text-slate-700'
                    : 'border-slate-800 bg-slate-950/70 text-slate-400'
                }`}
              >
                <th className="py-2.5 px-2 md:py-3 md:px-4 font-semibold">#</th>
                <th className="py-2.5 px-2 md:py-3 md:px-4 font-semibold">
                  Original Word
                </th>
                <th className="py-2.5 px-2 md:py-3 md:px-4 font-semibold">
                  Translation
                </th>
                <th className="hidden md:table-cell py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-2.5 px-2 md:py-3 md:px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs sm:text-sm ${isLight ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No vocabulary items match your search.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, idx) => {
                  const index = startIdx + idx;
                  const srcWord = item.sourceText || item.english || '';
                  const tgtWord = item.targetText || item.arabic || '';
                  const itemSourceLang = item.sourceLang ? getLanguageByCode(item.sourceLang) : sourceLang;
                  const itemTargetLang = item.targetLang ? getLanguageByCode(item.targetLang) : targetLang;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors group ${
                        isLight ? 'hover:bg-slate-50/90' : 'hover:bg-slate-850/50'
                      }`}
                    >
                      {/* Index */}
                      <td className="py-2.5 px-2 md:py-3.5 md:px-4 text-slate-500 font-mono text-xs align-top md:align-middle">
                        {index + 1}
                      </td>

                      {/* Source Word */}
                      <td className="py-2.5 px-2 md:py-3.5 md:px-4 min-w-0 break-words align-top md:align-middle">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            title={`${itemSourceLang.name} (${item.sourceVoice || itemSourceLang.defaultVoice})`}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-600 text-[#ffffff] text-[10px] sm:text-[11px] font-bold tracking-wide leading-tight shadow-xs select-none"
                          >
                            {itemSourceLang.name}
                          </span>
                          <span className={`font-semibold text-sm md:text-base leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {srcWord}
                          </span>
                          {item.phonetic && (
                            <span className="block text-[11px] text-slate-500 font-mono">
                              {item.phonetic}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Target Translation */}
                      <td className="py-2.5 px-2 md:py-3.5 md:px-4 min-w-0 break-words align-top md:align-middle">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            title={`${itemTargetLang.name} (${item.targetVoice || itemTargetLang.defaultVoice})`}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-600 text-[#ffffff] text-[10px] sm:text-[11px] font-bold tracking-wide leading-tight shadow-xs select-none"
                          >
                            {itemTargetLang.name}
                          </span>
                          <span className={`font-medium text-xs sm:text-sm leading-snug ${isLight ? 'text-[#1967d2]' : 'text-amber-300'}`}>
                            {tgtWord || 'No translation provided'}
                          </span>
                        </div>
                      </td>

                      {/* Mastered Status (Hidden on mobile < 768px so action icons fit cleanly without scrolling) */}
                      <td className="hidden md:table-cell py-3.5 px-4 text-center">
                        <button
                          onClick={() => onToggleMastered(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] transition-all inline-flex items-center gap-1 cursor-pointer border ${
                            item.mastered
                              ? isLight
                                ? 'bg-[#174ea6] hover:bg-[#1557b0] text-white border-[#174ea6] font-semibold'
                                : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                              : isLight
                              ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] font-medium'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-transparent'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>{item.mastered ? 'Mastered' : 'Learning'}</span>
                        </button>
                      </td>

                      {/* Actions (On mobile: Listen on top, Download/Repeat-Switch/Delete wrapped underneath; On Tablet/Desktop: single horizontal row) */}
                      <td className="py-2.5 px-2 md:py-3.5 md:px-4 text-right align-top md:align-middle">
                        <div className="flex flex-col items-end gap-1.5 md:flex-row md:items-center md:justify-end">
                          {/* Individual Pronunciation Button */}
                          <button
                            onClick={() => onPlayItem(item)}
                            className={`px-3 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap ${
                              isLight
                                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                                : 'bg-gradient-to-r from-indigo-600/30 to-blue-600/20 hover:from-indigo-600/50 hover:to-blue-600/40 text-indigo-200 hover:text-white border-indigo-500/40'
                            }`}
                            title={
                              is2x1x
                                ? 'Pronounce this item separately (2x original + 1x translation)'
                                : 'Pronounce this item separately (1x original + 2x translation)'
                            }
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-amber-400'}`} />
                            <span>Listen</span>
                          </button>

                          <div className="flex items-center justify-end gap-1 md:gap-1.5">
                            {/* Download Row MP3 (Kept Amber as Download Action) */}
                            <button
                              onClick={() => handleDownloadRow(item)}
                              disabled={downloadingId === item.id}
                              className={`keep-amber-btn p-1.5 md:p-2 rounded-xl transition-colors cursor-pointer border ${
                                isLight
                                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500 shadow-xs'
                                  : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800 border-transparent'
                              }`}
                              title="Download MP3 for this word"
                            >
                              {downloadingId === item.id ? (
                                <Loader2 className={`w-3.5 h-3.5 md:w-4 md:h-4 animate-spin ${isLight ? 'text-slate-950' : 'text-amber-600'}`} />
                              ) : (
                                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              )}
                            </button>

                            {/* Repetition Mode Switch Icon Button (1x+2x ⇄ 2x+1x) */}
                            <button
                              type="button"
                              onClick={handleToggleRepetitionPattern}
                              className={`p-1.5 md:p-2 rounded-xl transition-all cursor-pointer border ${
                                isLight
                                  ? is2x1x
                                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-xs'
                                    : 'bg-[#174ea6] hover:bg-[#1557b0] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] shadow-xs'
                                  : is2x1x
                                  ? 'bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border-indigo-700/70'
                                  : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-600/80'
                              }`}
                              title={
                                is2x1x
                                  ? 'Current: 2x Original + 1x Translation. Click to switch to: 1x Original + 2x Translation'
                                  : 'Current: 1x Original + 2x Translation. Click to switch to: 2x Original + 1x Translation'
                              }
                            >
                              <Repeat
                                className={`w-3.5 h-3.5 ${
                                  isLight
                                    ? 'text-white'
                                    : is2x1x
                                    ? 'text-indigo-300'
                                    : 'text-amber-400'
                                }`}
                              />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => onDeleteItem(item.id)}
                              className={`p-1.5 md:p-2 rounded-xl transition-colors cursor-pointer border ${
                                isLight
                                  ? 'bg-[#1a73e8] hover:bg-red-600 text-white border-[#1a73e8] hover:border-red-600 shadow-xs'
                                  : 'text-slate-500 hover:text-red-400 hover:bg-slate-800 border-transparent'
                              }`}
                              title="Delete word"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* High-Throughput Pagination Controls (Renders 50-250 rows cleanly on Mobile, Tablet & Desktop) */}
        {filteredItems.length > 50 && (
          <div
            className={`border-t px-3 py-2.5 sm:px-4 sm:py-3 flex flex-wrap items-center justify-between gap-2 text-xs ${
              isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-800 bg-slate-950/70 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
              <span>
                Showing <strong>{startIdx + 1}</strong>–
                <strong>{Math.min(startIdx + pageSize, filteredItems.length)}</strong> of{' '}
                <strong>{filteredItems.length.toLocaleString()}</strong>
              </span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                aria-label="Words per page"
                className={`border rounded-lg px-2 py-1 text-[11px] outline-none cursor-pointer ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
                <option value={250}>250 / page</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] disabled:hover:bg-[#1a73e8] text-white border-[#1a73e8]'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="px-2 font-mono text-[11px] sm:text-xs">
                Page <strong>{safePage}</strong> / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] disabled:hover:bg-[#1a73e8] text-white border-[#1a73e8]'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
