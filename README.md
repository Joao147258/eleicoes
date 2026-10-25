# Painel Eleitoral Brasil 🇧🇷

> **Painel independente de acompanhamento dos resultados eleitorais brasileiros com dados oficiais do Tribunal Superior Eleitoral (TSE).**

[![CI](https://github.com/Joao147258/eleicoes/actions/workflows/ci.yml/badge.svg)](https://github.com/Joao147258/eleicoes/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)

---

## ⚖️ Declaração de Independência

O **Painel Eleitoral Brasil** é uma iniciativa independente e de código aberto desenvolvida para fornecer visualizações claras, velozes e transparentes da apuração eleitoral brasileira.

**Este portal NÃO é um órgão oficial nem possui afiliação com a Justiça Eleitoral ou o TSE.**  
Todos os números, votos e percentuais são obtidos diretamente dos arquivos públicos oficiais disponibilizados pela infraestrutura de divulgação do Tribunal Superior Eleitoral (especificação EA20).

---

## ✨ Funcionalidades

- **Dashboard Nacional em Tempo Real:** Totalização para Presidente, votos absolutos, percentuais, diferença de votos e pontos percentuais, votos válidos, brancos, nulos, comparecimento e abstenção.
- **Mapa Interativo das 27 UFs:** Visualização vetorial interativa com coloração dinâmica por liderança partidária e tooltips informativos.
- **Tabela Comparativa dos Estados:** Ranking dos 26 estados + Distrito Federal com filtros regionais, busca e ordenação por ritmo de totalização ou vantagem.
- **Páginas Detalhadas por Estado:** Análise aprofundada da votação e seções apuradas em cada unidade da federação.
- **Eleição para Governadores:** Acompanhamento das disputas estaduais de segundo turno.
- **Atualização Automática:** Atualização em segundo plano via SWR sem necessidade de reload da página.
- **Acessibilidade & Dark Mode:** Interface moderna, responsiva, com suporte nativo a temas claro e escuro.

---

## 🛠️ Tecnologias

- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Validação de Contratos:** Zod
- **Cliente Reativo:** SWR
- **Ícones:** Lucide React
- **Testes Automatizados:** Vitest & Testing Library
- **CI / CD:** GitHub Actions
- **Deploy:** Hostinger Node.js Application

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 20+ (recomendado Node.js 22 ou 24)
- npm 10+

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Joao147258/eleicoes.git
   cd eleicoes
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env.local
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🧪 Qualidade e Testes

Execute a suíte completa de validação:

```bash
# Executar lint de código
npm run lint

# Verificação estrita de tipagem TypeScript
npm run typecheck

# Executar testes automatizados
npm run test:run

# Build de produção
npm run build
```

---

## 📐 Arquitetura

O projeto adota uma arquitetura em **monólito modular**, mantendo baixo acoplamento e independência de frameworks:

```text
src/
├── app/                  # Rotas e páginas do Next.js (App Router)
│   ├── api/eleicoes/     # Endpoints internos que encapsulam o TSE
│   ├── estados/          # Visão geral e detalhe por UF
│   ├── governadores/     # Disputas de governador em 2º turno
│   └── metodologia/      # Metodologia e transparência técnica
├── components/           # Componentes modulares reutilizáveis
│   ├── dashboard/        # Cabeçalho nacional e métricas
│   ├── maps/             # Mapa interativo vetorial do Brasil
│   ├── tables/           # Tabela comparativa e ordenável
│   └── layout/           # Navbar, Footer e temas
├── modules/elections/    # Domínio e Integração Eleitoral
│   ├── domain/           # Entidades e modelos eleitorais puros
│   └── infrastructure/   # Schemas Zod, Normalizador EA20 e TSE Client
└── data/geography/       # Informações geográficas e polígonos das 27 UFs
```

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
