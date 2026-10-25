# Arquitetura — Painel Eleitoral Brasil

## 1. Visão Geral

O **Painel Eleitoral Brasil** foi concebido como um **monólito modular** desenvolvido sobre Next.js (App Router), TypeScript e Tailwind CSS. O projeto prioriza baixo acoplamento, alta testabilidade e isolamento rígido entre o domínio eleitoral e os provedores de dados externos.

```text
[ Navegador / Usuário ]
          │
          ▼
[ Next.js App Router (Páginas & Componentes UI) ]
          │ (Requisições HTTP locais a /api/eleicoes/*)
          ▼
[ API Routes Internas (/api/eleicoes) ]
          │
          ├── [ Cache em Memória / Stale-While-Revalidate ]
          ▼
[ Módulo de Eleições: Domínio & Infraestrutura ]
          │
          ├── Domain: Modelos puros e cálculos de liderança/margem
          ├── Schemas Zod: Validação estrita do contrato EA20
          ├── Normalizador: Conversão desacoplada para modelos de domínio
          └── TseClient: Cliente HTTP resiliente com timeout e headers seguros
          │
          ▼
[ Tribunal Superior Eleitoral (TSE CDN Pública Oficial) ]
```

## 2. Princípios de Separação de Camadas

- **Domínio Puro (`src/modules/elections/domain`)**: Independente de frameworks (Next.js, React) e de bancos de dados. Contém entidades puras (`ElectionSummary`, `CandidateResult`, `ProgressStats`, `LeaderInfo`).
- **Infraestrutura TSE (`src/modules/elections/infrastructure/tse`)**: Encapsula os schemas Zod de validação externa, o normalizador do arquivo unificado EA20 e o cliente HTTP resiliente com controle de concorrência e timeout.
- **Camada de Apresentação (`src/components` e `src/app`)**: Componentes React reutilizáveis que consomem exclusivamente as APIs internas via hooks reativos (SWR), jamais se conectando diretamente à CDN do TSE.

## 3. Decisões Arquiteturais Relevantes (ADR)

- **ADR 001 - Monólito Modular vs Microsserviços:** Optou-se por monólito modular devido à simplicidade operacional, facilidade de deploy na Hostinger e ausência de necessidade de orquestração complexa de múltiplos serviços.
- **ADR 002 - Cache em Memória + HTTP Headers:** Implementou-se cache de curta duração (15 a 20s) no runtime do Node.js combinado com `stale-while-revalidate` nos cabeçalhos HTTP, assegurando proteção contra sobrecarga ao TSE e latência na faixa dos milissegundos para o usuário final.
- **ADR 003 - Validação de Contratos com Zod:** Todas as respostas da fonte primária passam por parsing estrito de tipos, garantindo que qualquer anomalia no formato dos arquivos JSON seja detectada imediatamente sem corromper a interface gráfica.
