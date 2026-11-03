const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const OUT = 'cubic-bezier(.16,1,.3,1)', INOUT = 'cubic-bezier(.76,0,.24,1)', IN = 'cubic-bezier(.7,0,.84,0)';
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const rnd = (a, b) => a + Math.random() * (b - a);


/* menu claro quando a dobra terracota sai de baixo dele */
new IntersectionObserver(([e]) => document.getElementById('nav').classList.toggle('on-light', !e.isIntersecting),
  {rootMargin:'-80px 0px -100% 0px'}).observe(document.getElementById('hero'));

/* coleções: cards com a foto do produto e, no hover, a peça em uso */
const CATS = [
  {n:'Bolsas',     s:'bolsas',     f:'bolsas',     d:'Estruturadas, de ombro e de mão.'},
  {n:'Salto fino', s:'salto-fino', f:'salto',      d:'Para quando o passo é o recado.'},
  {n:'Plataforma', s:'plataforma', f:'plataforma', d:'Altura com conforto o dia todo.'},
  {n:'Anabela', s:'anabela', f:'anabela',    d:'Juta, couro e verão.'},
  {n:'Papete', s:'papete', f:'papete',     d:'Firme no pé, leve no estilo.'},
  {n:'Rasteira', s:'rasteira', f:'rasteira',   d:'O mínimo que faz diferença.'},
];
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16"/><path d="m14 6 6 6-6 6"/></svg>';
document.getElementById('cats').innerHTML = CATS.map((c, i) => `
  <a class="cat" href="catalogo.html?cat=${c.s}" data-reveal style="--rd:${(i % 3) * .1}s">
    <div class="cat__media">
      <img src="img/colecoes/${c.f}.jpg" alt="${c.n}" loading="lazy">
      <img class="cat__back" src="img/colecoes/${c.f}-uso.jpg" alt="" aria-hidden="true" loading="lazy">
    </div>
    <div class="cat__row"><span class="cat__name">${c.n}</span><span class="cat__more">Ver coleção ${ARROW}</span></div>
    <p class="cat__desc">${c.d}</p>
  </a>`).join('');


/* essência: a foto desliza dentro da moldura e as palavras da citação acendem com a rolagem */
(function essencia(){
  const sec = document.getElementById('essencia'), pic = document.getElementById('essPic');
  const q = document.getElementById('ess-title');
  q.querySelectorAll('.q1, .q2').forEach(l => { l.innerHTML = l.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' '); });
  const words = [...q.querySelectorAll('.w')];
  if (reduce){ words.forEach(w => w.classList.add('on')); return; }
  function update(){
    const r = sec.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
    pic.style.transform = `translateY(${((p - .5) * 16).toFixed(2)}%)`;
    const qr = q.getBoundingClientRect();
    const k = Math.min(Math.max((vh * .85 - qr.top) / (vh * .45), 0), 1);
    const n = Math.round(k * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  }
  addEventListener('scroll', update, {passive:true}); addEventListener('resize', update); update();
})();


