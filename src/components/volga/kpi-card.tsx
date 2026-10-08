import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Tom = 'neutro' | 'verde' | 'ambar' | 'vermelho'

export function KpiCard({
  label,
  valor,
  sufixo,
  tom = 'neutro',
  onClick,
}: {
  label: string
  valor: number | string
  sufixo?: string
  tom?: Tom
  onClick?: () => void
}) {
  const acento = {
    neutro:   'text-slate-900',
    verde:    'text-emerald-700',
    ambar:    'text-amber-700',
    vermelho: 'text-red-700',
  }[tom]

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 transition',
        onClick && 'cursor-pointer hover:shadow-md hover:border-[var(--volga-green)]'
      )}
    >
      <div className="text-3xl font-bold tabular-nums text-slate-900">
        {valor}
      </div>
      <div className="text-sm font-medium text-slate-600 mt-1">{label}</div>
      {sufixo && <div className={cn('text-xs mt-1', acento)}>{sufixo}</div>}
    </Card>
  )
}