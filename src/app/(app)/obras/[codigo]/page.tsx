import Link from 'next/link'
import { ArrowLeft, Calendar, User, Paperclip } from 'lucide-react'
import { StatusChip } from '@/components/volga/status-chip'
import { FaseStepper, type Fase } from '@/components/volga/fase-stepper'
import { TimelineEventos } from '@/components/volga/timeline-eventos'
import { Button } from '@/components/ui/button'
import { getObraOuNotFound } from '@/lib/queries/obra-detalhe'

export const dynamic = 'force-dynamic'

function fmtData(iso: string | null) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default async function ObraDetalhePage({
  params,
}: {
  params: Promise<{ codigo: string }>
}) {
  const { codigo } = await params
  const { obra, fases, eventos } = await getObraOuNotFound(codigo)

  const fasesFormatadas: Fase[] = fases.map((f) => ({
    id: f.fase_epc_id,
    nome: f.nome,
    cor: f.cor,
    progresso: f.progresso,
    status: f.status,
  }))

  const mobilizacao = obra.data_mobilizacao
    ? fmtData(obra.data_mobilizacao)
    : obra.mobilizacao_texto ?? '—'

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      {/* ── Breadcrumb + Header ───────────────────────── */}
      <div>
        <Link
          href="/obras"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[var(--volga-forest)] mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar para Obras
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-500">
                {obra.codigo}
              </span>
              <StatusChip status={obra.status} />
            </div>
            <h1 className="text-3xl font-bold text-[var(--volga-deep)] mt-1">
              {obra.cliente}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 flex-wrap">
              {obra.pm_nome && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {obra.pm_nome}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Mobilização: {mobilizacao}
              </span>
              {obra.origem_demanda && (
                <span className="text-xs text-slate-500">
                  {obra.origem_demanda}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <Paperclip className="h-3.5 w-3.5 mr-1.5" />
              Anexos
            </Button>
            <Button size="sm" disabled>
              + Registrar evento
            </Button>
          </div>
        </div>
      </div>

      {/* ── Fases EPC ─────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Progresso EPC
        </h2>
        <FaseStepper fases={fasesFormatadas} />
      </section>

      {/* ── Resumo + Pendência ────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Resumo executivo
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {obra.resumo_executivo ?? '—'}
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
          <h3 className="text-sm font-semibold text-amber-900 mb-2">
            Pendência / bloqueio
          </h3>
          <p className="text-sm text-amber-900/90 leading-relaxed">
            {obra.pendencia ?? 'Sem pendências no momento.'}
          </p>
        </div>
      </section>

      {/* ── Histórico ─────────────────────────────────── */}
      <section>
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">
            Histórico de eventos
          </h2>
          <span className="text-xs text-slate-500">
            {eventos.length} {eventos.length === 1 ? 'evento' : 'eventos'}
          </span>
        </header>
        <TimelineEventos eventos={eventos} />
      </section>
    </div>
  )
}