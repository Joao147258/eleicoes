'use client';

import React from 'react';
import { ElectionSummary } from '@/modules/elections/domain/models';
import { CheckCircle2, AlertCircle, UserCheck, TrendingUp, HelpCircle } from 'lucide-react';

interface NationalOverviewProps {
  data: ElectionSummary;
}

export default function NationalOverview({ data }: NationalOverviewProps) {
  const candA = data.candidates[0];
  const candB = data.candidates[1];

  const formatNumber = (num: number) => num.toLocaleString('pt-BR');
  const formatPercent = (val: number) =>
    val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  const formatPp = (val: number) =>
    val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' pp';

  const progressPercent = data.progress.percentTotalized;
  const isFinal = data.isFinal;

  // Cor representativa por candidato
  const getCandidateAccent = (num: string) => {
    if (num === '22') {
      return {
        border: 'border-blue-500/40 dark:border-blue-500/50',
        bg: 'bg-blue-50/50 dark:bg-blue-950/20',
        bar: 'bg-blue-600',
        badge: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200',
        text: 'text-blue-700 dark:text-blue-400',
      };
    }
    if (num === '13') {
      return {
        border: 'border-red-500/40 dark:border-red-500/50',
        bg: 'bg-red-50/50 dark:bg-red-950/20',
        bar: 'bg-red-600',
        badge: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200',
        text: 'text-red-700 dark:text-red-400',
      };
    }
    return {
      border: 'border-emerald-500/40 dark:border-emerald-500/50',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      bar: 'bg-emerald-600',
      badge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
      text: 'text-emerald-700 dark:text-emerald-400',
    };
  };

  const accentA = candA ? getCandidateAccent(candA.number) : null;
  const accentB = candB ? getCandidateAccent(candB.number) : null;

  return (
    <section aria-labelledby="national-overview-title" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="national-overview-title" className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Panorama Nacional
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            Resultado da apuração presidencial em todo o território nacional e votos do exterior.
          </p>
        </div>

        {/* Tag informativa de Liderança Parcial */}
        {!isFinal && data.leader && !data.leader.isTie && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Liderança Parcial em Andamento</span>
          </div>
        )}
      </div>

      {/* Cards Comparativos dos Candidatos */}
      {candA && candB && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Card Candidato A (Líder / 1º Lugar) */}
          <div
            className={`rounded-2xl p-6 sm:p-7 border relative overflow-hidden transition-all shadow-sm ${accentA?.bg} ${accentA?.border}`}
          >
            {/* Badge de Eleito ou Liderança Parcial */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${accentA?.badge}`}>
                {candA.party} • Nº {candA.number}
              </span>

              {candA.isElected ? (
                <span className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                  <UserCheck className="w-3.5 h-3.5" /> ELEITO DEFINITIVO
                </span>
              ) : !isFinal ? (
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-700/60">
                  Liderança Parcial
                </span>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
                  {candA.ballotName}
                </h3>
                {candA.viceCandidate && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                    Vice: <span className="font-semibold">{candA.viceCandidate.ballotName}</span> ({candA.viceCandidate.party})
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right">
                <span className={`text-4xl sm:text-5xl font-black tracking-tight block ${accentA?.text}`}>
                  {formatPercent(candA.percentage)}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-bold block mt-0.5">
                  {formatNumber(candA.votes)} votos apurados
                </span>
              </div>
            </div>

            {/* Vantagem da liderança */}
            {data.leader && !data.leader.isTie && (
              <div className="mt-5 pt-4 border-t border-gray-200/60 dark:border-gray-800/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">Vantagem sobre o 2º colocado:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-black">
                  +{formatNumber(data.leader.voteMargin)} votos ({formatPp(data.leader.percentageMargin)})
                </span>
              </div>
            )}
          </div>

          {/* Card Candidato B (2º Lugar) */}
          <div
            className={`rounded-2xl p-6 sm:p-7 border relative overflow-hidden transition-all shadow-sm ${accentB?.bg} ${accentB?.border}`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${accentB?.badge}`}>
                {candB.party} • Nº {candB.number}
              </span>

              {candB.isElected && (
                <span className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                  <UserCheck className="w-3.5 h-3.5" /> ELEITO DEFINITIVO
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
                  {candB.ballotName}
                </h3>
                {candB.viceCandidate && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                    Vice: <span className="font-semibold">{candB.viceCandidate.ballotName}</span> ({candB.viceCandidate.party})
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right">
                <span className={`text-4xl sm:text-5xl font-black tracking-tight block ${accentB?.text}`}>
                  {formatPercent(candB.percentage)}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-bold block mt-0.5">
                  {formatNumber(candB.votes)} votos apurados
                </span>
              </div>
            </div>

            {/* Diferença para o líder */}
            {data.leader && !data.leader.isTie && (
              <div className="mt-5 pt-4 border-t border-gray-200/60 dark:border-gray-800/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">Diferença para o 1º colocado:</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">
                  -{formatNumber(data.leader.voteMargin)} votos ({formatPp(data.leader.percentageMargin)})
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barra Proporcional de Confronto entre Candidatos */}
      {candA && candB && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${accentA?.bar}`} />
              {candA.ballotName} ({formatPercent(candA.percentage)})
            </span>
            <span className="text-[11px] font-normal text-gray-500">Distribuição dos Votos Válidos</span>
            <span className="flex items-center gap-1.5">
              {candB.ballotName} ({formatPercent(candB.percentage)})
              <span className={`w-3 h-3 rounded-full ${accentB?.bar}`} />
            </span>
          </div>

          <div className="w-full bg-gray-100 dark:bg-gray-800 h-4 rounded-full overflow-hidden flex shadow-inner">
            <div
              className={`${accentA?.bar} h-full transition-all duration-700`}
              style={{ width: `${candA.percentage}%` }}
              title={`${candA.ballotName}: ${formatPercent(candA.percentage)}`}
            />
            <div
              className={`${accentB?.bar} h-full transition-all duration-700`}
              style={{ width: `${candB.percentage}%` }}
              title={`${candB.ballotName}: ${formatPercent(candB.percentage)}`}
            />
          </div>

          {!isFinal && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center pt-1 font-medium">
              * A apuração está em andamento. A liderança momentânea indica apenas a contagem parcial e não equivale a eleição concluída.
            </p>
          )}
        </div>
      )}

      {/* Indicadores Principais de Totalização e Participação */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Seções Totalizadas */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
            <span>Seções Totalizadas</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatPercent(progressPercent)}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
            {formatNumber(data.progress.totalizedSections)}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            de {formatNumber(data.progress.totalSections)} seções no país
          </p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Votos Válidos */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
            <span>Votos Válidos</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {formatPercent(data.votes.percentValid)}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
            {formatNumber(data.votes.validVotes)}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            base de cálculo dos percentuais dos candidatos
          </p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-blue-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, data.votes.percentValid)}%` }}
            />
          </div>
        </div>

        {/* Card 3: Comparecimento */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
            <span>Comparecimento</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {formatPercent(data.voters.percentTurnout)}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
            {formatNumber(data.voters.turnout)}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            eleitores que compareceram às urnas
          </p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-emerald-600 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, data.voters.percentTurnout)}%` }}
            />
          </div>
        </div>

        {/* Card 4: Abstenção */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
            <span>Abstenção</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {formatPercent(data.voters.percentAbstention)}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
            {formatNumber(data.voters.abstention)}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            eleitores que não compareceram
          </p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, data.voters.percentAbstention)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Resumo Secundário Compacto: Brancos, Nulos e Total de Votos */}
      <div className="bg-gray-50/90 dark:bg-gray-950/40 border border-gray-200/80 dark:border-gray-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Votos em Branco: </span>
            <strong className="text-gray-900 dark:text-white">{formatNumber(data.votes.blankVotes)}</strong>
            <span className="text-gray-500 dark:text-gray-400 ml-1">({formatPercent(data.votes.percentBlank)})</span>
          </div>

          <div>
            <span className="text-gray-500 dark:text-gray-400">Votos Nulos: </span>
            <strong className="text-gray-900 dark:text-white">{formatNumber(data.votes.nullVotes)}</strong>
            <span className="text-gray-500 dark:text-gray-400 ml-1">({formatPercent(data.votes.percentNull)})</span>
          </div>

          <div>
            <span className="text-gray-500 dark:text-gray-400">Total de Votos Apurados: </span>
            <strong className="text-gray-900 dark:text-white">{formatNumber(data.votes.totalVotes)}</strong>
          </div>
        </div>

        <div className="text-[11px] text-gray-500 dark:text-gray-400 italic">
          Brancos e nulos não são considerados votos válidos para o cálculo dos percentuais.
        </div>
      </div>
    </section>
  );
}
