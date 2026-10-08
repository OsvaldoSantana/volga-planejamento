import Link from 'next/link'
import { StatusChip } from './status-chip'
import type { ObraAlerta } from '@/lib/queries/dashboard'

export function PontosAtencao({ obras }: { obras: ObraAlerta[] }) {
  if (obras.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Nenhuma obra com status <strong>Atenção</strong> ou{' '}
        <strong>Bloqueado</strong>. Carteira em dia.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-2 font-medium">Obra</th>
            <th className="text-left px-4 py-2 font-medium">Cliente</th>
            <th className="text-left px-4 py-2 font-medium">PM</th>
            <th className="text-left px-4 py-2 font-medium">Status</th>
            <th className="text-left px-4 py-2 font-medium">Dias s/ interação</th>
            <th className="text-left px-4 py-2 font-medium">Pendência</th>
          </tr>
        </thead>
        <tbody>
          {obras.map((o) => (
            <tr
              key={o.codigo}
              className="border-t border-slate-100 hover:bg-slate-50 transition"
            >
              <td className="px-4 py-3 font-mono text-xs text-slate-500">
                <Link
                  href={`/obras/${o.codigo}`}
                  className="hover:text-[var(--volga-forest)] hover:underline"
                >
                  {o.codigo}
                </Link>
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">
                {o.cliente}
              </td>
              <td className="px-4 py-3 text-slate-700">{o.pm_nome ?? '—'}</td>
              <td className="px-4 py-3">
                <StatusChip status={o.status} size="sm" />
              </td>
              <td className="px-4 py-3 tabular-nums text-slate-700">
                {o.dias_sem_interacao === null
                  ? '—'
                  : `${o.dias_sem_interacao}d`}
              </td>
              <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                {o.pendencia ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}