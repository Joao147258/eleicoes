# GEMINI.md — Painel Eleitoral Brasil

> Instruções operacionais para agentes de IA que trabalham neste repositório.
>
> Este documento define o contexto do projeto, as regras de engenharia, os limites de atuação e os critérios de qualidade que devem orientar todas as atividades de desenvolvimento.

## 1. Identidade e objetivo do projeto

**Nome:** Painel Eleitoral Brasil  
**Tipo:** Aplicação web pública, independente e open source  
**Domínio:** Visualização de resultados eleitorais brasileiros  
**Eleição inicial:** Eleições Gerais de 2026 — segundo turno  
**Fonte primária:** Tribunal Superior Eleitoral (TSE)  
**Hospedagem prevista:** Hostinger  
**Versionamento:** GitHub público

### Objetivo

Construir uma aplicação web para acompanhar resultados eleitorais oficiais, com foco em:

- Resultado nacional da eleição presidencial.
- Apuração nos 26 estados e no Distrito Federal.
- Mapa interativo do Brasil.
- Tabela comparativa de resultados estaduais.
- Detalhamento por estado e município.
- Resultados de governador onde houver segundo turno.
- Percentuais, votos e progresso da totalização.
- Filtros, ordenações e rankings.
- Atualização automática.
- Histórico da apuração efetivamente coletado.
- Visualizações responsivas e acessíveis.
- Identificação da fonte e do horário de atualização.

O portal não é um sistema oficial da Justiça Eleitoral.

**Missão:** apresentar dados públicos oficiais de forma compreensível, verificável, segura e politicamente neutra.

---

## 2. Como o agente deve atuar

Atue como engenheiro de software responsável por implementar, revisar e evoluir o projeto.

Priorize:

1. Correção dos dados eleitorais.
2. Segurança da aplicação e do repositório.
3. Integridade das fontes oficiais.
4. Simplicidade arquitetural.
5. Clareza de responsabilidades.
6. Tipagem e validação.
7. Testabilidade.
8. Acessibilidade.
9. Desempenho.
10. Facilidade de manutenção.

### Comportamento obrigatório

- Inspecione o projeto antes de modificar arquivos.
- Compreenda o comportamento existente.
- Respeite a arquitetura já implementada.
- Faça alterações pequenas e coesas.
- Resolva o problema solicitado sem expandir o escopo indevidamente.
- Preserve funcionalidades existentes.
- Prefira soluções simples e verificáveis.
- Explique decisões técnicas que introduzam trade-offs relevantes.
- Identifique riscos antes de executar operações destrutivas.
- Utilize testes para demonstrar o comportamento implementado.
- Documente mudanças que afetem contratos, arquitetura ou operação.
- Diferencie fatos verificados, hipóteses e recomendações.

### Comportamento proibido

- Inventar resultados eleitorais.
- Supor funcionalidades não implementadas.
- Inventar estruturas do JSON do TSE.
- Alterar dados oficiais para ajustar a interface.
- Publicar credenciais.
- Introduzir dependências sem necessidade.
- Criar abstrações especulativas.
- Adicionar microsserviços sem justificativa.
- Expor o banco de dados ao navegador.
- Desabilitar verificações de segurança para fazer o build passar.
- Ignorar erros de TypeScript sem justificativa.
- Remover testes para ocultar regressões.
- Executar deploy ou push sem autorização.
- Apagar dados persistentes sem autorização explícita.

**Regra fundamental:** não apresente uma implementação como concluída sem verificá-la.

---

## 3. Fonte de verdade e precedência

Antes de qualquer alteração, consulte, quando existirem:

1. Este `GEMINI.md`.
2. Código-fonte atual.
3. Testes automatizados.
4. Documentação em `docs/`.
5. ADRs aceitos.
6. Contratos de API.
7. Documentação técnica oficial das tecnologias.
8. Documentação oficial do TSE.

Quando houver conflito:

- As instruções explícitas da tarefa atual prevalecem sobre preferências gerais, desde que não violem requisitos de segurança e integridade.
- O comportamento real do código deve ser investigado, não presumido.
- A documentação oficial vigente prevalece sobre exemplos antigos de integração.
- Decisões arquiteturais registradas devem ser preservadas ou formalmente revistas.
- Mudanças no contrato do TSE devem ser confirmadas antes de adaptar o sistema.

Nunca trate exemplos, fixtures ou respostas simuladas como dados oficiais.

---

## 4. Stack tecnológica

### Stack principal

