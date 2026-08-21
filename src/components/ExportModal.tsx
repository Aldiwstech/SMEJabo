import React from 'react';
import { X, FileSpreadsheet, FileText, Download } from 'lucide-react';
import { Site } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  sitesCount: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExportExcel,
  onExportPDF,
  sitesCount
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Export Laporan SME</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Laporan mencakup data terkini ({sitesCount} site), ringkasan kondisi daya, log alarm OWS, dan jadwal PM.
        </p>

        <div className="space-y-2.5 pt-1">
          <button
            onClick={() => {
              onExportExcel();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3.5 bg-slate-950 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition text-left group"
          >
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Export Excel (.xlsx)</div>
              <div className="text-[10px] text-slate-400">Multi-sheet: Ringkasan, Master Site, OWS Alarm, PM, History</div>
            </div>
          </button>

          <button
            onClick={() => {
              onExportPDF();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3.5 bg-slate-950 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/40 rounded-2xl transition text-left group"
          >
            <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl group-hover:scale-110 transition">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Export PDF Siap Cetak</div>
              <div className="text-[10px] text-slate-400">Format ringkas resmi untuk laporan ke atasan / manajemen</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
