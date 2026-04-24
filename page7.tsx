'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import ShopUnits from '@/components/shop/shop-units'
import ShopCurrency from '@/components/shop/shop-currency'
import ShopGamepass from '@/components/shop/shop-gamepass'
import ShopVIP from '@/components/shop/shop-vip'
import GameNavigation from '@/components/game-navigation'

export const dynamic = 'force-dynamic'

export default function ShopPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [playerStats, setPlayerStats] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('units')

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push('/auth/login')
        return
      }
      setUser(data.session.user)

      const { data: stats } = await supabase
        .from('player_stats')
        .select('*')
        .eq('user_id', data.session.user.id)
        .single()

      if (stats) {
        setPlayerStats(stats)
      }
      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-950">
      <GameNavigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-purple-500/20 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Shop
        </h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-yellow-500/30">
            <span className="text-yellow-400 font-bold">${playerStats?.coins || 0}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-blue-500/30">
            <span className="text-blue-400 font-bold">{playerStats?.gems || 0}</span>
          </div>
          <Button variant="outline" onClick={() => router.push('/game')}>
            Back to Game
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-800 border border-purple-500/20">
            <TabsTrigger value="units" className="data-[state=active]:bg-purple-600">
              Units
            </TabsTrigger>
            <TabsTrigger value="currency" className="data-[state=active]:bg-purple-600">
              Currency
            </TabsTrigger>
            <TabsTrigger value="gamepass" className="data-[state=active]:bg-purple-600">
              Gamepass
            </TabsTrigger>
            <TabsTrigger value="vip" className="data-[state=active]:bg-purple-600">
              VIP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="mt-6">
            <ShopUnits playerStats={playerStats} onPurchase={() => setPlayerStats({ ...playerStats })} />
          </TabsContent>

          <TabsContent value="currency" className="mt-6">
            <ShopCurrency playerStats={playerStats} />
          </TabsContent>

          <TabsContent value="gamepass" className="mt-6">
            <ShopGamepass playerStats={playerStats} onPurchase={() => setPlayerStats({ ...playerStats })} />
          </TabsContent>

          <TabsContent value="vip" className="mt-6">
            <ShopVIP playerStats={playerStats} onPurchase={() => setPlayerStats({ ...playerStats })} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
