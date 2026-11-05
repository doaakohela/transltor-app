import React from 'react';
import {
  Volume2,
  Layers,
  BookOpen,
  Sliders,
  Plus,
  Puzzle,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';
import { AppView } from '../types.ts';

interface NavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenAddModal: () => void;
  onOpenExtensionModal: () => void;
  totalWords: number;
  isPlaying: boolean;
  sourceFlag: string;
  targetFlag: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenAddModal,
  onOpenExtensionModal,
  totalWords,
  isPlaying,
  sourceFlag,
  targetFlag,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 md:gap-6">
        {/* Brand & Language Flags */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white font-sans whitespace-nowrap">
                Translate Words, Texts <span className="text-amber-400">&amp; Convert to MP3</span>
              </h1>
              <span className="text-xs flex items-center gap-1 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-md">
                <span>{sourceFlag}</span>
                <span className="text-slate-500">➔</span>
                <span>{targetFlag}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
              100% Free Lifetime Translation &amp; Studio Neural MP3 Voice Generator
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onViewChange('player')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'player'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-amber-400 animate-pulse' : ''}`} />
            <span>Studio Workstation</span>
          </button>

          <button
            onClick={() => onViewChange('flashcards')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'flashcards'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => onViewChange('studio')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'studio'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Voice Studio</span>
          </button>
        </nav>

        {/* Action Buttons: Day/Night Toggle, High-Converting Sponsored Link & Chrome Extension */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Day / Night Mode Toggle Icon */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              theme === 'dark'
                ? 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-slate-700/80 hover:border-amber-400/50'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-amber-500/10'
            }`}
            title={theme === 'dark' ? 'Switch to Day Mode (الوضع النهاري)' : 'Switch to Night Mode (الوضع الليلي)'}
            aria-label="Toggle Day / Night Mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden md:inline">Day Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">Night Mode</span>
              </>
            )}
          </button>

          <a
            href="https://uplcm.com/4/12174511"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md shadow-amber-400/25 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer animate-pulse"
            title="Claim Free VIP Cloud Server & Audio Perks"
          >
            <span>🎁 Claim VIP Perks ↗</span>
          </a>

          <button
            onClick={onOpenExtensionModal}
            className="px-3 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/80 rounded-lg transition-all flex items-center gap-1.5 shadow-sm hover:border-indigo-600 whitespace-nowrap cursor-pointer"
            title="Download Chrome Extension (Manifest V3)"
          >
            <Puzzle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Chrome Extension 🧩</span>
            <span className="sm:hidden">Extension</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Import List</span>
            <span className="sm:hidden">Import</span>
          </button>
        </div>
      </div>
    </header>
  );
};
