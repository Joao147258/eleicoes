import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Painel Eleitoral Brasil — Resultados Oficiais TSE',
  description:
    'Acompanhe a apuração e os resultados eleitorais brasileiros em tempo real com dados oficiais do Tribunal Superior Eleitoral (TSE).',
  keywords: ['eleições 2026', 'apuração brasil', 'resultados tse', 'painel eleitoral'],
  authors: [{ name: 'Painel Eleitoral Brasil' }],
  metadataBase: new URL('https://eleicoes.joaovitordantas.com.br'),
  openGraph: {
    title: 'Painel Eleitoral Brasil — Resultados Oficiais TSE',
    description: 'Acompanhamento independente da apuração oficial do TSE.',
    url: 'https://eleicoes.joaovitordantas.com.br',
    siteName: 'Painel Eleitoral Brasil',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
