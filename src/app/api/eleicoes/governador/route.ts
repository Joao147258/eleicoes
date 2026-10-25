import { NextRequest, NextResponse } from 'next/server';
import { defaultTseClient } from '@/modules/elections/infrastructure/tse/tse-client';
import { defaultHistoryService } from '@/modules/elections/infrastructure/history/history-service';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const uf = (searchParams.get('uf') || '').toLowerCase();
  const electionCode = searchParams.get('electionCode') || '6260';

  if (!uf || !/^[a-z]{2}$/.test(uf)) {
    return NextResponse.json(
      { error: 'Parâmetro "uf" obrigatório e deve ter 2 letras (ex: sp, rj, ba).' },
      { status: 400 }
    );
  }

  try {
    const summary = await defaultTseClient.fetchGovernorResults(uf, electionCode);
    
    try {
      defaultHistoryService.recordSnapshot(summary);
    } catch {
      // Ignora erro não bloqueante
    }

    return NextResponse.json(summary, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao consultar resultado de governador';
    return NextResponse.json(
      {
        error: message,
        uf,
        electionCode,
        isUnavailable: true,
      },
      { status: 502 }
    );
  }
}
