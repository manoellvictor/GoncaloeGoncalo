-- Excluir um artigo apaga também a pasta artigos/<id>/ do Storage. Para isso
-- a conta do escritório precisa listar os arquivos do bucket (list/remove do
-- Storage exigem leitura na tabela storage.objects). O público continua
-- vendo as imagens pela URL pública do bucket, sem listar nada.
create policy "Escritório lista imagens de artigos" on storage.objects
  for select to authenticated
  using (bucket_id = 'artigos' and public.e_escritorio());
