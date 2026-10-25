# Desenvolvimento Local e Testes

## Pré-requisitos

- Node.js 20, 22 ou 24
- npm 10 ou superior
- Git

## Comandos Principais

```bash
# Instalação de dependências
npm install

# Execução em ambiente de desenvolvimento (porta 3000)
npm run dev

# Execução de testes automatizados com Vitest
npm run test:run

# Modo interativo de testes (watch)
npm run test

# Verificação de tipos TypeScript
npm run typecheck

# Análise de linting com ESLint
npm run lint

# Build otimizado de produção
npm run build

# Execução da build de produção
npm start
```

## Estrutura de Testes

Os testes estão concentrados no diretório `tests/`:
- `tests/fixtures/`: Arquivos reais do contrato EA20 do TSE para testes offline determinísticos.
- `tests/unit/`: Testes de regras de negócio, normalização de dados, schemas Zod e cálculos eleitorais.
- `tests/components/`: Testes de interface gráfica e interação com componentes via `@testing-library/react`.
