/* Camada de dados da loja: catálogo, conta, sacola e favoritos sincronizados, pedidos e consentimento de cookies. */
import { db, auth, app, SDK } from './firebase.js';
import { collection, getDocs, doc, getDoc, setDoc, writeBatch, serverTimestamp, query, where, orderBy, limit }
  from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';

const str = (v, max) => typeof v === 'string' ? v.slice(0, max) : '';
const nums = v => Array.isArray(v) ? v.filter(n => Number.isInteger(n) && n > 0 && n < 60).slice(0, 20) : [];

/* Normaliza cada produto: só os campos esperados, com os tipos certos. */
function limparProduto(id, d){
  return {
    id: str(id, 80), nome: str(d.nome, 120), cat: str(d.cat, 40),
    preco: Math.max(0, Number(d.preco) || 0), nota: Math.min(5, Math.max(0, Number(d.nota) || 0)), aval: Math.max(0, Number.parseInt(d.aval) || 0),
    estoque: str(d.estoque, 60), novo: d.novo === true,
    img: safeUrl(d.img), uso: safeUrl(d.uso),
    tam: Array.isArray(d.tam) && d.tam.length ? nums(d.tam) : null, esgot: nums(d.esgot),
    desc: str(d.desc, 1200), detalhes: Array.isArray(d.detalhes) ? d.detalhes.map(x => str(x, 200)).filter(Boolean).slice(0, 12) : [],
    ordem: Number(d.ordem) || 0,
  };
}

async function carregarCatalogo(){
  let cats = [], prods = [];
  try {
    // sem resposta em 4 s (rede ruim, banco não criado), segue com a reserva
    const espera = new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error('tempo esgotado'), {code: 'timeout'})), 4000));
    const [cs, ps] = await Promise.race([Promise.all([
      getDocs(collection(db, 'categorias')),
      getDocs(query(collection(db, 'produtos'), where('ativo', '==', true))),
    ]), espera]);
    cats = cs.docs.map(d => ({slug: str(d.id, 40), nome: str(d.data().nome, 60), desc: str(d.data().desc, 160), ordem: Number(d.data().ordem) || 0}));
    prods = ps.docs.map(d => limparProduto(d.id, d.data()));
  } catch (e) {
    console.warn('[PIVÔ] Firestore indisponível, usando o catálogo local.', e.code || e.message);
  }
  if (!prods.length) {
    // reserva: o mesmo arquivo que alimenta o banco (scripts/seed.mjs)
    try {
      const j = await (await fetch('data/catalogo.json', {cache: 'no-cache'})).json();
      cats = j.categorias.map(c => ({slug: c.slug, nome: c.nome, desc: c.desc, ordem: c.ordem}));
      prods = j.produtos.filter(p => p.ativo !== false).map(p => limparProduto(p.id, p));
    } catch (e) { console.error('[PIVÔ] Catálogo indisponível.', e); }
  }
  if (cats.length) window.CATEGORIAS = cats.sort((a, b) => a.ordem - b.ordem);
  window.PRODUTOS = prods.sort((a, b) => a.ordem - b.ordem);
  window.__lojaPronta = true;
  dispatchEvent(new CustomEvent('loja:pronta'));
}

/* ---------- conta: sacola e favoritos acompanham a pessoa ---------- */
const Loja = window.Loja = { user: null };
let salvarT;
function salvarNaConta(){
  if (!Loja.user) return;
  clearTimeout(salvarT);
  salvarT = setTimeout(() => {
    setDoc(doc(db, 'usuarios', Loja.user.uid), {
      sacola: Sacola.itens().map(i => ({id: i.id, t: i.t, q: i.q})),
      favoritos: Favs.lista(),
      atualizado: serverTimestamp(),
    }, {merge: true}).catch(e => console.warn('[PIVÔ] Não foi possível salvar na conta.', e.code));
  }, 600);
}
addEventListener('sacola:mudou', salvarNaConta);
addEventListener('favs:mudou', salvarNaConta);

