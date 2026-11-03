/* Cortina da intro, usada só na entrada na loja (home -> catálogo). As demais trocas de página usam o fade nativo (css/cortina.css). */
(function(){
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY = 'pivo-cortina', root = document.documentElement, chegou = false;
  try { chegou = sessionStorage.getItem(KEY) === '1'; sessionStorage.removeItem(KEY); } catch(e){}
  if (chegou && !reduz) root.classList.add('cortina-on');   // cobre já no primeiro quadro

  var EASE = 'cubic-bezier(.76,0,.24,1)', OUT = 'cubic-bezier(.16,1,.3,1)', IN = 'cubic-bezier(.7,0,.84,0)';
  var P = '<g id="cortina-logo"><path fill-rule="evenodd" d="M0 61h72a45 45 0 0 1 45 45v182a45 45 0 0 1-45 45H31v153H0Zm31 31v210h37a18 18 0 0 0 18-18V110a18 18 0 0 0-18-18Z"/><rect x="251" y="61" width="30" height="425"/><path d="M410 61h31l40 362 45-362h30l-56 425h-39Z"/><path fill-rule="evenodd" d="M677 121.5a58.5 58.5 0 0 1 117 0v306a58.5 58.5 0 0 1-117 0Zm31 1a27.5 27.5 0 0 1 55 0v304a27.5 27.5 0 0 1-55 0Z"/><path d="M690 37 722 3h28l32 34v6h-21l-25-26-25 26h-21Z"/></g>';
  var VB = ['0 0 117 486', '251 0 30 486', '410 0 146 486', '677 0 117 486'];
  var el, letras;

  function montar(){
    if (el) return;
    el = document.createElement('div');
    el.className = 'cortina'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<svg width="0" height="0" style="position:absolute"><defs>' + P + '</defs></svg><div class="cortina__mark">' +
      VB.map(function(v){ return '<span><svg viewBox="' + v + '" fill="currentColor"><use href="#cortina-logo"/></svg></span>'; }).join('') + '</div>';
    document.body.appendChild(el);
    letras = [].slice.call(el.querySelectorAll('.cortina__mark svg'));
  }

  // chegada: letras descem, cortina recolhe para cima
  function abrir(){
    montar();
    el.style.clipPath = 'inset(0 0 0 0)';
    letras.forEach(function(s){ s.style.transform = 'none'; });
    root.classList.remove('cortina-on');
    letras.forEach(function(s, i){ s.animate([{transform:'none'}, {transform:'translateY(102%)'}], {duration:520, delay:60 + i * 55, easing:IN, fill:'forwards'}); });
    el.animate([{clipPath:'inset(0 0 0 0)'}, {clipPath:'inset(0 0 100% 0)'}], {duration:1000, delay:280, easing:EASE, fill:'forwards'})
      .finished.then(function(){ el.style.clipPath = 'inset(100% 0 0 0)'; el.getAnimations().forEach(function(a){ a.cancel(); }); letras.forEach(function(s){ s.getAnimations().forEach(function(a){ a.cancel(); }); s.style.transform = ''; }); });
  }

  // saída: cortina sobe de baixo, letras sobem, depois navega
  var indo = false;
  function irPara(url){
    if (reduz || indo){ location.href = url; return; }
    indo = true; montar();
    el.classList.add('cobre');
    try { sessionStorage.setItem(KEY, '1'); } catch(e){}
    letras.forEach(function(s, i){ s.animate([{transform:'translateY(102%)'}, {transform:'none'}], {duration:620, delay:260 + i * 60, easing:OUT, fill:'forwards'}); });
    el.animate([{clipPath:'inset(100% 0 0 0)'}, {clipPath:'inset(0 0 0 0)'}], {duration:700, easing:EASE, fill:'forwards'});
    setTimeout(function(){ location.href = url; }, 820);
  }
  window.irPara = irPara;

  document.addEventListener('click', function(e){
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-cortina')) return;
    if (/^(mailto|tel):/.test(a.getAttribute('href'))) return;
    var u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;                                    // links externos (WhatsApp etc.)
    // a cortina é só da "entrada na loja": home -> catálogo. O resto usa o fade padrão do navegador.
    var daHome = /\/(index(\.html)?)?$/.test(location.pathname);
    var paraCatalogo = /\/catalogo(\.html)?$/.test(u.pathname);
    if (!daHome || !paraCatalogo) return;
    e.preventDefault();
    irPara(u.href);
  });

  document.addEventListener('DOMContentLoaded', function(){ if (root.classList.contains('cortina-on')) abrir(); });
  // voltar pelo navegador (página do cache): nunca deixar a cortina fechada
  addEventListener('pageshow', function(e){
    if (!e.persisted) return;
    indo = false; root.classList.remove('cortina-on');
    if (el){ el.getAnimations().forEach(function(a){ a.cancel(); }); el.style.clipPath = 'inset(100% 0 0 0)'; el.classList.remove('cobre');
      letras.forEach(function(s){ s.getAnimations().forEach(function(a){ a.cancel(); }); }); }
  });
})();
