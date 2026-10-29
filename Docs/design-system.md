# Design System — Gonçalo & Gonçalo Advogados Associados

**Modelo:** Unificado — Boutique Premium Contemporâneo
**Posicionamento:** "Mais que Direito. Resultados Duradouros."
**Conceito visual:** Exclusividade, tradição, sofisticação e clareza de navegação em um só conceito.

> Este documento descreve o sistema de design extraído do mockup de referência do site institucional. Os valores de cor são estimativas visuais fiéis ao mockup; recomenda-se validá-los com os arquivos-fonte (Figma/PSD) ou o manual de marca oficial antes da implementação em produção.

---

## 1. Essência da Marca

| Atributo | Descrição |
|---|---|
| Personalidade | Tradicional, sóbria, boutique, confiável, estratégica |
| Tom de voz visual | Elegante e discreto — luxo silencioso ("quiet luxury"), nunca ostentoso |
| Diferenciais comunicados | Design sofisticado, experiência consolidada, navegação intuitiva, foco em resultados |
| Referências visuais | Arquitetura clássica (colunas, mármore), advocacia tradicional, escritórios contemporâneos |

---

## 2. Paleta de Cores

### 2.1 Cores primárias

| Token | Uso | Hex (aprox.) | Amostra |
|---|---|---|---|
| `color-primary-900` (Azul-marinho profundo) | Fundo principal (header, hero, footer, faixas institucionais) | `#0B1E33` | ██ |
| `color-primary-800` | Variação de fundo em seções escuras (cards sobre navy) | `#122A45` | ██ |
| `color-gold-500` (Dourado/mostarda) | Cor de destaque: CTAs secundários, ícones, linhas divisórias, títulos de apoio, hover | `#C9A227` | ██ |
| `color-gold-300` | Dourado claro para textos de apoio sobre fundo escuro ("TRADIÇÃO • ESTRATÉGIA...") | `#D8BE6E` | ██ |

### 2.2 Cores neutras

| Token | Uso | Hex (aprox.) | Amostra |
|---|---|---|---|
| `color-white` | Fundos claros, texto sobre navy | `#FFFFFF` | ██ |
| `color-cream-100` (Off-white/creme) | Fundo de seções claras, cards, formulários | `#F8F5EF` | ██ |
| `color-neutral-700` | Texto de corpo sobre fundo claro | `#4A4A4A` | ██ |
| `color-neutral-500` | Texto secundário, legendas, datas | `#7A7A7A` | ██ |
| `color-border-light` | Bordas e divisores sobre fundo claro | `#E4E0D6` | ██ |

### 2.3 Regras de uso

- **Navy** é a cor dominante estrutural: usada em header, hero, faixa de valores, CTA banner final e footer — cria o "envelope" de marca em todo o site.
- **Dourado** é usado com moderação, sempre como *accent*: linha sob títulos, ícones de destaque, botões primários, hover de links, bullets. Nunca como cor de fundo em grandes áreas.
- **Creme/off-white** substitui o branco puro nas seções de conteúdo (áreas de atuação, artigos, FAQ) para manter a sensação premium e evitar contraste "frio".
- Contraste mínimo texto/fundo deve respeitar **WCAG AA** (4.5:1 para texto normal, 3:1 para texto grande/ícones).

---

## 3. Tipografia

| Papel | Estilo | Sugestão de família tipográfica | Peso | Uso |
|---|---|---|---|---|
| Display / Headline (H1 hero) | Serifada, elegante, caixa alta | Playfair Display / Cormorant Garamond | 500–600 | "SOLUÇÕES JURÍDICAS COM ESTRATÉGIA, ÉTICA E RESULTADOS." |
| Heading (H2–H3) | Serifada ou sans elegante | Playfair Display (ou Marcellus) | 500 | Títulos de seção: "Quem Somos", "Nossa Equipe" |
| Subheading / Eyebrow | Sans-serif, caixa alta, tracking largo | Inter / Lato, letter-spacing +0.1em | 500 | "ÁREAS DE ATUAÇÃO", "CONTEÚDO JURÍDICO" |
| Corpo de texto | Sans-serif, alta legibilidade | Inter / Lato / Source Sans 3 | 400 | Parágrafos, descrições |
| Botões / CTA | Sans-serif, caixa alta ou título | Inter | 600 | "Fale com um especialista", "Enviar Mensagem" |
| Dados/Números (stats) | Serifada ou sans, destaque | Playfair Display / Inter | 600–700 | "+20", "+500", "98%" |

