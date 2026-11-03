---
name: PIVÔ
description: Identidade premium de loja de calçados e bolsas, onde a interface recua e a peça é a única coisa que se move.
colors:
  ink: "#0A0A0A"
  coral: "#E8714D"
  rust: "#7A2614"
  rust-deep: "#5E1D0E"
  cream: "#FFF4EC"
  blush: "#FBE8DB"
  peach: "#F7C9AE"
  sand: "#E9C7AE"
  muted: "#6B3A2C"
  wall-glow: "#A8432A"
  wall-deep: "#4A140A"
  error: "#A42B12"
  success: "#2E6B3A"
typography:
  statement:
    fontFamily: "Antonio, Oswald, system-ui, sans-serif"
    fontSize: "clamp(84px, 13.5vw, 230px)"
    fontWeight: 300
    lineHeight: 0.9
    letterSpacing: "0.06em"
  headline-sans:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "clamp(36px, 4.4vw, 68px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline-serif:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(40px, 4.9vw, 76px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "clamp(19px, 1.4vw, 22px)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.14em"
  control:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1
rounded:
  sm: "8px"
  field: "14px"
  card: "18px"
  panel: "22px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 64px)"
  section: "clamp(88px, 12vh, 150px)"
  touch: "44px"
  control-md: "52px"
  control-lg: "56px"
components:
  button-primary:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.cream}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    height: "{spacing.control-lg}"
    padding: "0 30px"
  button-primary-hover:
    backgroundColor: "{colors.rust-deep}"
  button-cta:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    height: "{spacing.control-lg}"
    padding: "0 30px"
  button-cta-hover:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.cream}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.rust}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    height: "{spacing.control-lg}"
    padding: "0 30px"
  button-ghost-hover:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.cream}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.rust}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    height: "{spacing.touch}"
    padding: "0 18px"
  chip-selected:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.cream}"
  size-pill:
    backgroundColor: "transparent"
    textColor: "{colors.rust}"
    rounded: "{rounded.pill}"
    size: "{spacing.touch}"
  badge:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "28px"
    padding: "0 12px"
  nav-pill:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.rust}"
    rounded: "{rounded.pill}"
    height: "64px"
    padding: "0 12px 0 30px"
  product-card-media:
    backgroundColor: "{colors.sand}"
    rounded: "{rounded.card}"
  field:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    height: "{spacing.control-md}"
    padding: "12px 16px"
  panel:
    backgroundColor: "{colors.blush}"
    textColor: "{colors.rust}"
    rounded: "{rounded.panel}"
    padding: "34px"
---

# Design System: PIVÔ

## Overview

**Creative North Star: "O Palco Silencioso"**

A PIVÔ é montada como um palco quase vazio: um fundo de cor decidida, uma peça no centro, e só. A interface não compete com o produto. Ela se organiza em poucas faixas largas de cor, escreve pouco, usa linhas finas em vez de caixas e deixa **uma única coisa se mover por vez**. A quietude é o estado normal; o movimento é um acontecimento, não um tempero espalhado.

O nome pede isso: *pivô* é o ponto fixo em torno do qual algo gira. A página inteira segue essa lógica. Há um ponto estável (a peça, o título, o botão) e o resto orbita ao redor, com respiro generoso. O luxo aqui não vem de ornamento, vem de **espaço, contraste firme e precisão**: cantos que se repetem, uma curva de animação que se repete, um coral que aparece pouco e por isso brilha.

A sutileza é construída, não improvisada. Cada elemento entra deslizando e esmaece no mesmo ritmo; a troca de página usa sempre a mesma cortina com as quatro letras do logo; o mouse desloca camadas em milímetros, só para dar profundidade. Nada pisca, nada pula, nada brilha.

**Key Characteristics:**
- Faixas de cor cheias e alternadas (terracota funda, creme, terracota funda), nunca degradês entre seções.
- Uma voz sem serifa e uma voz serifada em todo título de duas linhas; a fonte da marca só na declaração do herói.
- Um único ponto de coral por tela: a peça, o botão principal ou a etiqueta, nunca todos juntos.
- Estrutura por linha fina de 1px e por espaço; sombra só em coisa que flutua.
- Tudo que é tocável tem 44px ou mais, e o foco de teclado é sempre visível.
- Movimento medido: entradas deslizam e aparecem, saídas deslizam e somem, e a mesma curva volta a cada vez.

## Colors

Paleta de **ateliê quente em duas temperaturas**: terracota funda para o palco e creme para a página, com coral como único ponto de luz.

