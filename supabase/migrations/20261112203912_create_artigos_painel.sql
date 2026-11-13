-- Painel /admin do Conteúdo Jurídico: conta única do escritório, tabela
-- artigos (nomes em português) e bucket de imagens.

-- 1. Conta do escritório ------------------------------------------------------
-- A conta única recebe app_metadata.escritorio = true (só o painel do Supabase
-- ou SQL alteram app_metadata; o próprio usuário não consegue). Toda escrita
-- passa por esta função, então uma conta criada por engano não ganha acesso.
create or replace function public.e_escritorio()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'escritorio')::boolean, false)
$$;

comment on function public.e_escritorio() is
  'Verdadeiro só para a conta do escritório (app_metadata.escritorio = true).';

-- 2. Fecha as regras que liberavam qualquer usuário logado ---------------------
alter policy "Equipe autenticada gerencia artigos" on public.articles
  using (public.e_escritorio()) with check (public.e_escritorio());
alter policy "Equipe autenticada gerencia FAQs" on public.faqs
  using (public.e_escritorio()) with check (public.e_escritorio());
alter policy "Equipe autenticada gerencia áreas" on public.practice_areas
  using (public.e_escritorio()) with check (public.e_escritorio());
alter policy "Equipe autenticada gerencia a equipe" on public.team_members
  using (public.e_escritorio()) with check (public.e_escritorio());
alter policy "Equipe autenticada lê os leads" on public.contact_submissions
  using (public.e_escritorio());
alter policy "Equipe autenticada atualiza o status do lead" on public.contact_submissions
  using (public.e_escritorio()) with check (public.e_escritorio());

-- 3. Tipos ---------------------------------------------------------------------
create type public.area_artigo as enum (
  'Tributário', 'Cível', 'Contratual', 'Empresarial',
  'Administrativo', 'Trabalhista', 'Agronegócio'
);
create type public.tipo_artigo as enum ('Artigo', 'Notícia');
create type public.status_artigo as enum ('rascunho', 'publicado');

-- 4. Tabela artigos --------------------------------------------------------------
create table public.artigos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null default '',
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  resumo text not null default ''
    check (char_length(resumo) <= 300),
  conteudo text not null default '',
  capa_url text,
  capa_alt text,
  area public.area_artigo,
  tipo public.tipo_artigo not null default 'Artigo',
  autor_nome text,
  status public.status_artigo not null default 'rascunho',
  destaque boolean not null default false,
  publicado_em timestamptz,
  video_instagram_url text
    check (video_instagram_url is null
      or video_instagram_url ~ '^https://(www\.)?instagram\.com/'),
  seo_titulo text,
  seo_descricao text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  -- Artigo publicado (ou agendado) sempre completo, mesmo que alguém grave
  -- direto no banco sem passar pelo painel.
  constraint artigos_publicado_completo check (
    status = 'rascunho' or (
      btrim(titulo) <> ''
      and btrim(resumo) <> ''
      and area is not null
      and nullif(btrim(autor_nome), '') is not null
      and capa_url is not null
      and nullif(btrim(capa_alt), '') is not null
      and btrim(conteudo) <> ''
      and publicado_em is not null
    )
  )
);

comment on table public.artigos is 'Artigos do Conteúdo Jurídico, escritos no painel /admin.';
comment on column public.artigos.publicado_em is 'Data de publicação; no futuro = agendado.';
comment on column public.artigos.destaque is 'Em destaque em /artigos; no máximo um por vez.';

-- No máximo um artigo em destaque.
create unique index artigos_um_destaque on public.artigos (destaque) where destaque;
create index artigos_publicados_idx on public.artigos (publicado_em desc)
  where status = 'publicado';

create function public.definir_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;
revoke execute on function public.definir_atualizado_em() from anon, authenticated, public;

create trigger artigos_atualizado_em
  before update on public.artigos
  for each row execute function public.definir_atualizado_em();

-- 5. Regras de acesso --------------------------------------------------------------
alter table public.artigos enable row level security;

create policy "Público lê artigos publicados" on public.artigos
  for select to anon, authenticated
  using (status = 'publicado' and publicado_em <= now());

create policy "Escritório lê todos os artigos" on public.artigos
  for select to authenticated using (public.e_escritorio());

create policy "Escritório cria artigos" on public.artigos
  for insert to authenticated with check (public.e_escritorio());

create policy "Escritório altera artigos" on public.artigos
  for update to authenticated
  using (public.e_escritorio()) with check (public.e_escritorio());

create policy "Escritório exclui artigos" on public.artigos
  for delete to authenticated using (public.e_escritorio());

-- 6. Imagens (capa e corpo) ----------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('artigos', 'artigos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create policy "Escritório envia imagens de artigos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'artigos' and public.e_escritorio());

create policy "Escritório altera imagens de artigos" on storage.objects
  for update to authenticated
  using (bucket_id = 'artigos' and public.e_escritorio())
  with check (bucket_id = 'artigos' and public.e_escritorio());

create policy "Escritório exclui imagens de artigos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'artigos' and public.e_escritorio());
