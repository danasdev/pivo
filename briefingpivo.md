# PROMPT MASTER: E-COMMERCE PIVO - HOME INTERATIVA PREMIUM

## 📋 BRIEFING

**Cliente:** PIVÔ (Loja de Calçados - Bolsas, Anabelas, Papetes, Plataformas, Rasteiras, Salto Fino)
**Objetivo:** Criar homepage interativa, premium, focada em conversão (vendas)
**Estilo:** Minimalista de luxo, com animações 3D, design storytelling
**Público:** Mulheres que buscam calçados estilosos, trend-focused
**Slogan:** "SEU ESTILO TE MOVE"

---

## 🎨 IDENTIDADE VISUAL (PIVO)

### Paleta de Cores Primária
- **Fundo:** #0A0A0A (Preto absoluto)
- **Destaque Principal:** #E8714D (Coral/Laranja - logo, botões, CTA)
- **Secundária:** #D4AF37 (Dourado - accents, borders, premium details)
- **Texto Principal:** #FFFFFF (Branco)
- **Texto Secundário:** #B0B0B0 (Cinza claro - subtitles, descrições)

### Tipografia
- **Headlines:** Montserrat Bold (geometric, modern)
- **Body:** Poppins Regular (clean, readable)
- **Decorativo:** Italic serif para taglines (elegância)

### Elementos Visuais
- Logo PIVÔ com contorno dourado minimalista
- Ícone de sapato estilizado em flat design
- Bordas e separadores finos em dourado
- Gradientes preto → transparente em backgrounds

---

## 🏗️ ESTRUTURA DA HOMEPAGE

### SEÇÃO 1: HERO + 3D INTERACTIVE
**Objetivo:** Impacto imediato + engajamento

┌─────────────────────────────────────┐
│  NAVEGAÇÃO FIXA                     │
│  Logo PIVÔ | Menu | Busca | Cart   │
├─────────────────────────────────────┤
│                                     │
│      [MODELO 3D DO CALÇADO]         │
│      Rotatable com Mouse/Touch      │
│                                     │
│  "SEU ESTILO TE MOVE"               │
│   Descubra as novas coleções        │
│                                     │
│  [EXPLORAR AGORA]  [VER COLECAO] → │
│                                     │
└─────────────────────────────────────┘

**Detalhes Técnicos:**
- Hero com imagem full-width em background
- Modelo 3D (Three.js ou Spline) em destaque central
- Modelo rotatable ao passar mouse / arrastar mobile
- Animação de entrada: fade-in + slight zoom
- Gradient overlay preto → transparente (legibilidade)
- CTA buttons em coral com hover dourado

### SEÇÃO 2: COLEÇÕES (4 CARDS COM HOVER 3D)
**Objetivo:** Showcasing das categorias

┌────────────────────────────────────────┐
│  O RITUAL PIVO                         │
│  Cada estilo, uma história             │
├────────────────────────────────────────┤
│                                        │
│  [CARD 1]  [CARD 2]  [CARD 3] [CARD 4]│
│   (Hover:                              │
│    - Imagem zoom                       │
│    - Texto overlay fade-in             │
│    - Ícone 3D rotaciona)               │
│                                        │
│  BOLSAS  |  ANABELA  |  PAPETE        │
│  PLATAFORMA  |  RASTEIRA  |  SALTO    │
│                                        │
└────────────────────────────────────────┘

**Características:**
- 4 cards em grid responsivo
- Cada card com imagem de alta qualidade de sapato
- Efeito 3D ao hover: perspectiva + sombra dinâmica
- Título categoria em dourado
- Número de produtos em cinza claro
- Transição suave (0.3s ease-out)
- Mobile: 1 coluna com scroll horizontal

### SEÇÃO 3: ESSÊNCIA DO DESIGN
**Objetivo:** Storytelling (similar Amira)

┌────────────────────────────────────────┐
│                                        │
│  "Um estilo é uma assinatura.         │
│   A sua começa aqui."                 │
│                                        │
│  Cada peça da PIVÔ é cuidadosamente   │
│  selecionada para marcar seu passo     │
│  no mundo.                             │
│                                        │
│  [CONHECER PROCESSO]  →                │
│                                        │
│  [Imagem grande: modelo usando]       │
│                                        │
└────────────────────────────────────────┘

**Features:**
- Texto em white + italic
- Background alternado (branco → preto)
- Imagem parallax ao scroll
- Typography em tamanho grande (h1 + h2)
- CTA sutil em dourado

### SEÇÃO 4: PRODUTOS DESTACADOS (SLIDER COM SCROLL 3D)
**Objetivo:** Show best-sellers / novidades

┌────────────────────────────────────────┐
│  NOVAS CHEGADAS                        │
│  As tendências que você procura        │
├────────────────────────────────────────┤
│                                        │
│  ← [PRODUTO 1] [PRODUTO 2] [PRODUTO] →│
│                                        │
│  Smooth scroll horizontal              │
│  3D transform ao carregar              │
│  Hover: mostra especificações          │
│                                        │
└────────────────────────────────────────┘

