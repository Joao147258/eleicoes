import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import StatesAnalyticalPanorama from '@/components/dashboard/StatesAnalyticalPanorama';
import { StateSummaryOverview } from '@/modules/elections/domain/models';

const mockStates: StateSummaryOverview[] = [
  {
    uf: 'SP',
    name: 'São Paulo',
    region: 'Sudeste',
    percentTotalized: 90.0,
    isFinal: false,
    leaderNumber: '22',
    leaderName: 'FLAVIO BOLSONARO',
    leaderPercentage: 55.0,
    leaderVotes: 10000000,
    runnerUpName: 'LULA',
    runnerUpPercentage: 45.0,
    runnerUpVotes: 8000000,
    voteMargin: 2000000,
    percentageMargin: 10.0,
    validVotes: 18000000,
    totalSections: 100000,
    totalizedSections: 90000,
    updatedAt: '25/10/2026 20:00:00',
  },
  {
    uf: 'BA',
    name: 'Bahia',
    region: 'Nordeste',
    percentTotalized: 85.0,
    isFinal: false,
    leaderNumber: '13',
    leaderName: 'LULA',
    leaderPercentage: 68.0,
    leaderVotes: 5000000,
    runnerUpName: 'FLAVIO BOLSONARO',
    runnerUpPercentage: 32.0,
    runnerUpVotes: 2500000,
    voteMargin: 2500000,
    percentageMargin: 36.0,
    validVotes: 7500000,
    totalSections: 35000,
    totalizedSections: 29750,
    updatedAt: '25/10/2026 20:00:00',
  },
  {
    uf: 'MG',
    name: 'Minas Gerais',
    region: 'Sudeste',
    percentTotalized: 88.0,
    isFinal: false,
    leaderNumber: '22',
    leaderName: 'FLAVIO BOLSONARO',
    leaderPercentage: 50.4,
    leaderVotes: 5200000,
    runnerUpName: 'LULA',
    runnerUpPercentage: 49.6,
    runnerUpVotes: 5100000,
    voteMargin: 100000,
    percentageMargin: 0.8, // Disputa mais acirrada
    validVotes: 10300000,
    totalSections: 40000,
    totalizedSections: 35200,
    updatedAt: '25/10/2026 20:00:00',
  },
];

describe('StatesAnalyticalPanorama Component', () => {
  it('deve calcular a quantidade correta de estados liderados por cada candidato', () => {
    render(
      <StatesAnalyticalPanorama
        states={mockStates}
        onSelectState={vi.fn()}
        selectedUf={null}
      />
    );

    // 2 estados liderados por PL (SP e MG) e 1 por PT (BA)
    expect(screen.getByText('2 estados')).toBeInTheDocument();
    expect(screen.getByText('1 estado')).toBeInTheDocument();

    // Nota explicativa
    expect(
      screen.getByText(/A quantidade de UFs lideradas é um indicador analítico/i)
    ).toBeInTheDocument();

    // Disputa mais acirrada (Minas Gerais com 0.80 pp)
    expect(screen.getByText('±0.80 pp')).toBeInTheDocument();
  });
});
