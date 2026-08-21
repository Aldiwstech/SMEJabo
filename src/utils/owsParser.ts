import * as XLSX from 'xlsx';
import { Site, NMSLog, StatusHistoryItem, OWSParseSummary, PowerStatus } from '../types';

function normalizeKey(str: string): string {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function findVal(row: Record<string, any>, candidates: string[]): any {
  const keys = Object.keys(row);
  for (const c of candidates) {
    const normC = normalizeKey(c);
    const found = keys.find((k) => normalizeKey(k) === normC);
    if (found && row[found] !== undefined && row[found] !== null && String(row[found]).trim() !== '') {
      return row[found];
    }
  }
  return null;
}

export function extractSiteId(rawStr: string): string {
  if (!rawStr) return '';
  const str = String(rawStr).trim();
  
  // Match standard Indonesian telecom site patterns like BGR001, JKT045, TGR1021, BKS01, BDG992
  const match = str.match(/\b([A-Za-z]{2,5}[-_]?[0-9]{2,5}[A-Za-z]?)\b/);
  if (match) {
    return match[1].replace(/[-_]/g, '').toUpperCase();
  }
  
  // If single token without spaces
  const clean = str.split(/[\s_\-\/,]/)[0].toUpperCase();
  return clean || str.toUpperCase();
}

export function inferClusterFromId(id: string): string {
  const upper = id.toUpperCase();
  if (upper.startsWith('JKT') || upper.startsWith('JAK')) return 'Jakarta Area';
  if (upper.startsWith('BGR') || upper.startsWith('BOG')) return 'Bogor Area';
  if (upper.startsWith('DEP')) return 'Depok Area';
  if (upper.startsWith('TGR') || upper.startsWith('TNG')) return 'Tangerang Area';
  if (upper.startsWith('BKS') || upper.startsWith('BEK')) return 'Bekasi Area';
  if (upper.startsWith('BDG') || upper.startsWith('BAN')) return 'Bandung Area';
  if (upper.startsWith('CRB')) return 'Cirebon Area';
  if (upper.startsWith('SMG')) return 'Semarang Area';
  if (upper.startsWith('SBY') || upper.startsWith('SUR')) return 'Surabaya Area';
  if (upper.startsWith('MDN')) return 'Medan Area';
  if (upper.startsWith('DPS')) return 'Bali / Denpasar Area';
  if (upper.startsWith('MKS')) return 'Makassar Area';
  return 'Cluster SME / Jabo';
}

const CRITICAL_PATTERNS = [
  /low\s*voltage\s*batt(ery)?\s*disconnect/i,
  /\blvbd\b/i,
  /batt(ery)?\s*(deep\s*)?discharge/i,
  /\bdc\s*power\s*(fail|off|down)/i,
  /rectifier\s*(fail|down|off|shutdown|alarm)/i,
  /genset\s*(fail|trip|down|fault)/i,
  /site\s*(down|outage)/i,
  /total\s*(power\s*)?(off|blackout|failure)/i,
  /\bpln\s*(putus|disconnect)\b/i,
  /high\s*temp(erature)?\s*shutdown/i,
  /critical\s*power/i
];

const WARNING_PATTERNS = [
  /mains\s*fail/i,
  /\bpln\s*(fail|padam|off|down)\b/i,
  /\bblackout\b/i,
  /batt(ery)?\s*(low|voltage\s*low|capacity\s*low)/i,
  /genset\s*(running|on|start|active|jalan)/i,
  /(high|over)\s*temp(erature)?/i,
  /door\s*(open|alarm)/i,
  /pintu\s*(terbuka|jebol)/i,
  /rectifier\s*(minor|communication|module\s*fault)/i,
  /air\s*conditioner\s*(fail|down)/i,
  /smoke\s*alarm/i
];

export function classifyAlarmText(text: string): number {
  const t = String(text || '').toLowerCase();
  for (const p of CRITICAL_PATTERNS) {
    if (p.test(t)) return 3; // Critical
  }
  for (const p of WARNING_PATTERNS) {
    if (p.test(t)) return 2; // Warning
  }
  return 1; // Minor / info
}

export function severityRank(text: string): number {
  const t = String(text || '').toLowerCase();
  if (/critical|kritis|emergency|urgent/.test(t)) return 3;
  if (/major|mayor|warning|peringatan/.test(t)) return 2;
  if (/minor|info|notice/.test(t)) return 1;
  return 0;
}

export function isAlarmCleared(row: Record<string, any>): boolean {
  const statusVal = findVal(row, [
    'alarmstatus', 'clearstatus', 'clearedstatus', 'ackstatus',
    'status', 'state', 'alarm_status', 'clear_status'
  ]);
  const clearTime = findVal(row, [
    'cleartime', 'clearedtime', 'timecleared', 'clear_time', 'recovery_time', 'end_time'
  ]);

  if (clearTime && String(clearTime).trim() !== '' && String(clearTime).trim() !== '-' && String(clearTime).trim() !== '0') {
    return true;
  }

  if (statusVal) {
    const s = String(statusVal).toLowerCase();
    if (/clear|resolved|normal|selesai|\bok\b|recovered/i.test(s) && !/uncle/i.test(s)) {
      return true;
    }
  }
  return false;
}

export function parseRowsToLogsAndSites(
  rawRows: Record<string, any>[],
  existingSites: Site[]
): {
  updatedSites: Site[];
  newLogs: NMSLog[];
  newHistories: StatusHistoryItem[];
  summary: OWSParseSummary;
} {
  const sitesMap = new Map<string, Site>();
  existingSites.forEach((s) => sitesMap.set(s.id.toUpperCase(), { ...s }));

  const newLogs: NMSLog[] = [];
  const newHistories: StatusHistoryItem[] = [];
  const siteAgg = new Map<string, { bestRank: number; bestAlarm: string; activeCount: number; lastTime: string }>();

  let autoCreatedCount = 0;
  let clearedCount = 0;
  let criticalCount = 0;
  let warningCount = 0;

  const idCandidates = [
    'siteid', 'site_id', 'id', 'site', 'idsite',
    'ne_name', 'nename', 'ne', 'object_name', 'objectname',
    'node_id', 'nodeid', 'node', 'equipment_name', 'location_name',
    'element_name', 'me_name', 'bts_name', 'cell_name'
  ];

  const nameCandidates = [
    'sitename', 'site_name', 'name', 'namasite', 'location',
    'object_name', 'ne_name', 'station_name'
  ];

  const alarmCandidates = [
    'alarmname', 'alarm_name', 'alarm', 'alarm_description',
    'alarmdescription', 'event_name', 'eventname', 'specific_problem',
    'specificproblem', 'alarm_title', 'alarmtitle', 'probable_cause',
    'title', 'event_type', 'eventtype', 'summary'
  ];

  const severityCandidates = [
    'severity', 'perceived_severity', 'perceivedseverity',
    'alarm_severity', 'alarmseverity', 'level', 'alarm_level', 'priority'
  ];

  const timeCandidates = [
    'event_time', 'eventtime', 'occurrence_time', 'occurrencetime',
    'first_occurred', 'alarm_time', 'alarmtime', 'createtime',
    'create_time', 'time', 'timestamp'
  ];

  rawRows.forEach((row, rowIndex) => {
    const rawId = findVal(row, idCandidates);
    const rawAlarm = findVal(row, alarmCandidates);
    const rawSev = findVal(row, severityCandidates) || 'Major';
    const rawTime = findVal(row, timeCandidates) || new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (!rawId && !rawAlarm) return;

    const extractedId = extractSiteId(rawId || `SITE_${rowIndex + 1}`);
    const alarmText = String(rawAlarm || 'OWS Telemetry Alarm');
    const cleared = isAlarmCleared(row);

    if (cleared) clearedCount++;

    const catRank = classifyAlarmText(alarmText);
    const sevRank = severityRank(rawSev);
    const finalRank = cleared ? 0 : Math.max(catRank, sevRank);

    if (finalRank === 3) criticalCount++;
    else if (finalRank === 2) warningCount++;

    // Check if site exists
    let site = sitesMap.get(extractedId);
    let isAutoCreated = false;

    if (!site) {
      // AUTO-DISCOVERY: Create minimal site entry so user never encounters an error!
      const rawSiteName = findVal(row, nameCandidates);
      const siteName = rawSiteName ? String(rawSiteName).trim() : `Site ${extractedId}`;
      const cluster = inferClusterFromId(extractedId);

      site = {
        id: extractedId,
        name: siteName,
        cluster,
        coords: "-6.2088, 106.8456", // Default Jakarta/Jabo center
        pic: "Tim FOP Area (Auto-Assigned)",
        plnId: "- (Perlu diisi)",
        lastPm: "",
        nmsStatus: "Connected",
        nav: "99.90%",
        tech: "2G, 4G",
        pln: "Perlu konfirmasi kVA",
        genset: "Portable Ready",
        rect: "Huawei / Multi-brand",
        batt: "Lithium / VRLA Standard",
        router: "Huawei IP RAN",
        rbs: "Huawei BBU",
        health: 85,
        status: "Normal",
        backupTime: "N/A",
        lastAlarm: "-",
        isAutoDiscovered: true,
        discoveredAt: new Date().toISOString(),
        missingFieldsCount: 4
      };

      sitesMap.set(extractedId, site);
      autoCreatedCount++;
      isAutoCreated = true;
    }

    newLogs.push({
      id: extractedId,
      siteName: site.name,
      alarm: alarmText,
      severity: String(rawSev),
      occurredTime: String(rawTime),
      cleared,
      matched: true,
      isAutoCreated,
      rank: finalRank,
      rawSource: JSON.stringify(row)
    });

    if (finalRank > 0) {
      let cur = siteAgg.get(extractedId);
      if (!cur) {
        cur = { bestRank: 0, bestAlarm: '', activeCount: 0, lastTime: String(rawTime) };
        siteAgg.set(extractedId, cur);
      }
      cur.activeCount += 1;
      if (finalRank > cur.bestRank) {
        cur.bestRank = finalRank;
        cur.bestAlarm = alarmText;
      }
    }
  });

  // Apply aggregated alarms to sites
  let updatedSitesCount = 0;
  sitesMap.forEach((site, idKey) => {
    const agg = siteAgg.get(idKey);
    const prevStatus = site.status;

    if (agg && agg.activeCount > 0) {
      site.lastAlarm = agg.activeCount > 1 ? `${agg.bestAlarm} (+${agg.activeCount - 1} alarm lain)` : agg.bestAlarm;
      site.nmsStatus = 'Connected';

      if (agg.bestRank === 3) {
        site.status = 'Critical';
        site.backupTime = '0.5 - 1.5 Jam';
        site.health = Math.min(site.health, 55);
      } else if (agg.bestRank === 2) {
        site.status = 'Warning';
        site.backupTime = '2.5 - 4.0 Jam';
        site.health = Math.min(site.health, 78);
      }

      if (prevStatus !== site.status) {
        newHistories.push({
          ts: new Date().toISOString(),
          id: site.id,
          name: site.name,
          from: prevStatus,
          to: site.status,
          source: 'OWS Live Query',
          detail: site.lastAlarm
        });
        updatedSitesCount++;
      }
    }
  });

  return {
    updatedSites: Array.from(sitesMap.values()),
    newLogs,
    newHistories,
    summary: {
      totalRows: rawRows.length,
      validAlarms: newLogs.length,
      matchedSites: sitesMap.size,
      autoCreatedSites: autoCreatedCount,
      updatedSites: updatedSitesCount,
      clearedAlarms: clearedCount,
      criticalCount,
      warningCount
    }
  };
}

export function parseOWSFile(
  fileBuffer: ArrayBuffer,
  existingSites: Site[]
): {
  updatedSites: Site[];
  newLogs: NMSLog[];
  newHistories: StatusHistoryItem[];
  summary: OWSParseSummary;
} {
  const wb = XLSX.read(new Uint8Array(fileBuffer), { type: 'array' });
  const firstSheet = wb.Sheets[wb.SheetNames[0]];
  const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet);
  return parseRowsToLogsAndSites(jsonRows, existingSites);
}

