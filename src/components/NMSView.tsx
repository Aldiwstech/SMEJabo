import React, { useState } from 'react';
import { 
  Radio, 
  Upload, 
  ClipboardPaste, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Trash2, 
  FileSpreadsheet, 
  Download,
  Info
} from 'lucide-react';
import { NMSLog, Site } from '../types';
import { downloadSampleOWSFeed } from '../utils/templateGenerator';

interface NMSViewProps {
  nmsLogs: NMSLog[];
  onFileUpload: (file: File) => void;
  onTextPaste: (text: string) => void;
  onClearLogs: () => void;
  onSimulateDemo: () => void;
  onSelectSiteId: (siteId: string) => void;
  lastSyncTime: string;
}

export const NMSView: React.FC<NMSViewProps> = ({
  nmsLogs,
  onFileUpload,
  onTextPaste,
  onClearLogs,
  onSimulateDemo,
  onSelectSiteId,
  lastSyncTime
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'simulator'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('all');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    onTextPaste(pastedText);
    setPastedText('');
  };

  const filteredLogs = nmsLogs.filter((log) => {
    if (filterSeverity === 'all') return true;
    if (filterSeverity === 'critical') return log.rank === 3;
    if (filterSeverity === 'warning') return log.rank === 2;
    if (filterSeverity === 'cleared') return log.cleared;
    return true;
  });

  const autoCreatedCount = nmsLogs.filter((l) => l.isAutoCreated).length;

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>OWS Live Alarm & Telemetry Hub</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">
                  Auto-Discovery Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pusat penarikan data alarm Huawei OWS / NCE / U2000. Site yang belum ada di master data akan otomatis dibuat tanpa eror.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadSampleOWSFeed}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 transition"
              title="Download file contoh OWS untuk tes format"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sample File OWS</span>
            </button>

            {nmsLogs.length > 0 && (
              <button
                onClick={onClearLogs}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs px-3 py-2 rounded-xl border border-slate-700 transition"
                title="Reset log alarm OWS"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Alarm</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Input Tabs */}
        <div className="space-y-3">
          <div className="flex gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'upload'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>1. Upload File (.xlsx / .csv)</span>
            </button>

            <button
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'paste'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>2. Paste Langsung dari OWS (Text / TSV)</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'simulator'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>3. Demo Simulator</span>
            </button>
          </div>

          {/* Tab 1: Upload */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                dragOver
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
              onClick={() => document.getElementById('owsFileInput')?.click()}
            >
              <input
                type="file"
                id="owsFileInput"
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
              />
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-full">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-white">
                Drag & drop file export OWS di sini, atau <span className="text-amber-400 underline">klik untuk memilih file</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Mendukung file Excel (.xlsx, .xls) dan CSV dari OWS Huawei, NCE-T, NCE-FAN, dan U2000.
              </p>
            </div>
          )}

          {/* Tab 2: Paste Raw */}
          {activeTab === 'paste' && (
            <form onSubmit={handlePasteSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>Paste baris alarm yang di-copy dari tabel OWS (Ctrl+V):</span>
                  <span className="text-slate-500">Auto-detect delimiter (Tab/Comma/Semicolon)</span>
                </label>
                <textarea
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`Contoh copy-paste dari OWS:\nNE Name\tAlarm Name\tSeverity\tEvent Time\nBGR001\tMains Fail\tMajor\t2026-08-21 08:30:00\nJKT045\tLow Voltage Battery Disconnect\tCritical\t2026-08-21 08:32:00`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={!pastedText.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  Proses & Sinkronkan Alarm
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Simulator */}
          {activeTab === 'simulator' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-white">Uji Coba Simulator OWS</h4>
                <p className="text-[11px] text-slate-400">
                  Simulasikan incoming alarm OWS (termasuk site baru BDG091 yang belum ada di master) untuk melihat cara kerja sistem auto-discovery.
                </p>
              </div>
              <button
                onClick={onSimulateDemo}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Jalankan Simulasi OWS</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auto Created Notice if any */}
      {autoCreatedCount > 0 && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 flex items-center gap-2 text-xs text-cyan-300">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            <strong>{autoCreatedCount} alarm</strong> berasal dari Site baru yang otomatis ditambahkan ke database master!
          </span>
        </div>
      )}

      {/* Alarms Feed Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Daftar Feed Log Alarm OWS ({filteredLogs.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              Sinkronisasi Terakhir: {lastSyncTime || 'Realtime Active'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterSeverity === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({nmsLogs.length})
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterSeverity === 'critical'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical ({nmsLogs.filter((l) => l.rank === 3).length})
            </button>
            <button
              onClick={() => setFilterSeverity('warning')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterSeverity === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Warning ({nmsLogs.filter((l) => l.rank === 2).length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Site ID</th>
                <th className="py-2.5 px-3">Alarm Terdeteksi OWS</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Waktu Kejadian</th>
                <th className="py-2.5 px-3">Rekomendasi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 italic font-sans">
                    Belum ada log alarm OWS. Gunakan tombol upload atau paste di atas untuk memulai.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l, idx) => {
                  const isCritical = l.rank === 3;
                  const isWarning = l.rank === 2;
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-800/40 transition font-sans ${
                        l.cleared ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-white">
                        <button
                          onClick={() => onSelectSiteId(l.id)}
                          className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          <span>{l.id}</span>
                          {l.isAutoCreated && (
                            <span className="px-1 py-0.2 bg-cyan-500/20 text-cyan-300 text-[8px] font-bold rounded font-sans">
                              Auto
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="py-2.5 px-3 font-semibold text-slate-200">
                        {l.alarm}
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border inline-flex items-center gap-1 ${
                            isCritical
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : isWarning
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {l.severity} {l.cleared ? '• Cleared' : ''}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-[11px] text-slate-400 font-mono">
                        {l.occurredTime}
                      </td>

                      <td className="py-2.5 px-3 text-xs font-semibold">
                        {l.cleared ? (
                          <span className="text-slate-500">Normal / Resolved</span>
                        ) : isCritical ? (
                          <span className="text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            Dispatch Genset / Tim CME Sekarang
                          </span>
                        ) : isWarning ? (
                          <span className="text-amber-400 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            Cek PLN ID & Monitoring Kapasitas
                          </span>
                        ) : (
                          <span className="text-slate-400">Monitor Telemetri</span>
                        )}
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
