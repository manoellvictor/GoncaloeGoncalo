-- RLS em todas as tabelas. Sem política, o acesso é negado por padrão.

alter table public.practice_areas      enable row level security;
alter table public.articles            enable row level security;
alter table public.team_members        enable row level security;
alter table public.faqs                enable row level security;
alter table public.contact_submissions enable row level security;

-- ---------------------------------------------------------------------------
-- Conteúdo público: qualquer visitante lê, mas só o que está publicado.
-- Rascunhos (published = false) ficam invisíveis para anon.
-- ---------------------------------------------------------------------------
create policy "Áreas publicadas são públicas"
  on public.practice_areas for select
  to anon, authenticated
  using (published = true);

create policy "Artigos publicados são públicos"
  on public.articles for select
  to anon, authenticated
  using (published = true);

create policy "Membros publicados são públicos"
  on public.team_members for select
  to anon, authenticated
  using (published = true);

create policy "FAQs publicadas são públicas"
  on public.faqs for select
  to anon, authenticated
  using (published = true);

-- ---------------------------------------------------------------------------
-- Leads: escrita anônima permitida, leitura anônima NÃO.
-- Ausência deliberada de política de SELECT/UPDATE/DELETE para anon — sem ela,
-- os dados pessoais dos leads seriam legíveis por qualquer visitante com a
-- chave publicável, que é pública por definição.
-- O consentimento LGPD é exigido no próprio banco, não só no formulário.
-- ---------------------------------------------------------------------------
create policy "Qualquer um pode enviar o formulário com consentimento LGPD"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (lgpd_consent = true);

create policy "Equipe autenticada lê os leads"
  on public.contact_submissions for select
  to authenticated
  using (true);

create policy "Equipe autenticada atualiza o status do lead"
  on public.contact_submissions for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Escrita de conteúdo: apenas usuários autenticados (painel do Supabase).
-- ---------------------------------------------------------------------------
create policy "Equipe autenticada gerencia áreas"
  on public.practice_areas for all
  to authenticated using (true) with check (true);

create policy "Equipe autenticada gerencia artigos"
  on public.articles for all
  to authenticated using (true) with check (true);

create policy "Equipe autenticada gerencia a equipe"
  on public.team_members for all
  to authenticated using (true) with check (true);

create policy "Equipe autenticada gerencia FAQs"
  on public.faqs for all
  to authenticated using (true) with check (true);
