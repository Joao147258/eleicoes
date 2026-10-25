'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { RoundComparison, CandidateComparisonItem } from '@/modules/elections/domain/models';
import {
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  Vote,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';

interface TurnComparisonSectionProps {
  comparison: RoundComparison;
  title?: string;
}

export function TurnComparisonSection({
  comparison,
  title = 'Comparação Oficial entre 1º e 2º Turno',
}: TurnComparisonSectionProps) {
  const [showAllFirstRound, setShowAllFirstRound] = useState<boolean>(false);

  const formatNumber = (n: number | null | undefined) =>
    n !== null && n !== undefined ? n.toLocaleString('pt-BR') : '—';

  const formatPercent = (n: number | null | undefined) =>
    n !== null && n !== undefined
      ? n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
      : '—';

  const { firstRound, secondRound, candidates, statusElection, statusMessage, votersComparison } =
    comparison;

  // Filtrar candidatos para exibição principal: candidatos com votos no 2T sempre aparecem
  const mainCandidates = candidates.filter((c) => c.votes2T !== null);
  const otherFirstRoundCandidates = candidates.filter((c) => c.votes2T === null);

  const displayedCandidates = showAllFirstRound
    ? candidates
    : mainCandidates.length > 0
    ? mainCandidates
    : candidates.slice(0, 5);

  // Dados para o gráfico de barras agrupadas
  const barChartData = (mainCandidates.length > 0 ? mainCandidates : candidates.slice(0, 4)).map(
    (c) => ({
      name: c.ballotName,
      '1º Turno': c.votes1T || 0,
      '2º Turno': c.votes2T || 0,
    })
  );

  // Status de totalização dos turnos
  const is1TFinal = firstRound?.isFinal ?? false;
  const is2TFinal = secondRound?.isFinal ?? false;
  const isPartialComparison = secondRound && !is2TFinal && is1TFinal;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
            {comparison.roleDescription} • {comparison.scopeName} • Comparativo direto de votos e evolução percentual.
          </p>
        </div>

        {/* Badge do Status Oficial */}
        <div className="self-start sm:self-auto">
          {statusElection === 'definida_1t' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Eleição Definida no 1º Turno
            </span>
          ) : statusElection === 'segundo_turno' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              <Clock className="w-4 h-4 text-blue-600" />
              Disputa Oficial de 2º Turno
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {statusMessage || 'Situação em Processamento'}
            </span>
          )}
        </div>
      </div>

      {/* Alerta de Apuração Parcial vs Final */}
      {isPartialComparison && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-3">
          <Clock className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <p>
            <strong>Atenção:</strong> O 1º Turno está 100% totalizado, enquanto o 2º Turno encontra-se em apuração parcial (
            {formatPercent(secondRound?.progress.percentTotalized)} das seções apuradas). Os valores do 2º turno serão recalculados continuamente a cada parcial oficial transmitida pelo TSE.
          </p>
        </div>
      )}

      {/* Gráfico Comparativo de Barras Agrupadas */}
      {barChartData.length > 0 && secondRound && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
            Comparativo Direto de Votos Válidos (1º Turno vs 2º Turno)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => Number(val).toLocaleString('pt-BR')}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(75, 85, 99, 0.4)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: number | string, name: string) => [
                    `${Number(val).toLocaleString('pt-BR')} votos`,
                    name,
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Bar dataKey="1º Turno" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="2º Turno" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabela Comparativa de Candidatos */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 font-bold uppercase text-[11px] tracking-wider border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="py-3 px-4">Candidato</th>
              <th className="py-3 px-3 text-right">Votos 1º T</th>
              <th className="py-3 px-3 text-right">% 1º T</th>
              <th className="py-3 px-3 text-right">Votos 2º T</th>
              <th className="py-3 px-3 text-right">% 2º T</th>
              <th className="py-3 px-3 text-right">Variação Votos</th>
              <th className="py-3 px-3 text-right">Variação pp</th>
              <th className="py-3 px-4 text-center">Situação Oficial</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-800 dark:text-gray-200">
            {displayedCandidates.map((cand) => {
              const diffVotes = cand.voteDiff;
              const diffPct = cand.percentageDiff;

              return (
                <tr
                  key={cand.number}
                  className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {cand.ballotName}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      {cand.party} • Nº {cand.number}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-medium">
                    {formatNumber(cand.votes1T)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-gray-700 dark:text-gray-300">
                    {formatPercent(cand.percentage1T)}
                  </td>

                  <td className="py-3.5 px-3 text-right font-medium">
                    {formatNumber(cand.votes2T)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                    {formatPercent(cand.percentage2T)}
                  </td>

                  {/* Variação Votos */}
                  <td className="py-3.5 px-3 text-right">
                    {diffVotes !== null ? (
                      <span
                        className={`inline-flex items-center gap-0.5 font-bold ${
                          diffVotes > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : diffVotes < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {diffVotes > 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : diffVotes < 0 ? (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                        {diffVotes > 0 ? `+${formatNumber(diffVotes)}` : formatNumber(diffVotes)}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Variação em Pontos Percentuais (pp) */}
                  <td className="py-3.5 px-3 text-right">
                    {diffPct !== null ? (
                      <span
                        className={`inline-flex items-center gap-0.5 font-bold ${
                          diffPct > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : diffPct < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {diffPct > 0 ? `+${diffPct.toFixed(2)} pp` : `${diffPct.toFixed(2)} pp`}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Situação Oficial */}
                  <td className="py-3.5 px-4 text-center">
                    {cand.isElected2T ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ELEITO (2ºT)
                      </span>
                    ) : cand.isElected1T ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ELEITO (1ºT)
                      </span>
                    ) : cand.votes2T !== null ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        2º Turno
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        Não Eleito (1ºT)
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Botão para alternar outros candidatos do 1º Turno */}
      {otherFirstRoundCandidates.length > 0 && (
        <div className="flex justify-center pt-1">
          <button
            onClick={() => setShowAllFirstRound(!showAllFirstRound)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
          >
            {showAllFirstRound ? (
              <>
                <ChevronUp className="w-4 h-4" /> Ocultar candidatos que disputaram apenas o 1º turno
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Ver outros {otherFirstRoundCandidates.length} candidatos do 1º turno
              </>
            )}
          </button>
        </div>
      )}

      {/* Estatísticas de Eleitorado, Comparecimento e Abstenção */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-3">
        <h3 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-emerald-500" />
          Participação e Comparecimento Eleitoral
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Comparecimento */}
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
            <span className="text-gray-500 font-medium block">Comparecimento 1º Turno</span>
            <span className="text-sm font-black text-gray-900 dark:text-white">
              {formatPercent(votersComparison.percentTurnout1T)}
            </span>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {formatNumber(votersComparison.turnout1T)} eleitores
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
            <span className="text-gray-500 font-medium block">Comparecimento 2º Turno</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {formatPercent(votersComparison.percentTurnout2T)}
            </span>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {formatNumber(votersComparison.turnout2T)} eleitores
            </p>
          </div>

          {/* Abstenção */}
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
            <span className="text-gray-500 font-medium block">Abstenção 1º Turno</span>
            <span className="text-sm font-black text-gray-900 dark:text-white">
              {formatPercent(votersComparison.percentAbstention1T)}
            </span>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {formatNumber(votersComparison.abstention1T)} faltantes
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
            <span className="text-gray-500 font-medium block">Abstenção 2º Turno</span>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">
              {formatPercent(votersComparison.percentAbstention2T)}
            </span>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {formatNumber(votersComparison.abstention2T)} faltantes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
