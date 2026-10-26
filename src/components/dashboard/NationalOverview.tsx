'use client';

import React from 'react';
import { ElectionSummary } from '@/modules/elections/domain/models';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  TrendingUp,
  Vote,
  ShieldCheck,
  Users,
  Award,
} from 'lucide-react';

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

  const isFinal = data.isFinal;
  const isElectionDefined = data.resultStatus === 'eleito_definido' || !!data.electedCandidate;
  const elected = data.electedCandidate || (isElectionDefined ? candA : null);

  const totalSections = data.progress.totalSections;
  const totalizedSections = data.progress.totalizedSections;
  const remainingSections = Math.max(0, totalSections - totalizedSections);
  const percentTotalized = data.progress.percentTotalized;
  const percentRemaining = totalSections > 0 ? Math.max(0, 100 - percentTotalized) : 0;

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
      {/* Título de Seção com Transição de Apuração para Resultado Oficial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2
            id="national-overview-title"
            className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight"
          >
            {isElectionDefined
              ? 'Eleições 2026 — Resultado do Segundo Turno'
              : 'Panorama Nacional da Apuração'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            {isElectionDefined
              ? 'Resultado oficial consolidado pela Justiça Eleitoral para a Presidência da República.'
              : 'Resultado da apuração presidencial oficial em todo o território nacional e seções do exterior.'}
          </p>
        </div>

        {/* Badge de Situação da Disputa */}
        {isElectionDefined ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Resultado Oficial Definido pelo TSE</span>
          </div>
        ) : data.leader && !data.leader.isTie ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold self-start sm:self-auto">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Liderança Parcial em Andamento</span>
          </div>
        ) : null}
      </div>

      {/* Card de Proclamação Histórica do Eleito quando a Eleição estiver Oficialmente Definida */}
      {isElectionDefined && elected && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-transparent border border-emerald-300 dark:border-emerald-800/80 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Award className="w-4 h-4 text-emerald-600" />
              Proclamação Oficial da Justiça Eleitoral
            </span>
            <span>
              Definição atestada pelo TSE em 25/10/2026, às 21h08
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
                Presidente reeleito — {elected.ballotName}
              </h3>
              {elected.viceCandidate && (
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">
                  Vice-presidente eleito: <strong className="text-gray-900 dark:text-white">{elected.viceCandidate.ballotName}</strong> ({elected.viceCandidate.party}) • Partido: {elected.party}
                </p>
              )}
            </div>

            <div className="text-left md:text-right">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 block">
                {formatPercent(elected.percentage)}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-bold block mt-0.5">
                {formatNumber(elected.votes)} votos válidos oficiais
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid Principal: Esquerda = Status da Apuração | Direita = Resultado Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* COLUNA ESQUERDA: Painel de Status da Apuração (5 colunas) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Cabeçalho do Painel */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Vote className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black text-gray-900 dark:text-white tracking-tight">
                  Status da Apuração
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {isFinal
                  ? 'Totalização integral das seções concluída pela Justiça Eleitoral.'
                  : 'Acompanhe o avanço da totalização das seções e a situação geral da apuração.'}
              </p>
            </div>

            {/* Badge de Situação Oficial */}
            <div className="flex-shrink-0">
              {isFinal || percentTotalized >= 100 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Totalizada (100%)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Em Andamento
                </span>
              )}
            </div>
          </div>

          {/* Destaque Principal: Totalização das Seções */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Seções Totalizadas
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatPercent(percentTotalized)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  {formatNumber(totalizedSections)}
                </span>
                <span className="text-[11px] text-gray-500 block">
                  de {formatNumber(totalSections)} seções
                </span>
              </div>
            </div>

            {/* Barra de Progresso com contraste visual */}
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, percentTotalized)}%` }}
                title={`Totalizadas: ${formatPercent(percentTotalized)}`}
              />
              <div
                className="bg-amber-200 dark:bg-amber-900/40 h-full transition-all duration-500"
                style={{ width: `${Math.max(0, percentRemaining)}%` }}
                title={`Faltando: ${formatPercent(percentRemaining)}`}
              />
            </div>

            {/* Linha de Seções Faltando (Explícito) */}
            <div className="flex items-center justify-between text-xs pt-1 text-gray-600 dark:text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Seções faltando apurar:
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatNumber(remainingSections)}{' '}
                <span className="text-gray-500 font-normal">({formatPercent(percentRemaining)})</span>
              </span>
            </div>
          </div>

          {/* Mini-Cards com Métricas de Participação e Votos */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Votos Válidos */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800/80">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Votos Válidos
              </span>
              <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-0.5">
                {formatNumber(data.votes.validVotes)}
              </div>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block">
                {formatPercent(data.votes.percentValid)} dos votos
              </span>
            </div>

            {/* Comparecimento */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800/80">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Comparecimento
              </span>
              <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-0.5">
                {formatNumber(data.voters.turnout)}
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                {formatPercent(data.voters.percentTurnout)} dos eleitores
              </span>
            </div>

            {/* Abstenção */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800/80">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Abstenção
              </span>
              <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-0.5">
                {formatNumber(data.voters.abstention)}
              </div>
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">
                {formatPercent(data.voters.percentAbstention)} dos eleitores
              </span>
            </div>

            {/* Brancos e Nulos */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800/80">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Brancos & Nulos
              </span>
              <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                B: {formatNumber(data.votes.blankVotes)}{' '}
                <span className="text-[10px] text-gray-500">({formatPercent(data.votes.percentBlank)})</span>
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                N: {formatNumber(data.votes.nullVotes)}{' '}
                <span className="text-[10px] text-gray-500">({formatPercent(data.votes.percentNull)})</span>
              </div>
            </div>
          </div>

          {/* Nota Metodológica Sucinta */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            * <strong>Percentual apurado</strong> indica as seções totalizadas pelo TSE. Os percentuais dos candidatos são calculados exclusivamente sobre os <strong>votos válidos</strong>.
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUNA DIREITA: Resultado Principal da Eleição (7 colunas) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Cards dos Dois Candidatos */}
          {candA && candB && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card Candidato A */}
              <div
                className={`rounded-2xl p-6 border relative overflow-hidden transition-all shadow-sm flex flex-col justify-between ${accentA?.bg} ${accentA?.border}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${accentA?.badge}`}>
                      {candA.party} • Nº {candA.number}
                    </span>

                    {candA.isElected || isElectionDefined ? (
                      <span className="flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                        <UserCheck className="w-3.5 h-3.5" /> REELEITO OFICIAL
                      </span>
                    ) : !isFinal ? (
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-700/60">
                        Liderança Parcial
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                    {candA.ballotName}
                  </h3>
                  {candA.viceCandidate && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 font-medium">
                      Vice: <span className="font-semibold">{candA.viceCandidate.ballotName}</span> ({candA.viceCandidate.party})
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200/60 dark:border-gray-800/80">
                  <span className={`text-4xl sm:text-5xl font-black tracking-tight block ${accentA?.text}`}>
                    {formatPercent(candA.percentage)}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-bold block mt-0.5">
                    {formatNumber(candA.votes)} votos apurados
                  </span>

                  {/* Vantagem da liderança */}
                  {data.leader && !data.leader.isTie && (
                    <div className="mt-3 pt-2 border-t border-gray-200/40 dark:border-gray-800/50 flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-600 dark:text-gray-400 text-[11px]">Vantagem:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                        +{formatNumber(data.leader.voteMargin)} ({formatPp(data.leader.percentageMargin)})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Candidato B */}
              <div
                className={`rounded-2xl p-6 border relative overflow-hidden transition-all shadow-sm flex flex-col justify-between ${accentB?.bg} ${accentB?.border}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${accentB?.badge}`}>
                      {candB.party} • Nº {candB.number}
                    </span>

                    {candB.isElected && (
                      <span className="flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                        <UserCheck className="w-3.5 h-3.5" /> ELEITO
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                    {candB.ballotName}
                  </h3>
                  {candB.viceCandidate && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 font-medium">
                      Vice: <span className="font-semibold">{candB.viceCandidate.ballotName}</span> ({candB.viceCandidate.party})
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200/60 dark:border-gray-800/80">
                  <span className={`text-4xl sm:text-5xl font-black tracking-tight block ${accentB?.text}`}>
                    {formatPercent(candB.percentage)}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-bold block mt-0.5">
                    {formatNumber(candB.votes)} votos apurados
                  </span>

                  {/* Diferença para o líder */}
                  {data.leader && !data.leader.isTie && (
                    <div className="mt-3 pt-2 border-t border-gray-200/40 dark:border-gray-800/50 flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-600 dark:text-gray-400 text-[11px]">Diferença:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-bold text-[11px]">
                        -{formatNumber(data.leader.voteMargin)} ({formatPp(data.leader.percentageMargin)})
                      </span>
                    </div>
                  )}
                </div>
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

              <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center pt-1 font-medium">
                {isElectionDefined
                  ? '* Dados oficiais consolidados pelo Tribunal Superior Eleitoral (TSE).'
                  : '* A liderança momentânea indica apenas a apuração parcial e não equivale a resultado oficial definitivo.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
