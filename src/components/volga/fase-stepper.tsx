'use client'
import { cn } from '@/lib/utils'

export type Fase = {
  id: number
  nome: string
  cor: string
  progresso: number
  status: string
}

export function FaseStepper({
  fases,
  onSelect,
  compacto = false,
}: {
  fases: Fase[]
  onSelect?: (id: number) => void
  compacto?: boolean
}) {
  return (
    <div className="flex items-stretch gap-1 overflow-x-auto">
      {fases.map((f) => {
        const iniciada = f.progresso > 0 || f.status !== 'Não iniciada'
        const concluida = f.status === 'Concluída'

        return (
          <button
            key={f.id}
            onClick={() => onSelect?.(f.id)}
            className={cn(
              'flex-1 min-w-[120px] rounded-lg border p-3 text-left transition',
              'hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--volga-green)]',
              iniciada ? 'bg-white' : 'bg-slate-50 opacity-70',
              concluida && 'border-green-200',
              compacto && 'p-2'
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ background: f.cor }}
              />
              <span className="text-xs font-medium text-slate-700 truncate">
                {f.nome}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${f.progresso}%`, background: f.cor }}
              />
            </div>
            {!compacto && (
              <div className="mt-1 text-[11px] text-slate-500 truncate">
                {f.progresso}% · {f.status}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}