export function parseOWSText(
  rawText: string,
  existingSites: Site[]
): {
  updatedSites: Site[];
  newLogs: NMSLog[];
  newHistories: StatusHistoryItem[];
  summary: OWSParseSummary;
} {
  const lines = rawText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    throw new Error('Teks alarm kosong.');
  }

  // Detect delimiter: tab (\t), comma (,), semicolon (;), pipe (|)
  const headerLine = lines[0];
  let delimiter = '\t';
  if (headerLine.includes('\t')) delimiter = '\t';
  else if (headerLine.includes(';')) delimiter = ';';
  else if (headerLine.includes(',')) delimiter = ',';
  else if (headerLine.includes('|')) delimiter = '|';

  // Check if first line looks like header
  const headers = headerLine.split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const hasIdHeader = headers.some((h) =>
    ['site', 'ne', 'id', 'node', 'object', 'element', 'name'].some((k) =>
      normalizeKey(h).includes(k)
    )
  );

  const parsedRows: Record<string, any>[] = [];

  const startIndex = hasIdHeader ? 1 : 0;
  for (let i = startIndex; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length === 0 || (cols.length === 1 && cols[0] === '')) continue;

    const rowObj: Record<string, any> = {};
    if (hasIdHeader) {
      headers.forEach((h, colIdx) => {
        rowObj[h] = cols[colIdx] || '';
      });
    } else {
      // Guess columns: 0 = Site ID/NE Name, 1 = Alarm Name, 2 = Severity, 3 = Time/Status
      rowObj['Site ID'] = cols[0] || '';
      rowObj['Alarm Name'] = cols[1] || 'OWS Power Alert';
      rowObj['Severity'] = cols[2] || 'Major';
      rowObj['Time'] = cols[3] || new Date().toISOString();
    }
    parsedRows.push(rowObj);
  }

  return parseRowsToLogsAndSites(parsedRows, existingSites);
}
