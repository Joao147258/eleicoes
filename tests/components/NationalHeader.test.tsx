import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import NationalHeader from '@/components/dashboard/NationalHeader';
import { normalizeTseEA20 } from '@/modules/elections/infrastructure/tse/normalizer';
import { tseEA20Schema } from '@/modules/elections/infrastructure/tse/schemas';
import sampleEA20 from '../fixtures/sample-ea20.json';

describe('NationalHeader Component', () => {
  it('deve renderizar os candidatos, percentuais e progresso da totalização', () => {
    const raw = tseEA20Schema.parse(sampleEA20);
    const summary = normalizeTseEA20(raw);

    render(<NationalHeader data={summary} />);

    // Nomes dos candidatos
    expect(screen.getByText('FLAVIO BOLSONARO')).toBeInTheDocument();
    expect(screen.getByText('LULA')).toBeInTheDocument();

    // Percentuais
    expect(screen.getByText('50,46%')).toBeInTheDocument();
    expect(screen.getByText('49,54%')).toBeInTheDocument();

    // Progresso
    expect(screen.getByText('26,30%')).toBeInTheDocument();
    expect(screen.getByText(/131\.326 de 499\.248 seções totalizadas/)).toBeInTheDocument();
  });
});