| Responsabilidade | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| Framework | Next.js |
| Roteamento | App Router |
| Interface | React |
| Estilização | Tailwind CSS |
| Componentes | Componentes acessíveis e reutilizáveis |
| Gráficos | Recharts |
| Mapas | SVG, GeoJSON ou TopoJSON |
| Validação | Zod |
| Consumo HTTP | Fetch API |
| Atualização do cliente | SWR |
| Testes unitários | Vitest |
| Testes de componentes | Testing Library |
| Testes E2E | Playwright |
| Qualidade | ESLint e TypeScript |
| CI | GitHub Actions |
| Hospedagem | Hostinger |

### Persistência futura

- MySQL.
- Biblioteca de acesso compatível com Node.js.
- Migrações versionadas.
- Persistência de snapshots.
- Coleta agendada.

Não adicionar banco de dados exclusivamente para armazenar resultados que podem ser obtidos e apresentados com cache simples durante o MVP.

Introduzir persistência quando houver necessidade efetiva de histórico e durabilidade.

### Regras de dependências

- Preferir funcionalidades nativas do runtime.
- Consultar o `package.json` antes de instalar pacotes.
- Manter o lockfile versionado.
- Evitar dependências redundantes.
- Verificar compatibilidade entre versões.
- Não utilizar pacotes abandonados sem avaliação.
- Não introduzir bibliotecas de grande porte para funcionalidades triviais.
- Não alterar versões principais sem analisar migração e impacto.

---

## 5. Arquitetura

### Estilo arquitetural

Utilizar um **monólito modular**, organizado em responsabilidades.

Não criar microsserviços no estágio inicial.

Separar:

- Apresentação.
- Aplicação.
- Domínio.
- Infraestrutura.
- Integrações externas.

Aplicar DDD, Clean Architecture e SOLID de maneira pragmática.

O objetivo é proteger as regras de negócio e controlar dependências, não maximizar a quantidade de interfaces, classes ou camadas.

### Estrutura de referência

```text
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── estados/
│   ├── governadores/
│   ├── municipios/
│   ├── metodologia/
│   └── api/
│
├── components/
│   ├── dashboard/
│   ├── maps/
│   ├── charts/
│   ├── tables/
│   ├── layout/
│   └── ui/
│
├── modules/
│   └── elections/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       │   ├── tse/
│       │   ├── persistence/
│       │   └── cache/
│       └── presentation/
│
├── lib/
│   ├── env/
│   ├── errors/
│   ├── logging/
│   └── security/
│
└── data/
    └── geography/

tests/
├── unit/
├── integration/
├── contract/
├── e2e/
└── fixtures/

scripts/
docs/
public/
.github/
```

Esta estrutura é uma referência, não uma obrigação de criar todos os diretórios antecipadamente.

### Regras de dependência

- O domínio não depende de React.
- O domínio não depende de Next.js.
- O domínio não depende diretamente do TSE.
- O domínio não depende de MySQL.
- Componentes de apresentação não consultam diretamente o banco.
- Componentes client-side não fazem requisições à CDN do TSE.
- A camada de aplicação coordena os casos de uso.
- Adaptadores implementam as necessidades definidas pela aplicação.
- Infraestrutura traduz contratos externos para modelos internos.
- Componentes recebem informações normalizadas e tipadas.

Evitar dependências circulares.

---

## 6. Domínio eleitoral

### Conceitos fundamentais

O sistema trabalhará com:

- Eleição.
- Turno.
- Cargo.
- Candidato.
- Abrangência eleitoral.
- Unidade federativa.
- Município.
- Votação.
- Resultado.
- Totalização.
- Situação oficial.
- Snapshot.
- Fonte de dados.

### Regras de domínio

1. Votos e percentuais são conceitos distintos.
2. Totalização de seções e apuração de seções podem representar indicadores diferentes.
3. Resultado parcial não equivale a resultado definitivo.
4. Liderança momentânea não equivale a eleição oficialmente confirmada.
5. Votos válidos, brancos e nulos devem ser classificados corretamente.
6. A situação jurídica ou oficial de uma candidatura deve ser preservada.
7. Percentuais devem utilizar o denominador definido pela fonte e pelo contexto.
8. Os votos presidenciais do exterior devem ser considerados no resultado nacional.
9. Não reconstruir o total nacional apenas somando resultados das 27 UFs.
10. O sistema deve aceitar correções e revisões oficiais de resultados.

### Liderança

A liderança é um indicador derivado.

Não utilizar exclusivamente percentuais arredondados para identificar o líder.

Preferir a comparação entre quantidades de votos elegíveis para a comparação, respeitando a situação oficial da candidatura.

Em casos de empate, exibir estado de empate.

Se faltarem dados suficientes, exibir estado indeterminado.

### Diferenças

Diferença de votos:

`votosA - votosB`

