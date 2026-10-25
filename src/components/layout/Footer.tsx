import React from 'react';
import Link from 'next/link';
import { ExternalLink, Info, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 py-10 mt-16 text-sm text-gray-700 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base">
              Painel Eleitoral Brasil
            </h3>
            <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              Plataforma independente e de código aberto para acompanhamento em tempo real dos resultados das Eleições Gerais com base nos arquivos abertos oficiais de totalização do Tribunal Superior Eleitoral (TSE).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Aviso de Independência
            </h4>
            <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              Este portal é uma iniciativa estritamente cívica e informativa de código aberto. <strong>Não é um canal oficial da Justiça Eleitoral</strong> e não possui vínculo formal com o TSE. Todos os números apresentados são espelhados fielmente da fonte primária pública oficial.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
              Fontes & Referências Oficiais
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <a
                  href="https://resultados.tse.jus.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  Divulgação de Resultados TSE <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tse.jus.br/eleicoes/informacoes-tecnicas-sobre-a-divulgacao-de-resultados"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  Especificações Técnicas TSE (EA20) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/metodologia" className="text-gray-700 dark:text-gray-300 hover:underline font-medium">
                  Metodologia e Transparência
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 dark:text-gray-300 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Dados verificados diretamente da CDN oficial do TSE</span>
          </div>
          <p>© {new Date().getFullYear()} Painel Eleitoral Brasil • v1.0.1 (Auto-Deploy Ativo) • Licença MIT</p>
        </div>
      </div>
    </footer>
  );
}
