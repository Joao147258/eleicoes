import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HistoricalTimeline } from '@/components/timeline/HistoricalTimeline';
import { TIMELINE_EVENTS_2026 } from '@/data/elections/2026/timeline-events';

describe('HistoricalTimeline Component', () => {
  it('deve renderizar o título, filtros e marcos da linha do tempo', () => {
    render(<HistoricalTimeline events={TIMELINE_EVENTS_2026} />);

    expect(screen.getByText('Eleições 2026 — Linha do Tempo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Buscar por data, decisão, fonte ou termo.../)).toBeInTheDocument();

    // Deve exibir o evento do primeiro turno
    expect(
      screen.getByText('Realização do Primeiro Turno das Eleições Gerais de 2026')
    ).toBeInTheDocument();

    // Deve exibir o evento de reeleição de Lula
    expect(
      screen.getByText('TSE Confirma Luiz Inácio Lula da Silva Reeleito Presidente da República')
    ).toBeInTheDocument();
  });

  it('deve permitir filtrar eventos por busca de texto', () => {
    render(<HistoricalTimeline events={TIMELINE_EVENTS_2026} />);

    const searchInput = screen.getByPlaceholderText(/Buscar por data, decisão, fonte ou termo.../);
    fireEvent.change(searchInput, { target: { value: 'Douglas Ruas' } });

    // Deve encontrar o evento de Douglas Ruas
    expect(
      screen.getByText('TRE-RJ Homologa Retotalização e Proclama Douglas Ruas Governador Eleito')
    ).toBeInTheDocument();

    // Não deve exibir eventos não relacionados
    expect(
      screen.queryByText('Realização do Primeiro Turno das Eleições Gerais de 2026')
    ).not.toBeInTheDocument();
  });

  it('deve exibir fontes oficiais com links e publicadores verificáveis', () => {
    render(<HistoricalTimeline events={TIMELINE_EVENTS_2026} />);

    // Fontes no DOM
    expect(
      screen.getAllByText(/\(Tribunal Superior Eleitoral \(TSE\)\)/).length
    ).toBeGreaterThan(0);
  });
});
