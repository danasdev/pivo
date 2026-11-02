/* Links de e-mail do Firebase (confirmar e-mail, redefinir senha, desfazer troca de e-mail).
   Esta página não carrega o Analytics: o endereço traz um código de uso único que não deve sair daqui. */
import { auth } from './firebase.js';
import { applyActionCode, checkActionCode, verifyPasswordResetCode, confirmPasswordReset }
  from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';

moldura('acao');
const box = document.getElementById('acao');
const q = new URLSearchParams(location.search);
const modo = q.get('mode'), codigo = q.get('oobCode');
// tira o código da barra de endereço (não fica no histórico nem é compartilhado por engano)
history.replaceState(null, '', location.pathname);

const tela = (l1, l2, texto, acao = '') => {
  box.innerHTML = `<h1 class="duo"><span class="l1">${esc(l1)}</span><span class="l2">${esc(l2)}</span></h1>
    ${texto ? `<p>${esc(texto)}</p>` : ''}${acao}`;
};
const botao = (href, txt) => `<a class="btn" href="${href}">${esc(txt)} ${ICON.arrow}</a>`;
const invalido = () => tela('Esse link não vale mais.', 'Vamos tentar de novo.',
  'O link expirou ou já foi usado. Peça um novo na sua conta.', botao('conta.html', 'Ir para minha conta'));

async function confirmarEmail(){
  try {
    await applyActionCode(auth, codigo);
    if (auth.currentUser) await auth.currentUser.reload();
    tela('E-mail confirmado.', 'Tudo pronto.', 'Agora seus pedidos ficam guardados na sua conta.', botao('conta.html', 'Ir para minha conta'));
  } catch (e) { invalido(); }
}

async function novaSenha(){
  let email;
  try { email = await verifyPasswordResetCode(auth, codigo); } catch (e) { invalido(); return; }
  tela('Nova senha.', 'Escolha uma que só você saiba.', `Para a conta ${email}.`, `
    <form class="f card-f" id="formSenha" novalidate>
      <input type="email" name="usuario" autocomplete="username" value="${esc(email)}" hidden>
      <label class="field"><span>Nova senha</span><input name="senha" type="password" autocomplete="new-password" required minlength="8" maxlength="128" aria-describedby="dica"></label>
      <small id="dica" class="f__hint">Pelo menos 8 caracteres.</small>
      <label class="field"><span>Repita a senha</span><input name="senha2" type="password" autocomplete="new-password" required maxlength="128"></label>
      <p class="f__err" role="alert"></p>
      <button class="btn" type="submit">Salvar nova senha</button>
    </form>`);
  const f = document.getElementById('formSenha'), err = f.querySelector('.f__err');
  f.querySelectorAll('input').forEach(i => i.addEventListener('input', () => { err.textContent = ''; i.removeAttribute('aria-invalid'); }));
  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (f.senha.value.length < 8){ f.senha.setAttribute('aria-invalid', true); f.senha.focus(); err.textContent = 'A senha precisa ter pelo menos 8 caracteres.'; return; }
    if (f.senha.value !== f.senha2.value){ f.senha2.setAttribute('aria-invalid', true); f.senha2.focus(); err.textContent = 'As senhas não são iguais.'; return; }
    f.querySelector('button').disabled = true;
    try {
      await confirmPasswordReset(auth, codigo, f.senha.value);
      tela('Senha alterada.', 'Pode entrar.', 'Use a nova senha para acessar sua conta.', botao('conta.html', 'Entrar'));
    } catch (x) {
      f.querySelector('button').disabled = false;
      err.textContent = /weak-password/.test(x.code || '') ? 'Escolha uma senha mais forte.' : 'O link expirou. Peça um novo na tela de entrar.';
    }
  });
}

async function desfazerEmail(){
  try {
    const info = await checkActionCode(auth, codigo);
    await applyActionCode(auth, codigo);
    tela('E-mail restaurado.', 'Sua conta voltou ao normal.',
      `O e-mail da conta voltou a ser ${info.data.email}. Se você não pediu a troca, crie uma nova senha agora.`,
      botao('conta.html', 'Ir para minha conta'));
  } catch (e) { invalido(); }
}

if (!codigo) invalido();
else if (modo === 'verifyEmail' || modo === 'verifyAndChangeEmail') confirmarEmail();
else if (modo === 'resetPassword') novaSenha();
else if (modo === 'recoverEmail') desfazerEmail();
else invalido();