### Escala tipográfica sugerida (base 16px)

| Nível | Tamanho | Uso |
|---|---|---|
| Display | 48–64px | H1 da hero |
| H2 | 32–40px | Títulos de seção |
| H3 | 22–26px | Subtítulos, títulos de card |
| Body Large | 18px | Lead/intro de seção |
| Body | 16px | Texto corrido |
| Small | 13–14px | Legendas, datas, metadados |
| Eyebrow/Label | 12–13px | Rótulos em caixa alta |

---

## 4. Grid, Espaçamento e Breakpoints

### Grid
- Container máximo: **1280px**, com margens laterais de 24px (mobile) a 80px (desktop).
- Grid de 12 colunas em desktop; 4 colunas em mobile.
- Cards de "Áreas de Atuação" e "Artigos": grid de 3–4 colunas em desktop, 1 coluna em mobile.
- Grid de equipe (página 02): 3 colunas × 2 linhas em desktop, 2 colunas em tablet, 1 em mobile.

### Espaçamento (escala em múltiplos de 4/8px)
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

- Espaçamento entre seções principais: 96–128px (desktop) / 48–64px (mobile).
- Espaçamento interno de cards: 24–32px.
- Gutter entre colunas do grid: 24–32px.

### Breakpoints

| Nome | Largura |
|---|---|
| Mobile | até 599px |
| Tablet | 600–1023px |
| Desktop | 1024–1439px |
| Desktop XL | ≥1440px |

---

## 5. Iconografia

- Estilo **line icon** (traço fino, 1.5–2px), monocromático em dourado ou branco conforme o fundo.
- Usados em: faixa de valores (diamante, pessoas, alvo, balança), áreas de atuação (ícones temáticos por especialidade), diferenciais do rodapé, cards de estrutura do escritório.
- Tamanho padrão: 32–40px em contextos de destaque, 20–24px em listas/FAQ.
- Ícones de redes sociais (LinkedIn, Instagram, YouTube) em contorno simples no footer.

---

## 6. Fotografia e Imagens

- **Tom:** fotografia editorial, tons frios/dessaturados com predominância de azul-escuro, contraste alto, ambientes corporativos e arquitetônicos (colunas clássicas, skyline, escritórios modernos).
- **Temas recorrentes:** figura profissional em movimento (hero), interiores de escritório sofisticados, arquitetura clássica (colunas, mármore, estátua da Justiça), retratos de equipe em fundo neutro/escuro.
- **Tratamento:** leve overlay/gradiente navy sobre imagens de fundo em seções escuras para garantir legibilidade do texto sobreposto.
- **Retratos de equipe:** enquadramento padronizado (busto, fundo neutro), mesma iluminação e proporção para todos os membros.

---

## 7. Componentes de UI

### 7.1 Header / Navegação
- Logo à esquerda (monograma "G" + nome por extenso).
- Menu horizontal centralizado/à direita: Início, Quem Somos, Áreas de Atuação (dropdown), Nosso Time, Conteúdo Jurídico, Contato.
- Ícone de busca.
- Botão CTA primário destacado (dourado ou contornado): "Fale Conosco".
- Fundo navy sólido, fixo/sticky ao rolar (recomendado).

### 7.2 Botões
| Variante | Fundo | Texto | Uso |
|---|---|---|---|
| Primário | Dourado sólido | Navy escuro | CTAs principais ("Fale com um especialista") |
| Secundário/Outline | Transparente, borda branca ou dourada | Branco/Dourado | CTAs sobre imagem/hero |
| Texto com seta | Transparente | Dourado, com `→` | Links "Ver todas as áreas", "Ver todos os artigos" |