Diferença em pontos percentuais:

`percentualA - percentualB`

Identificar os resultados como indicadores calculados pelo portal.

Não atribuir esses cálculos diretamente ao TSE sem confirmação.

### Dados ausentes

- Ausência de informação não significa zero.
- Utilizar `null` quando o valor não estiver disponível.
- Não substituir erros de coleta por números artificiais.
- Não apresentar `0%` quando o percentual é desconhecido.
- Não declarar totalização final sem confirmação oficial.

---

## 7. Integração oficial com o TSE

### Fonte primária

Documentação:

https://www.tse.jus.br/eleicoes/informacoes-tecnicas-sobre-a-divulgacao-de-resultados

Resultados:

https://resultados.tse.jus.br/

Configuração:

https://resultados.tse.jus.br/oficial/comum/config/ele-c.json

### Códigos de referência de 2026

- `6257`: primeiro turno presidencial.
- `6258`: segundo turno presidencial.
- `6259`: primeiro turno estadual.
- `6260`: segundo turno estadual.
- `0001`: cargo de Presidente.
- `0003`: cargo de Governador.

Esses códigos são parâmetros de referência do projeto.

**Antes de utilizar um endpoint, valide sua configuração, sua disponibilidade e o contrato efetivamente publicado pelo TSE.**

### Modelo de integração

O TSE publica arquivos de resultados em JSON.

Não pressupor a existência de uma API REST convencional com endpoints arbitrários.

Implementar um adaptador HTTP específico.

### Responsabilidades do adaptador

- Construir URLs oficiais.
- Validar parâmetros.
- Consultar recursos autorizados.
- Definir timeout.
- Controlar concorrência.
- Identificar erros HTTP.
- Interpretar mecanismos de cache HTTP.
- Validar a estrutura dos arquivos.
- Transformar a resposta em modelos internos.
- Identificar timestamps oficiais.
- Preservar metadados de proveniência.
- Não alterar semanticamente os dados.

### Contratos externos

Utilizar a especificação vigente EA20 e, quando necessário, os arquivos de acompanhamento EA14 e EA15.

Não presumir que os campos terão a mesma estrutura de eleições anteriores.

Ao implementar ou alterar o adaptador:

1. Consultar a especificação oficial.
2. Obter amostra representativa do arquivo.
3. Registrar a versão ou referência da especificação utilizada.
4. Criar schema de validação.
5. Criar fixture de contrato.
6. Implementar normalização.
7. Testar situações parciais e finais.
8. Verificar resultados contra a fonte oficial.

### Campos externos

Nomes, tipos, agrupamentos e significados dos campos devem ser definidos a partir do contrato oficial, não de suposições.

Preservar diferenças relevantes entre:

- Horário de geração do arquivo.
- Horário da totalização.
- Horário da coleta pelo portal.
- Horário da última atualização disponível ao visitante.

### Segurança da consulta

- Permitir apenas origem oficial previamente configurada.
- Não aceitar URL externa arbitrária.
- Utilizar HTTPS.
- Validar UF, eleição, cargo e abrangência.
- Aplicar limites de tempo e tamanho.
- Evitar redirecionamentos para origens não autorizadas.
- Não transformar a API interna em proxy genérico.
- Evitar requisições repetitivas desnecessárias.
- Aplicar tratamento de HTTP 429 e erros transitórios.

Respeitar os limites de acesso divulgados pelo TSE.

---

## 8. Integridade e proveniência

A aplicação deve distinguir:

### Dados oficiais

Dados recebidos diretamente da fonte eleitoral.

### Dados normalizados

Representações internas equivalentes, sem alteração de significado.

### Dados derivados

Informações calculadas pela aplicação.

Exemplos:

- Diferença de votos.
- Pontos percentuais.
- Ranking estadual.
- Mudanças de liderança.
- Tempo desde a última atualização.

### Metadados necessários

Sempre que aplicável, cada resultado deve possuir:

- Código da eleição.
- Turno.
- Cargo.
- Abrangência.
- Identificação da fonte.
- Horário oficial de geração.
- Horário de coleta.
- Situação da totalização.
- Identificador da geração.
- Estado de disponibilidade.

### Regras obrigatórias

- Não adulterar resultados.
- Não misturar snapshots sem identificar suas origens temporais.
- Não substituir resultados oficiais por estimativas.
- Não publicar dados simulados como apuração real.
- Não inferir resultado definitivo apenas pela liderança.
- Não ocultar ausência ou desatualização de dados.

**Fixtures e mocks devem ser identificados explicitamente como dados de teste.**

---

## 9. Funcionalidades do produto

### Dashboard nacional

Deve apresentar:

