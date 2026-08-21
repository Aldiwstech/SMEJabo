import { Site, PMSchedule, PMReasonOption } from '../types';

export const PM_REASON_CODES: PMReasonOption[] = [
  { code: 'akses', label: 'Akses Lokasi Terkendala (Izin/Kunci/Keamanan)' },
  { code: 'sparepart', label: 'Menunggu Sparepart (Rectifier Module/Battery/Filter)' },
  { code: 'jadwal', label: 'PIC / Vendor Belum Menjadwalkan' },
  { code: 'cuaca', label: 'Cuaca Ekstrim / Bencana Alam' },
  { code: 'corrective', label: 'Prioritas Corrective Emergency (Site Down)' },
  { code: 'genset_issue', label: 'Kendala Transportasi Genset Mobile' },
  { code: 'anggaran', label: 'Menunggu Approval PO / Anggaran' },
  { code: 'lainnya', label: 'Lainnya (Tuliskan Keterangan)' },
];

export function getPMReasonLabel(code?: string): string {
  if (!code) return '-';
  const item = PM_REASON_CODES.find((r) => r.code === code);
  return item ? item.label : code;
}

export const INITIAL_SITES: Site[] = [
  {
    id: "BGR001",
    name: "Pajajaran Hub",
    cluster: "Bogor Timur",
    coords: "-6.5950, 106.8050",
    pic: "Bachtiar Sigit (MKU)",
    plnId: "537310892019",
    lastPm: "2026-08-10",
    nmsStatus: "Connected",
    nav: "99.98%",
    tech: "2G, 3G, 4G, 5G",
    pln: "33 kVA (B3/TM)",
    genset: "Himoinsa 40 kVA",
    rect: "Huawei TP48200B",
    batt: "2 Bank (Lithium 200Ah)",
    router: "Huawei ATN 950B",
    rbs: "Huawei BBU3910 / Blade",
    health: 98,
    status: "Normal",
    backupTime: "N/A (PLN Normal)",
    lastAlarm: "-",
    isAutoDiscovered: false
  },
  {
    id: "BGR002",
    name: "Sukaraja Tower",
    cluster: "Bogor Utara",
    coords: "-6.5562, 106.8281",
    pic: "FOP Team Sukaraja",
    plnId: "537310441823",
    lastPm: "2026-07-22",
    nmsStatus: "Connected",
    nav: "99.85%",
    tech: "2G, 4G",
    pln: "23 kVA",
    genset: "Himoinsa 35 kVA",
    rect: "Huawei TP48150A",
    batt: "1 Bank (VRLA 100Ah)",
    router: "Huawei ATN 910",
    rbs: "Huawei BBU3900",
    health: 82,
    status: "Warning",
    backupTime: "3.2 Jam",
    lastAlarm: "Mains Fail / PLN Off",
    isAutoDiscovered: false
  },
  {
    id: "JKT045",
    name: "Saharjo Apex",
    cluster: "Jakarta Selatan",
    coords: "-6.2234, 106.8451",
    pic: "SME Support Jkt",
    plnId: "542109883412",
    lastPm: "2026-06-15",
    nmsStatus: "Disconnected",
    nav: "99.20%",
    tech: "2G, 4G, 5G",
    pln: "41.5 kVA",
    genset: "Himoinsa 50 kVA",
    rect: "Huawei TP48300B",
    batt: "3 Bank (Lithium 300Ah)",
    router: "Huawei NetEngine 8000",
    rbs: "Huawei BBU5900 5G",
    health: 55,
    status: "Critical",
    backupTime: "0.8 Jam",
    lastAlarm: "Low Battery / Discharge",
    isAutoDiscovered: false
  },
  {
    id: "TGR012",
    name: "Cikokol Micro",
    cluster: "Tangerang Kota",
    coords: "-6.1824, 106.6342",
    pic: "Denny (FOP Tgr)",
    plnId: "538801992314",
    lastPm: "2026-08-05",
    nmsStatus: "Connected",
    nav: "99.92%",
    tech: "4G, 5G",
    pln: "16.5 kVA",
    genset: "Portable 10 kVA Ready",
    rect: "Huawei TP48100A",
    batt: "1 Bank (Lithium 100Ah)",
    router: "Huawei ATN 910B",
    rbs: "Huawei Blade BBU",
    health: 92,
    status: "Normal",
    backupTime: "N/A (PLN Normal)",
    lastAlarm: "-",
    isAutoDiscovered: false
  },
  {
    id: "BKS034",
    name: "Tambun Raya Node",
    cluster: "Bekasi Timur",
    coords: "-6.2612, 107.0645",
    pic: "Aris FOP Bekasi",
    plnId: "539912003881",
    lastPm: "2026-08-12",
    nmsStatus: "Connected",
    nav: "99.89%",
    tech: "2G, 4G",
    pln: "23 kVA",
    genset: "Himoinsa 30 kVA",
    rect: "Huawei TP48200B",
    batt: "2 Bank (Lithium 200Ah)",
    router: "Huawei ATN 950B",
    rbs: "Huawei BBU3910",
    health: 88,
    status: "Warning",
    backupTime: "4.0 Jam",
    lastAlarm: "Genset Running (Mains Off)",
    isAutoDiscovered: false
  }
];

export const INITIAL_PM_SCHEDULES: PMSchedule[] = [
  {
    id: "BGR001",
    name: "Pajajaran Hub",
    month: "2026-08",
    pic: "FOP Team Bogor",
    items: "Genset Oil & Filter Check, Battery Capacity Discharge Test, PLN Grounding",
    status: "Scheduled",
    reasonCode: "",
    reasonNote: "",
    completedDate: ""
  },
  {
    id: "BGR002",
    name: "Sukaraja Tower",
    month: "2026-08",
    pic: "Teknisi CME MKU",
    items: "Rectifier Fan Clean, PLN Surge Arrester Check, Battery Balancing",
    status: "Not Achieved",
    reasonCode: "sparepart",
    reasonNote: "Menunggu kiriman modul kipas rectifier pengganti dari gudang pusat",
    completedDate: ""
  },
  {
    id: "JKT045",
    name: "Saharjo Apex",
    month: "2026-07",
    pic: "SME Support Jakarta",
    items: "Deepsea Controller Calibration, Battery Cell Balancing, Air Conditioner Service",
    status: "Achieved",
    reasonCode: "",
    reasonNote: "",
    completedDate: "2026-07-22"
  },
  {
    id: "TGR012",
    name: "Cikokol Micro",
    month: "2026-08",
    pic: "Denny (FOP Tgr)",
    items: "Visual Inspection, Rectifier Load Test, MCB Terminal Tightening",
    status: "Achieved",
    reasonCode: "",
    reasonNote: "",
    completedDate: "2026-08-05"
  },
  {
    id: "BKS034",
    name: "Tambun Raya Node",
    month: "2026-08",
    pic: "Aris FOP Bekasi",
    items: "Genset Fuel Level Sensor Check, Battery Impedance Measurement",
    status: "Scheduled",
    reasonCode: "",
    reasonNote: "",
    completedDate: ""
  }
];
