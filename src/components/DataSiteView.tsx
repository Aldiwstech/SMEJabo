import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Filter, 
  FileUp, 
  Download,
  AlertCircle
} from 'lucide-react';
import { Site } from '../types';
import { downloadMasterSiteTemplate } from '../utils/templateGenerator';

interface DataSiteViewProps {
  sites: Site[];
  onSelectSite: (site: Site) => void;
  onEditSite: (site: Site) => void;
  onDeleteSite: (siteId: string) => void;
  onAddSite: () => void;
  onOpenMasterImport: () => void;
  isAdmin: boolean;
  initialFilter?: string;
}

export const DataSiteView: React.FC<DataSiteViewProps> = ({
  sites,
  onSelectSite,
  onEditSite,
  onDeleteSite,
  onAddSite,
  onOpenMasterImport,
  isAdmin,
  initialFilter = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);

  const filteredSites = sites.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      s.id.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.cluster.toLowerCase().includes(q) ||
      (s.plnId && s.plnId.toLowerCase().includes(q)) ||
      (s.pic && s.pic.toLowerCase().includes(q)) ||
      (s.genset && s.genset.toLowerCase().includes(q)) ||
      (s.rect && s.rect.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'autodiscovered') return s.isAutoDiscovered;
    return s.status === statusFilter;
  });

  const autoDiscoveredCount = sites.filter((s) => s.isAutoDiscovered).length;

  return (
    <div className="space-y-4">
      
      {/* Top Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Site ID, Nama, ID Pelanggan PLN, Cluster, PIC..."
            className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={downloadMasterSiteTemplate}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700 transition"
            title="Download template Excel untuk diisi tim lapangan"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Template Master</span>
          </button>

          <button
            onClick={onOpenMasterImport}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700 transition font-medium"
          >
            <FileUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import Excel</span>
          </button>

          <button
            onClick={onAddSite}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-3.5 py-2 rounded-xl font-bold transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Tambah Site</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition ${
            statusFilter === 'all'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Semua ({sites.length})
        </button>

        <button
          onClick={() => setStatusFilter('Normal')}
          className={`px-3 py-1.5 rounded-xl font-medium transition ${
            statusFilter === 'Normal'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Normal ({sites.filter((s) => s.status === 'Normal').length})
        </button>

        <button
          onClick={() => setStatusFilter('Warning')}
          className={`px-3 py-1.5 rounded-xl font-medium transition ${
            statusFilter === 'Warning'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Warning ({sites.filter((s) => s.status === 'Warning').length})
        </button>

        <button
          onClick={() => setStatusFilter('Critical')}
          className={`px-3 py-1.5 rounded-xl font-medium transition ${
            statusFilter === 'Critical'
              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Critical ({sites.filter((s) => s.status === 'Critical').length})
        </button>

        {autoDiscoveredCount > 0 && (
          <button
            onClick={() => setStatusFilter('autodiscovered')}
            className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
              statusFilter === 'autodiscovered'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Auto OWS ({autoDiscoveredCount})</span>
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Site Info (Klik Detail)</th>
                <th className="py-3 px-4">PLN (Kapasitas & ID)</th>
                <th className="py-3 px-4">Genset</th>
                <th className="py-3 px-4">Rectifier & Battery</th>
                <th className="py-3 px-4">NMS Status</th>
                <th className="py-3 px-4">Health</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 italic">
                    Tidak ada site yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredSites.map((s) => {
                  const isNormal = s.status === 'Normal';
                  const isWarning = s.status === 'Warning';
                  const isCritical = s.status === 'Critical';

                  return (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition">
                      
                      {/* Site Info */}
                      <td className="py-3.5 px-4 font-medium">
                        <div
                          onClick={() => onSelectSite(s)}
                          className="cursor-pointer group flex flex-col focus:outline-none w-fit"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-amber-400 group-hover:underline text-sm tracking-wide">
                              {s.id}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-300 transition" />
                            {s.isAutoDiscovered && (
                              <span 
                                title="Site dibuat otomatis dari log alarm OWS. Klik Edit untuk melengkapi master data."
                                className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold rounded"
                              >
                                Auto OWS
                              </span>
                            )}
                          </div>
                          <span className="text-slate-300 text-xs font-medium">
                            {s.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Cluster: {s.cluster}
                          </span>
                        </div>
                      </td>

                      {/* PLN Capacity & ID */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        <div className="font-semibold text-white">{s.pln}</div>
                        <span className="text-[11px] text-amber-300/90 block">
                          ID: {s.plnId || '-'}
                        </span>
                      </td>

                      {/* Genset */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="font-medium text-slate-200">{s.genset}</div>
                        <span className="text-[10px] text-slate-500">
                          {isNormal ? 'Standby' : isWarning ? 'Running / Standby' : 'Fail / Off'}
                        </span>
                      </td>

                      {/* Rectifier & Battery */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="font-medium text-slate-200">{s.rect}</div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {s.batt}
                        </span>
                      </td>

                      {/* NMS Status & Power Badge */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full border inline-flex items-center gap-1 ${
                              isCritical
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : isWarning
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-red-400 animate-ping' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                            {s.status}
                          </span>

                          <span className="text-[10px] text-slate-400 block truncate max-w-[140px]" title={s.lastAlarm}>
                            {s.lastAlarm}
                          </span>
                        </div>
                      </td>

                      {/* Health Score */}
                      <td className="py-3.5 px-4 font-bold">
                        <span className={s.health > 80 ? 'text-emerald-400' : s.health > 60 ? 'text-amber-400' : 'text-red-400'}>
                          {s.health}%
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onEditSite(s)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition"
                            title={s.isAutoDiscovered ? "Lengkapi data master site ini" : "Edit data site"}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteSite(s.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition"
                            title="Hapus data site"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
