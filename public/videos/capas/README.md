# Capas em vídeo das publicações

Clipes curtos que tocam, sem som e em repetição, atrás do título de cada
publicação em `/artigos` (destaque, cards e topo do artigo).

## Como gravar

- **Duração:** 4 a 6 segundos, pensando na repetição (o fim emenda no começo).
- **Formato:** horizontal (16:9 ou 16:10), no mínimo 1280 px de largura.
- **Enquadramento:** advogado(a) posicionado(a) **à direita**, com espaço livre
  **embaixo, à esquerda** — é onde entra o título da capa, em dourado.
- **Movimento:** discreto (um gesto, um olhar, folhear um processo). O vídeo é
  decorativo e fica sob uma camada azul-marinho a 50%.
- **Áudio:** não é usado; o script remove a trilha.

## Arquivos finais

| Arquivo        | Formato             | Limite   |
| -------------- | ------------------- | -------- |
| `<nome>.mp4`   | H.264, sem áudio    | ~1 MB    |
| `<nome>.webm`  | VP9, sem áudio      | opcional |
| `<nome>.jpg`   | primeiro quadro     | —        |

`<nome>` em minúsculas e com hífens, de preferência o tema
(`reforma-tributaria`).

## Conversão

Com o [ffmpeg](https://ffmpeg.org/download.html) instalado:

```bash
node scripts/capa-video.mjs bruto.mov reforma-tributaria --inicio 3 --duracao 5
```

O script corta o trecho, remove o áudio, redimensiona para 1280 px, comprime
(recomprimindo se passar de 1 MB) e gera o poster. No fim, mostra os três
caminhos para preencher na publicação, no Supabase (tabela `articles`):
`cover_video_mp4`, `cover_video_webm` e `cover_poster`.

## Como o site usa

- O vídeo só é baixado quando a capa aparece na tela, e pausa quando sai.
- Com "reduzir movimento" ativado no sistema, economia de dados ou conexão
  2G, aparece só o poster.
- O botão "Pausar vídeos" ao lado dos filtros pausa todas as capas e lembra a
  escolha.
- Sem vídeo, a publicação usa a capa tipográfica (azul-marinho, título em
  dourado) — nenhuma fica sem capa.
