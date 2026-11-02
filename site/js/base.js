/* Base das páginas internas: monta menu, barra de baixo, rodapé e aviso; guarda a sacola; desenha os cards de produto. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const OUT = 'cubic-bezier(.16,1,.3,1)';

const ICON = {
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16"/><path d="m14 6 6 6-6 6"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10Z"/></svg>',
  star:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8Z"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1Z"/><path d="M9 9.5c.5 2.5 2.5 4.5 5 5l1.2-1.2 2 1-.6 1.6c-3.8 0-8.5-4.7-8.5-8.5l1.6-.6 1 2L9 9.5Z"/></svg>',
};
const T = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const LOGO = '<svg viewBox="0 0 795 486" fill="currentColor" aria-hidden="true"><use href="#pivo-full"/></svg>';
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><g id="pivo-full">
  <path fill-rule="evenodd" d="M0 61h72a45 45 0 0 1 45 45v182a45 45 0 0 1-45 45H31v153H0Zm31 31v210h37a18 18 0 0 0 18-18V110a18 18 0 0 0-18-18Z"/>
  <rect x="251" y="61" width="30" height="425"/><path d="M410 61h31l40 362 45-362h30l-56 425h-39Z"/>
  <path fill-rule="evenodd" d="M677 121.5a58.5 58.5 0 0 1 117 0v306a58.5 58.5 0 0 1-117 0Zm31 1a27.5 27.5 0 0 1 55 0v304a27.5 27.5 0 0 1-55 0Z"/>
  <path d="M690 37 722 3h28l32 34v6h-21l-25-26-25 26h-21Z"/></g></defs></svg>`;
const linkCat = slug => `catalogo.html?cat=${encodeURIComponent(slug)}`;
const linkProd = id => `produto.html?id=${encodeURIComponent(id)}`;

let toastT;
function avisar(p, tam){
  const t = document.getElementById('toast');
  let im = t.querySelector('img');
  if (!im){ im = new Image(40, 40); im.alt = ''; t.prepend(im); }
  im.src = p.img;
  t.querySelector('span').textContent = `${p.nome}${tam ? ' · ' + tam : ''} adicionado`;
  t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
  document.querySelectorAll('[data-bag-count]').forEach(b => b.animate([{transform:'scale(1.6)'},{transform:'scale(1)'}], {duration:500, easing:OUT}));
}
function comprar(id, tam){ const p = produto(id); if (!p) return; Sacola.add(id, tam); avisar(p, tam); }

/* ---------- card de produto ---------- */
function stars(p){ return `<span class="stars" aria-label="Nota ${nota(p.nota)} de 5">${ICON.star.repeat(5)}<span>${nota(p.nota)} (${p.aval | 0})</span></span>`; }
function card(p, i = 0){
  const nome = esc(p.nome), id = esc(p.id);
  const quick = p.tam
    ? `<div class="quick__lbl">Escolha o tamanho</div><div class="sizes">${p.tam.map(z => `<button class="size" data-size="${z | 0}" ${p.esgot.includes(z) ? `disabled aria-label="${z | 0} esgotado"` : `aria-label="Adicionar tamanho ${z | 0}"`}>${z | 0}</button>`).join('')}</div>`
    : `<button class="add">Adicionar à sacola</button>`;
  return `<article class="prod" data-id="${id}" data-in style="--rd:${(i % 4) * .07}s">
    <div class="prod__media">
      <a href="${linkProd(p.id)}" tabindex="-1" aria-hidden="true"></a>
      ${p.img ? `<img class="prod__front" src="${esc(p.img)}" alt="${nome}" loading="lazy">` : ''}
      ${p.uso ? `<img class="prod__back" src="${esc(p.uso)}" alt="" aria-hidden="true" loading="lazy">` : ''}
      ${p.novo ? '<span class="badge">Novo</span>' : ''}
      <button class="fav" data-fav="${id}" aria-pressed="${Favs.tem(p.id)}" aria-label="Favoritar ${nome}">${ICON.heart}</button>
      <div class="quick">${quick}</div>
      <button class="quick-open" aria-label="Comprar ${nome}" aria-expanded="false">${ICON.plus}</button>
    </div>
    <div class="prod__row"><a href="${linkProd(p.id)}" class="prod__name">${nome}</a><span class="prod__price">${brl(p.preco)}</span></div>
    <div class="prod__meta">${stars(p)}<span class="stock"><i></i>${esc(p.estoque)}</span></div>
  </article>`;
}
// cliques dentro dos cards (compra rápida, favorito, abrir no toque)
document.addEventListener('click', e => {
  const c = e.target.closest('.prod'); if (!c || !c.dataset.id) return;
  const op = e.target.closest('.quick-open'), sz = e.target.closest('.size'), add = e.target.closest('.add'), fav = e.target.closest('.fav');
  if (op){ const o = c.classList.toggle('open'); op.setAttribute('aria-expanded', o); }
  else if (sz && !sz.disabled){ comprar(c.dataset.id, +sz.dataset.size); c.classList.remove('open'); }
  else if (add){ comprar(c.dataset.id); c.classList.remove('open'); }
  else if (fav){ Favs.alternar(c.dataset.id); fav.animate([{transform:'scale(1.25)'},{transform:'scale(1)'}], {duration:400, easing:OUT}); }
  else return;
  e.preventDefault();
});

