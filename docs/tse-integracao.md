# Integração Oficial com o Tribunal Superior Eleitoral (TSE)

## 1. Fonte Primária

O projeto utiliza exclusivamente os dados abertos oficiais divulgados pelo Tribunal Superior Eleitoral:
- **Divulgação de Resultados:** `https://resultados.tse.jus.br/`
- **Configuração Oficial Geral:** `https://resultados.tse.jus.br/oficial/comum/config/ele-c.json`

## 2. Arquivos Unificados de Resultados (Especificação EA20)

O TSE distribui os resultados em arquivos estáticos no formato JSON terminados em `-u.json`:

- **Presidente (Nacional - Brasil):**
  `https://resultados.tse.jus.br/oficial/ele2026/6258/dados/br/br-c0001-e006258-u.json`
- **Presidente (Estadual - por UF):**
  `https://resultados.tse.jus.br/oficial/ele2026/6258/dados/{uf}/{uf}-c0001-e006258-u.json`
- **Governador (Estadual - 2º Turno):**
  `https://resultados.tse.jus.br/oficial/ele2026/6260/dados/{uf}/{uf}-c0003-e006260-u.json`

## 3. Mapeamento dos Principais Campos EA20

| Campo Oficial TSE | Significado | Tratamento no Normalizador |
|---|---|---|
| `ele` | Código da eleição | Mantido como identificador oficial |
| `t` | Turno da eleição | Convertido em número |
| `s.ts` | Total de seções eleitorais | Convertido de string para inteiro |
| `s.st` | Seções totalizadas | Convertido de string para inteiro |
| `s.pst` | % de seções totalizadas | Convertido para float com 2 casas |
| `cand[].n` | Número de urna | String preservando formato |
| `cand[].nmu` | Nome de urna | Normalizado para exibição |
| `cand[].vap` | Votos apurados | Convertido de string para inteiro |
| `cand[].pvap` | % de votos válidos | Convertido de string com vírgula para float |
| `cand[].e` | Indicador de eleito (`s`/`n`) | Booleano (`true`/`false`) |
| `cand[].dvt` | Situação da votação | Classificação oficial do TSE |
| `v.vv`, `v.vb`, `v.vn` | Votos válidos, brancos, nulos | Normalizados em `VoteStats` |
| `e.c`, `e.a` | Comparecimento e abstenção | Normalizados em `VoterStats` |

## 4. Tratamento de Indisponibilidade

1. **Nunca inventar números:** Caso os servidores do TSE retornem status diferente de 200 ou ocorra timeout, a aplicação preserva o último resultado válido em cache.
2. **Sinalização na Interface:** O usuário é informado de forma transparente sobre a indisponibilidade momentânea da fonte, indicando data e hora da última coleta bem-sucedida.
