-- Dados de exemplo SÓ para o ambiente local.
--
-- O Supabase CLI roda este arquivo em `supabase db reset` / `supabase start`;
-- ele nunca é aplicado no projeto de produção (que não recebe seed). Os seis
-- artigos reproduzem os exemplos de layout usados na montagem do site — não
-- são conteúdo real do escritório.

insert into public.artigos
  (titulo, slug, resumo, conteudo, capa_url, capa_alt, area, tipo, autor_nome,
   status, destaque, publicado_em)
values
  (
    'Reforma tributária: o que muda para as empresas',
    'reforma-tributaria-o-que-muda-para-as-empresas',
    'A transição para o IBS e a CBS altera a forma como as empresas apuram e recolhem tributos. Entenda os prazos e o que já pode ser feito.',
    '<p>A reforma tributária inaugura um período de transição que exige preparo. Neste artigo, detalhamos o cronograma de implantação, os principais impactos sobre a apuração de créditos e as medidas que a empresa pode adotar desde já para atravessar a mudança sem sobressaltos.</p>',
    '/images/cta-banner-escritorio.jpg', 'Imagem de exemplo: recepção do escritório',
    'Tributário', 'Artigo', '[Nome do autor] – OAB/MA 0000',
    'publicado', true, '2026-08-18 12:00:00-03'
  ),
  (
    'LGPD três anos depois: o que a fiscalização mostrou',
    'lgpd-tres-anos-depois-o-que-a-fiscalizacao-mostrou',
    'As primeiras sanções aplicadas pela ANPD revelam onde as empresas mais erram no tratamento de dados pessoais.',
    '<p>Passada a fase de adaptação, a Autoridade Nacional de Proteção de Dados intensificou a fiscalização. Analisamos as sanções já aplicadas e apontamos os pontos que se repetem nos processos: base legal mal definida, retenção excessiva e falhas na resposta a incidentes.</p>',
    '/images/cta-banner-escritorio.jpg', 'Imagem de exemplo: recepção do escritório',
    'Empresarial', 'Artigo', '[Nome do autor] – OAB/MA 0000',
    'publicado', false, '2026-07-30 12:00:00-03'
  ),
  (
    'Governança corporativa em empresas familiares',
    'governanca-corporativa-em-empresas-familiares',
    'Acordo de sócios, conselho consultivo e planejamento sucessório: como profissionalizar sem perder a identidade do negócio.',
    '<p>A empresa familiar enfrenta um desafio particular: separar patrimônio, gestão e relações pessoais. Apresentamos os instrumentos jurídicos que sustentam essa separação e a sequência em que costumam ser implantados.</p>',
    '/images/cta-banner-escritorio.jpg', 'Imagem de exemplo: recepção do escritório',
    'Empresarial', 'Artigo', '[Nome do autor] – OAB/MA 0000',
    'publicado', false, '2026-07-12 12:00:00-03'
  ),
  (
    'O novo marco das garantias e o crédito empresarial',
    'novo-marco-das-garantias-e-o-credito-empresarial',
    'As mudanças na execução extrajudicial e no registro de garantias ampliam o acesso ao crédito. Veja os pontos de atenção.',
    '<p>O marco legal das garantias alterou dispositivos centrais sobre alienação fiduciária e execução extrajudicial. Comentamos os efeitos práticos para tomadores e credores.</p>',
    '/images/cta-banner-escritorio.jpg', 'Imagem de exemplo: recepção do escritório',
    'Cível', 'Notícia', '[Nome do autor] – OAB/MA 0000',
    'publicado', false, '2026-06-28 12:00:00-03'
  ),
  (
    'Rescisão contratual: quando a multa é devida',
    'rescisao-contratual-quando-a-multa-e-devida',
    'Nem toda quebra de contrato gera multa. A jurisprudência recente delimita quando a penalidade se aplica e em que medida.',
    '<p>A cláusula penal é um dos pontos mais litigados nos contratos empresariais. Revisamos o entendimento dos tribunais superiores sobre proporcionalidade, mora e resolução por onerosidade excessiva.</p>',
    '/images/cta-banner-escritorio.jpg', 'Imagem de exemplo: recepção do escritório',
    'Contratual', 'Artigo', '[Nome do autor] – OAB/MA 0000',
    'publicado', false, '2026-06-10 12:00:00-03'
  ),
  (
    'Due diligence imobiliária: o que não pode faltar',
    'due-diligence-imobiliaria-o-que-nao-pode-faltar',
    'Uma checagem incompleta antes da compra pode custar o imóvel. Conheça as certidões e verificações indispensáveis.',
    '<p>A aquisição de um imóvel exige investigação que vai muito além da matrícula. Listamos as certidões pessoais e reais, as verificações urbanísticas e os riscos sucessórios que costumam passar despercebidos.</p>',
    '/images/cta-banner-escritorio.jpg', 'Imagem de exemplo: recepção do escritório',
    'Cível', 'Artigo', '[Nome do autor] – OAB/MA 0000',
    'publicado', false, '2026-05-22 12:00:00-03'
  );
