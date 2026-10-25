import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import StatesTable from '@/components/tables/StatesTable';
import { StateSummaryOverview } from '@/modules/elections/domain/models';

const mockStates: StateSummaryOverview[] = [
  {
    uf: 'SP',
    name: 'São Paulo',
    region: 'Sudeste',
    percentTotalized: 85.5,
    isFinal: false,
    leaderNumber: '22',
    leaderName: 'FLAVIO BOLSONARO',
    leaderPercentage: 55.2,
    leaderVotes: 12000000,
    runnerUpName: 'LULA',
    runnerUpPercentage: 44.8,
    runnerUpVotes: 9800000,
    voteMargin: 2200000,
    percentageMargin: 10.4,
    validVotes: 21800000,
    totalSections: 100000,
    totalizedSections: 85500,
    updatedAt: '25/10/2026 20:00:00',
  },
  {
    uf: 'BA',
    name: 'Bahia',
    region: 'Nordeste',
    percentTotalized: 92.0,
    isFinal: false,
    leaderNumber: '13',
    leaderName: 'LULA',
    leaderPercentage: 68.0,
    leaderVotes: 6000000,
    runnerUpName: 'FLAVIO BOLSONARO',
    runnerUpPercentage: 32.0,
    runnerUpVotes: 2800000,
    voteMargin: 3200000,
    percentageMargin: 36.0,
    validVotes: 8800000,
    totalSections: 35000,
    totalizedSections: 32200,
    updatedAt: '25/10/2026 20:00:00',
  },
];

describe('StatesTable Component', () => {
  it('deve listar os estados e permitir filtrar por busca de texto', () => {
    render(<StatesTable states={mockStates} />);

    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('Bahia')).toBeInTheDocument();

    // Filtra por São Paulo
    const searchInput = screen.getByPlaceholderText('Buscar estado...');
    fireEvent.change(searchInput, { target: { value: 'Paulo' } });

    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.queryByText('Bahia')).not.toBeInTheDocument();
  });
});
