'use client';

import React from 'react';
import useSWR from 'swr';
import { ElectionSummary, StateSummaryOverview } from '@/modules/elections/domain/models';
import NationalHeader from '@/components/dashboard/NationalHeader';
import BrazilInteractiveMap from '@/components/maps/BrazilInteractiveMap';
import StatesTable from '@/components/tables/StatesTable';
import { RefreshCw, AlertCircle } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Falha ao obter dados da API');
  return res.json();
});

export default function HomePage() {
  const {
    data: nationalData,
    error: nationalError,
    isLoading: nationalLoading,
    mutate: refreshNational,
  } = useSWR<ElectionSummary>('/api/eleicoes/presidente?scope=br', fetcher, {
    refreshInterval: 15000, // Atualização automática a cada 15s
    revalidateOnFocus: true,
  });

  const {
    data: statesData,
    error: statesError,
    isLoading: statesLoading,
    mutate: refreshStates,
  } = useSWR<StateSummaryOverview[]>('/api/eleicoes/estados', fetcher, {
    refreshInterval: 30000, // Atualização a cada 30s para tabela e mapa
    revalidateOnFocus: false,
  });

  const isRefreshing = nationalLoading || statesLoading;

  const handleManualRefresh = () => {
    refreshNational();
    refreshStates();
  };

  return (
    <div className="space-y-8">
      {/* Barra de controle rápido e atualização */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Apuração Presidencial 2026 — 2º Turno
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
            Resultados consolidados em tempo real a partir dos arquivos públicos de totalização do TSE.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
      </div>

      {/* Erro de conexão com TSE */}
      {nationalError && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold">Aviso sobre os servidores do TSE</p>
            <p className="text-[11px] mt-0.5">
              Não foi possível obter a atualização mais recente dos arquivos de apuração neste instante. Exibindo os últimos dados disponíveis em cache seguro.
            </p>
          </div>
        </div>
      )}

      {/* Header Nacional */}
      {nationalData ? (
        <NationalHeader data={nationalData} />
      ) : (
        <div className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 h-80 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-2" />
            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Carregando dados da totalização oficial do TSE...</p>
          </div>
        </div>
      )}

      {/* Mapa Interativo */}
      {statesData && (
        <BrazilInteractiveMap statesData={statesData} />
      )}

      {/* Tabela dos 27 Estados */}
      {statesData ? (
        <StatesTable states={statesData} />
      ) : (
        <div className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 h-64 flex items-center justify-center">
          <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Carregando dados comparativos das 27 unidades federativas...</p>
        </div>
      )}
    </div>
  );
}
