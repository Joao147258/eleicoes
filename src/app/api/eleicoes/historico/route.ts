import { NextRequest, NextResponse } from 'next/server';
import { defaultHistoryService } from '@/modules/elections/infrastructure/history/history-service';
import { defaultTseClient, ELECTION_CODES } from '@/modules/elections/infrastructure/tse/tse-client';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role') === 'governador' ? 'governador' : 'presidente';
  const roleCode = role === 'governador' ? '3' : '1';
  const scope = (searchParams.get('scope') || (role === 'presidente' ? 'br' : 'sp')).toLowerCase();
  const round = parseInt(searchParams.get('round') || '2', 10);
  const windowMinutes = searchParams.get('window') ? parseInt(searchParams.get('window')!, 10) : undefined;

  // Validação
  if (scope !== 'br' && !/^[a-z]{2}$/.test(scope)) {
    return NextResponse.json(
      { error: 'Escopo inválido. Utilize "br" ou a sigla de uma UF.' },
      { status: 400 }
    );
  }

  try {
    // Para garantir que o histórico tenha pelo menos o ponto mais recente se ainda não foi consultado
    try {
      if (role === 'presidente') {
        const electionCode = round === 1 ? ELECTION_CODES.PRESIDENT_1T : ELECTION_CODES.PRESIDENT_2T;
        const current = await defaultTseClient.fetchPresidentResults(scope, electionCode);
        defaultHistoryService.recordSnapshot(current);
      } else {
        const electionCode = round === 1 ? ELECTION_CODES.GOVERNOR_1T : ELECTION_CODES.GOVERNOR_2T;
        const current = await defaultTseClient.fetchGovernorResults(scope, electionCode);
        defaultHistoryService.recordSnapshot(current);
      }
    } catch {
      // Ignora erro se a consulta recente falhar (usa o histórico já armazenado)
    }

    const history = defaultHistoryService.getHistory(roleCode, scope, round, windowMinutes);

    return NextResponse.json(history, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao processar linha do tempo histórica';
    return NextResponse.json(
      { error: message, scope, role, round },
      { status: 500 }
    );
  }
}
