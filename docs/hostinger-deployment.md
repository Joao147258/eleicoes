# Implantação na Hostinger (Node.js & GitHub Auto-Deployment)

## 1. Visão Geral

O **Painel Eleitoral Brasil** é implantado na **Hostinger** como uma aplicação independente **Node.js** associada ao subdomínio:
`eleicoes.joaovitordantas.com.br`

## 2. Configurações da Aplicação na Hostinger

- **Tipo da Aplicação:** `nodejs` / `next`
- **Versão do Node.js:** Node.js 22 (ou 20+)
- **Diretório Raiz:** Document Root / public_html
- **Build Script:** `npm run build`
- **Start Script / Entry Point:** `npm start`
- **Package Manager:** `npm`

## 3. Integração Contínua GitHub → Hostinger

A Hostinger conecta-se ao repositório GitHub através da instalação Git do usuário (`Joao147258/eleicoes`), monitorando a branch `main`.

A cada novo commit ou merge integrado à branch `main`:
1. O workflow do GitHub Actions executa a suíte de testes e validação.
2. O webhook da Hostinger identifica o novo commit na branch `main`.
3. A Hostinger aciona o pipeline de build e deploy automático.
4. A nova versão entra no ar sem downtime.
