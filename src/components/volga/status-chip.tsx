import { CheckCircle2, AlertTriangle, Lock, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'No prazo' | 'Atenção' | 'Bloqueado' | 'Não avaliado'

const MAP: Record<Status, { bg: string; fg: string; Icon: typeof CheckCircle2 }> = {
  'No prazo':     { bg: 'bg-[#E8F5E9]', fg: 'text-[#1B5E20]', Icon: CheckCircle2 },
  'Atenção':      { bg: 'bg-[#FFF8E1]', fg: 'text-[#E65100]', Icon: AlertTriangle },
  'Bloqueado':    { bg: 'bg-[#FFEBEE]', fg: 'text-[#B71C1C]', Icon: Lock },
  'Não avaliado': { bg: 'bg-[#ECEFF1]', fg: 'text-[#37474F]', Icon: HelpCircle },
}

export function StatusChip({
  status,
  size = 'md',
}: {
  status: Status
  size?: 'sm' | 'md'
}) {
  const { bg, fg, Icon } = MAP[status] ?? MAP['Não avaliado']
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        bg,
        fg,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {status}
    </span>
  )
}