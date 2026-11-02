/* Painel da loja. A tela só organiza: quem garante que apenas administradores alteram dados
   são as regras do Firestore/Storage (token com admin == true). */
import { auth, db, app } from './firebase.js';
import { onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut }
  from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy, limit, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js';

const $ = id => document.getElementById(id);
let produtos = [], aberto = null;

/* ---------- acesso ---------- */
$('formLogin').addEventListener('submit', async e => {
  e.preventDefault(); const f = e.target, err = f.querySelector('.f__err');
  try { await signInWithEmailAndPassword(auth, f.email.value.trim(), f.senha.value); }
  catch (x) { err.textContent = /too-many/.test(x.code) ? 'Muitas tentativas. Espere alguns minutos.' : 'E-mail ou senha incorretos.'; }
});
$('google').onclick = () => signInWithPopup(auth, new GoogleAuthProvider()).catch(() => {});
$('sair').onclick = () => signOut(auth);

onAuthStateChanged(auth, async user => {
  ['login', 'semAcesso', 'abaProdutos', 'abaPedidos'].forEach(id => $(id).hidden = true);
  $('admTabs').hidden = $('sair').hidden = !user;
  if (!user){ $('login').hidden = false; return; }
  const tok = await user.getIdTokenResult(true);
  if (tok.claims.admin !== true){ $('semAcesso').hidden = false; $('admTabs').hidden = true; return; }
  abrirAba('produtos');
  carregarProdutos();
});

/* ---------- abas ---------- */
function abrirAba(nome){
  document.querySelectorAll('#admTabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.aba === nome));
  $('abaProdutos').hidden = nome !== 'produtos'; $('abaPedidos').hidden = nome !== 'pedidos';
  if (nome === 'pedidos') carregarPedidos();
}
$('admTabs').addEventListener('click', e => { const b = e.target.closest('[data-aba]'); if (b) abrirAba(b.dataset.aba); });

/* ---------- produtos ---------- */
async function carregarProdutos(){
  const s = await getDocs(collection(db, 'produtos'));
  produtos = s.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  tabela();
}
function tabela(){
  const q = $('busca').value.trim().toLowerCase();
  const l = produtos.filter(p => !q || String(p.nome).toLowerCase().includes(q) || p.id.includes(q));
  $('tbProdutos').innerHTML = l.length ? l.map(p => `
    <tr class="${p.ativo === false ? 'off' : ''}">
      <td><div class="peca">${safeUrl(p.img) ? `<img src="${esc(safeUrl(p.img))}" alt="">` : '<span style="width:44px"></span>'}<span>${esc(p.nome)}<br><small style="color:var(--muted)">${esc(p.id)}</small></span></div></td>
      <td>${esc(catNome(p.cat) || p.cat)}</td>
      <td class="num">${brl(p.preco)}</td>
      <td>${esc(p.estoque)}</td>
      <td><label class="sw"><input type="checkbox" data-ativo="${esc(p.id)}" ${p.ativo === false ? '' : 'checked'} aria-label="Mostrar ${esc(p.nome)} no site"><i></i></label></td>
      <td><button class="edit" data-edit="${esc(p.id)}">Editar</button></td>
    </tr>`).join('') : '<tr><td colspan="6" class="vazio">Nenhum produto. Rode o script de carga (scripts/seed.mjs) ou cadastre o primeiro.</td></tr>';
}
$('busca').addEventListener('input', tabela);
$('tbProdutos').addEventListener('change', async e => {
  const c = e.target.closest('[data-ativo]'); if (!c) return;
  c.disabled = true;
  try { await updateDoc(doc(db, 'produtos', c.dataset.ativo), {ativo: c.checked, atualizadoEm: serverTimestamp()}); const p = produtos.find(x => x.id === c.dataset.ativo); if (p) p.ativo = c.checked; tabela(); }
  catch (x) { c.checked = !c.checked; alert('Não foi possível alterar. Verifique seu acesso.'); }
  c.disabled = false;
});
$('tbProdutos').addEventListener('click', e => { const b = e.target.closest('[data-edit]'); if (b) editar(produtos.find(p => p.id === b.dataset.edit)); });
$('novo').onclick = () => editar(null);

/* ---------- formulário ---------- */
const F = $('formProd');
$('selCat').innerHTML = CATEGORIAS.map(c => `<option value="${esc(c.slug)}">${esc(c.nome)}</option>`).join('');
const lista = v => [...new Set(String(v || '').split(/[,;\s]+/).map(n => parseInt(n, 10)).filter(n => n > 0 && n < 60))].slice(0, 20);
function editar(p){
  aberto = p;
  $('dlgTitulo').textContent = p ? 'Editar produto' : 'Novo produto';
  F.reset(); $('prodErr').textContent = '';
  F.id.readOnly = !!p; $('apagar').hidden = !p;
  if (p){
    F.id.value = p.id; F.nome.value = p.nome || ''; F.cat.value = p.cat || 'bolsas'; F.preco.value = p.preco || '';
    F.estoque.value = p.estoque || ''; F.ordem.value = p.ordem || 0; F.tam.value = (p.tam || []).join(', '); F.esgot.value = (p.esgot || []).join(', ');
    F.nota.value = p.nota || ''; F.aval.value = p.aval || ''; F.desc.value = p.desc || ''; F.detalhes.value = (p.detalhes || []).join('\n');
    F.img.value = p.img || ''; F.uso.value = p.uso || ''; F.novo.checked = !!p.novo; F.ativo.checked = p.ativo !== false;
  } else { F.ordem.value = produtos.length; F.tam.value = '34, 35, 36, 37, 38, 39'; F.ativo.checked = true; }
  $('dlg').showModal();
}
$('fechar').onclick = () => $('dlg').close();

// envio de foto para o Storage (só admin consegue gravar — storage.rules)
F.addEventListener('change', async e => {
  const inp = e.target.closest('[data-up]'); if (!inp || !inp.files[0]) return;
  const file = inp.files[0], err = $('prodErr');
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024){ err.textContent = 'Envie JPG, PNG ou WEBP de até 5 MB.'; inp.value = ''; return; }
  const id = F.id.value.trim();
  if (!/^[a-z0-9-]{3,80}$/.test(id)){ err.textContent = 'Preencha o código do produto antes de enviar a foto.'; inp.value = ''; return; }
  err.textContent = 'Enviando foto…';
  try {
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/12.12.0/firebase-storage.js');
    const ext = {'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp'}[file.type];
    const r = ref(getStorage(app), `produtos/${id}-${inp.dataset.up}-${Date.now()}.${ext}`);
    await uploadBytes(r, file, {contentType: file.type, cacheControl: 'public, max-age=31536000'});
    F[inp.dataset.up].value = await getDownloadURL(r);
    err.textContent = '';
  } catch (x) { err.textContent = 'Não foi possível enviar a foto. Confira se o Storage está ativo no Firebase.'; }
  inp.value = '';
});

