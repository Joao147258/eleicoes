# Procedimento de Rollback

Caso uma versão publicada apresente instabilidade ou inconsistência após a publicação, siga este procedimento de reversão:

## 1. Rollback via Git / GitHub

1. Identifique o hash do último commit estável:
   ```bash
   git log --oneline -n 5
   ```
2. Crie um commit de reversão (revert) sobre a branch `main`:
   ```bash
   git revert HEAD --no-edit
   git push origin main
   ```
3. O deploy automático da Hostinger detectará o novo commit de reversão e rebuildará a versão estável anterior.

## 2. Rollback Manual na Hostinger

1. Acesse o painel da Hostinger (hPanel) > Websites > `eleicoes.joaovitordantas.com.br`.
2. Vá na seção **Aplicações Node.js / Git**.
3. Na lista de builds anteriores, selecione o build estável e clique em **Redeploy / Reverter para este build**.
4. Verifique os logs de inicialização para garantir a restauração do serviço.
