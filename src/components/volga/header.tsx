'use client'
import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export function Header({
  nome,
  papel,
}: {
  nome: string
  papel: string
}) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
      <div className="text-sm text-slate-500">
        {/* breadcrumb placeholder — preenchido por página no futuro */}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-[var(--volga-forest)] text-white grid place-items-center text-xs font-semibold">
              {nome.slice(0, 2).toUpperCase()}
            </span>
            <div className="text-left">
              <div className="text-sm font-medium leading-tight">{nome}</div>
              <div className="text-[11px] text-slate-500 leading-tight">{papel}</div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem disabled>
            <UserIcon className="h-4 w-4 mr-2" /> Meu perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}