# Padrões de Projeto — Gonçalo & Gonçalo Advogados Associados

Guia de padrões estruturais, de componentes e de qualidade para a construção e manutenção do site, complementar ao `design-system.md` (visual) e ao `prd.md` (requisitos de produto).

---

## 1. Princípios de Design

1. **Consistência antes de originalidade** — todo novo elemento deve reutilizar tokens e componentes já definidos no Design System antes de propor algo novo.
2. **Hierarquia clara** — cada página tem um único objetivo primário (ex.: Formulário → converter; Artigos → educar) e a interface deve guiar o usuário até ele.
3. **Sobriedade visual** — a marca é boutique/tradicional; evitar excesso de cor, animação ou densidade de informação.
4. **Conteúdo administrável** — páginas de conteúdo dinâmico (Artigos, FAQ, Equipe) devem ser estruturadas como templates reutilizáveis, nunca como páginas únicas "hard-coded".

---

## 2. Estrutura Padrão de Página

Toda página interna (01 a 11) segue o mesmo esqueleto:

```
[Header global fixo]
[Bloco de título da página — eyebrow + H1 + (opcional) subtítulo]
[Conteúdo principal da página — 1 a N seções, conforme o template]
[CTA de contato ou navegação relacionada, quando aplicável]
[Footer global — página 12]
```

- **Header e Footer são componentes globais**: qualquer alteração neles deve ser propagada para todas as páginas (single source of truth — componente compartilhado, não cópia por página).
- Toda página deve conter ao menos um ponto de conversão (CTA para Formulário ou WhatsApp), mesmo que discreto no rodapé da seção.

---

## 3. Padrões de Componentes

### 3.1 Hero (uso: apenas Homepage)
- Estrutura: eyebrow/tag lateral opcional + H1 + subheadline + CTA primário + tags de posicionamento.
- Imagem de fundo ou lateral em alta resolução, sempre com overlay navy quando o texto estiver sobre a imagem.
- Não reutilizar o hero completo em páginas internas — páginas internas usam o "Bloco de Título de Página" (3.2), mais compacto.

### 3.2 Bloco de Título de Página (uso: páginas 01–11)
- Eyebrow (rótulo curto, caixa alta, dourado) + H1 (nome da página) + parágrafo de apoio opcional.
- Altura reduzida em relação ao hero da home — não deve competir com ele.

### 3.3 Card de Área de Atuação
Campos: `imagem`, `título`, `descrição curta (1–2 linhas)`, `link (seta →)`.
Usado em: Home (4 áreas de destaque) e Página 06 (grade de 6 áreas com variante de ícone no lugar de imagem).
Regra: título sempre no formato "Direito [Especialidade]"; descrição sempre em uma frase de benefício, não de definição jurídica.

### 3.4 Card de Artigo
Campos: `imagem`, `categoria` (Artigo/Notícia), `título`, `data (dd mmm aaaa)`.
Usado em: Home (3 artigos recentes) e Página 07 (listagem completa).
Regra: data sempre no mesmo formato e posição (abaixo do título); ordenar por mais recente primeiro.

### 3.5 Card de Membro da Equipe
Campos: `foto (proporção 1:1, mesmo enquadramento)`, `nome completo`, `cargo`.
Usado em: Página 02.
Regra: sócios listados antes de associados; ordenação secundária alfabética.

### 3.6 Card de Ícone (Valores / Diferenciais / Infraestrutura)
Campos: `ícone`, `título curto (2–4 palavras)`, `descrição (1 linha)`.
Variantes: fundo navy (faixa de valores da Home, faixa final de diferenciais) e fundo claro (Estrutura do Escritório, Demais Áreas).
Regra: nunca misturar mais de 6 cards por grade; acima disso, paginar ou agrupar.

### 3.7 Card de Estatística
Campos: `número/percentual em destaque`, `rótulo curto`.
Usado em: Página 01 (Quem Somos).
Regra: números sempre com "+" quando forem mínimos aproximados (ex.: "+20", "+500").

### 3.8 Accordion (Perguntas Frequentes)
- Um item por pergunta; resposta oculta por padrão, expandida ao clique.
- Apenas um item aberto por vez é recomendado (comportamento padrão), mas não obrigatório.
- Ícone de estado (+/–- ou chevron) sempre alinhado à direita da pergunta.
- Usado em: Home (bloco lateral resumido, 4 perguntas) e Página 08 (lista completa).

### 3.9 Formulário de Contato
- Ordem fixa de campos: Nome completo → E-mail → Telefone → Empresa (opcional) → Mensagem.
- Campos opcionais sempre sinalizados explicitamente ("(opcional)").
- Botão de envio com verbo de ação ("Enviar Mensagem"), nunca genérico ("Enviar" / "Submit").
- Estados obrigatórios: vazio, preenchendo, erro de validação, sucesso de envio.

### 3.10 Bloco WhatsApp + Localização
- Botão de WhatsApp sempre com ícone reconhecível da marca WhatsApp + rótulo de ação ("Abrir no WhatsApp").
- Mapa e endereço sempre lado a lado (desktop) ou empilhados endereço→mapa (mobile).

