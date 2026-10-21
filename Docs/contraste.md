# Contraste de Cor — Validação WCAG 2.1 AA

Complementa [design-system.md](design-system.md) §2 e §10. O PRD exige conformidade
mínima com **WCAG 2.1 nível AA**, e o próprio design system pede que os valores de
cor sejam validados antes da implementação. Este documento registra essa validação
e os **dois tokens que precisaram ser criados** para atendê-la.

Razões calculadas pela fórmula de luminância relativa da WCAG 2.1
(`(L1 + 0,05) / (L2 + 0,05)`). Limiares: **4,5:1** para texto normal, **3:1** para
texto grande (≥18,66px em negrito ou ≥24px) e para componentes de interface.

---

## 1. Combinações do design system original

| Texto | Fundo | Razão | Texto normal | Texto grande |
|---|---|---|---|---|
| `gold-500` `#C9A227` | `primary-900` `#0B1E33` | **6,96:1** | ✅ passa (AAA) | ✅ passa |
| `gold-300` `#D8BE6E` | `primary-900` `#0B1E33` | **9,84:1** | ✅ passa (AAA) | ✅ passa |
| `white` `#FFFFFF` | `primary-900` `#0B1E33` | **16,7:1** | ✅ passa (AAA) | ✅ passa |
| `neutral-700` `#4A4A4A` | `cream-100` `#F8F5EF` | **8,15:1** | ✅ passa (AAA) | ✅ passa |
| `primary-900` `#0B1E33` | `cream-100` `#F8F5EF` | **16,1:1** | ✅ passa (AAA) | ✅ passa |
| `primary-900` `#0B1E33` | `gold-500` `#C9A227` | **6,96:1** | ✅ passa (AAA) | ✅ passa |
| **`gold-500` `#C9A227`** | **`cream-100` `#F8F5EF`** | **2,22:1** | ❌ **reprova** | ❌ **reprova** |
| **`neutral-500` `#7A7A7A`** | **`cream-100` `#F8F5EF`** | **3,95:1** | ❌ **reprova** | ✅ passa |

---

## 2. Os dois problemas

### 2.1 Dourado sobre fundo claro — 2,22:1

O design system usa dourado como cor de destaque em eyebrows (`"ÁREAS DE ATUAÇÃO"`)
e nos links `"Ver todas as áreas →"`, que aparecem **sobre creme**. Nessa combinação
o `#C9A227` reprova por larga margem — não passa nem no limiar de texto grande.

Não é um caso de arredondamento: seriam necessários 4,5:1 e há 2,22:1.

### 2.2 Cinza secundário sobre fundo claro — 3,95:1

O `neutral-500` está especificado para *"texto secundário, legendas, datas"*, que
a escala tipográfica coloca em **13–14px** — ou seja, texto normal, sujeito ao
limiar de 4,5:1. Passa apenas se usado em tamanho grande, o que contraria a
finalidade declarada do token.

---

## 3. Tokens criados

Ambos definidos em `src/app/globals.css`:

| Token | Valor | Sobre creme | Sobre branco | Uso |
|---|---|---|---|---|
| `--color-gold-700` | `#856814` | **4,84:1** ✅ | 5,27:1 ✅ | Texto dourado sobre fundo claro |
| `--color-neutral-600` | `#6B6B6B` | **4,90:1** ✅ | 5,33:1 ✅ | Texto secundário, legendas, datas |

---

## 4. Regras de uso resultantes

**`gold-500` `#C9A227`**
- ✅ Texto sobre navy (header, hero, footer, banners, faixa de valores).
- ✅ Fundo de botão primário com texto navy.
- ✅ Elementos **não textuais** sobre fundo claro: linhas divisórias sob títulos,
  bordas, marcadores de lista, ícones decorativos acompanhados de rótulo.
- ❌ **Nunca** como cor de texto sobre creme ou branco — use `gold-700`.

**`neutral-500` `#7A7A7A`**
- ✅ Texto ≥24px, placeholders e elementos decorativos.
- ❌ Legendas, datas e metadados em 13–14px — use `neutral-600`.

**`gold-300` `#D8BE6E`**
- ✅ Apenas sobre navy, como já previsto no design system.

---

## 5. Pendências

- [ ] Confirmar os valores de cor contra o Figma ou o manual de marca oficial —
      os hex do design system são declaradamente estimativas visuais do mockup.
- [ ] Comunicar a criação de `gold-700` e `neutral-600` a quem mantém o design
      system, para que voltem ao documento de origem.
- [ ] Revalidar todos os pares se a paleta mudar após a conferência com a marca.


---

## Paleta champanhe (outubro/2026)

A paleta foi trocada para um dourado champanhe/bronze, um navy mais profundo e um
off-white neutro. Valores em `src/app/globals.css`:

| Token | Antes | Agora |
|---|---|---|
| `primary-900` | `#0B1E33` | `#0A1526` |
| `gold-500` | `#C9A227` | `#C5A46D` |
| `gold-600` (novo, hover) | — | `#B8935A` |
| `gold-400` (substitui `gold-300`) | `#D8BE6E` | `#D4B98A` |
| `gold-700` (texto dourado sobre claro) | `#856814` | `#7C6237` |
| `cream-100` (fundo claro) | `#F8F5EF` | `#FAFAF8` |

| Texto | Fundo | Razão |
|---|---|---|
| gold-500 `#C5A46D` | primary-900 `#0A1526` | **7,76:1** |
| gold-400 `#D4B98A` | primary-900 | **9,67:1** |
| gold-600 `#B8935A` | primary-900 | **6,41:1** |
| white | primary-900 | **18,29:1** |
| primary-900 | gold-500 (botão preenchido) | **7,76:1** |
| primary-900 | gold-600 (hover do botão) | **6,41:1** |
| gold-700 `#7C6237` | cream-100 `#FAFAF8` | **5,49:1** |
| gold-700 | white | **5,74:1** |
| white | gold-700 (hover do botão sobre claro) | **5,74:1** |
| neutral-700 `#4A4A4A` | cream-100 | **8,48:1** |
| neutral-600 `#6B6B6B` | cream-100 | **5,10:1** |
| **gold-500** | **cream-100** | **2,26:1** |

Continua valendo a regra do item 4: **dourado claro (`gold-400/500/600`) só como
texto sobre navy**. Sobre fundo claro, texto dourado usa `gold-700`, que foi
reajustado para o mesmo tom bronze e passa AA com folga.
