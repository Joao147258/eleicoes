import { describe, it, expect } from 'vitest';
import { TIMELINE_EVENTS_2026 } from '@/data/elections/2026/timeline-events';

describe('TIMELINE_EVENTS_2026 - Dados Históricos da Eleição 2026', () => {
  it('deve conter eventos com identificadores únicos e formato de âncora válido', () => {
    const ids = TIMELINE_EVENTS_2026.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    for (const id of ids) {
      expect(id).toMatch(/^evento-[a-z0-9-]+$/);
    }
  });

  it('deve conter eventos com campos obrigatórios e fontes documentadas verificáveis', () => {
    for (const event of TIMELINE_EVENTS_2026) {
      expect(event.title).toBeTruthy();
      expect(event.occurredAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(event.displayDate).toBeTruthy();
      expect(event.period).toMatch(/^(1t|intervalo|2t|pos-eleicao)$/);
      expect(event.description.length).toBeGreaterThan(20);
      expect(event.sources.length).toBeGreaterThan(0);

      for (const source of event.sources) {
        expect(source.title).toBeTruthy();
        expect(source.publisher).toBeTruthy();
        expect(source.url).toMatch(/^https?:\/\//);
      }
    }
  });

  it('deve conter o marco oficial da reeleição presidencial de Lula em 25/10/2026 às 21:08', () => {
    const definitionEvent = TIMELINE_EVENTS_2026.find(
      (e) => e.id === 'evento-2026-10-25-resultado-presidencial'
    );
    expect(definitionEvent).toBeDefined();
    expect(definitionEvent?.occurredAt).toBe('2026-10-25T21:08:00-03:00');
    expect(definitionEvent?.isMilestone).toBe(true);
    expect(definitionEvent?.title).toContain('Luiz Inácio Lula da Silva Reeleito Presidente');
    expect(definitionEvent?.description).toContain('21h08');
  });

  it('deve documentar a retotalização e proclamação de Douglas Ruas no Rio de Janeiro (RJ)', () => {
    const rjEvents = TIMELINE_EVENTS_2026.filter((e) => e.uf === 'RJ');
    expect(rjEvents.length).toBeGreaterThanOrEqual(3);

    const rjDecision = rjEvents.find((e) => e.id === 'evento-2026-10-08-decisao-tse-retotalizacao-rj');
    const rjProclamation = rjEvents.find((e) => e.id === 'evento-2026-10-15-proclamacao-oficial-rj');

    expect(rjDecision).toBeDefined();
    expect(rjProclamation).toBeDefined();
    expect(rjProclamation?.title).toContain('Douglas Ruas Governador Eleito');
  });

  it('deve manter ordem cronológica estrita da linha do tempo', () => {
    for (let i = 0; i < TIMELINE_EVENTS_2026.length - 1; i++) {
      const current = new Date(TIMELINE_EVENTS_2026[i].occurredAt).getTime();
      const next = new Date(TIMELINE_EVENTS_2026[i + 1].occurredAt).getTime();
      expect(current).toBeLessThanOrEqual(next);
    }
  });
});
