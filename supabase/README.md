# Supabase

Projeto: `ungjggbqrtxedbknuadd` (região sa-east-1).

## `migrations/`

Cópia das migrações aplicadas no banco, na ordem em que rodaram (o prefixo é a
versão registrada em `supabase_migrations.schema_migrations`). Toda mudança de
estrutura — tabela, coluna, regra de acesso, bucket — entra aqui com o mesmo
nome e conteúdo da migração aplicada no Supabase.

As migrações `seed_*` de setembro trazem o conteúdo de exemplo usado na
montagem do site; boa parte dele já foi substituída pelo conteúdo real.

## `seed.sql`

Seis artigos de exemplo na tabela `artigos`, **só para ambiente local**: o
Supabase CLI roda este arquivo em `supabase start` / `supabase db reset`. Ele
nunca é aplicado no projeto de produção.

## Conta do escritório

O painel `/admin` aceita uma única conta, marcada com
`app_metadata.escritorio = true` (função `public.e_escritorio()`). Depois de
criar a conta em Authentication → Users, marque-a no SQL Editor:

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"escritorio": true}'
where email = 'EMAIL-DA-CONTA';
```

## `snapshots/`

Fotografia do conteúdo publicado que o site lê do banco, para histórico no Git:

- `team_members.json` — página Nosso Time (cards, perfis e fotos).
- `practice_areas.json` — textos das áreas de atuação.
- `articles.json` — publicações do Conteúdo Jurídico (área, capa, destaque).

Gerados pela API pública (só registros publicados), sem `created_at` e
`updated_at`. **A fonte de verdade é o banco:** editar estes arquivos não muda o
site. Depois de alterar o conteúdo no Supabase, gere-os de novo e faça commit.

O formulário de contato (`contact_submissions`) não é exportado: contém dados
pessoais e não deve ir para o repositório.
