import { ObrasTabela } from '@/components/volga/obras-tabela'
import { listarObras } from '@/lib/queries/obras'

export const dynamic = 'force-dynamic'

export default async function ObrasPage() {
  const obras = await listarObras()

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <header>
        <h1 className="text-2xl font-bold text-[var(--volga-deep)]">Obras</h1>
        <p className="text-sm text-slate-600 mt-1">
          {obras.length} obras na carteira · clique no código para abrir o
          detalhe
        </p>
      </header>

      <ObrasTabela obras={obras} />
    </div>
  )
}