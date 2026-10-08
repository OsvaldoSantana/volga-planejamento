-- ─────────────────────────────────────────────
-- 0003 · Tabelas operacionais + triggers
-- ─────────────────────────────────────────────

create table public.obras (
  id                   uuid primary key default gen_random_uuid(),
  codigo               text not null unique,
  cliente              text not null,
  pm_nome              text,
  origem_demanda       text,
  fase_epc_atual       smallint references public.fases_epc(id),
  situacao_cronograma  text,
  cadencia_reuniao     text,
  agenda_reuniao       text,
  data_mobilizacao     date,
  mobilizacao_texto    text,
  situacao_mobilizacao text,
  status               text not null default 'Não avaliado'
                       check (status in ('No prazo','Atenção','Bloqueado','Não avaliado')),
  pendencia            text,
  resumo_executivo     text,
  arquivada            boolean not null default false,
  criado_por           uuid references public.profiles(id),
  criado_em            timestamptz not null default now(),
  atualizado_em        timestamptz not null default now()
);
create index on public.obras (status) where not arquivada;
create index on public.obras (pm_nome);
create index on public.obras (codigo);

create table public.obra_fases (
  obra_id         uuid references public.obras(id) on delete cascade,
  fase_epc_id     smallint references public.fases_epc(id),
  progresso       numeric not null default 0 check (progresso between 0 and 100),
  status          text not null default 'Não iniciada'
                  check (status in ('Não iniciada','Em andamento','Concluída','Atrasada','Bloqueada')),
  inicio_previsto date,
  fim_previsto    date,
  fim_real        date,
  responsavel     text,
  observacao      text,
  primary key (obra_id, fase_epc_id)
);

create table public.eventos (
  id             uuid primary key default gen_random_uuid(),
  obra_id        uuid not null references public.obras(id) on delete cascade,
  data_evento    date not null default current_date,
  tipo_evento    text not null,
  descricao      text,
  registrado_por uuid references public.profiles(id),
  criado_em      timestamptz not null default now()
);
create index on public.eventos (obra_id, data_evento desc);

create table public.auditoria (
  id           bigserial primary key,
  tabela       text,
  registro_id  uuid,
  operacao     text,
  dados_antes  jsonb,
  dados_depois jsonb,
  usuario_id   uuid,
  ocorrido_em  timestamptz not null default now()
);

-- Trigger 1: atualizar obras.atualizado_em automaticamente
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end $$;

create trigger trg_obras_updated
before update on public.obras
for each row execute function public.tg_set_updated_at();

-- Trigger 2: criar automaticamente as 7 linhas de obra_fases ao inserir obra
create or replace function public.tg_criar_fases_obra()
returns trigger language plpgsql as $$
begin
  insert into public.obra_fases (obra_id, fase_epc_id, progresso, status)
  select new.id, f.id, 0, 'Não iniciada'
  from public.fases_epc f;
  return new;
end $$;

create trigger trg_obra_cria_fases
after insert on public.obras
for each row execute function public.tg_criar_fases_obra();