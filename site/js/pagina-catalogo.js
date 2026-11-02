moldura('catalogo');
quandoPronto(() => {
const q = new URLSearchParams(location.search);
const estado = {cat: CATEGORIAS.some(c => c.slug === q.get('cat')) ? q.get('cat') : 'todos', tam: null, ordem: 'novos'};

const chips = document.getElementById('chips');
chips.innerHTML = [{slug:'todos', nome:'Todos'}, ...CATEGORIAS].map(c => {
  const n = c.slug === 'todos' ? PRODUTOS.length : PRODUTOS.filter(p => p.cat === c.slug).length;
  return `<button class="chip" data-cat="${esc(c.slug)}">${esc(c.nome)} <span>${n}</span></button>`;
}).join('');
document.getElementById('sizesF').insertAdjacentHTML('beforeend', TAM.map(t => `<button class="size" data-tam="${t}" aria-pressed="false" aria-label="Tamanho ${t}">${t}</button>`).join(''));

function desenhar(){
  const c = CATEGORIAS.find(c => c.slug === estado.cat);
  document.title = `${c ? c.nome : 'Catálogo'} — PIVÔ`;
  document.getElementById('crumb').textContent = c ? c.nome : 'Catálogo';
  document.getElementById('titulo').innerHTML = c
    ? `<span class="l1">${esc(c.nome)}.</span><span class="l2">${esc(c.desc)}</span>`
    : `<span class="l1">Todas as peças.</span><span class="l2">Encontre o seu passo.</span>`;
  chips.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.cat === estado.cat));
  document.querySelectorAll('#sizesF .size').forEach(b => b.setAttribute('aria-pressed', +b.dataset.tam === estado.tam));
  // bolsas não têm tamanho: o filtro some
  document.getElementById('sizesF').hidden = estado.cat === 'bolsas';

  let l = PRODUTOS.filter(p => estado.cat === 'todos' || p.cat === estado.cat);
  if (estado.tam) l = l.filter(p => p.tam && p.tam.includes(estado.tam) && !p.esgot.includes(estado.tam));
  const o = {
    novos: (a, b) => (b.novo ? 1 : 0) - (a.novo ? 1 : 0),
    menor: (a, b) => a.preco - b.preco,
    maior: (a, b) => b.preco - a.preco,
    aval:  (a, b) => b.aval - a.aval,
  }[estado.ordem];
  l = l.slice().sort(o);

  document.getElementById('count').textContent = `${l.length} ${l.length === 1 ? 'peça' : 'peças'}`;
  const grid = document.getElementById('grid');
  grid.innerHTML = l.length ? l.map(card).join('') : `<div class="empty"><p>Nenhuma peça ${estado.tam ? 'no tamanho ' + (estado.tam | 0) + ' ' : ''}aqui.</p>
    <span>Tente outro tamanho ou veja todas as categorias.</span><button class="btn btn--ghost" id="limpar">Limpar filtros</button></div>`;
  revelar(grid);
  const lim = document.getElementById('limpar');
  if (lim) lim.onclick = () => { estado.tam = null; estado.cat = 'todos'; atualizar(); };
}
function atualizar(){
  const u = new URL(location);
  if (estado.cat === 'todos') u.searchParams.delete('cat'); else u.searchParams.set('cat', estado.cat);
  history.replaceState(null, '', u);
  desenhar();
}
chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; estado.cat = b.dataset.cat; if (estado.cat === 'bolsas') estado.tam = null; atualizar(); });
document.getElementById('sizesF').addEventListener('click', e => { const b = e.target.closest('.size'); if (!b) return; const t = +b.dataset.tam; estado.tam = estado.tam === t ? null : t; desenhar(); });
document.getElementById('ordem').addEventListener('change', e => { estado.ordem = e.target.value; desenhar(); });
desenhar();
});