onAuthStateChanged(auth, async user => {
  Loja.user = user;
  document.querySelectorAll('[data-conta]').forEach(a => a.setAttribute('aria-label', user ? 'Minha conta' : 'Entrar'));
  if (user) {
    try {
      const snap = await getDoc(doc(db, 'usuarios', user.uid));
      const d = snap.exists() ? snap.data() : {};
      // junta o que estava no navegador com o que estava na conta
      const local = Sacola.itens(), remota = Array.isArray(d.sacola) ? d.sacola : [];
      const mapa = new Map();
      [...remota, ...local].forEach(i => {
        if (!i || typeof i.id !== 'string') return;
        const k = i.id + '|' + (i.t || ''), q = Math.min(20, Math.max(1, Number.parseInt(i.q) || 1));
        mapa.set(k, {id: i.id, t: i.t ? +i.t : null, q: Math.max(q, (mapa.get(k) || {}).q || 0)});
      });
      Sacola.salvar([...mapa.values()], true);
      Favs.salvar([...new Set([...(Array.isArray(d.favoritos) ? d.favoritos : []), ...Favs.lista()])].filter(x => typeof x === 'string'), true);
      salvarNaConta();
    } catch (e) { console.warn('[PIVÔ] Conta indisponível.', e.code); }
  }
  dispatchEvent(new CustomEvent('loja:usuario', {detail: user}));
});

/* Cria o pedido: grava só ids, tamanhos e quantidades — o preço é sempre recalculado pela loja a partir do catálogo.
   O lote atualiza "ultimoPedido" na conta: as regras exigem 60 s entre pedidos (antispam). */
Loja.criarPedido = async (itens, extra = {}) => {
  const u = Loja.user;
  if (!u) throw Object.assign(new Error('sem-conta'), {code: 'sem-conta'});
  if (!u.emailVerified) throw Object.assign(new Error('nao-verificado'), {code: 'nao-verificado'});
  const ref = doc(collection(db, 'pedidos'));
  const b = writeBatch(db);
  b.set(doc(db, 'usuarios', u.uid), {ultimoPedido: serverTimestamp()}, {merge: true});
  b.set(ref, {
    uid: u.uid,
    itens: itens.slice(0, 20).map(i => ({id: String(i.id).slice(0, 80), t: i.t ? +i.t : null, q: Math.min(20, Math.max(1, i.q | 0))})),
    nome: str(extra.nome || u.displayName || '', 80),
    email: u.email || '',   // para a loja responder; as regras conferem que é o e-mail da própria conta
    obs: str(extra.obs || '', 500),
    status: 'novo',
    criadoEm: serverTimestamp(),
  });
  await b.commit();
  return ref.id;
};

Loja.meusPedidos = async () => {
  if (!Loja.user) return [];
  const s = await getDocs(query(collection(db, 'pedidos'), where('uid', '==', Loja.user.uid), orderBy('criadoEm', 'desc'), limit(30)));
  return s.docs.map(d => ({id: d.id, ...d.data()}));
};

/* ---------- cookies: o Analytics só liga depois do "aceitar" ---------- */
const CK = 'pivo-cookies';
function consentimento(){ try { return localStorage.getItem(CK); } catch(e){ return null; } }
async function ligarAnalytics(){
  try {
    const { getAnalytics, isSupported } = await import(`${SDK}/firebase-analytics.js`);
    if (await isSupported()) getAnalytics(app);
  } catch (e) { /* bloqueadores de anúncio impedem: tudo bem */ }
}
function bannerCookies(){
  if (document.getElementById('cookies')) return;
  const el = document.createElement('div');
  el.id = 'cookies'; el.className = 'cookies'; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Cookies');
  el.innerHTML = `<p>Usamos cookies de análise para entender como o site é usado e melhorar a loja. Só ativamos se você aceitar.</p>
    <div><button type="button" data-ck="nao">Recusar</button><button type="button" data-ck="sim">Aceitar</button></div>`;
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-ck]'); if (!b) return;
    try { localStorage.setItem(CK, b.dataset.ck); } catch(err){}
    el.remove();
    if (b.dataset.ck === 'sim') ligarAnalytics();
  });
  document.body.appendChild(el);
}
document.addEventListener('click', e => { if (e.target.closest('[data-cookies]')) { e.preventDefault(); bannerCookies(); } });
const c = consentimento();
if (c === 'sim') ligarAnalytics(); else if (c !== 'nao') setTimeout(bannerCookies, 1200);

Sacola.sync(); Favs.sync();
addEventListener('favs:mudou', () => Favs.sync());
carregarCatalogo();
