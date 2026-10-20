import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  Sparkles,
  Clock,
  Info
} from 'lucide-react';
import type { NormalizedLead, ProcessSummary } from '../types/data.ts';
import { exportLeadsToCsv } from '../utils/csvExport.ts';

interface ResultsTableProps {
  records: NormalizedLead[];
  duplicates: NormalizedLead[];
  summary: ProcessSummary;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ records, duplicates, summary }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'tierA' | 'tierB' | 'tierC' | 'duplicates'>('all');
  const [selectedLead, setSelectedLead] = useState<NormalizedLead | null>(null);

  // Filter records based on tab and search
  const displayedRecords = useMemo(() => {
    let dataset = activeTab === 'duplicates' ? duplicates : records;

    if (activeTab === 'tierA') {
      dataset = dataset.filter((r) => r.tier === 'Tier A');
    } else if (activeTab === 'tierB') {
      dataset = dataset.filter((r) => r.tier === 'Tier B');
    } else if (activeTab === 'tierC') {
      dataset = dataset.filter((r) => r.tier === 'Tier C');
    }

    if (!searchQuery.trim()) return dataset;
    const q = searchQuery.toLowerCase().trim();

    return dataset.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.icebreaker && r.icebreaker.toLowerCase().includes(q))
    );
  }, [records, duplicates, activeTab, searchQuery]);

  const handleExport = () => {
    const filename = activeTab === 'duplicates' ? 'flagged_duplicate_leads.csv' : 'flowpilot_cleaned_leads.csv';
    exportLeadsToCsv(displayedRecords, filename);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-[#0c1527]/70 border border-slate-800 shadow-lg shadow-black/20">
          <span className="text-[11px] text-slate-400 font-medium">Input Rows</span>
          <div className="text-xl font-bold text-white mt-1">{summary.totalInputRows}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1527]/70 border border-slate-800 shadow-lg shadow-black/20">
          <span className="text-[11px] text-slate-400 font-medium">Cleaned Fields</span>
          <div className="text-xl font-bold text-cyan-400 mt-1">{summary.cleanedCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1527]/70 border border-slate-800 shadow-lg shadow-black/20">
          <span className="text-[11px] text-slate-400 font-medium">Duplicates Removed</span>
          <div className="text-xl font-bold text-rose-400 mt-1">{summary.duplicatesFound}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1527]/70 border border-slate-800 shadow-lg shadow-black/20">
          <span className="text-[11px] text-slate-400 font-medium">Cleaned Leads Ready</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">{summary.uniqueRowsRemaining}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1527]/70 border border-slate-800 col-span-2 sm:col-span-1 shadow-lg shadow-black/20">
          <span className="text-[11px] text-slate-400 font-medium">Processing Time</span>
          <div className="text-xl font-bold text-blue-400 mt-1 flex items-center space-x-1">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{(summary.durationMs / 1000).toFixed(2)}s</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c1527]/70 overflow-hidden shadow-2xl shadow-black/30">
        {/* Table Controls Header */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0a1222]/80">
          {/* Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              All Unique ({records.length})
            </button>
            <button
              onClick={() => setActiveTab('tierA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'tierA'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60'
              }`}
            >
              Tier A ({records.filter((r) => r.tier === 'Tier A').length})
            </button>
            <button
              onClick={() => setActiveTab('tierB')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'tierB'
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60'
              }`}
            >
              Tier B ({records.filter((r) => r.tier === 'Tier B').length})
            </button>
            <button
              onClick={() => setActiveTab('tierC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'tierC'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Tier C ({records.filter((r) => r.tier === 'Tier C').length})
            </button>
            <button
              onClick={() => setActiveTab('duplicates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'duplicates'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/30'
                  : 'text-rose-400/80 hover:text-rose-300 hover:bg-slate-800/60'
              }`}
            >
              Duplicates ({duplicates.length})
            </button>
          </div>

          {/* Search and Export */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 md:w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#070c17] border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleExport}
              disabled={displayedRecords.length === 0}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-[#070b14]/95 border-b border-slate-800 text-slate-400 uppercase font-medium tracking-wider z-10 backdrop-blur-sm">
              <tr>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Company & Title</th>
                <th className="py-3 px-4">Email & Phone</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">AI Personalization Hook</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No records match the current filter or query.
                  </td>
                </tr>
              ) : (
                displayedRecords.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-cyan-500/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{lead.fullName || 'No Name'}</div>
                      {lead.cleanedFields.includes('firstName') || lead.cleanedFields.includes('lastName') ? (
                        <span className="text-[10px] text-cyan-400 font-mono">Normalized Casing</span>
                      ) : null}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{lead.company || '-'}</div>
                      <div className="text-slate-400 text-[11px]">{lead.title || '-'}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                      <div className="text-slate-300">{lead.email || '-'}</div>
                      <div className="text-slate-500">{lead.phone || '-'}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {lead.isDuplicate ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25">
                          Duplicate Flagged
                        </span>
                      ) : lead.tier === 'Tier A' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                          Tier A &bull; Decision Maker
                        </span>
                      ) : lead.tier === 'Tier B' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          Tier B &bull; Champion
                        </span>
                      ) : lead.tier === 'Tier C' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700/60">
                          Tier C &bull; General
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      {lead.isDuplicate ? (
                        <span className="text-xs text-rose-300 font-medium">{lead.duplicateReason}</span>
                      ) : lead.icebreaker ? (
                        <p className="text-xs text-slate-300 line-clamp-2 italic">
                          "{lead.icebreaker}"
                        </p>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b1324] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080e1c]">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Lead Intelligence Dossier</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedLead.fullName}</h2>
                <p className="text-slate-400">{selectedLead.title} &bull; {selectedLead.company}</p>
              </div>

              {selectedLead.tier && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                  <div className="font-semibold text-emerald-300">
                    ICP Classification: {selectedLead.tier}
                  </div>
                  <p className="text-emerald-200/80 text-xs">{selectedLead.aiReasoning}</p>
                </div>
              )}

              {selectedLead.icebreaker && (
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 space-y-1">
                  <div className="font-semibold text-cyan-300">AI Cold Outreach Hook</div>
                  <p className="text-slate-200 italic">"{selectedLead.icebreaker}"</p>
                </div>
              )}

              {selectedLead.duplicateReason && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1">
                  <div className="font-semibold text-rose-300">Duplicate Audit Reason</div>
                  <p className="text-rose-200">{selectedLead.duplicateReason}</p>
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Normalized Contact Data
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-[#070c17] border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase font-sans">Email</span>
                    {selectedLead.email || 'None'}
                  </div>
                  <div className="p-2 rounded-lg bg-[#070c17] border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase font-sans">Phone</span>
                    {selectedLead.phone || 'None'}
                  </div>
                  <div className="p-2 rounded-lg bg-[#070c17] border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase font-sans">Website</span>
                    {selectedLead.website || 'None'}
                  </div>
                  <div className="p-2 rounded-lg bg-[#070c17] border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase font-sans">Cleaned Fields</span>
                    {selectedLead.cleanedFields.join(', ') || 'None'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
