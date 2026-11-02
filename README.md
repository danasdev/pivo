# PIVÔ — loja

Site estático (pasta `site/`) publicado na Vercel, com Firebase (Auth + Firestore + Storage) como banco.

## Segurança em uma frase
A configuração do Firebase em `site/js/firebase.js` é **pública por natureza**. Quem protege os dados são as
**regras** (`firestore.rules`, `storage.rules`), o **App Check** e a **restrição da chave por domínio**.
Chave de conta de serviço (Admin SDK) **nunca** entra no repositório nem no site: guarde fora do projeto.

## Colocar no ar (uma vez)
1. **Firestore**: Console do Firebase › Firestore Database › Criar banco (modo produção, região `southamerica-east1`).
2. **Authentication**: ativar os provedores *E-mail/senha* e *Google*. Em *Configurações › Domínios autorizados*, adicionar o domínio da Vercel.
3. **Regras e índices**:
   ```
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules,firestore:indexes,storage
   ```
   O Storage pede o plano Blaze em projetos novos. Sem ele, use caminhos `img/...` nas fotos e publique só `firestore:rules,firestore:indexes`.
4. **Catálogo**: gerar a chave em *Configurações do projeto › Contas de serviço › Gerar nova chave privada*, salvar **fora** do projeto e rodar:
   ```
   cd scripts && npm install
   GOOGLE_APPLICATION_CREDENTIALS=~/chaves/pivo-admin.json npm run seed
   ```
5. **Admin**: criar a conta no site (`/conta`) e liberar o painel:
   `GOOGLE_APPLICATION_CREDENTIALS=~/chaves/pivo-admin.json npm run admin -- seu@email.com`
6. **Restringir a chave**: Google Cloud Console › APIs e serviços › Credenciais › a chave do navegador ›
   Restrições de aplicativo = *Referenciadores HTTP*: `https://SEU-DOMINIO/*`, `https://*.vercel.app/*`, `http://localhost:*/*`.
7. **App Check**: criar uma chave reCAPTCHA v3, colar em `CONFIG.appCheckKey` (`site/js/util.js`), registrar em Firebase › App Check
   e, depois de ver as métricas ok, **ativar a imposição** para Firestore, Storage e Authentication.
8. **WhatsApp**: preencher `CONFIG.whatsapp` em `site/js/util.js` (só dígitos, ex.: `5511999999999`).

## Testar as regras
Precisa de Java. `cd scripts && npm install && npm run test:rules`

## Dados
- `produtos/{id}` e `categorias/{slug}`: leitura pública, escrita só admin.
- `usuarios/{uid}`: sacola e favoritos; só a própria pessoa (e admin) lê.
- `pedidos/{id}`: só ids, tamanhos e quantidades. O preço é recalculado pela loja no painel. Exige e-mail verificado e no máximo 1 pedido por minuto por conta.
- `site/data/catalogo.json`: fonte do `seed` e reserva do site enquanto o Firestore não responde.