F.addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('prodErr'), id = F.id.value.trim();
  const preco = Math.round(parseFloat(F.preco.value) * 100) / 100;
  const tam = lista(F.tam.value);
  const dados = {
    nome: F.nome.value.trim().slice(0, 120), cat: F.cat.value, preco,
    estoque: F.estoque.value.trim().slice(0, 60), ordem: Math.max(0, parseInt(F.ordem.value, 10) || 0),
    tam, esgot: lista(F.esgot.value).filter(n => tam.includes(n)),
    nota: Math.min(5, Math.max(0, parseFloat(F.nota.value) || 0)), aval: Math.max(0, parseInt(F.aval.value, 10) || 0),
    desc: F.desc.value.trim().slice(0, 1200),
    detalhes: F.detalhes.value.split('\n').map(x => x.trim().slice(0, 200)).filter(Boolean).slice(0, 12),
    img: F.img.value.trim(), uso: F.uso.value.trim(),
    novo: F.novo.checked, ativo: F.ativo.checked, atualizadoEm: serverTimestamp(),
  };
  if (!/^[a-z0-9-]{3,80}$/.test(id)) return err.textContent = 'Código inválido: use letras minúsculas, números e hífen.';
  if (!aberto && produtos.some(p => p.id === id)) return err.textContent = 'Já existe um produto com esse código.';
  if (!dados.nome) return err.textContent = 'Preencha o nome.';
  if (!(preco > 0 && preco < 100000)) return err.textContent = 'Preço inválido.';
  if (!safeUrl(dados.img)) return err.textContent = 'Foto principal inválida: use um caminho img/... ou envie um arquivo.';
  if (dados.uso && !safeUrl(dados.uso)) return err.textContent = 'Foto em uso inválida.';
  $('salvar').disabled = true; err.textContent = '';
  try {
    await setDoc(doc(db, 'produtos', id), dados);
    $('dlg').close(); await carregarProdutos();
  } catch (x) { err.textContent = x.code === 'permission-denied' ? 'Sem permissão ou dados fora do formato aceito.' : 'Não foi possível salvar. Tente de novo.'; }
  $('salvar').disabled = false;
});
$('apagar').onclick = async () => {
  if (!aberto || !confirm(`Excluir "${aberto.nome}"? Para só esconder do site, desligue "Mostrar no site".`)) return;
  try { await deleteDoc(doc(db, 'produtos', aberto.id)); $('dlg').close(); await carregarProdutos(); }
  catch (x) { $('prodErr').textContent = 'Não foi possível excluir.'; }
};