### Primary
- **Coral PIVÔ** (#E8714D): a cor da marca e o único acento vivo. Aparece no objeto principal da cena (o scarpin), no botão principal da primeira dobra, nas etiquetas "Novo", no foco de teclado e no PIVÔ gigante do rodapé. Nunca em texto pequeno sobre claro.
- **Ferrugem** (#7A2614): a cor de leitura. É o texto e os botões escuros sobre creme, os títulos e as bordas finas. Contraste alto com o creme, a base de toda a interface.

### Secondary
- **Ferrugem Funda** (#5E1D0E): fundo das seções escuras (Essência, Avaliações) e estado de hover dos botões ferrugem.

### Tertiary
- **Pêssego** (#F7C9AE): segunda linha do título do herói, botões sobre fundo escuro e o brilho do CTA final.
- **Areia** (#E9C7AE): o chão das fotos de produto e dos cartões enquanto a imagem carrega; é o tom de estúdio do catálogo.

### Neutral
- **Creme** (#FFF4EC): a página. Fundo de quase tudo e texto sobre as seções escuras. Nunca branco puro.
- **Blush** (#FBE8DB): painéis e cartões levemente acima do creme (resumo da sacola, conta, painel admin).
- **Marrom Suave** (#6B3A2C): texto secundário, notas e rótulos de apoio sobre creme.
- **Preto Tinta** (#0A0A0A): a cortina de transição, o texto sobre coral e o nome do produto.
- **Parede Brasa** (#A8432A) e **Parede Funda** (#4A140A): extremos do degradê da parede da primeira dobra.
- **Erro** (#A42B12) e **Sucesso** (#2E6B3A): mensagens de formulário, sempre com texto junto, nunca só a cor.

### Named Rules
**The One Coral Rule.** O coral ocupa no máximo uma região de destaque por tela e ≤10% da área. Sua raridade é a razão de ele chamar o olhar. Se duas coisas pedem coral, uma delas vira ferrugem.

**The Ink-On-Coral Rule.** Texto sobre coral é sempre preto tinta (#0A0A0A). Branco sobre coral não passa no contraste de leitura.

**The Never-White Rule.** Nenhuma superfície ou texto usa #FFFFFF puro. O mais claro é o creme (#FFF4EC); o mais escuro de texto é a ferrugem sobre creme e o creme sobre ferrugem.

**The Field Rule.** As seções são campos de cor cheios que se alternam (escuro, claro, escuro, claro). A transição entre eles é uma borda reta, nunca um degradê que mistura os dois.

## Typography

**Statement Font:** Antonio (com Oswald, sistema sem serifa)
**Headline Font:** Montserrat (sem serifa) + Bodoni Moda (serifada de alto contraste)
**Body/Control Font:** Poppins (com sistema sem serifa)

**Character:** Três vozes com papéis fixos. A **Antonio** é alta, estreita e espaçada, igual às letras do logo; só aparece na declaração do herói. A **Montserrat** fala firme e leve. A **Bodoni Moda** é a voz de vitrine, elegante e contrastada. A **Poppins** é a voz de trabalho: texto, botões, formulários.

### Hierarchy
- **Statement** (Antonio 300, `clamp(84px, 13.5vw, 230px)`, 0.9, +0.06em, caixa-alta): a frase do herói, em duas linhas (creme e pêssego). Uma por site.
- **Headline sans** (Montserrat 400, `clamp(36px, 4.4vw, 68px)`, 1.04, −0.035em): primeira linha de todo título de seção.
- **Headline serif** (Bodoni Moda 400, 1.12× a linha de cima, 1, −0.02em): segunda linha, sempre em sequência da primeira.
- **Title** (Montserrat 500, `clamp(19px, 1.4vw, 22px)`, 1.2, −0.02em): nome de categoria, nome de peça em destaque.
- **Body** (Poppins 400, 16px, 1.6): descrições, parágrafos; largura de leitura até 34em.
- **Label** (Montserrat 600, 12px, +0.14em, caixa-alta): rótulos de coluna, cabeçalhos de rodapé, etiquetas.
- **Control** (Poppins 500, 15px): botões, chips, tamanhos, navegação.

### Named Rules
**The Two Voices Rule.** Todo título de seção tem duas linhas: uma sem serifa e outra serifada. É a assinatura tipográfica. Uma linha só fica sem graça, três linhas pesam.

**The One Statement Rule.** A Antonio existe para a declaração do herói e para as letras do logo. Não vira fonte de título de seção, de botão nem de texto.

**The Tabular Price Rule.** Preços e contadores usam Montserrat 600 e não quebram de linha; o preço é sempre a informação mais firme do cartão.

## Layout

A página é uma **coluna única de faixas de largura total**. Cada seção é um campo de cor com respiro vertical `clamp(88px, 12vh, 150px)` e margem lateral `clamp(16px, 4vw, 64px)`. O conteúdo respira dentro dessas margens; o que sai delas (fotos de campanha, carrossel) vai até a borda da tela de propósito.

Cada seção segue a mesma receita: **título de duas linhas à esquerda**, uma ação discreta à direita (botão fantasma "Ver todas as peças →"), e depois o conteúdo. Nenhuma seção abre com ícone, selo ou número.

O menu é uma **pílula flutuante** fixa no topo (até 1240px), translúcida sobre a terracota e creme sobre o claro. Em telas menores vira logo, sacola e um botão que abre o menu em tela cheia; embaixo aparece uma **barra de atalhos em pílula** depois da primeira dobra.

Grades de produto seguem 4 → 3 → 2 colunas; no celular os carrosséis viram faixas com rolagem lateral e encaixe. Pontos de quebra: 900px (menu e grades) e 560px (celular, barra de baixo). Todo alvo de toque tem 44px ou mais.

O carrossel "Novas chegadas" **não tem rolagem própria**: a seção fica presa e a rolagem normal da página leva os produtos para o lado.

## Elevation & Depth

Sistema **plano por camadas de tom**, com profundidade vinda de cor e de movimento, não de sombra. A hierarquia de superfícies é creme → blush → ferrugem funda. Estrutura é feita com linha fina (`1px`, ferrugem a 14%), não com caixa.

Sombra existe apenas para o que **flutua sobre o conteúdo** (aviso, barra de baixo, diálogo, aviso de cookies). Na primeira dobra, a profundidade é construída por camadas que se movem em ritmos diferentes: fundo, título, peça.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 18px 40px rgba(0,0,0,.25)`): aviso "adicionado à sacola".
- **Dock** (`box-shadow: 0 10px 30px rgba(0,0,0,.12)`): barra de atalhos do celular.
- **Modal** (`box-shadow: 0 30px 80px rgba(0,0,0,.3)`): diálogo do painel.
- **Lift** (`box-shadow: 0 14px 30px rgba(0,0,0,.18)`): botão do herói ao passar o mouse.
- **Product** (`filter: drop-shadow(0 6px 10px rgba(0,0,0,.25))`): a peça recortada, com uma elipse de sombra no chão.

### Named Rules
**The Float-Only Rule.** Sombra é para o que flutua. Cartão, painel e botão em repouso são planos.

**The Neutral Shadow Rule.** Sombras são sempre pretas translúcidas, nunca coloridas nem em halo. Brilho colorido ao redor de elemento é proibido.

**The Hairline Rule.** Separar é com linha de 1px ou com espaço. Não aninhar cartão dentro de cartão.

## Shapes

Forma **arredondada e macia**, em poucos tamanhos que se repetem. Tudo que se clica é pílula (`999px`); tudo que guarda foto ou conteúdo é um retângulo de cantos generosos (`18px`); painéis maiores usam `22px`; campos de formulário `14px`. Círculos (`50%`) para setas, avatares, favoritos.

As letras do logo são o gesto gráfico de assinatura: altas, finas, com o "Ô" em retângulo arredondado. Elas aparecem gigantes (rodapé e herói), pequenas (menu) e como máscara de animação (cortina, rodapé). A silhueta de uma peça recortada sobre campo de cor é o recurso visual principal; não se enfeita com moldura.

## Components

Todos com **caráter de botão de ateliê**: silenciosos em repouso, precisos no hover.

### Buttons
- **Shape:** pílula (`999px`), altura 56px (menu 40px), padding horizontal 30px, Poppins 500.
- **Primary:** ferrugem com texto creme; hover para ferrugem funda. Setas internas deslizam 3px para a direita no hover.
- **CTA do herói:** coral com texto preto; hover vira ferrugem com texto creme e sobe 2px com a sombra Lift.
- **Ghost:** transparente com borda de 1px ferrugem a 35%; hover preenche de ferrugem.
- **Sobre fundo escuro:** pêssego com texto ferrugem; hover vira creme.
- **Foco:** contorno coral de 2px com 3px de afastamento, só para teclado.

### Chips e tamanhos
- **Chip de categoria:** pílula 44px, borda 1px; selecionado vira ferrugem cheio com texto creme. Traz a contagem em opacidade reduzida.
- **Botão de tamanho:** círculo ou pílula 44px (52px na página do produto); esgotado fica a 35% com texto riscado, desabilitado.

### Cards / Containers
- **Cartão de produto:** foto 4:5 de cantos 18px sobre areia; **nome, preço, estrelas e estoque abaixo**, sem caixa. No hover, a segunda foto (peça em uso) entra como cortina da esquerda: sai de `scale(1.2)` e de um flash `brightness(4) contrast(1.5)` para o normal em 500ms (`cubic-bezier(.4,0,.2,1)`), e volta ao tirar o mouse.
- **Compra rápida:** painel translúcido na base da foto com os tamanhos; no toque, um botão "+" redondo abre o mesmo painel.
- **Painel (blush):** `22px`, padding 34px, fundo blush; resumo da sacola, conta, formulários.

### Inputs / Fields
- **Style:** fundo creme, borda 1px ferrugem a 25%, raio 14px, altura mínima 50px, Poppins 16px. Rótulo sempre visível acima do campo.
- **Focus:** contorno coral de 2px (borda some). **Erro:** borda e mensagem em #A42B12 com o motivo escrito; some assim que a pessoa corrige.

### Navigation
- **Pílula flutuante:** 64px, translúcida com desfoque, logo à esquerda, categorias no centro, botão "Comprar agora", conta e sacola à direita. Os links ganham um sublinhado de 1px que cresce da esquerda no hover.
- **Mobile:** menu em tela cheia que abre como cortina de cima para baixo, categorias em Bodoni 30–40px, linhas finas entre elas.

### Etiquetas e avisos
- **Etiqueta "Novo":** pílula coral 28px, texto preto, Montserrat 600 11px caixa-alta.
- **Aviso (toast):** pílula ferrugem com miniatura da peça, texto e atalho "Ver sacola"; aparece embaixo e some em 3,2s.
- **Cookies:** cartão creme no canto, sem bloquear a página; "Recusar" e "Aceitar" com o mesmo peso visual.

### Cortina de transição (componente de assinatura)
A mesma cortina preta da intro vale para **toda troca de página**: ao clicar, ela sobe de baixo (700ms, `cubic-bezier(.76,0,.24,1)`), as quatro letras do logo sobem em máscara uma a uma, e na página nova as letras descem e a cortina recolhe para cima (1000ms). É o único elemento preto do sistema e só existe nesse gesto.

### Entrada e saída na rolagem
Elementos marcados deslizam e esmaecem acompanhando a posição na tela: chegam por baixo (ou pelo lado, nos títulos) quando entram pela borda inferior, e saem deslizando para cima quando passam pela borda superior, ainda visíveis. Deslocamento de até 80px, curva `cubic-bezier(.16,1,.3,1)`.

## Do's and Don'ts

### Do:
- **Do** deixar uma coisa se mover por vez: se a peça está pisando, o resto fica quieto.
- **Do** usar coral uma vez por tela (a peça, o botão principal ou a etiqueta) e ferrugem para todo o resto.
- **Do** escrever todo título de seção em duas linhas, sem serifa e depois serifada.
- **Do** separar com linha de 1px e com espaço; reservar sombra para o que flutua.
- **Do** manter 44px ou mais em tudo que se toca e foco coral visível no teclado.
- **Do** reaproveitar as mesmas três curvas: `cubic-bezier(.16,1,.3,1)` (entradas), `cubic-bezier(.76,0,.24,1)` (cortinas) e `cubic-bezier(.4,0,.2,1)` (fades e hover).
- **Do** mostrar a peça recortada sobre campo de cor e deixar o resto da página vazio ao redor dela.
- **Do** respeitar `prefers-reduced-motion`: sem cortina, sem deslizes, tudo visível e parado.
- **Do** escapar todo texto vindo do banco antes de virar HTML e aceitar só imagens de `img/` ou do Storage do projeto.

### Don't:
- **Don't** usar branco puro (#FFFFFF), texto branco sobre coral, nem coral em texto pequeno sobre claro.
- **Don't** criar halo, brilho colorido ou sombra em cartão em repouso.
- **Don't** usar degradê entre seções, texto com degradê, vidro decorativo ou ícones de emoji.
- **Don't** aninhar cartão em cartão, usar borda lateral grossa colorida ou números de seção.
- **Don't** trocar de página sem a cortina, nem usar easing com quique.
- **Don't** colocar a Antonio em títulos de seção, botões ou texto corrido.
- **Don't** criar uma rolagem interna numa seção: a rolagem da página é a única.
- **Don't** mostrar o quadrado azul de toque nem o contorno de foco no clique do mouse; manter o contorno só para teclado.
- **Don't** usar fotos de estoque genéricas: a peça tem que aparecer sozinha, bem recortada ou em estúdio quente.
