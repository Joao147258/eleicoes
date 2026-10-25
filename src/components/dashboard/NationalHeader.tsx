import React from 'react';
import { ElectionSummary } from '@/modules/elections/domain/models';
import { CheckCircle, Clock, AlertTriangle, UserCheck } from 'lucide-react';

interface NationalHeaderProps {
  data: ElectionSummary;
}

export default function NationalHeader({ data }: NationalHeaderProps) {
  const candA = data.candidates[0];
  const candB = data.candidates[1];

  const formatNumber = (num: number) => num.toLocaleString('pt-BR');
  const formatPercent = (val: number) =>
    val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';

  const isFinal = data.isFinal;
  const progressPercent = data.progress.percentTotalized;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
      {/* Barra de Status e Horário */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 text-xs">
        <div className="flex items-center gap-2">
          {isFinal ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5" /> Apuração Concluída (100%)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 animate-pulse">
              <Clock className="w-3.5 h-3.5" /> Apuração em Andamento
            </span>
          )}

          <span className="text-gray-700 dark:text-gray-300">
            {data.roleDescription} • 2º Turno Oficial
          </span>
        </div>

        <div className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Última atualização TSE: <strong>{data.totalizedDate} às {data.totalizedTime}</strong></span>
        </div>
      </div>

      {/* Barra de Progresso Nacional */}
      <div className="py-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              Totalização Nacional das Seções
            </span>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {formatNumber(data.progress.totalizedSections)} de {formatNumber(data.progress.totalSections)} seções totalizadas
            </p>
          </div>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatPercent(progressPercent)}
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>

      {/* Cards dos Candidatos */}
      {candA && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {/* Candidato Líder / Primeiro */}
          <div
            className={`rounded-xl p-5 border relative overflow-hidden transition-all ${
              candA.isElected
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700'
                : 'bg-gray-50/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }`}
          >
            {candA.isElected && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                <UserCheck className="w-3 h-3" /> ELEITO
              </div>
            )}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {candA.party} • Nº {candA.number}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1.5">
                  {candA.ballotName}
                </h2>
                {candA.viceCandidate && (
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 font-medium">
                    Vice: {candA.viceCandidate.ballotName} ({candA.viceCandidate.party})
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white block leading-none">
                  {formatPercent(candA.percentage)}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300 mt-1 block font-medium">
                  {formatNumber(candA.votes)} votos
                </span>
              </div>
            </div>
            {data.leader && data.leader.candidate.number === candA.number && !data.leader.isTie && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs flex justify-between text-emerald-800 dark:text-emerald-300 font-semibold">
                <span>Vantagem na liderança:</span>
                <span>+{formatNumber(data.leader.voteMargin)} votos ({formatPercent(data.leader.percentageMargin)})</span>
              </div>
            )}
          </div>

          {/* Segundo Candidato */}
          {candB && (
            <div
              className={`rounded-xl p-5 border relative overflow-hidden transition-all ${
                candB.isElected
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700'
                  : 'bg-gray-50/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              }`}
            >
              {candB.isElected && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                  <UserCheck className="w-3 h-3" /> ELEITO
                </div>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {candB.party} • Nº {candB.number}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1.5">
                    {candB.ballotName}
                  </h2>
                  {candB.viceCandidate && (
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 font-medium">
                      Vice: {candB.viceCandidate.ballotName} ({candB.viceCandidate.party})
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white block leading-none">
                    {formatPercent(candB.percentage)}
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 mt-1 block font-medium">
                    {formatNumber(candB.votes)} votos
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs flex justify-between text-gray-700 dark:text-gray-300 font-medium">
                <span>Diferença para o 1º:</span>
                <span>
                  {data.leader
                    ? `-${formatNumber(data.leader.voteMargin)} votos (${formatPercent(data.leader.percentageMargin)})`
                    : '—'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resumo de Votação: Válidos, Brancos, Nulos, Comparecimento e Abstenção */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs">
        <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
          <span className="text-gray-700 dark:text-gray-300 block font-medium">Votos Válidos</span>
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {formatNumber(data.votes.validVotes)}
          </span>
          <span className="text-[11px] text-gray-700 dark:text-gray-300 block font-medium">
            ({formatPercent(data.votes.percentValid)})
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
          <span className="text-gray-700 dark:text-gray-300 block font-medium">Brancos e Nulos</span>
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {formatNumber(data.votes.blankVotes + data.votes.nullVotes)}
          </span>
          <span className="text-[11px] text-gray-700 dark:text-gray-300 block font-medium">
            Brancos: {formatPercent(data.votes.percentBlank)} • Nulos: {formatPercent(data.votes.percentNull)}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
          <span className="text-gray-700 dark:text-gray-300 block font-medium">Comparecimento</span>
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {formatNumber(data.voters.turnout)}
          </span>
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block font-semibold">
            {formatPercent(data.voters.percentTurnout)} do eleitorado
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
          <span className="text-gray-700 dark:text-gray-300 block font-medium">Abstenção</span>
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {formatNumber(data.voters.abstention)}
          </span>
          <span className="text-[11px] text-amber-800 dark:text-amber-300 block font-semibold">
            {formatPercent(data.voters.percentAbstention)} do eleitorado
          </span>
        </div>
      </div>
    </div>
  );
}
