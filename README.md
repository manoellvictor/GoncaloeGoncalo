# Site Institucional — Gonçalo & Gonçalo Advogados Associados

Site institucional construído a partir da documentação em [Docs/](Docs/):
[prd.md](Docs/prd.md) (requisitos), [design-system.md](Docs/design-system.md) (visual),
[padroes-de-projeto.md](Docs/padroes-de-projeto.md) (padrões de construção) e
[contraste.md](Docs/contraste.md) (validação WCAG).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase

---

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha as variáveis
npm run dev                  # http://localhost:3000
```

Outros comandos: `npm run build`, `npm run start`, `npm run lint`.

---

## Estrutura

```
src/
  app/                  Rotas (App Router) — uma pasta por página do sitemap
    contato/actions.ts  Server Action do formulário
    sitemap.ts          Sitemap dinâmico (inclui artigos e áreas do banco)
  components/
    layout/             Header, Footer, Logo, CookieBanner — instâncias globais
    sections/           HeroSection, PageTitleBlock, CtaBanner, WhatsAppLocationBlock
    cards/              PracticeAreaCard, ArticleCard, TeamMemberCard,
                        IconFeatureCard, StatCard
    ui/                 Button, ArrowLink, SectionHeading, FaqAccordion,
                        ContactForm, LegalTabs, ImageFrame, Icons
  lib/
    site-config.ts      Navegação, contato, áreas (fallback estático)
    seo.ts              Metadata por rota + construtores de JSON-LD
    format.ts           Datas no padrão `dd mmm aaaa`
    supabase/           Cliente, tipos gerados e consultas
```

Os nomes dos componentes seguem a seção 9 de
[padroes-de-projeto.md](Docs/padroes-de-projeto.md), preservando a rastreabilidade
entre documentação e código.

---

## Rotas

| Rota | PRD | Renderização |
|---|---|---|
| `/` | Homepage | Estática |
| `/quem-somos` · `/equipe` · `/estrutura` | 01–03 | Estática |
| `/areas-de-atuacao` | 06 | Estática |
| `/areas-de-atuacao/[slug]` | 04, 05 + 6 demais | SSG (8 páginas) |
| `/artigos` | 07 | Dinâmica (busca e paginação) |
| `/artigos/[slug]` | 07 | SSG |
| `/perguntas-frequentes` | 08 | Estática |
| `/contato` | 09 | Estática + Server Action |
| `/localizacao` | 10 | Estática |
| `/politicas` | 11 | Estática (abas client-side) |

O rodapé (página 12) é componente global em `app/layout.tsx`.

---

## Conteúdo editável (Supabase)

Projeto `ungjggbqrtxedbknuadd` (região `sa-east-1`). Artigos, FAQ, Equipe e Áreas
são editados pelo **Table Editor do painel do Supabase**, sem intervenção de
desenvolvimento — requisito do [prd.md](Docs/prd.md) §7.

| Tabela | Conteúdo |
|---|---|
| `practice_areas` | 8 áreas. `is_featured` marca as 4 da home. |
| `articles` | Artigos e notícias. `published_at` ordena a listagem. |
| `team_members` | `is_partner` põe sócios antes dos associados. |
| `faqs` | `is_featured` marca as 4 do bloco lateral da home. |
| `contact_submissions` | Leads do formulário. |

**Rascunhos:** `published = false` esconde o item do site sem apagá-lo.

**`meta_description`** (em `practice_areas` e `articles`): texto que aparece no
resultado do Google. Deve ter **140–160 caracteres** ([padroes-de-projeto.md](Docs/padroes-de-projeto.md) §8).
Deixando em branco, o site compõe um texto a partir da descrição curta ou do
excerpt e corta com segurança — mas o resultado tende a ficar fora da faixa
ideal, então prefira escrever. Em `npm run dev`, o console avisa toda página cuja
description estiver fora de 140–160.

### Segurança (RLS)

Row Level Security está ativo em todas as tabelas e foi verificado com a chave
pública:

- Conteúdo publicado: leitura anônima liberada; rascunhos invisíveis.
- `contact_submissions`: **inserção** anônima permitida apenas com
  `lgpd_consent = true`; **leitura** anônima negada — os leads contêm dados
  pessoais e só são acessíveis a usuários autenticados.

A aplicação usa exclusivamente a chave publicável. **Nunca use a `service_role`
no front-end** — ela ignora todas as políticas acima.

---

## Pendências antes de publicar

| Item | Onde |
|---|---|
| Fotografias | [public/images/PENDENTES.md](public/images/PENDENTES.md) |
| Dados reais de contato | `.env.local` — os atuais são fictícios ([prd.md](Docs/prd.md) §11) |
| Nomes e fotos reais da equipe | Tabela `team_members` — os atuais são placeholders |
| Textos institucionais e artigos finais | Fornecidos pelo escritório |
| Revisão jurídica de Políticas/Termos | `src/app/politicas/page.tsx` — minuta a aprovar |
| Serviço de e-mail transacional | `src/app/contato/actions.ts` — lead já persiste no banco |
| GA4 / gestor de tags | Carregar só após consentimento (`hasAnalyticsConsent()`) |
| Conferir paleta contra o manual de marca | [Docs/contraste.md](Docs/contraste.md) §5 |

Use o checklist da seção 10 de [padroes-de-projeto.md](Docs/padroes-de-projeto.md)
para validar cada página antes de publicar.
