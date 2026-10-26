'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import {
  ElectionSummary,
  StateSummaryOverview,
  RoundComparison,
} from '@/modules/elections/domain/models';
import { BRAZIL_STATES } from '@/data/geography/brazil-states';
import HeaderAndContext from '@/components/dashboard/HeaderAndContext';
import NationalOverview from '@/components/dashboard/NationalOverview';
import StatesAnalyticalPanorama from '@/components/dashboard/StatesAnalyticalPanorama';
import BrazilInteractiveMap from '@/components/maps/BrazilInteractiveMap';
import StatesTable from '@/components/tables/StatesTable';
import { TurnComparisonSection } from '@/components/comparison/TurnComparisonSection';
import { TimelinePreviewCard } from '@/components/timeline/TimelinePreviewCard';
import { AlertCircle, RefreshCw, Layers, TrendingUp, BarChart3 } from 'lucide-react';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Falha ao obter dados da API');
    return res.json();
  });

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estado da última consulta local do cliente
  const [lastClientFetch, setLastClientFetch] = useState<Date>(new Date());

  // Fonte de verdade da UF selecionada (sincronizada com ?uf=XX da URL)
  const urlUfParam = searchParams.get('uf');
  const urlCompareParam = searchParams.get('comparar') === '1';
  const [selectedUf, setSelectedUf] = useState<string | null>(null);
  const [activeSectionView, setActiveSectionView] = useState<'geral' | 'comparacao'>(
    urlCompareParam ? 'comparacao' : 'geral'
  );

  // Sincroniza a seleção inicial ou mudanças de histórico do navegador (Voltar/Avançar)
  useEffect(() => {
    if (urlUfParam) {
      const lower = urlUfParam.toLowerCase();
      const isValid = BRAZIL_STATES.some((s) => s.uf.toLowerCase() === lower);
      if (isValid) {
        setSelectedUf(lower);
      } else {
        setSelectedUf(null);
      }
    } else {
      setSelectedUf(null);
    }
  }, [urlUfParam]);

  // Atualização da UF selecionada com persistência na URL sem scroll
  const handleSelectState = useCallback(
    (uf: string) => {
      const lower = uf.toLowerCase();
      setSelectedUf(lower);

      const params = new URLSearchParams(searchParams.toString());
      params.set('uf', lower.toUpperCase());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Limpeza explícita da seleção
  const handleClearSelection = useCallback(() => {
    setSelectedUf(null);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('uf');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  const handleToggleView = (view: 'geral' | 'comparacao') => {
    setActiveSectionView(view);
    const params = new URLSearchParams(searchParams.toString());
    if (view === 'comparacao') {
      params.set('comparar', '1');
    } else {
      params.delete('comparar');
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  // Consumo de dados oficiais via rotas internas com SWR (eleição consolidada - sem polling automático)
  const {
    data: nationalData,
    error: nationalError,
    isLoading: nationalLoading,
    mutate: refreshNational,
  } = useSWR<ElectionSummary>('/api/eleicoes/presidente?scope=br', fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    onSuccess: () => setLastClientFetch(new Date()),
  });

  const {
    data: statesData,
    error: statesError,
    isLoading: statesLoading,
    mutate: refreshStates,
  } = useSWR<StateSummaryOverview[]>('/api/eleicoes/estados', fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    onSuccess: () => setLastClientFetch(new Date()),
  });

  // Comparação Presidencial (Nacional ou da UF selecionada)
  const currentScope = selectedUf || 'br';
  const {
    data: comparisonData,
    isLoading: comparisonLoading,
    mutate: refreshComparison,
  } = useSWR<RoundComparison>(
    `/api/eleicoes/comparacao?cargo=presidente&scope=${currentScope}`,
    fetcher,
    { refreshInterval: 0, revalidateOnFocus: false }
  );

  const isRefreshing = nationalLoading || statesLoading;

  const handleManualRefresh = () => {
    refreshNational();
    refreshStates();
    refreshComparison();
    setLastClientFetch(new Date());
  };

  const selectedStateMeta = selectedUf
    ? BRAZIL_STATES.find((s) => s.uf.toLowerCase() === selectedUf.toLowerCase())
    : null;

  return (
    <div className="space-y-10">
      {/* ÁREA 1: Cabeçalho, Contexto e Sincronização */}
      <HeaderAndContext
        nationalData={nationalData}
        isLoading={isRefreshing}
        onRefresh={handleManualRefresh}
        lastClientFetch={lastClientFetch}
      />

      {/* Alerta em caso de indisponibilidade momentânea na CDN do TSE */}
      {nationalError && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <div>
            <strong className="block font-bold">Aviso sobre os servidores do TSE</strong>
            <span className="text-[11px] leading-relaxed">
              Não foi possível estabelecer contato com os servidores da CDN do TSE neste segundo. Mantendo os últimos dados oficiais obtidos com integridade preservada.
            </span>
          </div>
        </div>
      )}

      {/* ÁREA 2: Panorama Nacional */}
      {nationalData ? (
        <NationalOverview data={nationalData} />
      ) : (
        <div className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-10 h-72 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-semibold">
              Carregando totalização presidencial oficial do TSE...
            </p>
          </div>
        </div>
      )}

      {/* Barra de Seleção de Modos: [Visão Geral | Comparativo 1º x 2º Turno | Linha do Tempo (10s)] */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleToggleView('geral')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeSectionView === 'geral'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Visão Geral (2º Turno)
          </button>

          <button
            onClick={() => handleToggleView('comparacao')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeSectionView === 'comparacao'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Comparar 1º x 2º Turno {selectedStateMeta ? `(${selectedStateMeta.uf})` : '(Brasil)'}
          </button>

          <Link
            href="/linha-do-tempo"
            className="px-4 py-2 rounded-xl transition flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Linha do Tempo Oficial
          </Link>
        </div>

        {selectedStateMeta && (
          <div className="text-xs font-medium text-gray-500 pr-2">
            Filtro ativo:{' '}
            <strong className="text-gray-900 dark:text-white">
              {selectedStateMeta.name} ({selectedStateMeta.uf})
            </strong>
          </div>
        )}
      </div>

      {/* Exibição condicional da Comparação em destaque */}
      {activeSectionView === 'comparacao' && comparisonData && (
        <TurnComparisonSection
          comparison={comparisonData}
          title={`Presidente da República — Comparação 1º e 2º Turno (${
            selectedStateMeta ? selectedStateMeta.name : 'Brasil'
          })`}
        />
      )}

      {/* Card da Linha do Tempo Histórica das Eleições 2026 */}
      <TimelinePreviewCard />

      {/* ÁREA 3: Panorama Analítico dos Estados */}
      {statesData && (
        <StatesAnalyticalPanorama
          states={statesData}
          onSelectState={handleSelectState}
          selectedUf={selectedUf}
        />
      )}

      {/* ÁREA 4: Mapa Interativo com Seleção Persistente & Painel Lateral */}
      {statesData ? (
        <BrazilInteractiveMap
          statesData={statesData}
          selectedUf={selectedUf}
          onSelectState={handleSelectState}
          onClearSelection={handleClearSelection}
        />
      ) : (
        <div className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 h-96 flex items-center justify-center">
          <p className="text-xs text-gray-500 font-semibold">
            Carregando mapa vetorial e indicadores das unidades federativas...
          </p>
        </div>
      )}

      {/* ÁREA 5: Tabela Comparativa dos 27 Estados */}
      {statesData ? (
        <StatesTable
          states={statesData}
          selectedUf={selectedUf}
          onSelectState={handleSelectState}
        />
      ) : (
        <div className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 h-64 flex items-center justify-center">
          <p className="text-xs text-gray-500 font-semibold">
            Carregando dados tabulares das 27 UFs...
          </p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse py-20 text-center text-xs text-gray-500">
          Carregando Painel Eleitoral Brasil...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
