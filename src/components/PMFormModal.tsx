import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { PMSchedule, Site } from '../types';

interface PMFormModalProps {
  schedule: PMSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PMSchedule) => void;
  sites: Site[];
}

export const PMFormModal: React.FC<PMFormModalProps> = ({
  schedule,
  isOpen,
  onClose,
  onSave,
  sites
}) => {
  const currentMonthStr = new Date().toISOString().slice(0, 7);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [month, setMonth] = useState(currentMonthStr);
  const [pic, setPic] = useState('FOP Area Team');
  const [items, setItems] = useState('Genset Oil & Filter Check, Battery Capacity Test, PLN Grounding');

  useEffect(() => {
    if (schedule) {
      setId(schedule.id);
      setName(schedule.name);
      setMonth(schedule.month);
      setPic(schedule.pic);
      setItems(schedule.items);
    } else {
      setId('');
      setName('');
      setMonth(currentMonthStr);
      setPic('FOP Area Team');
      setItems('Genset Oil & Filter Check, Battery Capacity Test, PLN Grounding');
    }
  }, [schedule, isOpen]);

  if (!isOpen) return null;

  const handleSiteIdChange = (newId: string) => {
    const cleanId = newId.trim().toUpperCase();
    setId(cleanId);
    const matched = sites.find((s) => s.id.toUpperCase() === cleanId);
    if (matched) {
      setName(matched.name);
      if (matched.pic) setPic(matched.pic);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !month.trim()) {
      alert('Site ID dan Bulan Target wajib diisi.');
      return;
    }

    const matched = sites.find((s) => s.id.toUpperCase() === id.trim().toUpperCase());
    const finalName = name.trim() || (matched ? matched.name : `Site ${id.trim().toUpperCase()}`);

    onSave({
      id: id.trim().toUpperCase(),
      name: finalName,
      month,
      pic: pic.trim() || 'FOP Team',
      items: items.trim() || 'Servis Rutin Genset & Baterai',
      status: schedule ? schedule.status : 'Scheduled',
      reasonCode: schedule ? schedule.reasonCode : '',
      reasonNote: schedule ? schedule.reasonNote : '',
      completedDate: schedule ? schedule.completedDate : ''
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">
            {schedule ? 'Edit Jadwal PM' : 'Tambah Jadwal PM Baru'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Site ID *</label>
            <input
              type="text"
              required
              list="siteSuggestions"
              placeholder="BGR001"
              value={id}
              onChange={(e) => handleSiteIdChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
            />
            <datalist id="siteSuggestions">
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.cluster})
                </option>
              ))}
            </datalist>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Nama Site</label>
            <input
              type="text"
              placeholder="Pajajaran Hub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Bulan Target PM (YYYY-MM) *</label>
            <input
              type="month"
              required
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">PIC / Teknisi Pelaksana *</label>
            <input
              type="text"
              required
              placeholder="FOP Team Bogor"
              value={pic}
              onChange={(e) => setPic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Scope & Checklist Servis *</label>
            <textarea
              rows={3}
              required
              placeholder="Genset Oil & Filter Check, Battery Capacity Test, Rectifier Cleaning"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Jadwal PM</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
