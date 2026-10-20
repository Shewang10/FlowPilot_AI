import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import type { RawLead } from '../types/data.ts';

interface FileUploadProps {
  onDataLoaded: (data: RawLead[], filename: string) => void;
  currentFilename?: string;
  rowCount: number;
  onReset: () => void;
  onLoadSample: () => void;
  isProcessing: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit for free local processing

export const FileUpload: React.FC<FileUploadProps> = ({
  onDataLoaded,
  currentFilename,
  rowCount,
  onReset,
  onLoadSample,
  isProcessing,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCsvFile = (file: File) => {
    setErrorMsg(null);

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMsg('Please upload a valid .csv file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg('File exceeds the 5MB size limit for free-tier local processing.');
      return;
    }

    Papa.parse<RawLead>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          const firstErr = results.errors[0];
          console.warn('[CSV Parse Warning]', results.errors);
          if (!results.data || results.data.length === 0) {
            setErrorMsg(`CSV parsing failed: ${firstErr?.message || 'Malformed structure'}`);
            return;
          }
        }

        if (!results.data || results.data.length === 0) {
          setErrorMsg('The uploaded CSV file contains no data rows.');
          return;
        }

        onDataLoaded(results.data, file.name);
      },
      error: (error) => {
        setErrorMsg(`Failed to parse CSV: ${error.message}`);
      },
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file) processCsvFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) processCsvFile(file);
    }
  };

  return (
    <div className="space-y-3">
      {currentFilename ? (
        // File Loaded State
        <div className="p-4 rounded-2xl bg-[#0c1527]/80 border border-slate-800 flex items-center justify-between shadow-lg shadow-black/20">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/10">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-white">{currentFilename}</span>
                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{rowCount} rows detected</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">Ready for cleaning, deduplication, and enrichment</p>
            </div>
          </div>

          <button
            onClick={onReset}
            disabled={isProcessing}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            title="Upload different file"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      ) : (
        // Dropzone Area
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
              : 'border-slate-800 hover:border-cyan-500/40 bg-[#0a1222]/50 hover:bg-[#0c162a]/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-emerald-400/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/10">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Click to upload or drag & drop CSV file
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports CRM exports, Apollo scrapes, Google Sheets CSVs (Max 5MB)
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadSample();
                }}
                className="text-xs font-semibold text-cyan-400 hover:text-emerald-400 underline underline-offset-4 transition-colors cursor-pointer"
              >
                Or load synthetic messy lead dataset
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
