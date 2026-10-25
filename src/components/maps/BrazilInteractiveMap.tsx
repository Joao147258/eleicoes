'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAZIL_STATES, BrazilStateInfo } from '@/data/geography/brazil-states';
import { StateSummaryOverview } from '@/modules/elections/domain/models';
import {
  MapPin,
  ArrowRight,
  X,
  Clock,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface BrazilInteractiveMapProps {
  statesData: StateSummaryOverview[];
  selectedUf: string | null;
  onSelectState: (uf: string) => void;
  onClearSelection: () => void;
}

export default function BrazilInteractiveMap({
  statesData,
  selectedUf,
  onSelectState,
  onClearSelection,
}: BrazilInteractiveMapProps) {
  // Hover temporário (não substitui a seleção persistente)
  const [hoveredState, setHoveredState] = useState<BrazilStateInfo | null>(null);

  // Mapeia os dados por UF
  const dataByUf = new Map<string, StateSummaryOverview>(
    statesData.map((s) => [s.uf.toUpperCase(), s])
  );

  // Determina a cor de preenchimento de cada estado
  const getStateFill = (uf: string) => {
    const data = dataByUf.get(uf.toUpperCase());
    if (!data || data.percentTotalized === 0 || !data.leaderNumber) {
      return '#cbd5e1'; // Cinza claro (sem dados ou 0%)
    }
    if (data.leaderNumber === '22') {
      return '#3b82f6'; // Azul PL
    }
    if (data.leaderNumber === '13') {
      return '#ef4444'; // Vermelho PT
    }
    return '#10b981'; // Verde padrão
  };

  // O estado ativo para exibição no painel lateral é o SELECIONADO.
  // Se nenhum estiver selecionado, exibe a visão geral de resumo.
  const activeSelectedState = selectedUf
    ? BRAZIL_STATES.find((s) => s.uf.toUpperCase() === selectedUf.toUpperCase()) ?? null
    : null;

  const activeSelectedData = activeSelectedState
    ? dataByUf.get(activeSelectedState.uf.toUpperCase()) ?? null
    : null;

  // Dados para tooltip flutuante do hover temporário
  const hoveredData = hoveredState ? dataByUf.get(hoveredState.uf.toUpperCase()) ?? null : null;

  const formatNumber = (num?: number | null) => (num ?? 0).toLocaleString('pt-BR');
  const formatPercent = (val?: number | null) =>
    (val ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  const formatPp = (val?: number | null) =>
    (val ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' pp';

  return (
    <section aria-labelledby="map-section-title" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-7 shadow-sm">
      {/* Cabeçalho da Seção do Mapa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 id="map-section-title" className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Mapa Interativo da Votação por Estado
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            Clique em qualquer UF para fixar a seleção e acompanhar a apuração detalhada no painel lateral.
          </p>
        </div>

        {/* Legenda de Cores do Mapa */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-blue-500 shadow-sm" />
            <span className="text-gray-800 dark:text-gray-200">PL (22)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-red-500 shadow-sm" />
            <span className="text-gray-800 dark:text-gray-200">PT (13)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-300 dark:bg-slate-700 shadow-sm" />
            <span className="text-gray-500 dark:text-gray-400">Sem dados</span>
          </div>

          {selectedUf && (
            <button
              onClick={onClearSelection}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold transition"
            >
              <X className="w-3.5 h-3.5" /> Limpar seleção
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG do Mapa Vetorial (7 colunas no desktop) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative bg-gradient-to-b from-gray-50/70 to-gray-100/40 dark:from-gray-950/40 dark:to-gray-900/60 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-800">
          <svg
            viewBox="0 0 600 620"
            className="w-full max-w-lg h-auto select-none"
            role="region"
            aria-label="Mapa Eleitoral do Brasil interativo"
          >
            {BRAZIL_STATES.map((state) => {
              const isSelected = selectedUf?.toUpperCase() === state.uf;
              const isHovered = hoveredState?.uf === state.uf;
              const fillColor = getStateFill(state.uf);

              return (
                <g
                  key={state.uf}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`Estado ${state.name}, sigla ${state.uf}${
                    isSelected ? ', atualmente selecionado' : ''
                  }`}
                  onClick={() => onSelectState(state.uf.toLowerCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectState(state.uf.toLowerCase());
                    }
                  }}
                  className="outline-none focus:outline-none cursor-pointer"
                >
                  <path
                    d={state.svgPath}
                    fill={fillColor}
                    stroke={
                      isSelected
                        ? '#059669' // Emerald forte para o estado selecionado
                        : isHovered
                        ? '#0f172a'
                        : '#ffffff'
                    }
                    strokeWidth={isSelected ? 4 : isHovered ? 2.5 : 1}
                    filter={isSelected ? 'drop-shadow(0px 4px 6px rgba(16, 185, 129, 0.4))' : undefined}
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'opacity-100 ring-2 ring-emerald-500'
                        : isHovered
                        ? 'opacity-95'
                        : 'hover:opacity-90'
                    }`}
                    onMouseEnter={() => setHoveredState(state)}
                    onMouseLeave={() => setHoveredState(null)}
                  />

                  {/* Sigla do estado */}
                  <text
                    x={state.centroid.x}
                    y={state.centroid.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={isSelected ? '#ffffff' : isHovered ? '#0f172a' : '#ffffff'}
                    fontSize="11"
                    fontWeight="900"
                    className="pointer-events-none drop-shadow select-none"
                  >
                    {state.uf}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip flutuante de hover temporário no rodapé do mapa */}
          {hoveredState && hoveredData && (
            <div className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 bg-gray-900/95 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-gray-700 backdrop-blur pointer-events-none flex items-center justify-between gap-3 animate-fade-in">
              <span className="font-extrabold text-emerald-400">
                {hoveredState.name} ({hoveredState.uf})
              </span>
              <span>
                Apuração: <strong>{hoveredData.percentTotalized.toFixed(1)}%</strong>
              </span>
              {hoveredData.leaderName && (
                <span>
                  Líder: <strong>{hoveredData.leaderName.split(' ')[0]}</strong> ({hoveredData.leaderPercentage?.toFixed(1)}%)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Painel Lateral de Detalhes (5 colunas no desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-between min-h-[440px] bg-gray-50/90 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          {activeSelectedState && activeSelectedData ? (
            /* Cenário 1: Estado SELECIONADO com dados */
            <div className="space-y-5">
              {/* Topo do painel do estado selecionado */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-600 text-white shadow-sm">
                      {activeSelectedState.uf}
                    </span>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                      Região {activeSelectedState.region} • Capital: {activeSelectedState.capital}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                    {activeSelectedState.name}
                  </h3>
                </div>

                <button
                  onClick={onClearSelection}
                  title="Fechar e limpar seleção"
                  aria-label="Limpar seleção de estado"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status e Totalização do Estado */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                  <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    {activeSelectedData.isFinal ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    {activeSelectedData.isFinal ? 'Totalização 100% Concluída' : 'Totalização Estadual em Andamento'}
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
                    {formatPercent(activeSelectedData.percentTotalized)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${activeSelectedData.percentTotalized}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  {formatNumber(activeSelectedData.totalizedSections)} de {formatNumber(activeSelectedData.totalSections)} seções computadas
                </p>
              </div>

              {/* Votação dos Candidatos no Estado */}
              {activeSelectedData.percentTotalized > 0 && activeSelectedData.leaderName ? (
                <div className="space-y-3">
                  {/* Líder no Estado */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <span className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider block">
                      Liderança Estadual
                    </span>
                    <div className="flex justify-between items-baseline mt-1">
                      <span className="text-base font-extrabold text-gray-950 dark:text-white">
                        {activeSelectedData.leaderName}
                      </span>
                      <span className="text-lg font-black text-gray-950 dark:text-white">
                        {formatPercent(activeSelectedData.leaderPercentage)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5 font-medium">
                      {formatNumber(activeSelectedData.leaderVotes)} votos computados
                    </span>
                  </div>

                  {/* 2º Colocado no Estado */}
                  {activeSelectedData.runnerUpName && (
                    <div className="p-3.5 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <span className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider block">
                        2º Colocado Estadual
                      </span>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-base font-bold text-gray-800 dark:text-gray-200">
                          {activeSelectedData.runnerUpName}
                        </span>
                        <span className="text-lg font-extrabold text-gray-800 dark:text-gray-200">
                          {formatPercent(activeSelectedData.runnerUpPercentage)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5 font-medium">
                        {formatNumber(activeSelectedData.runnerUpVotes)} votos computados
                      </span>
                    </div>
                  )}

                  {/* Diferença de Votos na UF */}
                  {activeSelectedData.voteMargin !== null && activeSelectedData.voteMargin !== undefined && (
                    <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-700 dark:text-gray-300">Diferença de Votos:</span>
                      <span className="text-emerald-800 dark:text-emerald-300 font-extrabold">
                        +{formatNumber(activeSelectedData.voteMargin)} ({formatPp(activeSelectedData.percentageMargin)})
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-500">
                  Aguardando início da totalização das seções desta unidade federativa.
                </div>
              )}

              {/* Ação para ver página completa */}
              <div className="pt-2 flex items-center justify-between">
                <Link
                  href={`/estados/${activeSelectedState.uf.toLowerCase()}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                >
                  <span>Ver Detalhes Completos de {activeSelectedState.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Cenário 2: NENHUM estado selecionado (Visão Geral das 27 UFs) */
            <div className="space-y-5">
              <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Panorama Geral
                </span>
                <h3 className="text-xl font-black text-gray-950 dark:text-white mt-0.5">
                  Resumo das 27 Unidades Federativas
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Selecione um estado no mapa ou na tabela para fixar a consulta.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white block">
                        Total de UFs Monitoradas
                      </span>
                      <span className="text-[11px] text-gray-500">26 estados e o Distrito Federal</span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-gray-900 dark:text-white">27</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white block">
                        UFs com Totalização Ativa
                      </span>
                      <span className="text-[11px] text-gray-500">Seções sendo computadas</span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-emerald-600">
                    {statesData.filter((s) => s.percentTotalized > 0).length} / 27
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-100/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 space-y-1.5 font-medium">
                <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                  <HelpCircle className="w-4 h-4 text-emerald-500" /> Como explorar?
                </div>
                <p className="text-[11px] leading-relaxed">
                  Clique diretamente em qualquer estado no mapa vetorial ou nas linhas da tabela comparativa abaixo para manter a UF selecionada na URL e ver os números locais em tempo real.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
