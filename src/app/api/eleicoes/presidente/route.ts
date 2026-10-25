import { NextRequest, NextResponse } from 'next/server';
import { defaultTseClient } from '@/modules/elections/infrastructure/tse/tse-client';
import { defaultHistoryService } from '@/modules/elections/infrastructure/history/history-service';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const scope = (searchParams.get('scope') || 'br').toLowerCase();
  const electionCode = searchParams.get('electionCode') || '6258';

  // Validação simples do escopo (br ou UF de 2 letras)
  if (scope !== 'br' && !/^[a-z]{2}$/.test(scope)) {
    return NextResponse.json(
      { error: 'Escopo inválido. Utilize "br" ou a sigla de uma UF de 2 letras.' },
      { status: 400 }
    );
  }

  try {
    const summary = await defaultTseClient.fetchPresidentResults(scope, electionCode);
    
    // Registra o snapshot no histórico automaticamente
    try {
      defaultHistoryService.recordSnapshot(summary);
    } catch {
      // Falha não-bloqueante na persistência
    }

    return NextResponse.json(summary, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno ao consultar dados do TSE';
    return NextResponse.json(
      {
        error: message,
        scope,
        electionCode,
        isUnavailable: true,
      },
      { status: 502 }
    );
  }
}
