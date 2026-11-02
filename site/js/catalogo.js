/* Catálogo da PIVÔ.
   CONTEÚDO ILUSTRATIVO: nomes, preços, notas, avaliações, estoque e descrições
   foram criados para o protótipo e devem ser trocados pelos dados reais da loja. */
const CATEGORIAS = [
  {slug:'bolsas',     nome:'Bolsas',     desc:'Estruturadas, de ombro e de mão.'},
  {slug:'salto-fino', nome:'Salto fino', desc:'Para quando o passo é o recado.'},
  {slug:'plataforma', nome:'Plataforma', desc:'Altura com conforto o dia todo.'},
  {slug:'anabela',    nome:'Anabela',    desc:'Juta, couro e verão.'},
  {slug:'papete',     nome:'Papete',     desc:'Firme no pé, leve no estilo.'},
  {slug:'rasteira',   nome:'Rasteira',   desc:'O mínimo que faz diferença.'},
];

const TAM = [34, 35, 36, 37, 38, 39];

const PRODUTOS = [
  {id:'plataforma-caramelo', nome:'Plataforma Caramelo', cat:'plataforma', preco:389.90, nota:4.9, aval:38, estoque:'Últimos 4 pares', novo:true,
   img:'img/colecoes/plataforma.jpg', uso:'img/colecoes/plataforma-uso.jpg', tam:TAM, esgot:[38],
   desc:'Sandália plataforma em couro caramelo com tiras largas e fivela dourada. A sola alta deixa o passo firme e confortável do café ao fim da noite.',
   detalhes:['Cabedal em couro','Salto bloco de 10 cm com meia pata de 4 cm','Fivela dourada ajustável','Palmilha acolchoada']},
  {id:'scarpin-cetim-coral', nome:'Scarpin Cetim Coral', cat:'salto-fino', preco:349.90, nota:4.8, aval:52, estoque:'Em estoque', novo:true,
   img:'img/colecoes/salto.jpg', uso:'img/colecoes/salto-uso.jpg', tam:TAM, esgot:[],
   desc:'Scarpin de bico fino em cetim coral, a cor da PIVÔ. Salto agulha e linhas limpas para quando o look precisa de um ponto de luz.',
   detalhes:['Cabedal em cetim','Salto agulha de 10 cm','Bico fino','Forro em couro']},
  {id:'bolsa-estruturada-terracota', nome:'Bolsa Estruturada Terracota', cat:'bolsas', preco:499.90, nota:5.0, aval:21, estoque:'Em estoque',
   img:'img/colecoes/bolsas.jpg', uso:'img/colecoes/bolsas-uso.jpg', tam:null,
   desc:'Bolsa de mão estruturada em couro terracota com alça superior e fecho dourado. Cabe o essencial do dia e acompanha do trabalho ao jantar.',
   detalhes:['Couro com acabamento liso','Alça de mão fixa','Fecho dourado','Medidas: 26 × 20 × 11 cm']},
  {id:'anabela-juta-nude', nome:'Anabela Juta Nude', cat:'anabela', preco:279.90, nota:4.7, aval:64, estoque:'Últimos 6 pares',
   img:'img/colecoes/anabela.jpg', uso:'img/colecoes/anabela-uso.jpg', tam:TAM, esgot:[34],
   desc:'Anabela com plataforma de juta trançada e tiras em couro nude. Altura sem esforço para os dias de sol.',
   detalhes:['Tiras em couro','Plataforma em juta trançada de 11 cm','Fivela no tornozelo','Sola antiderrapante']},
  {id:'papete-couro-preto', nome:'Papete Couro Preto', cat:'papete', preco:259.90, nota:4.8, aval:47, estoque:'Em estoque', novo:true,
   img:'img/colecoes/papete.jpg', uso:'img/colecoes/papete-uso.jpg', tam:TAM, esgot:[],
   desc:'Papete de tiras largas em couro preto com fivelas douradas. Firme no pé, leve no estilo, para andar a cidade inteira.',
   detalhes:['Couro','Duas fivelas ajustáveis','Sola tratorada leve','Palmilha anatômica']},
  {id:'rasteira-fio-dourado', nome:'Rasteira Fio Dourado', cat:'rasteira', preco:189.90, nota:4.9, aval:83, estoque:'Em estoque',
   img:'img/colecoes/rasteira.jpg', uso:'img/colecoes/rasteira-uso.jpg', tam:TAM, esgot:[39],
   desc:'Rasteira de tiras finas douradas com anel no dedo. O mínimo que faz diferença no look.',
   detalhes:['Tiras metalizadas','Anel no dedo','Elástico no calcanhar','Sola flexível']},
  {id:'bolsa-meia-lua-camurca', nome:'Bolsa Meia-Lua Camurça', cat:'bolsas', preco:459.90, nota:4.8, aval:29, estoque:'Em estoque', novo:true,
   img:'img/produtos/bolsa-meia-lua.jpg', tam:null,
   desc:'Bolsa de ombro em formato meia-lua, em camurça areia com corrente dourada. Leve e curvilínea.',
   detalhes:['Camurça','Alça de corrente dourada','Fecho em zíper','Medidas: 28 × 14 × 6 cm']},
  {id:'sandalia-verniz-corrente', nome:'Sandália Verniz Corrente', cat:'salto-fino', preco:329.90, nota:4.9, aval:17, estoque:'Últimos 3 pares',
   img:'img/produtos/sandalia-verniz.jpg', tam:TAM, esgot:[35, 38],
   desc:'Sandália de salto fino em verniz preto com corrente dourada no tornozelo. Um clássico com um detalhe que brilha.',
   detalhes:['Verniz','Salto fino de 10 cm','Corrente dourada no tornozelo','Fecho em fivela']},
  {id:'mule-plataforma-off-white', nome:'Mule Plataforma Off-White', cat:'plataforma', preco:369.90, nota:4.6, aval:24, estoque:'Em estoque',
   img:'img/produtos/mule-off-white.jpg', tam:TAM, esgot:[],
   desc:'Mule de plataforma tratorada em couro off-white. Calça em um segundo e muda o look inteiro.',
   detalhes:['Couro','Plataforma tratorada de 8 cm','Tira única frontal','Sola de borracha']},
  {id:'anabela-cortica-caramelo', nome:'Anabela Cortiça Caramelo', cat:'anabela', preco:299.90, nota:4.7, aval:31, estoque:'Em estoque',
   img:'img/produtos/anabela-cortica.jpg', tam:TAM, esgot:[],
   desc:'Anabela de cortiça com tiras cruzadas em couro caramelo. Leve, alta e confortável.',
   detalhes:['Tiras cruzadas em couro','Plataforma em cortiça de 10 cm','Sem fecho, calce fácil','Palmilha acolchoada']},
  {id:'papete-nude-conforto', nome:'Papete Nude Conforto', cat:'papete', preco:239.90, nota:4.8, aval:58, estoque:'Em estoque',
   img:'img/produtos/papete-nude.jpg', tam:TAM, esgot:[34],
   desc:'Papete de tiras largas em couro nude sobre sola acolchoada. Para quem não abre mão do conforto.',
   detalhes:['Couro','Fivela ajustável','Sola acolchoada','Peso leve']},
  {id:'rasteira-tiras-pretas', nome:'Rasteira Tiras Pretas', cat:'rasteira', preco:169.90, nota:4.7, aval:42, estoque:'Em estoque',
   img:'img/produtos/rasteira-preta.jpg', tam:TAM, esgot:[],
   desc:'Rasteira de tiras finas cruzadas em couro preto. Vai com tudo, todos os dias.',
   detalhes:['Couro','Tiras cruzadas','Elástico no calcanhar','Sola flexível']},
];

const brl = v => v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
const catNome = slug => (CATEGORIAS.find(c => c.slug === slug) || {}).nome || '';
const produto = id => PRODUTOS.find(p => p.id === id);
