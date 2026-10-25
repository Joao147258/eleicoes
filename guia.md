```markdown
# Guia de Desenvolvimento — Painel Eleitoral Brasil

**Versão:** 1.0\
**Data de referência:** 25/10/2026\
**Status:** Especificação de construção\
**Tipo:** Projeto pessoal, independente e open source\
**Tecnologias:** Next.js, TypeScript, React, Node.js e MySQL (quando necessário)\
**Hospedagem:** Hostinger\
**Repositório:** GitHub público\
**Fonte primária dos resultados:** Tribunal Superior Eleitoral (TSE)

---

# 1. Visão geral do projeto

## 1.1. Objetivo

Desenvolver um portal público de acompanhamento dos resultados das Eleições Gerais de 2026, priorizando o segundo turno.

O sistema deverá apresentar os resultados nacionais e estaduais em uma interface responsiva, com mapas interativos, indicadores, rankings, filtros, gráficos e histórico da apuração.

O portal consumirá os dados oficiais do TSE, sem depender de portais jornalísticos intermediários.

## 1.2. Princípios do produto

1. **Neutralidade:** apresentar os resultados sem favorecimento político.

2. **Confiabilidade:** preservar a integridade e o significado dos dados oficiais.

3. **Transparência:** identificar fontes, horários e metodologia.

4. **Atualização:** oferecer dados recentes sem sobrecarregar o TSE.

5. **Acessibilidade:** funcionar em computadores, tablets e celulares.

6. **Segurança:** permitir a publicação do código-fonte sem divulgar credenciais.

7. **Simplicidade:** utilizar a menor arquitetura capaz de atender aos requisitos.

8. **Evolução:** permitir acréscimo de eleições futuras sem reescrever a aplicação.

## 1.3. Escopo

### Funcionalidades incluídas

- Resultado nacional para Presidente.

- Apuração presidencial nos 26 estados e no Distrito Federal.

- Mapa interativo do Brasil.

- Comparação entre candidatos.

- Percentuais de votos e quantidade de votos.

- Progresso da totalização por estado.

- Ranking dos estados.

- Filtros por região, estado e candidato.

- Consulta de governadores nos estados com segundo turno.

- Consulta por município.

- Visualização de votos válidos, brancos e nulos.

- Comparecimento e abstenção.

- Evolução temporal da apuração.

- Atualização automática.

- Indicadores de disponibilidade e atualização dos dados.

- Interface responsiva.

- Acessibilidade.

- Compartilhamento de páginas.

- Metodologia e transparência.

- Monitoramento de saúde do sistema.

- Testes e integração contínua.

- Implantação automática na Hostinger.

### Fora do escopo inicial

- Autenticação de usuários.

- Cadastro de eleitores.

- Comentários públicos.

- Pesquisas de intenção de voto.

- Previsões de resultados.

- Classificação ideológica de eleitores.

- Publicidade política.

- Coleta de dados pessoais.

- Aplicativo mobile nativo.

Essas exclusões reduzem a complexidade, os custos e a superfície de ataque.

---

# 2. Funcionalidades detalhadas

## RF-01 — Dashboard nacional

A tela principal deverá conter:

- Nome da eleição e turno.

- Candidatos participantes.

- Percentual nacional de votos de cada candidato.

- Quantidade de votos recebidos.

- Total de votos válidos.

- Percentual de seções totalizadas.

- Diferença de votos entre os candidatos.

- Horário da atualização oficial.

- Situação da totalização.

**Critérios de aceite:**

- Os números devem corresponder aos dados nacionais do TSE.

- Nenhum valor poderá ser inventado quando estiver indisponível.

- A liderança parcial não poderá ser apresentada como resultado definitivo.

- O indicador de atualização deverá distinguir horário da fonte e horário da última consulta.

## RF-02 — Mapa interativo do Brasil

O mapa exibirá as 27 unidades federativas.

Cada estado poderá receber uma cor associada ao candidato que estiver liderando na respectiva UF.

O usuário poderá:

- Passar o cursor sobre o estado.

- Visualizar uma descrição resumida.

- Selecionar o estado.

- Abrir seus resultados detalhados.

Informações do estado:

- Sigla e nome.

- Candidato que lidera.

- Percentuais de votos.

- Diferença entre candidatos.

- Seções totalizadas.

**Regras:**

- Estados sem dados devem ter aparência neutra.

- Empates devem possuir representação própria.

- As cores não devem ser o único meio de identificar o candidato.

- Deve existir alternativa acessível em tabela.

- O mapa não deve classificar um estado como definitivamente vencido apenas por haver liderança momentânea.

## RF-03 — Tabela de apuração por estado

Apresentar todos os estados e o Distrito Federal em uma única tabela.

Colunas:

| Coluna | Conteúdo |
| --- | --- |
| Estado | Nome e sigla |
| Candidato A | Votos e percentual |
| Candidato B | Votos e percentual |
| Liderança | Candidato à frente |
| Diferença | Diferença absoluta de votos |
| Totalização | Percentual de seções totalizadas |
| Atualização | Horário da informação oficial |

A tabela deverá permitir ordenação e filtros.

Critérios de ordenação:

- Ordem alfabética.

- Maior percentual de totalização.

- Menor percentual de totalização.

- Maior diferença de votos.

- Menor diferença de votos.

- Estados liderados por cada candidato.

## RF-04 — Detalhamento estadual

Ao selecionar um estado, abrir uma página própria.

Exemplo de rota:

`/estados/pr`

Essa página deverá apresentar:

- Resultado presidencial estadual.

- Candidatos participantes.

- Quantidade de votos por candidato.

- Percentuais.

- Diferença absoluta.

- Diferença em pontos percentuais.

- Votos válidos, brancos e nulos.

- Seções totalizadas.

- Eleitorado.

- Comparecimento e abstenção.

- Última atualização.

- Situação oficial da totalização.

- Histórico estadual, quando disponível.

- Acesso aos municípios.

Os indicadores devem deixar claros seus denominadores. Percentual de votos e percentual de seções totalizadas são medidas diferentes.

## RF-05 — Governadores

Criar uma seção exclusiva para eleições estaduais.

Rota:

`/governadores`

O sistema deverá:

- Identificar os estados onde efetivamente houve segundo turno.

- Consultar os dados oficiais desses estados.

- Exibir candidatos a governador.

- Mostrar votos, percentuais e situação da totalização.

- Disponibilizar páginas individuais por estado.

Não deverá consultar indiscriminadamente arquivos inexistentes para todas as UFs.

A identificação dos estados e eleições deverá ser baseada na configuração oficial e nos arquivos efetivamente disponibilizados pelo TSE.

## RF-06 — Municípios

Dentro de cada estado, oferecer pesquisa por município.

Funcionalidades:

- Pesquisa textual.

- Ordenação alfabética.

- Acesso ao resultado presidencial municipal.

- Acesso ao resultado de governador, quando aplicável.

- Comparação de candidatos.

- Percentual de totalização.

- Estatísticas de votos.

**Regra fundamental:** utilizar o código eleitoral de município definido pelo TSE. Não presumir que ele corresponde ao código IBGE.

A implementação deverá utilizar os arquivos de configuração de municípios da Justiça Eleitoral.

## RF-07 — Histórico da apuração

Registrar snapshots dos resultados em diferentes momentos.

Permitir visualizar:

- Evolução dos votos por candidato.

- Evolução percentual.

- Evolução das seções totalizadas.

- Mudanças de liderança.

- Horários dos snapshots coletados.

O histórico deverá apresentar dados realmente observados pelo sistema.

Se a coleta começar quando a totalização estiver avançada, o portal não poderá inventar dados históricos anteriores.

A funcionalidade requer armazenamento persistente e coleta agendada.

## RF-08 — Atualização automática

O painel deverá atualizar seus dados periodicamente, sem exigir recarregamento manual da página.

Comportamento proposto:

- Atualização visual aproximadamente a cada 60 segundos.

- Atualização do cache compartilhado pelo backend.

- Atualização sem apagar temporariamente os resultados anteriores.

- Indicador de sincronização.

- Tratamento de falhas.

- Botão de atualização manual que consulta o backend, respeitando o cache.

O navegador não deverá fazer requisições diretamente ao TSE.

## RF-09 — Estados de disponibilidade

O sistema deverá diferenciar:

1. Aguardando dados.

2. Dados disponíveis e recentes.

3. Dados disponíveis, mas desatualizados.

4. Fonte temporariamente indisponível.

5. Resposta inválida ou inesperada.

6. Totalização parcial.

7. Totalização final.

Se o TSE estiver indisponível, o portal poderá exibir o último snapshot válido, desde que identificado como desatualizado.

Nunca deverá apresentar dados antigos como resultados atualizados em tempo real.

## RF-10 — Filtros

Filtros propostos:

- Região geográfica.

- Unidade federativa.

- Cargo.

- Candidato.

- Estado da totalização.

- Ordem dos resultados.

Filtros devem funcionar sem necessidade de recarregar a página inteira.

## RF-11 — Comparações

Disponibilizar comparações entre candidatos e estados.

Indicadores:

- Diferença absoluta de votos.

- Diferença em pontos percentuais.

- Totalização por estado.

- Estados com maior diferença.

- Estados com menor diferença.

**Importante:** diferença de votos e pontos percentuais são cálculos derivados do portal, não campos oficiais necessariamente apresentados dessa maneira pelo TSE.

## RF-12 — Compartilhamento

Permitir compartilhar links para:

- Dashboard nacional.

- Página de um estado.

- Resultado de governador.

- Município específico.

As URLs deverão preservar o contexto selecionado.

## RF-13 — Transparência

Criar a página:

`/metodologia`

Essa página deverá explicar:

- Qual é a fonte dos dados.

- Como os arquivos são consultados.

- O intervalo de atualização.

- Como são calculadas as diferenças.

- O significado dos principais indicadores.

- Como são tratados dados ausentes ou desatualizados.

- As limitações do histórico.

- A diferença entre liderança, definição matemática e resultado oficial finalizado.

## RF-14 — Acessibilidade

Requisitos:

- Navegação por teclado.

- Uso de elementos HTML semânticos.

- Contraste adequado.

- Foco visível.

- Suporte a leitores de tela.

- Informações não dependentes exclusivamente de cores.

- Alternativa textual para mapas.

- Estados de carregamento acessíveis.

- Respeito à preferência por movimento reduzido.

- Evitar anúncios sonoros ou leitura automática a cada atualização.

Referência: WCAG 2.2, nível AA.

## RF-15 — Responsividade

### Desktop

- Indicadores nacionais no topo.

- Mapa e tabela em área principal.

- Filtros laterais ou superiores.

- Detalhes em página ou painel contextual.

### Tablet

- Mapa e tabela em sequência.

- Filtros compactos.

- Cards ajustados à largura disponível.

### Mobile

- Indicadores compactos.

- Mapa adaptável.

- Tabela convertida em cards quando adequado.

- Filtros em painel recolhível.

- Navegação simplificada.

- Sem rolagem horizontal desnecessária.

---

# 3. Arquitetura de software

## 3.1. Arquitetura recomendada

Utilizar um **monólito modular com Next.js**.

Fluxo:

```
              USUÁRIO
                 |
                 v
          NEXT.JS / REACT
          Interface pública
                 |
                 v
            API INTERNA
         Route Handlers
                 |
                 v
         CAMADA DE APLICAÇÃO
         Serviços de consulta
                 |
           +-----+-----+
           |           |
           v           v
       CACHE / DB   ADAPTER TSE
           |           |
           |           v
           |       CDN OFICIAL
           |           |
           +-----------+
