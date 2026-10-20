import React from 'react';
import { Sparkles, Sliders, Zap, ShieldCheck } from 'lucide-react';
import type { CleaningOptions, AIOptions } from '../types/data.ts';

interface TaskSelectorProps {
  cleaningOptions: CleaningOptions;
  onChangeCleaning: (opts: CleaningOptions) => void;
  aiOptions: AIOptions;
  onChangeAI: (opts: AIOptions) => void;
  onRun: () => void;
  isProcessing: boolean;
  disabled: boolean;
  isDemoMode: boolean;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  cleaningOptions,
  onChangeCleaning,
  aiOptions,
  onChangeAI,
  onRun,
  isProcessing,
  disabled,
  isDemoMode,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <span>Configure Automation Pipeline</span>
        </h3>
        <span className="text-[11px] text-slate-400">
          Hybrid Local &bull; AI Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: Deterministic Engine */}
        <div className="p-4 rounded-2xl bg-[#0c1527]/70 border border-slate-800 space-y-3 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-semibold text-white">Local Deterministic Engine</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25">
              $0.00 &bull; Local
            </span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={cleaningOptions.normalizeNames}
                onChange={(e) =>
                  onChangeCleaning({ ...cleaningOptions, normalizeNames: e.target.checked })
                }
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900 accent-cyan-500"
              />
              <span>Normalize Casing (Names, Titles, Companies)</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={cleaningOptions.normalizePhones}
                onChange={(e) =>
                  onChangeCleaning({ ...cleaningOptions, normalizePhones: e.target.checked })
                }
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900 accent-cyan-500"
              />
              <span>Standardize Phone Formats (+1 (555) 019-XXXX)</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={cleaningOptions.normalizeWebsites}
                onChange={(e) =>
                  onChangeCleaning({ ...cleaningOptions, normalizeWebsites: e.target.checked })
                }
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900 accent-cyan-500"
              />
              <span>Clean Website URLs & Canonical Domains</span>
            </label>

            <div className="pt-2 border-t border-slate-800/80">
              <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleaningOptions.deduplicate}
                  onChange={(e) =>
                    onChangeCleaning({ ...cleaningOptions, deduplicate: e.target.checked })
                  }
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900 accent-cyan-500"
                />
                <span className="font-semibold text-slate-200">Deduplicate Leads</span>
              </label>

              {cleaningOptions.deduplicate && (
                <div className="mt-2 ml-6">
                  <select
                    value={cleaningOptions.dedupeStrategy}
                    onChange={(e: any) =>
                      onChangeCleaning({
                        ...cleaningOptions,
                        dedupeStrategy: e.target.value,
                      })
                    }
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#070c17] border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="email_or_domain">
                      Email Match OR Company Domain Match (Recommended)
                    </option>
                    <option value="email">Exact Email Address Match Only</option>
                    <option value="domain">Company Domain Match Only</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module 2: AI Enrichment Engine (Matches [AI] Green Branding) */}
        <div className="p-4 rounded-2xl bg-[#0c1527]/70 border border-slate-800 space-y-3 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">AI Language Intelligence</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isDemoMode
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25'
              }`}
            >
              {isDemoMode ? 'Demo Mode ($0)' : 'Gemini Free Tier'}
            </span>
          </div>

          <div className="space-y-3">
            <label className="flex items-start space-x-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={aiOptions.classifyTier}
                onChange={(e) =>
                  onChangeAI({ ...aiOptions, classifyTier: e.target.checked })
                }
                className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900 accent-emerald-500"
              />
              <div>
                <span className="font-medium text-slate-200">
                  Classify into ICP Tiers (A / B / C)
                </span>
                <p className="text-[11px] text-slate-500">
                  Scores leads based on decision maker seniority (VP, C-Level, Director) vs champions.
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={aiOptions.generateIcebreaker}
                onChange={(e) =>
                  onChangeAI({ ...aiOptions, generateIcebreaker: e.target.checked })
                }
                className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900 accent-emerald-500"
              />
              <div>
                <span className="font-medium text-slate-200">
                  Generate 1-Line Outreach Icebreakers
                </span>
                <p className="text-[11px] text-slate-500">
                  Drafts tailored cold email opening lines referencing prospect role and company niche.
                </p>
              </div>
            </label>

            <div className="p-2.5 rounded-xl bg-[#070c17]/80 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
              💡 <strong className="text-emerald-400">Portfolio Tip</strong>: This dual tier + icebreaker deliverable sells on Fiverr for $25–$75 per 500 leads with zero API expenses.
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA with Logo-Inspired Gradient (Royal Blue -> Electric Cyan -> Emerald) */}
      <div className="pt-2">
        <button
          onClick={onRun}
          disabled={disabled || isProcessing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              <span>Processing Pipeline... (Cleaning & AI Enriching)</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-slate-950" />
              <span>Run FlowPilot Automation Studio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
