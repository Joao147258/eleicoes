export interface CandidateResult {
  number: string;
  name: string;
  ballotName: string;
  party: string;
  partyNumber: string;
  federation: string | null;
  coalition: string | null;
  votes: number;
  percentage: number;
  highPrecisionPercentage: number;
  isElected: boolean;
  status: string;
  viceCandidate: {
    name: string;
    ballotName: string;
    party: string;
  } | null;
}

export interface VoterStats {
  totalElectorate: number;
  turnout: number;
  percentTurnout: number;
  abstention: number;
  percentAbstention: number;
}

export interface VoteStats {
  totalVotes: number;
  validVotes: number;
  percentValid: number;
  blankVotes: number;
  percentBlank: number;
  nullVotes: number;
  percentNull: number;
}

export interface ProgressStats {
  totalSections: number;
  totalizedSections: number;
  percentTotalized: number;
  countedSections: number;
  percentCounted: number;
  status: 'not_started' | 'partial' | 'final';
}

export interface LeaderInfo {
  candidate: CandidateResult;
  voteMargin: number;
  percentageMargin: number;
  isTie: boolean;
}

export interface ElectionSummary {
  electionCode: string;
  round: number;
  scope: string; // 'br' ou UF ('sp', 'rj', etc.)
  scopeType: string;
  roleCode: string; // '1' = Presidente, '3' = Governador
  roleDescription: string;
  generatedDate: string;
  generatedTime: string;
  totalizedDate: string;
  totalizedTime: string;
  isFinal: boolean;
  progress: ProgressStats;
  voters: VoterStats;
  votes: VoteStats;
  candidates: CandidateResult[];
  leader: LeaderInfo | null;
  sourceProvenance: {
    origin: string;
    fileId: string;
    fetchedAt: string;
  };
}

export interface StateSummaryOverview {
  uf: string;
  name: string;
  region: string;
  percentTotalized: number;
  isFinal: boolean;
  leaderNumber: string | null;
  leaderName: string | null;
  leaderPercentage: number | null;
  leaderVotes: number | null;
  runnerUpName: string | null;
  runnerUpPercentage: number | null;
  runnerUpVotes: number | null;
  voteMargin: number | null;
  percentageMargin: number | null;
  validVotes: number;
  totalSections: number;
  totalizedSections: number;
  updatedAt: string;
}
