import {
  CandidateResult,
  ElectionSummary,
  LeaderInfo,
  ProgressStats,
  VoterStats,
  VoteStats,
} from '../../domain/models';
import { TseEA20Raw } from './schemas';

export function normalizeTseEA20(raw: TseEA20Raw, originUrl?: string): ElectionSummary {
  const cargo = raw.carg[0];
  if (!cargo) {
    throw new Error('Arquivo do TSE sem informações de cargo (carg).');
  }

  // Mapa de federações
  const federationMap = new Map<string, string>();
  if (cargo.fed) {
    for (const f of cargo.fed) {
      federationMap.set(f.n, f.nm || f.sg);
    }
  }

  const candidates: CandidateResult[] = [];

  for (const coalition of cargo.agr) {
    const coalitionName = coalition.nm || coalition.com || null;
    for (const party of coalition.par) {
      const partyName = party.sg || party.nm;
      const partyNumber = party.n;
      const federationName = party.nfed ? federationMap.get(party.nfed) || null : null;

      for (const cand of party.cand) {
        let vice: CandidateResult['viceCandidate'] = null;
        if (cand.vs && cand.vs.length > 0) {
          const v = cand.vs[0];
          vice = {
            name: v.nm,
            ballotName: v.nmu || v.nm,
            party: v.sgp || partyName,
          };
        }

        candidates.push({
          number: cand.n,
          name: cand.nm,
          ballotName: cand.nmu || cand.nm,
          party: partyName,
          partyNumber,
          federation: federationName,
          coalition: coalitionName,
          votes: cand.vap,
          percentage: cand.pvap,
          highPrecisionPercentage: cand.pvapn ?? cand.pvap,
          isElected: cand.e === 's',
          status: cand.dvt || 'Válido',
          viceCandidate: vice,
        });
      }
    }
  }

  // Ordenação por votos apurados decrescente
  candidates.sort((a, b) => b.votes - a.votes);

  // Determinação de liderança e margens
  let leader: LeaderInfo | null = null;
  if (candidates.length > 0) {
    const first = candidates[0];
    const second = candidates[1];

    if (second) {
      const voteMargin = first.votes - second.votes;
      const percentageMargin = Number((first.percentage - second.percentage).toFixed(2));
      const isTie = first.votes === second.votes;

      leader = {
        candidate: first,
        voteMargin,
        percentageMargin,
        isTie,
      };
    } else {
      leader = {
        candidate: first,
        voteMargin: first.votes,
        percentageMargin: first.percentage,
        isTie: false,
      };
    }
  }

  // Andamento da totalização
  let status: ProgressStats['status'] = 'partial';
  if (raw.and === 'n' || raw.s.st === 0) {
    status = 'not_started';
  } else if (raw.tf === 's' || raw.and === 'f') {
    status = 'final';
  }

  const progress: ProgressStats = {
    totalSections: raw.s.ts,
    totalizedSections: raw.s.st,
    percentTotalized: raw.s.pst,
    countedSections: raw.s.sa ?? raw.s.st,
    percentCounted: raw.s.psa ?? raw.s.pst,
    status,
  };

  const voters: VoterStats = {
    totalElectorate: raw.e.te,
    turnout: raw.e.c,
    percentTurnout: raw.e.pc,
    abstention: raw.e.a,
    percentAbstention: raw.e.pa,
  };

  const votes: VoteStats = {
    totalVotes: raw.v.tv,
    validVotes: raw.v.vv,
    percentValid: raw.v.tv > 0 ? Number(((raw.v.vv / raw.v.tv) * 100).toFixed(2)) : 0,
    blankVotes: raw.v.vb,
    percentBlank: raw.v.pvb,
    nullVotes: raw.v.vn,
    percentNull: raw.v.pvn,
  };

  const roleDescription = cargo.nmn || (cargo.cd === '1' ? 'Presidente' : 'Governador');

  return {
    electionCode: raw.ele,
    round: Number(raw.t),
    scope: raw.cdabr.toLowerCase(),
    scopeType: raw.tpabr,
    roleCode: cargo.cd,
    roleDescription,
    generatedDate: raw.dg,
    generatedTime: raw.hg,
    totalizedDate: raw.dt,
    totalizedTime: raw.ht,
    isFinal: raw.tf === 's',
    progress,
    voters,
    votes,
    candidates,
    leader,
    sourceProvenance: {
      origin: originUrl || 'Tribunal Superior Eleitoral (TSE) - Dados Oficiais',
      fileId: raw.idg || `${raw.ele}-${raw.cdabr}`,
      fetchedAt: new Date().toISOString(),
    },
  };
}
