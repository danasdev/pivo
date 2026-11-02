moldura('produto');
quandoPronto(() => {
const p = produto(new URLSearchParams(location.search).get('id'));
if (!p){
  document.title = 'Peça não encontrada — PIVÔ';
  document.getElementById('main').innerHTML = `<div style="text-align:center;padding:10vh 0">
    <h1 class="duo"><span class="l1">Essa peça não está aqui.</span><span class="l2">Talvez já tenha saído de coleção.</span></h1>
    <p style="margin:22px 0 30px;color:var(--muted)">Veja as outras peças do catálogo.</p><a class="btn" href="catalogo.html">Ver o catálogo ${ICON.arrow}</a></div>`;
  return;
}
document.title = `${p.nome} — PIVÔ`;
const fotos = [p.img, p.uso].filter(Boolean);
const rel = PRODUTOS.filter(x => x.id !== p.id).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 4);

document.getElementById('main').innerHTML = `
  <nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a><span aria-hidden="true">/</span>
    <a href="${linkCat(p.cat)}">${esc(catNome(p.cat))}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.nome)}</span></nav>
  <div class="pdp">
    <div>
      <div class="gal" id="gal">${fotos.map((f, i) => `<figure data-in style="--rd:${i * .08}s"><img src="${esc(f)}" alt="${esc(i ? p.nome + ' em uso' : p.nome)}" ${i ? 'loading="lazy"' : ''}>${!i && p.novo ? '<span class="badge">Novo</span>' : ''}</figure>`).join('')}</div>
      <div class="dots" id="dots" aria-hidden="true">${fotos.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
    </div>
    <div class="info" data-in style="--rd:.1s">
      <p class="cat"><a href="${linkCat(p.cat)}">${esc(catNome(p.cat))}</a></p>
      <h1>${esc(p.nome)}</h1>
      <p class="price">${brl(p.preco)}</p>
      <div class="meta">${stars(p)}<span class="stock"><i></i>${esc(p.estoque)}</span></div>
      <p class="desc">${esc(p.desc)}</p>
      <div class="pick" id="pick">
        ${p.tam ? `<div class="pick__top"><b id="tamLbl">Tamanho</b><a href="#">Guia de tamanhos</a></div>
          <div class="sizes" role="group" aria-label="Escolha o tamanho">${p.tam.map(t => `<button class="size" data-t="${t | 0}" aria-pressed="false" ${p.esgot.includes(t) ? `disabled aria-label="${t | 0}, esgotado"` : ''}>${t | 0}</button>`).join('')}</div>
          <p class="err" id="err" role="alert"></p>` : ''}
        <div class="buy">
          <button class="btn" id="add">Adicionar à sacola ${ICON.arrow}</button>
          <button class="fav" data-fav="${esc(p.id)}" aria-pressed="${Favs.tem(p.id)}" aria-label="Favoritar ${esc(p.nome)}">${ICON.heart}</button>
        </div>
        <a class="wa" id="waDuvida" href="#" rel="noopener">${ICON.wa}Dúvida no tamanho? Fale com a gente no WhatsApp</a>
      </div>
      <div class="acc">
        <details open><summary>Detalhes <i aria-hidden="true"></i></summary><div class="body"><ul>${p.detalhes.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div></details>
        <details><summary>Cuidados <i aria-hidden="true"></i></summary><div class="body">Guarde em local arejado, longe do sol direto. Limpe com pano macio e seco.</div></details>
        <details><summary>Entrega e trocas <i aria-hidden="true"></i></summary><div class="body">Prazo e frete calculados na finalização da compra. Consulte a política de trocas e devoluções.</div></details>
      </div>
    </div>
  </div>
  <section class="rel" aria-labelledby="rel-t">
    <div class="rel__head"><h2 class="duo" id="rel-t"><span class="l1">Combina com</span><span class="l2">o seu passo.</span></h2>
      <a class="btn btn--ghost" href="catalogo.html">Ver todas as peças ${ICON.arrow}</a></div>
    <div class="grid">${rel.map(card).join('')}</div>
  </section>`;
revelar();

// tamanho: obrigatório para calçado
let tam = null;
const err = document.getElementById('err');
document.querySelectorAll('#pick .size').forEach(b => b.addEventListener('click', () => {
  tam = +b.dataset.t;
  document.querySelectorAll('#pick .size').forEach(x => x.setAttribute('aria-pressed', x === b));
  document.getElementById('tamLbl').textContent = `Tamanho ${tam}`;
  if (err) err.textContent = '';
  document.getElementById('sbGo').textContent = 'Adicionar';
}));
function adicionar(){
  if (p.tam && !tam){
    err.textContent = 'Escolha um tamanho para adicionar à sacola.';
    document.querySelector('#pick .sizes').animate([{translate:'-6px 0'},{translate:'6px 0'},{translate:'0 0'}], {duration:300});
    document.getElementById('pick').scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'center'});
    return;
  }
  comprar(p.id, tam);
}
document.getElementById('add').addEventListener('click', adicionar);
document.querySelector('.buy .fav').addEventListener('click', () => Favs.alternar(p.id));
if (/^\d{10,15}$/.test(CONFIG.whatsapp)) document.getElementById('waDuvida').href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, PIVÔ! Tenho uma dúvida sobre ' + p.nome)}`;

// celular: pontinhos da galeria e barra de compra quando o botão sai da tela
const gal = document.getElementById('gal'), dots = [...document.querySelectorAll('#dots i')];
gal.addEventListener('scroll', () => { const i = Math.round(gal.scrollLeft / gal.firstElementChild.offsetWidth); dots.forEach((d, k) => d.classList.toggle('on', k === i)); }, {passive:true});
document.getElementById('sbPrice').textContent = brl(p.preco);
if (!p.tam) document.getElementById('sbGo').textContent = 'Adicionar';
document.getElementById('sbGo').addEventListener('click', adicionar);
const sb = document.getElementById('stickyBuy');
new IntersectionObserver(([e]) => {
  const show = !e.isIntersecting && e.boundingClientRect.top < 0;
  sb.classList.toggle('show', show); sb.setAttribute('aria-hidden', !show);
  document.getElementById('sbGo').tabIndex = show ? 0 : -1;
}).observe(document.getElementById('add'));
});
