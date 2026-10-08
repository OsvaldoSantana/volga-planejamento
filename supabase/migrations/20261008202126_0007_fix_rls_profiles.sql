-- ─────────────────────────────────────────────
-- 0007 · Corrigir RLS recursiva na tabela profiles
-- ─────────────────────────────────────────────
-- Problema: as policies originais faziam subquery em public.profiles
-- dentro da própria policy de public.profiles, gerando recursão
-- (erro 42P17: infinite recursion detected).
-- Solução: mover a checagem de admin para funções security definer,
-- que rodam fora das regras de RLS.

-- ── 1. Funções helper (security definer) ─────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.ativo = true
      and p.papel = 'admin'
  );
$$;

create or replace function public.pode_escrever()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.ativo = true
      and p.papel in ('admin','analista')
  );
$$;

-- ── 2. Recriar policies de profiles sem recursão ─────────────────
drop policy if exists "perfil_self_ou_admin" on public.profiles;
drop policy if exists "perfil_admin_all"     on public.profiles;
drop policy if exists "perfil_self"          on public.profiles;
drop policy if exists "perfil_admin_leitura" on public.profiles;
drop policy if exists "perfil_admin_escrita" on public.profiles;

-- Qualquer usuário autenticado lê o próprio perfil
create policy "perfil_self" on public.profiles
  for select to authenticated
  using (id = auth.uid());

-- Admin lê todos os perfis
create policy "perfil_admin_leitura" on public.profiles
  for select to authenticated
  using (public.is_admin());

-- Admin altera qualquer perfil
create policy "perfil_admin_escrita" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());