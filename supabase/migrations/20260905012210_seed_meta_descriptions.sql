update public.practice_areas set meta_description = case slug
  when 'direito-empresarial' then
    'Consultoria societária, fusões e aquisições, contratos e governança corporativa: segurança jurídica para as decisões que definem o futuro da sua empresa.'
  when 'direito-civil' then
    'Contratos, responsabilidade civil, família e sucessões: proteção do seu patrimônio e dos seus direitos, com a discrição que cada caso pessoal exige.'
  when 'direito-trabalhista' then
    'Consultoria preventiva, contencioso e negociações sindicais: relações de trabalho estáveis e redução real da exposição a passivos trabalhistas.'
  when 'direito-tributario' then
    'Planejamento tributário, defesa em autuações e recuperação de créditos fiscais: menos carga tributária para a sua empresa, sempre dentro da legalidade.'
  when 'direito-imobiliario' then
    'Due diligence, compra e venda, locações e regularização de imóveis: negócios imobiliários fechados com segurança e sem surpresas no futuro.'
  when 'direito-administrativo' then
    'Licitações, contratos administrativos e defesa em processos: segurança jurídica para empresas e gestores que se relacionam com o poder público.'
  when 'compliance-e-lgpd' then
    'Programas de integridade, adequação à LGPD e mapeamento de dados pessoais: sua operação em conformidade antes que a fiscalização bata à porta.'
  when 'direito-do-consumidor' then
    'Defesa em ações consumeristas, adequação de contratos e SAC, recall e Procon: relações de consumo equilibradas e conflitos resolvidos com agilidade.'
end;

update public.articles set meta_description = case slug
  when 'reforma-tributaria-o-que-muda-para-as-empresas' then
    'A transição para o IBS e a CBS muda a apuração de tributos das empresas. Entenda o cronograma, os impactos sobre créditos e o que já pode ser feito.'
  when 'lgpd-tres-anos-depois-o-que-a-fiscalizacao-mostrou' then
    'As primeiras sanções aplicadas pela ANPD revelam onde as empresas mais erram no tratamento de dados pessoais. Veja os pontos que mais se repetem.'
  when 'governanca-corporativa-em-empresas-familiares' then
    'Acordo de sócios, conselho consultivo e planejamento sucessório: como profissionalizar a empresa familiar sem perder a identidade do negócio.'
  when 'novo-marco-das-garantias-e-o-credito-empresarial' then
    'As mudanças na execução extrajudicial e no registro de garantias ampliam o acesso ao crédito empresarial. Veja os pontos de atenção na prática.'
  when 'rescisao-contratual-quando-a-multa-e-devida' then
    'Nem toda quebra de contrato gera multa. A jurisprudência recente delimita quando a cláusula penal se aplica e em que medida ela pode ser reduzida.'
  when 'due-diligence-imobiliaria-o-que-nao-pode-faltar' then
    'Uma checagem incompleta antes da compra pode custar o imóvel. Conheça as certidões, verificações urbanísticas e riscos sucessórios essenciais.'
end;
