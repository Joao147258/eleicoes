'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  HistoryTimelineResponse,
  ElectionSnapshotPoint,
} from '@/modules/elections/domain/history-models';
import {
  Clock,
  Activity,
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ElectionTimelineSectionProps {
  role: 'presidente' | 'governador';
  scope: string; // 'br' ou UF
  scopeName?: string;
  round?: number;
  onRefreshTriggered?: () => void;
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Falha ao carregar linha do tempo');
    return res.json();
  });

type MetricType = 'percent_votes' | 'absolute_votes' | 'percent_sections' | 'absolute_sections';
type TimeWindow = 'all' | '30' | '15' | '5';

export function ElectionTimelineSection({
  role,
  scope,
  scopeName = 'Brasil',
  round = 2,
  onRefreshTriggered,
}: ElectionTimelineSectionProps) {
  const [metric, setMetric] = useState<MetricType>('percent_votes');
  const [windowFilter, setWindowFilter] = useState<TimeWindow>('all');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(10);
  const [lastClientSync, setLastClientSync] = useState<string>('');

  const apiUrl = `/api/eleicoes/historico?role=${role}&scope=${scope}&round=${round}${
    windowFilter !== 'all' ? `&window=${windowFilter}` : ''
  }`;

  // SWR configurado com atualização estrita a cada 10 segundos quando em modo Ao Vivo
  const { data, error, isLoading, mutate } = useSWR<HistoryTimelineResponse>(
    apiUrl,
    fetcher,
    {
      refreshInterval: isLive ? 10000 : 0,
      revalidateOnFocus: true,
      dedupingInterval: 4000,
      onSuccess: () => {
        setCountdown(10);
        setLastClientSync(new Date().toLocaleTimeString('pt-BR'));
      },
    }
  );

  // Contador regressivo de 10s sincronizado
  useEffect(() => {
    if (!isLive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLive]);

  const handleManualRefresh = async () => {
    setCountdown(10);
    await mutate();
    setLastClientSync(new Date().toLocaleTimeString('pt-BR'));
    if (onRefreshTriggered) onRefreshTriggered();
  };

  const snapshots = useMemo(() => data?.snapshots || [], [data?.snapshots]);
  const activeSnapshot: ElectionSnapshotPoint | null = useMemo(() => {
    if (snapshots.length === 0) return null;
    if (selectedIndex !== null && selectedIndex >= 0 && selectedIndex < snapshots.length) {
      return snapshots[selectedIndex];
    }
    return snapshots[snapshots.length - 1];
  }, [snapshots, selectedIndex]);

  // Formatação para gráficos
  const chartData = useMemo(() => {
    return snapshots.map((s, idx) => {
      const timeLabel = s.tseGeneratedTime || s.timestamp.substring(11, 16);
      const row: Record<string, string | number> = {
        index: idx,
        time: timeLabel,
        percentTotalized: s.percentTotalized,
        totalizedSections: s.totalizedSections,
      };

      // Candidatos
      s.candidates.forEach((c) => {
        if (metric === 'percent_votes') {
          row[`cand_${c.number}`] = c.percentage;
        } else if (metric === 'absolute_votes') {
          row[`cand_${c.number}`] = c.votes;
        }
      });

      return row;
    });
  }, [snapshots, metric]);

  // Identificação das séries de candidatos presentes
  const candidateSeries = useMemo(() => {
    if (snapshots.length === 0) return [];
    const latest = snapshots[snapshots.length - 1];
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
    return latest.candidates.slice(0, 4).map((c, idx) => ({
      key: `cand_${c.number}`,
      name: `${c.ballotName} (${c.party})`,
      color: colors[idx % colors.length],
    }));
  }, [snapshots]);

  const formatNumber = (n: number) => n.toLocaleString('pt-BR');
  const formatPercent = (n: number) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Evolução da Apuração & Linha do Tempo
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Acompanhe a curva de apuração de {scopeName} ({round}º Turno) com taxa de atualização a cada 10 segundos.
          </p>
        </div>

        {/* Controles de Atualização em Tempo Real (10 segundos) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Badge Ao Vivo ou Histórico */}
          {isLive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Ao Vivo • Próxima atualização em {countdown}s</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-bold">
              <Pause className="w-3.5 h-3.5" />
              <span>Modo Histórico • Atualização pausada</span>
            </div>
          )}

          {/* Botão de Alternância Ao Vivo vs Histórico */}
          <button
            onClick={() => {
              if (!isLive) {
                setSelectedIndex(null);
                setIsLive(true);
              } else {
                setIsLive(false);
              }
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
            title={isLive ? 'Pausar para inspecionar momentos anteriores' : 'Retomar atualização ao vivo'}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isLive ? 'Pausar' : 'Voltar ao Vivo'}
          </button>

          {/* Botão de Atualização Manual */}
          <button
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
            title="Atualizar agora"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Indicadores de Ritmo e Estimativa Técnica Experimental */}
      {data?.pace && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
              Ritmo da Totalização
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                {data.pace.sectionsPerMinute.toLocaleString('pt-BR')}
              </span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                seções / minuto
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
              +{formatNumber(data.pace.incorporatedSections)} seções totalizadas no intervalo recente.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
              Estimativa de Conclusão (Experimental)
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {data.pace.estimatedMinutesRemaining !== null
                  ? `${data.pace.estimatedMinutesRemaining} min`
                  : 'Indisponível'}
              </span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                restantes aproximados
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium leading-tight">
              {data.pace.estimatedCompletionText}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
              Sincronização & Metadados
            </span>
            <div className="mt-2 space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Horário Oficial TSE:</span>
                <span className="font-bold">{activeSnapshot?.tseGeneratedTime || 'N/D'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Última Checagem Cliente:</span>
                <span className="font-bold">{lastClientSync || 'Conectado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Snapshots Gravados:</span>
                <span className="font-bold">{snapshots.length} pontos factuais</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Filtros e Seletores de Métricas */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Seletor de Métrica */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setMetric('percent_votes')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              metric === 'percent_votes'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            % Votos dos Candidatos
          </button>
          <button
            onClick={() => setMetric('absolute_votes')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              metric === 'absolute_votes'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Votos Acumulados
          </button>
          <button
            onClick={() => setMetric('percent_sections')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              metric === 'percent_sections'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            % Seções Totalizadas
          </button>
          <button
            onClick={() => setMetric('absolute_sections')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              metric === 'absolute_sections'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Seções Absolutas
          </button>
        </div>

        {/* Filtro de Janela Temporal */}
        <div className="flex items-center gap-1 text-xs font-semibold self-end sm:self-auto">
          <span className="text-gray-500 dark:text-gray-400 mr-1 text-[11px]">Janela:</span>
          {(['all', '30', '15', '5'] as TimeWindow[]).map((w) => (
            <button
              key={w}
              onClick={() => setWindowFilter(w)}
              className={`px-2.5 py-1 rounded-lg transition ${
                windowFilter === w
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {w === 'all' ? 'Tudo' : `${w}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico Temporal Recharts */}
      <div className="h-72 w-full pt-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="time" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                domain={
                  metric === 'percent_votes' || metric === 'percent_sections'
                    ? [0, 100]
                    : ['auto', 'auto']
                }
                tickFormatter={(val) =>
                  metric.startsWith('percent') ? `${val}%` : Number(val).toLocaleString('pt-BR')
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(75, 85, 99, 0.4)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: number | string, name: string) => {
                  const num = Number(val);
                  if (metric.startsWith('percent')) return [`${num.toFixed(2)}%`, name];
                  return [num.toLocaleString('pt-BR'), name];
                }}
                labelFormatter={(lbl) => `Horário do Snapshot: ${lbl}`}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                iconType="circle"
              />

              {metric === 'percent_votes' || metric === 'absolute_votes' ? (
                candidateSeries.map((series) => (
                  <Line
                    key={series.key}
                    type="monotone"
                    dataKey={series.key}
                    name={series.name}
                    stroke={series.color}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={metric === 'percent_sections' ? 'percentTotalized' : 'totalizedSections'}
                  name={metric === 'percent_sections' ? '% Seções Totalizadas' : 'Seções Apuradas'}
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-gray-500">
            Aguardando coleta de dados temporais para {scopeName}...
          </div>
        )}
      </div>

      {/* Modo Explorar Histórico: Slider de Linha do Tempo */}
      {snapshots.length > 1 && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              Navegar pelo Histórico da Apuração (Slider):
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              Momento selecionado: {activeSnapshot?.tseGeneratedTime || 'Mais recente'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-500 font-medium">Início</span>
            <input
              type="range"
              min={0}
              max={snapshots.length - 1}
              value={selectedIndex !== null ? selectedIndex : snapshots.length - 1}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setSelectedIndex(val);
                setIsLive(val === snapshots.length - 1);
              }}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
            <span className="text-[11px] text-gray-500 font-medium">Agora</span>

            {selectedIndex !== null && selectedIndex !== snapshots.length - 1 && (
              <button
                onClick={() => {
                  setSelectedIndex(null);
                  setIsLive(true);
                }}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1 flex-shrink-0"
              >
                <RotateCcw className="w-3 h-3" /> Voltar ao Agora
              </button>
            )}
          </div>
        </div>
      )}

      {/* Seção "O que mudou na apuração?" */}
      <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
            O que mudou na apuração? (Último ciclo oficial)
          </h3>
        </div>
        <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200 font-medium">
          {data?.changesSummary && data.changesSummary.length > 0 ? (
            data.changesSummary.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 dark:text-gray-400">
              Aguardando transmissão do próximo lote de dados do TSE para consolidar as alterações.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