/* novas chegadas: as 6 primeiras do catálogo, novidades na frente */
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8Z"/></svg>';
const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10Z"/></svg>';
const linkP = p => 'produto.html?id=' + encodeURIComponent(p.id);
const track = document.getElementById('track');
let PRODS = [];
function initChegadas(){
  PRODS = PRODUTOS.slice().sort((a, b) => (b.novo - a.novo) || (a.ordem - b.ordem)).slice(0, 6);
  track.innerHTML = PRODS.map((p, i) => `
  <article class="prod" data-i="${i}" data-reveal style="--rd:${(i % 4) * .08}s">
    <div class="prod__media">
      <a href="${linkP(p)}" aria-label="${esc(p.nome)}">${p.img ? `<img src="${esc(p.img)}" alt="${esc(p.nome)}" loading="lazy" draggable="false">` : ''}
      ${p.uso ? `<img class="prod__back" src="${esc(p.uso)}" alt="" aria-hidden="true" loading="lazy" draggable="false">` : ''}</a>
      ${p.novo ? '<span class="badge">Novo</span>' : ''}
      <button class="fav" data-fav="${esc(p.id)}" aria-pressed="${Favs.tem(p.id)}" aria-label="Favoritar ${esc(p.nome)}">${HEART}</button>
      <div class="quick">${p.tam
        ? `<div class="quick__lbl">Escolha o tamanho</div><div class="sizes">${p.tam.map(z => `<button class="size" data-size="${z | 0}" ${p.esgot.includes(z) ? 'disabled aria-label="' + (z | 0) + ' esgotado"' : ''}>${z | 0}</button>`).join('')}</div>`
        : `<button class="add">Adicionar à sacola</button>`}</div>
      <button class="quick-open" aria-label="Comprar ${esc(p.nome)}" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
    </div>
    <div class="prod__row"><a href="${linkP(p)}" class="prod__name">${esc(p.nome)}</a><span class="prod__price">${brl(p.preco)}</span></div>
    <div class="prod__meta"><span class="stars" aria-label="Nota ${nota(p.nota)} de 5">${STAR.repeat(5)}<span>${nota(p.nota)} (${p.aval | 0})</span></span><span class="stock"><i></i>${esc(p.estoque)}</span></div>
  </article>`).join('');
  measureTrack();
  dispatchEvent(new CustomEvent('reveal:novos'));
}

// sacola: adiciona sem recarregar e avisa
let toastT;
async function addToBag(p, size){
  if (!(await exigirLogin({id: p.id, t: size}))) return;
  Sacola.add(p.id, size);
  document.querySelectorAll('[data-bag-count]').forEach(b => b.animate([{transform:'scale(1.6)'},{transform:'scale(1)'}], {duration:500, easing:OUT}));
  const t = document.getElementById('toast');
  let im = t.querySelector('img');
  if (!im){ im = new Image(40, 40); im.alt = ''; t.prepend(im); }
  im.src = p.img;
  document.getElementById('toastTxt').textContent = `${p.nome}${size ? ' · ' + size : ''} adicionado`;
  t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
}
track.addEventListener('click', e => {
  const card = e.target.closest('.prod'); if (!card) return;
  const p = PRODS[+card.dataset.i];
  const sz = e.target.closest('.size'), add = e.target.closest('.add'), fav = e.target.closest('.fav'), op = e.target.closest('.quick-open');
  if (op){ const o = card.classList.toggle('open'); op.setAttribute('aria-expanded', o); }
  else if (sz && !sz.disabled){ addToBag(p, sz.dataset.size); card.classList.remove('open'); }
  else if (add){ addToBag(p); card.classList.remove('open'); }
  else if (fav){ Favs.alternar(p.id); fav.animate([{transform:'scale(1.25)'},{transform:'scale(1)'}], {duration:400, easing:OUT}); }
  else return;
  e.preventDefault();
});

// a seção fica presa e a rolagem da página leva os produtos para o lado (sem rolagem própria)
const chegadas = document.getElementById('chegadas');
const prev = document.getElementById('prev'), next = document.getElementById('next'), fill = document.getElementById('barFill');
const stepW = () => track.querySelector('.prod').getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 20);
let shift = 0;
function measureTrack(){
  if (!track.lastElementChild) return;
  track.style.transform = 'none';
  const last = track.lastElementChild.getBoundingClientRect(), pad = parseFloat(getComputedStyle(track).paddingRight);
  shift = Math.max(0, last.right + pad - innerWidth);
  chegadas.style.height = (innerHeight + shift) + 'px';
  syncTrack();
}
function syncTrack(){
  if (!track.lastElementChild) return;
  const range = chegadas.offsetHeight - innerHeight;
  const p = range > 0 ? Math.min(Math.max(-chegadas.getBoundingClientRect().top / range, 0), 1) : 0;
  track.style.transform = `translate3d(${(-p * shift).toFixed(1)}px,0,0)`;
  const vis = innerWidth / (innerWidth + shift);
  fill.style.width = (vis * 100) + '%';
  fill.style.left = (p * (1 - vis) * 100) + '%';
  prev.disabled = p < .01; next.disabled = p > .99;
}
// 1px de rolagem vertical = 1px de deslocamento lateral, então as setas rolam a página
prev.onclick = () => scrollBy({top: -stepW(), behavior: reduce ? 'auto' : 'smooth'});
next.onclick = () => scrollBy({top:  stepW(), behavior: reduce ? 'auto' : 'smooth'});
addEventListener('scroll', syncTrack, {passive:true});
addEventListener('resize', measureTrack);
addEventListener('load', measureTrack);
quandoPronto(initChegadas);

