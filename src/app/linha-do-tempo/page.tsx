import React from 'react';
import { Metadata } from 'next';
import { HistoricalTimeline } from '@/components/timeline/HistoricalTimeline';
import { TIMELINE_EVENTS_2026 } from '@/data/elections/2026/timeline-events';

export const metadata: Metadata = {
  title: 'Linha do Tempo das Eleições 2026 — Painel Eleitoral Brasil',
  description:
    'Cronologia histórica e documentada dos principais acontecimentos políticos, jurídicos e eleitorais entre o primeiro e o segundo turno das Eleições Gerais de 2026 com fontes oficiais.',
};

export default function LinhaDoTempoPage() {
  return (
    <main className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      <HistoricalTimeline
        events={TIMELINE_EVENTS_2026}
        title="Eleições 2026 — Linha do Tempo"
        subtitle="Uma retrospectiva documentada dos principais acontecimentos entre o primeiro e o segundo turno das eleições brasileiras, com fontes oficiais e neutralidade documental."
      />
    </main>
  );
}
