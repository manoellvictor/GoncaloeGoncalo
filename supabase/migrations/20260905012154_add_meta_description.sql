-- Meta description é conteúdo editorial com uma faixa de tamanho rígida
-- (140–160 caracteres, padroes-de-projeto.md §8). Derivá-la de outro campo por
-- template faz o tamanho variar com o conteúdo e estourar a faixa, então ela
-- ganha coluna própria, editável pelo escritório como o restante do conteúdo.

alter table public.practice_areas add column meta_description text;
alter table public.articles       add column meta_description text;

comment on column public.practice_areas.meta_description is
  'Meta description da página. 140-160 caracteres (padroes-de-projeto.md §8).
   Nulo cai num texto derivado da descrição curta, truncado com segurança.';
comment on column public.articles.meta_description is
  'Meta description da página. 140-160 caracteres. Nulo usa o excerpt.';
