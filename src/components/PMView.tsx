import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  FileUp, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Edit3,
  Trash2
} from 'lucide-react';
import { PMSchedule, Site } from '../types';
import { getPMReasonLabel } from '../data/initialData';
import { downloadPMTemplate } from '../utils/templateGenerator';

interface PMViewProps {
  pmData: PMSchedule[];
  sites: Site[];
  onOpenPMForm: (schedule?: PMSchedule) => void;
  onOpenPMReasonModal: (schedule: PMSchedule) => void;
  onMarkAchieved: (schedule: PMSchedule) => void;
  onDeletePM: (id: string, month: string) => void;
  onOpenPMImport: () => void;
  onSelectSiteId: (siteId: string) => void;
  isAdmin: boolean;
}

export const PMView: React.FC<PMViewProps> = ({
  pmData,
  sites,
  onOpenPMForm,
  onOpenPMReasonModal,
  onMarkAchieved,
  onDeletePM,
  onOpenPMImport,
  onSelectSiteId,
  isAdmin
}) => {
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);

  const months = Array.from(
    new Set([currentMonthStr, ...pmData.map((p) => p.month)])
  ).sort().reverse();

  const filteredPM = selectedMonth === 'all'
    ? pmData
    : pmData.filter((p) => p.month === selectedMonth);

  const total = filteredPM.length;
  const achieved = filteredPM.filter((p) => p.status === 'Achieved').length;
  const notAchieved = filteredPM.filter((p) => p.status === 'Not Achieved').length;
  const scheduled = filteredPM.filter((p) => p.status === 'Scheduled').length;
  const rate = total > 0 ? Math.round((achieved / total) * 100) : 0;

  const formatMonth = (str: string) => {
    if (!str || str === 'all') return 'Semua Periode';
    const [y, m] = str.split('-');
    const monthsId = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${monthsId[parseInt(m, 10) - 1] || m} ${y}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Preventive Maintenance (PM) Tracker
              </h2>
              <p className="text-xs text-slate-400">
                Pencatatan target & realisasi servis rutin kelistrikan site bulanan.
              </p>
            </div>
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
            >
              <option value="all">Semua Periode</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {formatMonth(m)}
                </option>
              ))}
            </select>

            <button
              onClick={downloadPMTemplate}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 transition"
              title="Download format Excel PM"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Template PM</span>
            </button>

            <button
              onClick={onOpenPMImport}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-xl transition font-semibold"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={() => onOpenPMForm()}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-3 py-2 rounded-xl font-bold transition"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Tambah PM</span>
            </button>
          </div>
        </div>

        {/* 4 PM Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Terjadwal</span>
            <div className="text-2xl font-black text-white mt-1">{total}</div>
            <span className="text-[10px] text-slate-500">Site PM</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Achieved</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{achieved}</div>
            <span className="text-[10px] text-emerald-500 font-semibold">Terselesaikan</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Not Achieved</span>
            <div className="text-2xl font-black text-red-400 mt-1">{notAchieved}</div>
            <span className="text-[10px] text-red-400 font-semibold">Terkendala</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Achievement Rate</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{rate}%</div>
            <span className="text-[10px] text-amber-500 font-semibold">Tingkat Pencapaian</span>
          </div>
        </div>
      </div>

      {/* PM List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPM.length === 0 ? (
          <div className="col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
            Belum ada jadwal PM untuk periode ini. Klik "Tambah PM" atau "Import Excel" untuk mulai.
          </div>
        ) : (
          filteredPM.map((p) => {
            const isAchieved = p.status === 'Achieved';
            const isNotAchieved = p.status === 'Not Achieved';

            return (
              <div
                key={`${p.id}-${p.month}`}
                className={`p-4 rounded-2xl border transition shadow-sm space-y-3.5 bg-slate-900/80 ${
                  isAchieved
                    ? 'border-emerald-500/30'
                    : isNotAchieved
                    ? 'border-red-500/30'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectSiteId(p.id)}
                        className="font-extrabold text-sm text-white hover:text-amber-400 transition flex items-center gap-1"
                      >
                        <span>{p.id}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                      <span className="text-xs text-slate-300 font-semibold">{p.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      PIC: <strong className="text-slate-200">{p.pic}</strong> • Periode: {formatMonth(p.month)}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border whitespace-nowrap ${
                      isAchieved
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : isNotAchieved
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Scope items */}
                <div className="text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">
                    Scope / Checklist Servis:
                  </span>
                  <p className="mt-0.5">{p.items}</p>
                </div>

                {/* Reason if Not Achieved */}
                {isNotAchieved && (
                  <div className="text-xs bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl text-red-300 space-y-1">
                    <span className="text-[10px] text-red-400 block uppercase font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Alasan Belum Tercapai:
                    </span>
                    <p className="font-semibold">{getPMReasonLabel(p.reasonCode)}</p>
                    {p.reasonNote && (
                      <p className="text-[11px] text-slate-400">{p.reasonNote}</p>
                    )}
                  </div>
                )}

                {/* Completed info */}
                {isAchieved && p.completedDate && (
                  <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selesai dilaksanakan pada: {p.completedDate}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenPMForm(p)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition"
                      title="Edit jadwal PM"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeletePM(p.id, p.month)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition"
                      title="Hapus jadwal PM"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isAchieved && (
                      <button
                        onClick={() => onMarkAchieved(p)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Achieved</span>
                      </button>
                    )}

                    {!isNotAchieved && (
                      <button
                        onClick={() => onOpenPMReasonModal(p)}
                        className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Not Achieved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
