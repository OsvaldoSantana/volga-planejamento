-- ─────────────────────────────────────────────
-- 0004 · Auto-criar linha em profiles quando um usuário se registra
-- ─────────────────────────────────────────────

create or replace function public.tg_novo_usuario()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome, email, papel)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email,'@',1)),
    new.email,
    'leitor'
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger trg_novo_usuario
after insert on auth.users
for each row execute function public.tg_novo_usuario();