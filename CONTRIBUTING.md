# Guia de Contribuição — Painel Eleitoral Brasil

Agradecemos o interesse em contribuir com o **Painel Eleitoral Brasil**, um projeto independente de código aberto para acompanhamento dos resultados eleitorais brasileiros com dados oficiais do TSE.

## Diretrizes Fundamentais

1. **Neutralidade Política Rigorosa**: O portal não toma partido e apresenta os dados oficiais da totalização do Tribunal Superior Eleitoral de forma estritamente transparente e verificável.
2. **Integridade de Dados**: Nenhuma informação pode ser inventada, distorcida ou arredondada de forma a induzir interpretações incorretas.
3. **Padrão de Engenharia**:
   - Monólito modular (Next.js App Router + TypeScript + Tailwind CSS).
   - Validação com Zod em todas as fronteiras de dados externos.
   - Testes automatizados obrigatórios (Vitest / Testing Library).
   - Quality gates: `npm run lint`, `npm run typecheck`, `npm run test:run`, `npm run build`.

## Fluxo de Trabalho

1. Crie uma branch para a sua funcionalidade: `git checkout -b feature/sua-feature`.
2. Implemente suas alterações e garanta cobertura de testes.
3. Execute as validações locais:
   ```bash
   npm run lint
   npm run typecheck
   npm run test:run
   npm run build
   ```
4. Abra um Pull Request com descrição clara das mudanças e evidências de testes.
