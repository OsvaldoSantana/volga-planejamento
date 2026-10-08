import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/volga/sidebar'
import { Header } from '@/components/volga/header'

export const dynamic = 'force-dynamic'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome, papel')
    .eq('id', user.id)
    .single()

  const nome = profile?.nome ?? user.email ?? 'Usuário'
  const papel = profile?.papel ?? 'leitor'

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header nome={nome} papel={papel} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
