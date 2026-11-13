import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  Download,
  Loader2,
  Check,
  Play,
  Pause,
  Headphones,
  Sliders,
  Bookmark,
  Keyboard,
} from 'lucide-react';
import { AudioSettings, VocabularyItem } from '../types.ts';
import { speechService } from '../services/speechService.ts';
import { getLanguageByCode } from '../data/languages.ts';

interface FlashcardDeckProps {
  items: VocabularyItem[];
  settings: AudioSettings;
  onToggleMastered: (id: string) => void;
  theme?: 'dark' | 'light';
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  items,
  settings,
  onToggleMastered,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [isAutoStudying, setIsAutoStudying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [currentSpeakingStage, setCurrentSpeakingStage] = useState<string>('idle');

  const isAutoStudyingRef = useRef(isAutoStudying);
  isAutoStudyingRef.current = isAutoStudying;

  const cardIndexRef = useRef(cardIndex);
  cardIndexRef.current = cardIndex;

  const currentItem = items[cardIndex] || items[0];
  const sourceLang = getLanguageByCode(
    (currentItem && currentItem.sourceLang) || settings.sourceLang || 'en-US'
  );
  const targetLang = getLanguageByCode(
    (currentItem && currentItem.targetLang) || settings.targetLang || 'es-ES'
  );
  const activeItemSourceVoice =
    (currentItem && currentItem.sourceVoice) ||
    (currentItem && currentItem.sourceLang
      ? sourceLang.defaultVoice
      : settings.sourceVoice || sourceLang.defaultVoice);
  const activeItemTargetVoice =
    (currentItem && currentItem.targetVoice) ||
    (currentItem && currentItem.targetLang
      ? targetLang.defaultVoice
      : settings.targetVoice || targetLang.defaultVoice);

  const sourceWord = currentItem ? currentItem.sourceText || currentItem.english || '' : '';
  const targetWord = currentItem ? currentItem.targetText || currentItem.arabic || '' : '';

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handlePlayFullSequence();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length, cardIndex]);

  // Clean stop when unmounting or switching
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-slate-400 space-y-3">
        <Headphones className="w-12 h-12 text-slate-600 mx-auto" />
        <h4 className="text-base font-bold text-white">No Flashcards Available</h4>
        <p className="text-xs text-slate-400">
          Add or import words in the Studio Workstation first to begin interactive 1-word focused flashcard memorization!
        </p>
      </div>
    );
  }

  const handleNext = () => {
    speechService.stop();
    setIsPlayingSeq(false);
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    speechService.stop();
    setIsPlayingSeq(false);
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleShuffle = () => {
    speechService.stop();
    setIsPlayingSeq(false);
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * items.length);
    setCardIndex(randomIndex);
  };

  // Play full 2x Source + 1x Target sequence on current card
  const handlePlayFullSequence = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlayingSeq) {
      speechService.stop();
      setIsPlayingSeq(false);
      setCurrentSpeakingStage('idle');
      return;
    }

    setIsPlayingSeq(true);
    await speechService.playFullSequence(currentItem, settings, (stage) => {
      setCurrentSpeakingStage(stage);
    });
    setIsPlayingSeq(false);
    setCurrentSpeakingStage('idle');
  };

  // Auto-Study Deck Mode: Cycles card by card, speaking 2x source + 1x target
  const handleToggleAutoStudy = async () => {
    if (isAutoStudying) {
      isAutoStudyingRef.current = false;
      setIsAutoStudying(false);
      speechService.stop();
      setIsPlayingSeq(false);
      setCurrentSpeakingStage('idle');
      return;
    }

    speechService.unlockAudio();
    isAutoStudyingRef.current = true;
    setIsAutoStudying(true);
    runAutoStudyLoop(cardIndex);
  };

  const runAutoStudyLoop = async (index: number) => {
    if (!isAutoStudyingRef.current || items.length === 0) {
      isAutoStudyingRef.current = false;
      setIsAutoStudying(false);
      setIsPlayingSeq(false);
      return;
    }

    const item = items[index];
    setCardIndex(index);
    setIsFlipped(false);
    setIsPlayingSeq(true);

    // Play 2x Source + 1x Target
    await speechService.playFullSequence(item, settings, (stage) => {
      setCurrentSpeakingStage(stage);
    });

    if (!isAutoStudyingRef.current) {
      setIsPlayingSeq(false);
      setCurrentSpeakingStage('idle');
      return;
    }

    // Reveal translation on card flip
    setIsFlipped(true);

    // Pause between cards
    await new Promise((r) => setTimeout(r, settings.pauseBetweenWords || 1400));

    if (!isAutoStudyingRef.current) {
      setIsPlayingSeq(false);
      setCurrentSpeakingStage('idle');
      return;
    }

    // Advance to next card
    const nextIdx = (index + 1) % items.length;
    if (nextIdx === 0 && !settings.loopPlaylist) {
      setIsAutoStudying(false);
      setIsPlayingSeq(false);
      setCurrentSpeakingStage('idle');
      return;
    }

    runAutoStudyLoop(nextIdx);
  };

  // Download sequence audio for this specific card
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const ok = await speechService.downloadSequenceAudio(currentItem, settings);
      if (ok) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const isSpeakingSource =
    currentSpeakingStage === 'source_1' || currentSpeakingStage === 'source_2' ||
    currentSpeakingStage === 'en_1' || currentSpeakingStage === 'en_2';
  const isSpeakingTarget =
    currentSpeakingStage === 'target_1' || currentSpeakingStage === 'ar_1';

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left animate-fade-in">
      {/* Top Controls Bar & Study Mode */}
      <div
        className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isLight ? 'bg-[#1a73e8]' : 'bg-amber-400'}`}></span>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span>Interactive Flashcard Focus</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                  isLight
                    ? 'bg-[#e8f0fe] text-[#1967d2] border-[#aecbfa]'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}
              >
                2x Original + 1x Translation
              </span>
            </h3>
            <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Card {cardIndex + 1} of {items.length} &bull; Click card or Press Space to flip
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Auto-Study Deck Toggle */}
          <button
            onClick={handleToggleAutoStudy}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md border ${
              isLight
                ? isAutoStudying
                  ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] shadow-blue-500/25'
                  : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : isAutoStudying
                ? 'bg-amber-400 text-slate-950 shadow-amber-400/25 border-transparent'
                : 'bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border-indigo-500/40'
            }`}
            title="Auto-advance cards and pronounce 2x + 1x"
          >
            {isAutoStudying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Auto-Study</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Study Deck</span>
              </>
            )}
          </button>

          <button
            onClick={handleShuffle}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Shuffle cards"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onToggleMastered(currentItem.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
              currentItem.mastered
                ? isLight
                  ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8]'
                  : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                : isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
            }`}
            title="Mark this word as mastered"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{currentItem.mastered ? 'Mastered' : 'Mark Learned'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full rounded-full h-1.5 overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            isLight ? 'bg-[#1a73e8]' : 'bg-gradient-to-r from-indigo-500 to-amber-400'
          }`}
          style={{ width: `${((cardIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[360px] perspective group"
      >
        <div
          className={`relative w-full min-h-[360px] rounded-3xl p-8 border transition-all duration-500 shadow-2xl flex flex-col justify-between text-center select-none ${
            isFlipped
              ? isLight
                ? 'bg-white border-[#aecbfa] shadow-blue-500/10'
                : 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/40 shadow-amber-500/10'
              : isLight
              ? 'bg-white border-slate-200 group-hover:border-[#1a73e8]'
              : 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border-slate-800 group-hover:border-indigo-500/60'
          }`}
        >
          {/* Card Top Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                isLight
                  ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                  : 'text-slate-400 bg-slate-950/60 border-slate-800'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-amber-400'}`} />
              <span>Click to Flip Card</span>
            </span>

            {/* Audio Wave Indicator */}
            <div className="flex items-center gap-1.5">
              {isPlayingSeq && (
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border ${
                    isLight ? 'bg-[#e8f0fe] border-[#aecbfa]' : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <span className={`w-1.5 h-3 rounded-full animate-pulse ${isLight ? 'bg-[#1a73e8]' : 'bg-amber-400'}`} />
                  <span className={`w-1.5 h-5 rounded-full animate-pulse delay-75 ${isLight ? 'bg-[#4285f4]' : 'bg-indigo-400'}`} />
                  <span className={`w-1.5 h-4 rounded-full animate-pulse delay-150 ${isLight ? 'bg-[#1a73e8]' : 'bg-amber-400'}`} />
                  <span className={`text-[10px] font-mono ml-1 ${isLight ? 'text-[#1967d2]' : 'text-slate-300'}`}>
                    {isSpeakingSource ? '2x Original' : isSpeakingTarget ? '1x Translation' : 'Speaking'}
                  </span>
                </div>
              )}

              <span
                className={`font-semibold px-2.5 py-1 rounded-lg border text-xs ${
                  isLight
                    ? 'bg-[#e8f0fe] border-[#aecbfa] text-[#1967d2]'
                    : 'bg-slate-950 border-slate-800 text-amber-300'
                }`}
              >
                {isFlipped ? `${targetLang.flag} Back: Translation` : `${sourceLang.flag} Front: Word`}
              </span>
            </div>
          </div>

          {/* Card Body with Big Word Typography */}
          <div className="my-auto py-8 space-y-4">
            {!isFlipped ? (
              <div className="space-y-3 animate-fade-in">
                <span className={`text-xs uppercase tracking-widest font-bold ${isLight ? 'text-[#1a73e8]' : 'text-indigo-400'}`}>
                  {sourceLang.name}
                </span>
                <h3 className={`text-4xl sm:text-5xl font-extrabold tracking-tight break-words drop-shadow-md ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {sourceWord}
                </h3>
                {currentItem.phonetic && (
                  <p className="text-sm font-mono text-slate-400">
                    {currentItem.phonetic}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <span className={`text-xs uppercase tracking-widest font-bold ${isLight ? 'text-[#1a73e8]' : 'text-amber-400'}`}>
                  {targetLang.name} Translation
                </span>
                <h3 className={`text-3xl sm:text-4xl font-extrabold break-words drop-shadow-md ${isLight ? 'text-[#1967d2]' : 'text-amber-300'}`}>
                  {targetWord || 'No translation provided'}
                </h3>
              </div>
            )}
          </div>

          {/* Card Bottom Actions */}
          <div className={`flex items-center justify-between pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <div className="flex items-center gap-2">
              {/* Play 2x Source + 1x Target */}
              <button
                onClick={handlePlayFullSequence}
                disabled={isPlayingSeq && !isAutoStudying}
                className={`px-4 py-2.5 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] shadow-blue-500/25'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/30'
                }`}
                title="Pronounce: 2x original word + 1x translation"
              >
                {isPlayingSeq ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Pronouncing (2x + 1x)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Pronounce 2x + 1x</span>
                  </>
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speechService.speakText(
                    isFlipped ? targetWord : sourceWord,
                    isFlipped ? targetLang.code : sourceLang.code,
                    isFlipped ? activeItemTargetVoice : activeItemSourceVoice
                  );
                }}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer border ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title={isFlipped ? 'Pronounce translation once' : 'Pronounce word once'}
              >
                <Volume2 className={`w-4 h-4 ${isLight ? 'text-white' : 'text-amber-400'}`} />
              </button>
            </div>

            {/* Download this card's audio MP3 (Kept Amber as Download Action) */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`keep-amber-btn p-2.5 rounded-xl transition-colors cursor-pointer border flex items-center gap-1.5 text-xs font-semibold ${
                isLight
                  ? 'keep-amber-outline bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Download this card MP3 (2x word + 1x translation)"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              ) : downloadSuccess ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Download className={`w-4 h-4 ${isLight ? 'text-amber-800' : 'text-slate-300'}`} />
              )}
              <span className="hidden sm:inline">Card MP3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          className={`flex-1 py-3 px-4 border rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            isLight
              ? 'bg-[#1a73e8] hover:bg-[#1557b0] border-[#1a73e8] text-white'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Card (A / ◀)</span>
        </button>

        <button
          onClick={handleNext}
          className={`flex-1 py-3 px-4 border rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            isLight
              ? 'bg-[#1a73e8] hover:bg-[#1557b0] border-[#1a73e8] text-white'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
          }`}
        >
          <span>Next Card (D / ▶)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Keyboard Shortcuts Hint */}
      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-3 pt-1">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3.5 h-3.5" />
          <span>Shortcuts:</span>
        </span>
        <span><strong>Space</strong> Flip</span>
        <span>&bull;</span>
        <span><strong>P</strong> Speak 2x+1x</span>
        <span>&bull;</span>
        <span><strong>← / →</strong> Navigate</span>
      </div>
    </div>
  );
};
