'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StatusChip } from './status-chip'
import type { ObraLinha } from '@/lib/queries/obras'

type Status = ObraLinha['status']

const STATUS: Status[] = ['No prazo', 'Atenção', 'Bloqueado', 'Não avaliado']

export function ObrasTabela({ obras }: { obras: ObraLinha[] }) {
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<Status | 'todos'>('todos')
  const [pmFiltro, setPmFiltro] = useState<string | 'todos'>('todos')

  const pms = useMemo(() => {
    const set = new Set<string>()
    obras.forEach((o) => o.pm_nome && set.add(o.pm_nome))
    return Array.from(set).sort()
  }, [obras])

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return obras.filter((o) => {
      if (statusFiltro !== 'todos' && o.status !== statusFiltro) return false
      if (pmFiltro !== 'todos' && o.pm_nome !== pmFiltro) return false
      if (
        termo &&
        !o.codigo.toLowerCase().includes(termo) &&
        !o.cliente.toLowerCase().includes(termo)
      )
        return false
      return true
    })
  }, [obras, busca, statusFiltro, pmFiltro])

  const temFiltro =
    busca !== '' || statusFiltro !== 'todos' || pmFiltro !== 'todos'

  function limpar() {
    setBusca('')
    setStatusFiltro('todos')
    setPmFiltro('todos')
  }

  return (
    <div className="space-y-4">
      {/* Barra de filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar código ou cliente…"
            className="pl-9"
          />
        </div>

        <select
          value={statusFiltro}
          onChange={(e) =>
            setStatusFiltro(e.target.value as Status | 'todos')
          }
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
        >
          <option value="todos">Todos os status</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={pmFiltro}
          onChange={(e) => setPmFiltro(e.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
        >
          <option value="todos">Todos os PMs</option>
          {pms.map((pm) => (
            <option key={pm} value={pm}>
              {pm}
            </option>
          ))}
        </select>

        {temFiltro && (
          <Button variant="ghost" size="sm" onClick={limpar}>
            <X className="h-3.5 w-3.5 mr-1" /> Limpar
          </Button>
        )}

        <span className="text-xs text-slate-500 ml-auto">
          {filtradas.length} de {obras.length}
        </span>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Obra</th>
              <th className="text-left px-4 py-2 font-medium">Cliente</th>
              <th className="text-left px-4 py-2 font-medium">PM</th>
              <th className="text-left px-4 py-2 font-medium">Status</th>
              <th className="text-left px-4 py-2 font-medium">Progresso</th>
              <th className="text-left px-4 py-2 font-medium">Última interação</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  Nenhuma obra encontrada.
                </td>
              </tr>
            ) : (
              filtradas.map((o) => (
                <tr
                  key={o.codigo}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link
                      href={`/obras/${o.codigo}`}
                      className="text-[var(--volga-forest)] hover:underline font-medium"
                    >
                      {o.codigo}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {o.cliente}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {o.pm_nome ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={o.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--volga-forest)]"
                          style={{ width: `${o.progresso_medio}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-slate-500">
                        {Math.round(o.progresso_medio)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {o.dias_sem_interacao === null ? (
                      '—'
                    ) : (
                      <span
                        className={
                          o.dias_sem_interacao > 14
                            ? 'text-red-700 font-medium'
                            : o.dias_sem_interacao > 7
                            ? 'text-amber-700 font-medium'
                            : ''
                        }
                      >
                        {o.dias_sem_interacao}d atrás
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}