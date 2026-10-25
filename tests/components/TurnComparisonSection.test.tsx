import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TurnComparisonSection } from '@/components/comparison/TurnComparisonSection';
import { RoundComparison } from '@/modules/elections/domain/models';

const mockComparison: RoundComparison = {
  roleCode: '1',
  roleDescription: 'Presidente da República',
  scope: 'br',
  scopeName: 'Brasil (Nacional)',
  statusElection: 'segundo_turno',
  statusMessage: 'Disputa presidencial em segundo turno oficial.',
  firstRound: {
    electionCode: '6257',
    round: 1,
    scope: 'br',
    scopeType: 'Nacional',
    roleCode: '1',
    roleDescription: 'Presidente',
    generatedDate: '04/10/2026',
    generatedTime: '20:00:00',
    totalizedDate: '04/10/2026',
    totalizedTime: '20:00:00',
    isFinal: true,
    progress: {
      totalSections: 499248,
      totalizedSections: 499248,
      percentTotalized: 100.0,
      countedSections: 499248,
      percentCounted: 100.0,
      status: 'final',
    },
    voters: {
      totalElectorate: 156454011,
      turnout: 123682972,
      percentTurnout: 79.05,
      abstention: 32771039,
      percentAbstention: 20.95,
    },
    votes: {
      totalVotes: 123682972,
      validVotes: 118552348,
      percentValid: 95.85,
      blankVotes: 1964779,
      percentBlank: 1.59,
      nullVotes: 3165845,
      percentNull: 2.56,
    },
    candidates: [],
    leader: null,
    sourceProvenance: {
      origin: 'https://test.tse.jus.br',
      fileId: 'mock-1t',
      fetchedAt: '2026-10-04T20:00:00Z',
    },
  },
  secondRound: {
    electionCode: '6258',
    round: 2,
    scope: 'br',
    scopeType: 'Nacional',
    roleCode: '1',
    roleDescription: 'Presidente',
    generatedDate: '26/10/2026',
    generatedTime: '18:30:00',
    totalizedDate: '26/10/2026',
    totalizedTime: '18:30:00',
    isFinal: false,
    progress: {
      totalSections: 499248,
      totalizedSections: 440000,
      percentTotalized: 88.13,
      countedSections: 440000,
      percentCounted: 88.13,
      status: 'partial',
    },
    voters: {
      totalElectorate: 156454011,
      turnout: 124000000,
      percentTurnout: 79.25,
      abstention: 32454011,
      percentAbstention: 20.75,
    },
    votes: {
      totalVotes: 124000000,
      validVotes: 119000000,
      percentValid: 95.96,
      blankVotes: 1800000,
      percentBlank: 1.45,
      nullVotes: 3200000,
      percentNull: 2.58,
    },
    candidates: [],
    leader: null,
    sourceProvenance: {
      origin: 'https://test.tse.jus.br',
      fileId: 'mock-2t',
      fetchedAt: '2026-10-26T18:30:00Z',
    },
  },
  candidates: [
    {
      number: '22',
      name: 'FLAVIO BOLSONARO',
      ballotName: 'FLAVIO BOLSONARO',
      party: 'PL',
      partyNumber: '22',
      votes1T: 51000000,
      percentage1T: 43.02,
      votes2T: 60500000,
      percentage2T: 50.84,
      voteDiff: 9500000,
      percentageDiff: 7.82,
      isElected1T: false,
      isElected2T: false,
      status2T: '2º Turno',
    },
    {
      number: '13',
      name: 'LULA',
      ballotName: 'LULA',
      party: 'PT',
      partyNumber: '13',
      votes1T: 57259504,
      percentage1T: 48.3,
      votes2T: 58500000,
      percentage2T: 49.16,
      voteDiff: 1240496,
      percentageDiff: 0.86,
      isElected1T: false,
      isElected2T: false,
      status2T: '2º Turno',
    },
  ],
  votersComparison: {
    totalElectorate1T: 156454011,
    totalElectorate2T: 156454011,
    turnout1T: 123682972,
    turnout2T: 124000000,
    turnoutDiff: 317028,
    percentTurnout1T: 79.05,
    percentTurnout2T: 79.25,
    abstention1T: 32771039,
    abstention2T: 32454011,
    abstentionDiff: -317028,
    percentAbstention1T: 20.95,
    percentAbstention2T: 20.75,
    validVotes1T: 118552348,
    validVotes2T: 119000000,
    blankVotes1T: 1964779,
    blankVotes2T: 1800000,
    nullVotes1T: 3165845,
    nullVotes2T: 3200000,
  },
};

describe('TurnComparisonSection Component', () => {
  it('deve renderizar a tabela comparativa com candidatos, votos nos dois turnos e variações', () => {
    render(<TurnComparisonSection comparison={mockComparison} />);

    expect(screen.getByText('FLAVIO BOLSONARO')).toBeInTheDocument();
    expect(screen.getByText('LULA')).toBeInTheDocument();

    // Votos 1T e 2T
    expect(screen.getByText('43,02%')).toBeInTheDocument();
    expect(screen.getByText('50,84%')).toBeInTheDocument();

    // Variações em pontos percentuais
    expect(screen.getByText('+7.82 pp')).toBeInTheDocument();
    expect(screen.getByText('+0.86 pp')).toBeInTheDocument();

    // Variação absoluta de votos
    expect(screen.getByText('+9.500.000')).toBeInTheDocument();

    // Badge oficial de status
    expect(screen.getByText(/Disputa Oficial de 2º Turno/)).toBeInTheDocument();
  });
});