Estados: default, hover (leve escurecimento/realce dourado), focus (outline visível), disabled (opacidade reduzida).

### 7.3 Cards
- **Card de Área de Atuação:** imagem de topo, título, descrição curta, seta/link. Fundo claro.
- **Card de Artigo:** imagem, categoria/etiqueta ("ARTIGO"/"NOTÍCIA"), título, data.
- **Card de Equipe:** foto retrato, nome, cargo.
- **Card de Ícone (diferenciais/valores):** ícone dourado, título curto, descrição de 1 linha — usado tanto em fundo navy (faixa de valores) quanto em fundo claro (estrutura do escritório, demais áreas).
- **Card de Estatística:** número grande em destaque + rótulo abaixo (usado em "Quem Somos").

### 7.4 Accordion (FAQ)
- Lista vertical, cada item com pergunta + ícone de expandir (chevron/+), fundo claro, borda inferior sutil separando itens.
- CTA final "Ver todas as perguntas".

### 7.5 Formulário
- Campos com rótulo interno/flutuante, fundo branco, borda fina neutra, cantos levemente arredondados.
- Campos: Nome completo, E-mail, Telefone, Empresa (opcional), Mensagem (textarea).
- Botão de envio full-width ou alinhado à direita, estilo primário dourado.

### 7.6 Banner de CTA institucional
- Fundo navy com imagem arquitetônica (colunas) e overlay.
- Título de impacto + parágrafo curto + botão primário à esquerda; bloco de contato (telefone, e-mail, endereço) à direita.

### 7.7 Footer
- Fundo navy. Logo + tagline à esquerda.
- Colunas de links: Navegação, Áreas de Atuação, Conteúdo, Contato.
- Ícones sociais.
- Linha inferior: copyright + links legais (Políticas, Privacidade, Cookies, Termos).

### 7.8 Mapa/Localização e WhatsApp
- Bloco com botão de ação direta "Abrir no WhatsApp" (verde ou dourado conforme padrão de marca) e mapa embutido ao lado do endereço.

---

## 8. Elevação, Bordas e Sombras

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 4px | Inputs, badges |
| `radius-md` | 8px | Cards, botões |
| `radius-lg` | 16px | Imagens de destaque, blocos de mapa |
| `shadow-card` | `0 4px 16px rgba(11,30,51,0.08)` | Cards sobre fundo claro |
| `shadow-elevated` | `0 8px 32px rgba(11,30,51,0.16)` | Modais, dropdowns |

---

## 9. Motion & Interação

- Transições suaves de 150–250ms (ease-out) em hover de botões, links e cards.
- Accordion do FAQ com expansão animada (altura auto, 200–300ms).
- Dropdown do menu "Áreas de Atuação" com fade + slide sutil.
- Scroll reveal discreto (fade-up) em seções de conteúdo — usar com moderação para manter a sobriedade da marca.
- Evitar animações chamativas ou bounce: a marca pede sobriedade.

---

## 10. Acessibilidade

- Contraste mínimo AA em todas as combinações texto/fundo, especialmente dourado sobre navy (validar; dourado escuro pode exigir peso maior ou tamanho maior de fonte).
- Todos os ícones informativos devem ter texto alternativo ou `aria-label`.
- Foco de teclado visível em todos os elementos interativos (menu, accordion, formulário, botões).
- Formulário com labels associados corretamente e mensagens de erro anunciadas por leitores de tela.
- Vídeo/imagens decorativas com `alt=""`; imagens de conteúdo (equipe, escritório) com `alt` descritivo.

---

## 11. Diretrizes de Uso (Do's and Don'ts)

**Fazer:**
- Manter grandes áreas de respiro (whitespace) entre seções.
- Usar o dourado como "assinatura" pontual, não como cor de massa.
- Manter fotografia consistente em tom e tratamento de cor.

**Evitar:**
- Múltiplas cores de destaque concorrendo com o dourado.
- Textos longos em caixa alta (prejudica legibilidade) — reservar caixa alta para eyebrows/rótulos curtos.
- Ícones ou ilustrações com estilo "cartoon"/colorido, destoante do tom boutique/sério da marca.
