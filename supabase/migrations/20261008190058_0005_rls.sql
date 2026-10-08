-- ─────────────────────────────────────────────
-- 0005 · Row Level Security
-- ─────────────────────────────────────────────

alter table public.profiles          enable row level security;
alter table public.lista_opcoes      enable row level security;
alter table public.parametros_alerta enable row level security;
alter table public.fases_epc         enable row level security;
alter table public.obras             enable row level security;
alter table public.obra_fases        enable row level security;
alter table public.eventos           enable row level security;
alter table public.auditoria         enable row level security;

-- Helper: verifica se o usuário atual tem papel de escrita
create or replace function public.pode_escrever()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.ativo = true
      and p.papel in ('admin','analista')
  );
$$;

-- ── profiles ──
create policy "perfil_self_ou_admin" on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.papel = 'admin')
  );

create policy "perfil_admin_all" on public.profiles
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.papel = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.papel = 'admin'));

-- ── catálogos (leitura livre, escrita admin/analista) ──
create policy "lista_leitura" on public.lista_opcoes
  for select to authenticated using (true);
create policy "lista_escrita" on public.lista_opcoes
  for all to authenticated using (public.pode_escrever()) with check (public.pode_escrever());

create policy "param_leitura" on public.parametros_alerta
  for select to authenticated using (true);
create policy "param_escrita" on public.parametros_alerta
  for all to authenticated using (public.pode_escrever()) with check (public.pode_escrever());

create policy "fases_leitura" on public.fases_epc
  for select to authenticated using (true);
create policy "fases_escrita" on public.fases_epc
  for all to authenticated using (public.pode_escrever()) with check (public.pode_escrever());

-- ── obras / fases / eventos (leitura livre, escrita admin/analista) ──
create policy "obras_leitura" on public.obras
  for select to authenticated using (true);
create policy "obras_escrita" on public.obras
  for all to authenticated using (public.pode_escrever()) with check (public.pode_escrever());

create policy "ofases_leitura" on public.obra_fases
  for select to authenticated using (true);
create policy "ofases_escrita" on public.obra_fases
  for all to authenticated using (public.pode_escrever()) with check (public.pode_escrever());

create policy "eventos_leitura" on public.eventos
  for select to authenticated using (true);
create policy "eventos_escrita" on public.eventos
  for all to authenticated using (public.pode_escrever()) with check (public.pode_escrever());

-- ── auditoria (só admin) ──
create policy "auditoria_admin" on public.auditoria
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.papel = 'admin'));