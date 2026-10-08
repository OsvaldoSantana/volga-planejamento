-- ─────────────────────────────────────────────
-- 0006 · View de indicadores calculados
-- ─────────────────────────────────────────────

create or replace view public.vw_obras_indicadores
with (security_invoker = on) as
select
  o.*,
  (select max(e.data_evento) from public.eventos e where e.obra_id = o.id)
    as ultima_interacao,
  case
    when o.data_mobilizacao is null then null
    else (o.data_mobilizacao - current_date)
  end as dias_ate_mobilizacao,
  case
    when (select max(e.data_evento) from public.eventos e where e.obra_id = o.id) is null then null
    else current_date - (select max(e.data_evento) from public.eventos e where e.obra_id = o.id)
  end as dias_sem_interacao,
  coalesce(
    (select avg(f.progresso) from public.obra_fases f where f.obra_id = o.id),
    0
  ) as progresso_medio
from public.obras o
where o.arquivada = false;