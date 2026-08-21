export type PowerStatus = 'Normal' | 'Warning' | 'Critical';
export type NMSStatus = 'Connected' | 'Disconnected' | 'Unregistered';
export type PMStatus = 'Scheduled' | 'Achieved' | 'Not Achieved';

export interface Site {
  id: string;
  name: string;
  cluster: string;
  coords: string;
  pic: string;
  plnId: string;
  lastPm: string;
  nmsStatus: NMSStatus;
  nav: string;
  tech: string;
  pln: string;
  genset: string;
  rect: string;
  batt: string;
  router: string;
  rbs: string;
  health: number;
  status: PowerStatus;
  backupTime: string;
  lastAlarm: string;
  isAutoDiscovered?: boolean;
  discoveredAt?: string;
  missingFieldsCount?: number;
}

export interface NMSLog {
  id: string;
  siteName?: string;
  alarm: string;
  severity: string;
  occurredTime?: string;
  clearedTime?: string;
  cleared: boolean;
  matched: boolean;
  isAutoCreated?: boolean;
  rank: number; // 0: Normal/Cleared, 1: Minor/Info, 2: Warning, 3: Critical
  rawSource?: string;
}

export interface PMSchedule {
  id: string;
  name: string;
  month: string; // YYYY-MM
  pic: string;
  items: string;
  status: PMStatus;
  reasonCode?: string;
  reasonNote?: string;
  completedDate?: string;
}

export interface StatusHistoryItem {
  ts: string;
  id: string;
  name: string;
  from: PowerStatus | string;
  to: PowerStatus | string;
  source: string;
  detail: string;
}

export interface PMReasonOption {
  code: string;
  label: string;
}

export interface OWSParseSummary {
  totalRows: number;
  validAlarms: number;
  matchedSites: number;
  autoCreatedSites: number;
  updatedSites: number;
  clearedAlarms: number;
  criticalCount: number;
  warningCount: number;
}
