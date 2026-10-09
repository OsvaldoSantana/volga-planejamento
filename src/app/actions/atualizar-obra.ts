'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  id: z.string().uuid(),
  codigo: z.string().min(1),
  status: z.enum(['No prazo', 'Atenção', 'Bloqueado', 'Não avaliado']),
  situacao_cronograma: z.string().nullable(),
  cadencia_reuniao: z.string().nullable(),
  agenda_reuniao: z.string().nullable(),
  data_mobilizacao: z.string().nullable(),
  mobilizacao_texto: z.string().nullable(),
  situacao_mobilizacao: z.string().nullable(),
  pendencia: z.string().nullable(),
  resumo_executivo: z.string().nullable(),
})

export type AtualizarObraInput = z.infer<typeof schema>

export async function atualizarObra(input: AtualizarObraInput) {
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { ok: false as const, erro: 'Dados inválidos.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false as const, erro: 'Não autenticado.' }
  }

  const {
    id,
    codigo,
    data_mobilizacao,
    mobilizacao_texto,
    ...rest
  } = parsed.data

  const { error } = await supabase
    .from('obras')
    .update({
      ...rest,
      data_mobilizacao: data_mobilizacao || null,
      mobilizacao_texto: mobilizacao_texto || null,
    })
    .eq('id', id)

  if (error) return { ok: false as const, erro: error.message }

  revalidatePath('/')
  revalidatePath('/obras')
  revalidatePath(`/obras/${codigo}`)
  return { ok: true as const }
}