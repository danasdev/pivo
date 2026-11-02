/* Conexão com o Firebase.
   Esta configuração é PÚBLICA por natureza (identifica o projeto, não dá acesso a nada).
   Quem protege os dados são: firestore.rules / storage.rules, o App Check e a restrição
   da chave por domínio no Google Cloud. Chaves de conta de serviço NUNCA entram aqui. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';
import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-app-check.js';

export const SDK = 'https://www.gstatic.com/firebasejs/12.12.0';

export const firebaseConfig = {
  apiKey: 'AIzaSyCWvR7QHuzXWhfQ4YmvN7FhbJdmsx7sRx0',
  authDomain: 'pivo-store.firebaseapp.com',
  projectId: 'pivo-store',
  storageBucket: 'pivo-store.firebasestorage.app',
  messagingSenderId: '379719441882',
  appId: '1:379719441882:web:db78aace0c55e6f2d9f4e3',
  measurementId: 'G-DH9Q5FZ8PM',
};

export const app = initializeApp(firebaseConfig);

// App Check: só pedidos vindos deste site (com token válido) chegam ao banco quando a imposição estiver ligada no console.
const key = window.CONFIG && window.CONFIG.appCheckKey;
if (key) {
  initializeAppCheck(app, { provider: new ReCaptchaV3Provider(key), isTokenAutoRefreshEnabled: true });
}

export const db = getFirestore(app);
export const auth = getAuth(app);
auth.languageCode = 'pt-BR';
