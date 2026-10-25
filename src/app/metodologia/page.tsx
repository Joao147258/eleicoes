import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Info, FileText, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function MetodologiaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 hover:text-emerald-800 dark:hover:text-emerald-300 mb-4 transition font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel Nacional
        </Link>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Metodologia & Transparência Técnica
        </h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">
          Conheça as fontes, regras de processamento e garantias de integridade do Painel Eleitoral Brasil.
        </p>
      </div>

      {/* Box de Independência */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-6 text-xs text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Declaração de Independência
        </div>
        <p className="leading-relaxed">
          O <strong>Painel Eleitoral Brasil</strong> é um projeto independente, cívico e de código aberto desenvolvido com o propósito de disponibilizar uma interface limpa, rápida e acessível para o acompanhamento dos resultados eleitorais brasileiros.
        </p>
        <p className="leading-relaxed">
          <strong>Este portal não é um órgão nem possui qualquer afiliação institucional com a Justiça Eleitoral ou com o Tribunal Superior Eleitoral (TSE).</strong> Todos os números e percentuais apresentados são obtidos a partir dos arquivos públicos oficiais disponibilizados pelo TSE.
        </p>
      </div>

      {/* Fonte Primária de Dados */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          1. Fonte Primária Oficial
        </h2>
        <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
          A aplicação consome exclusivamente os arquivos JSON oficiais distribuídos pela infraestrutura de divulgação de resultados do TSE:
        </p>
        <ul className="text-xs space-y-2 text-gray-700 dark:text-gray-300 list-disc pl-5">
          <li>
            <strong>Arquivo de Configuração Geral:</strong> <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">ele-c.json</code> — validação dos códigos de pleito, turnos e abrangências ativas.
          </li>
          <li>
            <strong>Arquivo Unificado de Resultados (Especificação EA20):</strong> <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{`{uf}-c{cargo}-e{eleicao}-u.json`}</code> — dados consolidados de totalização, seções, eleitorado e votação nominal por candidato.
          </li>
        </ul>
      </div>

      {/* Regras de Processamento e Domínio */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          2. Regras de Processamento de Dados
        </h2>
        <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            <strong>Preservação Integral dos Dados Oficiais:</strong> Não realizamos alterações, projeções, estimativas estatísticas ou extrapolações. Os dados exibidos correspondem exatamente ao último snapshot totalizado pelo TSE.
          </p>
          <p>
            <strong>Cálculo de Margens e Liderança:</strong> A liderança é determinada pela quantidade absoluta de votos válidos computados até o momento. A diferença é calculada como a subtração entre os dois primeiros candidatos (<code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">votosA - votosB</code>).
          </p>
          <p>
            <strong>Percentuais e Totalização:</strong> O percentual de seções totalizadas reflete a razão entre seções já computadas e o total de seções da abrangência (<code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">s.pst</code>). Em caso de empate rigoroso, a interface sinaliza o estado de paridade.
          </p>
        </div>
      </div>

      {/* Transparência e Código Aberto */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          3. Código Aberto & Verificabilidade
        </h2>
        <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
          Todo o código-fonte deste projeto é 100% aberto e público sob licença MIT no GitHub. Qualquer cidadão ou auditor pode inspecionar o pipeline de dados, os schemas de validação Zod e a suíte de testes automatizados.
        </p>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
          Repositório oficial: github.com/Joao147258/eleicoes
        </p>
      </div>
    </div>
  );
}
