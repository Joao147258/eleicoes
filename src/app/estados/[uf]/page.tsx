'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { ElectionSummary, RoundComparison } from '@/modules/elections/domain/models';
import { STATES_MAP } from '@/data/geography/brazil-states';
import { TurnComparisonSection } from '@/components/comparison/TurnComparisonSection';
import { ElectionTimelineSection } from '@/components/history/ElectionTimelineSection';
import { StateTimelineEvents } from '@/components/timeline/StateTimelineEvents';
import { ArrowLeft, Clock, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Falha ao carregar');
  return res.json();
});

export default function StateDetailPage() {
  const params = useParams();
  const ufParam = (params?.uf as string || '').toLowerCase();
  const stateMeta = STATES_MAP.get(ufParam);

  const {
    data: stateData,
    error,
    isLoading,
    mutate,
  } = useSWR<ElectionSummary>(
    ufParam ? `/api/eleicoes/presidente?scope=${ufParam}` : null,
    fetcher,
    { refreshInterval: 10000 }
  );

  const { data: comparisonData } = useSWR<RoundComparison>(
    ufParam ? `/api/eleicoes/comparacao?cargo=presidente&scope=${ufParam}` : null,
    fetcher,
    { refreshInterval: 20000 }
  );

  const formatNumber = (n: number) => n.toLocaleString('pt-BR');
  const formatPercent = (n: number) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';

  if (!stateMeta) {
    return (
      <div className="text-center py-16 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Estado não encontrado</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">A sigla informada ({ufParam.toUpperCase()}) não corresponde a uma UF válida do Brasil.</p>
        <Link
          href="/estados"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Estados
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Voltar e Cabeçalho */}
      <div>
        <Link
          href="/estados"
          className="inline-flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 hover:text-emerald-800 dark:hover:text-emerald-300 mb-4 transition font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para visão geral dos estados
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-sm font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {stateMeta.uf}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {stateMeta.name}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">
              Região {stateMeta.region} • Capital: {stateMeta.capital} • Apuração Presidencial
            </p>
          </div>

          <button
            onClick={() => mutate()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>
            Não foi possível recuperar os dados deste estado neste instante do TSE. A apuração pode não ter sido iniciada ou os arquivos estão sendo consolidados.
          </p>
        </div>
      )}

      {stateData ? (
        <div className="space-y-6">
          {/* Status do Estado */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 text-xs">
              <div className="flex items-center gap-2">
                {stateData.isFinal ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5" /> Totalização Concluída (100%)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    <Clock className="w-3.5 h-3.5" /> Apuração em Andamento
                  </span>
                )}
              </div>

              <div className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Atualização oficial: {stateData.totalizedDate} às {stateData.totalizedTime}</span>
              </div>
            </div>

            {/* Progresso de Seções */}
            <div className="py-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    Seções Totalizadas no Estado
                  </span>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {formatNumber(stateData.progress.totalizedSections)} de {formatNumber(stateData.progress.totalSections)} seções apuradas
                  </p>
                </div>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatPercent(stateData.progress.percentTotalized)}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-3 rounded-full"
                  style={{ width: `${Math.min(100, stateData.progress.percentTotalized)}%` }}
                />
              </div>
            </div>

            {/* Candidatos no Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {stateData.candidates.map((cand, index) => (
                <div
                  key={cand.number}
                  className={`p-5 rounded-xl border ${
                    index === 0
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-gray-50/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {cand.party} • Nº {cand.number}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1.5">
                    {cand.ballotName}
                  </h3>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                      {formatPercent(cand.percentage)}
                    </span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      {formatNumber(cand.votes)} votos
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Estatísticas de Votos e Eleitorado no Estado */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 block font-medium">Votos Válidos</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {formatNumber(stateData.votes.validVotes)}
                </span>
                <span className="text-[11px] text-gray-700 dark:text-gray-300 block font-medium">
                  ({formatPercent(stateData.votes.percentValid)})
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 block font-medium">Brancos e Nulos</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {formatNumber(stateData.votes.blankVotes + stateData.votes.nullVotes)}
                </span>
                <span className="text-[11px] text-gray-700 dark:text-gray-300 block font-medium">
                  Brancos: {formatPercent(stateData.votes.percentBlank)} • Nulos: {formatPercent(stateData.votes.percentNull)}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 block font-medium">Comparecimento</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {formatNumber(stateData.voters.turnout)}
                </span>
                <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block font-semibold">
                  {formatPercent(stateData.voters.percentTurnout)} do eleitorado
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 block font-medium">Abstenção</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {formatNumber(stateData.voters.abstention)}
                </span>
                <span className="text-[11px] text-amber-800 dark:text-amber-300 block font-semibold">
                  {formatPercent(stateData.voters.percentAbstention)} do eleitorado
                </span>
              </div>
            </div>
          </div>

          {/* Comparação 1º e 2º Turno no Estado */}
          {comparisonData && (
            <TurnComparisonSection
              comparison={comparisonData}
              title={`Presidente em ${stateMeta.name} — Comparação 1º e 2º Turno`}
            />
          )}

          {/* Linha do Tempo e Ritmo de Apuração no Estado */}
          <ElectionTimelineSection
            role="presidente"
            scope={ufParam}
            scopeName={`Presidente em ${stateMeta.name}`}
            round={2}
            onRefreshTriggered={() => mutate()}
          />

          {/* Acontecimentos Eleitorais Documentados da UF */}
          <StateTimelineEvents uf={ufParam} stateName={stateMeta.name} />
        </div>
      ) : (
        <div className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-2" />
          <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Carregando dados eleitorais oficiais de {stateMeta.name}...</p>
        </div>
      )}
    </div>
  );
}
