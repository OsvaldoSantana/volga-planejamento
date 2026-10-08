import { KpiCard } from '@/components/volga/kpi-card'
import { PontosAtencao } from '@/components/volga/pontos-atencao'
import { getDashboardData } from '@/lib/queries/dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const data = await getDashboardData()
  const total = data.totalObras || 1

  const pct = (n: number) => `${Math.round((n / total) * 100)}% da carteira`
  const totalFluxo = data.porSituacao.reduce((acc, s) => acc + s.count, 0)
  const maiorPm = data.porPm[0]?.count ?? 1

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <header>
        <h1 className="text-2xl font-bold text-[var(--volga-deep)]">
          Dashboard
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Visão geral da carteira · atualizado em tempo real
        </p>
      </header>

      {/* ── KPIs ────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="obras ativas" valor={data.totalObras} />
        <KpiCard
          label="no prazo"
          valor={data.porStatus['No prazo']}
          sufixo={pct(data.porStatus['No prazo'])}
          tom="verde"
        />
        <KpiCard
          label="atenção"
          valor={data.porStatus['Atenção']}
          sufixo={pct(data.porStatus['Atenção'])}
          tom="ambar"
        />
        <KpiCard
          label="bloqueado"
          valor={data.porStatus['Bloqueado']}
          sufixo={pct(data.porStatus['Bloqueado'])}
          tom="vermelho"
        />
        <KpiCard
          label="não avaliado"
          valor={data.porStatus['Não avaliado']}
          sufixo={pct(data.porStatus['Não avaliado'])}
        />
      </section>

      {/* ── Funil + PM ──────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Fluxo do cronograma
          </h2>
          <ul className="space-y-2">
            {data.porSituacao.map((s) => (
              <li key={s.situacao} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 bg-[var(--volga-forest)]"
                  aria-hidden
                />
                <span className="flex-1 text-sm text-slate-700 truncate">
                  {s.situacao}
                </span>
                <span className="text-sm font-semibold tabular-nums text-slate-900">
                  {s.count}
                </span>
                <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--volga-forest)]"
                    style={{
                      width: `${
                        totalFluxo ? (s.count / totalFluxo) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </li>
            ))}
            <li className="pt-3 mt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>Total</span>
              <span className="font-semibold tabular-nums text-slate-700">
                {totalFluxo} obras
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Distribuição por PM
          </h2>
          {data.porPm.length === 0 ? (
            <p className="text-sm text-slate-500">Sem dados.</p>
          ) : (
            <ul className="space-y-3">
              {data.porPm.map((p) => (
                <li key={p.pm}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 truncate">{p.pm}</span>
                    <span className="text-slate-500 tabular-nums">
                      {p.count} {p.count === 1 ? 'obra' : 'obras'}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--volga-green)]"
                      style={{ width: `${(p.count / maiorPm) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Pontos de atenção ───────────────────────────── */}
      <section>
        <header className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Pontos de atenção
          </h2>
          <span className="text-xs text-slate-500">
            {data.pontosAtencao.length}{' '}
            {data.pontosAtencao.length === 1 ? 'obra' : 'obras'}
          </span>
        </header>
        <PontosAtencao obras={data.pontosAtencao} />
      </section>
    </div>
  )
}