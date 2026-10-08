-- ─────────────────────────────────────────────
-- 0008 · Permitir evento sem data
-- ─────────────────────────────────────────────
-- Alguns eventos do Excel vieram sem data no registro original.
-- Eles não devem contar para "última interação" (MAX ignora NULL).

alter table public.eventos
  alter column data_evento drop not null,
  alter column data_evento drop default;