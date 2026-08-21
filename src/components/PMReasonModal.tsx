import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { PMSchedule } from '../types';
import { PM_REASON_CODES } from '../data/initialData';

interface PMReasonModalProps {
  schedule: PMSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reasonCode: string, reasonNote: string) => void;
}

export const PMReasonModal: React.FC<PMReasonModalProps> = ({
  schedule,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [code, setCode] = useState('akses');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (schedule) {
      setCode(schedule.reasonCode || 'akses');
      setNote(schedule.reasonNote || '');
    }
  }, [schedule, isOpen]);

  if (!isOpen || !schedule) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(code, note);
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
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-white">Tandai PM Not Achieved</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-300">
          Site: <strong className="text-amber-400 font-mono">{schedule.id}</strong> ({schedule.name})
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Alasan Belum Tercapai *</label>
            <select
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
            >
              {PM_REASON_CODES.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold">Keterangan Tambahan</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Menunggu izin akses dari pengelola gedung / estimasi sparepart tiba..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
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
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition"
            >
              Simpan Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
