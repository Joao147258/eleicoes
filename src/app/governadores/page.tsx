'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { BRAZIL_STATES } from '@/data/geography/brazil-states';
import { ElectionSummary } from '@/modules/elections/domain/models';
import { Clock, CheckCircle2, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Falha ao obter dados de governador');
  return res.json();
});

export default function GovernadoresPage() {
  const [selectedUf, setSelectedUf] = useState<string>('sp');

  const { data, error, isLoading, mutate } = useSWR<ElectionSummary>(
    `/api/eleicoes/governador?uf=${selectedUf}`,
    fetcher,
    { refreshInterval: 20000 }
  );

  const formatNumber = (n: number) => n.toLocaleString('pt-BR');
  const formatPercent = (n: number) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';

  const selectedStateMeta = BRAZIL_STATES.find(
    (s) => s.uf.toLowerCase() === selectedUf.toLowerCase()
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Eleição para Governador — 2º Turno Oficial
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
          Acompanhe os resultados das disputas estaduais para governador com dados oficiais do TSE.
        </p>
      </div>

      {/* Seletor de Estado */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <label htmlFor="uf-select" className="text-xs font-bold text-gray-700 dark:text-gray-300">
          Selecione o Estado:
        </label>
        <select
          id="uf-select"
          value={selectedUf}
          onChange={(e) => setSelectedUf(e.target.value)}
          className="text-xs font-semibold py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {BRAZIL_STATES.map((s) => (
            <option key={s.uf} value={s.uf.toLowerCase()}>
              {s.name} ({s.uf})
            </option>
          ))}
        </select>

        <button
          onClick={() => mutate()}
          disabled={isLoading}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
          Atualizar
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>
            Não há dados de 2º turno para Governador disponíveis para <strong>{selectedStateMeta?.name} ({selectedStateMeta?.uf})</strong> no momento. A eleição estadual pode ter sido decidida em 1º turno ou os dados estão em processamento pelo TSE.
          </p>
        </div>
      )}

      {data && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                Governador de {selectedStateMeta?.name}
              </span>
              {data.isFinal ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Eleição Concluída
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  <Clock className="w-3.5 h-3.5" /> Apuração em Andamento
                </span>
              )}
            </div>

            <div className="text-gray-700 dark:text-gray-300 font-medium">
              Última atualização: {data.totalizedDate} às {data.totalizedTime}
            </div>
          </div>

          {/* Barra de Progresso */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Totalização das Seções do Estado
                </span>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {formatNumber(data.progress.totalizedSections)} de {formatNumber(data.progress.totalSections)} seções totalizadas
                </p>
              </div>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatPercent(data.progress.percentTotalized)}
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-3 rounded-full"
                style={{ width: `${Math.min(100, data.progress.percentTotalized)}%` }}
              />
            </div>
          </div>

          {/* Candidatos a Governador */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {data.candidates.map((cand, idx) => (
              <div
                key={cand.number}
                className={`p-6 rounded-xl border relative ${
                  idx === 0
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700'
                    : 'bg-gray-50/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700'
                }`}
              >
                {cand.isElected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                    <UserCheck className="w-3 h-3" /> ELEITO
                  </div>
                )}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {cand.party} • Nº {cand.number}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                  {cand.ballotName}
                </h3>
                {cand.viceCandidate && (
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 font-medium">
                    Vice: {cand.viceCandidate.ballotName} ({cand.viceCandidate.party})
                  </p>
                )}
                <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {formatPercent(cand.percentage)}
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {formatNumber(cand.votes)} votos
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
