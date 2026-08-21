import React, { useState } from 'react';
import { 
  Zap, 
  Database, 
  Radio, 
  Download, 
  FileSpreadsheet, 
  ShieldCheck, 
  Menu, 
  X,
  ClipboardPaste, 
  FileUp, 
  SlidersHorizontal,
  FileText,
  Layers,
  ChevronDown
} from 'lucide-react';
import { 
  downloadMasterSiteTemplate, 
  downloadPMTemplate, 
  downloadSampleOWSFeed 
} from '../utils/templateGenerator';

interface HeaderProps {
  activeView: string;
  onSelectView: (view: string) => void;
  onOpenOWSPaste: () => void;
  onOpenMasterImport: () => void;
  onOpenNMSImport: () => void;
  onOpenAddSite: () => void;
  onOpenExport: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  autoDiscoveredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  onOpenOWSPaste,
  onOpenMasterImport,
  onOpenNMSImport,
  onOpenAddSite,
  onOpenExport,
  isAdmin,
  onToggleAdmin,
  autoDiscoveredCount
}) => {
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama', desc: 'Ringkasan alarm, status PLN, Genset & Baterai', icon: Zap },
    { id: 'datasite', label: 'Data Master Site', desc: 'Daftar site telemetri & auto-discovery', icon: Database, badge: autoDiscoveredCount > 0 ? `${autoDiscoveredCount} Baru` : undefined },
    { id: 'nms', label: 'OWS / NMS Live Alarm', desc: 'Log feed alarm, parsing & rekonsiliasi', icon: Radio },
    { id: 'maintenance', label: 'Maintenance & Support', desc: 'Rekomendasi teknis & SLA backup daya', icon: SlidersHorizontal },
    { id: 'pm', label: 'Jadwal PM (Preventive)', desc: 'Kalender & checklist pemeliharaan rutin', icon: FileSpreadsheet },
    { id: 'history', label: 'Riwayat Log Status', desc: 'Audit trail perubahan status & alarm site', icon: FileText },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-50 px-3 sm:px-6 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* POJOK KIRI ATAS: TOMBOL MENU UTAMA + BRANDING */}
        <div className="flex items-center gap-3">
          
          {/* TOMBOL MENU AKSES POJOK KIRI ATAS */}
          <div className="relative">
            <button
              id="btn-main-navigation-menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border font-bold text-xs shadow-lg ${
                isMenuOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-700 hover:border-amber-500/60'
              }`}
              aria-label="Menu Akses Navigasi"
              title="Klik untuk membuka menu akses"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 text-slate-950" />
              ) : (
                <Menu className="w-4 h-4 text-amber-400" />
              )}
              <span className="font-black tracking-wider text-xs">MENU</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-slate-950' : 'text-slate-400'}`} />
            </button>

            {/* DROPDOWN MENU POJOK KIRI ATAS */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute left-0 mt-2.5 w-80 sm:w-88 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/10">
                  <div className="px-2.5 py-1.5 mb-2 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Menu Akses Modul</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Project SME</span>
                  </div>

                  <div className="space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectView(item.id);
                            setIsMenuOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition text-left ${
                            isActive
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                              : 'text-slate-200 hover:bg-slate-800/90 hover:text-white border border-transparent'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold truncate">{item.label}</span>
                              {item.badge && (
                                <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-full shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-1">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Action Buttons inside Menu */}
                  <div className="mt-2.5 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onOpenMasterImport();
                        setIsMenuOpen(false);
                      }}
                      className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Import Site</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenAddSite();
                        setIsMenuOpen(false);
                      }}
                      className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <span>+ Tambah Site</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Logo & Info Project */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
                  PROJECT SME
                </span>
                <span className="hidden sm:flex px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  OWS Auto-Sync
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Power Management & Telemetry System</p>
            </div>
          </div>
        </div>

        {/* Action Header Buttons (Kanan) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Paste OWS Log */}
          <button
            onClick={onOpenOWSPaste}
            title="Paste log teks langsung dari OWS"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-2.5 sm:px-3 py-2 rounded-xl shadow-sm transition"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste OWS</span>
          </button>

          {/* Import OWS File */}
          <button
            onClick={onOpenNMSImport}
            title="Unggah file log alarm OWS / NMS (.xlsx, .csv)"
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs px-2.5 sm:px-3 py-2 rounded-xl border border-slate-700 transition font-medium"
          >
            <FileUp className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Import OWS</span>
          </button>

          {/* Template Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              title="Download Template Format Excel"
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs px-2.5 sm:px-3 py-2 rounded-xl border border-slate-700 transition font-medium"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline">Template</span>
            </button>

            {showTemplateDropdown && (
              <>
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setShowTemplateDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1 text-xs">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    PILIHAN TEMPLATE EXCEL
                  </div>
                  <button
                    onClick={() => {
                      downloadMasterSiteTemplate();
                      setShowTemplateDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-800 rounded-lg text-left text-slate-200 transition"
                  >
                    <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold">Template Master Site</div>
                      <div className="text-[10px] text-slate-400">Format standar data master site</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      downloadPMTemplate();
                      setShowTemplateDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-800 rounded-lg text-left text-slate-200 transition"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-semibold">Template Jadwal PM</div>
                      <div className="text-[10px] text-slate-400">Format checklist & target PM bulanan</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      downloadSampleOWSFeed();
                      setShowTemplateDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-800 rounded-lg text-left text-slate-200 transition"
                  >
                    <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <div className="font-semibold">Contoh File OWS / NMS</div>
                      <div className="text-[10px] text-slate-400">File uji coba auto-discovery alarm</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Export Report Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 sm:px-3 py-2 rounded-xl transition font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Role Status Switcher */}
          <button
            onClick={onToggleAdmin}
            title={isAdmin ? "Mode Admin Aktif (Klik untuk ubah)" : "Mode Viewer (Klik untuk aktifkan Admin)"}
            className={`p-2 rounded-xl transition border flex items-center gap-1 ${
              isAdmin
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold hidden xl:inline">
              {isAdmin ? 'Admin' : 'Viewer'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
