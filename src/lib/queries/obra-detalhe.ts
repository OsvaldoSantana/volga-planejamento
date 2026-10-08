import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export type ObraDetalhe = {
  id: string
  codigo: string
  cliente: string
  pm_nome: string | null
  origem_demanda: string | null
  situacao_cronograma: string | null
  cadencia_reuniao: string | null
  agenda_reuniao: string | null
  data_mobilizacao: string | null
  mobilizacao_texto: string | null
  situacao_mobilizacao: string | null
  status: 'No prazo' | 'Atenção' | 'Bloqueado' | 'Não avaliado'
  pendencia: string | null
  resumo_executivo: string | null
  ultima_interacao: string | null
  dias_sem_interacao: number | null
  dias_ate_mobilizacao: number | null
}

export type FaseObra = {
  fase_epc_id: number
  nome: string
  cor: string
  ordem: number
  progresso: number
  status: string
}

export type EventoObra = {
  id: string
  data_evento: string | null
  tipo_evento: string
  descricao: string | null
}

export async function getObraDetalhe(codigo: string) {
  const supabase = await createClient()

  const { data: obra } = await supabase
    .from('vw_obras_indicadores')
    .select('*')
    .eq('codigo', codigo)
    .single()

  if (!obra) return null

  const { data: fases } = await supabase
    .from('obra_fases')
    .select('fase_epc_id, progresso, status, fases_epc(nome, ordem, cor)')
    .eq('obra_id', obra.id)
    .order('fase_epc_id')

  const { data: eventos } = await supabase
    .from('eventos')
    .select('id, data_evento, tipo_evento, descricao')
    .eq('obra_id', obra.id)
    .order('data_evento', { ascending: false, nullsFirst: false })
    .order('criado_em', { ascending: false })

  const fasesFormatadas: FaseObra[] = (fases ?? []).map((f: any) => ({
    fase_epc_id: f.fase_epc_id,
    nome: f.fases_epc?.nome ?? '',
    cor: f.fases_epc?.cor ?? '#94a3b8',
    ordem: f.fases_epc?.ordem ?? 0,
    progresso: f.progresso,
    status: f.status,
  }))

  return {
    obra: obra as ObraDetalhe,
    fases: fasesFormatadas,
    eventos: (eventos ?? []) as EventoObra[],
  }
}

export async function getObraOuNotFound(codigo: string) {
  const data = await getObraDetalhe(codigo)
  if (!data) notFound()
  return data
}