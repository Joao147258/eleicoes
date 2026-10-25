import { NextRequest, NextResponse } from 'next/server';
import { BRAZIL_STATES } from '@/data/geography/brazil-states';
import { StateSummaryOverview } from '@/modules/elections/domain/models';
import { defaultTseClient } from '@/modules/elections/infrastructure/tse/tse-client';

export const dynamic = 'force-dynamic';

// Cache em memória simples no processo Node.js para resiliência e alta performance
interface CachedStateData {
  timestamp: number;
  data: StateSummaryOverview[];
}

let memoryCache: CachedStateData | null = null;
const CACHE_TTL_MS = 20 * 1000; // 20 segundos

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const electionCode = searchParams.get('electionCode') || '6258';
  const now = Date.now();

  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(memoryCache.data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=60',
        'X-Cache': 'HIT',
      },
    });
  }

  // Busca dados para os 27 estados com concorrência controlada
  const results: StateSummaryOverview[] = [];
  const batchSize = 6;

  for (let i = 0; i < BRAZIL_STATES.length; i += batchSize) {
    const batch = BRAZIL_STATES.slice(i, i + batchSize);
    const batchPromises = batch.map(async (state) => {
      try {
        const summary = await defaultTseClient.fetchPresidentResults(state.uf.toLowerCase(), electionCode);
        const first = summary.candidates[0] || null;
        const second = summary.candidates[1] || null;

        const overview: StateSummaryOverview = {
          uf: state.uf,
          name: state.name,
          region: state.region,
          percentTotalized: summary.progress.percentTotalized,
          isFinal: summary.isFinal,
          leaderNumber: first ? first.number : null,
          leaderName: first ? first.ballotName : null,
          leaderPercentage: first ? first.percentage : null,
          leaderVotes: first ? first.votes : null,
          runnerUpName: second ? second.ballotName : null,
          runnerUpPercentage: second ? second.percentage : null,
          runnerUpVotes: second ? second.votes : null,
          voteMargin: summary.leader ? summary.leader.voteMargin : null,
          percentageMargin: summary.leader ? summary.leader.percentageMargin : null,
          validVotes: summary.votes.validVotes,
          totalSections: summary.progress.totalSections,
          totalizedSections: summary.progress.totalizedSections,
          updatedAt: `${summary.totalizedDate} ${summary.totalizedTime}`,
        };
        return overview;
      } catch {
        // Se determinado estado falhar ou estiver temporariamente indisponível no TSE
        const fallback: StateSummaryOverview = {
          uf: state.uf,
          name: state.name,
          region: state.region,
          percentTotalized: 0,
          isFinal: false,
          leaderNumber: null,
          leaderName: null,
          leaderPercentage: null,
          leaderVotes: null,
          runnerUpName: null,
          runnerUpPercentage: null,
          runnerUpVotes: null,
          voteMargin: null,
          percentageMargin: null,
          validVotes: 0,
          totalSections: 0,
          totalizedSections: 0,
          updatedAt: 'Indisponível',
        };
        return fallback;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  // Atualiza cache em memória
  memoryCache = {
    timestamp: now,
    data: results,
  };

  return NextResponse.json(results, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=60',
      'X-Cache': 'MISS',
    },
  });
}
