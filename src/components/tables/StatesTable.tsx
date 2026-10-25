'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StateSummaryOverview } from '@/modules/elections/domain/models';
import { BRAZIL_REGIONS } from '@/data/geography/brazil-states';
import { Search, ArrowUpDown, ChevronRight, CheckCircle2 } from 'lucide-react';

interface StatesTableProps {
  states: StateSummaryOverview[];
}

type SortField = 'name' | 'percentTotalized' | 'voteMargin';
type SortOrder = 'asc' | 'desc';

export default function StatesTable({ states }: StatesTableProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('percentTotalized');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
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
        let valA = a[sortField] ?? 0;
        let valB = b[sortField] ?? 0;

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB as string)
            : (valB as string).localeCompare(valA);
        }

        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [states, selectedRegion, searchTerm, sortField, sortOrder]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Apuração Estadual Comparativa (27 UFs)
          </h2>
          <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
            Acompanhe o ritmo da totalização e a liderança em cada unidade da federação.
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Busca */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Seletor de Região */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {BRAZIL_REGIONS.map((region) => (
              <option key={region} value={region}>
                Região: {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/60 uppercase font-semibold text-gray-700 dark:text-gray-300 border-y border-gray-200 dark:border-gray-700">
            <tr>
              <th
                className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Estado <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                onClick={() => handleSort('percentTotalized')}
              >
                <div className="flex items-center gap-1">
                  Totalização <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Líder Estadual</th>
              <th className="py-3 px-4">2º Colocado</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                onClick={() => handleSort('voteMargin')}
              >
                <div className="flex items-center gap-1">
                  Diferença <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredAndSortedStates.map((state) => {
              const isFinished = state.isFinal || state.percentTotalized >= 100;

              return (
                <tr
                  key={state.uf}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 text-center text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {state.uf}
                    </span>
                    <span>{state.name}</span>
                    <span className="text-[10px] font-normal text-gray-700 dark:text-gray-300 font-medium">({state.region})</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, state.percentTotalized)}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {state.percentTotalized.toFixed(2)}%
                      </span>
                      {isFinished && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {state.leaderName ? (
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {state.leaderName}
                        </span>
                        <span className="text-emerald-800 dark:text-emerald-300 font-bold ml-1.5">
                          {state.leaderPercentage?.toFixed(2)}%
                        </span>
                        <span className="text-[10px] text-gray-700 dark:text-gray-300 block font-medium">
                          {state.leaderVotes?.toLocaleString('pt-BR')} votos
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300 font-medium">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {state.runnerUpName ? (
                      <div>
                        <span className="text-gray-800 dark:text-gray-200">
                          {state.runnerUpName}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 ml-1.5 font-medium">
                          {state.runnerUpPercentage?.toFixed(2)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300 font-medium">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-medium">
                    {state.voteMargin !== null && state.voteMargin !== undefined ? (
                      <div>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          +{state.voteMargin.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-[10px] text-gray-700 dark:text-gray-300 block font-medium">
                          ({state.percentageMargin?.toFixed(2)} pp)
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300 font-medium">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/estados/${state.uf.toLowerCase()}`}
                      className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 font-bold hover:underline"
                    >
                      Detalhes <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
