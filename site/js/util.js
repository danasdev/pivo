/* Utilitários de todas as páginas (script clássico, carregado antes dos outros). */

/* Configuração pública da loja. Nada aqui é segredo: tudo vai para o navegador de qualquer forma. */
var CONFIG = {
  // WhatsApp da loja: só dígitos, com DDI e DDD. Ex.: '5511999999999'
  whatsapp: '',
  // Chave de site do reCAPTCHA v3 para o App Check (Firebase > App Check). Vazio = App Check desligado.
  appCheckKey: '',
};

/* Categorias fixas da navegação (o banco pode substituir textos, os slugs são estes). */
var CATEGORIAS_BASE = [
  {slug:'bolsas',     nome:'Bolsas',     desc:'Estruturadas, de ombro e de mão.'},
  {slug:'salto-fino', nome:'Salto fino', desc:'Para quando o passo é o recado.'},
  {slug:'plataforma', nome:'Plataforma', desc:'Altura com conforto o dia todo.'},
  {slug:'anabela',    nome:'Anabela',    desc:'Juta, couro e verão.'},
  {slug:'papete',     nome:'Papete',     desc:'Firme no pé, leve no estilo.'},
  {slug:'rasteira',   nome:'Rasteira',   desc:'O mínimo que faz diferença.'},
];
var CATEGORIAS = CATEGORIAS_BASE.slice();
var PRODUTOS = [];          // preenchido por js/loja.js (Firestore, ou data/catalogo.json como reserva)
var TAM = [34, 35, 36, 37, 38, 39];

/* Todo dado que vai para innerHTML passa por aqui. */
function esc(v){
  return String(v == null ? '' : v).replace(/[&<>"'`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c]));
}
/* Só aceita imagem local (img/...) ou do Firebase Storage. Qualquer outra coisa vira vazio. */
function safeUrl(u){
  u = String(u || '');
  return /^(img\/[\w\-./]+|https:\/\/firebasestorage\.googleapis\.com\/[\w\-./%?=&]+)$/.test(u) && !u.includes('..') ? u : '';
}
const brl = v => (Number(v) || 0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
const catNome = slug => (CATEGORIAS.find(c => c.slug === slug) || {}).nome || '';
const produto = id => PRODUTOS.find(p => p.id === id);
const nota = n => (Number(n) || 0).toFixed(1).replace('.', ',');

/* Roda fn quando o catálogo estiver carregado. */
function quandoPronto(fn){
  if (window.__lojaPronta) fn();
  else addEventListener('loja:pronta', () => fn(), {once:true});
}

/* Sacola guardada no navegador; js/loja.js espelha na conta quando a pessoa está logada. */
const Sacola = {
  KEY:'pivo-sacola',
  itens(){
    try {
      const l = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(l) ? l.filter(i => i && typeof i.id === 'string' && Number.isInteger(i.q) && i.q > 0).slice(0, 30) : [];
    } catch(e){ return []; }
  },
  salvar(l, silencioso){
    try { localStorage.setItem(this.KEY, JSON.stringify(l.slice(0, 30))); } catch(e){}
    this.sync();
    if (!silencioso) dispatchEvent(new CustomEvent('sacola:mudou'));
  },
  qtd(){ return this.itens().reduce((n, i) => n + i.q, 0); },
  add(id, tam){
    const t = tam ? +tam : null, l = this.itens(), it = l.find(i => i.id === id && i.t === t);
    if (it) it.q = Math.min(it.q + 1, 20); else l.push({id, t, q:1});
    this.salvar(l);
  },
  mudar(idx, d){ const l = this.itens(); if (!l[idx]) return; l[idx].q = Math.min(20, Math.max(1, l[idx].q + d)); this.salvar(l); },
  tirar(idx){ const l = this.itens(); l.splice(idx, 1); this.salvar(l); },
  limpar(){ this.salvar([]); },
  sync(){
    const n = this.qtd(), lbl = `Sacola, ${n} ${n === 1 ? 'item' : 'itens'}`;
    document.querySelectorAll('[data-bag-count]').forEach(b => { b.hidden = !n; b.textContent = n; });
    document.querySelectorAll('[data-bag]').forEach(a => a.setAttribute('aria-label', lbl));
  },
};
addEventListener('storage', e => { if (e.key === Sacola.KEY) Sacola.sync(); });

/* Favoritos: no navegador; js/loja.js espelha na conta. Botões com data-fav="id" refletem o estado. */
const Favs = {
  KEY:'pivo-favs',
  lista(){ try { const l = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(l) ? l.filter(x => typeof x === 'string').slice(0, 200) : []; } catch(e){ return []; } },
  salvar(l, silencioso){ try { localStorage.setItem(this.KEY, JSON.stringify(l.slice(0, 200))); } catch(e){} this.sync(); if (!silencioso) dispatchEvent(new CustomEvent('favs:mudou')); },
  tem(id){ return this.lista().includes(id); },
  alternar(id){ const l = this.lista(), i = l.indexOf(id); if (i > -1) l.splice(i, 1); else l.push(id); this.salvar(l); return i < 0; },
  sync(){ const l = this.lista(); document.querySelectorAll('[data-fav]').forEach(b => b.setAttribute('aria-pressed', l.includes(b.dataset.fav))); },
};

/* Mensagem de pedido para o WhatsApp (o preço aqui é só informativo; a loja confere no painel). */
function linkWhatsApp(itens, codigo){
  if (!/^\d{10,15}$/.test(CONFIG.whatsapp)) return '';
  const linhas = itens.map(i => { const p = produto(i.id); return p ? `• ${i.q}x ${p.nome}${i.t ? ' (tam. ' + i.t + ')' : ''} — ${brl(p.preco * i.q)}` : ''; }).filter(Boolean);
  const total = itens.reduce((n, i) => { const p = produto(i.id); return n + (p ? p.preco * i.q : 0); }, 0);
  const msg = `Olá, PIVÔ! Quero finalizar meu pedido${codigo ? ' #' + codigo : ''}:\n\n${linhas.join('\n')}\n\nTotal dos produtos: ${brl(total)}`;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

/* ---------- login obrigatório para a sacola ---------- */
// destino de volta depois de entrar: só páginas da loja (sem redirecionamento para fora)
function voltaSegura(v){ return /^(index|catalogo|produto|sacola)(\.html)?(\?[\w=&%.-]{0,200})?$/.test(v || '') ? v : null; }
function paginaAtual(){ return (location.pathname.split('/').pop() || 'index.html') + location.search; }
/* Resolve true se a pessoa está logada. Se não, guarda a peça escolhida e leva para "Entrar". */
async function exigirLogin(item){
  if (window.Loja && Loja.authPronto) await Promise.race([Loja.authPronto, new Promise(r => setTimeout(r, 3000))]);
  if (window.Loja && Loja.user) return true;
  try { if (item) sessionStorage.setItem('pivo-pendente', JSON.stringify({id: String(item.id).slice(0, 80), t: item.t ? +item.t : null})); } catch(e){}
  const destino = 'conta.html?volta=' + encodeURIComponent(voltaSegura(paginaAtual()) || 'index.html');
  if (window.irPara) irPara(destino); else location.href = destino;
  return false;
}
