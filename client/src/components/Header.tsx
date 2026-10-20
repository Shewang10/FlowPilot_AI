import React from 'react';
import { Sparkles, Settings, FileCheck2 } from 'lucide-react';

interface HeaderProps {
  isDemoMode: boolean;
  onOpenSettings: () => void;
  onLoadSample: () => void;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isDemoMode,
  onOpenSettings,
  onLoadSample,
  isProcessing
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                FlowPilot AI
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Studio MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Free-Tier AI Business Automation & Lead Studio
            </p>
          </div>
        </div>

        {/* Actions & Status */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadSample}
            disabled={isProcessing}
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-all hover:border-slate-600 disabled:opacity-50"
            title="Load synthetic 25-row messy lead dataset with duplicates and bad formatting"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Load Sample Data</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isDemoMode ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
              }`}
            />
            <span className="font-medium">
              {isDemoMode ? 'Demo Mode ($0)' : 'Gemini Flash'}
            </span>
            <Settings className="h-3.5 w-3.5 text-slate-400 ml-1" />
          </button>
        </div>
      </div>
    </header>
  );
};
