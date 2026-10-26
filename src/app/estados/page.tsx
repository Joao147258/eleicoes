'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { StateSummaryOverview } from '@/modules/elections/domain/models';
import StatesTable from '@/components/tables/StatesTable';
import BrazilInteractiveMap from '@/components/maps/BrazilInteractiveMap';
import { RefreshCw } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EstadosPage() {
  const [selectedUf, setSelectedUf] = useState<string | null>(null);

  const { data: statesData, isLoading, mutate } = useSWR<StateSummaryOverview[]>(
    '/api/eleicoes/estados',
    fetcher,
    { refreshInterval: 0, revalidateOnFocus: false }
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Apuração Estadual — Todas as 27 UFs
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
            Visão consolidada do resultado para Presidente em cada estado e no Distrito Federal.
          </p>
        </div>

        <button
          onClick={() => mutate()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
          {isLoading ? 'Atualizando...' : 'Atualizar Estados'}
        </button>
      </div>

      {statesData ? (
        <>
          <BrazilInteractiveMap
            statesData={statesData}
            selectedUf={selectedUf}
            onSelectState={(uf) => setSelectedUf(uf)}
            onClearSelection={() => setSelectedUf(null)}
          />
          <StatesTable
            states={statesData}
            selectedUf={selectedUf}
            onSelectState={(uf) => setSelectedUf(uf)}
          />
        </>
      ) : (
        <div className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-2" />
          <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Carregando dados eleitorais dos estados...</p>
        </div>
      )}
    </div>
  );
}
