alter table public.articles
  drop constraint articles_category_check,
  add constraint articles_category_check
    check (category in ('artigo', 'noticia', 'video', 'leitura-rapida', 'carrossel')),
  add column area text
    references public.practice_areas (slug) on update cascade on delete set null,
  add column cover_title text,
  add column cover_video_mp4 text,
  add column cover_video_webm text,
  add column cover_poster text,
  add column author_id uuid
    references public.team_members (id) on delete set null,
  add column revised_at timestamptz,
  add column reading_minutes smallint check (reading_minutes > 0),
  add column sources jsonb not null default '[]'::jsonb
    check (jsonb_typeof(sources) = 'array'),
  add column key_points text[] not null default '{}',
  add column featured boolean not null default false;

comment on column public.articles.area is 'Slug da área de atuação (practice_areas.slug).';
comment on column public.articles.cover_title is 'Texto curto exibido sobre a capa (ex.: "Reforma tributária").';
comment on column public.articles.cover_video_mp4 is 'Clipe da capa em MP4 (caminho em /videos/capas ou URL).';
comment on column public.articles.cover_video_webm is 'Versão WebM opcional do clipe da capa.';
comment on column public.articles.cover_poster is 'Primeiro quadro do clipe (JPG/WebP); também é a imagem de Open Graph.';
comment on column public.articles.revised_at is 'Data editorial de atualização ("Atualizado em"), diferente de updated_at.';
comment on column public.articles.reading_minutes is 'Tempo de leitura informado; vazio = calculado a partir do texto.';
comment on column public.articles.sources is 'Lista de fontes: [{"titulo": "...", "url": "..."}].';
comment on column public.articles.key_points is 'Itens do bloco "Em resumo".';
comment on column public.articles.featured is 'Publicação em destaque no topo da listagem.';

create index articles_area_published_at_idx
  on public.articles (area, published_at desc) where published;
