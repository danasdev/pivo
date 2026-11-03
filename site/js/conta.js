/* Minha conta: acesso, pedidos, favoritos e exclusão. */
import { auth, db } from './firebase.js';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
  sendEmailVerification, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, signOut, deleteUser,
} from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';
import { doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js';

moldura('conta');
const $ = id => document.getElementById(id);

// Mensagens genéricas: não confirmam se um e-mail existe ou não (evita descobrir contas alheias).
function erro(e){
  const c = e && e.code || '';
  if (/invalid-credential|wrong-password|user-not-found|invalid-email|missing-password/.test(c)) return 'E-mail ou senha incorretos.';
  if (c.includes('email-already-in-use')) return 'Não foi possível criar a conta com esse e-mail. Se já tem cadastro, entre ou recupere a senha.';
  if (c.includes('weak-password')) return 'Escolha uma senha com pelo menos 8 caracteres.';
  if (c.includes('too-many-requests')) return 'Muitas tentativas. Espere alguns minutos e tente de novo.';
  if (c.includes('popup-closed') || c.includes('cancelled-popup')) return '';
  if (c.includes('popup-blocked')) return 'O navegador bloqueou a janela do Google. Libere pop-ups para este site e tente de novo.';
  if (c.includes('network')) return 'Sem conexão. Verifique a internet e tente de novo.';
  if (c.includes('requires-recent-login')) return 'Por segurança, saia, entre de novo e repita a exclusão.';
  return 'Algo deu errado. Tente de novo em instantes.';
}
const emailOk = v => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(v);

// destino após entrar: só valores conhecidos (sem redirecionamento aberto)
const volta = voltaSegura(new URLSearchParams(location.search).get('volta'));
let pendente = null; try { pendente = JSON.parse(sessionStorage.getItem('pivo-pendente')); } catch(e){}
if (pendente) document.querySelector('.auth__intro p').textContent = 'Entre ou crie sua conta para adicionar a peça à sacola. Ela já está separada para você.';

/* ---------- abas ---------- */
function aba(criar){
  $('tabEntrar').setAttribute('aria-selected', !criar); $('tabCriar').setAttribute('aria-selected', criar);
  $('formEntrar').hidden = criar; $('formCriar').hidden = !criar;
  $('authTitulo').innerHTML = criar ? '<span class="l1">Criar conta.</span><span class="l2">O próximo passo é seu.</span>' : '<span class="l1">Entrar.</span><span class="l2">Seu estilo, guardado.</span>';
  $('okMsg').textContent = '';
}
$('tabEntrar').onclick = () => aba(false);
$('tabCriar').onclick = () => aba(true);

function travar(form, sim){ form.querySelectorAll('button,input').forEach(x => x.disabled = sim); }
function validar(form){
  let ok = true;
  form.querySelectorAll('input').forEach(i => {
    const v = i.value.trim();
    const bad = !v || (i.type === 'email' && !emailOk(v)) || (i.minLength > 0 && v.length < i.minLength);
    i.setAttribute('aria-invalid', bad); if (bad && ok){ i.focus(); ok = false; }
  });
  return ok;
}
// o erro some assim que a pessoa corrige
document.querySelectorAll('.f input').forEach(i => i.addEventListener('input', () => { i.removeAttribute('aria-invalid'); i.form.querySelector('.f__err').textContent = ''; }));

$('formEntrar').addEventListener('submit', async e => {
  e.preventDefault(); const f = e.target, err = f.querySelector('.f__err');
  if (!validar(f)){ err.textContent = 'Preencha e-mail e senha.'; return; }
  travar(f, true);
  try { await signInWithEmailAndPassword(auth, f.email.value.trim(), f.senha.value); }
  catch (x) { err.textContent = erro(x); }
  travar(f, false);
});

$('formCriar').addEventListener('submit', async e => {
  e.preventDefault(); const f = e.target, err = f.querySelector('.f__err');
  if (!validar(f)){ err.textContent = 'Confira os campos destacados.'; return; }
  travar(f, true);
  try {
    const { user } = await createUserWithEmailAndPassword(auth, f.email.value.trim(), f.senha.value);
    await updateProfile(user, {displayName: f.nome.value.trim().slice(0, 80)});
    await sendEmailVerification(user);
  } catch (x) { err.textContent = erro(x); }
  travar(f, false);
});

$('esqueci').onclick = async () => {
  const f = $('formEntrar'), em = f.email.value.trim(), err = f.querySelector('.f__err');
  if (!emailOk(em)){ f.email.setAttribute('aria-invalid', true); f.email.focus(); err.textContent = 'Digite seu e-mail acima para receber o link.'; return; }
  try { await sendPasswordResetEmail(auth, em); } catch (x) { if (/too-many|network/.test(x.code || '')){ err.textContent = erro(x); return; } }
  $('okMsg').textContent = 'Se houver uma conta com esse e-mail, enviamos um link para criar uma nova senha.';
};

$('google').onclick = async () => {
  try { await signInWithPopup(auth, new GoogleAuthProvider()); }
  catch (x) { const m = erro(x); if (m) $('okMsg').textContent = m; }
};

/* ---------- dentro da conta ---------- */
const STATUS = {novo:'Recebido', confirmado:'Confirmado', enviado:'Enviado', entregue:'Entregue', cancelado:'Cancelado'};
async function pedidos(){
  const box = $('listaPedidos');
  try {
    const l = await Loja.meusPedidos();
    if (!l.length){ box.innerHTML = '<p class="vazio">Você ainda não fez pedidos. <a href="catalogo.html">Ver o catálogo</a></p>'; return; }
    box.innerHTML = l.map(p => {
      const itens = Array.isArray(p.itens) ? p.itens : [];
      const total = itens.reduce((n, i) => { const x = produto(i.id); return n + (x ? x.preco * (i.q | 0) : 0); }, 0);
      const st = STATUS[p.status] ? p.status : 'novo';
      const data = p.criadoEm && p.criadoEm.toDate ? p.criadoEm.toDate().toLocaleDateString('pt-BR', {day:'2-digit', month:'long', year:'numeric'}) : '';
      return `<article class="pedido"><div class="pedido__top"><span>Pedido #${esc(p.id.slice(0, 6).toUpperCase())} · ${esc(data)}</span><span class="tag tag--${st}">${STATUS[st]}</span></div>
        <ul>${itens.map(i => { const x = produto(i.id); return `<li>${i.q | 0}× ${esc(x ? x.nome : 'Peça indisponível')}${i.t ? ' · tam. ' + (i.t | 0) : ''}</li>`; }).join('')}</ul>
        <p class="pedido__tot">${brl(total)} <small style="font:400 13px var(--body);color:var(--muted)">em produtos, pelos preços atuais</small></p></article>`;
    }).join('');
  } catch (x) { box.innerHTML = '<p class="vazio">Não foi possível carregar seus pedidos agora.</p>'; }
}
function favoritos(){
  const l = Favs.lista().map(produto).filter(Boolean);
  const box = $('listaFavs');
  box.innerHTML = l.length ? l.map(card).join('') : '<p class="vazio" style="grid-column:1/-1">Toque no coração de uma peça para guardá-la aqui. <a href="catalogo.html">Ver o catálogo</a></p>';
  revelar(box);
}
addEventListener('favs:mudou', () => quandoPronto(favoritos));

$('sair').onclick = () => signOut(auth);
$('reenviar').onclick = async () => {
  try { await sendEmailVerification(auth.currentUser); $('reenviar').textContent = 'Link reenviado'; $('reenviar').disabled = true; }
  catch (x) { $('reenviar').textContent = erro(x) || 'Tente de novo'; }
};
$('excluir').onclick = async () => {
  if (!confirm('Excluir sua conta? Sua sacola e seus favoritos serão apagados. Essa ação não pode ser desfeita.')) return;
  const u = auth.currentUser;
  try {
    await deleteDoc(doc(db, 'usuarios', u.uid));
    await deleteUser(u);
    try { localStorage.removeItem('pivo-sacola'); localStorage.removeItem('pivo-favs'); } catch(e){}
    location.href = 'index.html';
  } catch (x) { $('excluirErr').textContent = erro(x); }
};

onAuthStateChanged(auth, user => {
  $('fora').hidden = !!user; $('dentro').hidden = !user;
  if (!user) return;
  if (volta){
    // espera a sacola da conta ser sincronizada (e a peça separada entrar) antes de voltar
    const ir = () => location.replace(volta);
    addEventListener('loja:usuario', ir, {once:true}); setTimeout(ir, 5000);
    return;
  }
  $('ola').textContent = `Olá, ${(user.displayName || 'cliente').split(' ')[0]}.`;
  $('verif').hidden = user.emailVerified; $('verifEmail').textContent = user.email || '';
  quandoPronto(() => { favoritos(); });
  // a sincronização em loja.js precisa terminar antes de ler pedidos com as permissões da conta
  addEventListener('loja:usuario', () => quandoPronto(pedidos), {once:true});
  if (window.Loja && Loja.user) quandoPronto(pedidos);
  const alvo = {'#pedidos':'pedidos', '#favoritos':'favoritos'}[location.hash];   // só âncoras conhecidas
  if (alvo) setTimeout(() => $(alvo).scrollIntoView(), 300);
});
