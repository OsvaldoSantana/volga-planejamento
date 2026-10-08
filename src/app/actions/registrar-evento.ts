'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  obra_id: z.string().uuid(),
  codigo: z.string().min(1), // para revalidar o path correto
  tipo_evento: z.string().min(1),
  data_evento: z.string().refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: 'Data inválida',
  }),
  descricao: z.string().max(1000).optional().nullable(),
})

export type RegistrarEventoInput = z.infer<typeof schema>

export async function registrarEvento(input: RegistrarEventoInput) {
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

  const { error } = await supabase.from('eventos').insert({
    obra_id: parsed.data.obra_id,
    data_evento: parsed.data.data_evento || null,
    tipo_evento: parsed.data.tipo_evento,
    descricao: parsed.data.descricao || null,
    registrado_por: user.id,
  })

  if (error) {
    return { ok: false as const, erro: error.message }
  }

  revalidatePath(`/obras/${parsed.data.codigo}`)
  revalidatePath('/obras')
  revalidatePath('/')
  return { ok: true as const }
}