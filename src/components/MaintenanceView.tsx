import React from 'react';
import { 
  SlidersHorizontal, 
  MapPin, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  Wrench, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Site } from '../types';

interface MaintenanceViewProps {
  sites: Site[];
  onSelectSite: (site: Site) => void;
  onResolveSite: (siteId: string) => void;
  isAdmin: boolean;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  sites,
  onSelectSite,
  onResolveSite,
  isAdmin
}) => {
  const degradedSites = sites.filter((s) => s.status !== 'Normal');

  const copyDispatchFormat = (s: Site) => {
    const cleanCoords = (s.coords || "-6.2088, 106.8456").replace(/\s/g, '');
    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${cleanCoords}`;

    const text = `*ESKALASI 2ND LEVEL SUPPORT - POWER SME*\n\n` +
      `*Site ID:* ${s.id}\n` +
      `*Nama Site:* ${s.name}\n` +
      `*Cluster:* ${s.cluster}\n` +
      `*Severity:* ${s.status.toUpperCase()}\n` +
      `*Alarm OWS:* ${s.lastAlarm}\n` +
      `*ID Pelanggan PLN:* ${s.plnId || '-'}\n` +
      `*Kapasitas PLN:* ${s.pln}\n` +
      `*Genset Standby:* ${s.genset}\n` +
      `*Rectifier Module:* ${s.rect}\n` +
      `*Battery Bank:* ${s.batt}\n` +
      `*PIC Area:* ${s.pic}\n` +
      `*Link Google Maps:* ${gmapsUrl}\n\n` +
      `_Tindakan: Segera lakukan pemeriksaan rectifier/genset mobile._`;

    navigator.clipboard.writeText(text);
    alert(`Format eskalasi untuk ${s.id} disalin ke clipboard!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              2nd Level Support & CME Trouble Escalation
            </h2>
            <p className="text-xs text-slate-400">
              Daftar tiket gangguan CME/Kelistrikan yang memerlukan dispatch tim FOP / Genset Mobile.
            </p>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      {degradedSites.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Tidak Ada Tiket Gangguan Aktif</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Semua site beroperasi dengan sumber PLN normal tanpa ada kendala baterai atau pemadaman listrik.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {degradedSites.map((site) => {
            const isCritical = site.status === 'Critical';
            const cleanCoords = (site.coords || "-6.2088, 106.8456").replace(/\s/g, '');
            const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${cleanCoords}`;

            return (
              <div
                key={site.id}
                className={`p-4 rounded-2xl border transition shadow-sm space-y-3 ${
                  isCritical
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isCritical ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{site.id}</span>
                        <span className="text-xs text-slate-300 font-semibold">{site.name}</span>
                        <span className={`px-2 py-0.2 text-[9px] font-bold rounded-full ${
                          isCritical ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                        }`}>
                          {site.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Cluster: {site.cluster} • PIC: {site.pic}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={gmapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>Google Maps</span>
                    </a>

                    <button
                      onClick={() => copyDispatchFormat(site)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-400" />
                      <span>Copy Format WA</span>
                    </button>

                    <button
                      onClick={() => onSelectSite(site)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1"
                    >
                      <span>Detail Spek</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Grid Technical Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Alarm Aktif:</span>
                    <span className="font-semibold text-amber-300">{site.lastAlarm}</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">ID Pelanggan PLN:</span>
                    <span className="font-mono text-white font-semibold">{site.plnId || '-'}</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Genset Standby:</span>
                    <span className="font-medium text-slate-200">{site.genset}</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Est. Sisa Waktu Baterai:</span>
                    <span className="font-bold text-red-400">{site.backupTime}</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onResolveSite(site.id)}
                      className="text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 font-semibold"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Tandai Gangguan Selesai (Kembali Normal)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
