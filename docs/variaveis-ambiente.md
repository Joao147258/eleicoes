# Variáveis de Ambiente

As configurações da aplicação são gerenciadas via variáveis de ambiente.

## Arquivos

- `.env.example`: Arquivo de exemplo versionado com valores padrão e sem dados sensíveis.
- `.env.local`: Arquivo local para desenvolvimento (ignorado pelo `.gitignore`).

## Tabela de Variáveis

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `TSE_CDN_BASE_URL` | Não | `https://resultados.tse.jus.br/oficial` | URL base da infraestrutura oficial do TSE |
| `NEXT_PUBLIC_DEFAULT_ELECTION_CODE` | Não | `6258` | Código oficial da eleição presidencial de segundo turno de 2026 |
| `NEXT_PUBLIC_STATE_ELECTION_CODE` | Não | `6260` | Código oficial da eleição estadual de segundo turno de 2026 |
| `API_CACHE_TTL_SECONDS` | Não | `15` | Tempo de cache em segundos para as rotas internas de API |

## Segurança

- Nenhuma credencial privada, senha ou chave de API secreta é exigida para a visualização pública dos resultados, uma vez que a CDN do TSE é aberta.
- É expressamente proibido versionar arquivos com chaves privadas no Git.
