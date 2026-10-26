import React from 'react';
import Link from 'next/link';
import { TIMELINE_EVENTS_2026 } from '@/data/elections/2026/timeline-events';
import { Calendar, Clock, ExternalLink, ArrowRight, MapPin, Scale } from 'lucide-react';

interface StateTimelineEventsProps {
  uf: string;
  stateName: string;
}

export function StateTimelineEvents({ uf, stateName }: StateTimelineEventsProps) {
  const cleanUf = uf.toUpperCase();
  const stateEvents = TIMELINE_EVENTS_2026.filter((e) => e.uf === cleanUf);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Acontecimentos Eleitorais — {stateName} ({cleanUf})
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
            {stateEvents.length > 0
              ? `Marcos políticos, judiciais e de totalização documentados oficialmente para ${stateName}.`
              : `Acompanhe a cronologia completa dos acontecimentos eleitorais de 2026.`}
          </p>
        </div>

        <Link
          href={`/linha-do-tempo${stateEvents.length > 0 ? `#${stateEvents[0].id}` : ''}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition self-start sm:self-auto"
        >
          <span>Ver Linha do Tempo Completa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {stateEvents.length > 0 ? (
        <div className="space-y-4">
          {stateEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {ev.displayDate}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {ev.categoryLabel}
                </span>
              </div>

              <h4 className="text-sm font-black text-gray-900 dark:text-white">
                {ev.title}
              </h4>

              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {ev.description}
              </p>

              {ev.sources.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {ev.sources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{s.title}</span>
                      <span className="text-gray-500 font-normal">({s.publisher})</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/20 border border-gray-200/50 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
          <span>
            Não há registros de decisões judiciais extraordinárias ou retotalizações para {stateName}. As votações seguiram o rito regular do calendário oficial.
          </span>
          <Link
            href="/linha-do-tempo"
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex-shrink-0 ml-2"
          >
            Acessar timeline geral
          </Link>
        </div>
      )}
    </div>
  );
}