```

Coleta histórica:

```
HOSTINGER CRON
      |
      v
PROCESSO DE SINCRONIZAÇÃO
      |
      v
CONSULTA AO TSE
      |
      v
VALIDAÇÃO E NORMALIZAÇÃO
      |
      v
MYSQL
      |
      +--> SNAPSHOT ATUAL
      |
      +--> HISTÓRICO
```

## 3.2. Decisões arquiteturais

**Decisão A — Monólito modular**

Não criar microsserviços neste momento.

Justificativa:

- Menor custo operacional.

- Menos deploys.

- Menor complexidade.

- Facilita desenvolvimento individual.

- Permite modularização interna.

**Decisão B — Integração isolada**

Criar uma camada adaptadora para os arquivos JSON do TSE.

O frontend e a aplicação não devem depender diretamente dos nomes abreviados dos campos externos.

**Decisão C — Modelo de domínio próprio**

Modelar conceitos como:

- Eleição.

- Turno.

- Cargo.

- Abrangência.

- Candidato.

- Resultado.

- Votação.

- Totalização.

- Snapshot.

**Decisão D — Banco de dados incremental**

A primeira versão poderá funcionar sem banco, utilizando cache.

Introduzir persistência para:

- Histórico.

- Cache compartilhado durável.

- Diagnósticos de sincronização.

- Recuperação após indisponibilidade da fonte.

**Decisão E — Sem autenticação**

O sistema será somente leitura para o público.

Não criar painéis administrativos ou rotas públicas de escrita sem necessidade.

## 3.3. Organização em módulos

```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── estados/
│   │   └── [uf]/
│   │       └── page.tsx
│   ├── governadores/
│   ├── municipios/
│   ├── metodologia/
│   ├── sobre/
│   ├── status/
│   └── api/
│       └── v1/
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── maps/
│   ├── charts/
│   ├── tables/
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

Essa estrutura é uma referência. Diretórios e interfaces devem ser criados conforme surgirem responsabilidades reais, evitando arquivos e abstrações vazias.

---

# 4. Stack tecnológica

| Camada | Tecnologia |
| --- | --- |
| Linguagem | TypeScript |
| Aplicação web | Next.js com App Router |
| Interface | React |
| Estilos | Tailwind CSS |
| Componentes | Componentes próprios ou biblioteca acessível |
| Gráficos | Recharts |
| Mapas | SVG/GeoJSON com biblioteca compatível |
| Consumo de dados | Fetch no servidor |
| Atualização cliente | SWR |
| Validação externa | Zod |
| Persistência | MySQL na Hostinger |
| Acesso ao banco | mysql2 ou ORM leve compatível |
| Testes unitários | Vitest |
| Testes de interface | Testing Library |
| Testes ponta a ponta | Playwright |
| Qualidade | ESLint e TypeScript |
| CI | GitHub Actions |
| Deploy | Integração nativa GitHub–Hostinger |

**Versões:** utilizar versões estáveis e suportadas, registrar as versões no lockfile e testar a compatibilidade com o ambiente da Hostinger.

Para o servidor, Node.js 24 é uma opção compatível com a documentação atual da hospedagem.

Não utilizar Docker, Redis, WebSockets de entrada ou processos background permanentes na hospedagem Node.js gerenciada da Hostinger, pois esses recursos não fazem parte das funcionalidades suportadas desse ambiente.

---

# 5. Integração com o TSE

## 5.1. Fonte oficial

Documentação:

<https://www.tse.jus.br/eleicoes/informacoes-tecnicas-sobre-a-divulgacao-de-resultados>

Configuração oficial das eleições:

```
https://resultados.tse.jus.br/oficial/comum/config/ele-c.json
```

O projeto deve consultar essa configuração para identificar eleições e validar parâmetros.

## 5.2. Códigos de 2026

| Código | Eleição |
| --- | --- |
| 6257 | Primeiro turno presidencial |
| 6258 | Segundo turno presidencial |
| 6259 | Primeiro turno estadual |
| 6260 | Segundo turno estadual |

Códigos de cargo:

- `0001`: Presidente.

- `0003`: Governador.

Os códigos devem ser configuráveis e validados contra os dados oficiais.

## 5.3. URLs de resultados

**Presidente — Brasil**

```
https://resultados.tse.jus.br/oficial/ele2026/6258/dados/br/br-c0001-e006258-u.json
```

**Presidente — Paraná**

```
https://resultados.tse.jus.br/oficial/ele2026/6258/dados/pr/pr-c0001-e006258-u.json
```

**Governador — São Paulo**

```
https://resultados.tse.jus.br/oficial/ele2026/6260/dados/sp/sp-c0003-e006260-u.json
```

A última URL representa o formato documentado; cada arquivo deverá ser validado quanto à disponibilidade efetiva antes de ativá-lo no portal.

## 5.4. Arquivo EA20

A especificação EA20 define os arquivos unificados de resultados.

Alguns campos relevantes:

| Campo TSE | Significado |
| --- | --- |
| `ele` | Código da eleição |
| `t` | Turno |
| `tpabr` | Tipo da abrangência |
| `cdabr` | Código da abrangência |
| `dg`, `hg` | Data e hora de geração |
| `idg` | Identificador da geração do arquivo |
| `dt`, `ht` | Data e hora da totalização |
| `and` | Andamento da totalização |
| `tf` | Indicador de totalização final |
| `carg` | Informações dos cargos e candidaturas |
| `carg[].agr[].par[].cand[]` | Candidatos na estrutura de agrupamentos e partidos |
| `cand[].nmu` | Nome de urna |
| `cand[].n` | Número |
| `cand[].vap` | Quantidade de votos computados |
| `cand[].pvap` | Percentual apresentado |
| `cand[].pvapn` | Percentual com maior precisão |
| `cand[].e` | Indicador de eleito |
| `cand[].st` | Situação da totalização do candidato |
| `s.ts` | Total de seções |
| `s.st` | Seções totalizadas |
| `s.pst` | Percentual de seções totalizadas |
| `s.sa` | Seções apuradas |
| `s.psa` | Percentual de seções apuradas entre as instaladas |
| `v.vv` | Votos válidos |
| `v.vb` | Votos em branco |
| `v.vn` | Votos nulos |
| `e.c` | Comparecimento |
| `e.a` | Abstenções |

A interpretação definitiva de todos os campos deverá seguir o dicionário EA20 da versão vigente.

**Atenção:** `s.pst` e `s.psa` não são equivalentes. O primeiro mede as seções totalizadas em relação ao total; o segundo mede as seções apuradas em relação às instaladas.

## 5.5. Normalização dos dados

O TSE utiliza uma estrutura específica para distribuição.

O projeto deve transformá-la em um modelo interno previsível.

Contrato conceitual:

```
type Cargo = "presidente" | "governador";

type SituacaoDisponibilidade =
  | "aguardando"
  | "atualizado"
  | "desatualizado"
  | "indisponivel";

interface CandidatoResultado {
  id: string;
  numero: string;
  nomeUrna: string;
  partido: string | null;
  votos: number | null;
  percentual: number | null;
  situacaoOficial: string | null;
}

interface ResultadoEleitoral {
  eleicaoId: string;
  turno: number;
  cargo: Cargo;
  abrangencia: string;

  candidatos: CandidatoResultado[];

  votosValidos: number | null;
  votosBrancos: number | null;
  votosNulos: number | null;

  secoesTotalizadas: number | null;
  percentualTotalizado: number | null;

  situacaoTotalizacao: string;
  totalizacaoFinal: boolean;

  geradoEm: string | null;
  coletadoEm: string;

  idGeracaoTse: string;
  fonteUrl: string;

  disponibilidade: SituacaoDisponibilidade;
}
```

Esse contrato é uma proposta interna, não um espelho completo do EA20.

Adicionar outros atributos à medida que forem implementadas as funcionalidades de eleitorado, comparecimento e abstenção.

### Regras de normalização

 1. Validar a estrutura JSON recebida.

 2. Manter identificadores como texto quando apropriado.

 3. Converter números textuais para formatos numéricos seguros.

 4. Tratar percentuais com vírgula decimal.

 5. Não transformar campos ausentes em zero automaticamente.

 6. Preservar a situação oficial da candidatura.

 7. Identificar separadamente timestamps de geração, totalização e coleta.

 8. Não presumir que a ordem dos candidatos no arquivo seja fixa.

 9. Respeitar os diferentes agrupamentos partidários.

10. Não utilizar `idg` como sequência temporal global: ele identifica uma geração, mas não representa uma versão compartilhada entre arquivos diferentes.

## 5.6. Regras de comparação

A liderança deverá considerar a votação computada para o cargo, respeitando a situação dos votos e dos candidatos.

Diferença absoluta:

```
diferença = votos_candidato_A - votos_candidato_B
```

Diferença em pontos percentuais:

```
diferença_pp = percentual_A - percentual_B
```

O sinal poderá indicar qual candidato está à frente.

Deixar claro que os resultados estaduais são parciais enquanto não houver encerramento da totalização correspondente.

Não somar os 27 estados para substituir o resultado nacional oficial. A totalização presidencial brasileira inclui também os votos do exterior.

## 5.7. Gestão da disponibilidade

O adaptador do TSE deverá:

- Utilizar HTTPS.

- Permitir somente o domínio oficial configurado.

- Construir URLs a partir de valores enumerados.

- Não aceitar URLs arbitrárias de usuários.

- Aplicar timeout.

- Definir limites de tamanho da resposta.

- Validar o JSON antes de persistir.

- Tratar HTTP 304 corretamente.

- Controlar concorrência.

- Aplicar backoff em falhas.

- Registrar erros sem dados sensíveis.

