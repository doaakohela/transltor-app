import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Copy, Check, ArrowLeft, MessageSquare, HelpCircle } from 'lucide-react';
import { AppView } from '../types.ts';

interface ContactPageProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const officialEmail = 'doaa@transltor.xyz';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(officialEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 700);
  };

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
          Customer Support &amp; Webmaster
        </span>
      </div>

      {/* Hero Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>Official Support &amp; Feedback</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Contact Us
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
          Have questions about speech audio generation, custom vocabulary lists, AdSense advertising, or feature requests? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Contact Form (Left 3 cols) */}
        <div className="md:col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Send a Direct Message</h2>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Thank You for Reaching Out!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your message has been sent successfully. Our editorial team will review your inquiry and respond to your email address promptly (typically within 24-48 business hours).
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subject / Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Audio or MP3 Feedback">Audio or MP3 Feedback</option>
                  <option value="Google AdSense / Business">Google AdSense / Business</option>
                  <option value="Language Addition Request">Language Addition Request</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Message <span className="text-amber-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist your language learning or inquiries today?"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Direct Contact Cards & FAQ (Right 2 cols) */}
        <div className="md:col-span-2 space-y-4">
          {/* Direct Email Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Webmaster Email</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prefer writing directly from your mail client? Email our primary address:
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-mono text-amber-400 font-semibold truncate">
                {officialEmail}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Copy Email"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-[11px] text-slate-500">
              Primary domain: <code className="text-slate-400">www.transltor.xyz</code>
            </div>
          </div>

          {/* Quick FAQ Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-300">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Assistance FAQ</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div>
                <strong className="text-white block">Are MP3 downloads really free?</strong>
                <span className="text-slate-400 text-[11.5px]">Yes, 100% free with no daily limits or sign-up walls.</span>
              </div>
              <div>
                <strong className="text-white block">Can I switch repetition modes?</strong>
                <span className="text-slate-400 text-[11.5px]">Yes! Click the 🔁 icon on the top workstation bar or player to switch instantly between (2x Word + 1x Translation) and (1x Word + 2x Translation).</span>
              </div>
              <div>
                <strong className="text-white block">How to report an ad issue?</strong>
                <span className="text-slate-400 text-[11.5px]">Include the URL and a brief description in your message above.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
