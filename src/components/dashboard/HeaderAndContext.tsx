'use client';

import React from 'react';
import { RefreshCw, Clock, CheckCircle2, AlertCircle, Calendar, Server } from 'lucide-react';
import { ElectionSummary } from '@/modules/elections/domain/models';

interface HeaderAndContextProps {
  nationalData?: ElectionSummary | null;
  isLoading: boolean;
  onRefresh: () => void;
  lastClientFetch: Date;
}

export default function HeaderAndContext({
  nationalData,
  isLoading,
  onRefresh,
  lastClientFetch,
}: HeaderAndContextProps) {
  const isFinal = nationalData?.isFinal ?? false;
  const isStarted = nationalData ? nationalData.progress.totalizedSections > 0 : false;

  const formatClientTime = (d: Date) =>
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Título e Subtítulo */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-700 text-white shadow-sm">
              Resultado Oficial
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              25 de Outubro de 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
            Eleições 2026 — Segundo Turno
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Resultado da apuração presidencial • Brasil • Dados oficiais do Tribunal Superior Eleitoral (TSE)
          </p>
        </div>

        {/* Metadados de Sincronização e Ação */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50/80 dark:bg-gray-950/60 p-3.5 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="space-y-1.5 text-xs">
            {/* Status da Totalização */}
            <div className="flex items-center gap-1.5 font-bold">
              {isFinal ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Totalização Concluída (100%)
                </span>
              ) : isStarted ? (
                <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
                  <Clock className="w-4 h-4 animate-pulse" /> Apuração em Andamento
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <AlertCircle className="w-4 h-4" /> Aguardando Início
                </span>
              )}
            </div>

            {/* Horário da fonte TSE vs consulta local */}
            <div className="text-[11px] text-gray-600 dark:text-gray-400 space-y-0.5 font-medium">
              <div className="flex items-center gap-1">
                <Server className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>
                  Fonte TSE:{' '}
                  <strong className="text-gray-900 dark:text-gray-200">
                    {nationalData
                      ? `${nationalData.totalizedDate} às ${nationalData.totalizedTime}`
                      : 'Carregando...'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-500" />
                <span>
                  Consulta do portal:{' '}
                  <span className="text-gray-800 dark:text-gray-300">
                    {formatClientTime(lastClientFetch)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Botão de Atualização Manual */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Atualizar dados agora"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all font-semibold text-xs shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Atualizando...' : 'Atualizar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
