export interface SnapshotCandidatePoint {
  number: string;
  ballotName: string;
  party: string;
  votes: number;
  percentage: number;
}

export interface ElectionSnapshotPoint {
  id: string;
  timestamp: string; // ISO string do momento em que foi registrado/coletado
  tseGeneratedDate: string; // "DD/MM/YYYY"
  tseGeneratedTime: string; // "HH:MM:SS"
  totalizedSections: number;
  totalSections: number;
  percentTotalized: number;
  totalVotes: number;
  validVotes: number;
  candidates: SnapshotCandidatePoint[];
  leaderMarginVotes: number | null;
  leaderMarginPct: number | null;
}

export interface PaceStats {
  sectionsPerMinute: number;
  incorporatedSections: number;
  periodMinutes: number;
  estimatedMinutesRemaining: number | null;
  estimatedCompletionText: string;
}

export interface HistoryTimelineResponse {
  roleCode: '1' | '3';
  scope: string;
  round: number;
  snapshots: ElectionSnapshotPoint[];
  pace: PaceStats;
  changesSummary: string[];
  lastFetchedAt: string;
  serverTime: string;
}
