import React from 'react';
import { 
  X, 
  MapPin, 
  ExternalLink, 
  Radio, 
  Zap, 
  Cpu, 
  Battery, 
  Activity, 
  Edit3,
  Copy,
  Sparkles
} from 'lucide-react';
import { Site } from '../types';

interface SiteDetailModalProps {
  site: Site | null;
  onClose: () => void;
  onEdit: (site: Site) => void;
}

export const SiteDetailModal: React.FC<SiteDetailModalProps> = ({
  site,
  onClose,
  onEdit
}) => {
  if (!site) return null;

  const isNormal = site.status === 'Normal';
  const isWarning = site.status === 'Warning';
  const isCritical = site.status === 'Critical';

  const cleanCoords = (site.coords || "-6.2088, 106.8456").replace(/\s/g, '');
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${cleanCoords}`;

  const techBadges = (site.tech || '2G, 4G').split(',').map((t) => t.trim().toUpperCase());

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-wide font-mono">{site.id}</h2>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                    isCritical
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : isWarning
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}
                >
                  {site.status}
                </span>
                {site.isAutoDiscovered && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Auto-Discovered OWS
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {site.name} • <span className="text-slate-400">{site.cluster}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 border border-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Specs 4 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          
          {/* Card 1: Koordinat & PIC */}
          <div className="bg-slate-950/90 border border-slate-800/80 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Lokasi & PIC Lapangan</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Koordinat:</span>
              <span className="font-mono text-white font-semibold">{site.coords}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Cluster / Area:</span>
              <span className="font-semibold text-slate-200">{site.cluster}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">PIC / FOP:</span>
              <span className="font-semibold text-amber-300">{site.pic}</span>
            </div>
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-center font-semibold transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka di Google Maps</span>
            </a>
          </div>

          {/* Card 2: SLA & NMS */}
          <div className="bg-slate-950/90 border border-slate-800/80 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>SLA, NMS & PM</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">NMS Status:</span>
              <span className="font-bold text-emerald-400">{site.nmsStatus}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Last PM Date:</span>
              <span className="font-semibold text-white">{site.lastPm || 'Belum Ada Data'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">SLA Availability:</span>
              <span className="font-black text-emerald-400">{site.nav || '99.95%'}</span>
            </div>
            <div className="space-y-1 pt-1">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Teknologi NE:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['2G', '3G', '4G', '5G'].map((gen) => {
                  const active = techBadges.includes(gen);
                  return (
                    <span
                      key={gen}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        active
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}
                    >
                      {gen}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 3: Kelistrikan & Genset */}
          <div className="bg-slate-950/90 border border-slate-800/80 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-[11px] uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Sistem Power & Genset</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">ID Pelanggan PLN:</span>
              <span className="font-mono text-amber-300 font-bold">{site.plnId || '-'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Kapasitas Daya PLN:</span>
              <span className="font-semibold text-slate-200">{site.pln}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Rectifier Model:</span>
              <span className="font-semibold text-white">{site.rect}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Total Battery Bank:</span>
              <span className="font-semibold text-amber-300">{site.batt}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Genset Standby:</span>
              <span className="font-semibold text-slate-200">{site.genset}</span>
            </div>
          </div>

          {/* Card 4: Telecom Active Gear */}
          <div className="bg-slate-950/90 border border-slate-800/80 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Hardware & Radio Gear</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Router (IP RAN):</span>
              <span className="font-semibold text-white">{site.router}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">RBS / BBU Module:</span>
              <span className="font-semibold text-white">{site.rbs}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Alarm Terakhir OWS:</span>
              <span className="font-semibold text-amber-400">{site.lastAlarm || '-'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Health Power Score:</span>
              <span className="font-bold text-emerald-400">{site.health}%</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Est. Sisa Waktu Baterai:</span>
              <span className="font-semibold text-slate-200">{site.backupTime}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onEdit(site);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition border border-slate-700 flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            <span>Edit / Lengkapi Data Master</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
