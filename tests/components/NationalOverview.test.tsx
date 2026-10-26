import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import NationalOverview from '@/components/dashboard/NationalOverview';
import { normalizeTseEA20 } from '@/modules/elections/infrastructure/tse/normalizer';
import { tseEA20Schema } from '@/modules/elections/infrastructure/tse/schemas';
import sampleEA20 from '../fixtures/sample-ea20.json';

describe('NationalOverview Component', () => {
  it('deve renderizar os candidatos, percentuais, diferença e progresso da totalização', () => {
    const raw = tseEA20Schema.parse(sampleEA20);
    const summary = normalizeTseEA20(raw);

    render(<NationalOverview data={summary} />);

    // Painel de Status da Apuração na esquerda
    expect(screen.getByText('Status da Apuração')).toBeInTheDocument();
    expect(screen.getByText(/Seções faltando apurar:/)).toBeInTheDocument();

    // Nomes dos candidatos na direita
    expect(screen.getByText('FLAVIO BOLSONARO')).toBeInTheDocument();
    expect(screen.getByText('LULA')).toBeInTheDocument();

    // Percentuais dos candidatos
    expect(screen.getByText('50,46%')).toBeInTheDocument();
    expect(screen.getByText('49,54%')).toBeInTheDocument();

    // Progresso das seções totalizadas
    expect(screen.getByText('26,30%')).toBeInTheDocument();
    expect(screen.getByText(/131\.326/)).toBeInTheDocument();

    // Votos nulos com percentual oficial corrigido (1,96% e não 100%)
    expect(screen.getByText('(1,96%)')).toBeInTheDocument();

    // Votos válidos
    expect(screen.getByText('Votos Válidos')).toBeInTheDocument();
  });

  it('deve renderizar o modo de eleito proclamado quando a eleição estiver definida', () => {
    const raw = tseEA20Schema.parse(sampleEA20);
    const summary = normalizeTseEA20(raw);

    // Ajustar para simular resultado oficialmente proclamado com Lula reeleito
    const proclaimedSummary = {
      ...summary,
      resultStatus: 'eleito_definido' as const,
      resultStatusLabel: 'Eleição Definida Oficialmente',
      declaredAt: '25/10/2026 21:08:00',
      electedCandidate: {
        number: '13',
        name: 'LUIZ INACIO LULA DA SILVA',
        ballotName: 'LULA',
        party: 'PT',
        partyNumber: '13',
        federation: '',
        coalition: 'BRASIL DA ESPERANÇA',
        votes: 60345999,
        percentage: 50.9,
        highPrecisionPercentage: 50.9,
        isElected: true,
        situation: 'Eleito',
        status: 'regular',
        viceCandidate: {
          name: 'GERALDO JOSE RODRIGUES ALCKMIN FILHO',
          ballotName: 'GERALDO ALCKMIN',
          party: 'PSB',
        },
      },
    };

    render(<NationalOverview data={proclaimedSummary} />);

    // Título de transição para modo resultado
    expect(
      screen.getByText('Eleições 2026 — Resultado do Segundo Turno')
    ).toBeInTheDocument();

    // Banner de proclamação oficial do presidente reeleito
    expect(screen.getByText('Presidente reeleito — LULA')).toBeInTheDocument();
    expect(
      screen.getByText(/Definição atestada pelo TSE em 25\/10\/2026, às 21h08/)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/GERALDO ALCKMIN/).length).toBeGreaterThanOrEqual(1);
  });
});
