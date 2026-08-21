import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { Site, PowerStatus, NMSStatus } from '../types';

interface SiteEditModalProps {
  site: Site | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (siteData: Partial<Site>) => void;
}

export const SiteEditModal: React.FC<SiteEditModalProps> = ({
  site,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Site>>({
    id: '',
    name: '',
    cluster: '',
    coords: '-6.2088, 106.8456',
    pic: '',
    plnId: '',
    pln: '33 kVA',
    genset: 'Himoinsa 40 kVA',
    rect: 'Huawei TP48200B',
    batt: '2 Bank (Lithium 200Ah)',
    router: 'Huawei ATN 950B',
    rbs: 'Huawei BBU3910',
    tech: '2G, 4G, 5G',
    health: 95,
    status: 'Normal',
    nmsStatus: 'Connected',
    nav: '99.95%',
    lastPm: ''
  });

  useEffect(() => {
    if (site) {
      setFormData({ ...site });
    } else {
      setFormData({
        id: '',
        name: '',
        cluster: 'Jakarta Area',
        coords: '-6.2088, 106.8456',
        pic: 'Tim FOP Area',
        plnId: '',
        pln: '33 kVA',
        genset: 'Himoinsa 40 kVA',
        rect: 'Huawei TP48200B',
        batt: '2 Bank (Lithium 200Ah)',
        router: 'Huawei ATN 950B',
        rbs: 'Huawei BBU3910',
        tech: '2G, 4G, 5G',
        health: 95,
        status: 'Normal',
        nmsStatus: 'Connected',
        nav: '99.95%',
        lastPm: ''
      });
    }
  }, [site, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id?.trim() || !formData.name?.trim()) {
      alert('Site ID dan Nama Site wajib diisi.');
      return;
    }

    onSave({
      ...formData,
      id: formData.id.trim().toUpperCase(),
      isAutoDiscovered: false // Mark as completed master data
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">
              {site ? (site.isAutoDiscovered ? 'Lengkapi Data Master Site (Auto OWS)' : 'Edit Data Master Site') : 'Tambah Data Master Site Baru'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {site?.isAutoDiscovered && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              Site ini awalnya dibuat otomatis saat import OWS. Lengkapi informasi PLN ID & perangkat di bawah agar data master menjadi valid.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 text-xs">
          
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Site ID *</label>
            <input
              type="text"
              required
              placeholder="BGR001"
              value={formData.id || ''}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Nama Site *</label>
            <input
              type="text"
              required
              placeholder="Pajajaran Hub"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">ID Pelanggan PLN</label>
            <input
              type="text"
              placeholder="537310892019"
              value={formData.plnId || ''}
              onChange={(e) => setFormData({ ...formData, plnId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-300 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Kapasitas PLN</label>
            <input
              type="text"
              placeholder="33 kVA"
              value={formData.pln || ''}
              onChange={(e) => setFormData({ ...formData, pln: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Cluster / Area</label>
            <input
              type="text"
              placeholder="Bogor Timur"
              value={formData.cluster || ''}
              onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Koordinat (Lat, Long)</label>
            <input
              type="text"
              placeholder="-6.5950, 106.8050"
              value={formData.coords || ''}
              onChange={(e) => setFormData({ ...formData, coords: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">PIC Area / FOP</label>
            <input
              type="text"
              placeholder="Bachtiar Sigit (MKU)"
              value={formData.pic || ''}
              onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Genset Model</label>
            <input
              type="text"
              placeholder="Himoinsa 40 kVA"
              value={formData.genset || ''}
              onChange={(e) => setFormData({ ...formData, genset: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Brand Rectifier</label>
            <input
              type="text"
              placeholder="Huawei TP48200B"
              value={formData.rect || ''}
              onChange={(e) => setFormData({ ...formData, rect: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Battery Bank</label>
            <input
              type="text"
              placeholder="2 Bank (Lithium 200Ah)"
              value={formData.batt || ''}
              onChange={(e) => setFormData({ ...formData, batt: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Router IP RAN</label>
            <input
              type="text"
              placeholder="Huawei ATN 950B"
              value={formData.router || ''}
              onChange={(e) => setFormData({ ...formData, router: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">RBS / BBU Module</label>
            <input
              type="text"
              placeholder="Huawei BBU3910"
              value={formData.rbs || ''}
              onChange={(e) => setFormData({ ...formData, rbs: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Teknologi NE</label>
            <input
              type="text"
              placeholder="2G, 4G, 5G"
              value={formData.tech || ''}
              onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Status Power</label>
            <select
              value={formData.status || 'Normal'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PowerStatus })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Normal">Normal (PLN OK)</option>
              <option value="Warning">Warning (Backup Active)</option>
              <option value="Critical">Critical (Discharge / Outage)</option>
            </select>
          </div>

          <div className="col-span-2 pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Data Master</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
