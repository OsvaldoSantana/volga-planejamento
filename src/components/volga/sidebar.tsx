'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, List, KanbanSquare, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',        label: 'Dashboard',    Icon: LayoutDashboard },
  { href: '/obras',   label: 'Obras',        Icon: List },
  { href: '/kanban',  label: 'Kanban',       Icon: KanbanSquare },
  { href: '/config',  label: 'Configurações', Icon: Settings },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col">
      <div className="h-16 px-5 flex items-center border-b border-slate-200">
        <span className="text-xl font-bold text-[var(--volga-deep)]">
          VOLGA
        </span>
        <span className="ml-2 text-xs text-slate-500">
          Planejamento
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, Icon }) => {
          const ativo =
            href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition',
                ativo
                  ? 'bg-[var(--volga-deep)] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 text-[11px] text-slate-400">
        Fase 0 · v0.1
      </div>
    </aside>
  )
}