/* avaliações — DEPOIMENTOS ILUSTRATIVOS: substituir por avaliações reais de clientes antes de publicar */
const DEPS = [
  {n:'Beatriz S.', d:'Outubro 2026',  p:'Plataforma Caramelo', t:'Impecável! Estilo e qualidade que eu não encontrava. Usei a plataforma o dia inteiro e terminei sem reclamar.'},
  {n:'Mariana L.', d:'Setembro 2026', p:'Bolsa Estruturada Terracota', t:'A bolsa é ainda mais bonita pessoalmente. Recebi elogio no primeiro dia.'},
  {n:'Camila R.',  d:'Setembro 2026', p:'Scarpin Cetim Coral', t:'O scarpin é confortável de verdade, coisa rara em salto fino. A cor é exatamente a da foto.'},
  {n:'Luana P.',   d:'Agosto 2026',   p:'Rasteira Fio Dourado', t:'Delicada e firme no pé. Já virou a minha rasteira de todo dia.'},
  {n:'Renata M.',  d:'Agosto 2026',   p:'Anabela Juta Nude', t:'Me ajudaram com o tamanho pelo WhatsApp e acertaram em cheio. Atendimento de primeira.'},
];
(function avaliacoes(){
  const dep = document.getElementById('dep'), avs = document.getElementById('avs');
  dep.innerHTML = DEPS.map((d, i) => `
    <figure class="dep__item" role="group" aria-roledescription="depoimento" aria-label="${i + 1} de ${DEPS.length}">
      <span class="stars" aria-label="Nota 5 de 5">${STAR.repeat(5)}</span>
      <blockquote>“${esc(d.t)}”</blockquote>
      <figcaption><b>${esc(d.n)}</b>${esc(d.d)} · ${esc(d.p)}</figcaption>
    </figure>`).join('');
  avs.innerHTML = DEPS.map((d, i) => `<button class="av" role="tab" aria-label="Depoimento de ${esc(d.n)}">${esc(d.n[0])}</button>`).join('');
  const items = [...dep.children], dots = [...avs.children];
  let cur = 0, timer;
  function go(n){
    const old = cur; cur = (n + DEPS.length) % DEPS.length;
    const fwd = n > old;                 // avançando: sai pela esquerda, entra pela direita
    const nu = items[cur], ol = items[old];
    if (nu !== ol){
      nu.style.transition = 'none';
      nu.classList.toggle('is-prev', !fwd);
      nu.offsetWidth;                    // fixa a posição de partida antes de animar
      nu.style.transition = '';
      ol.classList.remove('is-on'); ol.classList.toggle('is-prev', fwd); ol.setAttribute('aria-hidden', 'true');
    }
    nu.classList.remove('is-prev'); nu.classList.add('is-on'); nu.setAttribute('aria-hidden', 'false');
    dots.forEach((b, i) => { b.setAttribute('aria-current', i === cur); b.setAttribute('aria-selected', i === cur); });
  }
  let visible = false;
  function auto(){ clearInterval(timer); if (!reduce && visible) timer = setInterval(() => go(cur + 1), 6500); }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; auto(); }, {threshold:.3}).observe(dep);
  dots.forEach((b, i) => b.onclick = () => { go(i); auto(); });
  document.getElementById('depPrev').onclick = () => { go(cur - 1); auto(); };
  document.getElementById('depNext').onclick = () => { go(cur + 1); auto(); };
  dep.addEventListener('pointerenter', () => clearInterval(timer));
  dep.addEventListener('pointerleave', auto);
  go(0); auto();
})();



