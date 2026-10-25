'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { BRAZIL_STATES, BRAZIL_REGIONS } from '@/data/geography/brazil-states';
import {
  ElectionSummary,
  RoundComparison,
  GovernorStateOverview,
  GovernorElectionStatus,
} from '@/modules/elections/domain/models';
import { TurnComparisonSection } from '@/components/comparison/TurnComparisonSection';
import { ElectionTimelineSection } from '@/components/history/ElectionTimelineSection';
import {
  Clock,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Layers,
  MapPin,
  TrendingUp,
  Award,
  ChevronRight,
  Vote,
} from 'lucide-react';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Falha ao obter dados oficiais');
    return res.json();
  });

function GovernadoresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obter UF e flag de comparação a partir da URL
  const initialUf = (searchParams.get('uf') || 'sp').toLowerCase();
  const initialCompare = searchParams.get('comparar') === '1';

  const [selectedUf, setSelectedUf] = useState<string>(initialUf);
  const [activeTab, setActiveTab] = useState<'resultado' | 'comparacao' | 'timeline'>(
    initialCompare ? 'comparacao' : 'resultado'
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'segundo_turno' | 'definida_1t'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Atualizar URL quando UF ou aba mudar
  const handleSelectState = (uf: string) => {
    const clean = uf.toLowerCase();
    setSelectedUf(clean);
    const params = new URLSearchParams(searchParams.toString());
    params.set('uf', clean);
    if (activeTab === 'comparacao') {
      params.set('comparar', '1');
    } else {
      params.delete('comparar');
    }
    router.replace(`/governadores?${params.toString()}`, { scroll: false });
  };

  const handleTabChange = (tab: 'resultado' | 'comparacao' | 'timeline') => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'comparacao') {
      params.set('comparar', '1');
    } else {
      params.delete('comparar');
    }
    router.replace(`/governadores?${params.toString()}`, { scroll: false });
  };

  // 1. SWR para visão geral de todos os 27 estados
  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    mutate: mutateOverview,
  } = useSWR<{
    totalStates: number;
    secondRoundCount: number;
    firstRoundDecidedCount: number;
    states: GovernorStateOverview[];
  }>('/api/eleicoes/governadores/overview', fetcher, {
    refreshInterval: 30000,
  });

  // 2. SWR para o estado selecionado (dados do resultado atual)
  const {
    data: stateResultData,
    isLoading: isLoadingState,
    mutate: mutateState,
  } = useSWR<ElectionSummary>(
    `/api/eleicoes/governador?uf=${selectedUf}`,
    fetcher,
    {
      refreshInterval: 10000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Se 2T der 502/404, não tenta indefinidamente
        if (retryCount >= 2) return;
      },
    }
  );

  // 3. SWR para comparação entre turnos do estado selecionado
  const {
    data: comparisonData,
    isLoading: isLoadingComparison,
    mutate: mutateComparison,
  } = useSWR<RoundComparison>(
    `/api/eleicoes/comparacao?cargo=governador&scope=${selectedUf}`,
    fetcher,
    { refreshInterval: 20000 }
  );

  const selectedStateMeta = useMemo(
    () => BRAZIL_STATES.find((s) => s.uf.toLowerCase() === selectedUf.toLowerCase()),
    [selectedUf]
  );

  // Estados filtrados na grade de navegação
  const filteredStates = useMemo(() => {
    if (!overviewData?.states) return [];
    return overviewData.states.filter((st) => {
      // Filtro por situação
      if (statusFilter !== 'all' && st.status !== statusFilter) {
        return false;
      }
      // Filtro por região
      if (regionFilter !== 'Todas' && st.region !== regionFilter) {
        return false;
      }
      // Busca por texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = st.name.toLowerCase().includes(q);
        const matchUf = st.uf.toLowerCase().includes(q);
        const matchLeader = st.leaderOrElected?.ballotName.toLowerCase().includes(q);
        if (!matchName && !matchUf && !matchLeader) return false;
      }
      return true;
    });
  }, [overviewData, statusFilter, regionFilter, searchQuery]);

  const formatNumber = (n: number | null | undefined) =>
    n !== null && n !== undefined ? n.toLocaleString('pt-BR') : '—';
  const formatPercent = (n: number | null | undefined) =>
    n !== null && n !== undefined
      ? n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
      : '—';

  // Identificação do status do estado selecionado a partir do overview ou comparison
  const selectedStateOverview = overviewData?.states.find(
    (s) => s.uf.toLowerCase() === selectedUf.toLowerCase()
  );
  const isDecidedInFirstRound =
    comparisonData?.statusElection === 'definida_1t' ||
    selectedStateOverview?.status === 'definida_1t';

  return (
    <div className="space-y-8">
      {/* Título e Subtítulo */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Eleições para Governador — Panorama Estadual e Comparação
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium mt-1">
              Resultados oficiais do Tribunal Superior Eleitoral (TSE) para as 27 unidades da federação.
            </p>
          </div>

          <button
            onClick={() => {
              mutateOverview();
              mutateState();
              mutateComparison();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Atualizar Dados
          </button>
        </div>
      </div>

      {/* ÁREA 1: Panorama Geral Analítico das Eleições Estaduais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Disputa no 2º Turno</span>
            <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {overviewData ? overviewData.secondRoundCount : '—'}
            </span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">estados</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Unidades da federação com segundo turno ativo.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Eleitos no 1º Turno</span>
            <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {overviewData ? overviewData.firstRoundDecidedCount : '—'}
            </span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">estados</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Governadores eleitos diretamente no 1º turno oficial.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Estado Selecionado</span>
            <span className="p-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700">
              <MapPin className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">
              {selectedStateMeta?.uf}
            </span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {selectedStateMeta?.name}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {isDecidedInFirstRound ? 'Eleição resolvida no 1º turno' : 'Disputa de 2º turno'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Totalização Geral</span>
            <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <Vote className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {formatPercent(selectedStateOverview?.percentTotalized || stateResultData?.progress.percentTotalized)}
            </span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">apurado</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            No estado em foco ({selectedStateMeta?.name}).
          </p>
        </div>
      </div>

      {/* ÁREA 2: Navegação Visual pelos Estados (Filtros, Busca e Grade de Cards) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
              Selecione um Estado da Federação
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Explore o resultado e a situação oficial da disputa para governador em cada UF.
            </p>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar estado, sigla ou líder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Filtros por Situação Eleitoral e Região */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
          {/* Filtro por Situação */}
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-gray-500 mr-1 text-[11px]">Situação:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'all'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              Todos (27)
            </button>
            <button
              onClick={() => setStatusFilter('segundo_turno')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'segundo_turno'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              2º Turno ({overviewData?.secondRoundCount ?? '—'})
            </button>
            <button
              onClick={() => setStatusFilter('definida_1t')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'definida_1t'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              1º Turno ({overviewData?.firstRoundDecidedCount ?? '—'})
            </button>
          </div>

          {/* Filtro por Região */}
          <div className="flex items-center gap-1 font-semibold overflow-x-auto py-1">
            <span className="text-gray-500 mr-1 text-[11px]">Região:</span>
            {BRAZIL_REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                  regionFilter === r
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Grade Responsiva de Cards Estaduais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-3 max-h-[380px] overflow-y-auto pr-1">
          {filteredStates.map((st) => {
            const isSelected = st.uf.toLowerCase() === selectedUf.toLowerCase();
            const is2T = st.status === 'segundo_turno';

            return (
              <button
                key={st.uf}
                onClick={() => handleSelectState(st.uf)}
                className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500 shadow-sm'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-sm text-gray-900 dark:text-white">
                      {st.uf} • {st.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        is2T
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {is2T ? '2º Turno' : 'Eleito 1ºT'}
                    </span>
                  </div>

                  {st.leaderOrElected ? (
                    <div className="text-xs">
                      <div className="font-bold text-gray-800 dark:text-gray-200 truncate">
                        {st.leaderOrElected.ballotName}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {st.leaderOrElected.party} • {formatPercent(st.leaderOrElected.percentage)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">Aguardando dados...</div>
                  )}
                </div>

                {/* Barra de Progresso de Totalização do Estado */}
                <div className="mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Totalização:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPercent(st.percentTotalized)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ÁREA 3 & 4: Detalhamento do Estado Selecionado com Abas de Navegação */}
      <div className="space-y-6">
        {/* Abas Superiores de Visualização */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3 text-xs font-bold">
          <button
            onClick={() => handleTabChange('resultado')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'resultado'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <Award className="w-4 h-4" />
            Resultado Oficial ({selectedStateMeta?.uf})
          </button>

          <button
            onClick={() => handleTabChange('comparacao')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'comparacao'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Comparação 1º x 2º Turno
          </button>

          <button
            onClick={() => handleTabChange('timeline')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Linha do Tempo (10s)
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        {activeTab === 'resultado' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-gray-900 dark:text-white">
                  Governador de {selectedStateMeta?.name} ({selectedStateMeta?.uf})
                </span>
                {isDecidedInFirstRound ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Eleito no 1º Turno Oficial
                  </span>
                ) : stateResultData?.isFinal ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Eleição Concluída
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    <Clock className="w-3.5 h-3.5" /> Apuração em Andamento
                  </span>
                )}
              </div>

              <div className="text-gray-700 dark:text-gray-300 font-medium">
                Última geração oficial:{' '}
                {stateResultData?.totalizedTime || comparisonData?.firstRound?.totalizedTime || 'N/D'}
              </div>
            </div>

            {/* Se o estado foi decidido no 1º Turno, exibir banner explicativo */}
            {isDecidedInFirstRound && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-sm">Disputa encerrada no 1º Turno</h4>
                  <p className="mt-0.5">
                    {comparisonData?.statusMessage ||
                      `O governador de ${selectedStateMeta?.name} foi eleito oficialmente no 1º turno com mais de 50% dos votos válidos. Não houve segundo turno para este cargo no estado.`}
                  </p>
                </div>
              </div>
            )}

            {/* Barra de Progresso de Totalização das Seções */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    Totalização das Seções de {selectedStateMeta?.name}
                  </span>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {formatNumber(
                      stateResultData?.progress.totalizedSections ??
                        comparisonData?.firstRound?.progress.totalizedSections
                    )}{' '}
                    de{' '}
                    {formatNumber(
                      stateResultData?.progress.totalSections ??
                        comparisonData?.firstRound?.progress.totalSections
                    )}{' '}
                    seções totalizadas
                  </p>
                </div>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatPercent(
                    stateResultData?.progress.percentTotalized ??
                      comparisonData?.firstRound?.progress.percentTotalized
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      stateResultData?.progress.percentTotalized ??
                        comparisonData?.firstRound?.progress.percentTotalized ??
                        0
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Cards de Candidatos (Do 2º turno se existir, ou do 1º turno se definido no 1º) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {(stateResultData?.candidates ?? comparisonData?.firstRound?.candidates ?? []).map(
                (cand, idx) => (
                  <div
                    key={cand.number}
                    className={`p-6 rounded-xl border relative ${
                      cand.isElected || idx === 0
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
                )
              )}
            </div>
          </div>
        )}

        {/* Aba Comparação 1º x 2º Turno */}
        {activeTab === 'comparacao' && (
          <div>
            {isLoadingComparison ? (
              <div className="p-8 text-center text-xs text-gray-500">
                Processando comparação oficial entre 1º e 2º turno para {selectedStateMeta?.name}...
              </div>
            ) : comparisonData ? (
              <TurnComparisonSection
                comparison={comparisonData}
                title={`Governador de ${selectedStateMeta?.name} — Comparação entre 1º e 2º Turno`}
              />
            ) : (
              <div className="p-6 rounded-xl bg-amber-50 text-amber-800 text-xs">
                Dados de comparação indisponíveis para este estado.
              </div>
            )}
          </div>
        )}

        {/* Aba Linha do Tempo da Apuração a cada 10 segundos */}
        {activeTab === 'timeline' && (
          <ElectionTimelineSection
            role="governador"
            scope={selectedUf}
            scopeName={`Governador de ${selectedStateMeta?.name}`}
            round={isDecidedInFirstRound ? 1 : 2}
          />
        )}
      </div>
    </div>
  );
}

export default function GovernadoresPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs font-semibold text-gray-500">
          Carregando painel de governadores...
        </div>
      }
    >
      <GovernadoresContent />
    </Suspense>
  );
}
