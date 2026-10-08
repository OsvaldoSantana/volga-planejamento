-- ─────────────────────────────────────────────
-- 0002 · Seed dos catálogos (dados da aba "Listas" do Excel)
-- ─────────────────────────────────────────────

insert into public.fases_epc (id, nome, ordem, cor) values
  (1, 'Projeto',          1, '#2563EB'),
  (2, 'Suprimentos',      2, '#7C3AED'),
  (3, 'Logística',        3, '#0891B2'),
  (4, 'Obra Civil',       4, '#D97706'),
  (5, 'Eletromecânica',   5, '#059669'),
  (6, 'Elétrica',         6, '#16A34A'),
  (7, 'Comissionamento',  7, '#DC2626');

insert into public.lista_opcoes (categoria, valor, ordem) values
  ('situacao_cronograma', 'Em elaboração',                      1),
  ('situacao_cronograma', 'Estruturado – aguardando validação', 2),
  ('situacao_cronograma', 'Em ajuste com o PM',                 3),
  ('situacao_cronograma', 'Validado pelo PM',                   4),
  ('situacao_cronograma', 'Validado e entregue',                5),
  ('situacao_cronograma', 'Em atualização periódica',           6),
  ('situacao_cronograma', 'Não informada',                      7),

  ('fase', 'Pré-contrato',      1),
  ('fase', 'Projetos',          2),
  ('fase', 'Fabricação',        3),
  ('fase', 'Mobilização',       4),
  ('fase', 'Execução em campo', 5),
  ('fase', 'Comissionamento',   6),
  ('fase', 'Encerrada',         7),
  ('fase', 'Não informada',     8),

  ('cadencia_reuniao', 'Semanal',                  1),
  ('cadencia_reuniao', 'Quinzenal',                2),
  ('cadencia_reuniao', 'Mensal',                   3),
  ('cadencia_reuniao', 'Sem recorrência definida', 4),
  ('cadencia_reuniao', 'Não informada',            5),

  ('situacao_mobilizacao', 'Definida',      1),
  ('situacao_mobilizacao', 'Estimada',      2),
  ('situacao_mobilizacao', 'Não informada', 3),

  ('status', 'No prazo',     1),
  ('status', 'Atenção',      2),
  ('status', 'Bloqueado',    3),
  ('status', 'Não avaliado', 4),

  ('origem_demanda', 'Distribuição do coordenador', 1),
  ('origem_demanda', 'Solicitação direta do PM',    2),

  ('tipo_evento', 'Linha de base',             1),
  ('tipo_evento', 'Definição de mobilização',  2),
  ('tipo_evento', 'Envio para validação',      3),
  ('tipo_evento', 'Retorno do PM',             4),
  ('tipo_evento', 'Validação do PM',           5),
  ('tipo_evento', 'Entrega de cronograma',     6),
  ('tipo_evento', 'Atualização de cronograma', 7),
  ('tipo_evento', 'Reunião',                   8),
  ('tipo_evento', 'Pendência / bloqueio',      9),
  ('tipo_evento', 'Solicitação de demanda',   10),
  ('tipo_evento', 'Outro',                    11),

  ('pm', 'PAULO NETTO', 1),
  ('pm', 'MATHEUS',     2),
  ('pm', 'JEOVANNA',    3),
  ('pm', 'ERIKA',       4),
  ('pm', 'LAERÇO',      5),
  ('pm', 'LAURA',       6);

insert into public.parametros_alerta (chave, valor, descricao) values
  ('dias_sem_interacao_alerta',    7,  'Alerta amarelo por dias sem interação'),
  ('dias_sem_interacao_critico',   14, 'Alerta vermelho por dias sem interação'),
  ('dias_ate_mobilizacao_alerta',  60, 'Alerta amarelo por proximidade da mobilização'),
  ('dias_ate_mobilizacao_critico', 30, 'Alerta vermelho por proximidade da mobilização');