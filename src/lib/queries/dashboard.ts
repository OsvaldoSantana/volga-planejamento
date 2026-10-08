import { createClient } from '@/lib/supabase/server'

export type ObraAlerta = {
  codigo: string
  cliente: string
  pm_nome: string | null
  status: 'No prazo' | 'Atenção' | 'Bloqueado' | 'Não avaliado'
  dias_sem_interacao: number | null
  pendencia: string | null
}

export type DashboardData = {
  totalObras: number
  porStatus: {
    'No prazo': number
    'Atenção': number
    'Bloqueado': number
    'Não avaliado': number
  }
  porSituacao: { situacao: string; count: number }[]
  porPm: { pm: string; count: number }[]
  pontosAtencao: ObraAlerta[]
}

const ORDEM_SITUACAO = [
  'Em elaboração',
  'Estruturado – aguardando validação',
  'Em ajuste com o PM',
  'Validado pelo PM',
  'Validado e entregue',
  'Em atualização periódica',
  'Não informada',
]

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient()

  const { data: obras } = await supabase
    .from('vw_obras_indicadores')
    .select(
      'codigo, cliente, pm_nome, status, situacao_cronograma, dias_sem_interacao, pendencia'
    )

  const lista = obras ?? []

  // KPIs por status
  const porStatus = {
    'No prazo': 0,
    'Atenção': 0,
    'Bloqueado': 0,
    'Não avaliado': 0,
  }
  lista.forEach((o) => {
    if (o.status in porStatus) {
      porStatus[o.status as keyof typeof porStatus] += 1
    }
  })

  // Funil por situação (na ordem oficial)
  const porSituacao = ORDEM_SITUACAO.map((s) => ({
    situacao: s,
    count: lista.filter((o) => o.situacao_cronograma === s).length,
  })).filter((s) => s.count > 0 || s.situacao === 'Não informada')

  // Distribuição por PM
  const pmMap = new Map<string, number>()
  lista.forEach((o) => {
    if (o.pm_nome) pmMap.set(o.pm_nome, (pmMap.get(o.pm_nome) ?? 0) + 1)
  })
  const porPm = Array.from(pmMap)
    .map(([pm, count]) => ({ pm, count }))
    .sort((a, b) => b.count - a.count)

  // Pontos de atenção (Bloqueado primeiro, depois Atenção por dias)
  const pontosAtencao = lista
    .filter((o) => o.status === 'Bloqueado' || o.status === 'Atenção')
    .sort((a, b) => {
      if (a.status === 'Bloqueado' && b.status !== 'Bloqueado') return -1
      if (b.status === 'Bloqueado' && a.status !== 'Bloqueado') return 1
      return (b.dias_sem_interacao ?? 0) - (a.dias_sem_interacao ?? 0)
    }) as ObraAlerta[]

  return {
    totalObras: lista.length,
    porStatus,
    porSituacao,
    porPm,
    pontosAtencao,
  }
}