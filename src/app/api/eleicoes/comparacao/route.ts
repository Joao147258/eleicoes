import { NextRequest, NextResponse } from 'next/server';
import { defaultTseClient } from '@/modules/elections/infrastructure/tse/tse-client';

export const dynamic = 'force-dynamic';
export const revalidate = 20;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cargo = searchParams.get('cargo') === 'governador' ? 'governador' : 'presidente';
  const scope = (searchParams.get('scope') || (cargo === 'presidente' ? 'br' : 'sp')).toLowerCase();

  if (scope !== 'br' && !/^[a-z]{2}$/.test(scope)) {
    return NextResponse.json(
      { error: 'Escopo inválido. Deve ser "br" ou a sigla de uma UF.' },
      { status: 400 }
    );
  }

  try {
    const comparison = await defaultTseClient.fetchRoundComparison(cargo, scope);
    return NextResponse.json(comparison, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=60',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao processar comparação entre turnos';
    return NextResponse.json(
      {
        error: message,
        cargo,
        scope,
        isUnavailable: true,
      },
      { status: 502 }
    );
  }
}
