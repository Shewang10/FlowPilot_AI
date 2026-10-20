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
        <h3 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
          <Sliders className="h-4 w-4 text-blue-600" />
          <span>Configure Automation Pipeline</span>
        </h3>
        <span className="text-[11px] text-slate-500">
          Hybrid Local &bull; AI Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: Deterministic Engine */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">Local Deterministic Engine</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              $0.00 &bull; Local
            </span>
          </div>

          <div className="space-y-2.5">
            <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={cleaningOptions.normalizeNames}
                onChange={(e) =>
                  onChangeCleaning({ ...cleaningOptions, normalizeNames: e.target.checked })
                }
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white accent-blue-600"
              />
              <span>Normalize Casing (Names, Titles, Companies)</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={cleaningOptions.normalizePhones}
                onChange={(e) =>
                  onChangeCleaning({ ...cleaningOptions, normalizePhones: e.target.checked })
                }
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white accent-blue-600"
              />
              <span>Standardize Phone Formats (+1 (555) 019-XXXX)</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={cleaningOptions.normalizeWebsites}
                onChange={(e) =>
                  onChangeCleaning({ ...cleaningOptions, normalizeWebsites: e.target.checked })
                }
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white accent-blue-600"
              />
              <span>Clean Website URLs &amp; Canonical Domains</span>
            </label>

            <div className="pt-2.5 border-t border-slate-100">
              <label className="flex items-center space-x-2.5 text-xs text-slate-800 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleaningOptions.deduplicate}
                  onChange={(e) =>
                    onChangeCleaning({ ...cleaningOptions, deduplicate: e.target.checked })
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white accent-blue-600"
                />
                <span>Deduplicate Leads</span>
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
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
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

        {/* Module 2: AI Enrichment Engine */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">AI Language Intelligence</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isDemoMode
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {isDemoMode ? 'Demo Mode ($0)' : 'Gemini Free Tier'}
            </span>
          </div>

          <div className="space-y-3">
            <label className="flex items-start space-x-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={aiOptions.classifyTier}
                onChange={(e) =>
                  onChangeAI({ ...aiOptions, classifyTier: e.target.checked })
                }
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white accent-emerald-600"
              />
              <div>
                <span className="font-semibold text-slate-900">
                  Classify into ICP Tiers (A / B / C)
                </span>
                <p className="text-[11px] text-slate-500">
                  Scores leads based on decision maker seniority (VP, C-Level, Director) vs champions.
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={aiOptions.generateIcebreaker}
                onChange={(e) =>
                  onChangeAI({ ...aiOptions, generateIcebreaker: e.target.checked })
                }
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white accent-emerald-600"
              />
              <div>
                <span className="font-semibold text-slate-900">
                  Generate 1-Line Outreach Icebreakers
                </span>
                <p className="text-[11px] text-slate-500">
                  Drafts tailored cold email opening lines referencing prospect role and company niche.
                </p>
              </div>
            </label>

            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 leading-relaxed">
              💡 <strong className="text-emerald-700">Portfolio Tip</strong>: This dual tier + icebreaker deliverable sells on Fiverr for $25–$75 per 500 leads with zero API expenses.
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA with Logo-Inspired Gradient (Royal Blue -> Electric Cyan -> Emerald) */}
      <div className="pt-2">
        <button
          onClick={onRun}
          disabled={disabled || isProcessing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-700 hover:via-cyan-700 hover:to-emerald-600 text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing Pipeline... (Cleaning &amp; AI Enriching)</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-white" />
              <span>Run FlowPilot Automation Studio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
