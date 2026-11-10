alter table public.team_members
  add column full_name text,
  add column oab text,
  add column profile_title text,
  add column practice_areas text[] not null default '{}',
  add column education text[] not null default '{}',
  add column experience text;

comment on column public.team_members.full_name is 'Nome completo exibido no painel de perfil (o card usa name).';
comment on column public.team_members.oab is 'Inscrição na OAB, ex.: OAB/MA 22.437.';
comment on column public.team_members.profile_title is 'Título curto no painel, ex.: Advogada.';
comment on column public.team_members.practice_areas is 'Áreas de atuação; aparecem no card ao passar o mouse e no painel.';
comment on column public.team_members.education is 'Um item por formação, na ordem de exibição.';
comment on column public.team_members.experience is 'Texto de experiência; com ele preenchido o card ganha o painel "Conheça o perfil".';
