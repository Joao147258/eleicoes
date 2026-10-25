'use client';

import React, { useMemo } from 'react';
import { StateSummaryOverview } from '@/modules/elections/domain/models';
import { Map, AlertTriangle, Zap, Flame, CheckCircle2 } from 'lucide-react';

interface StatesAnalyticalPanoramaProps {
  states: StateSummaryOverview[];
  onSelectState: (uf: string) => void;
  selectedUf?: string | null;
}

export default function StatesAnalyticalPanorama({
  states,
  onSelectState,
  selectedUf,
}: StatesAnalyticalPanoramaProps) {
  // Cálculos analíticos dos estados
  const stats = useMemo(() => {
    let leader22Count = 0;
    let leader13Count = 0;
    let noDataCount = 0;

    const statesWithData = states.filter((s) => s.percentTotalized > 0 && s.leaderNumber);

    for (const s of states) {
      if (s.percentTotalized === 0 || !s.leaderNumber) {
        noDataCount++;
      } else if (s.leaderNumber === '22') {
        leader22Count++;
      } else if (s.leaderNumber === '13') {
        leader13Count++;
      }
    }

    // Estados com disputas mais acirradas (menor diferença de pontos percentuais)
    const closestRaces = [...statesWithData]
      .filter((s) => s.percentageMargin !== null && s.percentageMargin !== undefined)
      .sort((a, b) => (a.percentageMargin ?? 999) - (b.percentageMargin ?? 999))
      .slice(0, 3);

    // Estados com apuração mais adiantada
    const mostAdvanced = [...statesWithData]
      .sort((a, b) => b.percentTotalized - a.percentTotalized)
      .slice(0, 3);

    return {
      leader22Count,
      leader13Count,
      noDataCount,
      closestRaces,
      mostAdvanced,
      totalCount: states.length,
    };
  }, [states]);

  return (
    <section aria-labelledby="states-analytical-title" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 id="states-analytical-title" className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Panorama dos Estados (27 UFs)
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            Distribuição da apuração e dinâmica regional da disputa presidencial.
          </p>
        </div>

        {/* Nota pedagógica sobre o sistema eleitoral brasileiro */}
        <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 max-w-xl">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
          <span>
            <strong>Nota:</strong> A quantidade de UFs lideradas é um indicador analítico. A eleição presidencial é decidida pela <strong>soma dos votos válidos de todo o país</strong>, não por colégio eleitoral.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Placar de UFs por Candidato */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Liderança por Estado
            </h3>
            <span className="text-xs font-semibold text-gray-400">27 UFs</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">PL • Flávio Bolsonaro</span>
              </div>
              <span className="text-sm font-black text-blue-700 dark:text-blue-300">
                {stats.leader22Count} {stats.leader22Count === 1 ? 'estado' : 'estados'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">PT • Lula</span>
              </div>
              <span className="text-sm font-black text-red-700 dark:text-red-300">
                {stats.leader13Count} {stats.leader13Count === 1 ? 'estado' : 'estados'}
              </span>
            </div>

            {stats.noDataCount > 0 && (
              <div className="flex items-center justify-between p-2 text-xs text-gray-500">
                <span>Aguardando apuração:</span>
                <span className="font-bold">{stats.noDataCount} UFs</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Disputas Mais Acirradas */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Disputas Mais Acirradas
            </h3>
            <span className="text-[10px] text-gray-400">Menor margem pp</span>
          </div>

          <div className="space-y-2">
            {stats.closestRaces.length > 0 ? (
              stats.closestRaces.map((s) => {
                const isSelected = selectedUf?.toUpperCase() === s.uf.toUpperCase();
                return (
                  <button
                    key={s.uf}
                    onClick={() => onSelectState(s.uf.toLowerCase())}
                    className={`w-full text-left flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                        : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-[11px]">
                        {s.uf}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white truncate max-w-[110px]">
                        {s.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-amber-600 dark:text-amber-400">
                        ±{s.percentageMargin?.toFixed(2)} pp
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        Líder: {s.leaderName?.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 py-3 text-center">Aguardando dados comparativos.</p>
            )}
          </div>
        </div>

        {/* Card 3: Apuração Mais Adiantada */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" /> Ritmo de Totalização
            </h3>
            <span className="text-[10px] text-gray-400">Mais adiantados</span>
          </div>

          <div className="space-y-2">
            {stats.mostAdvanced.length > 0 ? (
              stats.mostAdvanced.map((s) => {
                const isSelected = selectedUf?.toUpperCase() === s.uf.toUpperCase();
                return (
                  <button
                    key={s.uf}
                    onClick={() => onSelectState(s.uf.toLowerCase())}
                    className={`w-full text-left flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                        : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-[11px]">
                        {s.uf}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white truncate max-w-[110px]">
                        {s.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${s.percentTotalized}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {s.percentTotalized.toFixed(1)}%
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 py-3 text-center">Aguardando início das seções.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
