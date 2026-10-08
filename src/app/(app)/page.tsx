import { KpiCard } from '@/components/volga/kpi-card'

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <header>
        <h1 className="text-2xl font-bold text-[var(--volga-deep)]">
          Dashboard
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Visão geral da carteira de obras. Dados reais chegam na Fase 1.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="obras ativas" valor="—" />
        <KpiCard label="no prazo"     valor="—" tom="verde" />
        <KpiCard label="atenção"      valor="—" tom="ambar" />
        <KpiCard label="bloqueado"    valor="—" tom="vermelho" />
        <KpiCard label="não avaliado" valor="—" />
      </section>

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Os indicadores reais, o fluxo por etapa EPC e a lista de pontos de atenção
        aparecem aqui quando a <strong>Fase 1</strong> for implementada.
      </section>
    </div>
  )
}