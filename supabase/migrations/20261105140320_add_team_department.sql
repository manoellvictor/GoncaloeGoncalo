alter table public.team_members
  add column department text not null default 'juridico'
  constraint team_members_department_check check (department in ('juridico', 'administrativo'));

comment on column public.team_members.department is
  'Setor exibido na página Nosso Time: juridico (sócios e advogados) ou administrativo.';
