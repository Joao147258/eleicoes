import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import BrazilInteractiveMap from '@/components/maps/BrazilInteractiveMap';
import { StateSummaryOverview } from '@/modules/elections/domain/models';

const mockStatesData: StateSummaryOverview[] = [
  {
    uf: 'PR',
    name: 'Paraná',
    region: 'Sul',
    percentTotalized: 88.5,
    isFinal: false,
    leaderNumber: '22',
    leaderName: 'FLAVIO BOLSONARO',
    leaderPercentage: 58.2,
    leaderVotes: 3200000,
    runnerUpName: 'LULA',
    runnerUpPercentage: 41.8,
    runnerUpVotes: 2300000,
    voteMargin: 900000,
    percentageMargin: 16.4,
    validVotes: 5500000,
    totalSections: 25000,
    totalizedSections: 22125,
    updatedAt: '25/10/2026 20:15:00',
  },
  {
    uf: 'SP',
    name: 'São Paulo',
    region: 'Sudeste',
    percentTotalized: 91.2,
    isFinal: false,
    leaderNumber: '22',
    leaderName: 'FLAVIO BOLSONARO',
    leaderPercentage: 54.1,
    leaderVotes: 12500000,
    runnerUpName: 'LULA',
    runnerUpPercentage: 45.9,
    runnerUpVotes: 10600000,
    voteMargin: 1900000,
    percentageMargin: 8.2,
    validVotes: 23100000,
    totalSections: 100000,
    totalizedSections: 91200,
    updatedAt: '25/10/2026 20:15:00',
  },
];

describe('BrazilInteractiveMap Component', () => {
  it('deve exibir o resumo geral das 27 UFs quando nenhum estado estiver selecionado', () => {
    render(
      <BrazilInteractiveMap
        statesData={mockStatesData}
        selectedUf={null}
        onSelectState={vi.fn()}
        onClearSelection={vi.fn()}
      />
    );

    expect(screen.getByText('Resumo das 27 Unidades Federativas')).toBeInTheDocument();
    expect(screen.getByText('Total de UFs Monitoradas')).toBeInTheDocument();
  });

  it('deve exibir detalhes persistentes de PR quando selectedUf="pr"', () => {
    const handleClear = vi.fn();

    render(
      <BrazilInteractiveMap
        statesData={mockStatesData}
        selectedUf="pr"
        onSelectState={vi.fn()}
        onClearSelection={handleClear}
      />
    );

    // Painel lateral mostra Paraná
    expect(screen.getAllByText('Paraná').length).toBeGreaterThan(0);
    expect(screen.getByText('58,20%')).toBeInTheDocument();
    expect(screen.getByText('3.200.000 votos computados')).toBeInTheDocument();

    // Botão de limpar seleção está presente
    const clearButtons = screen.getAllByText('Limpar seleção');
    expect(clearButtons.length).toBeGreaterThan(0);
    fireEvent.click(clearButtons[0]);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('deve manter PR selecionado no painel lateral mesmo quando o mouse faz hover sobre SP', () => {
    render(
      <BrazilInteractiveMap
        statesData={mockStatesData}
        selectedUf="pr"
        onSelectState={vi.fn()}
        onClearSelection={vi.fn()}
      />
    );

    // Encontra o elemento do mapa correspondente a SP e dispara mouseEnter
    const spElement = screen.getByLabelText(/Estado São Paulo, sigla SP/i);
    fireEvent.mouseEnter(spElement);

    // O painel lateral continua exibindo Paraná (PR) como estado persistente
    expect(screen.getByText('Paraná')).toBeInTheDocument();
    expect(screen.getByText('58,20%')).toBeInTheDocument();

    // Dispara mouseLeave e confirma persistência
    fireEvent.mouseLeave(spElement);
    expect(screen.getByText('Paraná')).toBeInTheDocument();
  });

  it('deve chamar onSelectState com a UF quando um estado for clicado', () => {
    const handleSelect = vi.fn();

    render(
      <BrazilInteractiveMap
        statesData={mockStatesData}
        selectedUf="pr"
        onSelectState={handleSelect}
        onClearSelection={vi.fn()}
      />
    );

    const spElement = screen.getByLabelText(/Estado São Paulo, sigla SP/i);
    fireEvent.click(spElement);

    expect(handleSelect).toHaveBeenCalledWith('sp');
  });
});
