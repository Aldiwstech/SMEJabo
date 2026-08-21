import React, { useState } from 'react';
import { X, ClipboardPaste, Sparkles, Check } from 'lucide-react';

interface OWSPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rawText: string) => void;
}

export const OWSPasteModal: React.FC<OWSPasteModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
    onClose();
  };

  const loadSampleText = () => {
    const sample = `NE Name\tAlarm Name\tSeverity\tEvent Time\nBGR001\tMains Fail (PLN Down)\tMajor\t2026-08-21 09:15:00\nJKT045\tLow Voltage Battery Disconnect\tCritical\t2026-08-21 09:20:00\nBDG091\tGenset Running Active\tMajor\t2026-08-21 09:25:00`;
    setText(sample);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ClipboardPaste className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Paste Log Alarm Langsung dari Web OWS
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Cukup blok dan copy (Ctrl+C) tabel alarm pada browser OWS Anda, lalu paste (Ctrl+V) di kolom teks di bawah. Sistem akan memisahkan kolom dan merekam site secara otomatis.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Paste data OWS di sini...\n\nFormat otomatis mendukung TSV (Tab), CSV (Koma), atau Semicolon (;).`}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={loadSampleText}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Isi Contoh Alarm OWS</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Proses & Update Web</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
