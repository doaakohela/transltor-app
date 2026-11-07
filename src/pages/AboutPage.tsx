import React from 'react';
import { Volume2, Globe, Sparkles, Headphones, Layers, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { AppView } from '../types.ts';

interface AboutPageProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 text-left animate-fade-in">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Translation Studio</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Translate Words, Texts &amp; Convert to MP3
        </span>
      </div>

      {/* Hero Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>About Our Mission</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
          Empowering Global Learners Through Sound &amp; Translation
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          <strong className="text-white">Translate Words, Texts &amp; Convert to MP3</strong> is a 100% free lifetime educational workstation created to make language learning frictionless, natural, and accessible to everyone worldwide—without expensive paywalls, subscriptions, or intrusive apps.
        </p>
      </div>

      {/* Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Dual-Mode Audio Loop</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Switch effortlessly between <strong className="text-slate-200">2x Source + 1x Target</strong> (ideal for foreign pronunciation training) or <strong className="text-slate-200">1x Source + 2x Target</strong> (ideal for deep vocabulary retention) with a single click.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Pure MP3 Generation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Export genuine, offline MP3 files auto-partitioned into clean 100-word segments for seamless listening during your daily commute, gym workout, or flight without needing cellular data.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">100+ World Languages</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Translate and memorize between all world languages with full support for Arabic, English, Spanish, French, German, Japanese, Chinese, Turkish, Russian, and dozens more.
          </p>
        </div>
      </div>

      {/* Story & Commitment to Privacy */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">Why We Built This Platform</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Most translation software is designed for casual lookups, not memorization. Learners often find themselves copying words into separate spreadsheets, text documents, or flashcard apps, with no convenient way to listen to continuous audio or download MP3s.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          We built this unified workstation to combine instant translation, intelligent file imports (with built-in Windows-1256 ANSI decoding for Arabic texts), interactive flashcard decks, and professional audio synthesis in a clean, distraction-free environment.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          To keep the service completely free for students, teachers, and self-learners around the globe, we partner with reputable ad networks like <strong className="text-white">Google AdSense</strong>. We carefully restrict ad placements to ensure they never interrupt your learning flow or slow down page performance.
        </p>
      </div>

      {/* Official Contact & Leadership */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Get in Touch With Our Team</h3>
          <p className="text-xs text-slate-400">
            For academic partnerships, feature suggestions, or press inquiries:
          </p>
          <div className="text-xs sm:text-sm font-semibold text-amber-400">
            Official Email: <a href="mailto:doaa@transltor.xyz" className="hover:underline">doaa@transltor.xyz</a>
          </div>
        </div>

        <button
          onClick={() => onNavigate('contact')}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          Contact Us Directly ↗
        </button>
      </div>
    </div>
  );
};
