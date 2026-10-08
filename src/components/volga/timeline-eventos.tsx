import {
  CircleDot,
  Upload,
  MessageSquareReply,
  CheckCircle2,
  Send,
  RefreshCcw,
  Users,
  AlertOctagon,
  FileText,
  Inbox,
  Calendar,
} from 'lucide-react'
import type { EventoObra } from '@/lib/queries/obra-detalhe'

const ICONES: Record<string, typeof CircleDot> = {
  'Linha de base': CircleDot,
  'Definição de mobilização': Calendar,
  'Envio para validação': Send,
  'Retorno do PM': MessageSquareReply,
  'Validação do PM': CheckCircle2,
  'Entrega de cronograma': Upload,
  'Atualização de cronograma': RefreshCcw,
  Reunião: Users,
  'Pendência / bloqueio': AlertOctagon,
  'Solicitação de demanda': Inbox,
  Outro: FileText,
}

function fmtData(iso: string | null) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function TimelineEventos({ eventos }: { eventos: EventoObra[] }) {
  if (eventos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Nenhum evento registrado nesta obra ainda.
      </div>
    )
  }

  return (
    <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
      {eventos.map((ev) => {
        const Icon = ICONES[ev.tipo_evento] ?? CircleDot
        return (
          <li key={ev.id} className="ml-6 relative">
            <span className="absolute -left-[35px] top-0 grid place-items-center h-7 w-7 rounded-full bg-white border-2 border-[var(--volga-green)]">
              <Icon className="h-3.5 w-3.5 text-[var(--volga-forest)]" />
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <time className="text-xs font-mono text-slate-500 tabular-nums">
                {fmtData(ev.data_evento)}
              </time>
              <span className="text-sm font-semibold text-slate-900">
                {ev.tipo_evento}
              </span>
            </div>
            {ev.descricao && (
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {ev.descricao}
              </p>
            )}
          </li>
        )
      })}
    </ol>
  )
}