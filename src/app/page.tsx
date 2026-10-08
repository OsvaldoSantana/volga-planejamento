export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Olá, {profile?.nome ?? user.email}
      </h1>
      <p className="text-slate-600 mt-1">
        Papel: <span className="font-medium">{profile?.papel}</span>
      </p>
      <p className="mt-6 text-sm text-slate-500">
        Fase 0 em andamento. Dashboard chega na Fase 1.
      </p>
    </main>
  )
}