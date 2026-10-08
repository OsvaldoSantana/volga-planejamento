import { Card } from '@/components/ui/card'
import { StatusChip } from './status-chip'
import { Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'No prazo' | 'Atenção' | 'Bloqueado' | 'Não avaliado'

export type ObraCardProps = {
  codigo: string
  cliente: string
  pm?: string | null
  status: Status
  progresso?: number
  diasSemInteracao?: number | null
  alerta?: boolean
  onClick?: () => void
}

export function ObraCard({
  codigo,
  cliente,
  pm,
  status,
  progresso = 0,
  diasSemInteracao,
  alerta,
  onClick,
}: ObraCardProps) {
  const semInteracao =
    typeof diasSemInteracao === 'number' && diasSemInteracao > 0

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 transition',
        onClick && 'cursor-pointer hover:shadow-md hover:border-[var(--volga-green)]',
        alerta && 'border-l-4 border-l-amber-500'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-mono text-xs text-slate-500">{codigo}</div>
          <div className="font-semibold text-slate-900 truncate">{cliente}</div>
        </div>
        <StatusChip status={status} size="sm" />
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--volga-forest)] transition-all"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
        {pm && (
          <span className="inline-flex items-center gap-1">
            <User className="h-3 w-3" />
            {pm}
          </span>
        )}
        {semInteracao && (
          <span className="inline-flex items-center gap-1 text-amber-700">
            <Clock className="h-3 w-3" />
            {diasSemInteracao}d sem interação
          </span>
        )}
      </div>
    </Card>
  )
}