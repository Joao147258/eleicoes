'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ElectionTimelineEvent,
  EventCategory,
  TimelinePeriod,
} from '@/modules/elections/domain/timeline-models';
import {
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  Search,
  CheckCircle2,
  Scale,
  Tv,
  Vote,
  ShieldCheck,
  Building,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface HistoricalTimelineProps {
  events: ElectionTimelineEvent[];
  initialCategory?: EventCategory | 'all';
  initialUf?: string;
  title?: string;
  subtitle?: string;
}

export function HistoricalTimeline({
  events,
  initialCategory = 'all',
  initialUf,
  title = 'Eleições 2026 — Linha do Tempo',
  subtitle = 'Uma retrospectiva documentada dos principais acontecimentos entre o primeiro e o segundo turno das eleições brasileiras.',
}: HistoricalTimelineProps) {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>(initialCategory);
  const [selectedPeriod, setSelectedPeriod] = useState<TimelinePeriod | 'all'>('all');
  const [selectedUf, setSelectedUf] = useState<string>(initialUf || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Expande por padrão os marcos principais
  useEffect(() => {
    const milestones = new Set(events.filter((e) => e.isMilestone).map((e) => e.id));
    setExpandedEvents(milestones);
  }, [events]);

  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyLink = (id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  // Filtragem dos eventos
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) return false;
      if (selectedPeriod !== 'all' && ev.period !== selectedPeriod) return false;
      if (selectedUf !== 'all') {
        if (selectedUf === 'nacional' && ev.scope !== 'nacional') return false;
        if (selectedUf !== 'nacional' && ev.uf !== selectedUf) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = ev.title.toLowerCase().includes(q);
        const inDesc = ev.description.toLowerCase().includes(q);
        const inSources = ev.sources.some(
          (s) => s.title.toLowerCase().includes(q) || s.publisher.toLowerCase().includes(q)
        );
        if (!inTitle && !inDesc && !inSources) return false;
      }
      return true;
    });
  }, [events, selectedCategory, selectedPeriod, selectedUf, searchQuery]);

  const getCategoryIcon = (category: EventCategory) => {
    switch (category) {
      case 'votacao':
        return <Vote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'justica-eleitoral':
        return <Scale className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'debate':
        return <Tv className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'resultado':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'auditoria':
        return <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'institucional':
        return <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho da Linha do Tempo */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Calendar className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {filteredEvents.length} de {events.length} acontecimentos
            </span>
          </div>
        </div>

        {/* Controles de Filtros e Busca */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Campo de Busca */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por data, decisão, fonte ou termo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filtro por Período */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold py-1">
              <span className="text-gray-500 mr-1 text-[11px]">Período:</span>
              {[
                { id: 'all', label: 'Todos' },
                { id: '1t', label: '1º Turno' },
                { id: 'intervalo', label: 'Entre Turnos' },
                { id: '2t', label: '2º Turno' },
                { id: 'pos-eleicao', label: 'Institucional' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPeriod(p.id as TimelinePeriod | 'all')}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap text-xs ${
                    selectedPeriod === p.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Categoria e Escopo */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-gray-500 mr-1 text-[11px] font-semibold">Categoria:</span>
              {[
                { id: 'all', label: 'Todas' },
                { id: 'votacao', label: 'Votação' },
                { id: 'resultado', label: 'Resultados' },
                { id: 'justica-eleitoral', label: 'Justiça Eleitoral' },
                { id: 'debate', label: 'Debates' },
                { id: 'auditoria', label: 'Auditoria' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id as EventCategory | 'all')}
                  className={`px-2.5 py-1 rounded-lg transition font-medium ${
                    selectedCategory === c.id
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold'
                      : 'bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Filtro por UF / Abrangência */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 text-[11px] font-semibold">Abrangência:</span>
              <select
                value={selectedUf}
                onChange={(e) => setSelectedUf(e.target.value)}
                className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="all">Todas as abrangências</option>
                <option value="nacional">Nacional (Brasil)</option>
                <option value="RJ">Rio de Janeiro (Retotalização)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Linha do Tempo Vertical */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
        {filteredEvents.map((event) => {
          const isExpanded = expandedEvents.has(event.id);
          const isMilestone = event.isMilestone;

          return (
            <article
              key={event.id}
              id={event.id}
              className={`relative bg-white dark:bg-gray-900 rounded-2xl border transition-all p-5 sm:p-6 shadow-sm scroll-mt-24 ${
                isMilestone
                  ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-500/20'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              {/* Marcador no eixo vertical */}
              <div
                className={`absolute -left-6 sm:-left-8 top-6 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-gray-950 flex items-center justify-center ${
                  isMilestone ? 'bg-emerald-600' : 'bg-gray-400 dark:bg-gray-600'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Cabeçalho do Acontecimento */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 dark:text-emerald-400">
                      <Clock className="w-3.5 h-3.5" />
                      {event.displayDate}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {getCategoryIcon(event.category)}
                      {event.categoryLabel}
                    </span>

                    {event.uf && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <MapPin className="w-3 h-3" />
                        {event.uf}
                      </span>
                    )}

                    {event.statusTag === 'Previsto' && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Previsto
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                    {event.title}
                  </h2>
                </div>

                {/* Botões de Ação: Compartilhar Âncora e Expandir */}
                <div className="flex items-center gap-1.5 self-end sm:self-start flex-shrink-0">
                  <button
                    onClick={() => handleCopyLink(event.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    title="Copiar link para este acontecimento"
                    aria-label={`Copiar link para o evento ${event.title}`}
                  >
                    {copiedId === event.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => toggleExpand(event.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    title={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                    aria-label={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Descrição Factual e Imparcial */}
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {event.description}
              </p>

              {/* Destaques (se expandido ou se marco) */}
              {event.highlights && event.highlights.length > 0 && isExpanded && (
                <div className="mt-4 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block">
                    Pontos Oficiais Documentados
                  </span>
                  <ul className="space-y-1 text-xs text-gray-800 dark:text-gray-200 font-medium">
                    {event.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fontes Oficiais e Rastreáveis */}
              {isExpanded && event.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block mb-2">
                    Fontes Oficiais Verificadas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {event.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-emerald-700 dark:text-emerald-400 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{src.title}</span>
                        <span className="text-gray-500 font-normal">({src.publisher})</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs text-gray-500">
            Nenhum acontecimento corresponde aos filtros selecionados.
          </div>
        )}
      </div>
    </div>
  );
}
