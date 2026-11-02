// Carrega o catálogo (site/data/catalogo.json) no Firestore.
// Usa o Admin SDK: precisa da chave de conta de serviço, que NUNCA vai para o repositório nem para o site.
//   1. Firebase Console > Configurações do projeto > Contas de serviço > Gerar nova chave privada
//   2. Salve FORA do projeto (ex.: ~/chaves/pivo-admin.json)
//   3. GOOGLE_APPLICATION_CREDENTIALS=~/chaves/pivo-admin.json npm run seed
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFile } from 'node:fs/promises';

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Defina GOOGLE_APPLICATION_CREDENTIALS com o caminho da chave de conta de serviço (fora do projeto).');
  process.exit(1);
}
initializeApp({ credential: applicationDefault(), projectId: 'pivo-store' });
const db = getFirestore();
const { categorias, produtos } = JSON.parse(await readFile(new URL('../site/data/catalogo.json', import.meta.url)));

const lote = db.batch();
for (const c of categorias) lote.set(db.doc(`categorias/${c.slug}`), { nome: c.nome, desc: c.desc, ordem: c.ordem });
for (const p of produtos) {
  const { id, ...dados } = p;
  if (!/^[a-z0-9-]{3,80}$/.test(id)) throw new Error(`id inválido: ${id}`);
  lote.set(db.doc(`produtos/${id}`), { ...dados, esgot: dados.esgot || [], uso: dados.uso || '', ativo: dados.ativo !== false, atualizadoEm: FieldValue.serverTimestamp() });
}
await lote.commit();
console.log(`Pronto: ${categorias.length} categorias e ${produtos.length} produtos no Firestore.`);
