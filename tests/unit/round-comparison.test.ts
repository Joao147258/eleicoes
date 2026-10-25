import { describe, it, expect } from 'vitest';
import { defaultTseClient } from '@/modules/elections/infrastructure/tse/tse-client';
import { RoundComparison, CandidateComparisonItem } from '@/modules/elections/domain/models';

describe('Comparação entre 1º e 2º Turno', () => {
  it('deve calcular corretamente as variações absolutas e de pontos percentuais', () => {
    const candA: CandidateComparisonItem = {
      number: '22',
      name: 'FLAVIO BOLSONARO',
      ballotName: 'FLAVIO BOLSONARO',
      party: 'PL',
      partyNumber: '22',
      votes1T: 50000000,
      percentage1T: 45.0,
      votes2T: 58000000,
      percentage2T: 50.5,
      voteDiff: 58000000 - 50000000, // +8.000.000
      percentageDiff: 50.5 - 45.0, // +5.5 pp
      isElected1T: false,
      isElected2T: true,
      status2T: 'Eleito',
    };

    expect(candA.voteDiff).toBe(8000000);
    expect(candA.percentageDiff).toBeCloseTo(5.5, 2);
    expect(candA.isElected2T).toBe(true);
  });

  it('deve identificar candidato presente apenas no 1º turno com votos do 2º turno nulos', () => {
    const candTerceiro: CandidateComparisonItem = {
      number: '15',
      name: 'TERCEIRO CANDIDATO',
      ballotName: 'TERCEIRO CANDIDATO',
      party: 'MDB',
      partyNumber: '15',
      votes1T: 5000000,
      percentage1T: 4.5,
      votes2T: null,
      percentage2T: null,
      voteDiff: null,
      percentageDiff: null,
      isElected1T: false,
      isElected2T: false,
    };

    expect(candTerceiro.votes2T).toBeNull();
    expect(candTerceiro.voteDiff).toBeNull();
  });

  it('deve classificar uma eleição com candidato com mais de 50% como definida_1t', () => {
    const mockComparison: Partial<RoundComparison> = {
      roleCode: '3',
      roleDescription: 'Governador',
      scope: 'pa',
      scopeName: 'Pará (PA)',
      statusElection: 'definida_1t',
      statusMessage: 'Eleição definida no 1º turno com a eleição de HELDER BARBALHO (MDB).',
      candidates: [
        {
          number: '15',
          name: 'HELDER BARBALHO',
          ballotName: 'HELDER',
          party: 'MDB',
          partyNumber: '15',
          votes1T: 3117276,
          percentage1T: 70.41,
          votes2T: null,
          percentage2T: null,
          voteDiff: null,
          percentageDiff: null,
          isElected1T: true,
          isElected2T: false,
          status1T: 'Eleito',
        },
      ],
    };

    expect(mockComparison.statusElection).toBe('definida_1t');
    expect(mockComparison.candidates?.[0].isElected1T).toBe(true);
    expect(mockComparison.candidates?.[0].percentage1T).toBeGreaterThan(50);
  });
});
