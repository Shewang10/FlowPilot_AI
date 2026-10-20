import React, { useState } from 'react';
import { X, Key, Shield, AlertTriangle, CheckCircle, RefreshCw, Zap } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: inputKey }),
      });
      const data = await res.json();
      setTestResult({
        valid: data.valid,
        message: data.message,
      });
      if (data.valid) {
        onSaveApiKey(inputKey);
      }
    } catch (err: any) {
      setTestResult({
        valid: false,
        message: 'Could not connect to backend server. Ensure server is running on port 3001.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveApiKey(inputKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Automation Studio Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Demo Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>Deterministic Offline Demo Mode</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Uses local deterministic algorithms. Requires zero API keys and 0 internet requests.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => onToggleDemoMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Gemini API Key Configuration */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Google Gemini Flash API Key (Optional)
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Get a free API key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-700 font-medium"
              >
                Google AI Studio
              </a>
              . Free tier includes 15 RPM and 1,500 RPD at $0 cost.
            </p>
          </div>

          {/* Test Connection Button & Result */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleTestKey}
              disabled={testing || !inputKey.trim()}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-700 border border-blue-200 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {testing ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
              ) : (
                <Zap className="h-3.5 w-3.5 text-blue-600" />
              )}
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>
            {testResult && (
              <div
                className={`text-xs flex items-center space-x-1.5 font-medium ${
                  testResult.valid ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {testResult.valid ? (
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                )}
                <span className="truncate max-w-[280px]">{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Data Privacy & Quota Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Free-Tier Privacy &amp; Compliance Note</span>
            </div>
            <p className="leading-relaxed">
              Google AI Studio free tier logs prompt traffic for model training. Do not submit sensitive PII or confidential company data. Keep <strong>Demo Mode</strong> active for confidential client datasets.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
