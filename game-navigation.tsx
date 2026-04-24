'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Settings, Home, Backpack, Sparkles, ShoppingCart, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function GameNavigation() {
  const pathname = usePathname()
  const supabase = createClient()

  const navItems = [
    { href: '/game', label: 'Game', icon: Home },
    { href: '/shop', label: 'Shop', icon: ShoppingCart },
    { href: '/inventory', label: 'Inventory', icon: Backpack },
    { href: '/gacha', label: 'Gacha', icon: Sparkles },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-slate-900 border-b border-purple-500/20 px-4 py-3 flex items-center justify-between">
      <div className="flex gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? 'default' : 'ghost'}
                size="sm"
                className={
                  isActive(item.href)
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'hover:bg-slate-800'
                }
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          supabase.auth.signOut()
          window.location.href = '/auth/login'
        }}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </nav>
  )
}
