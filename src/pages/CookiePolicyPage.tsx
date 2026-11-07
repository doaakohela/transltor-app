import React from 'react';
import { Cookie, ArrowLeft, ShieldCheck, ExternalLink, Mail } from 'lucide-react';
import { AppView } from '../types.ts';

interface CookiePolicyPageProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ onBack, onNavigate }) => {
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
          Last Updated: November 2026
        </span>
      </div>

      {/* Hero Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Cookie className="w-3.5 h-3.5 text-amber-400" />
          <span>Transparency &amp; Consent</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Cookie Policy
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
          This Cookie Policy explains how <strong className="text-slate-200">Translate Words, Texts &amp; Convert to MP3</strong> (available at{' '}
          <a href="https://www.transltor.xyz" className="text-amber-400 hover:underline">www.transltor.xyz</a>) uses cookies and similar technologies, specifically including our integration with <strong className="text-slate-200">Google AdSense</strong>.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">1. What Are Cookies?</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Cookies are small text files stored on your computer or mobile device when you visit a website. They allow websites to remember your preferences (such as your chosen theme or language pairs) and enable third-party providers (such as Google AdSense) to deliver relevant, safe advertisements.
          </p>
        </section>

        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white">2. Categories of Cookies We Use</h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-amber-400">A. Strictly Necessary &amp; Functional Storage</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                These elements enable the core functionality of our site. We use client-side storage (<code className="text-amber-300">localStorage</code>) to preserve your saved vocabulary lists, custom voices, and Day/Night visual mode across browser refreshes. These do not track personal identifying information across external websites.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-indigo-400">B. Advertising Cookies (Google AdSense &amp; DoubleClick)</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Google AdSense and its approved partners place advertising cookies (including the DoubleClick DART cookie) to deliver tailored ads based on your visits to this website and other websites across the web. These cookies prevent identical ads from repeatedly showing, detect fraud, and measure ad viewability.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-emerald-400">C. Performance &amp; Analytics Cookies</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Help us understand which language pairs and audio features are most beneficial so we can continuously optimize server speed, translation latency, and mobile responsiveness.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">3. How to Opt-Out &amp; Control Cookies</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You have full control over cookie settings:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-300">
            <li>
              <strong className="text-slate-100">Google Ad Personalization Opt-Out:</strong> Customize or turn off personalized advertising at{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>Google Ads Settings</span>
                <ExternalLink className="w-3 h-3" />
              </a>.
            </li>
            <li>
              <strong className="text-slate-100">Industry Opt-Out Portals:</strong> Opt out of third-party advertising cookies via{' '}
              <a
                href="https://www.aboutads.info/choices"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>Digital Advertising Alliance</span>
                <ExternalLink className="w-3 h-3" />
              </a>{' '}
              or the{' '}
              <a
                href="https://www.youronlinechoices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>European Interactive Digital Advertising Alliance (EDAA)</span>
                <ExternalLink className="w-3 h-3" />
              </a>.
            </li>
            <li>
              <strong className="text-slate-100">Browser Settings:</strong> You can configure Chrome, Edge, Firefox, or Safari to block or delete cookies at any time via your browser preferences.
            </li>
          </ul>
        </section>

        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">4. Questions &amp; Inquiries</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            For further information regarding our cookie practices, please contact our webmaster at:
          </p>
          <div className="text-xs font-semibold text-amber-400">
            Email: <a href="mailto:doaa@transltor.xyz" className="hover:underline">doaa@transltor.xyz</a> (www.transltor.xyz)
          </div>
        </section>
      </div>
    </div>
  );
};
