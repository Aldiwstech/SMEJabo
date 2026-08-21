import React, { useState } from 'react';
import { 
  Zap, 
  Database, 
  Radio, 
  Download, 
  FileSpreadsheet, 
  ShieldCheck, 
  Menu, 
  ClipboardPaste, 
  FileUp, 
  SlidersHorizontal,
  FileText
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Zap },
    { id: 'datasite', label: 'Data Site', icon: Database, badge: autoDiscoveredCount > 0 ? `${autoDiscoveredCount} Baru` : undefined },
    { id: 'nms', label: 'OWS / NMS Alarm', icon: Radio },
    { id: 'maintenance', label: 'Maintenance & Support', icon: SlidersHorizontal },
    { id: 'pm', label: 'Jadwal PM', icon: FileSpreadsheet },
    { id: 'history', label: 'Riwayat Status', icon: FileText },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
              <Zap className="w-6 h-6 text-slate-950 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
                  PROJECT SME
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  OWS Auto-Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Power Management & Telemetry System</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium relative ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Paste OWS Log */}
          <button
            onClick={onOpenOWSPaste}
            title="Paste log teks langsung dari OWS"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-2.5 sm:px-3 py-1.5 rounded-lg shadow-sm transition"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste OWS</span>
          </button>

          {/* Import OWS File */}
          <button
            onClick={onOpenNMSImport}
            title="Unggah file log alarm OWS / NMS (.xlsx, .csv)"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <FileUp className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Import OWS</span>
          </button>

          {/* Template Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              title="Download Template Format Excel"
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700 transition"
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
                    className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-800 rounded-lg text-left text-slate-200"
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
                    className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-800 rounded-lg text-left text-slate-200"
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
                    className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-800 rounded-lg text-left text-slate-200"
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
            className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg transition font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Role Status Switcher */}
          <button
            onClick={onToggleAdmin}
            title={isAdmin ? "Mode Admin Aktif (Klik untuk ubah)" : "Mode Viewer (Klik untuk aktifkan Admin)"}
            className={`p-1.5 rounded-lg transition border flex items-center gap-1 ${
              isAdmin
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold hidden xl:inline">
              {isAdmin ? 'Admin' : 'Viewer'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-slate-800 mt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                onOpenMasterImport();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-1"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Import Master</span>
            </button>
            <button
              onClick={() => {
                onOpenAddSite();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
            >
              <span>+ Tambah Site</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
