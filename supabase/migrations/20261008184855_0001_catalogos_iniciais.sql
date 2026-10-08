-- ─────────────────────────────────────────────
-- 0001 · Catálogos base (perfis, listas, parâmetros, fases EPC)
-- ─────────────────────────────────────────────

create table public.profiles (
  id        uuid primary key references auth.users on delete cascade,
  nome      text not null,
  email     text not null unique,
  papel     text not null default 'leitor'
            check (papel in ('admin','analista','coordenador','leitor')),
  ativo     boolean not null default true,
  criado_em timestamptz not null default now()
);

create table public.lista_opcoes (
  id        uuid primary key default gen_random_uuid(),
  categoria text not null,
  valor     text not null,
  ordem     int  not null default 0,
  ativo     boolean not null default true,
  unique (categoria, valor)
);
create index on public.lista_opcoes (categoria, ordem) where ativo;

create table public.parametros_alerta (
  chave     text primary key,
  valor     int  not null,
  descricao text
);

create table public.fases_epc (
  id    smallint primary key,
  nome  text not null unique,
  ordem smallint not null,
  cor   text not null
);