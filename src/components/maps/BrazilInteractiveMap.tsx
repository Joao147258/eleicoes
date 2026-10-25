'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAZIL_STATES, BrazilStateInfo } from '@/data/geography/brazil-states';
import { StateSummaryOverview } from '@/modules/elections/domain/models';
import { MapPin, ArrowRight } from 'lucide-react';

interface BrazilInteractiveMapProps {
  statesData: StateSummaryOverview[];
  selectedUf?: string | null;
  onSelectState?: (uf: string) => void;
}

export default function BrazilInteractiveMap({
  statesData,
  selectedUf,
  onSelectState,
}: BrazilInteractiveMapProps) {
  const [hoveredState, setHoveredState] = useState<BrazilStateInfo | null>(null);

  // Mapeia os dados por UF
  const dataByUf = new Map<string, StateSummaryOverview>(
    statesData.map((s) => [s.uf.toUpperCase(), s])
  );

  const getStateColor = (uf: string) => {
    const data = dataByUf.get(uf.toUpperCase());
    if (!data || data.percentTotalized === 0 || !data.leaderNumber) {
      return '#cbd5e1'; // Cinza claro (sem dados / não iniciado)
    }

    // Cores diferenciadas por número do candidato líder
    if (data.leaderNumber === '22') {
      return '#3b82f6'; // Azul
    }
    if (data.leaderNumber === '13') {
      return '#ef4444'; // Vermelho
    }
    return '#10b981'; // Verde padrão para outros
  };

  const hoveredData = hoveredState ? dataByUf.get(hoveredState.uf.toUpperCase()) : null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Mapa da Apuração por Estado
          </h2>
          <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
            Passe o mouse ou toque no estado para ver o progresso e o candidato que lidera.
          </p>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">PL (22)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">PT (13)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Sem dados</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG do Mapa */}
        <div className="lg:col-span-2 relative flex justify-center bg-gray-50/60 dark:bg-gray-950/40 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <svg
            viewBox="0 0 600 620"
            className="w-full max-w-lg h-auto select-none"
            role="img"
            aria-label="Mapa Eleitoral do Brasil"
          >
            {BRAZIL_STATES.map((state) => {
              const isSelected = selectedUf?.toUpperCase() === state.uf;
              const isHovered = hoveredState?.uf === state.uf;
              const fillColor = getStateColor(state.uf);

              return (
                <g key={state.uf}>
                  <path
                    d={state.svgPath}
                    fill={fillColor}
                    stroke={isSelected || isHovered ? '#0f172a' : '#ffffff'}
                    strokeWidth={isSelected || isHovered ? 2.5 : 1}
                    className="cursor-pointer transition-all duration-200 hover:opacity-90"
                    onMouseEnter={() => setHoveredState(state)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => onSelectState && onSelectState(state.uf.toLowerCase())}
                  />
                  {/* Sigla do estado */}
                  <text
                    x={state.centroid.x}
                    y={state.centroid.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={isHovered || isSelected ? '#0f172a' : '#ffffff'}
                    fontSize="11"
                    fontWeight="800"
                    className="pointer-events-none drop-shadow-sm select-none"
                  >
                    {state.uf}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Card de Detalhe do Estado selecionado/hovered */}
        <div className="flex flex-col justify-between h-full bg-gray-50 dark:bg-gray-800/40 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          {hoveredState ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {hoveredState.region} • Capital: {hoveredState.capital}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    {hoveredState.name} ({hoveredState.uf})
                  </h3>
                </div>
              </div>

              {hoveredData && hoveredData.percentTotalized > 0 ? (
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Apuração:</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {hoveredData.percentTotalized.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${hoveredData.percentTotalized}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                    <span className="text-[11px] text-gray-700 dark:text-gray-300 block font-medium">Liderança Atual</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {hoveredData.leaderName}
                      </span>
                      <span className="font-black text-emerald-800 dark:text-emerald-300 text-sm">
                        {hoveredData.leaderPercentage?.toFixed(2)}%
                      </span>
                    </div>
                    {hoveredData.leaderVotes && (
                      <span className="text-[11px] text-gray-700 dark:text-gray-300 block mt-0.5 font-medium">
                        {hoveredData.leaderVotes.toLocaleString('pt-BR')} votos
                      </span>
                    )}
                  </div>

                  {hoveredData.runnerUpName && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                      <span className="text-[11px] text-gray-700 dark:text-gray-300 block font-medium">2º Colocado</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                          {hoveredData.runnerUpName}
                        </span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                          {hoveredData.runnerUpPercentage?.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Link
                      href={`/estados/${hoveredState.uf.toLowerCase()}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline"
                    >
                      Ver detalhes completos de {hoveredState.name} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-700 dark:text-gray-300 font-medium">
                  Aguardando totalização oficial deste estado.
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-700 dark:text-gray-300 flex flex-col items-center justify-center h-full font-medium">
              <MapPin className="w-8 h-8 text-gray-500 mb-2" />
              Passe o mouse ou toque sobre um estado no mapa para ver a liderança e percentual de apuração.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
