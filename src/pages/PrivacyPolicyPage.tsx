import React from 'react';
import { Shield, Mail, ArrowLeft, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { AppView } from '../types.ts';

interface PrivacyPolicyPageProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 text-left animate-fade-in">
      {/* Top Breadcrumb & Back Button */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Translation Studio</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Last Updated: November 2026 · AdSense Verified
        </span>
      </div>

      {/* Hero Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>Official Legal Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
          At <strong className="text-slate-200">Translate Words, Texts &amp; Convert to MP3</strong> (available at{' '}
          <a href="https://www.transltor.xyz" className="text-amber-400 hover:underline">www.transltor.xyz</a>),
          we respect your personal privacy. This Privacy Policy outlines the types of information collected, how it is used,
          and our strict adherence to Google AdSense policies and international data protection laws (GDPR &amp; CCPA).
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Policy Contents</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
          <li>• <a href="#adsense" className="hover:text-amber-400">1. Google AdSense &amp; Advertising Cookies</a></li>
          <li>• <a href="#data-collection" className="hover:text-amber-400">2. Information We Collect</a></li>
          <li>• <a href="#log-files" className="hover:text-amber-400">3. Log Files &amp; Web Beacons</a></li>
          <li>• <a href="#audio-privacy" className="hover:text-amber-400">4. Audio &amp; Translation Data Privacy</a></li>
          <li>• <a href="#gdpr-ccpa" className="hover:text-amber-400">5. GDPR &amp; CCPA Privacy Rights</a></li>
          <li>• <a href="#contact" className="hover:text-amber-400">6. Official Contact Information</a></li>
        </ul>
      </div>

      {/* Section 1: Google AdSense Mandatory Disclosures */}
      <section id="adsense" className="space-y-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">1</span>
          <h2 className="text-lg font-bold text-white">Google AdSense &amp; Third-Party Cookies Disclosure</h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            We use <strong className="text-white">Google AdSense</strong> to display advertisements when you visit our website.
            Google, as a third-party vendor, uses cookies to serve ads on our site:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              <strong className="text-slate-100">DoubleClick DART Cookie:</strong> Google&apos;s use of the DART cookie enables it to serve ads to users based on their visit to our site and other websites on the Internet.
            </li>
            <li>
              <strong className="text-slate-100">Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting the official Google Ads Settings page:{' '}
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
              Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>www.aboutads.info</span>
                <ExternalLink className="w-3 h-3" />
              </a>.
            </li>
            <li>
              Third-party ad servers or ad networks use technology that sends advertisements and links directly to your browser. They automatically receive your IP address when this occurs. Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by third-party ad networks to measure the effectiveness of their advertisements and/or to personalize the advertising content that you see.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 2: Information We Collect */}
      <section id="data-collection" className="space-y-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">2</span>
          <h2 className="text-lg font-bold text-white">Information We Collect &amp; Local Storage</h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            We prioritize zero unnecessary data collection. When you use our language workstation:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              <strong className="text-slate-100">Client-Side Vocabulary Lists:</strong> Your saved words, vocabulary cards, and custom preferences are stored directly in your browser&apos;s local storage (<code className="text-amber-300 text-xs">localStorage</code>). We do not transmit or store your personal vocabulary lists on central marketing servers.
            </li>
            <li>
              <strong className="text-slate-100">Theme Preference:</strong> We store whether you prefer Day Mode or Night Mode locally on your device.
            </li>
            <li>
              <strong className="text-slate-100">Contact Information:</strong> If you reach out to our team via email (<code className="text-amber-300">doaa@transltor.xyz</code>), we only retain your email address and message content long enough to resolve your customer support inquiry.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 3: Log Files */}
      <section id="log-files" className="space-y-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">3</span>
          <h2 className="text-lg font-bold text-white">Log Files</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Like many standard web platforms, we utilize log files to maintain server reliability, diagnose technical faults, and monitor general traffic trends. The information inside log files includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and number of clicks. This information is not linked to any personally identifiable information.
        </p>
      </section>

      {/* Section 4: Audio & Translation Privacy */}
      <section id="audio-privacy" className="space-y-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">4</span>
          <h2 className="text-lg font-bold text-white">Audio &amp; Translation Data Privacy</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          When you enter words to translate or convert into MP3 files:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-300">
          <li>
            Translations are queried via encrypted HTTPS connections.
          </li>
          <li>
            Audio generation and MP3 encoding take place client-side using Web Audio and the LAME MP3 encoding library, ensuring complete privacy for your custom study lists.
          </li>
          <li>
            We never sell, monetize, or harvest your private texts, translation logs, or uploaded learning documents.
          </li>
        </ul>
      </section>

      {/* Section 5: GDPR & CCPA */}
      <section id="gdpr-ccpa" className="space-y-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">5</span>
          <h2 className="text-lg font-bold text-white">GDPR &amp; CCPA Privacy Rights</h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            Under European (GDPR) and California (CCPA) data protection frameworks, users are entitled to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong className="text-slate-100">The Right to Access:</strong> You have the right to request copies of any personal data we hold.</li>
            <li><strong className="text-slate-100">The Right to Erasure:</strong> You can delete all locally saved words at any time using the &quot;Clear List&quot; button.</li>
            <li><strong className="text-slate-100">The Right to Object / Opt-Out:</strong> You have the right to opt out of third-party advertising cookies via the links in Section 1.</li>
          </ul>
        </div>
      </section>

      {/* Section 6: Official Contact */}
      <section id="contact" className="space-y-4 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Official Data Controller &amp; Inquiries</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          If you have any questions, suggestions, or concerns regarding our privacy practices, our dedicated team is at your disposal:
        </p>
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-400">Official Webmaster &amp; Privacy Officer Email:</div>
            <a href="mailto:doaa@transltor.xyz" className="text-sm sm:text-base font-bold text-amber-400 hover:underline">
              doaa@transltor.xyz
            </a>
            <div className="text-[11px] text-slate-500 mt-0.5">Primary Domain: www.transltor.xyz (doaa.transltor.xyz)</div>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Open Contact Form ↗
          </button>
        </div>
      </section>
    </div>
  );
};
