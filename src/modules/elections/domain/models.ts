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

export type ResultStatus =
  | 'nao_definido'
  | 'lideranca_parcial'
  | 'eleito_definido'
  | 'sob_revisao';

export type TotalizationStatus =
  | 'aguardando'
  | 'em_andamento'
  | 'totalizada'
  | 'retotalizacao'
  | 'indisponivel';

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
  resultStatus?: ResultStatus;
  resultStatusLabel?: string;
  totalizationStatus?: TotalizationStatus;
  totalizationStatusLabel?: string;
  electedCandidate?: CandidateResult | null;
  declaredAt?: string;
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

export interface CandidateComparisonItem {
  number: string;
  name: string;
  ballotName: string;
  party: string;
  partyNumber: string;
  votes1T: number | null;
  percentage1T: number | null;
  votes2T: number | null;
  percentage2T: number | null;
  voteDiff: number | null; // votes2T - votes1T
  percentageDiff: number | null; // percentage2T - percentage1T
  isElected1T: boolean;
  isElected2T: boolean;
  status1T?: string;
  status2T?: string;
}

export type GovernorElectionStatus =
  | 'segundo_turno'
  | 'definida_1t'
  | 'nao_confirmada'
  | 'indisponivel';

export interface RoundComparison {
  roleCode: '1' | '3';
  roleDescription: string;
  scope: string;
  scopeName: string;
  statusElection: GovernorElectionStatus;
  statusMessage: string;
  firstRound: ElectionSummary | null;
  secondRound: ElectionSummary | null;
  candidates: CandidateComparisonItem[];
  votersComparison: {
    totalElectorate1T: number | null;
    totalElectorate2T: number | null;
    turnout1T: number | null;
    turnout2T: number | null;
    turnoutDiff: number | null;
    percentTurnout1T: number | null;
    percentTurnout2T: number | null;
    abstention1T: number | null;
    abstention2T: number | null;
    abstentionDiff: number | null;
    percentAbstention1T: number | null;
    percentAbstention2T: number | null;
    validVotes1T: number | null;
    validVotes2T: number | null;
    blankVotes1T: number | null;
    blankVotes2T: number | null;
    nullVotes1T: number | null;
    nullVotes2T: number | null;
  };
}

export interface GovernorStateOverview {
  uf: string;
  name: string;
  region: string;
  status: GovernorElectionStatus;
  statusLabel: string;
  isFinal: boolean;
  percentTotalized: number;
  totalSections: number;
  totalizedSections: number;
  leaderOrElected: {
    name: string;
    ballotName: string;
    party: string;
    number: string;
    percentage: number;
    votes: number;
    isElected: boolean;
    status: string;
  } | null;
  runnerUp: {
    name: string;
    ballotName: string;
    party: string;
    number: string;
    percentage: number;
    votes: number;
  } | null;
  roundInDisplay: 1 | 2;
  updatedAt: string;
}