/* ---------- pedidos: o total é sempre recalculado pelos preços do catálogo ---------- */
const STATUS = {novo:'Recebido', confirmado:'Confirmado', enviado:'Enviado', entregue:'Entregue', cancelado:'Cancelado'};
let pedidos = [];
async function carregarPedidos(){
  const box = $('listaPedidos');
  try {
    const s = await getDocs(query(collection(db, 'pedidos'), orderBy('criadoEm', 'desc'), limit(200)));
    pedidos = s.docs.map(d => ({id: d.id, ...d.data()}));
    listarPedidos();
  } catch (x) { box.innerHTML = '<p class="vazio">Não foi possível carregar os pedidos.</p>'; }
}
function listarPedidos(){
  const f = $('filtroStatus').value, box = $('listaPedidos');
  const l = pedidos.filter(p => !f || p.status === f);
  if (!l.length){ box.innerHTML = '<p class="vazio">Nenhum pedido aqui ainda.</p>'; return; }
  box.innerHTML = l.map(p => {
    const itens = Array.isArray(p.itens) ? p.itens.slice(0, 20) : [];
    const linhas = itens.map(i => { const x = produtos.find(y => y.id === i.id); return {x, q: Math.max(0, i.q | 0), t: i.t | 0}; });
    const total = linhas.reduce((n, i) => n + (i.x ? i.x.preco * i.q : 0), 0);
    const data = p.criadoEm && p.criadoEm.toDate ? p.criadoEm.toDate().toLocaleString('pt-BR', {dateStyle:'short', timeStyle:'short'}) : '';
    const st = STATUS[p.status] ? p.status : 'novo';
    return `<article class="pedido">
      <div class="pedido__top"><span>#${esc(p.id.slice(0, 6).toUpperCase())} · ${esc(data)}</span><span class="tag tag--${st}">${STATUS[st]}</span></div>
      <ul>${linhas.map(i => `<li>${i.q}× ${esc(i.x ? i.x.nome : 'Produto removido')}${i.t ? ' · tam. ' + i.t : ''} — ${i.x ? brl(i.x.preco * i.q) : '—'}</li>`).join('')}</ul>
      <p class="pedido__tot">${brl(total)} em produtos</p>
      <div class="pedido__acts"><span class="pedido__cli">${esc(p.nome || 'Cliente')} · ${esc(p.email || '')}</span>
        <label><span class="sr">Situação do pedido</span><select data-st="${esc(p.id)}">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === st ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div>
      ${p.obs ? `<p class="pedido__cli" style="margin-top:8px">Obs.: ${esc(p.obs)}</p>` : ''}
    </article>`;
  }).join('');
}
$('filtroStatus').addEventListener('change', listarPedidos);
$('listaPedidos').addEventListener('change', async e => {
  const s = e.target.closest('[data-st]'); if (!s) return;
  s.disabled = true;
  try { await updateDoc(doc(db, 'pedidos', s.dataset.st), {status: s.value, atualizadoEm: serverTimestamp()}); const p = pedidos.find(x => x.id === s.dataset.st); if (p) p.status = s.value; listarPedidos(); }
  catch (x) { alert('Não foi possível alterar a situação.'); s.disabled = false; }
});
