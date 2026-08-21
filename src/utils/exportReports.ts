import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Site, PMSchedule, NMSLog, StatusHistoryItem } from '../types';
import { getPMReasonLabel } from '../data/initialData';

export function exportToExcel(
  sites: Site[],
  pmData: PMSchedule[],
  nmsLogs: NMSLog[],
  history: StatusHistoryItem[]
) {
  const wb = XLSX.utils.book_new();
  const now = new Date();

  const normalCount = sites.filter((s) => s.status === 'Normal').length;
  const warningCount = sites.filter((s) => s.status === 'Warning').length;
  const criticalCount = sites.filter((s) => s.status === 'Critical').length;
  const autoDiscoveredCount = sites.filter((s) => s.isAutoDiscovered).length;

  // Sheet 1: Executive Summary
  const summaryAOA = [
    ['LAPORAN POWER MANAGEMENT SYSTEM - SME OPERATIONS'],
    ['Reliable Energy & OWS Telemetry Sync'],
    [`Tanggal Export: ${now.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}`],
    [],
    ['RINGKASAN STATUS KELISTRIKAN SITE'],
    ['Total Site Terdata', sites.length],
    ['Normal (PLN OK)', normalCount],
    ['Warning (Backup Aktif)', warningCount],
    ['Critical Alert (Discharge / Outage)', criticalCount],
    ['Site Auto-Discovered dari OWS (Perlu Lengkapi Data Master)', autoDiscoveredCount],
    [],
    ['RINGKASAN PREVENTIVE MAINTENANCE (PM)'],
    ['Total Jadwal PM', pmData.length],
    ['Achieved (Tercapai)', pmData.filter((p) => p.status === 'Achieved').length],
    ['Not Achieved (Belum Tercapai)', pmData.filter((p) => p.status === 'Not Achieved').length],
    ['Scheduled (Terjadwal)', pmData.filter((p) => p.status === 'Scheduled').length],
    [],
    ['Total Log Alarm OWS/NMS', nmsLogs.length],
    ['Total Riwayat Perubahan Status', history.length]
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryAOA);
  wsSummary['!cols'] = [{ wch: 35 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Eksekutif');

  // Sheet 2: Master Site Data
  const siteRows = sites.map((s) => ({
    'Site ID': s.id,
    'Nama Site': s.name,
    'Status Power': s.status,
    'Cluster / Area': s.cluster,
    'Status NMS': s.nmsStatus,
    'Alarm Terakhir': s.lastAlarm || '-',
    'Est. Backup Time': s.backupTime || '-',
    'ID Pelanggan PLN': s.plnId || '-',
    'Kapasitas PLN': s.pln || '-',
    'Genset Model': s.genset || '-',
    'Brand Rectifier': s.rect || '-',
    'Battery Bank': s.batt || '-',
    'Router IP RAN': s.router || '-',
    'BBU / RBS': s.rbs || '-',
    'Teknologi': s.tech || '-',
    'Health Score (%)': s.health,
    'PIC Area': s.pic || '-',
    'Koordinat': s.coords || '-',
    'Last PM Date': s.lastPm || '-',
    'Auto Discovered OWS': s.isAutoDiscovered ? 'Ya (Pending Lengkap)' : 'Master Valid'
  }));
  const wsSites = XLSX.utils.json_to_sheet(siteRows);
  wsSites['!cols'] = Object.keys(siteRows[0] || {}).map(() => ({ wch: 20 }));
  XLSX.utils.book_append_sheet(wb, wsSites, 'Data Master Site');

  // Sheet 3: OWS Alarms
  const nmsRows = nmsLogs.length
    ? nmsLogs.map((l) => ({
        'Site ID': l.id,
        'Nama Site': l.siteName || '-',
        'Alarm Name': l.alarm,
        'Severity': l.severity,
        'Waktu Kejadian': l.occurredTime || '-',
        'Status Clear': l.cleared ? 'Cleared' : 'Active',
        'Auto Created Site': l.isAutoCreated ? 'Ya' : 'Tidak'
      }))
    : [{ 'Site ID': '-', 'Nama Site': 'Belum ada log alarm', 'Alarm Name': '-', 'Severity': '-', 'Waktu Kejadian': '-', 'Status Clear': '-', 'Auto Created Site': '-' }];
  const wsNms = XLSX.utils.json_to_sheet(nmsRows);
  wsNms['!cols'] = [{ wch: 14 }, { wch: 22 }, { wch: 35 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsNms, 'Log Alarm OWS');

  // Sheet 4: PM Schedule
  const pmRows = pmData.length
    ? pmData.map((p) => ({
        'Site ID': p.id,
        'Nama Site': p.name,
        'Bulan Target': p.month,
        'PIC / Teknisi': p.pic,
        'Status PM': p.status,
        'Alasan Not Achieved': p.status === 'Not Achieved' ? getPMReasonLabel(p.reasonCode) : '-',
        'Keterangan': p.reasonNote || '-',
        'Tanggal Selesai': p.completedDate || '-',
        'Scope & Checklist': p.items
      }))
    : [{ 'Site ID': '-', 'Nama Site': 'Belum ada data PM', 'Bulan Target': '-', 'PIC / Teknisi': '-', 'Status PM': '-', 'Alasan Not Achieved': '-', 'Keterangan': '-', 'Tanggal Selesai': '-', 'Scope & Checklist': '-' }];
  const wsPm = XLSX.utils.json_to_sheet(pmRows);
  wsPm['!cols'] = [{ wch: 14 }, { wch: 22 }, { wch: 15 }, { wch: 20 }, { wch: 16 }, { wch: 30 }, { wch: 30 }, { wch: 18 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsPm, 'Jadwal PM');

  // Sheet 5: History Log
  const histRows = history.length
    ? history.map((h) => ({
        'Waktu': new Date(h.ts).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        'Site ID': h.id,
        'Nama Site': h.name,
        'Status Sebelum': h.from,
        'Status Baru': h.to,
        'Sumber': h.source,
        'Detail Keterangan': h.detail
      }))
    : [{ 'Waktu': '-', 'Site ID': '-', 'Nama Site': 'Belum ada riwayat', 'Status Sebelum': '-', 'Status Baru': '-', 'Sumber': '-', 'Detail Keterangan': '-' }];
  const wsHist = XLSX.utils.json_to_sheet(histRows);
  wsHist['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsHist, 'Riwayat Status');

  const filename = `Laporan_SME_Power_OWS_${now.toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportToPDF(
  sites: Site[],
  pmData: PMSchedule[],
  nmsLogs: NMSLog[]
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const now = new Date();
  const pageWidth = doc.internal.pageSize.getWidth();

  const normalCount = sites.filter((s) => s.status === 'Normal').length;
  const warningCount = sites.filter((s) => s.status === 'Warning').length;
  const criticalCount = sites.filter((s) => s.status === 'Critical').length;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 26, 'F');
  
  doc.setTextColor(251, 191, 36); // amber-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('POWER MANAGEMENT SYSTEM - SME OPERATIONS', 14, 11);

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Reliable Energy & OWS Live Telemetry Sync', 14, 17);
  doc.text(`Waktu Cetak: ${now.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}`, 14, 22);

  let y = 34;

  // KPI Metrics Boxes
  const kpis = [
    { label: 'Total Site', value: sites.length, color: [51, 65, 85] },
    { label: 'Normal (PLN OK)', value: normalCount, color: [16, 185, 129] },
    { label: 'Warning (Backup)', value: warningCount, color: [245, 158, 11] },
    { label: 'Critical Alert', value: criticalCount, color: [239, 68, 68] }
  ];

  const boxW = (pageWidth - 28 - 9) / 4;
  kpis.forEach((k, i) => {
    const x = 14 + i * (boxW + 3);
    doc.setDrawColor(...(k.color as [number, number, number]));
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, boxW, 16, 1.5, 1.5, 'FD');

    doc.setTextColor(...(k.color as [number, number, number]));
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(String(k.value), x + boxW / 2, y + 8, { align: 'center' });

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(k.label, x + boxW / 2, y + 13, { align: 'center' });
  });

  y += 24;

  // Priority Action List
  const prioritySites = sites.filter((s) => s.status === 'Critical' || s.status === 'Warning');
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Priority Action List (Immediate Dispatch)', 14, y);

  (doc as any).autoTable({
    startY: y + 3,
    head: [['Site ID', 'Nama Site', 'Status', 'Alarm Terakhir OWS', 'Est. Backup', 'PIC Area']],
    body: prioritySites.length
      ? prioritySites.map((s) => [s.id, s.name, s.status, s.lastAlarm || '-', s.backupTime || '-', s.pic || '-'])
      : [['-', 'Semua site dalam kondisi normal PLN OK', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [251, 191, 36], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  let y2 = (doc as any).lastAutoTable.finalY + 10;

  // Master Site Overview Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Daftar Rekap Master Site Power', 14, y2);

  (doc as any).autoTable({
    startY: y2 + 3,
    head: [['Site ID', 'Nama Site', 'Cluster', 'PLN ID', 'Daya PLN', 'Health', 'Status', 'NMS']],
    body: sites.map((s) => [
      s.id,
      s.name,
      s.cluster,
      s.plnId || '-',
      s.pln || '-',
      `${s.health}%`,
      s.status,
      s.nmsStatus
    ]),
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [251, 191, 36], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  // PM Schedule Page / Section
  let y3 = (doc as any).lastAutoTable.finalY + 10;
  if (y3 > 240) {
    doc.addPage();
    y3 = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Jadwal & Evaluasi Preventive Maintenance (PM)', 14, y3);

  (doc as any).autoTable({
    startY: y3 + 3,
    head: [['Site ID', 'Nama Site', 'Bulan', 'PIC', 'Status', 'Alasan / Detail']],
    body: pmData.map((p) => [
      p.id,
      p.name,
      p.month,
      p.pic,
      p.status,
      p.status === 'Not Achieved'
        ? `${getPMReasonLabel(p.reasonCode)}${p.reasonNote ? ' - ' + p.reasonNote : ''}`
        : p.items
    ]),
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [251, 191, 36], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  // Footer page numbers
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Halaman ${i} dari ${totalPages} • SME Power Operations Report`, pageWidth / 2, doc.internal.pageSize.getHeight() - 6, { align: 'center' });
  }

  doc.save(`Laporan_SME_Power_${now.toISOString().split('T')[0]}.pdf`);
}
