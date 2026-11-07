import React from 'react';
import { FileText, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { AppView } from '../types.ts';

interface TermsPageProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack, onNavigate }) => {
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

      {/* Page Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
          Welcome to <strong className="text-slate-200">Translate Words, Texts &amp; Convert to MP3</strong> (accessible via{' '}
          <a href="https://www.transltor.xyz" className="text-amber-400 hover:underline">www.transltor.xyz</a>).
          By accessing or utilizing our translation workstation, audio generation tools, and vocabulary flashcard systems, you agree to adhere to these Terms of Service.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-6">
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">1. Permitted Use &amp; Educational Purpose</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our platform provides free access to multilingual translation, speech repetition synthesis (2x source word + 1x target translation), and client-side MP3 batch downloading. You are granted a personal, non-exclusive, revocable license to use the service for personal, educational, linguistic, and professional language-learning purposes.
          </p>
        </section>

        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">2. Intellectual Property &amp; User Content</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All proprietary interface elements, custom styling, audio concatenation engines, and brand assets belong to Translate Words, Texts &amp; Convert to MP3. Any text or vocabulary lists you input, import, or convert remain your intellectual property. We do not claim ownership of user-uploaded text or files.
          </p>
        </section>

        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">3. Disclaimer of Machine Translation Warranties</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Machine translation and automated synthetic voice pronunciation are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. While we strive to maintain high linguistic accuracy and natural vocal cadence, language nuances and colloquial idioms may occasionally vary. We disclaim any liability for errors, omissions, or misunderstandings resulting from automated translations.
          </p>
        </section>

        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">4. Acceptable User Conduct</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Users agree not to exploit the service through automated denial-of-service attacks, malicious scraping, or any attempts to compromise the security, infrastructure, or availability of our servers.
          </p>
        </section>

        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">5. Advertising &amp; Third-Party Services</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our service is supported by advertisements provided by Google AdSense and accredited advertising networks. Users interact with advertising materials subject to Google&apos;s Terms and third-party policies as detailed in our{' '}
            <button onClick={() => onNavigate('privacy')} className="text-amber-400 hover:underline font-semibold cursor-pointer">
              Privacy Policy
            </button>.
          </p>
        </section>

        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">6. Contact &amp; Governance</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If you have questions regarding these terms or wish to report a copyright or technical concern, please contact our legal representative:
          </p>
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-300">
              Official Email: <a href="mailto:doaa@transltor.xyz" className="text-amber-400 font-bold hover:underline">doaa@transltor.xyz</a>
            </span>
            <button
              onClick={() => onNavigate('contact')}
              className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
            >
              Contact Us ↗
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
