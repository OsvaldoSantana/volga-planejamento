'use client'
import { StatusChip } from '@/components/volga/status-chip'
import { FaseStepper, type Fase } from '@/components/volga/fase-stepper'
import { KpiCard } from '@/components/volga/kpi-card'
import { ObraCard } from '@/components/volga/obra-card'

const fasesDemo: Fase[] = [
  { id: 1, nome: 'Projeto',         cor: '#2563EB', progresso: 100, status: 'Concluída' },
  { id: 2, nome: 'Suprimentos',     cor: '#7C3AED', progresso: 60,  status: 'Em andamento' },
  { id: 3, nome: 'Logística',       cor: '#0891B2', progresso: 0,   status: 'Não iniciada' },
  { id: 4, nome: 'Obra Civil',      cor: '#D97706', progresso: 0,   status: 'Não iniciada' },
  { id: 5, nome: 'Eletromecânica',  cor: '#059669', progresso: 0,   status: 'Não iniciada' },
  { id: 6, nome: 'Elétrica',        cor: '#16A34A', progresso: 0,   status: 'Não iniciada' },
  { id: 7, nome: 'Comissionamento', cor: '#DC2626', progresso: 0,   status: 'Não iniciada' },
]

export default function DesignSystemPage() {
  return (
    <main className="p-10 max-w-6xl mx-auto space-y-12">
      <header>
        <h1 className="text-3xl font-bold text-[var(--volga-deep)]">
          Design System Volga
        </h1>
        <p className="text-slate-600 mt-1">
          Componentes base para as telas do Planejamento de Instalação.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-3">Paleta institucional</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            ['Volga Deep',   '#003437'],
            ['Volga Forest', '#2a451d'],
            ['Volga Green',  '#376625'],
            ['Volga Lime',   '#a2c73b'],
            ['Volga Yellow', '#d3d92b'],
            ['Volga Orange', '#f39433'],
          ].map(([nome, hex]) => (
            <div key={hex}>
              <div className="h-20 rounded-lg shadow-sm" style={{ background: hex }} />
              <div className="text-xs mt-2 font-medium">{nome}</div>
              <div className="text-[11px] text-slate-500 font-mono">{hex}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">StatusChip</h2>
        <div className="flex flex-wrap gap-2">
          <StatusChip status="No prazo" />
          <StatusChip status="Atenção" />
          <StatusChip status="Bloqueado" />
          <StatusChip status="Não avaliado" />
          <StatusChip status="No prazo" size="sm" />
          <StatusChip status="Atenção" size="sm" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">FaseStepper</h2>
        <FaseStepper fases={fasesDemo} onSelect={(id) => alert(`Fase ${id} clicada`)} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">KpiCard</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KpiCard label="obras ativas"  valor={12} />
          <KpiCard label="no prazo"      valor={7} sufixo="58% da carteira" tom="verde" />
          <KpiCard label="atenção"       valor={3} sufixo="25% da carteira" tom="ambar" />
          <KpiCard label="bloqueado"     valor={1} sufixo="8% da carteira"  tom="vermelho" />
          <KpiCard label="não avaliado"  valor={1} sufixo="8% da carteira" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">ObraCard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ObraCard codigo="24480001" cliente="MOHAWK"     pm="PAULO NETTO" status="No prazo"  progresso={22} diasSemInteracao={2} />
          <ObraCard codigo="24470001" cliente="EBRASIL"    pm="MATHEUS"     status="Atenção"   progresso={41} diasSemInteracao={6} alerta />
          <ObraCard codigo="24520001" cliente="UNITAPAJÓS" pm="PAULO NETTO" status="Bloqueado" progresso={8}  diasSemInteracao={15} alerta />
        </div>
      </section>
    </main>
  )
}