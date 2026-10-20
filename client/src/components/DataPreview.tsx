import React from 'react';
import { Eye } from 'lucide-react';
import type { RawLead } from '../types/data.ts';

interface DataPreviewProps {
  data: RawLead[];
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0] || {});
  const previewRows = data.slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
      <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
          <Eye className="h-4 w-4 text-blue-600" />
          <span>Raw Data Preview (First {previewRows.length} of {data.length} records)</span>
        </div>
        <span className="text-[11px] text-blue-700 font-mono font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          {headers.length} columns detected
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 uppercase font-semibold tracking-wider">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              {headers.map((h) => (
                <th key={h} className="py-2.5 px-3 font-semibold whitespace-nowrap text-slate-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {previewRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                <td className="py-2 px-3 text-slate-400 text-center font-mono text-[10px]">
                  {idx + 1}
                </td>
                {headers.map((h) => (
                  <td key={h} className="py-2 px-3 whitespace-nowrap max-w-xs truncate font-mono text-[11px]">
                    {row[h] || <span className="text-slate-400 italic">empty</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
