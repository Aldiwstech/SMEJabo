import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  INITIAL_SITES, 
  INITIAL_PM_SCHEDULES 
} from './data/initialData';
import { 
  Site, 
  PMSchedule, 
  NMSLog, 
  StatusHistoryItem 
} from './types';
import { 
  parseOWSFile, 
  parseOWSText, 
  findVal, 
  extractSiteId, 
  inferClusterFromId 
} from './utils/owsParser';
import { exportToExcel, exportToPDF } from './utils/exportReports';

import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DataSiteView } from './components/DataSiteView';
import { NMSView } from './components/NMSView';
import { MaintenanceView } from './components/MaintenanceView';
import { PMView } from './components/PMView';
import { HistoryView } from './components/HistoryView';

import { SiteDetailModal } from './components/SiteDetailModal';
import { SiteEditModal } from './components/SiteEditModal';
import { OWSPasteModal } from './components/OWSPasteModal';
import { ExportModal } from './components/ExportModal';
import { PMReasonModal } from './components/PMReasonModal';
import { PMFormModal } from './components/PMFormModal';

export default function App() {
  // LocalStorage initialization
  const [sites, setSites] = useState<Site[]>(() => {
    const saved = localStorage.getItem('sme_power_sites_v2');
    return saved ? JSON.parse(saved) : INITIAL_SITES;
  });

  const [pmData, setPmData] = useState<PMSchedule[]>(() => {
    const saved = localStorage.getItem('sme_power_pm_v2');
    return saved ? JSON.parse(saved) : INITIAL_PM_SCHEDULES;
  });

  const [nmsLogs, setNmsLogs] = useState<NMSLog[]>(() => {
    const saved = localStorage.getItem('sme_power_nms_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<StatusHistoryItem[]>(() => {
    const saved = localStorage.getItem('sme_power_history_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('sme_power_is_admin') === 'true';
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Realtime Ready');

  // Modals state
  const [selectedSiteDetail, setSelectedSiteDetail] = useState<Site | null>(null);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [isOWSPasteOpen, setIsOWSPasteOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [pmReasonSchedule, setPmReasonSchedule] = useState<PMSchedule | null>(null);
  const [editingPMSchedule, setEditingPMSchedule] = useState<PMSchedule | null>(null);
  const [isPMFormOpen, setIsPMFormOpen] = useState(false);
  const [dataSiteInitialFilter, setDataSiteInitialFilter] = useState<string>('all');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('sme_power_sites_v2', JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    localStorage.setItem('sme_power_pm_v2', JSON.stringify(pmData));
  }, [pmData]);

  useEffect(() => {
    localStorage.setItem('sme_power_nms_v2', JSON.stringify(nmsLogs));
  }, [nmsLogs]);

  useEffect(() => {
    localStorage.setItem('sme_power_history_v2', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('sme_power_is_admin', String(isAdmin));
  }, [isAdmin]);

  // Handler for OWS parsing results
  const applyOWSParseResult = (result: {
    updatedSites: Site[];
    newLogs: NMSLog[];
    newHistories: StatusHistoryItem[];
    summary: {
      totalRows: number;
      validAlarms: number;
      matchedSites: number;
      autoCreatedSites: number;
      updatedSites: number;
      clearedAlarms: number;
      criticalCount: number;
      warningCount: number;
    };
  }) => {
    setSites(result.updatedSites);
    setNmsLogs(result.newLogs);
    if (result.newHistories.length > 0) {
      setHistory((prev) => [...result.newHistories, ...prev].slice(0, 300));
    }
    const timeStr = `${new Date().toLocaleTimeString('id-ID')} WIB`;
    setLastSyncTime(timeStr);

    let message = `✅ Berhasil sinkronisasi OWS!\n\n` +
      `• Total Baris Diproses: ${result.summary.validAlarms}\n` +
      `• Site Berubah Status: ${result.summary.updatedSites} site\n` +
      `• Critical Outage: ${result.summary.criticalCount} alarm\n` +
      `• Warning Backup: ${result.summary.warningCount} alarm`;

    if (result.summary.autoCreatedSites > 0) {
      message += `\n\n⚡ ${result.summary.autoCreatedSites} Site Baru Otomatis Dibuat (Auto-Discovered) tanpa eror!`;
    }

    alert(message);
  };

  // 1. OWS File Upload (.xlsx, .csv)
  const handleOWSFileUpload = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const result = parseOWSFile(buffer, sites);
      applyOWSParseResult(result);
    } catch (err: any) {
      console.error(err);
      alert(`Gagal memproses file OWS: ${err?.message || 'Format tidak dikenali'}`);
    }
  };

  // 2. OWS Direct Text / Clipboard Paste
  const handleOWSTextPaste = (rawText: string) => {
    try {
      const result = parseOWSText(rawText, sites);
      applyOWSParseResult(result);
    } catch (err: any) {
      console.error(err);
      alert(`Gagal memproses teks OWS: ${err?.message || 'Periksa format teks'}`);
    }
  };

  // 3. Demo / Simulator Trigger
  const handleSimulateDemo = () => {
    const demoOWSData = [
      {
        'NE Name': 'BGR001_Pajajaran',
        'Alarm Name': 'Mains Fail (PLN Down / Padam)',
        'Severity': 'Major',
        'Event Time': new Date().toISOString().replace('T', ' ').substring(0, 19),
        'Clear Status': 'Uncleared'
      },
      {
        'NE Name': 'JKT045_SaharjoApex',
        'Alarm Name': 'Low Voltage Battery Disconnect (LVBD)',
        'Severity': 'Critical',
        'Event Time': new Date().toISOString().replace('T', ' ').substring(0, 19),
        'Clear Status': 'Uncleared'
      },
      {
        // Unregistered site -> will auto create!
        'NE Name': 'BDG091_BarosHub',
        'Alarm Name': 'Genset Running Active',
        'Severity': 'Major',
        'Event Time': new Date().toISOString().replace('T', ' ').substring(0, 19),
        'Clear Status': 'Uncleared'
      }
    ];

    const result = parseOWSText(
      demoOWSData.map((d) => Object.values(d).join('\t')).join('\n'),
      sites
    );
    applyOWSParseResult(result);
  };

  // Master Data Site Import via Excel
  const handleMasterSiteExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(new Uint8Array(evt.target?.result as ArrayBuffer), { type: 'array' });
        const json = XLSX.utils.sheet_to_json<Record<string, any>>(wb.Sheets[wb.SheetNames[0]]);
        
        let count = 0;
        const currentSites = [...sites];

        json.forEach((row) => {
          const rawId = findVal(row, ['siteid', 'id', 'site_id', 'site', 'idsite', 'nename', 'ne']);
          const rawName = findVal(row, ['sitename', 'name', 'site_name', 'namasite']);

          if (rawId) {
            const id = extractSiteId(String(rawId));
            const name = rawName ? String(rawName).trim() : `Site ${id}`;
            const cluster = findVal(row, ['cluster', 'region', 'area']) || inferClusterFromId(id);
            const coords = findVal(row, ['coordinate', 'koordinat', 'coords', 'latlong']) || '-6.2088, 106.8456';
            const pic = findVal(row, ['pic', 'picname', 'fop', 'namapic']) || 'FOP Team';
            const plnId = findVal(row, ['plnid', 'idpelpln', 'idpelanggan', 'meteranpln']) || '';
            const lastPm = findVal(row, ['lastpm', 'last_pm', 'pmterakhir', 'tglpm']) || '';
            const pln = findVal(row, ['pln', 'plnpower', 'kapasitaspln', 'daya']) || '33 kVA';
            const genset = findVal(row, ['genset', 'gensetmodel', 'kapasitasgenset']) || 'Himoinsa 40 kVA';
            const rect = findVal(row, ['rectifier', 'rect', 'brandrectifier']) || 'Huawei TP48200B';
            const batt = findVal(row, ['battery', 'batt', 'batterybank']) || '2 Bank (Lithium 200Ah)';
            const router = findVal(row, ['router', 'brandrouter', 'ipran']) || 'Huawei ATN 950B';
            const rbs = findVal(row, ['rbs', 'brandrbs', 'bbu']) || 'Huawei BBU3910';
            const tech = findVal(row, ['tech', 'technology', 'ran']) || '2G, 4G, 5G';
            const health = parseInt(findVal(row, ['health', 'healthscore'])) || 95;

            const existingIdx = currentSites.findIndex((s) => s.id.toUpperCase() === id.toUpperCase());
            const siteData: Site = {
              id,
              name,
              cluster: String(cluster),
              coords: String(coords),
              pic: String(pic),
              plnId: String(plnId),
              lastPm: String(lastPm),
              nmsStatus: 'Connected',
              nav: '99.95%',
              tech: String(tech),
              pln: String(pln),
              genset: String(genset),
              rect: String(rect),
              batt: String(batt),
              router: String(router),
              rbs: String(rbs),
              health,
              status: existingIdx >= 0 ? currentSites[existingIdx].status : 'Normal',
              backupTime: existingIdx >= 0 ? currentSites[existingIdx].backupTime : 'N/A',
              lastAlarm: existingIdx >= 0 ? currentSites[existingIdx].lastAlarm : '-',
              isAutoDiscovered: false
            };

            if (existingIdx >= 0) {
              currentSites[existingIdx] = { ...currentSites[existingIdx], ...siteData };
            } else {
              currentSites.push(siteData);
            }
            count++;
          }
        });

        setSites(currentSites);
        alert(`Sukses! ${count} data Master Site berhasil diimpor & disinkronkan.`);
      } catch (err: any) {
        console.error(err);
        alert('File Excel Master Site tidak valid.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  // PM Schedule Import via Excel
  const handlePMExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(new Uint8Array(evt.target?.result as ArrayBuffer), { type: 'array' });
        const json = XLSX.utils.sheet_to_json<Record<string, any>>(wb.Sheets[wb.SheetNames[0]]);
        
        let count = 0;
        const currentPM = [...pmData];

        json.forEach((row) => {
          const rawId = findVal(row, ['siteid', 'id', 'site_id', 'site']);
          if (!rawId) return;

          const id = extractSiteId(String(rawId));
          const site = sites.find((s) => s.id.toUpperCase() === id.toUpperCase());
          const name = findVal(row, ['sitename', 'name', 'nama']) || (site ? site.name : `Site ${id}`);
          const month = String(findVal(row, ['bulan', 'month', 'periode']) || new Date().toISOString().slice(0, 7)).slice(0, 7);
          const pic = findVal(row, ['pic', 'teknisi', 'vendor']) || (site ? site.pic : 'FOP Team');
          const items = findVal(row, ['scope', 'checklist', 'items']) || 'Genset Oil Check, Battery Discharge Test';
          const statusRaw = String(findVal(row, ['status', 'statuspm']) || 'Scheduled').toLowerCase();
          
          let status: 'Scheduled' | 'Achieved' | 'Not Achieved' = 'Scheduled';
          if (/not|belum|tidak|fail/.test(statusRaw)) status = 'Not Achieved';
          else if (/achieved|selesai|done|ok/.test(statusRaw)) status = 'Achieved';

          const reasonCode = status === 'Not Achieved' ? (findVal(row, ['reasoncode', 'alasan']) || 'lainnya') : '';
          const reasonNote = findVal(row, ['reasonnote', 'keterangan']) || '';

          const record: PMSchedule = {
            id,
            name: String(name),
            month,
            pic: String(pic),
            items: String(items),
            status,
            reasonCode: String(reasonCode),
            reasonNote: String(reasonNote),
            completedDate: status === 'Achieved' ? new Date().toISOString().split('T')[0] : ''
          };

          const existingIdx = currentPM.findIndex((p) => p.id.toUpperCase() === id.toUpperCase() && p.month === month);
          if (existingIdx >= 0) {
            currentPM[existingIdx] = record;
          } else {
            currentPM.unshift(record);
          }
          count++;
        });

        setPmData(currentPM);
        alert(`Sukses! ${count} jadwal PM berhasil diimpor.`);
      } catch (err: any) {
        console.error(err);
        alert('File Excel Jadwal PM tidak valid.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  // CRUD Site
  const handleSaveSite = (data: Partial<Site>) => {
    const id = (data.id || '').toUpperCase();
    const existingIdx = sites.findIndex((s) => s.id.toUpperCase() === id);

    if (existingIdx >= 0) {
      const prevStatus = sites[existingIdx].status;
      const updated = { ...sites[existingIdx], ...data } as Site;
      const newSites = [...sites];
      newSites[existingIdx] = updated;
      setSites(newSites);

      if (prevStatus !== updated.status) {
        setHistory((prev) => [
          {
            ts: new Date().toISOString(),
            id: updated.id,
            name: updated.name,
            from: prevStatus,
            to: updated.status,
            source: 'Edit Manual',
            detail: 'Status diubah oleh operator'
          },
          ...prev
        ]);
      }
    } else {
      const newSite: Site = {
        id,
        name: data.name || `Site ${id}`,
        cluster: data.cluster || inferClusterFromId(id),
        coords: data.coords || '-6.2088, 106.8456',
        pic: data.pic || 'Tim FOP Area',
        plnId: data.plnId || '',
        lastPm: data.lastPm || '',
        nmsStatus: 'Connected',
        nav: data.nav || '99.95%',
        tech: data.tech || '2G, 4G, 5G',
        pln: data.pln || '33 kVA',
        genset: data.genset || 'Himoinsa 40 kVA',
        rect: data.rect || 'Huawei TP48200B',
        batt: data.batt || '2 Bank (Lithium 200Ah)',
        router: data.router || 'Huawei ATN 950B',
        rbs: data.rbs || 'Huawei BBU3910',
        health: data.health || 95,
        status: data.status || 'Normal',
        backupTime: data.status === 'Normal' ? 'N/A' : 'Manual Set',
        lastAlarm: '-',
        isAutoDiscovered: false
      };
      setSites([newSite, ...sites]);
    }
  };

  const handleDeleteSite = (siteId: string) => {
    if (confirm(`Hapus Site ${siteId} dari database?`)) {
      setSites(sites.filter((s) => s.id !== siteId));
    }
  };

  // Maintenance Resolve
  const handleResolveSite = (siteId: string) => {
    const site = sites.find((s) => s.id === siteId);
    if (!site) return;
    const prevStatus = site.status;

    setSites(
      sites.map((s) =>
        s.id === siteId
          ? { ...s, status: 'Normal', lastAlarm: 'Normal (PLN OK Recovered)', backupTime: 'N/A' }
          : s
      )
    );

    setHistory((prev) => [
      {
        ts: new Date().toISOString(),
        id: site.id,
        name: site.name,
        from: prevStatus,
        to: 'Normal',
        source: '2nd Level Support',
        detail: 'Gangguan telah ditangani & normal kembali'
      },
      ...prev
    ]);

    alert(`Site ${siteId} berhasil ditandai normal (PLN OK).`);
  };

  // PM Actions
  const handleSavePMSchedule = (data: PMSchedule) => {
    const existingIdx = pmData.findIndex(
      (p) => p.id.toUpperCase() === data.id.toUpperCase() && p.month === data.month
    );

    if (existingIdx >= 0) {
      const updated = [...pmData];
      updated[existingIdx] = data;
      setPmData(updated);
    } else {
      setPmData([data, ...pmData]);
    }
  };

  const handleMarkPMAchieved = (schedule: PMSchedule) => {
    const today = new Date().toISOString().split('T')[0];
    setPmData(
      pmData.map((p) =>
        p.id === schedule.id && p.month === schedule.month
          ? { ...p, status: 'Achieved', completedDate: today, reasonCode: '', reasonNote: '' }
          : p
      )
    );

    // Update last PM in site
    setSites(
      sites.map((s) =>
        s.id.toUpperCase() === schedule.id.toUpperCase() ? { ...s, lastPm: today } : s
      )
    );

    setHistory((prev) => [
      {
        ts: new Date().toISOString(),
        id: schedule.id,
        name: schedule.name,
        from: 'PM Scheduled',
        to: 'PM Achieved',
        source: 'Preventive Maintenance',
        detail: `Servis rutin selesai pada ${today}`
      },
      ...prev
    ]);
  };

  const handleConfirmPMNotAchieved = (reasonCode: string, reasonNote: string) => {
    if (!pmReasonSchedule) return;
    setPmData(
      pmData.map((p) =>
        p.id === pmReasonSchedule.id && p.month === pmReasonSchedule.month
          ? { ...p, status: 'Not Achieved', reasonCode, reasonNote, completedDate: '' }
          : p
      )
    );
  };

  const handleDeletePM = (id: string, month: string) => {
    if (confirm(`Hapus jadwal PM untuk ${id} pada ${month}?`)) {
      setPmData(pmData.filter((p) => !(p.id === id && p.month === month)));
    }
  };

  const handleSelectSiteById = (siteId: string) => {
    const found = sites.find((s) => s.id.toUpperCase() === siteId.toUpperCase());
    if (found) {
      setSelectedSiteDetail(found);
    } else {
      alert(`Data detail untuk ${siteId} belum terdaftar di database master.`);
    }
  };

  const autoDiscoveredCount = sites.filter((s) => s.isAutoDiscovered).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Hidden File Inputs for Excel Import */}
      <input
        type="file"
        id="hiddenMasterFileInput"
        className="hidden"
        accept=".xlsx, .xls, .csv"
        onChange={handleMasterSiteExcelImport}
      />
      <input
        type="file"
        id="hiddenPMFileInput"
        className="hidden"
        accept=".xlsx, .xls, .csv"
        onChange={handlePMExcelImport}
      />

      {/* Header Navigation */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenOWSPaste={() => setIsOWSPasteOpen(true)}
        onOpenMasterImport={() => document.getElementById('hiddenMasterFileInput')?.click()}
        onOpenNMSImport={() => {
          setActiveView('nms');
          document.getElementById('owsFileInput')?.click();
        }}
        onOpenAddSite={() => {
          setEditingSite(null);
          setIsSiteModalOpen(true);
        }}
        onOpenExport={() => setIsExportOpen(true)}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        autoDiscoveredCount={autoDiscoveredCount}
      />

      {/* Main Content View Switcher */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-16 flex-1">
        {activeView === 'dashboard' && (
          <DashboardView
            sites={sites}
            nmsLogs={nmsLogs}
            onSelectSite={(s) => setSelectedSiteDetail(s)}
            onNavigateToDataSite={(filter) => {
              setDataSiteInitialFilter(filter || 'all');
              setActiveView('datasite');
            }}
            onOpenOWSPaste={() => setIsOWSPasteOpen(true)}
            lastSyncTime={lastSyncTime}
          />
        )}

        {activeView === 'datasite' && (
          <DataSiteView
            sites={sites}
            onSelectSite={(s) => setSelectedSiteDetail(s)}
            onEditSite={(s) => {
              setEditingSite(s);
              setIsSiteModalOpen(true);
            }}
            onDeleteSite={handleDeleteSite}
            onAddSite={() => {
              setEditingSite(null);
              setIsSiteModalOpen(true);
            }}
            onOpenMasterImport={() => document.getElementById('hiddenMasterFileInput')?.click()}
            isAdmin={isAdmin}
            initialFilter={dataSiteInitialFilter}
          />
        )}

        {activeView === 'nms' && (
          <NMSView
            nmsLogs={nmsLogs}
            onFileUpload={handleOWSFileUpload}
            onTextPaste={handleOWSTextPaste}
            onClearLogs={() => {
              if (confirm('Hapus seluruh daftar log alarm OWS?')) {
                setNmsLogs([]);
              }
            }}
            onSimulateDemo={handleSimulateDemo}
            onSelectSiteId={handleSelectSiteById}
            lastSyncTime={lastSyncTime}
          />
        )}

        {activeView === 'maintenance' && (
          <MaintenanceView
            sites={sites}
            onSelectSite={(s) => setSelectedSiteDetail(s)}
            onResolveSite={handleResolveSite}
            isAdmin={isAdmin}
          />
        )}

        {activeView === 'pm' && (
          <PMView
            pmData={pmData}
            sites={sites}
            onOpenPMForm={(schedule) => {
              setEditingPMSchedule(schedule || null);
              setIsPMFormOpen(true);
            }}
            onOpenPMReasonModal={(schedule) => setPmReasonSchedule(schedule)}
            onMarkAchieved={handleMarkPMAchieved}
            onDeletePM={handleDeletePM}
            onOpenPMImport={() => document.getElementById('hiddenPMFileInput')?.click()}
            onSelectSiteId={handleSelectSiteById}
            isAdmin={isAdmin}
          />
        )}

        {activeView === 'history' && (
          <HistoryView
            history={history}
            onClearHistory={() => {
              if (confirm('Hapus seluruh riwayat log perubahan status?')) {
                setHistory([]);
              }
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Project SME • Reliable Power & OWS Telemetry System</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {sites.length} Master Sites • {nmsLogs.length} Alarms Monitored
          </span>
        </div>
      </footer>

      {/* Modals */}
      <SiteDetailModal
        site={selectedSiteDetail}
        onClose={() => setSelectedSiteDetail(null)}
        onEdit={(s) => {
          setSelectedSiteDetail(null);
          setEditingSite(s);
          setIsSiteModalOpen(true);
        }}
      />

      <SiteEditModal
        site={editingSite}
        isOpen={isSiteModalOpen}
        onClose={() => {
          setIsSiteModalOpen(false);
          setEditingSite(null);
        }}
        onSave={handleSaveSite}
      />

      <OWSPasteModal
        isOpen={isOWSPasteOpen}
        onClose={() => setIsOWSPasteOpen(false)}
        onSubmit={handleOWSTextPaste}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExportExcel={() => exportToExcel(sites, pmData, nmsLogs, history)}
        onExportPDF={() => exportToPDF(sites, pmData, nmsLogs)}
        sitesCount={sites.length}
      />

      <PMReasonModal
        schedule={pmReasonSchedule}
        isOpen={!!pmReasonSchedule}
        onClose={() => setPmReasonSchedule(null)}
        onConfirm={handleConfirmPMNotAchieved}
      />

      <PMFormModal
        schedule={editingPMSchedule}
        isOpen={isPMFormOpen}
        onClose={() => {
          setIsPMFormOpen(false);
          setEditingPMSchedule(null);
        }}
        onSave={handleSavePMSchedule}
        sites={sites}
      />

    </div>
  );
}
