import { NextResponse } from 'next/server';
import { defaultTseClient } from '@/modules/elections/infrastructure/tse/tse-client';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET() {
  try {
    const states = await defaultTseClient.fetchGovernorOverviewAll();
    return NextResponse.json(
      {
        totalStates: states.length,
        secondRoundCount: states.filter((s) => s.status === 'segundo_turno').length,
        firstRoundDecidedCount: states.filter((s) => s.status === 'definida_1t').length,
        pendingCount: states.filter((s) => s.status === 'nao_confirmada').length,
        unavailableCount: states.filter((s) => s.status === 'indisponivel').length,
        states,
        updatedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=90',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao listar panorama de governadores';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
