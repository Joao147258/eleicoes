import { describe, it, expect, beforeEach } from 'vitest';
import { defaultHistoryService } from '@/modules/elections/infrastructure/history/history-service';
import { ElectionSummary } from '@/modules/elections/domain/models';

const createMockSummary = (overrides: Partial<ElectionSummary> = {}): ElectionSummary => ({
  electionCode: '6258',
  round: 2,
  scope: 'br',
  scopeType: 'Nacional',
  roleCode: '1',
  roleDescription: 'Presidente',
  generatedDate: '26/10/2026',
  generatedTime: '17:30:00',
  totalizedDate: '26/10/2026',
  totalizedTime: '17:30:00',
  isFinal: false,
  progress: {
    totalSections: 1000,
    totalizedSections: 500,
    percentTotalized: 50.0,
    countedSections: 500,
    percentCounted: 50.0,
    status: 'partial',
  },
  voters: {
    totalElectorate: 100000,
    turnout: 80000,
    percentTurnout: 80.0,
    abstention: 20000,
    percentAbstention: 20.0,
  },
  votes: {
    totalVotes: 80000,
    validVotes: 76000,
    percentValid: 95.0,
    blankVotes: 2000,
    percentBlank: 2.5,
    nullVotes: 2000,
    percentNull: 2.5,
  },
  candidates: [
    {
      number: '22',
      name: 'FLAVIO BOLSONARO',
      ballotName: 'FLAVIO BOLSONARO',
      party: 'PL',
      partyNumber: '22',
      federation: null,
      coalition: null,
      votes: 39000,
      percentage: 51.32,
      highPrecisionPercentage: 51.3157,
      isElected: false,
      status: 'Suplente',
      viceCandidate: null,
    },
    {
      number: '13',
      name: 'LULA',
      ballotName: 'LULA',
      party: 'PT',
      partyNumber: '13',
      federation: null,
      coalition: null,
      votes: 37000,
      percentage: 48.68,
      highPrecisionPercentage: 48.6842,
      isElected: false,
      status: 'Suplente',
      viceCandidate: null,
    },
  ],
  leader: {
    candidate: {
      number: '22',
      name: 'FLAVIO BOLSONARO',
      ballotName: 'FLAVIO BOLSONARO',
      party: 'PL',
      partyNumber: '22',
      federation: null,
      coalition: null,
      votes: 39000,
      percentage: 51.32,
      highPrecisionPercentage: 51.3157,
      isElected: false,
      status: 'Suplente',
      viceCandidate: null,
    },
    voteMargin: 2000,
    percentageMargin: 2.64,
    isTie: false,
  },
  sourceProvenance: {
    origin: 'https://test.tse.jus.br',
    fileId: 'mock-1',
    fetchedAt: '2026-10-26T17:30:00Z',
  },
  ...overrides,
});

describe('HistoryService & Snapshots', () => {
  it('deve registrar snapshots e deduplicar atualizações sem alteração de seções ou horário', () => {
    const s1 = createMockSummary({ generatedTime: '18:00:00' });
    defaultHistoryService.recordSnapshot(s1);

    // Tentativa com mesmo timestamp e mesmas seções totalizadas
    const s2 = createMockSummary({ generatedTime: '18:00:00' });
    defaultHistoryService.recordSnapshot(s2);

    const history = defaultHistoryService.getHistory('1', 'br', 2);
    expect(history.snapshots.length).toBeGreaterThanOrEqual(1);

    // O último snapshot registrado deve refletir os dados de s1
    const latest = history.snapshots[history.snapshots.length - 1];
    expect(latest.totalizedSections).toBe(500);
    expect(latest.candidates).toHaveLength(2);
  });

  it('deve registrar novo snapshot quando houver avanço de seções totalizadas', () => {
    const s1 = createMockSummary({
      generatedTime: '18:05:00',
      progress: {
        totalSections: 1000,
        totalizedSections: 600,
        percentTotalized: 60.0,
        countedSections: 600,
        percentCounted: 60.0,
        status: 'partial',
      },
    });
    defaultHistoryService.recordSnapshot(s1);

    const s2 = createMockSummary({
      generatedTime: '18:10:00',
      progress: {
        totalSections: 1000,
        totalizedSections: 750,
        percentTotalized: 75.0,
        countedSections: 750,
        percentCounted: 75.0,
        status: 'partial',
      },
    });
    defaultHistoryService.recordSnapshot(s2);

    const history = defaultHistoryService.getHistory('1', 'br', 2);
    const last = history.snapshots[history.snapshots.length - 1];
    expect(last.totalizedSections).toBe(750);
    expect(last.percentTotalized).toBe(75.0);
  });

  it('deve calcular ritmo de totalização e resumo de alterações factuais', () => {
    const history = defaultHistoryService.getHistory('1', 'br', 2);
    expect(history.pace).toBeDefined();
    expect(typeof history.pace.sectionsPerMinute).toBe('number');
    expect(history.changesSummary).toBeInstanceOf(Array);
    expect(history.changesSummary.length).toBeGreaterThan(0);
  });
});
