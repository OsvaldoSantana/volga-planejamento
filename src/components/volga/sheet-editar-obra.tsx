'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { atualizarObra } from '@/app/actions/atualizar-obra'
import type { ObraDetalhe } from '@/lib/queries/obra-detalhe'

const STATUS = ['No prazo', 'Atenção', 'Bloqueado', 'Não avaliado'] as const
const SITUACOES = [
  'Em elaboração',
  'Estruturado – aguardando validação',
  'Em ajuste com o PM',
  'Validado pelo PM',
  'Validado e entregue',
  'Em atualização periódica',
  'Não informada',
]
const CADENCIAS = [
  'Semanal',
  'Quinzenal',
  'Mensal',
  'Sem recorrência definida',
  'Não informada',
]
const MOBILIZACAO = ['Definida', 'Estimada', 'Não informada']

export function SheetEditarObra({ obra }: { obra: ObraDetalhe }) {
  const [aberto, setAberto] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  // Form state
  const [status, setStatus] = useState(obra.status)
  const [situacao, setSituacao] = useState(obra.situacao_cronograma ?? '')
  const [cadencia, setCadencia] = useState(obra.cadencia_reuniao ?? '')
  const [agenda, setAgenda] = useState(obra.agenda_reuniao ?? '')
  const [dataMob, setDataMob] = useState(obra.data_mobilizacao ?? '')
  const [textoMob, setTextoMob] = useState(obra.mobilizacao_texto ?? '')
  const [sitMob, setSitMob] = useState(obra.situacao_mobilizacao ?? '')
  const [pendencia, setPendencia] = useState(obra.pendencia ?? '')
  const [resumo, setResumo] = useState(obra.resumo_executivo ?? '')

  function salvar() {
    startTransition(async () => {
      const r = await atualizarObra({
        id: obra.id,
        codigo: obra.codigo,
        status,
        situacao_cronograma: situacao || null,
        cadencia_reuniao: cadencia || null,
        agenda_reuniao: agenda || null,
        data_mobilizacao: dataMob || null,
        mobilizacao_texto: textoMob || null,
        situacao_mobilizacao: sitMob || null,
        pendencia: pendencia || null,
        resumo_executivo: resumo || null,
      })
      if (!r.ok) {
        toast.error('Não foi possível salvar', { description: r.erro })
        return
      }
      toast.success('Obra atualizada')
      setAberto(false)
      router.refresh()
    })
  }

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Editar
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar obra {obra.codigo}</SheetTitle>
          <SheetDescription>
            As alterações são aplicadas imediatamente e alimentam os indicadores
            do Dashboard.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 py-6">
          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Situação do cronograma */}
          <div className="space-y-2">
            <Label>Situação do cronograma</Label>
            <select
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="">—</option>
              {SITUACOES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Cadência + Agenda */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Cadência de reunião</Label>
              <select
                value={cadencia}
                onChange={(e) => setCadencia(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">—</option>
                {CADENCIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Agenda da reunião</Label>
              <Input
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="Segundas, 08:00"
              />
            </div>
          </div>

          {/* Mobilização */}
          <div className="space-y-2">
            <Label>Situação da mobilização</Label>
            <select
              value={sitMob}
              onChange={(e) => setSitMob(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="">—</option>
              {MOBILIZACAO.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Data de mobilização</Label>
              <Input
                type="date"
                value={dataMob}
                onChange={(e) => setDataMob(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ou texto livre</Label>
              <Input
                value={textoMob}
                onChange={(e) => setTextoMob(e.target.value)}
                placeholder="Junho"
              />
            </div>
          </div>

          {/* Pendência */}
          <div className="space-y-2">
            <Label>Pendência / bloqueio</Label>
            <Textarea
              value={pendencia}
              onChange={(e) => setPendencia(e.target.value)}
              rows={3}
              placeholder="O que falta e de quem depende?"
            />
          </div>

          {/* Resumo */}
          <div className="space-y-2">
            <Label>Resumo executivo</Label>
            <Textarea
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              rows={5}
              placeholder="Situação atual em frases curtas."
            />
          </div>
        </div>

        <SheetFooter className="sticky bottom-0 bg-white pt-3 -mx-6 px-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={() => setAberto(false)}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button onClick={salvar} disabled={pending}>
            {pending ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}