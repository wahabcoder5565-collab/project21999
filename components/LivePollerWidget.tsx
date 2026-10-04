'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Radio, Zap, Globe, Sparkles, Check } from 'lucide-react';

interface LivePollerWidgetProps {
  onPoll: () => Promise<void>;
  isPolling: boolean;
}

export const LivePollerWidget: React.FC<LivePollerWidgetProps> = ({ onPoll, isPolling }) => {
  const [autoStream, setAutoStream] = useState(false);
  const [countdown, setCountdown] = useState(25);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (autoStream) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            onPoll().then(() => {
              setToastMessage('Streamed fresh 4K stock photos from web feeds!');
              setTimeout(() => setToastMessage(null), 3500);
            });
            return 25;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(25);
    }
    return () => clearInterval(interval);
  }, [autoStream, onPoll]);

  return (
    <>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-panel border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Check className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Bottom Stream Controller */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full glass-panel border border-white/10 shadow-2xl flex items-center gap-3 text-xs">
        
        <div className="flex items-center gap-2 pl-2">
          <div className={`w-2.5 h-2.5 rounded-full ${autoStream ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          <span className="font-semibold text-white">
            Live Web Feeder:
          </span>
        </div>

        {/* Auto Stream Switch */}
        <button
          onClick={() => setAutoStream(!autoStream)}
          className={`px-3 py-1 rounded-full font-bold transition-all ${
            autoStream 
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' 
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          {autoStream ? `Live (Poll in ${countdown}s)` : 'Enable Auto-Feed'}
        </button>

        {/* Instant Manual Poll */}
        <button
          onClick={async () => {
            await onPoll();
            setToastMessage('Polled fresh 4K stock photos from web!');
            setTimeout(() => setToastMessage(null), 3000);
          }}
          disabled={isPolling}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-500/20 transition-all active:scale-95"
        >
          <RefreshCw className={`w-3 h-3 ${isPolling ? 'animate-spin' : ''}`} />
          <span>{isPolling ? 'Fetching...' : 'Poll Now'}</span>
        </button>

      </div>
    </>
  );
};
