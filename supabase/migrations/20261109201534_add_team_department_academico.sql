alter table public.team_members
  drop constraint team_members_department_check,
  add constraint team_members_department_check
    check (department in ('juridico', 'administrativo', 'academico'));

comment on column public.team_members.department is
  'Setor exibido na página Nosso Time: juridico (sócios e advogados), academico (acadêmicos de Direito) ou administrativo.';
