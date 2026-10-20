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
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <img
            src={logoSrc}
            alt="FlowPilot AI - Intelligent Workflow Guidance"
            className="h-10 w-auto object-contain"
          />
          <span className="hidden sm:inline-flex text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            Studio MVP
          </span>
        </div>

        {/* Actions & Status */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadSample}
            disabled={isProcessing}
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-200 transition-all hover:shadow-xs disabled:opacity-50 cursor-pointer"
            title="Load synthetic 11-row messy lead dataset with duplicates and bad formatting"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-blue-600" />
            <span>Load Sample Leads</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isDemoMode ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-blue-500 ring-2 ring-blue-200'
              }`}
            />
            <span>
              {isDemoMode ? 'Demo Mode ($0)' : 'Gemini Flash'}
            </span>
            <Settings className="h-3.5 w-3.5 text-slate-500 ml-0.5 hover:text-slate-800 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};
