import { useState } from 'react';
import { Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { Header } from './components/Header.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { FileUpload } from './components/FileUpload.tsx';
import { DataPreview } from './components/DataPreview.tsx';
import { TaskSelector } from './components/TaskSelector.tsx';
import { ResultsTable } from './components/ResultsTable.tsx';
import { useAutomation } from './hooks/useAutomation.ts';
import logoSrc from './assets/logo.png';

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    rawData,
    setRawData,
    filename,
    setFilename,
    isProcessing,
    results,
    duplicates,
    summary,
    errorMsg,
    apiKey,
    handleSaveApiKey,
    isDemoMode,
    handleToggleDemoMode,
    cleaningOptions,
    setCleaningOptions,
    aiOptions,
    setAiOptions,
    loadSampleData,
    resetAll,
    runPipeline,
  } = useAutomation();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-cyan-200 selection:text-blue-900 relative overflow-x-hidden">
      {/* Soft Ambient Brand Mesh (Light Cobalt & Emerald) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[350px] bg-blue-100/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-[500px] h-[350px] bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <Header
        isDemoMode={isDemoMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLoadSample={loadSampleData}
        isProcessing={isProcessing}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Workspace Title & Value Proposition */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
              <span>B2B Lead Intelligence &amp; </span>
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Cleaning Studio
              </span>
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
              Turn raw, messy scraper exports into client-ready B2B lists with zero-cost local deduplication, phone/email normalization, and AI-powered ICP tiering.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Formula Injection Safe Exporter Active</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 text-xs shadow-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <span className="font-bold block text-rose-900">Processing Notice</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Step 1 & Step 2 Studio Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Data Ingestion (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Step 1 &bull; Ingest Business Data</span>
              </span>
              {rawData.length > 0 && (
                <span className="text-[11px] text-blue-700 font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                  {rawData.length} rows loaded
                </span>
              )}
            </div>

            <FileUpload
              onDataLoaded={(data, name) => {
                setRawData(data);
                setFilename(name);
              }}
              currentFilename={filename}
              rowCount={rawData.length}
              onReset={resetAll}
              onLoadSample={loadSampleData}
              isProcessing={isProcessing}
            />

            {rawData.length > 0 && <DataPreview data={rawData} />}
          </div>

          {/* Right Column: Automation Pipeline (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span>Step 2 &bull; Automation Pipeline</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Ready to execute
              </span>
            </div>

            <TaskSelector
              cleaningOptions={cleaningOptions}
              onChangeCleaning={setCleaningOptions}
              aiOptions={aiOptions}
              onChangeAI={setAiOptions}
              onRun={runPipeline}
              isProcessing={isProcessing}
              disabled={rawData.length === 0}
              isDemoMode={isDemoMode}
            />
          </div>
        </div>

        {/* Step 3: Processed Output Section */}
        {summary && (
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 3 &bull; Cleaned Results &amp; Intelligence
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono font-medium">
                {summary.uniqueRowsRemaining} verified leads ready for export
              </span>
            </div>

            <ResultsTable
              records={results}
              duplicates={duplicates}
              summary={summary}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-600 mt-auto shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <img src={logoSrc} alt="FlowPilot AI" className="h-7 w-auto drop-shadow-xs" />
            <span className="text-slate-600 font-medium">Portfolio-Grade AI Business Automation Studio</span>
          </div>
          <span className="text-slate-500">100% Free-Tier Architecture &bull; Built with React, Vite &amp; Node.js</span>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
      />
    </div>
  );
}
