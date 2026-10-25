# Política de Segurança — Painel Eleitoral Brasil

## Reporte de Vulnerabilidades

A segurança do **Painel Eleitoral Brasil** é levada a sério. Caso você identifique qualquer vulnerabilidade de segurança, solicitamos que não abra uma issue pública.

Em vez disso, envie um e-mail com os detalhes técnicos e passos para reprodução para:
**contato@joaovitordantas.com.br**

## Boas Práticas Adotadas

1. **Sem Segredos ou Credenciais**: Todo o código é auditado para garantir ausência total de tokens privados, senhas ou strings de conexão.
2. **Sem Intermediação ou Coleta de Dados Pessoais**: O portal não armazena cookies invasivos, nem solicita cadastro ou dados pessoais de eleitores.
3. **Consumo Isolado de Fontes Públicas**: Todas as chamadas para dados oficiais do TSE são normalizadas e validadas rigidamente no servidor com schemas Zod, prevenindo SSRF e injeção de dados corrompidos.
4. **Proteção de Headers e Cache**: Respostas HTTP possuem cabeçalhos seguros para mitigar ataques comuns da web.
