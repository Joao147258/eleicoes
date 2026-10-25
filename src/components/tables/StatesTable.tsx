'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StateSummaryOverview } from '@/modules/elections/domain/models';
import { BRAZIL_REGIONS } from '@/data/geography/brazil-states';
import {
  Search,
  ArrowUpDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Filter,
  Check,
} from 'lucide-react';

interface StatesTableProps {
  states: StateSummaryOverview[];
  selectedUf?: string | null;
  onSelectState?: (uf: string) => void;
}

export type TableSortCriteria =
  | 'name'
  | 'region'
  | 'percentTotalized'
  | 'largestMargin'
  | 'closestMargin'
  | 'leader';

export default function StatesTable({
  states,
  selectedUf,
  onSelectState,
}: StatesTableProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortCriteria, setSortCriteria] = useState<TableSortCriteria>('percentTotalized');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSortClick = (criteria: TableSortCriteria) => {
    if (sortCriteria === criteria) {
      setSortAsc(!sortAsc);
    } else {
      setSortCriteria(criteria);
      setSortAsc(criteria === 'name' || criteria === 'region' || criteria === 'closestMargin');
    }
  };

  const filteredAndSortedStates = useMemo(() => {
    return states
      .filter((s) => {
        const matchesRegion = selectedRegion === 'Todas' || s.region === selectedRegion;
        const matchesSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.uf.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRegion && matchesSearch;
      })
      .sort((a, b) => {
        let diff = 0;

        switch (sortCriteria) {
          case 'name':
            diff = a.name.localeCompare(b.name, 'pt-BR');
            break;
          case 'region':
            diff = a.region.localeCompare(b.region, 'pt-BR');
            break;
          case 'percentTotalized':
            diff = a.percentTotalized - b.percentTotalized;
            break;
          case 'largestMargin': {
            const marginA = a.voteMargin ?? -1;
            const marginB = b.voteMargin ?? -1;
            diff = marginA - marginB;
            break;
          }
          case 'closestMargin': {
            const marginA = a.percentageMargin ?? 999;
            const marginB = b.percentageMargin ?? 999;
            diff = marginA - marginB;
            break;
          }
          case 'leader': {
            const leadA = a.leaderName ?? '';
            const leadB = b.leaderName ?? '';
            diff = leadA.localeCompare(leadB, 'pt-BR');
            break;
          }
          default:
            diff = 0;
        }

        return sortAsc ? diff : -diff;
      });
  }, [states, selectedRegion, searchTerm, sortCriteria, sortAsc]);

  const formatNumber = (num?: number | null) => (num ?? 0).toLocaleString('pt-BR');
  const formatPercent = (val?: number | null) =>
    (val ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  const formatPp = (val?: number | null) =>
    (val ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' pp';

  return (
    <section aria-labelledby="states-table-title" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-7 shadow-sm">
      {/* Cabeçalho da Tabela com Filtros e Busca */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 id="states-table-title" className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Tabela Comparativa dos Estados (27 UFs)
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            Clique em qualquer linha para fixar a seleção no mapa e no painel analítico.
          </p>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Campo de Busca Textual */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por estado ou sigla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium w-56"
            />
          </div>

          {/* Filtro por Região */}
          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 absolute left-3 text-gray-400 pointer-events-none" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              {BRAZIL_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region === 'Todas' ? 'Todas as Regiões' : `Região ${region}`}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Ordenação Rápida */}
          <select
            value={sortCriteria}
            onChange={(e) => {
              const val = e.target.value as TableSortCriteria;
              setSortCriteria(val);
              setSortAsc(val === 'name' || val === 'region' || val === 'closestMargin');
            }}
            className="py-2 px-3 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
          >
            <option value="percentTotalized">Ordenar por: % Totalização</option>
            <option value="name">Ordenar por: Nome (A-Z)</option>
            <option value="region">Ordenar por: Região</option>
            <option value="largestMargin">Ordenar por: Maior Diferença</option>
            <option value="closestMargin">Ordenar por: Disputa Mais Acirrada</option>
            <option value="leader">Ordenar por: Candidato Líder</option>
          </select>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 uppercase font-black text-[11px] border-b border-gray-200 dark:border-gray-800 select-none">
            <tr>
              <th
                className="py-3.5 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => handleSortClick('name')}
              >
                <div className="flex items-center gap-1.5">
                  Estado <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>

              <th
                className="py-3.5 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => handleSortClick('percentTotalized')}
              >
                <div className="flex items-center gap-1.5">
                  Totalização <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>

              <th
                className="py-3.5 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => handleSortClick('leader')}
              >
                <div className="flex items-center gap-1.5">
                  Líder Estadual <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>

              <th className="py-3.5 px-4">2º Colocado</th>

              <th
                className="py-3.5 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => handleSortClick('largestMargin')}
              >
                <div className="flex items-center gap-1.5">
                  Diferença <ArrowUpDown className="w-3 h-3 text-gray-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 text-right">Ação</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {filteredAndSortedStates.length > 0 ? (
              filteredAndSortedStates.map((state) => {
                const isSelected = selectedUf?.toUpperCase() === state.uf.toUpperCase();
                const isFinished = state.isFinal || state.percentTotalized >= 100;

                return (
                  <tr
                    key={state.uf}
                    onClick={() => onSelectState && onSelectState(state.uf.toLowerCase())}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-l-emerald-600 font-medium'
                        : 'hover:bg-gray-50/90 dark:hover:bg-gray-800/40'
                    }`}
                  >
                    {/* Coluna 1: Estado e Região */}
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 text-center py-1 rounded text-xs font-black ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {state.uf}
                        </span>
                        <div>
                          <span className="text-sm block">{state.name}</span>
                          <span className="text-[10px] text-gray-500 font-medium">{state.region}</span>
                        </div>
                      </div>
                    </td>

                    {/* Coluna 2: Totalização */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden flex-shrink-0">
                          <div
                            className="bg-emerald-500 h-full"
                            style={{ width: `${Math.min(100, state.percentTotalized)}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-gray-950 dark:text-white text-xs">
                          {formatPercent(state.percentTotalized)}
                        </span>
                        {isFinished ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                    </td>

                    {/* Coluna 3: Líder Estadual */}
                    <td className="py-3 px-4">
                      {state.leaderName ? (
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-gray-950 dark:text-white">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                state.leaderNumber === '22'
                                  ? 'bg-blue-600'
                                  : state.leaderNumber === '13'
                                  ? 'bg-red-600'
                                  : 'bg-emerald-600'
                              }`}
                            />
                            <span>{state.leaderName}</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-black ml-1">
                              {formatPercent(state.leaderPercentage)}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-500 block pl-3.5 font-medium">
                            {formatNumber(state.leaderVotes)} votos
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Aguardando dados</span>
                      )}
                    </td>

                    {/* Coluna 4: 2º Colocado */}
                    <td className="py-3 px-4">
                      {state.runnerUpName ? (
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
                            <span>{state.runnerUpName}</span>
                            <span className="text-gray-600 dark:text-gray-400 font-bold ml-1">
                              {formatPercent(state.runnerUpPercentage)}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-500 block font-medium">
                            {formatNumber(state.runnerUpVotes)} votos
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Coluna 5: Diferença */}
                    <td className="py-3 px-4 font-semibold">
                      {state.voteMargin !== null && state.voteMargin !== undefined ? (
                        <div>
                          <span className="text-gray-950 dark:text-white font-extrabold block">
                            +{formatNumber(state.voteMargin)}
                          </span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-black block">
                            ({formatPp(state.percentageMargin)})
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Coluna 6: Ação de Detalhes */}
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/estados/${state.uf.toLowerCase()}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-bold hover:underline"
                      >
                        <span>Detalhes</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500 text-xs">
                  Nenhum estado localizado com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
