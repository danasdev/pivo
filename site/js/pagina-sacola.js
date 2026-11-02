moldura('sacola');
const box = document.getElementById('conteudo');

function avisoConta(){
  const u = window.Loja && Loja.user;
  if (!u) return `<p class="note">Quer acompanhar seus pedidos? <a href="conta.html?volta=sacola">Entre na sua conta</a> antes de finalizar.</p>`;
  if (!u.emailVerified) return `<p class="note">Confirme seu e-mail (enviamos um link) para o pedido ficar guardado na sua conta.</p>`;
  return `<p class="note">O pedido fica guardado em <a href="conta.html#pedidos">Minha conta</a>.</p>`;
}

function desenhar(){
  const itens = Sacola.itens().map((i, k) => ({...i, k, p: produto(i.id)})).filter(i => i.p);
  if (!itens.length){
    box.innerHTML = `<div class="empty">
      <h1 class="duo"><span class="l1">Sua sacola está vazia.</span><span class="l2">O próximo passo é seu.</span></h1>
      <p>Explore as novas chegadas e escolha a peça que combina com o seu estilo.</p>
      <a class="btn" href="catalogo.html">Explorar o catálogo ${ICON.arrow}</a></div>`;
    return;
  }
  const qtd = itens.reduce((n, i) => n + i.q, 0);
  const sub = itens.reduce((n, i) => n + i.q * i.p.preco, 0);
  box.innerHTML = `
    <h1 class="duo"><span class="l1">Sua sacola.</span><span class="l2">${qtd} ${qtd === 1 ? 'peça escolhida' : 'peças escolhidas'}.</span></h1>
    <div class="cart">
      <ul class="items" aria-label="Itens da sacola">${itens.map(i => `
        <li class="item">
          <a class="item__img" href="${linkProd(i.p.id)}">${i.p.img ? `<img src="${esc(i.p.img)}" alt="${esc(i.p.nome)}">` : ''}</a>
          <div>
            <h2><a href="${linkProd(i.p.id)}">${esc(i.p.nome)}</a></h2>
            <p class="sub">${esc(catNome(i.p.cat))}${i.t ? ` · Tamanho ${i.t | 0}` : ''} · ${brl(i.p.preco)} cada</p>
            <div class="row">
              <div class="qty" role="group" aria-label="Quantidade de ${esc(i.p.nome)}">
                <button data-d="-1" data-k="${i.k}" aria-label="Diminuir" ${i.q < 2 ? 'disabled' : ''}>${ICON.minus}</button>
                <output aria-live="polite">${i.q | 0}</output>
                <button data-d="1" data-k="${i.k}" aria-label="Aumentar" ${i.q >= 20 ? 'disabled' : ''}>${ICON.plus}</button>
              </div>
              <button class="rm" data-rm="${i.k}">Remover</button>
            </div>
          </div>
          <span class="item__price">${brl(i.q * i.p.preco)}</span>
        </li>`).join('')}
      </ul>
      <aside class="sum" aria-labelledby="sum-t">
        <h2 id="sum-t">Resumo</h2>
        <dl>
          <div class="l"><dt>Subtotal (${qtd} ${qtd === 1 ? 'item' : 'itens'})</dt><dd>${brl(sub)}</dd></div>
          <div class="l"><dt>Frete</dt><dd>Combinado no WhatsApp</dd></div>
          <div class="l tot"><dt>Total dos produtos</dt><dd>${brl(sub)}</dd></div>
        </dl>
        <button class="btn" id="finalizar" type="button">${ICON.wa} Finalizar pelo WhatsApp</button>
        <p class="ck" id="ckMsg" role="status" aria-live="polite"></p>
        ${avisoConta()}
        <a class="back" href="catalogo.html">Continuar comprando</a>
      </aside>
    </div>`;
}

async function finalizar(btn){
  const msg = document.getElementById('ckMsg');
  const itens = Sacola.itens().filter(i => produto(i.id));
  if (!itens.length) return;
  if (!/^\d{10,15}$/.test(CONFIG.whatsapp)){ msg.textContent = 'O WhatsApp da loja ainda não foi configurado. Tente de novo mais tarde.'; return; }
  const u = window.Loja && Loja.user;
  if (u && u.emailVerified){
    btn.disabled = true; msg.textContent = 'Registrando seu pedido…';
    try {
      const id = await Loja.criarPedido(itens);
      const link = linkWhatsApp(itens, id.slice(0, 6).toUpperCase());
      Sacola.limpar();
      location.href = link;
    } catch (e) {
      btn.disabled = false;
      msg.textContent = e.code === 'permission-denied'
        ? 'Você enviou um pedido agora há pouco. Espere um minuto e tente de novo.'
        : 'Não conseguimos registrar o pedido agora. Verifique sua conexão e tente de novo.';
    }
    return;
  }
  // sem conta: vai direto para o WhatsApp, sem registrar
  location.href = linkWhatsApp(itens);
}

box.addEventListener('click', e => {
  const q = e.target.closest('[data-d]'), r = e.target.closest('[data-rm]'), f = e.target.closest('#finalizar');
  if (q && !q.disabled){ Sacola.mudar(+q.dataset.k, +q.dataset.d); desenhar(); }
  if (r){ Sacola.tirar(+r.dataset.rm); desenhar(); }
  if (f && !f.disabled) finalizar(f);
});
addEventListener('storage', e => { if (e.key === Sacola.KEY) desenhar(); });
addEventListener('loja:usuario', () => quandoPronto(desenhar));
quandoPronto(desenhar);
