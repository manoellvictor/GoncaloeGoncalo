alter table public.team_members
  add column practice text,
  add column interests text,
  add column publication text;

comment on column public.team_members.practice_areas is 'Linhas de resumo exibidas sobre a foto no card (hover/foco).';
comment on column public.team_members.practice is 'Texto da seção Atuação no painel de perfil.';
comment on column public.team_members.interests is 'Texto da seção Áreas de interesse (ex.: acadêmicos), sem caráter de especialização.';
comment on column public.team_members.publication is 'Título de publicação do integrante, exibido em bloco próprio no painel.';