/* ---------- moldura comum ---------- */
function moldura(pagina){
  const cats = CATEGORIAS.map(c => `<a href="${linkCat(c.slug)}">${esc(c.nome)}</a>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `${SPRITE}
  <header class="nav" id="nav">
    <a href="index.html" class="nav__logo" aria-label="PIVÔ, início">${LOGO}</a>
    <nav class="nav__links" aria-label="Categorias">${cats}</nav>
    <div class="nav__end">
      <a href="catalogo.html" class="pill">Comprar agora</a>
      <a href="conta.html" class="icon-btn" data-conta aria-label="Entrar">${T}<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></a>
      <a href="sacola.html" class="icon-btn" id="bag" data-bag aria-label="Sacola">${ICON.bag}<b data-bag-count hidden>0</b></a>
      <button class="icon-btn burger" id="burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu">${T}<path d="M4 8h16"/><path d="M4 16h16"/></svg></button>
    </div>
  </header>
  <div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
    <ul class="menu__cats">${CATEGORIAS.map(c => `<li><a href="${linkCat(c.slug)}">${esc(c.nome)} <span>Ver</span></a></li>`).join('')}</ul>
    <div class="menu__more"><a href="catalogo.html">Todas as peças</a><a href="#">Guia de tamanhos</a><a href="#">Trocas e devoluções</a><a href="#">Fale conosco</a></div>
    <a href="catalogo.html" class="menu__cta">Comprar agora</a>
  </div>
  <nav class="tabbar" aria-label="Atalhos">
    <a href="index.html" class="tab">${T}<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z"/></svg>Início</a>
    <a href="catalogo.html" class="tab" ${pagina === 'catalogo' ? 'aria-current="page"' : ''}>${T}<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>Catálogo</a>
    <a href="conta.html#favoritos" class="tab">${T}<path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10Z"/></svg>Favoritos</a>
    <a href="sacola.html" class="tab" data-bag ${pagina === 'sacola' ? 'aria-current="page"' : ''}>${T}<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>Sacola<b data-bag-count hidden>0</b></a>
  </nav>`);
  document.body.insertAdjacentHTML('beforeend', `
  <footer class="rodape">
    <div class="rodape__top">
      <div class="rodape__brand"><p class="rodape__slogan">Seu estilo te move.</p></div>
      <nav aria-label="Loja"><h3>Loja</h3><ul>${CATEGORIAS.map(c => `<li><a href="${linkCat(c.slug)}">${esc(c.nome)}</a></li>`).join('')}</ul></nav>
      <nav aria-label="Ajuda"><h3>Ajuda</h3><ul><li><a href="#">Trocas e devoluções</a></li><li><a href="#">Entregas</a></li><li><a href="#">Guia de tamanhos</a></li><li><a href="#">Fale conosco</a></li><li><a href="conta.html">Minha conta</a></li><li><a href="#" data-cookies>Preferências de cookies</a></li></ul></nav>
      <nav aria-label="Redes"><h3>Siga</h3><ul><li><a href="#">Instagram</a></li><li><a href="#">WhatsApp</a></li></ul></nav>
    </div>
    <div class="rodape__word" id="rodapeWord" aria-hidden="true">
      <span class="mask"><svg viewBox="0 0 117 486" fill="currentColor"><use href="#pivo-full"/></svg></span>
      <span class="mask"><svg viewBox="251 0 30 486" fill="currentColor"><use href="#pivo-full"/></svg></span>
      <span class="mask"><svg viewBox="410 0 146 486" fill="currentColor"><use href="#pivo-full"/></svg></span>
      <span class="mask"><svg viewBox="677 0 117 486" fill="currentColor"><use href="#pivo-full"/></svg></span>
    </div>
    <div class="rodape__bottom"><span>© 2026 PIVÔ. Todos os direitos reservados.</span><span>Bolsas e calçados</span></div>
  </footer>
  <div class="toast" id="toast" role="status" aria-live="polite"><span></span><a href="sacola.html">Ver sacola</a></div>`);

  // menu do celular
  const m = document.getElementById('menu'), nav = document.getElementById('nav'), b = document.getElementById('burger');
  let last = null;
  function set(open){
    if (open){ last = document.activeElement; m.hidden = false; requestAnimationFrame(() => m.classList.add('open')); }
    else { m.classList.remove('open'); setTimeout(() => { if (!m.classList.contains('open')) m.hidden = true; }, 700); }
    nav.classList.toggle('menu-on', open); document.body.classList.toggle('menu-open', open);
    b.setAttribute('aria-expanded', open); b.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (open) setTimeout(() => m.querySelector('a').focus(), 350); else if (last) last.focus();
  }
  b.addEventListener('click', () => set(!m.classList.contains('open')));
  addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) set(false); });

  // rodapé: letras sobem
  new IntersectionObserver(([e]) => document.getElementById('rodapeWord').classList.toggle('up', e.isIntersecting), {threshold:.25})
    .observe(document.getElementById('rodapeWord'));
  Sacola.sync(); Favs.sync();
}

/* entrada dos elementos marcados com data-in (chama de novo após desenhar conteúdo) */
const inIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('is-in'); inIO.unobserve(e.target); } }), {threshold:.08});
function revelar(root = document){ root.querySelectorAll('[data-in]:not(.is-in)').forEach(el => reduce ? el.classList.add('is-in') : inIO.observe(el)); }