/* menu do celular: abre pelo botão do topo e pela barra de baixo; Esc fecha */
(function menu(){
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
  document.getElementById('tabCats').addEventListener('click', () => set(true));
  m.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) set(false); });
})();
/* barra de baixo: aparece depois da primeira dobra */
new IntersectionObserver(([e]) => document.getElementById('tabbar').classList.toggle('show', !e.isIntersecting),
  {rootMargin:'0px 0px -40% 0px'}).observe(document.getElementById('hero'));

/* rodapé: as letras do PIVÔ sobem quando ele aparece (e descem se você voltar) */
new IntersectionObserver(([e]) => document.getElementById('rodapeWord').classList.toggle('up', e.isIntersecting), {threshold:.25})
  .observe(document.getElementById('rodapeWord'));
/* CTA final: o fundo anda mais devagar que a página (profundidade) */
(function(){
  if (reduce) return;
  const sec = document.getElementById('final'), bg = document.getElementById('finalBg');
  const upd = () => { const r = sec.getBoundingClientRect(); bg.style.transform = `translateY(${(-r.top * .25).toFixed(1)}px) scale(1.15)`; };
  addEventListener('scroll', upd, {passive:true}); upd();
})();

/* entra e sai na rolagem, acompanhando a posição na tela:
   perto da borda de baixo o elemento chega deslizando; perto da borda de cima ele sai deslizando e esmaece.
   no carrossel, o mesmo vale para as bordas laterais. */
(function reveal(){
  let els = [...document.querySelectorAll('[data-reveal]')];
  if (reduce){ els.forEach(e => e.style.opacity = 1); addEventListener('reveal:novos', () => document.querySelectorAll('[data-reveal]').forEach(e => e.style.opacity = 1)); return; }
  const cl = v => Math.min(Math.max(v, 0), 1), D = 80;
  let vals = els.map(() => 0);
  addEventListener('reveal:novos', () => { els = [...document.querySelectorAll('[data-reveal]')]; vals = els.map(() => 0); });
  (function frame(){
    const vh = innerHeight, vw = innerWidth;
    els.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const rd = parseFloat(el.style.getPropertyValue('--rd')) || 0;
      const enter = cl((vh - r.top - rd * vh * .25) / (vh * .14));
      const exit = cl(r.bottom / (vh * .26));
      const hin = cl((vw - r.left) / (vw * .2)), hout = cl(r.right / (vw * .2));
      const v = Math.min(enter, exit, hin, hout);
      vals[i] += (v - vals[i]) * .2;
      const e = 1 - Math.pow(1 - vals[i], 3), k = (1 - e) * D, dir = el.dataset.reveal;
      const top = exit < enter;
      let x = 0, y = 0;
      if (hout < 1 && hout <= hin) x = -k;            // saindo pela esquerda (carrossel)
      else if (hin < 1) x = k;                         // chegando pela direita (carrossel)
      else if (dir === 'left') { x = -k * 1.15; y = top ? -k * .35 : 0; }
      else if (dir === 'right'){ x =  k * 1.15; y = top ? -k * .35 : 0; }
      else y = top ? -k : k;
      el.style.opacity = e.toFixed(3);
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
    requestAnimationFrame(frame);
  })();
})();

/* profundidade na primeira dobra:
   - mouse: fundo mexe pouco, título um pouco mais, salto mais ainda
   - rolagem: cada camada sai num ritmo — fundo fica para trás, título sobe devagar e some, salto (o mais perto) sobe rápido e cresce */
