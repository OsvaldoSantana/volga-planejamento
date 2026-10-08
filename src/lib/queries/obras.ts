import { createClient } from '@/lib/supabase/server'

export type ObraLinha = {
  codigo: string
  cliente: string
  pm_nome: string | null
  status: 'No prazo' | 'Atenção' | 'Bloqueado' | 'Não avaliado'
  situacao_cronograma: string | null
  progresso_medio: number
  dias_sem_interacao: number | null
  ultima_interacao: string | null
}

export async function listarObras(): Promise<ObraLinha[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('vw_obras_indicadores')
    .select(
      'codigo, cliente, pm_nome, status, situacao_cronograma, progresso_medio, dias_sem_interacao, ultima_interacao'
    )
    .order('codigo')

  return (data ?? []) as ObraLinha[]
}