### 3.11 Banner de CTA Institucional
- Usado uma única vez por página, tipicamente antes do footer.
- Estrutura: título de impacto + parágrafo curto + botão primário (esquerda/centro) + bloco de contato direto (direita), sobre imagem com overlay navy.

### 3.12 Abas (Políticas / Privacidade / Cookies / Termos)
- Três abas fixas nesta ordem: Política de Privacidade, Cookies, Termos de Uso.
- Conteúdo carregado sem reload de página (client-side tab switch).

---

## 4. Padrões de Navegação

- **Menu principal fixo:** Início, Quem Somos, Áreas de Atuação (dropdown), Nosso Time, Conteúdo Jurídico, Contato — nesta ordem, em todas as páginas.
- **Dropdown "Áreas de Atuação":** deve listar Direito Empresarial, Direito Civil e as 6 áreas da página "Demais Áreas", cada uma linkando diretamente à respectiva página/seção.
- **Migalhas (breadcrumbs):** recomendado nas páginas de área de atuação e artigos individuais (ex.: Início / Áreas de Atuação / Direito Empresarial), não presente no mockup mas recomendado para SEO e orientação do usuário.
- **Links "Ver todos/todas":** sempre no canto superior direito da seção correspondente, estilo texto + seta (`→`), nunca como botão sólido.

---

## 5. Padrões de Conteúdo

| Elemento | Regra |
|---|---|
| Títulos de página (H1) | Sempre em Português, sem abreviações; refletir exatamente o item do menu/sitemap |
| Eyebrows/rótulos | Caixa alta, curtos (máx. 3 palavras) |
| Descrições de card | 1–2 linhas, tom consultivo (benefício ao cliente, não jargão jurídico) |
| Datas | Formato `dd mmm aaaa` (ex.: "20 mai 2024") |
| Nomenclatura de imagens | `[pagina]-[secao]-[descricao].jpg` (ex.: `home-hero-advogado-escadaria.jpg`) |
| Alt text | Sempre descritivo do conteúdo real da imagem, nunca vazio em imagens informativas |

---

## 6. Padrões Responsivos

| Componente | Desktop | Mobile |
|---|---|---|
| Menu principal | Horizontal, todos os itens visíveis | Menu hambúrguer com overlay |
| Grade de Áreas de Atuação | 3–4 colunas | 1 coluna, scroll vertical |
| Grade de Equipe | 3 colunas | 1–2 colunas |
| Hero | Texto + imagem lado a lado ou imagem full-bleed com texto sobreposto | Empilhado, imagem acima ou como fundo, texto abaixo/centralizado |
| Banner de CTA + contato | Duas colunas (CTA / contato) | Empilhado, CTA primeiro |
| Footer | 4 colunas + faixa social | Acordeão ou empilhado por seção |

---

## 7. Padrões de Acessibilidade

- Todo componente interativo (accordion, dropdown, tabs, formulário) deve ser operável via teclado (Tab/Enter/Espaço) e compatível com leitores de tela (uso correto de `aria-expanded`, `aria-controls`, `role="tablist"` nas abas de Políticas).
- Ordem de foco deve seguir a ordem visual lógica de cada página.
- Nunca comunicar informação apenas por cor (ex.: campo de erro no formulário deve ter ícone/texto, não apenas borda vermelha).

---

## 8. Padrões de SEO On-Page

| Item | Regra |
|---|---|
| `<title>` | `[Nome da Página] | Gonçalo & Gonçalo Advogados Associados` |
| Meta description | 140–160 caracteres, orientada a benefício/ação |
| URL | Minúsculas, com hífen, sem acentos (ex.: `/areas-de-atuacao/direito-empresarial`) |
| Dados estruturados | `Organization`/`LegalService` na home; `Article` nas páginas de artigo; `FAQPage` na página de Perguntas Frequentes |
| Hierarquia de headings | Um único `H1` por página; `H2`/`H3` seguindo a ordem visual das seções |

---

## 9. Convenções de Nomenclatura de Componentes (para handoff a desenvolvimento)

Sugestão de nomenclatura em `PascalCase` para componentes reutilizáveis, mantendo rastreabilidade com este documento:

```
Header
Footer
HeroSection
PageTitleBlock
PracticeAreaCard
ArticleCard
TeamMemberCard
IconFeatureCard
StatCard
FaqAccordion
ContactForm
WhatsAppLocationBlock
CtaBanner
LegalTabs
```

---

## 10. Checklist de Qualidade Antes de Publicar uma Página Nova

- [ ] Página segue a estrutura padrão (seção 2)?
- [ ] Todos os componentes usados existem no Design System (nenhum estilo "único" criado)?
- [ ] Header e Footer são as instâncias globais atualizadas (não cópias desatualizadas)?
- [ ] Contraste de cor validado (texto sobre navy e sobre creme)?
- [ ] Todas as imagens têm `alt` adequado e estão otimizadas/comprimidas?
- [ ] Há pelo menos um CTA de conversão visível?
- [ ] Título, meta description e URL seguem o padrão de SEO (seção 8)?
- [ ] Testado em mobile, tablet e desktop?
- [ ] Testado com navegação por teclado?
- [ ] Textos revisados (sem placeholder do tipo "Lorem ipsum" ou nomes fictícios da equipe)?