**Cards de Produto:**
- Imagem em hover zoom (2.5x scale)
- Nome em branco, preço em dourado
- Badge "NOVO" ou "HOT" em coral
- Stock indicator discreto
- Quick add to cart (sem reload)
- Rating stars em dourado

### SEÇÃO 5: AVALIAÇÕES (TESTIMONIALS)
**Objetivo:** Social proof

┌────────────────────────────────────────┐
│  QUEM PASSOU PELO ESTILO               │
│  O que dizem sobre PIVÔ                │
├────────────────────────────────────────┤
│                                        │
│  ⭐⭐⭐⭐⭐                                 │
│  "Impecável! Estilo e qualidade..."   │
│  — Beatriz S. | Outubro 2026          │
│                                        │
│  [Carousel com avatares circulares]   │
│                                        │
└────────────────────────────────────────┘

**Features:**
- Avatar circular com inicial/foto
- Stars em dourado
- Quote em italic white
- Nome + data em cinza claro
- Auto-scroll carousel
- Manual buttons em coral

### SEÇÃO 6: CTA FINAL (CALL-TO-ACTION)
**Objetivo:** Conversão

┌────────────────────────────────────────┐
│                                        │
│   PRONTO PARA ENCONTRAR SEU ESTILO?   │
│                                        │
│   [EXPLORAR CATALOGO COMPLETO]         │
│                                        │
│   ou fale com a gente via WhatsApp →  │
│                                        │
└────────────────────────────────────────┘

---

## 🎬 ANIMAÇÕES & INTERAÇÕES

### Scroll-triggered
- Fade-in ao scroll (elementos entram com opacidade 0 → 1)
- Parallax em imagens (Y: -20px)
- Counter de números (0 → valor) ao aparecer
- Slide-in lateral (direita → esquerda)

### Hover Effects
- Botões: background coral → dourado, color white
- Links: underline dourado
- Cards: scale 1.05 + shadow aumento
- Imagens: brightness(1.1) + hue-rotation sutil

### 3D & WebGL
- Modelo 3D rotatable do calçado (hero)
- Transform perspective nos cards
- Reflection subtil embaixo de produtos
- Lighting dinâmica ao hover

### Page Load
- Skeleton loaders em cinza
- Fade-in staggered (delay progressivo)
- Logo animation: scale + rotate suave

---

## 📱 RESPONSIVIDADE

### Desktop (1200px+)
- 4 colunas na grid de coleções
- Hero com 80vh
- Modelo 3D grande
- Sidebar com filtros

### Tablet (768px - 1199px)
- 2 colunas na grid
- Hero com 60vh
- Navegação colapsada em hamburger
- Modelo 3D redimensionado

### Mobile (< 768px)
- 1 coluna
- Hero com 50vh
- Navegação bottom bar
- Slider horizontal para produtos
- Touch-friendly targets (48px min)
- Modelo 3D em portrait (responsivo)

---

## 🚀 TECH STACK RECOMENDADO

### Frontend
- **Framework:** React/Next.js (SSR para SEO)
- **Styling:** Tailwind CSS + CSS Modules
- **3D Graphics:** Three.js + Spline (modelos pre-feitos)
- **Animations:** Framer Motion / GSAP
- **State:** Zustand (cart, filters)

### Performance
- Image optimization (WebP, responsive sizes)
- Code splitting lazy loading
- Prefetching de próximas seções
- Service Worker para offline

### Integração
- E-commerce backend (Shopify / custom API)
- Payment: Stripe / PagSeguro
- Analytics: Google Analytics 4
- CRM: Integração com WhatsApp Business API

---

## 📊 MÉTRICAS DE CONVERSÃO

- CTR nos CTA buttons (meta: >3%)
- Tempo médio na página (meta: >2min)
- Taxa de adição ao carrinho
- Scroll depth
- Mobile vs Desktop performance

---

## 🎯 INSTRUÇÕES FINAIS PARA DESENVOLVIMENTO

1. **Fidelidade à marca:** Manter coral (#E8714D) como primary, dourado como secondary
2. **Premium feel:** Espaçamento generoso, tipografia grande, breathing room
3. **Performance first:** Lazy load imagens, defer JS não-crítico
4. **Mobile-first:** Começar design mobile, scale up
5. **Accessibility:** WCAG 2.1 AA, labels, alt text, keyboard navigation
6. **SEO:** Semantic HTML, meta tags, structured data (Product schema)
7. **A/B Testing:** Testar cores, copy, button placement
8. **User Testing:** Real customers validando UX antes do launch

---

## 📞 PRÓXIMOS PASSOS

1. Aprovação deste briefing com stakeholders
2. Mockups de alta fidelidade (Figma)
3. Prototipagem dos 3D models
4. Dev setup e component library
5. Content creation (fotos, copy, testimonials)
6. QA & Performance testing
7. Launch & monitoring
