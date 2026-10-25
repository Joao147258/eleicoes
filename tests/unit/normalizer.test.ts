import { describe, it, expect } from 'vitest';
import { normalizeTseEA20 } from '@/modules/elections/infrastructure/tse/normalizer';
import { tseEA20Schema } from '@/modules/elections/infrastructure/tse/schemas';
import sampleEA20 from '../fixtures/sample-ea20.json';

describe('Normalizador EA20 do TSE', () => {
  it('deve validar o schema Zod e normalizar os dados eleitorais com precisão', () => {
    const raw = tseEA20Schema.parse(sampleEA20);
    const summary = normalizeTseEA20(raw, 'https://test.tse.jus.br');

    expect(summary.electionCode).toBe('6258');
    expect(summary.round).toBe(2);
    expect(summary.scope).toBe('br');
    expect(summary.roleDescription).toBe('Presidente');

    // Progresso das seções
    expect(summary.progress.totalSections).toBe(499248);
    expect(summary.progress.totalizedSections).toBe(131326);
    expect(summary.progress.percentTotalized).toBe(26.3);
    expect(summary.progress.status).toBe('partial');

    // Candidatos
    expect(summary.candidates).toHaveLength(2);

    const first = summary.candidates[0];
    const second = summary.candidates[1];

    expect(first.ballotName).toBe('FLAVIO BOLSONARO');
    expect(first.party).toBe('PL');
    expect(first.votes).toBe(16385358);
    expect(first.percentage).toBe(50.46);

    expect(second.ballotName).toBe('LULA');
    expect(second.party).toBe('PT');
    expect(second.votes).toBe(16087378);
    expect(second.percentage).toBe(49.54);

    // Estatísticas de votos (validando cálculo correto de percentual de nulos)
    expect(summary.votes.totalVotes).toBe(33475854);
    expect(summary.votes.validVotes).toBe(32472736);
    expect(summary.votes.blankVotes).toBe(346293);
    expect(summary.votes.percentBlank).toBe(1.03);
    expect(summary.votes.nullVotes).toBe(656825);
    expect(summary.votes.percentNull).toBe(1.96); // ptvn oficial do TSE, não pvn (100%)

    // Liderança e cálculo de margem
    expect(summary.leader).not.toBeNull();
    expect(summary.leader?.candidate.number).toBe('22');
    expect(summary.leader?.voteMargin).toBe(16385358 - 16087378);
    expect(summary.leader?.percentageMargin).toBeCloseTo(0.92, 2);
    expect(summary.leader?.isTie).toBe(false);
  });

  it('deve identificar empate corretamente quando a votação for idêntica', () => {
    const sampleCopy = JSON.parse(JSON.stringify(sampleEA20));
    sampleCopy.carg[0].agr[0].par[0].cand[0].vap = '1000';
    sampleCopy.carg[0].agr[0].par[0].cand[0].pvap = '50,00';
    sampleCopy.carg[0].agr[1].par[0].cand[0].vap = '1000';
    sampleCopy.carg[0].agr[1].par[0].cand[0].pvap = '50,00';

    const raw = tseEA20Schema.parse(sampleCopy);
    const summary = normalizeTseEA20(raw);

    expect(summary.leader?.isTie).toBe(true);
    expect(summary.leader?.voteMargin).toBe(0);
  });

  it('deve classificar status como final quando tf for "s"', () => {
    const sampleCopy = JSON.parse(JSON.stringify(sampleEA20));
    sampleCopy.tf = 's';
    sampleCopy.and = 'f';

    const raw = tseEA20Schema.parse(sampleCopy);
    const summary = normalizeTseEA20(raw);

    expect(summary.isFinal).toBe(true);
    expect(summary.progress.status).toBe('final');
  });
});
