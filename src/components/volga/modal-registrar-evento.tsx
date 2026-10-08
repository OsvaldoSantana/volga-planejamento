'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { registrarEvento } from '@/app/actions/registrar-evento'

const TIPOS = [
  'Linha de base',
  'Definição de mobilização',
  'Envio para validação',
  'Retorno do PM',
  'Validação do PM',
  'Entrega de cronograma',
  'Atualização de cronograma',
  'Reunião',
  'Pendência / bloqueio',
  'Solicitação de demanda',
  'Outro',
]

function hoje() {
  return new Date().toISOString().slice(0, 10)
}

export function ModalRegistrarEvento({
  obraId,
  codigo,
}: {
  obraId: string
  codigo: string
}) {
  const [aberto, setAberto] = useState(false)
  const [tipo, setTipo] = useState(TIPOS[0])
  const [data, setData] = useState(hoje())
  const [descricao, setDescricao] = useState('')
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function reset() {
    setTipo(TIPOS[0])
    setData(hoje())
    setDescricao('')
  }

  function salvar() {
    startTransition(async () => {
      const r = await registrarEvento({
        obra_id: obraId,
        codigo,
        tipo_evento: tipo,
        data_evento: data,
        descricao: descricao.trim() || null,
      })
      if (!r.ok) {
        toast.error('Não foi possível salvar', { description: r.erro })
        return
      }
      toast.success('Evento registrado')
      setAberto(false)
      reset()
      router.refresh()
    })
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Registrar evento
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar evento</DialogTitle>
          <DialogDescription>
            O evento é adicionado ao histórico desta obra e alimenta o cálculo
            de &ldquo;dias sem interação&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de evento</Label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="O que aconteceu? Seja breve e objetivo."
              rows={4}
              maxLength={1000}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setAberto(false)}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button onClick={salvar} disabled={pending}>
            {pending ? 'Salvando…' : 'Salvar evento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}