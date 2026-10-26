import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function TimelinePreviewCard() {
  const previewEvents = [
    {
      date: '04 de outubro',
      title: 'Realização do 1º Turno das Eleições Gerais',
      desc: 'Mais de 156 milhões de eleitores votaram em todo o Brasil, definindo a disputa de 2º turno presidencial.',
      category: '1º Turno',
    },
    {
      date: '15 de outubro',
      title: 'TRE-RJ Proclama Governador Eleito em 1º Turno',
      desc: 'Após retotalização determinada pelo TSE, Douglas Ruas (PL) foi proclamado eleito no primeiro turno no Rio de Janeiro.',
      category: 'Justiça Eleitoral',
    },
    {
      date: '25 de outubro (21h08)',
      title: 'TSE Atesta Reeleição Presidencial de Lula',
      desc: 'O TSE atestou a definição matemática oficial com mais de 50% dos votos válidos, declarando Lula reeleito Presidente.',
      category: 'Resultado Oficial',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Como foi a eleição de 2026?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Revise os principais acontecimentos desde o primeiro turno até a definição dos resultados oficiais.
          </p>
        </div>

        <Link
          href="/linha-do-tempo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm self-start sm:self-auto"
        >
          <span>Explorar Linha do Tempo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid com os 3 marcos históricos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {previewEvents.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-800 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.date}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {item.category}
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
