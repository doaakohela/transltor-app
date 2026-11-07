import React, { useEffect } from 'react';

interface AdSenseSlotProps {
  slotId?: string;
  format?: 'leaderboard' | 'in-feed' | 'footer';
  className?: string;
}

/**
 * Google AdSense Compliant Slot Component
 * - Prevents Cumulative Layout Shift (CLS) with fixed min-heights
 * - Mandatory "ADVERTISEMENT" disclosure adhering to AdSense Policy
 * - Graceful fallback placeholder matching dark & light theme
 */
export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({
  slotId,
  format = 'leaderboard',
  className = '',
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        // Push ad request if AdSense script is present
        if (slotId && (window as any).adsbygoogle) {
          adsbygoogle.push({});
        }
      }
    } catch (e) {
      // Ignore adsbygoogle errors when ad blocker is active or script not loaded
    }
  }, [slotId]);

  // Dimension classes based on ad format (Google standard sizes)
  const getContainerStyle = () => {
    switch (format) {
      case 'leaderboard':
        return 'min-h-[90px] sm:min-h-[100px] w-full max-w-[728px] mx-auto';
      case 'in-feed':
        return 'min-h-[100px] sm:min-h-[120px] w-full max-w-4xl mx-auto';
      case 'footer':
        return 'min-h-[90px] sm:min-h-[100px] w-full max-w-[970px] mx-auto';
      default:
        return 'min-h-[90px] w-full';
    }
  };

  return (
    <div
      className={`my-4 flex flex-col items-center justify-center transition-colors duration-200 ${className}`}
      aria-label="Advertisement Container"
    >
      {/* AdSense Policy Mandatory Label */}
      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1 select-none">
        Advertisement
      </span>

      <div
        className={`${getContainerStyle()} relative rounded-xl border border-dashed border-slate-700/60 dark:border-slate-800 bg-slate-900/40 dark:bg-slate-950/60 flex items-center justify-center overflow-hidden p-2 text-center`}
      >
        {slotId ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with user's publisher ID
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 text-slate-500 text-xs py-3 px-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400/80 animate-pulse"></span>
              <span className="font-semibold text-slate-400">Google AdSense Responsive Unit</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-md">
              High-performance, non-intrusive ad placement reserved for Google AdSense monetization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
