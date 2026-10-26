export type EventCategory =
  | 'votacao'
  | 'resultado'
  | 'justica-eleitoral'
  | 'debate'
  | 'campanha'
  | 'auditoria'
  | 'institucional';

export type EventVerification = 'verificado' | 'pendente' | 'corrigido';

export type TimelinePeriod = '1t' | 'intervalo' | '2t' | 'pos-eleicao';

export interface TimelineSource {
  title: string;
  publisher: string;
  url: string;
  publishedAt?: string;
}

export interface ElectionTimelineEvent {
  id: string; // Âncora URL, ex: "evento-2026-10-25-resultado-presidencial"
  title: string;
  occurredAt: string; // ISO ou YYYY-MM-DDTHH:mm
  displayDate: string; // Rótulo em português: "25 de outubro de 2026, às 21h08"
  period: TimelinePeriod;
  periodLabel: string;
  description: string;
  category: EventCategory;
  categoryLabel: string;
  scope: 'nacional' | 'estadual';
  uf?: string; // ex: 'RJ'
  sources: TimelineSource[];
  verification: EventVerification;
  verifiedAt?: string;
  highlights?: string[];
  isMilestone?: boolean;
  statusTag?: 'Realizado' | 'Previsto';
}

export interface TimelineFilterOptions {
  category?: EventCategory | 'all';
  period?: TimelinePeriod | 'all';
  scope?: 'all' | 'nacional' | 'estadual';
  uf?: string;
  searchQuery?: string;
}