- Não repetir consultas incessantemente em arquivos inexistentes.

O sistema deve respeitar o limite oficial de 100 requisições por segundo por IP, considerando que requisições condicionais também contam.

## 5.8. Cache e atualização

Proposta inicial:

- Consulta visual: 60 segundos.

- Cache compartilhado: duração configurável.

- Coleta histórica: a cada 1 ou 2 minutos, conforme capacidades da hospedagem.

- Concorrência de consultas ao TSE: limitada por configuração, inicialmente a 3–5 requisições simultâneas.

- Reaproveitamento do último resultado válido em caso de falha.

Esses intervalos são decisões do projeto, não uma cadência oficial garantida pelo TSE.

Utilizar ETag e Last-Modified quando disponíveis.

O servidor deve evitar consultas duplicadas simultâneas ao mesmo recurso.

Os dados recebidos precisam ser salvos integralmente antes de disponibilizar o novo snapshot. Uma falha em uma UF não deve eliminar os resultados válidos das demais.

---

# 6. Persistência de dados

## 6.1. Estratégia

Utilizar MySQL da Hostinger para as funcionalidades que precisam de durabilidade.

No MVP, o banco pode ser dispensado, mas o sistema deverá possuir uma interface de repositório para permitir introduzir persistência sem alterar a lógica principal.

## 6.2. Estrutura conceitual

### Election

- Identificador.

- Ano.

- Turno.

- Cargo.

- Código oficial da eleição.

- Data do pleito.

- Status.

### ElectionScope

- Identificador.

- Tipo de abrangência.

- Código oficial.

- Nome.

- UF.

- Eleição associada.

### CurrentResult

- Identificador da eleição.

- Abrangência.

- Cargo.

- Snapshot vigente.

- Horário de geração.

- Horário da coleta.

- Status de atualização.

### ResultSnapshot

- Identificador.

- Eleição.

- Abrangência.

- Cargo.

- Identificador de geração do TSE.

- Instante da coleta.

- Data de geração oficial.

- Conteúdo original preservado ou referência a armazenamento confiável.

- Versão do adaptador.

- Metadados de integridade.

### CandidateSnapshot

- Snapshot associado.

- Candidato.

- Número.

- Partido.

- Votos.

- Percentual.

- Situação oficial.

### SyncExecution

- Identificador da execução.

- Horário inicial.

- Horário final.

- Quantidade de recursos consultados.

- Quantidade de recursos atualizados.

- Falhas.

- Estado da execução.

## 6.3. Regras de persistência

- Evitar duplicação de snapshots idênticos.

- Criar índices de consulta por eleição e abrangência.

- Aplicar restrições de unicidade adequadas.

- Salvar dados oficiais sem adulteração.

- Armazenar cálculos derivados separadamente.

- Tratar falhas de transação.

- Não disponibilizar conexões de banco ao navegador.

- Não executar migrações destrutivas automaticamente durante o build.

## 6.4. Retenção

O histórico deverá permanecer disponível durante e após o pleito, respeitando a capacidade de armazenamento e a política do projeto.

Planejar:

- Backups periódicos.

- Testes de restauração.

- Exportação dos registros históricos.

- Limpeza de informações operacionais antigas.

- Preservação dos snapshots eleitorais relevantes.

A depender do volume, poderá ser necessário armazenar apenas snapshots representativos, sem prejudicar a rastreabilidade da evolução efetivamente observada.

---

# 7. API interna do portal

A API própria será responsável por devolver dados normalizados ao frontend.

Rotas propostas:

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET | `/api/v1/eleicoes` | Eleições suportadas |
| GET | `/api/v1/presidente/br` | Resultado nacional |
| GET | `/api/v1/presidente/ufs` | Resumo das 27 UFs |
| GET | `/api/v1/presidente/ufs/:uf` | Resultado estadual |
| GET | `/api/v1/governadores` | Estados com segundo turno |
| GET | `/api/v1/governadores/:uf` | Resultado de governador |
| GET | `/api/v1/ufs/:uf/municipios` | Municípios |
| GET | `/api/v1/ufs/:uf/municipios/:codigo` | Resultado municipal |
| GET | `/api/v1/historico` | Histórico filtrado |
| GET | `/api/health` | Saúde da aplicação |

As rotas são contratos pretendidos; precisarão ser implementadas e testadas.

## 7.1. Contrato de resposta

Toda resposta de resultados deve incluir:

- Identificação da eleição.

- Abrangência.

- Dados estruturados.

- Estado da disponibilidade.

- Timestamp da geração oficial.

- Timestamp da coleta.

- Fonte.

- Indicação de dado parcial ou final.

## 7.2. Segurança da API

- Permitir somente métodos necessários.

- Validar parâmetros e limites.

- Impedir uso da API como proxy genérico.

- Aplicar rate limiting às rotas públicas conforme necessidade.

- Não retornar mensagens internas de exceção.

- Não retornar credenciais nem configurações privadas.

- Restringir volume máximo de retornos históricos.

- Utilizar paginação quando necessário.

- Evitar aceitar caminhos arbitrários de arquivos.

Não haverá uma API pública capaz de alterar votos ou resultados.

---

# 8. Interface e design

## 8.1. Identidade visual

Preferência por tema escuro, com possibilidade de tema claro.

Elementos visuais:

- Fundo discreto.

- Cards de indicadores.

- Tipografia legível.

- Tabela objetiva.

- Mapa com cores distinguíveis.

- Gráficos com legendas.

- Hierarquia visual consistente.

Não utilizar cores partidárias como único identificador dos candidatos.

## 8.2. Estrutura da página inicial

```
+------------------------------------------------+
| PAINEL ELEITORAL BRASIL       Atualizado às ... |
+------------------------------------------------+
| Eleição 2026 | 2º Turno | Presidente           |
+------------------------------------------------+
| Candidato A          | Candidato B             |
| Percentual           | Percentual              |
| Votos                | Votos                   |
+------------------------------------------------+
| Seções totalizadas   | Votos válidos           |
+------------------------------------------------+
| MAPA DO BRASIL       | RESUMO ESTADUAL         |
|                     |                         |
| Estados interativos | Comparação              |
+------------------------------------------------+
| RESULTADOS DOS 27 ESTADOS                      |
| UF | Candidato A | Candidato B | Totalização   |
+------------------------------------------------+
| HISTÓRICO DA APURAÇÃO                          |
+------------------------------------------------+
| Fonte TSE | Metodologia | Estado da fonte       |
+------------------------------------------------+
```

## 8.3. Componentes

- `NationalSummary`

- `CandidateScoreCard`

- `CountingProgress`

- `BrazilElectionMap`

- `StateResultTable`

- `ElectionFilters`

- `StateDetails`

- `GovernorResults`

- `MunicipalitySearch`

- `ElectionTimeline`

- `DataFreshnessIndicator`

- `SourceAttribution`

- `ErrorState`

- `EmptyState`

Os nomes são sugestões; os componentes devem ser extraídos quando houver necessidade de reutilização ou isolamento de comportamento.

## 8.4. Dados geográficos

Utilizar uma malha oficial ou outra fonte geográfica com condições de reutilização verificadas.

Preferir dados geográficos estáticos versionados no projeto, em GeoJSON ou TopoJSON.

Não buscar geometrias de mapas em serviços externos a cada atualização da apuração.

Documentar:

- Fonte da malha.

- Ano ou versão.

- Projeção geográfica.

- Modificações ou simplificações.

- Condições de uso e atribuição.

---

# 9. Criação do projeto

## 9.1. Pré-requisitos

- Git instalado.

- Node.js compatível.

- npm.

- Editor de código.

- Conta GitHub.

- Conta Hostinger com plano compatível com aplicações Node.js.

## 9.2. Inicialização

```
npx create-next-app@latest painel-eleitoral --typescript --eslint --tailwind --app --src-dir --use-npm

cd painel-eleitoral

npm run dev
```

Validar a página padrão no navegador.

## 9.3. Dependências iniciais

```
npm install zod swr lucide-react recharts
```

Para testes:

```
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test
```

Configurar Vitest e Playwright antes de executar seus testes.

Introduzir a biblioteca de mapas ao implementar o componente geográfico, verificando compatibilidade com a versão de React.

Quando chegar à persistência:

```
npm install mysql2
```

Adicionar outras dependências somente quando justificadas.

## 9.4. Scripts de qualidade

Configurar os seguintes scripts no `package.json`:

```
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

Executar:

```
npm run lint
npm run typecheck
npm run test:run
npm run build
```

O build precisa funcionar antes da publicação.

---

# 10. Segurança do repositório público

## 10.1. Regra central

O GitHub conterá somente:

- Código-fonte.

- Arquivos públicos de configuração.

- Documentação.

- Testes.

- Dados sintéticos ou públicos com reutilização permitida.

- Arquivos geográficos autorizados.

- Exemplos de configuração sem credenciais.

**Nunca publicar:**

- Senhas.

- Tokens.

- Chaves privadas.

- Credenciais de banco.

- Credenciais SSH.

- Chaves de API privadas.

- Backups privados.

- Arquivos `.env` reais.

- Logs contendo informações confidenciais.

- Dados pessoais não necessários.

- Arquivos de infraestrutura com segredos incorporados.

## 10.2. Arquivo `.gitignore`

Adicionar ou conferir:

```
# Dependências
node_modules/

# Build
.next/
out/
dist/
build/

# Ambiente
.env
.env.*
!.env.example

# Logs
*.log
npm-debug.log*

# Testes
coverage/
playwright-report/
test-results/

# Segredos e certificados
*.pem
*.key
*.p12
*.pfx
id_rsa*

# Backups e arquivos locais
*.bak
*.dump
*.sql.gz

# Editor e sistema
.DS_Store
.idea/
.vscode/settings.json
```

Esse arquivo reduz o risco de commits acidentais, mas não substitui verificação de segredos.

## 10.3. Arquivo `.env.example`

Criar:

```
# Origem oficial - valor publico
TSE_BASE_URL=https://resultados.tse.jus.br/oficial

# Configuracao
ELECTION_YEAR=2026
POLL_INTERVAL_MS=60000