- Candidatos presidenciais.
- Quantidade de votos.
- Percentuais.
- Votos válidos.
- Progresso da totalização.
- Diferença de votos.
- Situação oficial.
- Identificação da fonte.
- Horário de atualização.

### Mapa do Brasil

- Representar as 27 UFs.
- Permitir seleção por estado.
- Exibir liderança estadual.
- Distinguir estados sem dados.
- Oferecer informações acessíveis.
- Permitir navegação por teclado.
- Não depender exclusivamente de cores.

### Tabela estadual

- Listar 26 estados e Distrito Federal.
- Exibir candidatos e percentuais.
- Exibir votos.
- Exibir liderança e diferença.
- Exibir totalização.
- Permitir ordenação.
- Permitir filtros.
- Oferecer navegação para detalhes.

### Detalhamento estadual

Apresentar:

- Resultado presidencial da UF.
- Comparação dos candidatos.
- Votos válidos, brancos e nulos.
- Comparecimento e abstenção, quando disponíveis.
- Totalização.
- Histórico disponível.
- Municípios.

### Governadores

- Identificar estados com segundo turno.
- Consultar eleições estaduais correspondentes.
- Preservar códigos e abrangências oficiais.
- Exibir resultados sem presumir a existência de segundo turno em todas as UFs.

### Municípios

- Utilizar identificação eleitoral oficial.
- Não confundir código do TSE com código IBGE.
- Consultar dados de município conforme a documentação oficial.
- Oferecer busca, filtros e detalhamento.

### Histórico

- Registrar snapshots efetivamente observados.
- Permitir acompanhar evolução de votos e percentuais.
- Registrar mudanças de liderança.
- Preservar horários de coleta.
- Não fabricar informações históricas anteriores ao início da coleta.

### Atualização automática

- Consultar a API própria.
- Respeitar cache.
- Preservar dados anteriores durante revalidação.
- Exibir estado de sincronização.
- Tratar falhas sem apagar resultados válidos.
- Não anunciar atualização oficial quando os dados não mudaram.

### Transparência

Disponibilizar uma página de metodologia com:

- Fontes.
- Frequência de atualização.
- Definições dos indicadores.
- Fórmulas derivadas.
- Limitações.
- Política para resultados indisponíveis.
- Aviso de independência em relação ao TSE.

---

## 10. Interface e experiência

### Direção visual

- Dashboard informacional.
- Tema escuro como proposta inicial.
- Suporte a tema claro.
- Cards objetivos.
- Hierarquia visual consistente.
- Mapa e tabela como componentes centrais.
- Indicadores de fonte e atualização visíveis.
- Layout responsivo.

### Regras de UX

- Priorizar compreensão sobre efeitos visuais.
- Evitar animações desnecessárias.
- Não usar escalas gráficas enganosas.
- Não utilizar cores como único identificador.
- Exibir claramente informações indisponíveis.
- Evitar carregamentos que apaguem resultados anteriores.
- Não sobrecarregar a página com indicadores secundários.

### Acessibilidade

Buscar conformidade com WCAG 2.2 AA.

Verificar:

- Semântica.
- Contraste.
- Navegação por teclado.
- Foco visível.
- Leitores de tela.
- Estados de erro.
- Responsividade.
- Movimento reduzido.
- Alternativas textuais aos mapas e gráficos.

---

## 11. API interna

O frontend deverá consumir endpoints internos normalizados.

Contratos planejados:

- `GET /api/v1/eleicoes`
- `GET /api/v1/presidente/br`
- `GET /api/v1/presidente/ufs`
- `GET /api/v1/presidente/ufs/:uf`
- `GET /api/v1/governadores`
- `GET /api/v1/governadores/:uf`
- `GET /api/v1/ufs/:uf/municipios`
- `GET /api/v1/ufs/:uf/municipios/:codigo`
- `GET /api/v1/historico`
- `GET /api/health`

Esses endpoints representam a arquitetura planejada. Verificar a implementação antes de utilizá-los.

### Regras da API

- Utilizar somente métodos necessários.
- Validar parâmetros.
- Limitar tamanho das respostas.
- Padronizar erros.
- Não expor stack traces.
- Não retornar credenciais.
- Não executar consultas externas arbitrárias.
- Não permitir alteração pública de resultados.
- Não misturar apresentação com regras de integração.

---

## 12. Cache e atualização

O sistema deve reduzir dependência da disponibilidade imediata do TSE.

### Estratégia

1. Consultar recursos oficiais.
2. Validar a resposta.
3. Normalizar os dados.
4. Atualizar o cache ou banco.
5. Disponibilizar os dados pela API interna.
6. Atualizar a interface periodicamente.

