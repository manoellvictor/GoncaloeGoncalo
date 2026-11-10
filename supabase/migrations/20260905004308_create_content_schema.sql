-- Schema de conteúdo do site Gonçalo & Gonçalo.
-- Atende ao prd.md §7: Artigos, FAQ e Equipe editáveis sem intervenção de dev.

-- Mantém updated_at coerente sem depender da aplicação.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------- practice_areas
create table public.practice_areas (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  short_description text not null,
  body              text,
  icon              text,
  image_url         text,
  services          text[] not null default '{}',
  is_featured       boolean not null default false,
  sort_order        integer not null default 0,
  published         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on column public.practice_areas.is_featured is
  'Marca as 4 áreas exibidas na homepage (prd.md §6.1).';
comment on column public.practice_areas.icon is
  'Chave do registro de ícones em src/components/ui/Icons.tsx, não um SVG.';

-- ---------------------------------------------------------------------- articles
create table public.articles (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text not null,
  content         text,
  cover_image_url text,
  category        text not null default 'artigo'
                    check (category in ('artigo', 'noticia')),
  published_at    timestamptz not null default now(),
  published       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ------------------------------------------------------------------ team_members
create table public.team_members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text not null,
  photo_url  text,
  bio        text,
  is_partner boolean not null default false,
  sort_order integer not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.team_members.is_partner is
  'Sócios listados antes de associados (padroes-de-projeto.md §3.5).';

-- -------------------------------------------------------------------------- faqs
create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  category    text,
  is_featured boolean not null default false,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on column public.faqs.is_featured is
  'Marca as 4 perguntas do bloco lateral da homepage (prd.md §6.1).';

-- ------------------------------------------------------------ contact_submissions
create table public.contact_submissions (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text not null,
  company      text,
  message      text not null,
  lgpd_consent boolean not null default false,
  status       text not null default 'novo'
                 check (status in ('novo', 'em_atendimento', 'concluido', 'descartado')),
  created_at   timestamptz not null default now()
);

comment on table public.contact_submissions is
  'Leads do formulário Fale Conosco. Contém dados pessoais: leitura anônima é
   proibida por RLS; consultar apenas autenticado ou via service role.';

-- ------------------------------------------------------------------------ triggers
create trigger practice_areas_set_updated_at before update on public.practice_areas
  for each row execute function public.set_updated_at();
create trigger articles_set_updated_at before update on public.articles
  for each row execute function public.set_updated_at();
create trigger team_members_set_updated_at before update on public.team_members
  for each row execute function public.set_updated_at();
create trigger faqs_set_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------------ índices
create index practice_areas_listing_idx
  on public.practice_areas (published, sort_order);
create index articles_listing_idx
  on public.articles (published, published_at desc);
create index team_members_listing_idx
  on public.team_members (published, is_partner desc, sort_order);
create index faqs_listing_idx
  on public.faqs (published, sort_order);
create index contact_submissions_created_idx
  on public.contact_submissions (created_at desc);
