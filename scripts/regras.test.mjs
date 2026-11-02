// Testes das regras de segurança (rodam no emulador do Firebase; precisa de Java instalado).
//   cd scripts && npm install && npx firebase-tools login (uma vez) && npm run test:rules
import { test, before, after, beforeEach } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, writeBatch, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

let env;
const produtoOk = { nome: 'Teste', cat: 'bolsas', preco: 100, img: 'img/produtos/x.jpg', ativo: true };

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-pivo',
    firestore: { rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8'), host: '127.0.0.1', port: 8080 },
  });
});
after(() => env.cleanup());
beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx => {
    await setDoc(doc(ctx.firestore(), 'produtos/existente'), produtoOk);
    await setDoc(doc(ctx.firestore(), 'pedidos/de-bia'), { uid: 'bia', itens: [{ id: 'existente', t: null, q: 1 }], status: 'novo' });
  });
});

const anon = () => env.unauthenticatedContext().firestore();
const cliente = (uid = 'ana', verificado = true) => env.authenticatedContext(uid, { email: `${uid}@x.com`, email_verified: verificado }).firestore();
const adm = () => env.authenticatedContext('dona', { email: 'dona@x.com', email_verified: true, admin: true }).firestore();

function pedido(db, uid, extra = {}) {
  const b = writeBatch(db);
  b.set(doc(db, 'usuarios', uid), { ultimoPedido: serverTimestamp() }, { merge: true });
  b.set(doc(collection(db, 'pedidos')), { uid, itens: [{ id: 'existente', t: 36, q: 1 }], status: 'novo', criadoEm: serverTimestamp(), email: `${uid}@x.com`, ...extra });
  return b.commit();
}

test('catálogo: qualquer pessoa lê', () => assertSucceeds(getDoc(doc(anon(), 'produtos/existente'))));
test('catálogo: visitante não escreve', () => assertFails(setDoc(doc(anon(), 'produtos/novo-item'), produtoOk)));
test('catálogo: cliente não escreve', () => assertFails(setDoc(doc(cliente(), 'produtos/novo-item'), produtoOk)));
test('catálogo: cliente não muda preço', () => assertFails(updateDoc(doc(cliente(), 'produtos/existente'), { preco: 1 })));
test('catálogo: admin escreve produto válido', () => assertSucceeds(setDoc(doc(adm(), 'produtos/novo-item'), produtoOk)));
test('catálogo: admin não grava preço inválido', () => assertFails(setDoc(doc(adm(), 'produtos/novo-item'), { ...produtoOk, preco: -5 })));
test('catálogo: admin não grava imagem javascript:', () => assertFails(setDoc(doc(adm(), 'produtos/novo-item'), { ...produtoOk, img: 'javascript:alert(1)' })));
test('catálogo: admin não grava campo desconhecido', () => assertFails(setDoc(doc(adm(), 'produtos/novo-item'), { ...produtoOk, script: '<x>' })));

test('conta: lê a própria', () => assertSucceeds(getDoc(doc(cliente('ana'), 'usuarios/ana'))));
test('conta: não lê a de outra pessoa', () => assertFails(getDoc(doc(cliente('ana'), 'usuarios/bia'))));
test('conta: salva sacola e favoritos', () => assertSucceeds(setDoc(doc(cliente('ana'), 'usuarios/ana'), { sacola: [], favoritos: ['existente'] })));
test('conta: não se promove a admin', () => assertFails(setDoc(doc(cliente('ana'), 'usuarios/ana'), { admin: true })));

test('pedido: cliente verificada cria', () => assertSucceeds(pedido(cliente('ana'), 'ana')));
test('pedido: e-mail não verificado não cria', () => assertFails(pedido(cliente('ana', false), 'ana')));
test('pedido: não aceita preço vindo do navegador', () => assertFails(pedido(cliente('ana'), 'ana', { total: 1 })));
test('pedido: não cria em nome de outra pessoa', () => assertFails(pedido(cliente('ana'), 'bia')));
test('pedido: não nasce com status pago', () => assertFails(pedido(cliente('ana'), 'ana', { status: 'entregue' })));
test('pedido: segundo pedido em menos de 1 minuto é bloqueado', async () => {
  const db = cliente('ana');
  await assertSucceeds(pedido(db, 'ana'));
  await assertFails(pedido(db, 'ana'));
});
test('pedido: não lê o de outra pessoa', () => assertFails(getDoc(doc(cliente('ana'), 'pedidos/de-bia'))));
test('pedido: lista só os próprios', () => assertSucceeds(getDocs(query(collection(cliente('bia'), 'pedidos'), where('uid', '==', 'bia')))));
test('pedido: listar tudo sem filtro é negado', () => assertFails(getDocs(collection(cliente('ana'), 'pedidos'))));
test('pedido: cliente não muda status', () => assertFails(updateDoc(doc(cliente('bia'), 'pedidos/de-bia'), { status: 'entregue' })));
test('pedido: admin muda status', () => assertSucceeds(updateDoc(doc(adm(), 'pedidos/de-bia'), { status: 'confirmado' })));
test('pedido: admin não altera itens', () => assertFails(updateDoc(doc(adm(), 'pedidos/de-bia'), { itens: [] })));

test('qualquer outra coleção é fechada', () => assertFails(setDoc(doc(adm(), 'segredos/x'), { a: 1 })));
