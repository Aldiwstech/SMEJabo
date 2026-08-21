import React from 'react';
import { 
  Radio, 
  ShieldAlert, 
  BatteryCharging, 
  Zap, 
  ArrowUpRight, 
  Copy, 
  Sparkles, 
  Clock, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Site, NMSLog } from '../types';

interface DashboardViewProps {
  sites: Site[];
  nmsLogs: NMSLog[];
  onSelectSite: (site: Site) => void;
  onNavigateToDataSite: (filter?: string) => void;
  onOpenOWSPaste: () => void;
  lastSyncTime: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sites,
  nmsLogs,
  onSelectSite,
  onNavigateToDataSite,
  onOpenOWSPaste,
  lastSyncTime
}) => {
  const totalCount = sites.length;
  const normalCount = sites.filter((s) => s.status === 'Normal').length;
  const warningCount = sites.filter((s) => s.status === 'Warning').length;
  const criticalCount = sites.filter((s) => s.status === 'Critical').length;
  const autoDiscoveredSites = sites.filter((s) => s.isAutoDiscovered);

  const prioritySites = sites.filter(
    (s) => s.status === 'Critical' || s.status === 'Warning'
  );

  const copyWhatsAppTicket = (site: Site) => {
    const text = `*⚡ TIKET DARURAT SME POWER - OWS TELEMETRY*\n\n` +
      `*Site ID:* ${site.id}\n` +
      `*Nama Site:* ${site.name} (${site.cluster})\n` +
      `*Status:* ${site.status.toUpperCase()}\n` +
      `*Alarm OWS:* ${site.lastAlarm}\n` +
      `*PLN ID:* ${site.plnId || '-'}\n` +
      `*Kapasitas PLN:* ${site.pln}\n` +
      `*Genset:* ${site.genset}\n` +
      `*Battery:* ${site.batt}\n` +
      `*Est. Backup:* ${site.backupTime}\n` +
      `*PIC Area:* ${site.pic}\n` +
      `*Koordinat:* ${site.coords}\n` +
      `*Waktu Deteksi:* ${new Date().toLocaleTimeString('id-ID')} WIB\n\n` +
      `_Mohon segera koordinasikan tim FOP / Genset Mobile ke lokasi._`;

    navigator.clipboard.writeText(text);
    alert(`Format WhatsApp untuk ${site.id} berhasil disalin ke clipboard!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Auto-Discovery Banner Notice */}
      {autoDiscoveredSites.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl shrink-0 border border-amber-500/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>{autoDiscoveredSites.length} Site Baru Terdeteksi Otomatis dari OWS</span>
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-500 text-slate-950 rounded-full">
                  Auto-Created
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Data alarm langsung aktif tanpa eror. Anda dapat melengkapi informasi master teknis (PLN ID, genset, baterai) kapan saja.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToDataSite('autodiscovered')}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg transition shrink-0 shadow-sm"
          >
            Lihat Site Baru
          </button>
        </div>
      )}

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Total Sites */}
        <div 
          onClick={() => onNavigateToDataSite('all')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Sites</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-white">{totalCount}</h3>
            <span className="text-[11px] text-slate-500 font-medium">Monitored</span>
          </div>
        </div>

        {/* Normal (PLN OK) */}
        <div 
          onClick={() => onNavigateToDataSite('Normal')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-2xl transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/90">Normal (PLN OK)</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:scale-110 transition">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-emerald-400">{normalCount}</h3>
            <span className="text-[11px] text-emerald-500 font-bold">
              {totalCount > 0 ? Math.round((normalCount / totalCount) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Warning (Backup Active) */}
        <div 
          onClick={() => onNavigateToDataSite('Warning')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90">Warning (Backup)</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg group-hover:scale-110 transition">
              <BatteryCharging className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-amber-400">{warningCount}</h3>
            <span className="text-[11px] text-amber-500 font-bold">Genset / Batt</span>
          </div>
        </div>

        {/* Critical Alert */}
        <div 
          onClick={() => onNavigateToDataSite('Critical')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-red-500/40 p-4 rounded-2xl transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400/90">Critical Alert</span>
            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg group-hover:scale-110 transition">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-red-400">{criticalCount}</h3>
            <span className="text-[11px] text-red-400 font-bold">Action Needed</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Action List & Power Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Power Health Status & Quick OWS Info */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Kondisi Daya Jaringan
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {totalCount} Total Node
              </span>
            </div>

            {/* Custom Ratio Progress Bar */}
            <div className="space-y-3">
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
                <div 
                  style={{ width: `${totalCount > 0 ? (normalCount / totalCount) * 100 : 0}%` }}
                  className="bg-emerald-500 rounded-full transition-all duration-500"
                  title={`Normal: ${normalCount}`}
                />
                <div 
                  style={{ width: `${totalCount > 0 ? (warningCount / totalCount) * 100 : 0}%` }}
                  className="bg-amber-500 rounded-full transition-all duration-500"
                  title={`Warning: ${warningCount}`}
                />
                <div 
                  style={{ width: `${totalCount > 0 ? (criticalCount / totalCount) * 100 : 0}%` }}
                  className="bg-red-500 rounded-full transition-all duration-500"
                  title={`Critical: ${criticalCount}`}
                />
              </div>

              {/* Legend Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-emerald-400 font-bold block">Normal</span>
                  <span className="text-sm font-black text-white">{normalCount}</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-amber-400 font-bold block">Warning</span>
                  <span className="text-sm font-black text-white">{warningCount}</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-red-400 font-bold block">Critical</span>
                  <span className="text-sm font-black text-white">{criticalCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* OWS Sync Card */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>OWS Sync Status</span>
              </span>
              <span className="text-emerald-400 font-semibold font-mono text-[10px]">
                {lastSyncTime || 'Realtime Active'}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 flex justify-between">
              <span className="text-slate-400">Total Log Alarm OWS:</span>
              <span className="font-bold text-white">{nmsLogs.length} Events</span>
            </div>
            <button
              onClick={onOpenOWSPaste}
              className="w-full mt-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Input / Update Alarm OWS</span>
            </button>
          </div>
        </div>

        {/* Right Column (2 cols): Priority Action List */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Priority Action List (Immediate Dispatch)
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {prioritySites.length} Site Memerlukan Tindakan
              </span>
            </div>

            {/* List */}
            {prioritySites.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <p className="text-xs font-semibold text-slate-300">Semua site dalam kondisi normal PLN OK!</p>
                <p className="text-[11px] text-slate-500 max-w-sm">
                  Tidak ada outage, pemadaman, atau baterai discharge yang terdeteksi saat ini.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {prioritySites.map((site) => {
                  const isCritical = site.status === 'Critical';
                  return (
                    <div
                      key={site.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCritical
                          ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
                          : 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`}></span>
                          <span className="font-extrabold text-sm text-white tracking-wide">{site.id}</span>
                          <span className="text-xs text-slate-300 font-medium">{site.name}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {site.cluster}
                          </span>
                          {site.isAutoDiscovered && (
                            <span className="text-[9px] bg-amber-500/30 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded">
                              Auto OWS
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-300 flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-amber-300">
                            {site.lastAlarm}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">Genset: {site.genset}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">PLN ID: {site.plnId || '-'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                          isCritical
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          Est: {site.backupTime}
                        </span>

                        <button
                          onClick={() => copyWhatsAppTicket(site)}
                          title="Copy format WhatsApp untuk kirim ke teknisi/FOP"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onSelectSite(site)}
                          className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition"
                          title="Lihat rincian lengkap teknis site"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
