import { useState } from 'react';
import { Sparkles, FileSpreadsheet, ShieldCheck, Zap, ArrowRight, Settings } from 'lucide-react';

export default function App() {
  const [isDemoMode] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                FlowPilot AI
              </span>
              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Studio MVP
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <span className={`h-2 w-2 rounded-full ${isDemoMode ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
              <span>{isDemoMode ? 'Offline Demo Mode (100% Free)' : 'Gemini Flash Live'}</span>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            AI Business Data Automation Studio
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Clean messy lead lists, deduplicate records across domains, classify into ICP tiers, and generate 1-line personalized outreach hooks — 100% free with local processing and Gemini Flash.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Local Deterministic Cleaning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Phone normalization, domain extraction, casing fixes, and email deduplication executed locally with 0 API token cost.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Gemini AI Enrichment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyze prospect roles and company value propositions to craft high-conversion outreach icebreakers and score ICP fit.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Spreadsheet Security & Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built-in protection against CSV formula injection attacks and strict privacy disclosures before external AI processing.
            </p>
          </div>
        </div>

        {/* Placeholder Studio Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Studio Core Ready for Setup</h2>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            Frontend scaffolding and UI system initialized. Ready to install client and server packages.
          </p>
          <div className="inline-flex items-center space-x-2 text-xs font-medium px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 cursor-pointer transition-colors">
            <span>Continue Milestone 1</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        FlowPilot AI Studio &bull; 100% Free-Tier Architecture &bull; Local & Offline Compatible
      </footer>
    </div>
  );
}
