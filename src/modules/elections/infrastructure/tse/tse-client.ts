import { ElectionSummary } from '../../domain/models';
import { normalizeTseEA20 } from './normalizer';
import { tseEA20Schema } from './schemas';

const DEFAULT_CDN_BASE_URL = 'https://resultados.tse.jus.br/oficial';
const DEFAULT_PRESIDENT_ELECTION_CODE = '6258';
const DEFAULT_GOVERNOR_ELECTION_CODE = '6260';

export interface FetchElectionOptions {
  scope?: string; // 'br' ou UF ('sp', 'rj', 'mg', etc.)
  electionCode?: string;
  roleCode?: '0001' | '0003' | '1' | '3';
}

export class TseClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.TSE_CDN_BASE_URL || DEFAULT_CDN_BASE_URL;
  }

  public getPresidentResultUrl(scope: string = 'br', electionCode: string = DEFAULT_PRESIDENT_ELECTION_CODE): string {
    const s = scope.toLowerCase();
    const cycle = 'ele2026';
    return `${this.baseUrl}/${cycle}/${electionCode}/dados/${s}/${s}-c0001-e00${electionCode}-u.json`;
  }

  public getGovernorResultUrl(uf: string, electionCode: string = DEFAULT_GOVERNOR_ELECTION_CODE): string {
    const s = uf.toLowerCase();
    const cycle = 'ele2026';
    return `${this.baseUrl}/${cycle}/${electionCode}/dados/${s}/${s}-c0003-e00${electionCode}-u.json`;
  }

  public async fetchPresidentResults(
    scope: string = 'br',
    electionCode: string = DEFAULT_PRESIDENT_ELECTION_CODE
  ): Promise<ElectionSummary> {
    const url = this.getPresidentResultUrl(scope, electionCode);
    return this.fetchAndNormalize(url);
  }

  public async fetchGovernorResults(
    uf: string,
    electionCode: string = DEFAULT_GOVERNOR_ELECTION_CODE
  ): Promise<ElectionSummary> {
    const url = this.getGovernorResultUrl(uf, electionCode);
    return this.fetchAndNormalize(url);
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
