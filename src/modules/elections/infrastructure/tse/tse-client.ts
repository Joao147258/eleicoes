import {
  ElectionSummary,
  RoundComparison,
  CandidateComparisonItem,
  GovernorStateOverview,
  GovernorElectionStatus,
} from '../../domain/models';
import { normalizeTseEA20 } from './normalizer';
import { tseEA20Schema } from './schemas';
import { BRAZIL_STATES } from '@/data/geography/brazil-states';

const DEFAULT_CDN_BASE_URL = 'https://resultados.tse.jus.br/oficial';
export const ELECTION_CODES = {
  PRESIDENT_1T: '6257',
  PRESIDENT_2T: '6258',
  GOVERNOR_1T: '6259',
  GOVERNOR_2T: '6260',
} as const;

export interface FetchElectionOptions {
  scope?: string;
  electionCode?: string;
  roleCode?: '0001' | '0003' | '1' | '3';
}

export class TseClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.TSE_CDN_BASE_URL || DEFAULT_CDN_BASE_URL;
  }

  public getPresidentResultUrl(
    scope: string = 'br',
    electionCode: string = ELECTION_CODES.PRESIDENT_2T
  ): string {
    const s = scope.toLowerCase();
    const cycle = 'ele2026';
    return `${this.baseUrl}/${cycle}/${electionCode}/dados/${s}/${s}-c0001-e00${electionCode}-u.json`;
  }

  public getGovernorResultUrl(
    uf: string,
    electionCode: string = ELECTION_CODES.GOVERNOR_2T
  ): string {
    const s = uf.toLowerCase();
    const cycle = 'ele2026';
    return `${this.baseUrl}/${cycle}/${electionCode}/dados/${s}/${s}-c0003-e00${electionCode}-u.json`;
  }

  public async fetchPresidentResults(
    scope: string = 'br',
    electionCode: string = ELECTION_CODES.PRESIDENT_2T
  ): Promise<ElectionSummary> {
    const url = this.getPresidentResultUrl(scope, electionCode);
    return this.fetchAndNormalize(url);
  }

  public async fetchGovernorResults(
    uf: string,
    electionCode: string = ELECTION_CODES.GOVERNOR_2T
  ): Promise<ElectionSummary> {
    const url = this.getGovernorResultUrl(uf, electionCode);
    return this.fetchAndNormalize(url);
  }

  public async fetchRoundComparison(
    role: 'presidente' | 'governador',
    scope: string = 'br'
  ): Promise<RoundComparison> {
    const cleanScope = scope.toLowerCase();
    const isPresident = role === 'presidente';
    const roleCode = isPresident ? '1' : '3';
    const roleDescription = isPresident ? 'Presidente da República' : 'Governador';

    let firstSummary: ElectionSummary | null = null;
    let secondSummary: ElectionSummary | null = null;
    let firstError: Error | null = null;
    let secondError: Error | null = null;

    if (isPresident) {
      try {
        firstSummary = await this.fetchPresidentResults(cleanScope, ELECTION_CODES.PRESIDENT_1T);
      } catch (err: unknown) {
        firstError = err instanceof Error ? err : new Error(String(err));
      }

      try {
        secondSummary = await this.fetchPresidentResults(cleanScope, ELECTION_CODES.PRESIDENT_2T);
      } catch (err: unknown) {
        secondError = err instanceof Error ? err : new Error(String(err));
      }
    } else {
      try {
        firstSummary = await this.fetchGovernorResults(cleanScope, ELECTION_CODES.GOVERNOR_1T);
      } catch (err: unknown) {
        firstError = err instanceof Error ? err : new Error(String(err));
      }

      try {
        secondSummary = await this.fetchGovernorResults(cleanScope, ELECTION_CODES.GOVERNOR_2T);
      } catch (err: unknown) {
        secondError = err instanceof Error ? err : new Error(String(err));
      }
    }

    // Determinação do status oficial da eleição
    let statusElection: GovernorElectionStatus = 'segundo_turno';
    let statusMessage = '';

    if (isPresident) {
      statusElection = 'segundo_turno';
      statusMessage = 'Disputa presidencial em segundo turno oficial.';
    } else {
      // Caso especial documentado: Rio de Janeiro (retotalização oficial pós-1º turno)
      if (cleanScope === 'rj') {
        statusElection = 'definida_1t';
        statusMessage =
          'Eleição definida no 1º turno após decisão do TSE de retotalização dos votos, homologada pelo TRE-RJ em 15/10/2026 com proclamação de vitória de Douglas Ruas (PL).';
      } else {
        // Para governadores, checar se 1º turno definiu a eleição
        const candidateElected1T = firstSummary?.candidates.find(
          (c) => c.isElected || c.status.toLowerCase().includes('eleito')
        );

        if (candidateElected1T) {
          statusElection = 'definida_1t';
          statusMessage = `Eleição definida no 1º turno com a eleição de ${candidateElected1T.ballotName} (${candidateElected1T.party}).`;
        } else if (secondSummary) {
          statusElection = 'segundo_turno';
          statusMessage = 'Disputa estadual para Governador em segundo turno oficial.';
        } else if (secondError) {
          // Se 2T deu erro mas não há candidato com isElected no 1T
          if (firstSummary && firstSummary.isFinal) {
            statusElection = 'nao_confirmada';
            statusMessage = 'Resultado do 1º turno totalizado, aguardando publicação oficial do 2º turno pelo TSE.';
          } else {
            statusElection = 'indisponivel';
            statusMessage = 'Dados oficiais não encontrados ou temporariamente indisponíveis no servidor do TSE.';
          }
        }
      }
    }

    // Se ambos falharem, lançar erro informando a indisponibilidade
    if (!firstSummary && !secondSummary) {
      throw new Error(
        `Não foi possível carregar os dados de comparação para ${role} (${cleanScope.toUpperCase()}): ${
          secondError?.message || firstError?.message || 'Serviço do TSE indisponível.'
        }`
      );
    }

    // Obter o nome do escopo
    const stateMeta = BRAZIL_STATES.find((s) => s.uf.toLowerCase() === cleanScope);
    const scopeName = cleanScope === 'br' ? 'Brasil (Nacional)' : stateMeta ? `${stateMeta.name} (${stateMeta.uf})` : cleanScope.toUpperCase();

    // Mesclar candidatos dos dois turnos
    const candidatesMap = new Map<string, CandidateComparisonItem>();

    // 1º Turno
    if (firstSummary) {
      for (const c of firstSummary.candidates) {
        candidatesMap.set(c.number, {
          number: c.number,
          name: c.name,
          ballotName: c.ballotName,
          party: c.party,
          partyNumber: c.partyNumber,
          votes1T: c.votes,
          percentage1T: c.percentage,
          votes2T: null,
          percentage2T: null,
          voteDiff: null,
          percentageDiff: null,
          isElected1T: c.isElected,
          isElected2T: false,
          status1T: c.status,
          status2T: undefined,
        });
      }
    }

    // 2º Turno
    if (secondSummary) {
      for (const c of secondSummary.candidates) {
        const existing = candidatesMap.get(c.number);
        if (existing) {
          existing.votes2T = c.votes;
          existing.percentage2T = c.percentage;
          existing.voteDiff = existing.votes1T !== null ? c.votes - existing.votes1T : null;
          existing.percentageDiff = existing.percentage1T !== null ? c.percentage - existing.percentage1T : null;
          existing.isElected2T = c.isElected;
          existing.status2T = c.status;
        } else {
          candidatesMap.set(c.number, {
            number: c.number,
            name: c.name,
            ballotName: c.ballotName,
            party: c.party,
            partyNumber: c.partyNumber,
            votes1T: null,
            percentage1T: null,
            votes2T: c.votes,
            percentage2T: c.percentage,
            voteDiff: null,
            percentageDiff: null,
            isElected1T: false,
            isElected2T: c.isElected,
            status2T: c.status,
          });
        }
      }
    }

    // Ordenar candidatos: prioritariamente presentes no 2T por votos, depois do 1T por votos
    const sortedCandidates = Array.from(candidatesMap.values()).sort((a, b) => {
      if (a.votes2T !== null && b.votes2T !== null) {
        return b.votes2T - a.votes2T;
      }
      if (a.votes2T !== null) return -1;
      if (b.votes2T !== null) return 1;
      return (b.votes1T || 0) - (a.votes1T || 0);
    });

    // Comparação de eleitorado e comparecimento
    const v1 = firstSummary?.voters;
    const v2 = secondSummary?.voters;
    const vt1 = firstSummary?.votes;
    const vt2 = secondSummary?.votes;

    const votersComparison = {
      totalElectorate1T: v1 ? v1.totalElectorate : null,
      totalElectorate2T: v2 ? v2.totalElectorate : null,
      turnout1T: v1 ? v1.turnout : null,
      turnout2T: v2 ? v2.turnout : null,
      turnoutDiff: v1 && v2 ? v2.turnout - v1.turnout : null,
      percentTurnout1T: v1 ? v1.percentTurnout : null,
      percentTurnout2T: v2 ? v2.percentTurnout : null,
      abstention1T: v1 ? v1.abstention : null,
      abstention2T: v2 ? v2.abstention : null,
      abstentionDiff: v1 && v2 ? v2.abstention - v1.abstention : null,
      percentAbstention1T: v1 ? v1.percentAbstention : null,
      percentAbstention2T: v2 ? v2.percentAbstention : null,
      validVotes1T: vt1 ? vt1.validVotes : null,
      validVotes2T: vt2 ? vt2.validVotes : null,
      blankVotes1T: vt1 ? vt1.blankVotes : null,
      blankVotes2T: vt2 ? vt2.blankVotes : null,
      nullVotes1T: vt1 ? vt1.nullVotes : null,
      nullVotes2T: vt2 ? vt2.nullVotes : null,
    };

    return {
      roleCode,
      roleDescription,
      scope: cleanScope,
      scopeName,
      statusElection,
      statusMessage,
      firstRound: firstSummary,
      secondRound: secondSummary,
      candidates: sortedCandidates,
      votersComparison,
    };
  }

  public async fetchGovernorOverviewAll(): Promise<GovernorStateOverview[]> {
    // Processa os 27 estados em paralelo com limitação de concorrência ou em lotes controlados
    const batchSize = 6;
    const results: GovernorStateOverview[] = [];

    for (let i = 0; i < BRAZIL_STATES.length; i += batchSize) {
      const batch = BRAZIL_STATES.slice(i, i + batchSize);
      const batchPromises = batch.map(async (state) => {
        const uf = state.uf.toLowerCase();
        try {
          // Tenta primeiro o 2º turno
          let secondRound: ElectionSummary | null = null;
          try {
            secondRound = await this.fetchGovernorResults(uf, ELECTION_CODES.GOVERNOR_2T);
          } catch {
            secondRound = null;
          }

          if (secondRound) {
            const leader = secondRound.candidates[0] || null;
            const runnerUp = secondRound.candidates[1] || null;
            return {
              uf: state.uf,
              name: state.name,
              region: state.region,
              status: 'segundo_turno' as GovernorElectionStatus,
              statusLabel: '2º Turno em Disputa',
              isFinal: secondRound.isFinal,
              percentTotalized: secondRound.progress.percentTotalized,
              totalSections: secondRound.progress.totalSections,
              totalizedSections: secondRound.progress.totalizedSections,
              leaderOrElected: leader
                ? {
                    name: leader.name,
                    ballotName: leader.ballotName,
                    party: leader.party,
                    number: leader.number,
                    percentage: leader.percentage,
                    votes: leader.votes,
                    isElected: leader.isElected,
                    status: leader.status,
                  }
                : null,
              runnerUp: runnerUp
                ? {
                    name: runnerUp.name,
                    ballotName: runnerUp.ballotName,
                    party: runnerUp.party,
                    number: runnerUp.number,
                    percentage: runnerUp.percentage,
                    votes: runnerUp.votes,
                  }
                : null,
              roundInDisplay: 2 as const,
              updatedAt: `${secondRound.totalizedDate} ${secondRound.totalizedTime}`,
            };
          }

          // Se não há 2º turno, verifica o 1º turno
          let firstRound: ElectionSummary | null = null;
          try {
            firstRound = await this.fetchGovernorResults(uf, ELECTION_CODES.GOVERNOR_1T);
          } catch {
            firstRound = null;
          }

          if (firstRound) {
            const elected = firstRound.candidates.find(
              (c) => c.isElected || c.status.toLowerCase().includes('eleito')
            );
            const leader = elected || firstRound.candidates[0] || null;
            const runnerUp = firstRound.candidates[1] || null;
            const isDefinida = !!elected || uf === 'rj';
            const statusLabel =
              uf === 'rj'
                ? 'Eleito no 1ºT (Retotalização)'
                : isDefinida
                ? 'Eleito no 1º Turno'
                : 'Aguardando 2º Turno';

            return {
              uf: state.uf,
              name: state.name,
              region: state.region,
              status: (isDefinida ? 'definida_1t' : 'nao_confirmada') as GovernorElectionStatus,
              statusLabel,
              isFinal: firstRound.isFinal,
              percentTotalized: firstRound.progress.percentTotalized,
              totalSections: firstRound.progress.totalSections,
              totalizedSections: firstRound.progress.totalizedSections,
              leaderOrElected: leader
                ? {
                    name: leader.name,
                    ballotName: leader.ballotName,
                    party: leader.party,
                    number: leader.number,
                    percentage: leader.percentage,
                    votes: leader.votes,
                    isElected: leader.isElected,
                    status: leader.status,
                  }
                : null,
              runnerUp: runnerUp
                ? {
                    name: runnerUp.name,
                    ballotName: runnerUp.ballotName,
                    party: runnerUp.party,
                    number: runnerUp.number,
                    percentage: runnerUp.percentage,
                    votes: runnerUp.votes,
                  }
                : null,
              roundInDisplay: 1 as const,
              updatedAt: `${firstRound.totalizedDate} ${firstRound.totalizedTime}`,
            };
          }

          // Se nem 1T nem 2T estiverem disponíveis
          return {
            uf: state.uf,
            name: state.name,
            region: state.region,
            status: 'indisponivel' as GovernorElectionStatus,
            statusLabel: 'Dados Indisponíveis',
            isFinal: false,
            percentTotalized: 0,
            totalSections: 0,
            totalizedSections: 0,
            leaderOrElected: null,
            runnerUp: null,
            roundInDisplay: 1 as const,
            updatedAt: 'N/D',
          };
        } catch {
          return {
            uf: state.uf,
            name: state.name,
            region: state.region,
            status: 'indisponivel' as GovernorElectionStatus,
            statusLabel: 'Erro de Conexão',
            isFinal: false,
            percentTotalized: 0,
            totalSections: 0,
            totalizedSections: 0,
            leaderOrElected: null,
            runnerUp: null,
            roundInDisplay: 1 as const,
            updatedAt: 'N/D',
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  private async fetchAndNormalize(url: string): Promise<ElectionSummary> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'PainelEleitoralBrasil/1.0 (+https://eleicoes.joaovitordantas.com.br)',
        },
        next: { revalidate: 15 },
      });

      if (!response.ok) {
        throw new Error(
          `Falha ao obter dados do TSE: HTTP ${response.status} (${response.statusText}) em ${url}`
        );
      }

      const rawJson = await response.json();
      const parsed = tseEA20Schema.parse(rawJson);
      return normalizeTseEA20(parsed, url);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Timeout ao conectar com a fonte oficial do TSE em ${url}`);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const defaultTseClient = new TseClient();
