import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  BatteryCharging, 
  Zap,
  Trash2
} from 'lucide-react';
import { StatusHistoryItem } from '../types';

interface HistoryViewProps {
  history: StatusHistoryItem[];
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClearHistory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTo, setFilterTo] = useState('all');

  const filtered = history.filter((h) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      h.id.toLowerCase().includes(q) ||
      h.name.toLowerCase().includes(q) ||
      h.source.toLowerCase().includes(q) ||
      h.detail.toLowerCase().includes(q);

    if (!matchSearch) return false;
    if (filterTo === 'all') return true;
    return h.to === filterTo;
  });

  const criticalCount = history.filter((h) => h.to === 'Critical').length;
  const warningCount = history.filter((h) => h.to === 'Warning').length;
  const normalCount = history.filter((h) => h.to === 'Normal').length;

  const renderBadge = (status: string) => {
    if (status === 'Critical') {
      return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Critical</span>;
    }
    if (status === 'Warning') {
      return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Warning</span>;
    }
    if (status === 'Normal') {
      return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Normal</span>;
    }
    return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-slate-800 text-slate-400">{status}</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-3 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center">
          <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider block">Transisi Ke Critical</span>
          <div className="text-2xl font-black text-red-400 mt-1">{criticalCount}</div>
          <span className="text-[10px] text-slate-500">Peristiwa</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center">
          <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">Transisi Ke Warning</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{warningCount}</div>
          <span className="text-[10px] text-slate-500">Peristiwa</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center">
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Kembali Normal (PLN OK)</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{normalCount}</div>
          <span className="text-[10px] text-slate-500">Pemulihan</span>
        </div>
      </div>

      {/* History Table Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Audit Trail Perubahan Status Site ({filtered.length})
            </h3>
            <p className="text-[11px] text-slate-400">
              Tercatat otomatis setiap kali ada import OWS, edit manual, atau eksekusi PM.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs px-3 py-1.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Semua Status</option>
              <option value="Critical">Menjadi Critical</option>
              <option value="Warning">Menjadi Warning</option>
              <option value="Normal">Menjadi Normal</option>
            </select>

            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition border border-slate-700"
                title="Hapus Riwayat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Site ID, Nama, Sumber Log..."
            className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px] sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Waktu Kejadian</th>
                <th className="py-2.5 px-3">Site ID & Nama</th>
                <th className="py-2.5 px-3">Perubahan Status</th>
                <th className="py-2.5 px-3">Sumber Data</th>
                <th className="py-2.5 px-3">Keterangan / Alarm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 italic font-sans">
                    Belum ada riwayat perubahan status tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition font-sans">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap text-[11px] font-mono">
                      {new Date(item.ts).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      <div className="font-extrabold text-white font-mono">{item.id}</div>
                      <div className="text-[10px] text-slate-400">{item.name}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {renderBadge(item.from)}
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        {renderBadge(item.to)}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-semibold text-xs">
                      {item.source}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-xs">
                      {item.detail}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