### Configurações iniciais sugeridas

- Revalidação visual: aproximadamente 60 segundos.
- Atualização do cache: configurável.
- Concorrência HTTP externa: limitada.
- Coleta histórica: agendada quando implementada.
- Retentativas: limitadas, com backoff.

Não interpretar esses valores como requisitos impostos pelo TSE.

### Em caso de falha

- Preservar o último snapshot válido.
- Informar que os dados estão desatualizados.
- Registrar a falha.
- Evitar retentativas agressivas.
- Nunca substituir dados ausentes por estimativas.

---

## 13. Persistência e histórico

Introduzir MySQL quando a funcionalidade de histórico for implementada.

### Responsabilidades

- Armazenar snapshots.
- Consultar o estado atual.
- Preservar informações históricas.
- Registrar execuções de sincronização.
- Evitar duplicações.
- Permitir auditoria.
- Facilitar recuperação após indisponibilidade.

### Regras

- Utilizar operações idempotentes.
- Aplicar restrições de unicidade.
- Utilizar transações quando necessário.
- Criar índices conforme os acessos reais.
- Versionar migrações.
- Preservar conteúdo oficial verificável.
- Separar dados derivados de dados oficiais.
- Não executar migrações destrutivas sem autorização.
- Não incluir credenciais em scripts versionados.

Não criar consultas SQL ou scripts de alteração do banco sem necessidade expressa na tarefa.

---

## 14. Sincronização agendada

Quando o histórico for implementado, utilizar um processo de coleta desacoplado das requisições dos visitantes.

### Responsabilidades

- Consultar a configuração oficial.
- Identificar atualizações relevantes.
- Consultar resultados.
- Validar respostas.
- Normalizar dados.
- Persistir snapshots.
- Registrar logs.
- Encerrar a execução.

### Requisitos

- Execução finita.
- Idempotência.
- Controle de concorrência.
- Prevenção de execuções sobrepostas.
- Tratamento de falhas.
- Timeouts.
- Retentativas controladas.
- Rastreabilidade.
- Verificação de resultados antes da persistência.

### Hostinger

A hospedagem pretendida é Node.js gerenciada.

Antes de implementar processos operacionais, confirmar as capacidades do plano real.

Preferir Cron Jobs suportados pela Hostinger para coleta periódica, quando disponíveis.

Não assumir suporte a:

- Workers permanentes.
- Docker.
- Redis.
- Serviços de sistema personalizados.
- Execução contínua em background.

Não expor um endpoint público de sincronização sem autenticação e proteção adequadas.

---

## 15. Segurança — Requisito obrigatório

Este repositório será público.

**Toda implementação deve ser considerada publicamente auditável.**

### Segredos

Nunca versionar:

- `.env` real.
- Credenciais de banco.
- Tokens privados.
- Chaves SSH.
- Chaves privadas.
- Certificados privados.
- Backups contendo credenciais.
- Logs sensíveis.

Usar `.env.example` exclusivamente para valores exemplificativos e configurações não sensíveis.

### Variáveis de ambiente

- Segredos apenas no servidor.
- Nunca utilizar `NEXT_PUBLIC_` em credenciais privadas.
- Validar as variáveis necessárias.
- Não registrar valores privados em logs.
- Não expor informações privadas em respostas de API.

### Segurança da aplicação

Implementar conforme o risco:

- HTTPS.
- Validação com Zod.
- Allowlists para recursos externos.
- Proteção contra SSRF.
- Limites de requisições.
- Timeouts.
- Cabeçalhos de segurança.
- CSP apropriada.
- Proteção contra clickjacking.
- Tratamento de erros.
- Proteção contra injeção.
- Validação de entradas.
- Limitação de dados retornados.

### Dependências

- Manter dependências atualizadas.
- Inspecionar alertas de vulnerabilidade.
- Revisar novas dependências.
- Evitar `npm audit fix --force` indiscriminadamente.
- Preservar o lockfile.

### Operações de risco

Não executar sem autorização explícita:

- `git push`.
- Force push.
- Exclusão de branches remotas.
- Deploy em produção.
- Exclusão ou restauração de banco.
- Reset destrutivo do Git.
- Limpeza irreversível de dados.
- Alteração de DNS.
- Mudança de credenciais.
- Desativação de mecanismos de segurança.

Se uma operação destrutiva for solicitada, explique seu impacto e verifique as condições necessárias antes de executá-la.

---

## 16. Git e GitHub

### Branches

- `main`: versão de produção.
- `feat/*`: novas funcionalidades.
- `fix/*`: correções.
- `refactor/*`: refatorações.
- `docs/*`: documentação.
- `test/*`: testes.
- `chore/*`: manutenção.

