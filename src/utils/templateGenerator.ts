import * as XLSX from 'xlsx';

export function downloadMasterSiteTemplate() {
  const wb = XLSX.utils.book_new();

  const headers = [
    'Site ID *',
    'Site Name *',
    'Cluster / Area',
    'ID Pelanggan PLN',
    'Kapasitas PLN (kVA)',
    'Genset Model / Kapasitas',
    'Brand Rectifier',
    'Battery Bank',
    'Router IP RAN',
    'RBS / BBU Module',
    'Teknologi (cth: 2G, 4G, 5G)',
    'PIC Area / Vendor',
    'Koordinat (Lat, Long)',
    'Tanggal Terakhir PM (YYYY-MM-DD)'
  ];

  const sampleRows = [
    [
      'BGR001',
      'Pajajaran Hub',
      'Bogor Timur',
      '537310892019',
      '33 kVA',
      'Himoinsa 40 kVA',
      'Huawei TP48200B',
      '2 Bank (Lithium 200Ah)',
      'Huawei ATN 950B',
      'Huawei BBU3910 / Blade',
      '2G, 3G, 4G, 5G',
      'Bachtiar Sigit (MKU)',
      '-6.5950, 106.8050',
      '2026-08-10'
    ],
    [
      'BGR002',
      'Sukaraja Tower',
      'Bogor Utara',
      '537310441823',
      '23 kVA',
      'Himoinsa 35 kVA',
      'Huawei TP48150A',
      '1 Bank (VRLA 100Ah)',
      'Huawei ATN 910',
      'Huawei BBU3900',
      '2G, 4G',
      'FOP Team Sukaraja',
      '-6.5562, 106.8281',
      '2026-07-22'
    ],
    [
      'JKT045',
      'Saharjo Apex',
      'Jakarta Selatan',
      '542109883412',
      '41.5 kVA',
      'Himoinsa 50 kVA',
      'Huawei TP48300B',
      '3 Bank (Lithium 300Ah)',
      'Huawei NetEngine 8000',
      'Huawei BBU5900 5G',
      '2G, 4G, 5G',
      'SME Support Jkt',
      '-6.2234, 106.8451',
      '2026-06-15'
    ]
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
  ws['!cols'] = [
    { wch: 14 },
    { wch: 22 },
    { wch: 18 },
    { wch: 20 },
    { wch: 22 },
    { wch: 25 },
    { wch: 22 },
    { wch: 25 },
    { wch: 22 },
    { wch: 24 },
    { wch: 24 },
    { wch: 24 },
    { wch: 22 },
    { wch: 25 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Master Data Site');

  // Instructions Sheet
  const instructions = [
    ['PANDUAN PENGISIAN MASTER DATA SITE SME POWER'],
    [''],
    ['1. Kolom bertanda bintang (*) WAJIB diisi: Site ID dan Site Name.'],
    ['2. Kolom lainnya OPSIONAL dan bisa dilengkapi bertahap saat data lapangan tersedia.'],
    ['3. ID Pelanggan PLN sangat direkomendasikan untuk memudahkan penelusuran tiket PLN saat blackout.'],
    ['4. File ini bisa langsung diunggah melalui menu "Import Master Site" di web.'],
    ['5. Jangan mengubah nama baris header pada Sheet1.']
  ];
  const wsGuide = XLSX.utils.aoa_to_sheet(instructions);
  XLSX.utils.book_append_sheet(wb, wsGuide, 'Petunjuk Pengisian');

  XLSX.writeFile(wb, 'Template_Master_Data_Site_SME.xlsx');
}

export function downloadPMTemplate() {
  const wb = XLSX.utils.book_new();

  const headers = [
    'Site ID *',
    'Nama Site',
    'Bulan Target (YYYY-MM) *',
    'PIC / Teknisi *',
    'Scope / Item Servis *',
    'Status (Scheduled / Achieved / Not Achieved)',
    'Alasan Not Achieved (akses/sparepart/jadwal/cuaca/corrective/lainnya)',
    'Keterangan Tambahan'
  ];

  const sampleRows = [
    [
      'BGR001',
      'Pajajaran Hub',
      '2026-08',
      'FOP Team Bogor',
      'Genset Oil & Filter Check, Battery Capacity Test, PLN Grounding',
      'Scheduled',
      '',
      ''
    ],
    [
      'BGR002',
      'Sukaraja Tower',
      '2026-08',
      'Teknisi CME MKU',
      'Rectifier Fan Clean, PLN Grounding Measurement',
      'Not Achieved',
      'sparepart',
      'Menunggu kiriman kipas rectifier dari gudang pusat'
    ]
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
  ws['!cols'] = [
    { wch: 14 },
    { wch: 22 },
    { wch: 24 },
    { wch: 22 },
    { wch: 45 },
    { wch: 22 },
    { wch: 25 },
    { wch: 35 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Jadwal PM');
  XLSX.writeFile(wb, 'Template_Jadwal_PM_SME.xlsx');
}

export function downloadSampleOWSFeed() {
  const wb = XLSX.utils.book_new();

  const headers = [
    'NE Name',
    'Alarm Name',
    'Severity',
    'Event Time',
    'Clear Status',
    'Specific Problem'
  ];

  const sampleRows = [
    [
      'BGR001_Pajajaran',
      'Mains Fail (PLN Down)',
      'Major',
      new Date().toISOString().replace('T', ' ').substring(0, 19),
      'Uncleared',
      'AC power grid outage detected'
    ],
    [
      'JKT045_Saharjo',
      'Low Voltage Battery Disconnect (LVBD)',
      'Critical',
      new Date().toISOString().replace('T', ' ').substring(0, 19),
      'Uncleared',
      'Battery voltage dropped below 43.2V'
    ],
    [
      'BDG091_BarosHub', // Unregistered site sample for auto-discovery
      'Genset Running Active',
      'Major',
      new Date().toISOString().replace('T', ' ').substring(0, 19),
      'Uncleared',
      'Auxiliary ATS transfer switched to genset'
    ]
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
  ws['!cols'] = [
    { wch: 22 },
    { wch: 35 },
    { wch: 16 },
    { wch: 24 },
    { wch: 16 },
    { wch: 40 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'OWS Alarm Query');
  XLSX.writeFile(wb, 'Contoh_OWS_Alarm_Query_Huawei.xlsx');
}
