# Imagens Pendentes

Nenhuma fotografia final foi fornecida ainda. Todas as posições abaixo renderizam
hoje um **placeholder navy com o monograma** (`ImageFrame` sem `src`), que mantém o
layout correto — basta preencher o `src` para a imagem real assumir sem ajuste.

**Direção de arte** (design-system.md §6): fotografia editorial, tons frios e
dessaturados com predominância de azul-escuro, contraste alto, ambientes
corporativos e arquitetônicos. Sem imagens "de banco" genéricas ou coloridas demais.

**Nomenclatura** (padroes-de-projeto.md §5): `[pagina]-[secao]-[descricao].jpg`

---

## Imagens em arquivo (`public/images/`)

| Arquivo esperado | Onde aparece | Observação |
|---|---|---|
| ~~`home-hero-advogado-escadaria.jpg`~~ | Hero da homepage | **Fornecida:** `home-hero-recepcao-desktop.jpg` e `home-hero-recepcao-mobile.jpg` (recepção do escritório em cores naturais; recorte largo para desktop e recorte no logotipo e balcão para celular). |
| `home-institucional-escritorio.jpg` | Seção "Quem Somos" da home | **Fornecida** (sala de espera, 4:3). |
| `quem-somos-historia-equipe.jpg` | Página Quem Somos | **Fornecida** (foto da equipe, 3:4). |
| `estrutura-ambiente-recepcao.jpg` | Página Estrutura | **Fornecida** (recepção, 4:3). |
| ~~`cta-banner-colunas-classicas.jpg`~~ | Banner de CTA (todas as páginas) | **Fornecida:** `cta-banner-escritorio.jpg` (sala de espera, escurecida sob overlay navy). |
| Artes dos 7 cards de Áreas da home | Home → Áreas de Atuação | **Fornecidas:** `home-areas-<slug>.jpg` (4:3), associadas a cada área pelo campo `image` em `site-config.ts`. |

Para usar: coloque o arquivo em `public/images/` e passe `src="/images/nome.jpg"`
no `ImageFrame` correspondente.

---

## Imagens no banco (Supabase Storage)

Estas não vão para `public/` — são conteúdo editável pelo escritório e ficam no
Storage, com a URL pública gravada na coluna indicada.

| Conteúdo | Tabela / coluna | Quantidade | Requisito |
|---|---|---|---|
| Retratos da equipe | `team_members.photo_url` | 6 | **Enquadramento padronizado**: busto, fundo neutro/escuro, mesma iluminação e proporção 1:1 para todos (design-system.md §6). Um retrato fora do padrão quebra a grade inteira. |
| Capas de artigos | `articles.cover_image_url` | 6 | Proporção 16:9. |
| Imagens das áreas | `practice_areas.image_url` | 8 | Proporção 4:3. Só usada na variante com imagem (cards da home). |

---

## Antes de publicar

- [ ] Todas as imagens comprimidas (WebP/AVIF são gerados automaticamente pelo Next).
- [ ] Todo `alt` revisado: descritivo nas informativas, `alt=""` nas decorativas.
- [ ] Retratos da equipe conferidos lado a lado, para garantir consistência de
      enquadramento e cor.
- [ ] Direitos de uso das fotografias confirmados.
