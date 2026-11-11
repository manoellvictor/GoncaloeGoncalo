#!/usr/bin/env node
/**
 * Converte um vídeo bruto na capa de uma publicação (ver
 * public/videos/capas/README.md):
 *
 *   node scripts/capa-video.mjs <video-bruto> <nome> [--inicio 2] [--duracao 5]
 *
 * Gera em public/videos/capas/:
 *   <nome>.mp4   H.264, 1280px de largura, sem áudio, faststart
 *   <nome>.webm  VP9, sem áudio (opcional no site, menor nos navegadores que aceitam)
 *   <nome>.jpg   poster com o primeiro quadro do trecho
 *
 * Corta o trecho (--inicio em segundos, --duracao de 4 a 6), remove a trilha
 * de áudio e comprime; se o MP4 passar de ~1 MB, recomprime com mais força.
 *
 * Precisa do ffmpeg instalado (https://ffmpeg.org/download.html) — no PATH ou
 * indicado pela variável FFMPEG.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";

const LIMITE_BYTES = 1024 * 1024;
const LARGURA = 1280;
const ffmpeg = process.env.FFMPEG || "ffmpeg";

function sair(mensagem) {
  console.error(mensagem);
  process.exit(1);
}

const args = process.argv.slice(2);
const posicionais = [];
const opcoes = { inicio: "0", duracao: "5" };
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--inicio") opcoes.inicio = args[++i];
  else if (args[i] === "--duracao") opcoes.duracao = args[++i];
  else posicionais.push(args[i]);
}

const [entrada, nome] = posicionais;
if (!entrada || !nome) {
  sair("Uso: node scripts/capa-video.mjs <video-bruto> <nome> [--inicio 2] [--duracao 5]");
}
if (!existsSync(entrada)) sair(`Arquivo não encontrado: ${entrada}`);
if (!/^[a-z0-9-]+$/.test(nome)) {
  sair("Use um nome em minúsculas, sem acentos, com hífens (ex.: reforma-tributaria).");
}
const duracao = Number(opcoes.duracao);
if (!(duracao >= 4 && duracao <= 6)) sair("--duracao deve ficar entre 4 e 6 segundos.");

const pasta = path.join(process.cwd(), "public", "videos", "capas");
mkdirSync(pasta, { recursive: true });
const mp4 = path.join(pasta, `${nome}.mp4`);
const webm = path.join(pasta, `${nome}.webm`);
const poster = path.join(pasta, `${nome}.jpg`);

function rodar(parametros) {
  const resultado = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...parametros], {
    stdio: "inherit",
  });
  if (resultado.error) {
    sair(`Não foi possível executar o ffmpeg (${resultado.error.message}). Instale-o ou defina FFMPEG.`);
  }
  if (resultado.status !== 0) sair("O ffmpeg terminou com erro.");
}

// Corte + escala + 25 fps; `-an` remove o áudio.
const trecho = ["-ss", opcoes.inicio, "-t", String(duracao), "-i", entrada, "-an"];
const filtro = ["-vf", `scale=${LARGURA}:-2:flags=lanczos,fps=25`];

let crf = 26;
for (;;) {
  rodar([
    ...trecho,
    ...filtro,
    "-c:v", "libx264", "-preset", "slow", "-crf", String(crf),
    "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    mp4,
  ]);
  if (statSync(mp4).size <= LIMITE_BYTES || crf >= 34) break;
  crf += 2;
}

rodar([
  ...trecho,
  ...filtro,
  "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", String(crf + 12),
  "-row-mt", "1", "-deadline", "good",
  webm,
]);

// Poster: primeiro quadro do MP4 já cortado, igual ao que o vídeo mostra ao começar.
rodar(["-i", mp4, "-frames:v", "1", "-q:v", "3", poster]);

const kb = (arquivo) => `${Math.round(statSync(arquivo).size / 1024)} KB`;
console.log(`MP4  ${kb(mp4)}  (crf ${crf})`);
console.log(`WebM ${kb(webm)}`);
console.log(`JPG  ${kb(poster)}`);
if (statSync(mp4).size > LIMITE_BYTES) {
  console.warn("Atenção: o MP4 passou de 1 MB. Tente um trecho mais curto ou com menos movimento.");
}
console.log(`
No Supabase (tabela articles), preencha:
  cover_video_mp4  = /videos/capas/${nome}.mp4
  cover_video_webm = /videos/capas/${nome}.webm
  cover_poster     = /videos/capas/${nome}.jpg`);