function parallax(){
  if (reduce) return;
  const bg = document.getElementById('bg'), title = document.getElementById('hero-title');
  const step = document.getElementById('step'), foot = document.querySelector('.foot');
  let tx = 0, ty = 0, x = 0, y = 0, sy = scrollY;
  addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });
  (function loop(){
    x += (tx - x) * .06; y += (ty - y) * .06;
    sy += (scrollY - sy) * .2;
    const vh = innerHeight, s = Math.min(sy, vh * 1.2), p = s / vh;
    bg.style.transform    = `translate(${(x*12).toFixed(2)}px, ${(y*10 + s*.5).toFixed(2)}px) scale(${(1 + p*.08).toFixed(4)})`;
    title.style.transform = `translate(${(-x*10).toFixed(2)}px, ${(-y*6 + s*.28).toFixed(2)}px)`;
    title.style.opacity   = Math.max(0, 1 - p * 1.5).toFixed(3);
    step.style.transform  = `translate(${(-x*40).toFixed(2)}px, ${(-y*22 - s*.38).toFixed(2)}px) scale(${(1 + p*.32).toFixed(4)}) rotate(${(-p*8).toFixed(2)}deg)`;
    foot.style.transform  = `translateY(${(s*.5).toFixed(2)}px)`;   // anda junto com o piso
    foot.style.opacity    = Math.max(0, 1 - p * 2.4).toFixed(3);
    requestAnimationFrame(loop);
  })();
}