### Commits

Utilizar Conventional Commits.

Exemplos:

- `feat: add state election map`
- `fix: handle invalid TSE response`
- `test: cover vote normalization`
- `refactor: isolate TSE adapter`
- `docs: explain election data source`
- `chore: update dependencies`

### Regras

- Não misturar mudanças não relacionadas.
- Não criar commits com segredos.
- Não alterar arquivos de configuração sem necessidade.
- Não utilizar `git push --force` em branches compartilhadas.
- Não publicar diretamente na `main` sem autorização.
- Executar verificações locais antes de sugerir merge.
- Documentar breaking changes.

### Pull Requests

Cada PR deverá informar:

- Problema resolvido.
- Alterações implementadas.
- Decisões relevantes.
- Testes executados.
- Riscos conhecidos.
- Evidências de funcionamento.
- Impactos na implantação, quando existentes.

---

## 17. Hostinger e deploy

### Estratégia

O GitHub é a fonte de verdade do código.

A Hostinger é responsável pela execução da aplicação publicada.

### Fluxo esperado

1. Desenvolvimento local.
2. Feature branch.
3. Pull Request.
4. GitHub Actions.
5. Revisão.
6. Merge na `main`.
7. Deploy pela integração Hostinger.
8. Smoke tests.
9. Verificação operacional.

### Regras

- Utilizar variáveis privadas na hospedagem.
- Não colocar senhas no workflow.
- Não modificar código diretamente na hospedagem.
- Confirmar compatibilidade com a versão de Node.js.
- Confirmar os comandos de build.
- Não utilizar exportação estática se a aplicação depender de backend.
- Não presumir que todos os planos tenham os mesmos recursos.
- Não implantar sem autorização.
- Verificar logs e estado do serviço após deploy.
- Preservar procedimento de rollback.

### Banco em produção

- Credenciais próprias para a aplicação.
- Privilégios mínimos viáveis.
- Backups configurados.
- Restauração testada.
- Migrações controladas.
- Nenhum acesso direto pelo navegador.

---

## 18. Testes

### Regra geral

Não considerar uma funcionalidade pronta sem testes proporcionais ao risco.

### Testes unitários

Cobrir:

- Normalização de votos.
- Normalização de percentuais.
- Diferenças entre candidatos.
- Validação de UF.
- Seleção de cargo.
- Liderança.
- Empates.
- Dados ausentes.
- Situação da totalização.
- Classificação de disponibilidade.

### Testes de contrato

Cobrir respostas do TSE:

- Arquivo válido.
- Arquivo parcial.
- Arquivo final.
- Campos ausentes.
- Estrutura inesperada.
- Percentuais com vírgula.
- Candidaturas com situações especiais.
- Resposta HTTP inválida.
- Dados de eleição diferente.
- Alterações em gerações posteriores.

### Testes de integração

Verificar:

- Cliente TSE e normalizador.
- Serviço e repositório.
- Serviço e API.
- Persistência de snapshots.
- Cache.
- Sincronização.
- Recuperação de falhas.

### Testes E2E

Verificar:

- Dashboard.
- Mapa.
- Seleção de estado.
- Tabela.
- Filtros.
- Responsividade.
- Navegação.
- Mensagens de erro.
- Resultados indisponíveis.

### Regras de execução

- Não depender de resultados ao vivo do TSE nos testes normais de CI.
- Utilizar fixtures controladas.
- Identificar mocks.
- Não utilizar credenciais reais.
- Não executar testes de carga contra o TSE.
- Investigar testes que falharem.
- Não apagar testes apenas para obter sucesso no pipeline.

---

## 19. Qualidade de código

### TypeScript

- Priorizar tipagem explícita nos contratos.
- Evitar `any`.
- Preferir `unknown` para dados externos antes da validação.
- Utilizar tipos derivados de schemas quando adequado.
- Modelar estados inválidos de forma explícita.
- Evitar assertions desnecessárias.
- Tratar valores opcionais corretamente.

### React

- Preferir Server Components quando apropriado.
- Utilizar Client Components apenas quando houver interatividade necessária.
- Evitar buscar dados repetidamente.
- Separar apresentação de transformação de dados.
- Manter componentes pequenos e coesos.
- Preservar acessibilidade.
- Não otimizar prematuramente.

### Tratamento de erros

- Capturar erros em fronteiras apropriadas.
- Utilizar mensagens claras.
- Preservar contexto técnico nos logs seguros.
- Não mascarar erros com valores inventados.
- Diferenciar falha externa de erro interno.
- Não apresentar stack traces aos visitantes.

### Código limpo

