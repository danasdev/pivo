// Dá (ou tira) acesso ao painel: grava a "custom claim" admin == true na conta.
// A pessoa precisa já ter criado a conta no site. Depois, ela deve sair e entrar de novo.
//   GOOGLE_APPLICATION_CREDENTIALS=~/chaves/pivo-admin.json npm run admin -- email@loja.com
//   GOOGLE_APPLICATION_CREDENTIALS=~/chaves/pivo-admin.json npm run admin -- email@loja.com --remover
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const [email, flag] = process.argv.slice(2);
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS || !email) {
  console.error('Uso: GOOGLE_APPLICATION_CREDENTIALS=<chave fora do projeto> npm run admin -- email@loja.com [--remover]');
  process.exit(1);
}
initializeApp({ credential: applicationDefault(), projectId: 'pivo-store' });
const auth = getAuth();
const user = await auth.getUserByEmail(email);
const remover = flag === '--remover';
await auth.setCustomUserClaims(user.uid, remover ? {} : { admin: true });
await auth.revokeRefreshTokens(user.uid);   // força o token novo no próximo login
console.log(`${email}: acesso ao painel ${remover ? 'removido' : 'liberado'}. Peça para sair e entrar de novo.`);
