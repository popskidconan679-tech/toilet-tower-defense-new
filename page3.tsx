'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GachaUnitPull from '@/components/gacha/gacha-unit-pull'
import GachaShinyTransform from '@/components/gacha/gacha-shiny-transform'
import GachaTraitSystem from '@/components/gacha/gacha-trait-system'
import GameNavigation from '@/components/game-navigation'

export const dynamic = 'force-dynamic'

export default function GachaPage() {
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
          Gacha System
        </h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-blue-500/30">
            <span className="text-blue-400 font-bold">{playerStats?.gems || 0} Gems</span>
          </div>
          <Button variant="outline" onClick={() => router.push('/game')}>
            Back to Game
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-slate-800 border border-purple-500/20">
            <TabsTrigger value="units" className="data-[state=active]:bg-purple-600">
              Unit Summon
            </TabsTrigger>
            <TabsTrigger value="shiny" className="data-[state=active]:bg-purple-600">
              Shiny Transform
            </TabsTrigger>
            <TabsTrigger value="trait" className="data-[state=active]:bg-purple-600">
              Trait System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="mt-6">
            <GachaUnitPull playerStats={playerStats} onPull={() => setPlayerStats({ ...playerStats })} />
          </TabsContent>

          <TabsContent value="shiny" className="mt-6">
            <GachaShinyTransform playerStats={playerStats} onTransform={() => setPlayerStats({ ...playerStats })} />
          </TabsContent>

          <TabsContent value="trait" className="mt-6">
            <GachaTraitSystem playerStats={playerStats} onApply={() => setPlayerStats({ ...playerStats })} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
