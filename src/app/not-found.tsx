import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">404 — Página Não Encontrada</h1>
      <p className="text-sm text-gray-700 dark:text-gray-300 max-w-md mb-6 font-medium">
        A página eleitoral ou seção solicitada não foi localizada. Verifique a URL ou retorne ao painel principal.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Painel Nacional
      </Link>
    </div>
  );
}
