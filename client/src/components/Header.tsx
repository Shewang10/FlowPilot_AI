import React from 'react';
import { Settings, FileCheck2 } from 'lucide-react';
import logoSrc from '../assets/logo.png';

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
    <header className="border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <img
            src={logoSrc}
            alt="FlowPilot AI - Intelligent Workflow Guidance"
            className="h-10 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,163,224,0.15)]"
          />
          <span className="hidden sm:inline-flex text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm shadow-emerald-500/10">
            Studio MVP
          </span>
        </div>

        {/* Actions & Status */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadSample}
            disabled={isProcessing}
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 text-blue-200 border border-blue-800/60 transition-all hover:border-cyan-500/50 hover:shadow-sm hover:shadow-cyan-500/10 disabled:opacity-50 cursor-pointer"
            title="Load synthetic 11-row messy lead dataset with duplicates and bad formatting"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Load Sample Leads</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-sm"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isDemoMode ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
              }`}
            />
            <span className="font-medium">
              {isDemoMode ? 'Demo Mode ($0)' : 'Gemini Flash'}
            </span>
            <Settings className="h-3.5 w-3.5 text-slate-400 ml-0.5 hover:text-cyan-400 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};
