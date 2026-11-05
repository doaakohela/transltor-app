import React, { useState } from 'react';
import {
  Search,
  Volume2,
  Trash2,
  CheckCircle,
  Download,
  FileDown,
  Edit2,
  Check,
  X,
  Play,
  Loader2,
  FolderDown,
} from 'lucide-react';
import { AudioSettings, VocabularyItem } from '../types.ts';
import { speechService } from '../services/speechService.ts';
import { getLanguageByCode } from '../data/languages.ts';

interface WordListTableProps {
  items: VocabularyItem[];
  settings: AudioSettings;
  onDeleteItem: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onUpdateItem: (id: string, sourceText: string, targetText: string) => void;
  onPlayItem: (item: VocabularyItem) => void;
}

export const WordListTable: React.FC<WordListTableProps> = ({
  items,
  settings,
  onDeleteItem,
  onToggleMastered,
  onUpdateItem,
  onPlayItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'learning' | 'mastered'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSource, setEditSource] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);

  const sourceLang = getLanguageByCode(settings.sourceLang || 'en-US');
  const targetLang = getLanguageByCode(settings.targetLang || 'es-ES');

  // Filter items
  const filteredItems = items.filter((item) => {
    const src = item.sourceText || item.english || '';
    const tgt = item.targetText || item.arabic || '';
    const matchesSearch =
      src.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tgt.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'learning') return !item.mastered;
    if (filterType === 'mastered') return item.mastered;
    return true;
  });

  const startEdit = (item: VocabularyItem) => {
    setEditingId(item.id);
    setEditSource(item.sourceText || item.english || '');
    setEditTarget(item.targetText || item.arabic || '');
  };

  const saveEdit = (id: string) => {
    if (!editSource.trim()) return;
    onUpdateItem(id, editSource.trim(), editTarget.trim());
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

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
    <div className="space-y-4 text-left">
      {/* Table Title & Guidance Banner (Screenshot 2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Discovered Vocabulary Table ({items.length} Words)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            💡 Each word is separated below. Click <strong className="text-amber-400">🔊 Listen</strong> to pronounce any word separately on demand!
          </p>
        </div>

        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 rounded-lg shrink-0">
          Individual Word Pronunciation Active
        </span>
      </div>

      {/* Top search & filter bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words or translations..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 transition-colors outline-none"
          />
        </div>

        {/* Filter buttons & Batch Export */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({items.length})
            </button>

            <button
              onClick={() => setFilterType('learning')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'learning'
                  ? 'bg-indigo-600/30 text-indigo-300 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Learning ({items.filter((i) => !i.mastered).length})
            </button>

            <button
              onClick={() => setFilterType('mastered')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'mastered'
                  ? 'bg-emerald-600/30 text-emerald-300 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mastered ({items.filter((i) => i.mastered).length})
            </button>
          </div>

          {/* Batch MP3 Button */}
          <button
            onClick={handleBatchDownload}
            disabled={isBatchDownloading || items.length === 0}
            className="px-3 py-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="Download all words as a single sequential MP3 file"
          >
            {isBatchDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : batchSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <FolderDown className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Download Master MP3</span>
          </button>

          {/* Export Text */}
          <button
            onClick={handleExportText}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="Export word list as tab-delimited text file"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Export TXT</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 text-xs">
                <th className="py-3 px-4 font-semibold">#</th>
                <th className="py-3 px-4 font-semibold">
                  {sourceLang.flag} Word ({sourceLang.name})
                </th>
                <th className="py-3 px-4 font-semibold">
                  {targetLang.flag} Translation ({targetLang.name})
                </th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No vocabulary items match your search.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => {
                  const isEditing = editingId === item.id;
                  const srcWord = item.sourceText || item.english || '';
                  const tgtWord = item.targetText || item.arabic || '';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-850/50 transition-colors group"
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                        {index + 1}
                      </td>

                      {/* Source Word */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editSource}
                            onChange={(e) => setEditSource(e.target.value)}
                            className="bg-slate-950 border border-indigo-500 rounded-lg px-2.5 py-1 text-sm text-white w-full outline-none"
                          />
                        ) : (
                          <div>
                            <span className="font-semibold text-white text-base">
                              {srcWord}
                            </span>
                            {item.phonetic && (
                              <span className="block text-[11px] text-slate-500 font-mono">
                                {item.phonetic}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Target Translation */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTarget}
                            onChange={(e) => setEditTarget(e.target.value)}
                            className="bg-slate-950 border border-amber-500 rounded-lg px-2.5 py-1 text-sm text-white w-full outline-none"
                          />
                        ) : (
                          <span className="text-amber-300 font-medium text-sm">
                            {tgtWord || 'No translation provided'}
                          </span>
                        )}
                      </td>

                      {/* Mastered Status */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onToggleMastered(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] transition-all inline-flex items-center gap-1 cursor-pointer ${
                            item.mastered
                              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>{item.mastered ? 'Mastered' : 'Learning'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEdit(item.id)}
                                className="p-1.5 text-emerald-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                                title="Save changes"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Individual Pronunciation Button */}
                              <button
                                onClick={() => onPlayItem(item)}
                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-600/30 to-blue-600/20 hover:from-indigo-600/50 hover:to-blue-600/40 text-indigo-200 hover:text-white border border-indigo-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                                title="Pronounce this word separately (2x source + 1x target)"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                <span>Listen</span>
                              </button>

                              {/* Download Row MP3 */}
                              <button
                                onClick={() => handleDownloadRow(item)}
                                disabled={downloadingId === item.id}
                                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                title="Download MP3 for this word"
                              >
                                {downloadingId === item.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => startEdit(item)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                title="Edit word"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                title="Delete word"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