# Banco - preencher somente fora do repositorio
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASSWORD=
```

O arquivo deve conter somente exemplos e valores não sensíveis.

Credenciais reais serão armazenadas na configuração da Hostinger ou no ambiente local privado.

## 10.4. Variáveis expostas ao navegador

No Next.js, variáveis prefixadas com `NEXT_PUBLIC_` podem ser incluídas no JavaScript enviado ao visitante.

Não utilizar esse prefixo para:

- Senhas.

- Tokens.

- Credenciais de banco.

- Segredos de assinatura.

- Chaves administrativas.

A ausência de `NEXT_PUBLIC_` não torna uma variável automaticamente segura se ela for exposta deliberadamente em uma resposta de servidor.

## 10.5. Segurança da aplicação

Implementar:

- HTTPS obrigatório.

- Cabeçalhos de segurança adequados.

- Política de segurança de conteúdo (CSP) testada.

- Proteção contra clickjacking.

- Política de referências apropriada.

- Dependências atualizadas.

- Validação de dados externos.

- Proteção contra SSRF.

- Limites de tamanho e tempo em requisições.

- Tratamento seguro de exceções.

- Controle de recursos e rate limiting quando necessário.

- Proibição de renderizar HTML remoto sem sanitização.

- Nenhum segredo em logs.

- Nenhuma rota administrativa desprotegida.

Não adicionar autenticação ou formulários de escrita sem necessidade.

## 10.6. Segurança da integração GitHub–Hostinger

- Autorizar somente os repositórios necessários.

- Revisar as permissões solicitadas pela integração.

- Utilizar autenticação de dois fatores no GitHub e na Hostinger.

  # Guia de Desenvolvimento — Painel Eleitoral Brasil

  ## Parte 2 — Segurança, GitHub, Hostinger, sincronização e publicação

  **Continuação da seção 10.6 do guia original.**

  ---

  # 10.6. Segurança da integração GitHub–Hostinger

  Adotar as seguintes medidas:

  - Ativar autenticação de dois fatores no GitHub e na Hostinger.

  - Utilizar senhas exclusivas.

  - Autorizar a integração da Hostinger somente para o repositório necessário.

  - Não criar tokens de acesso pessoal do GitHub sem necessidade.

  - Não armazenar senhas ou chaves da Hostinger no código.

  - Separar configurações de desenvolvimento e produção.

  - Restringir a publicação de novas versões à branch principal.

  - Não utilizar credenciais de produção em testes automatizados.

  - Revisar os aplicativos autorizados na conta GitHub.

  - Remover acessos de integrações que deixarem de ser utilizadas.

  **Decisão recomendada:** utilizar a integração nativa da Hostinger com o GitHub, em vez de criar inicialmente um workflow de deploy por SSH.

  Isso evita administrar uma chave privada de implantação no GitHub Actions.

  ## 10.7. Modelo de ameaças

  Antes de publicar, considerar os seguintes riscos:

  | Ameaça | Possível consequência | Proteção |
  | --- | --- | --- |
  | Credencial no GitHub | Acesso indevido ao banco ou hospedagem | Secret scanning, variáveis privadas |
  | Dependência vulnerável | Comprometimento da aplicação | Dependabot, auditoria e atualizações |
  | Parâmetro de URL malicioso | SSRF, acesso indevido ou consultas inesperadas | Allowlist, enumeração, validação |
  | JSON inválido do TSE | Dados incorretos no painel | Validação de contratos |
  | Fonte indisponível | Interrupção da exibição | Último snapshot válido |
  | Consultas excessivas | Bloqueio pelo TSE | Cache, limitação e agendamento |
  | Endpoint de coleta exposto | Execução de processos por terceiros | Job local ou autenticação robusta |
  | GitHub comprometido | Implantação de código malicioso | 2FA, proteção de branch, CI |
  | Alteração manual no banco | Resultados inconsistentes | Permissões e trilha de alterações |
  | Atualizações incompatíveis | Indisponibilidade | Testes, deploy controlado, rollback |
  | Robôs abusivos | Sobrecarga | Cache, controles HTTP e proteção de infraestrutura |
  | Crescimento do histórico | Esgotamento do banco | Monitoramento, índices e retenção |

  ## 10.8. Proteção das dependências

  Habilitar no GitHub:

  - Dependency graph.

  - Dependabot alerts.

  - Dependabot security updates.

  - Secret scanning.

  - Push protection.

  - Code scanning, quando disponível.

  Configurar verificações automatizadas e revisar atualizações de dependências antes de integrá-las.

  Comando local:

  ```
  npm audit --omit=dev
  ```

  A auditoria não substitui análise de segurança. Vulnerabilidades precisam ser avaliadas quanto à possibilidade real de exploração.

  Evitar usar `npm audit fix --force` indiscriminadamente, pois isso pode instalar versões incompatíveis.

  ## 10.9. Tratamento de vazamento de credenciais

  Caso uma credencial seja publicada acidentalmente:

  1. Considerá-la comprometida.

  2. Revogar ou substituir imediatamente a credencial.

  3. Verificar acessos e atividades suspeitas.

  4. Remover a credencial do código.

  5. Analisar todo o histórico do Git.

  6. Avaliar a necessidade de reescrever o histórico.

  7. Verificar clones, forks e caches externos.

  8. Registrar o incidente e suas causas.

  **Importante:** remover uma senha de um commit posterior não elimina seu conteúdo dos commits anteriores.

  Reescrever o histórico também não garante que a informação deixou de estar disponível. A rotação ou revogação é indispensável.

  ---

  # 11. GitHub — Criação e configuração do repositório

  ## 11.1. Estrutura de publicação

  Criar um repositório chamado:

  `painel-eleitoral-brasil`

  A configuração proposta:

  | Propriedade | Configuração |
  | --- | --- |
  | Visibilidade | Público |
  | Branch principal | `main` |
  | Issues | Ativado |
  | Pull Requests | Ativado |
  | Wiki | Opcional |
  | Discussions | Opcional |
  | Releases | Ativado |
  | Dependabot | Ativado |
  | Proteção da branch | Ativada |
  | Licença | MIT, após revisão das dependências e dos ativos |

  A licença MIT é uma opção para o código próprio, mas não concede automaticamente direitos sobre mapas, imagens, marcas ou outros materiais de terceiros.

  ## 11.2. Preparação para o primeiro commit

  Antes da publicação:

  ```
  git status --short
  ```

  Examinar os arquivos que serão adicionados.

  Depois:

  ```
  git add .
  git diff --cached --name-only
  ```

  Conferir se aparecem:

  - Arquivos de código.

  - Configurações públicas.

  - Documentação.

  - Fixtures de testes.

  - `.env.example`.

  - `package-lock.json`.

  Conferir se **não aparecem**:

  - `.env.local`.

  - `.env.production`.

  - Credenciais.

  - Certificados.

  - Backups.

  - Logs privados.

  - Arquivos locais contendo segredos.

  Executar também uma ferramenta de detecção de segredos, como Gitleaks, configurada para examinar o conteúdo e o histórico Git.

  Não considerar o resultado de uma única ferramenta como garantia absoluta de segurança.

  ## 11.3. Primeiro envio ao GitHub

  Depois de revisar os arquivos:

  ```
  git init
  git branch -M main
  git add .
  git commit -m "chore: initialize electoral dashboard"
  git remote add origin https://github.com/SEU_USUARIO/painel-eleitoral-brasil.git
  git push -u origin main
  ```

  Substituir `SEU_USUARIO` pelo usuário real.

  Não incluir credenciais na URL remota.

  Utilizar o mecanismo de autenticação seguro disponibilizado pelo GitHub.

  ## 11.4. Estratégia de branches

  Adotar uma estratégia simples:

  ```
  main
   |
   +-- feat/national-dashboard
   |
   +-- feat/state-map
   |
   +-- feat/tse-integration
   |
   +-- feat/state-results
   |
   +-- feat/governor-results
   |
   +-- feat/history
   |
   +-- fix/data-validation
  ```

  Fluxo de desenvolvimento:

  1. Criar uma branch para a alteração.

  2. Desenvolver e testar.

  3. Abrir um Pull Request.

  4. Executar verificações automatizadas.

  5. Revisar as alterações.

  6. Integrar na branch `main`.

  7. Permitir que a Hostinger publique a nova versão.

  Não é necessário criar branches `develop`, `release` ou `hotfix` neste momento.

  ## 11.5. Proteção da branch principal

  No GitHub, acessar as configurações de proteção de branch ou rulesets.

  Para `main`, configurar:

  - Exigir Pull Request antes da integração.

  - Exigir execução bem-sucedida dos testes.

  - Bloquear force push.

  - Bloquear exclusão da branch.

  - Exigir resolução de conversas de revisão, quando disponível.

  - Restringir bypass das proteções.

  Mesmo em um projeto individual, Pull Requests ajudam a registrar alterações e impedir publicações acidentais.

  ## 11.6. Padrão de commits

  Utilizar Conventional Commits:

  ```
  feat: add Brazil electoral map
  fix: handle unavailable TSE responses
  refactor: isolate election result adapter
  test: cover percentage normalization
  docs: document official data sources
  chore: update project dependencies
  ci: add quality validation workflow
  ```

  ---

  # 12. Integração contínua — GitHub Actions

  ## 12.1. Objetivo

  O GitHub deverá validar automaticamente cada alteração.

  Verificações:

  1. Instalação reproduzível das dependências.

  2. Lint.

  3. Typecheck.

  4. Testes unitários.

  5. Testes de integração que não dependam de serviços reais.

  6. Build de produção.

  7. Verificação de vulnerabilidades.

  O deploy será executado pela Hostinger depois que as alterações forem integradas à branch configurada.

  ## 12.2. Workflow inicial

  Criar:

  `.github/workflows/ci.yml`

  ```
  name: Continuous Integration
  
  on:
    push:
      branches:
        - main
  
    pull_request:
      branches:
        - main
  
  permissions:
    contents: read
  
  concurrency:
    group: ci-${{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: true
  
  jobs:
    quality:
      name: Quality Checks
      runs-on: ubuntu-latest
  
      steps:
        - name: Checkout
          uses: actions/checkout@v4
  
        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: "24"
            cache: npm
  
        - name: Install dependencies
          run: npm ci
  
        - name: Lint
          run: npm run lint
  
        - name: Typecheck
          run: npm run typecheck
  
        - name: Unit and integration tests
          run: npm run test:run
  
        - name: Production build
          run: npm run build
  
        - name: Audit production dependencies
          run: npm audit --omit=dev --audit-level=high
  ```

  **Requisitos para o workflow:**

  - Os scripts precisam existir no `package.json`.

  - O `package-lock.json` precisa estar atualizado.

  - Os testes devem funcionar sem depender do TSE estar disponível.

  - O build não deve exigir credenciais reais de produção.

  - Dependências necessárias à construção devem estar declaradas corretamente.

  Para maior segurança na cadeia de fornecimento, substituir referências mutáveis como `@v4` por hashes completos de commits verificados das GitHub Actions utilizadas.

  Não utilizar `pull_request_target` para executar código de contribuições externas com acesso a segredos.

  ## 12.3. Atualização de dependências

  Criar:

  `.github/dependabot.yml`

  ```
  version: 2
  
  updates:
    - package-ecosystem: "npm"
      directory: "/"
      schedule:
        interval: "weekly"
      open-pull-requests-limit: 5
  
    - package-ecosystem: "github-actions"
      directory: "/"
      schedule:
        interval: "weekly"
  ```

  Toda atualização deverá passar pelo CI antes de ser incorporada.

  Não permitir integração automática irrestrita de atualizações críticas ou major sem testes adequados.

  ## 12.4. Controle do pipeline de deploy

  Fluxo recomendado:

  ```
  DESENVOLVIMENTO
        |
        v
  FEATURE BRANCH
        |
        v
  PULL REQUEST
        |
        v
  GITHUB ACTIONS
        |
    +---+---+
    |       |
    v       v
  TESTES   BUILD
    |       |
    +---+---+
        |
        v
  APROVAÇÃO / MERGE
        |
        v
  MAIN
        |
        v
  INTEGRAÇÃO HOSTINGER
        |
        v
  BUILD DE PRODUÇÃO
        |
        v
  PUBLICAÇÃO
        |
        v
  SMOKE TESTS
  ```

  A integração da Hostinger deve acompanhar apenas a branch de produção.

  **Não conectar a Hostinger a branches de desenvolvimento que recebam código ainda não validado.**

  ---

  # 13. Publicação na Hostinger

  ## 13.1. Tipo de hospedagem

  A arquitetura proposta utiliza Next.js com execução no servidor.

  Portanto, será necessária hospedagem compatível com aplicações Node.js.

  A documentação atual da Hostinger identifica suporte em:

  - Business Web Hosting.

  - Cloud Startup.

  - Cloud Professional.

  - Cloud Enterprise.

  - Cloud Enterprise Plus.

  Planos inferiores ou modalidades de hospedagem diferentes poderão exigir alteração do plano ou da arquitetura.

  ### Decisão

  **Preferir inicialmente hospedagem Node.js gerenciada.**

  Não contratar uma VPS apenas para executar o MVP.

  Uma VPS poderá ser considerada quando houver necessidade real de serviços adicionais, maior controle operacional ou limitações relevantes da hospedagem gerenciada.

  ## 13.2. Verificações antes da contratação ou implantação

  Confirmar:

  - Tipo exato do plano contratado.

  - Suporte ao Next.js.

  - Versões de Node.js disponíveis.

  - Limites de CPU e memória.

  - Número permitido de processos.

  - Limites de execução HTTP.

  - Suporte ao MySQL.

  - Possibilidade de executar Cron Jobs para Node.js.

  - Frequência mínima permitida para cron.

  - Recursos de backup.

  - Certificado SSL.

  - Domínio ou subdomínio disponível.

  Não presumir que todas as modalidades de hospedagem da Hostinger tenham os mesmos recursos.

  ## 13.3. Criar a aplicação na Hostinger

  Procedimento:

   1. Acessar o hPanel.

   2. Selecionar a criação de um novo website.

   3. Escolher a modalidade de aplicação web Node.js.

   4. Selecionar GitHub como origem do código.

   5. Autorizar a integração com o GitHub.

   6. Selecionar `painel-eleitoral-brasil`.

   7. Selecionar a branch `main`.

   8. Conferir o framework detectado.

   9. Configurar a versão do Node.js.

  10. Configurar as variáveis de ambiente.

  11. Revisar o comando de build.

  12. Iniciar a implantação.

  Os nomes exatos das telas podem variar conforme a versão do hPanel.

  Usar o fluxo de **Node.js Web App**, e não o recurso Git destinado a websites PHP/HTML.

  ## 13.4. Configuração do build

  Configurações esperadas:

  | Item | Valor |
  | --- | --- |
  | Framework | Next.js |
  | Node.js | 24.x, se compatível |
  | Gerenciador | npm |
  | Instalação | Baseada no lockfile |
  | Build | `npm run build` |
  | Branch | `main` |
  | Tipo de aplicação | Servidor Next.js |

  Não configurar `output: 'export'` no Next.js, pois o projeto depende de rotas e processamento no servidor.

  Permitir que a Hostinger utilize seu mecanismo documentado de inicialização para Next.js.

  Não presumir que uma aplicação Next.js com API possa ser publicada como HTML estático.

  ## 13.5. Variáveis de ambiente

  Configuração pública:

  ```
  NODE_ENV=production
  
  TSE_BASE_URL=https://resultados.tse.jus.br/oficial
  
  ELECTION_YEAR=2026
  
  POLL_INTERVAL_MS=60000
  ```

  Quando houver banco de dados:

  ```
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_NAME=<nome_real>
  DB_USER=<usuario_real>
  DB_PASSWORD=<senha_privada>
  ```

  Os campos entre sinais de menor e maior representam valores a preencher no painel, e não valores literais de produção.

  **Segurança:**

  - Preencher os segredos no gerenciador de variáveis da Hostinger.

  - Não criar arquivos `.env.production` versionados.

  - Não exibir variáveis privadas em páginas de diagnóstico.

  - Não enviar dados de configuração sensíveis ao navegador.

  Alterações em variáveis incorporadas ao frontend durante o build exigirão novo build.

  ## 13.6. Banco de dados MySQL

  Quando iniciar a implementação do histórico:

  1. Acessar a gestão de bancos de dados no hPanel.

  2. Criar uma base exclusiva para o portal.

  3. Criar usuário e senha exclusivos.

  4. Anotar o nome completo da base.

  5. Configurar as variáveis de ambiente.

  6. Validar a conexão pelo servidor.

  7. Aplicar as migrações.

  8. Executar um teste controlado de persistência.

  9. Configurar backup.

  Na hospedagem gerenciada, a Hostinger documenta o uso de `127.0.0.1` como host para o MySQL local.

  Não utilizar o usuário administrativo do banco indiscriminadamente.

  Quando a configuração de permissões permitir, separar:

  - Usuário de leitura utilizado pela API pública.

  - Usuário de escrita utilizado pelo processo de sincronização.

  - Credencial específica para migrações de estrutura.

  ## 13.7. Domínio e HTTPS

  Configurar:

  - Domínio ou subdomínio.

  - DNS.

  - Certificado TLS.

  - Redirecionamento HTTP para HTTPS.

  - Endereço canônico com ou sem `www`.

  - Metadados de identificação do website.

  Para evitar impactos sobre outro site, começar com um subdomínio dedicado, por exemplo:

  `eleicoes.seudominio.com.br`

  Não substituir um site existente sem backup e planejamento da migração.

  ## 13.8. Deploy automático

  Após a primeira implantação:

  1. Verificar se o website está funcionando.

  2. Confirmar qual branch está conectada.

  3. Habilitar auto-deployment.

  4. Criar um commit de teste em uma feature branch.

  5. Abrir Pull Request.

  6. Confirmar a conclusão do CI.

  7. Integrar na branch `main`.

  8. Verificar o novo deployment no hPanel.

  9. Conferir a versão publicada.

  Não editar arquivos diretamente no File Manager da Hostinger como forma de manter o código.

  Os arquivos gerenciados pelo mecanismo de deploy podem ser substituídos na próxima publicação.

  A fonte de verdade do código será o GitHub.

  ## 13.9. Rollback

  Em caso de falha na versão recém-publicada:

  1. Identificar o commit responsável.

  2. Interromper novas integrações na branch principal.

  3. Executar `git revert` no commit problemático, quando aplicável.

  4. Revisar a reversão.

  5. Integrar a correção à branch `main`.

  6. Acompanhar o novo deploy.

  7. Executar smoke tests.

  Para falhas em banco de dados, o rollback do código não é suficiente se houver alterações incompatíveis no esquema.

  Adotar migrações compatíveis, preferencialmente no padrão expandir–migrar–contrair.

  Não executar automaticamente restauração do banco sem avaliar perda de dados coletados após o backup.

  ---

  # 14. Sincronização de resultados eleitorais

  Esta é uma das partes mais importantes do projeto.

  ## 14.1. Separar consulta de coleta

  O navegador não deve consultar o TSE.

  Arquitetura final:

  ```
  TSE
   |
   v
  JOB DE SINCRONIZAÇÃO
   |
   v
  VALIDAÇÃO
   |
   v
  NORMALIZAÇÃO
   |
   v
  PERSISTÊNCIA MYSQL
   |
   v
  API NEXT.JS
   |
   v
  CACHE HTTP / SWR
   |
   v
  NAVEGADOR
  ```

  Benefícios:

  - Controle de requisições ao TSE.

  - Menor dependência de disponibilidade imediata.

  - Histórico persistente.

  - Menor latência para o visitante.

  - Possibilidade de recuperação de falhas.

  - Proteção contra consultas duplicadas.

  ## 14.2. Job de sincronização

  Criar um processo que possa ser executado sob demanda e encerrar após completar sua tarefa.

  Responsabilidades:

   1. Validar o ambiente.

   2. Identificar as eleições habilitadas.

   3. Consultar o acompanhamento oficial.

   4. Determinar quais abrangências exigem atualização.

   5. Consultar os resultados correspondentes.

   6. Validar cada arquivo.

   7. Normalizar as informações.

   8. Persistir os novos snapshots.

   9. Atualizar o resultado corrente.

  10. Registrar o resultado da execução.

  11. Encerrar o processo.

  A sincronização deverá ser idempotente: executar o mesmo job novamente, recebendo os mesmos dados, não deverá duplicar resultados.

  ## 14.3. Acompanhamento eficiente

  O TSE disponibiliza arquivos de acompanhamento, como EA14 e EA15.

  Utilizá-los para identificar alterações em abrangências estaduais e municipais.

  Estratégia recomendada:

  ```
  CONSULTAR ACOMPANHAMENTO
            |
            v
  IDENTIFICAR ALTERAÇÕES
            |
        +---+---+
        |       |
        v       v
   SEM MUDANÇA  COM MUDANÇA
        |       |
        v       v
   ENCERRAR   CONSULTAR EA20
                    |
                    v
                 VALIDAR
                    |
                    v
                 PERSISTIR
  ```

  As informações de acompanhamento e resultados poderão ficar momentaneamente dessincronizadas, pois os arquivos são gerados e distribuídos pela CDN.

  Portanto, não considerar uma diferença temporária entre os arquivos como prova automática de corrupção.

  ## 14.4. Frequência de atualização

  Parâmetros iniciais propostos:

  | Operação | Intervalo |
  | --- | --- |
  | Atualização da interface | 60 segundos |
  | Sincronização nacional | 1–2 minutos, se viável |
  | Verificação estadual | 2–5 minutos |
  | Verificação municipal | Sob demanda ou por alterações |
  | Health check | 5 minutos |
  | Verificação de histórico | A cada sincronização bem-sucedida |

  Esses valores são configuráveis e dependem das capacidades efetivas da hospedagem.

  **Não consultar todos os municípios do Brasil a cada minuto.**

  A consulta municipal deverá ser incremental e direcionada.

  ## 14.5. Cron Jobs na Hostinger

  A hospedagem gerenciada de Node.js permite executar scripts por Cron Jobs, sujeitos aos limites do plano.

  O script deve ser um programa Node.js independente, que termina após a sincronização.

  ### Preparação de build

  Caso o processo seja escrito em TypeScript, criar um build específico para ele.

  Exemplo conceitual:

  ```
  scripts/
    sync-election.ts
  
  jobs-dist/
    sync-election.js
  ```

  Utilizar uma ferramenta de build de scripts Node.js, por exemplo `tsup`, ou uma configuração dedicada do compilador TypeScript.

  Garantir que o arquivo JavaScript compilado esteja disponível no deployment final.

  Evitar criar dois conjuntos independentes de regras de normalização. O job e a API deverão compartilhar a lógica de domínio.

  ### Agendamento

  Exemplo de expressão cron para execução a cada dois minutos:

  ```
  */2 * * * *
  ```

  Validar se o plano contratado permite essa frequência.

  O Cron Job da Hostinger utiliza UTC para agendamento. A expressão acima é independente do fuso, mas horários fixos precisam considerar essa diferença.

  ### Variáveis de ambiente no cron

  Os jobs Node.js não recebem automaticamente todas as variáveis da aplicação web.

  Configurar a utilização do arquivo privado de ambiente conforme a documentação da Hostinger.

  Exemplo ilustrativo:

  ```
  /opt/alt/alt-nodejs24/root/bin/node \
  --env-file=<CAMINHO_PRIVADO_ENV> \
  <CAMINHO_ABSOLUTO_DO_SCRIPT_COMPILADO>
  ```

  Os caminhos reais devem ser obtidos na hospedagem.

  Não copiar credenciais diretamente para a expressão do cron.

  Respeitar as restrições documentadas de comprimento de comando e execução.

  ## 14.6. Proteção contra execuções simultâneas

  Dois jobs podem se sobrepor caso um processamento demore mais que o intervalo programado.

  Implementar um mecanismo de exclusão utilizando o banco de dados.

  Alternativas:

  - Lock consultivo do MySQL.

  - Registro de lease com prazo de expiração.

  - Lock transacional apropriado.

  A estratégia deverá considerar falha inesperada ou encerramento do processo.

  Se houver sincronização em andamento, uma nova execução deverá encerrar sem iniciar consultas duplicadas.

  ## 14.7. Controle de versões dos snapshots

  Cada snapshot deve registrar:

  - Eleição.

  - Cargo.

  - Abrangência.

  - Identificador de geração oficial.

  - Horário da geração.

  - Horário da coleta.

  - Hash do conteúdo recebido.

  - Resultado da validação.

  - Versão do adaptador.

  O `idg` não deve ser interpretado como contador monotônico compartilhado.

  Para deduplicação, combinar identificadores adequados com um hash criptográfico do conteúdo, por exemplo SHA-256.

  ## 14.8. Tratamento de erros

  Comportamento esperado:

  | Situação | Ação |
  | --- | --- |
  | HTTP 200 válido | Processar e persistir |
  | HTTP 304 | Manter snapshot anterior |
  | HTTP 404 | Rever existência e configuração do recurso |
  | HTTP 429 ou bloqueio | Suspender e aplicar backoff |
  | HTTP 500/503 | Registrar falha e tentar novamente depois |
  | Timeout | Encerrar a tentativa e manter dados anteriores |
  | JSON inválido | Rejeitar a atualização |
  | Dados inconsistentes | Colocar em quarentena para análise |
  | Banco indisponível | Não confirmar sincronização |
  | Job duplicado | Encerrar a execução adicional |

  Não criar retentativas infinitas.

  Não registrar o corpo completo de respostas desconhecidas em logs públicos.

  ## 14.9. Atualização no navegador

  O frontend deverá consultar somente a API própria.

  Utilizar SWR para:

  - Atualização periódica.

  - Preservação dos dados anteriores.

  - Estado de carregamento.

  - Tratamento de erros.

  - Atualização manual.

  - Revalidação após retorno à página.

  A atualização do navegador pode ser mais frequente que a coleta oficial, mas não deve anunciar uma nova atualização do TSE quando o backend estiver servindo o mesmo snapshot.

  ## 14.10. Consistência visual

  Um painel pode receber dados novos de algumas UFs antes das demais.

  A interface deverá informar o horário da fonte de cada resultado.

  Evitar apresentar a soma dos dados estaduais coletados em momentos diferentes como se fosse uma totalização nacional sincronizada.

  Para o resultado nacional, utilizar diretamente o arquivo oficial de abrangência Brasil.

  ---

  # 15. Persistência e integridade

  ## 15.1. Banco de dados

  Priorizar uma estrutura normalizada e índices que atendam às consultas reais.

  Principais consultas esperadas:

  - Último resultado nacional.

  - Último resultado de uma UF.

  - Resumo de todas as UFs.

  - Resultado de determinado município.

  - Histórico de uma abrangência.

  - Última execução de sincronização.

  ## 15.2. Separação dos dados

  Distinguir claramente três tipos de informação.

  **Dados oficiais**

  Conteúdo fornecido pelo TSE.

  **Dados normalizados**

  Representação interna dos campos oficiais, preservando significado e proveniência.

  **Dados derivados**

  Cálculos do próprio portal, como:

  - Diferença de votos.

  - Diferença em pontos percentuais.

  - Ranking.

  - Mudança de liderança.

  - Tempo entre sincronizações.

  A aplicação deverá documentar como cada indicador derivado é calculado.

  ## 15.3. Preservação dos dados originais

  Sempre que possível, guardar o conteúdo original recebido em forma verificável.

  Não substituir um arquivo original pelo resultado de sua normalização.

  Se houver necessidade de economizar armazenamento, preservar pelo menos:

  - Hash.

  - Identificação da fonte.

  - Versão do arquivo.

  - Horários relevantes.

  - Dados normalizados.

  - Mecanismo documentado de reconstrução ou auditoria.

  Avaliar o espaço consumido pelo histórico antes de habilitar o armazenamento de todos os arquivos.

  ## 15.4. Correções e reprocessamentos

  O TSE pode atualizar resultados em razão de novas totalizações ou alterações judiciais.

  Não presumir que números de votos sempre crescem.

  O sistema deverá aceitar alterações justificadas pelos novos arquivos oficiais e registrar a sequência observada.

  Não descartar automaticamente um resultado oficial por ter percentual menor que o snapshot anterior.

  ---

  # 16. Estratégia de testes

  ## 16.1. Testes unitários

  Testar:

  - Conversão de percentuais.

  - Interpretação de votos.

  - Diferença entre candidatos.

  - Normalização de UF.

  - Construção de URLs.

  - Validação de abrangências.

  - Seleção de candidatos.

  - Tratamento de valores ausentes.

  - Cálculos derivados.

  - Regras de liderança.

  - Classificação de disponibilidade.

  ## 16.2. Testes de contrato com o TSE

  Criar fixtures que representem respostas oficiais ou simuladas, com os devidos cuidados de proveniência.

  Cenários:

   1. Antes do início da apuração.

   2. Arquivo com zero votos.

   3. Parcial com ambos os candidatos.

   4. Totalização final.

   5. Candidato *sub judice*.

   6. Candidato com votos anulados.

   7. Candidato sem atribuição de eleito.

   8. Arquivo com mais de um agrupamento partidário.

   9. Campos opcionais ausentes.

  10. Percentuais com vírgula decimal.

  11. Mudança de situação de candidato.

  12. Alteração de votos após reprocessamento.

  13. Arquivo válido com geração mais recente.

  14. Arquivo malformado.

  15. Arquivo de eleição diferente da solicitada.

  Esses testes não devem depender de conexão com a internet durante a execução normal do CI.

  ## 16.3. Testes de integração

  Validar:

  - Adaptador → normalizador.

  - Normalizador → repositório.

  - Repositório → API.

  - API → componentes.

  - Sincronização → histórico.

  - Atualização de cache.

  - Recuperação após falha.

  Utilizar ambiente de teste isolado, sem credenciais de produção.

  ## 16.4. Testes ponta a ponta

  Automatizar no Playwright:

  - Carregamento do dashboard.

  - Seleção de estado.

  - Filtros por região.

  - Ordenação da tabela.

  - Consulta de governador.

  - Consulta municipal.

  - Alternância de tema.

  - Visualização responsiva.

  - Mensagens de falha.

  - Estados de carregamento.

  - Links compartilháveis.

  ## 16.5. Testes de segurança

  Verificar:

  - Exposição acidental de variáveis de ambiente.

  - Uso de URLs arbitrárias.

  - Manipulação de parâmetros.

  - Acesso indevido a endpoints internos.

  - Tratamento de valores HTML inesperados.

  - Respostas de erro.

  - Cabeçalhos de segurança.

  - Rate limiting.

  - Dependências vulneráveis.

  - Ausência de segredos no código e no histórico.

  ## 16.6. Testes de acessibilidade

  Verificar:

  - Navegação com teclado.

  - Contraste.

  - Foco.

  - Descrições do mapa.

  - Legendas dos gráficos.

  - Leitura dos resultados por tecnologias assistivas.

  - Atualizações automáticas não intrusivas.

  - Exibição correta no zoom do navegador.

  ## 16.7. Testes de desempenho

  Medir:

  - Tempo de carregamento inicial.

  - Tamanho do JavaScript enviado.

  - Tempo de resposta da API.

  - Tempo de carregamento do mapa.

  - Tempo de renderização dos gráficos.

  - Uso de memória.

  - Custo das consultas ao banco.

  - Quantidade de requisições simultâneas.

  - Tempo de sincronização.

  Não executar testes de carga contra a infraestrutura do TSE.

  Utilizar fixtures locais ou um servidor de simulação próprio.

  ---

  # 17. Qualidade arquitetural

  ## 17.1. Regras de dependência

  Estabelecer as seguintes regras:

  - Domínio não importa Next.js.

  - Domínio não conhece endpoints do TSE.

  - Domínio não depende de MySQL.

  - Componentes React não acessam diretamente o banco.

  - Componentes React não interpretam a estrutura bruta do EA20.

  - Route Handlers utilizam serviços de aplicação.

  - Infraestrutura implementa contratos definidos pela aplicação.

  - Adaptadores externos são testados separadamente.

  ## 17.2. Funções de aptidão arquitetural

  Criar verificações automatizadas para impedir regressões arquiteturais.

  Exemplos:

  - Impedir importações de infraestrutura pelo domínio.

  - Impedir acesso ao TSE a partir de componentes client-side.

  - Impedir `mysql2` no bundle do navegador.

  - Impedir leitura direta de variáveis privadas em componentes cliente.

  - Impedir dependências circulares entre módulos principais.

  Ferramentas como ESLint e dependency-cruiser podem ajudar, caso a complexidade justifique sua introdução.

  ## 17.3. ADRs

  Registrar decisões relevantes em:

  `docs/adr/`

  ADRs recomendados:

  - ADR-001 — Utilizar monólito modular.

  - ADR-002 — Adotar Next.js.

  - ADR-003 — Isolar o adaptador TSE.

  - ADR-004 — Utilizar MySQL para histórico.

  - ADR-005 — Utilizar Cron Jobs para sincronização.

  - ADR-006 — Utilizar GitHub como fonte do código.

  - ADR-007 — Utilizar deploy nativo da Hostinger.

  - ADR-008 — Preservar os dados oficiais e separar os indicadores derivados.

  Cada ADR deverá descrever:

  - Contexto.

  - Decisão.

  - Alternativas consideradas.

  - Consequências.

  - Riscos.

  - Status.

  ---

  # 18. Observabilidade e monitoramento

  ## 18.1. Health check

  Criar a rota:

  `GET /api/health`

  Resposta pública mínima:

  ```
  {
    "status": "ok",
    "service": "electoral-dashboard",
    "version": "1.0.0"
  }
  ```

  Não retornar:

  - Senhas.

  - Dados de conexão.

  - Variáveis privadas.

  - Caminhos internos.

  - Stack traces.

  - Configurações de infraestrutura sensíveis.

  A rota não deve executar consultas custosas ao TSE em cada chamada.

  ## 18.2. Indicadores operacionais

  Monitorar:

  | Indicador | Objetivo |
  | --- | --- |
  | Disponibilidade HTTP | Identificar queda do website |
  | Última sincronização bem-sucedida | Identificar atraso |
  | Idade do snapshot | Identificar dados desatualizados |
  | Falhas por origem | Identificar problema no TSE |
  | Erros de validação | Identificar alteração de contrato |
  | Duração do cron | Identificar crescimento de processamento |
  | Uso de banco | Evitar esgotamento |
  | Uso de memória | Prevenir falhas |
  | Uso de CPU | Identificar saturação |
  | Erros 5xx | Identificar problemas da API |

  ## 18.3. Logs

  Utilizar logs estruturados.

  Campos recomendados:

  - Timestamp.

  - Nível.

  - Evento.

  - Abrangência.

  - Código da eleição.

  - Identificador da execução.

  - Duração.

  - Resultado.

  - Código de erro.

  Exemplo:

  ```
  {
    "level": "info",
    "event": "election_sync_completed",
    "election": "6258",
    "scope": "PR",
    "durationMs": 840,
    "changed": true
  }
  ```

  O exemplo é ilustrativo.

  Não registrar senhas, tokens ou dados privados.

  ## 18.4. Alertas

  Definir condições para intervenção.

  Exemplos:

  - Website indisponível.

  - Job falhando repetidamente.

  - Nenhuma sincronização bem-sucedida dentro do limite configurado.

  - Erros persistentes de validação.

  - Banco próximo do limite de armazenamento.

  - Aumento anormal de HTTP 500.

  Os limiares devem ser configuráveis.

  Após o encerramento da apuração, reduzir a frequência de alertas de atualização para evitar falsos alarmes.

  ---

  # 19. Tratamento de incidentes

  ## 19.1. TSE indisponível

  Procedimento:

  1. Confirmar se o problema está na fonte ou no portal.

  2. Preservar o último resultado válido.

  3. Marcar os dados como desatualizados.

  4. Reduzir a frequência de tentativas.

  5. Registrar o incidente.

  6. Retomar a coleta quando a fonte estiver disponível.

  Não substituir dados indisponíveis por estimativas.

  ## 19.2. Divergência entre o portal e o TSE

  Procedimento:

   1. Identificar a abrangência.

   2. Registrar o horário da comparação.

   3. Consultar o JSON correspondente.

   4. Verificar o identificador de geração.

   5. Verificar se houve atraso de CDN ou cache.

   6. Conferir a interpretação dos campos.

   7. Verificar o cálculo derivado.

   8. Corrigir o adaptador, se necessário.

   9. Criar teste de regressão.

  10. Publicar a correção.

  Nunca corrigir diretamente a quantidade de votos no banco para coincidir visualmente com outra fonte.

  ## 19.3. Erro depois de um deploy

  Procedimento:

  1. Consultar o status do deployment.

  2. Identificar o commit.

  3. Consultar logs.

  4. Verificar variáveis e dependências.

  5. Executar smoke tests.

  6. Reverter a alteração quando necessário.

  7. Avaliar o impacto sobre o banco.

  8. Documentar o incidente.

  ## 19.4. Vazamento de segredo

  Procedimento:

  1. Revogar ou rotacionar o segredo.

  2. Verificar os acessos realizados.

  3. Corrigir a origem do vazamento.

  4. Examinar o histórico Git.

  5. Substituir as credenciais na Hostinger.

  6. Reiniciar ou republicar os serviços afetados.

  7. Registrar medidas preventivas.

  ---

  # 20. Governança, privacidade e transparência

  ## 20.1. Identidade do portal

  O website deverá informar claramente:

  **Portal independente de visualização de resultados eleitorais.**

  Os resultados são provenientes da Justiça Eleitoral, mas o portal não constitui serviço oficial do TSE.

  Evitar marcas, domínios ou textos que possam induzir o visitante a acreditar que está acessando um portal administrado pela Justiça Eleitoral.

  ## 20.2. Uso de dados oficiais

  Respeitar as orientações do TSE e os artigos 264 a 269 da Resolução nº 23.751/2026.

  Requisitos:

  - Preservar a integridade dos dados distribuídos.

  - Manter a identificação da fonte.

  - Consultar os arquivos conforme as orientações técnicas.

  - Respeitar limites de acesso.

  - Não adulterar resultados.

  - Não ocultar a situação oficial dos votos quando relevante.

  - Diferenciar indicadores oficiais de cálculos próprios.

  ## 20.3. Privacidade

  O portal não precisa coletar dados pessoais de eleitores.

  Evitar inicialmente:

  - Cadastro de contas.

  - Formulários com dados pessoais.

  - Cookies de rastreamento.

  - Ferramentas invasivas de analytics.

  - Identificadores persistentes de visitantes.

  Se posteriormente forem utilizadas ferramentas analíticas, revisar a necessidade de política de privacidade, bases legais, cookies e medidas compatíveis com a LGPD.

  ## 20.4. Neutralidade

  A plataforma não deverá:

  - Recomendar voto em candidatos.

  - Manipular a visualização para favorecer candidaturas.

  - Apresentar opiniões políticas como resultados oficiais.

  - Omitir estados desfavoráveis a determinado candidato.

  - Utilizar escalas gráficas enganosas.

  - Apresentar liderança parcial como confirmação de eleição.

  A ordem inicial dos candidatos deve seguir um critério transparente e consistente.

  ---

  # 21. Documentação do repositório

  Criar os seguintes arquivos:

  ```
  README.md
  LICENSE
  CONTRIBUTING.md
  SECURITY.md
  CHANGELOG.md
  
  docs/
  ├── architecture.md
  ├── data-sources.md
  ├── data-contract.md
  ├── normalization-rules.md
  ├── deployment.md
  ├── environment-variables.md
  ├── synchronization.md
  ├── troubleshooting.md
  ├── operations.md
  ├── testing.md
  ├── accessibility.md
  ├── privacy.md
  └── adr/
  ```

  ## 21.1. README.md

  O README deverá conter:

   1. Apresentação do projeto.

   2. Funcionalidades.

   3. Capturas de tela.

   4. Arquitetura.

   5. Tecnologias.

   6. Requisitos.

   7. Instalação.

   8. Configuração local.

   9. Comandos de desenvolvimento.

  10. Testes.

  11. Deploy.

  12. Fonte dos dados.

  13. Limitações conhecidas.

  14. Contribuições.

  15. Segurança.

  16. Licença.

  17. Aviso de independência em relação ao TSE.

  ## 21.2. SECURITY.md

  O documento deve informar:

  - Como comunicar vulnerabilidades.

  - Quais versões recebem correções.

  - O que não deve ser divulgado em issues públicas.

  - Como serão tratadas comunicações de segurança.

  - Limitações do projeto.

  Preferir mecanismos privados de comunicação de vulnerabilidades do GitHub, quando disponíveis.

  ## 21.3. CONTRIBUTING.md

  Definir:

  - Requisitos de desenvolvimento.

  - Convenções de commits.

  - Estratégia de branches.

  - Padrões de código.

  - Execução dos testes.

  - Como abrir Pull Requests.

  - Critérios para novas funcionalidades.

  ---

  # 22. Plano de implementação por fases

  A implementação deve ser incremental.

  ## Fase 1 — Fundação do projeto

  **Objetivo:** ter uma aplicação local estruturada e verificável.

  Tarefas:

  - Criar projeto Next.js.

  - Configurar TypeScript.

  - Configurar Tailwind.

  - Definir organização de diretórios.

  - Configurar ESLint.

  - Configurar testes.

  - Criar layout principal.

  - Configurar temas.

  - Criar componentes de estado vazio.

  - Criar testes iniciais.

  - Criar documentação.

  - Configurar Git e GitHub.

  - Criar workflow de CI.

  **Entregável:** aplicação base executando localmente e validada pelo GitHub Actions.

  ## Fase 2 — Integração oficial

  **Objetivo:** consumir os dados do TSE corretamente.

  Tarefas:

  - Validar a configuração das eleições.

  - Implementar cliente HTTP oficial.

  - Implementar construção segura de URLs.

  - Criar schemas Zod.

  - Implementar normalização de dados.

  - Criar modelos internos.

  - Criar API nacional.

  - Criar API estadual.

  - Tratar indisponibilidade.

  - Implementar cache inicial.

  - Criar testes de contrato.

  - Validar contra os arquivos oficiais.

  **Entregável:** API própria funcionando com resultados reais ou fixtures verificadas.

  ## Fase 3 — Dashboard principal

  **Objetivo:** entregar a experiência principal de acompanhamento.

  Tarefas:

  - Criar cards nacionais.

  - Criar tabela com as 27 UFs.

  - Criar mapa interativo.

  - Implementar seleção de estado.

  - Implementar filtros.

  - Implementar ordenação.

  - Implementar página estadual.

  - Exibir origem e horário da fonte.

  - Implementar atualização visual.

  - Tratar dados ausentes.

  - Ajustar versão mobile.

  - Testar acessibilidade.

  **Entregável:** MVP público com resultado presidencial por estado.

  ## Fase 4 — Expansão funcional

  **Objetivo:** disponibilizar as funcionalidades complementares.

  Tarefas:

  - Identificar UFs com segundo turno para governador.

  - Criar tela de governadores.

  - Implementar consulta municipal.

  - Integrar configuração de municípios.

  - Exibir votos brancos e nulos.

  - Exibir comparecimento e abstenção.

  - Criar páginas compartilháveis.

  - Criar página de metodologia.

  - Criar indicadores de qualidade de dados.

  **Entregável:** portal completo de consulta presidencial, estadual e municipal.

  ## Fase 5 — Histórico e sincronização

  **Objetivo:** coletar e armazenar a evolução dos resultados.

  Tarefas:

  - Criar banco MySQL.

  - Configurar migrações.

  - Criar repositórios.

  - Implementar snapshots.

  - Implementar deduplicação.

  - Criar sincronizador.

  - Criar locking.

  - Integrar acompanhamento EA14/EA15.

  - Configurar cron.

  - Criar histórico temporal.

  - Criar gráficos de evolução.

  - Implementar backup.

  - Monitorar sincronização.

  **Entregável:** dashboard histórico com dados efetivamente coletados.

  ## Fase 6 — Produção e estabilização

  **Objetivo:** tornar o portal operacional e seguro para acesso público.

  Tarefas:

  - Revisar vulnerabilidades.

  - Executar testes de integração.

  - Executar testes E2E.

  - Executar testes responsivos.

  - Verificar acessibilidade.

  - Revisar LGPD e transparência.

  - Revisar integração oficial.

  - Configurar Hostinger.

  - Configurar variáveis privadas.

  - Configurar domínio.

  - Ativar HTTPS.

  - Habilitar deploy automático.

  - Configurar health check.

  - Configurar monitoramento.

  - Validar backup e restauração.

  - Validar procedimento de rollback.

  - Executar smoke tests após deploy.

  **Entregável:** portal publicado, monitorado e documentado.

  ---

  # 23. Critérios de aceite do projeto completo

  | Área | Critério |
  | --- | --- |
  | Nacional | Exibe resultado presidencial oficial |
  | Estados | Apresenta todas as 27 UFs |
  | Mapa | Permite seleção e comparação |
  | Tabela | Permite ordenação e filtros |
  | Governadores | Exibe estados com segundo turno |
  | Municípios | Permite consulta pelos códigos oficiais |
  | Percentuais | Utiliza denominadores corretos |
  | Totalização | Diferencia parcial e final |
  | Histórico | Exibe somente observações coletadas |
  | Atualização | Atualiza sem recarregar a página |
  | Indisponibilidade | Mantém o último resultado válido identificado |
  | Fonte | Identifica o TSE e os horários relevantes |
  | Segurança | Não expõe segredos |
  | GitHub | Repositório público e protegido |
  | CI | Testes e build aprovados |
  | Hostinger | Deploy da branch principal |
  | Banco | Credenciais privadas e backup |
  | Cron | Execução idempotente e sem sobreposição |
  | Acessibilidade | Navegação e informações acessíveis |
  | Mobile | Interface responsiva |
  | Transparência | Metodologia publicada |
  | Integridade | Dados oficiais preservados |
  | Observabilidade | Saúde e sincronização monitoradas |

  ---

  # 24. Checklist final de publicação pública

  ## Código e dependências

  - Nenhum segredo versionado.

  - Histórico Git revisado.

  - `.gitignore` validado.

  - `.env.example` sem credenciais.

  - Dependabot configurado.

  - Secret scanning habilitado.

  - Push protection habilitada.

  - Dependências auditadas.

  - CI passando.

  - Build de produção passando.

  ## Segurança de infraestrutura

  - GitHub com 2FA.

  - Hostinger com 2FA.

  - Permissões da integração GitHub revisadas.

  - Banco com credenciais exclusivas.

  - Variáveis de ambiente privadas.

  - HTTPS habilitado.

  - Endpoints internos protegidos.

  - Nenhuma rota administrativa pública desnecessária.

  ## Dados eleitorais

  - Código da eleição validado.

  - Fonte TSE validada.

  - Campos EA20 mapeados corretamente.

  - Percentuais conferidos.

  - Situação de candidaturas respeitada.

  - Dados do exterior considerados no resultado nacional.

  - Tratamento de resultados parciais validado.

  - Testes de indisponibilidade executados.

  - Identificação da fonte disponível na interface.

  - Sem dados simulados apresentados como reais.

  ## Operação

  - Deploy automático validado.

  - Health check funcionando.

  - Jobs agendados funcionando.

  - Nenhuma execução sobreposta.

  - Backups configurados.

  - Restauração testada.

  - Rollback documentado.

  - Logs sem segredos.

  - Alertas importantes configurados.

  ## Interface

  - Desktop validado.

  - Tablet validado.

  - Mobile validado.

  - Navegação por teclado.

  - Informações acessíveis.

  - Mapa funcional.

  - Tabela com 27 UFs.

  - Filtros funcionais.

  - Atualização automática.

  - Metodologia publicada.

  - Links de compartilhamento corretos.

  ---

  # 25. Definição de pronto

  Uma funcionalidade será considerada pronta somente quando:

   1. Atender aos requisitos especificados.

   2. Possuir tratamento adequado de falhas.

   3. Estiver coberta pelos testes relevantes.

   4. Não introduzir vulnerabilidades conhecidas sem tratamento.

   5. Não comprometer a integridade dos dados eleitorais.

   6. Funcionar no desktop e no mobile.

   7. Atender aos requisitos de acessibilidade pertinentes.

   8. Possuir documentação suficiente.

   9. Passar nas verificações do CI.

  10. Estiver validada no ambiente de publicação.

  ---

  # 26. Ordem de execução recomendada

  A sequência mais eficiente para um desenvolvedor individual é:

  **Primeiro:** construir o cliente do TSE, os contratos e os testes de normalização.

  **Segundo:** construir a API nacional e estadual.

  **Terceiro:** desenvolver o dashboard, a tabela e o mapa.

  **Quarto:** publicar a versão inicial na Hostinger, sem banco, validando a integração GitHub–Hostinger.

  **Quinto:** acrescentar governadores e municípios.

  **Sexto:** implementar MySQL, sincronização, snapshots e histórico.

  **Sétimo:** acrescentar monitoramento operacional e otimizações.

  Isso evita que a implementação comece pelos componentes mais complexos sem que a integração oficial tenha sido validada.

  A arquitetura proposta permite substituir gradualmente o cache inicial por armazenamento durável sem reestruturar toda a aplicação.

  ---

  # 27. Riscos e decisões pendentes

  | Decisão | Recomendação inicial |
  | --- | --- |
  | Nome definitivo | Painel Eleitoral Brasil |
  | Hospedagem | Hostinger Node.js gerenciada |
  | Framework | Next.js |
  | Linguagem | TypeScript |
  | Persistência | MySQL quando houver histórico |
  | Deploy | Integração nativa GitHub–Hostinger |
  | Sincronização | Cron Job da Hostinger |
  | Frequência | Configurável por capacidade e disponibilidade |
  | Mapas | Geometria estática licenciada |
  | Licença do código | MIT, após revisão |
  | Autenticação | Não implementar |
  | Analytics | Não implementar inicialmente |
  | Administração | Sem painel administrativo |
  | Infraestrutura adicional | Evitar no MVP |

  **Pendências a verificar antes do início da implantação:**

  - Plano contratado na Hostinger.

  - Disponibilidade e frequência dos Cron Jobs.

  - Limites efetivos do banco MySQL.

  - Requisitos de memória do build Next.js.

  - Licença dos arquivos geográficos.

  - Implementação exata do adaptador EA20.

  - Disponibilidade dos arquivos municipais oficiais.

  - Regras de retenção do histórico.

  - Condições de licenciamento dos ativos visuais.

  ---

  # 28. Referências oficiais e técnicas

  ## Justiça Eleitoral

  Informações técnicas para divulgação de resultados:

  <https://www.tse.jus.br/eleicoes/informacoes-tecnicas-sobre-a-divulgacao-de-resultados>

  Resolução TSE nº 23.751/2026:

  <https://www.tse.jus.br/legislacao/compilada/res/2026/resolucao-no-23-751-de-26-de-fevereiro-de-2026>

  Portal de resultados:

  <https://resultados.tse.jus.br/>

  ## Hostinger

  Hospedagem Node.js:

  <https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/>

  Cron Jobs para Node.js:

  <https://www.hostinger.com/support/how-to-run-cron-jobs-for-node-js-websites-at-hostinger/>

  Limites Node.js:

  <https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/>

  Conexão MySQL:

  <https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/>

  ## GitHub

  Segurança e análise:

  <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-security-and-analysis-settings-for-your-repository>

  Proteção de branches:

  <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule>

  ## Framework

  Next.js:

  <https://nextjs.org/docs>

  TypeScript:

  <https://www.typescriptlang.org/docs/>

  ---

  # 29. Resultado esperado

  Ao final da construção, o Painel Eleitoral Brasil deverá ser uma aplicação web pública capaz de:

  - Consumir resultados oficiais das eleições.

  - Exibir a apuração nacional e por estado.

  - Permitir consultas estaduais e municipais.

  - Comparar os resultados de candidatos.

  - Apresentar mapas e gráficos.

  - Atualizar resultados automaticamente.

  - Preservar o histórico efetivamente coletado.

  - Informar indisponibilidades e atrasos.

  - Preservar a integridade dos dados oficiais.

  - Ser mantida em um repositório GitHub público.

  - Passar por verificações automatizadas.

  - Ser publicada automaticamente na Hostinger.

  - Permitir recuperação de falhas e evolução futura.

  **Princípio final:** o projeto deve ser verificável, seguro, transparente e independente, sem criar complexidade operacional desnecessária.

  A publicação pública do código é compatível com essa arquitetura, desde que os controles descritos sejam implementados e verificados. Nenhuma configuração isolada elimina todos os riscos; a segurança depende também da manutenção contínua, das permissões das contas e da operação da hospedagem.

  **Fim da especificação de construção — versão 1.0.**
```