/* salto: na entrada desce e pisa uma vez, com uma onda saindo da ponta do salto */
function stepper(){
  if (reduce) return;
  const hero = document.getElementById('hero'), stepEl = document.getElementById('step');
  const shoe = document.getElementById('stepShoe'), shadow = document.getElementById('stepShadow');
  const cv = document.getElementById('ripple'), ctx = cv.getContext('2d');
  const d = Math.min(devicePixelRatio || 1, 2);
  cv.width = hero.clientWidth * d; cv.height = hero.clientHeight * d; ctx.setTransform(d,0,0,d,0,0);

  function ripple(){
    const r = stepEl.getBoundingClientRect(), h = hero.getBoundingClientRect(), t0 = performance.now();
    const x = r.left - h.left + r.width * .075, y = r.top - h.top + r.height * .985, W = hero.clientWidth;
    requestAnimationFrame(function draw(now){
      ctx.clearRect(0, 0, cv.width, cv.height);
      let alive = false;
      for (let i = 0; i < 3; i++){
        const t = (now - t0 - i * 140) / 1700;
        if (t < 0 || t >= 1){ if (t < 0) alive = true; continue; }
        alive = true;
        const e = 1 - Math.pow(1 - t, 3), rx = 10 + e * W * .34;
        ctx.beginPath(); ctx.ellipse(x, y, rx, rx * .2, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(122,38,20,${(1 - t) * .45})`; ctx.lineWidth = 1.4; ctx.stroke();
        if (i === 0 && t < .35){
          const rg = ctx.createRadialGradient(x, y, 0, x, y, 120);
          rg.addColorStop(0, `rgba(232,113,77,${(.35 - t) * .7})`); rg.addColorStop(1, 'rgba(232,113,77,0)');
          ctx.fillStyle = rg; ctx.fillRect(x - 120, y - 120, 240, 240);
        }
      }
      if (alive) requestAnimationFrame(draw); else ctx.clearRect(0, 0, cv.width, cv.height);
    });
  }

  const dur = 1500;
  shoe.animate([
    {transform: 'translateY(-75vh) rotate(-20deg)', offset: 0, easing: 'cubic-bezier(.55,0,.8,.3)'},
    {transform: 'translateY(0) rotate(-11deg)', offset: .62, easing: 'cubic-bezier(.3,.9,.4,1)'},
    {transform: 'translateY(0) rotate(0deg)', offset: 1}
  ], {duration: dur});
  shadow.animate([{transform:'scaleX(.4)', opacity:.25},{transform:'scaleX(.85)', opacity:.75, offset:.62},{transform:'scaleX(1)', opacity:1}], {duration: dur});
  setTimeout(ripple, dur * .62);
}

/* entrada da dobra depois da intro */
function heroIn(){
  document.body.classList.remove('is-loading');
  parallax();
  if (reduce) return;
  document.querySelector('.wall').animate([{opacity:.4, transform:'scale(1.12)'},{opacity:1, transform:'scale(1)'}], {duration:2000, easing:OUT});
  document.querySelector('.floor').animate([{transform:'translateY(40%)'},{transform:'none'}], {duration:1500, easing:OUT});
  stepper();
  document.getElementById('nav').animate([{opacity:0, transform:'translate(-50%,-30px)'},{opacity:1, transform:'translate(-50%,0)'}],
    {duration:1100, delay:300, easing:OUT, fill:'backwards'});
  document.querySelectorAll('.title .l1, .title .l2').forEach((l, i) => l.animate(
    [{transform:'translateY(110%)'},{transform:'translateY(0)'}], {duration:1200, delay:150 + i*140, easing:OUT, fill:'forwards'}));
  document.querySelectorAll('.foot > *').forEach((el, i) => el.animate(
    [{opacity:0, transform:'translateY(24px)'},{opacity:1, transform:'none'}], {duration:1100, delay:650 + i*90, easing:OUT, fill:'forwards'}));
}

/* ---------- intro (linha do tempo medida no outfit.hellohello.is) ---------- */
const intro = document.getElementById('intro');
let seen = false;
try { seen = sessionStorage.getItem('pivo-intro') === '1'; } catch(e) {}

if (reduce || seen){
  intro.remove(); heroIn();
} else {
  try { sessionStorage.setItem('pivo-intro','1'); } catch(e) {}
  const stack = document.getElementById('stack');
  const count = document.getElementById('count');
  const shots = ['salto-dark','bolsa-dark','campanha','sandalia-verniz-dark','anabela-dark','hero-dark'];
  const angles = [rnd(0,4), rnd(-9,-5), rnd(-7,-4), rnd(-8,-5), rnd(-12,-9), rnd(-20,-16)];
  const imgs = shots.map(s => { const im = new Image(); im.alt = ''; im.src = `img/${s}.jpg`; stack.appendChild(im); return im; });
  const T0 = 250, STEP = 270, COUNT_END = 2900, EXIT = COUNT_END + 150;

  imgs.forEach((im, i) => im.animate(
    [{transform:`rotate(${angles[i]*0.2}deg) scale(0)`},{transform:`rotate(${angles[i]}deg) scale(1)`}],
    {duration:620, delay:T0 + i*STEP, easing:OUT, fill:'forwards'}));

  const iLetters = shuffle([...document.querySelectorAll('#introMark .mask svg')]);
  iLetters.forEach((s, i) => s.animate([{transform:'translateY(102%)'},{transform:'translateY(0)'}],
    {duration:800, delay:350 + i*420, easing:OUT, fill:'forwards'}));

  const start = performance.now() + T0;
  (function tick(now){
    const t = Math.max(0, Math.min((now - start) / (COUNT_END - T0), 1));
    const e = t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
    count.textContent = String(Math.round(e * 100)).padStart(3, '0');
    if (t < 1) requestAnimationFrame(tick);
  })(performance.now());

  setTimeout(() => {
    count.animate([{transform:'translateY(0)'},{transform:'translateY(-100%)'}], {duration:900, easing:INOUT, fill:'forwards'});
    imgs.slice().reverse().forEach((im, i) => {
      const a = angles[imgs.length - 1 - i];
      im.animate([{transform:`rotate(${a}deg) scale(1)`},{transform:`rotate(${a + rnd(-22,22)}deg) scale(0)`}],
        {duration:520, delay:120 + i*80, easing:IN, fill:'forwards'});
    });
    shuffle(iLetters).forEach((s, i) => s.animate([{transform:'translateY(0)'},{transform:'translateY(102%)'}],
      {duration:620, delay:200 + i*70, easing:IN, fill:'forwards'}));
    intro.animate([{clipPath:'inset(0 0 0% 0)'},{clipPath:'inset(0 0 100% 0)'}],
      {duration:1400, delay:420, easing:INOUT, fill:'forwards'}).finished.then(() => intro.remove());
    setTimeout(heroIn, 900);
  }, EXIT);
}