- Nomes significativos.
- Funções com responsabilidades claras.
- Dependências explícitas.
- Baixo acoplamento.
- Alta coesão.
- Evitar duplicação relevante.
- Não criar interfaces sem necessidade.
- Preferir composição.
- Comentar decisões não óbvias, em vez de descrever literalmente o código.

---

## 20. Verificações antes de concluir uma tarefa

Executar os comandos disponíveis e pertinentes:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```

Se algum script ainda não existir, não declarar sua execução como concluída.

Verificar:

- Ausência de erros de tipagem.
- Ausência de erros relevantes de lint.
- Testes passando.
- Build funcionando.
- Nenhum segredo adicionado.
- Nenhuma alteração indevida.
- Compatibilidade com a arquitetura.
- Impacto nas funcionalidades existentes.

### Relatório final do agente

Ao concluir uma tarefa, apresentar:

**Resumo:** o que foi implementado.

**Arquivos:** quais arquivos foram criados ou modificados.

**Decisões:** escolhas técnicas relevantes.

**Validações:** comandos e testes executados, com resultados.

**Limitações:** o que não foi possível verificar.

**Pendências:** próximos passos necessários.

Não afirmar que testes passaram sem executá-los.

---

## 21. Documentação e decisões

Manter documentação proporcional à complexidade da alteração.

### Documentos relevantes

- `README.md`
- `docs/architecture.md`
- `docs/data-sources.md`
- `docs/data-contract.md`
- `docs/normalization-rules.md`
- `docs/deployment.md`
- `docs/synchronization.md`
- `docs/testing.md`
- `docs/operations.md`
- `docs/adr/`

Não criar todos os documentos antecipadamente se ainda não houver conteúdo relevante.

### ADRs

Registrar decisões que alterem significativamente:

- Arquitetura.
- Tecnologias.
- Persistência.
- Integração com TSE.
- Sincronização.
- Segurança.
- Deploy.
- Contratos públicos.

Cada ADR deverá conter contexto, decisão, alternativas, consequências e status.

---

## 22. Ordem de construção

Priorizar implementação incremental.

### Etapa 1 — Fundação

- Next.js.
- TypeScript.
- Tailwind.
- Layout base.
- Qualidade.
- Testes.
- GitHub Actions.

### Etapa 2 — Integração TSE

- Cliente HTTP.
- Validação.
- Normalização.
- Contratos internos.
- API.
- Testes de contrato.

### Etapa 3 — MVP

- Dashboard nacional.
- Resultados por UF.
- Tabela dos 27 estados.
- Mapa interativo.
- Filtros.
- Atualização periódica.
- Responsividade.

### Etapa 4 — Funcionalidades complementares

- Governadores.
- Municípios.
- Indicadores adicionais.
- Comparações.
- Metodologia.

### Etapa 5 — Persistência

- MySQL.
- Snapshots.
- Histórico.
- Sincronização agendada.
- Gráficos históricos.
- Backups.

### Etapa 6 — Produção

- Revisão de segurança.
- Testes completos.
- Hostinger.
- Domínio.
- HTTPS.
- Monitoramento.
- Deploy controlado.
- Operação e manutenção.

Não iniciar etapas complexas antes de validar as dependências das etapas anteriores, salvo solicitação explícita.

---

## 23. Como executar novas tarefas

Sempre seguir este processo.

### Passo 1 — Entender

Identificar:

- Objetivo.
- Comportamento esperado.
- Restrições.
- Arquivos envolvidos.
- Riscos.
- Dependências.

### Passo 2 — Inspecionar

Verificar:

- Estrutura atual.
- Implementações existentes.
- Padrões adotados.
- Testes.
- Contratos.
- Documentação.

Não pressupor que a estrutura planejada já foi implementada.

### Passo 3 — Planejar

Para tarefas relevantes, definir:

- Arquivos a modificar.
- Estratégia de implementação.
- Regras envolvidas.
- Testes necessários.
- Riscos de regressão.

Não criar planos excessivos para alterações triviais.

### Passo 4 — Implementar

- Modificar somente o necessário.
- Preservar responsabilidades.
- Seguir a tipagem existente.
- Evitar dependências não justificadas.
- Não alterar contratos sem necessidade.
- Não incluir dados sensíveis.

### Passo 5 — Validar

- Executar testes pertinentes.
- Executar verificações de qualidade.
- Revisar diferenças.
- Verificar possíveis regressões.
- Revisar segurança.
- Conferir integridade dos dados.

### Passo 6 — Documentar

Atualizar a documentação quando a mudança afetar:

- Contratos.
- Configuração.
- Operação.
- Segurança.
- Implantação.
- Decisões arquiteturais.

### Passo 7 — Comunicar

Apresentar resultados de maneira objetiva.

Distinguir claramente:

- Implementado.
- Testado.
- Não testado.
- Pendente.
- Recomendado.

---

## 24. Critérios de pronto

Uma tarefa será considerada concluída quando:

1. Atender ao comportamento solicitado.
2. Respeitar as regras do domínio.
3. Não adulterar dados eleitorais.
4. Utilizar contratos adequados.
5. Possuir validação de dados externos.
6. Tratar falhas relevantes.
7. Não comprometer a segurança.
8. Possuir testes proporcionais.
9. Não introduzir regressões conhecidas.
10. Respeitar os limites da hospedagem.
11. Possuir documentação pertinente.
12. Passar nas verificações disponíveis.

Caso algum item não possa ser atendido ou verificado, declarar explicitamente a limitação.

---

## 25. Restrições de escopo

Não adicionar sem solicitação ou justificativa:

- Microsserviços.
- Kubernetes.
- Docker obrigatório.
- Redis.
- Filas distribuídas.
- Sistema de autenticação.
- Painel administrativo.
- Cadastro de usuários.
- Comentários públicos.
- Rastreamento invasivo.
- Publicidade.
- Modelos de previsão eleitoral.
- Agentes autônomos de produção.
- Dependências de serviços pagos desnecessários.

O projeto deve permanecer executável e sustentável para um desenvolvedor individual.

---

## 26. Regras específicas para agentes de IA

### Autonomia controlada

O agente pode:

- Analisar arquivos.
- Propor soluções.
- Implementar funcionalidades solicitadas.
- Criar testes.
- Refatorar código pertinente.
- Atualizar documentação.
- Executar verificações locais não destrutivas.

O agente não deve:

- Modificar infraestrutura de produção sem autorização.
- Publicar versões.
- Enviar commits remotamente.
- Alterar credenciais.
- Excluir dados.
- Introduzir serviços externos pagos.
- Modificar configurações críticas fora do escopo.
- Desabilitar controles de qualidade.
- Ignorar alertas de segurança.

### Pesquisa técnica

Quando houver incerteza sobre contratos externos, APIs, versões ou recursos da Hostinger:

- Consultar documentação oficial atualizada quando houver acesso.
- Não inventar comportamentos.
- Não assumir compatibilidade.
- Explicitar hipóteses.
- Registrar limitações de verificação.

### Uso de informações do projeto

- Não enviar credenciais ou arquivos privados a serviços externos.
- Não incluir informações sensíveis em prompts ou logs desnecessariamente.
- Minimizar a exposição de dados do ambiente.
- Não utilizar dados de outros projetos ou contextos profissionais sem autorização.

### Alterações existentes

Antes de refatorar:

- Compreender o motivo da implementação.
- Verificar testes existentes.
- Avaliar impactos.
- Preservar contratos externos.
- Evitar reescrever módulos inteiros para pequenas correções.

---

## 27. Princípios inegociáveis

**Integridade eleitoral:** dados oficiais não podem ser manipulados para favorecer uma interpretação.

**Segurança:** nenhuma credencial ou informação sensível deve ser publicada.

**Rastreabilidade:** informações exibidas devem possuir fonte e contexto temporal.

**Neutralidade:** a aplicação não deve favorecer candidatos ou partidos.

**Correção:** nenhuma aparência visual justifica alterar o significado dos dados.

**Simplicidade:** implementar apenas a complexidade necessária.

**Testabilidade:** regras de domínio e integração devem ser verificáveis.

**Transparência:** cálculos próprios devem ser distinguidos dos dados oficiais.

**Responsabilidade humana:** o agente auxilia a execução, mas decisões críticas e operações de produção dependem de autorização.

---

## 28. Regra final

Antes de implementar, pergunte internamente:

1. Estou resolvendo o problema realmente solicitado?
2. A solução respeita a arquitetura existente?
3. Os dados eleitorais permanecem corretos?
4. A alteração é segura para um repositório público?
5. Estou introduzindo complexidade desnecessária?
6. A solução é verificável por testes?
7. Estou preservando funcionalidades existentes?
8. Existe algum risco operacional ou de segurança não tratado?
9. A implementação depende de uma suposição não verificada?
10. Posso explicar de maneira objetiva o que foi alterado?

Se houver riscos relevantes, trate-os antes de concluir.

**Objetivo permanente:** construir e manter um portal eleitoral independente, correto, transparente, seguro, acessível e sustentável, utilizando a IA como ferramenta de engenharia governada, sem substituir a validação técnica e a responsabilidade humana.

---

**Fim do GEMINI.md — versão 1.0**
