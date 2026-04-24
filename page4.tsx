'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import GameCanvas from '@/components/game/game-canvas'
import GameHUD from '@/components/game/game-hud'
import WaveIndicator from '@/components/game/wave-indicator'
import GameNavigation from '@/components/game-navigation'

export const dynamic = 'force-dynamic'

export default function GamePage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [gameState, setGameState] = useState<{
    wave: number
    coins: number
    gems: number
    luck: number
    health: number
    isVIP: boolean
  } | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push('/auth/login')
        return
      }
      setUser(data.session.user)
      
      // Load initial game state
      const { data: stats } = await supabase
        .from('player_stats')
        .select('*')
        .eq('user_id', data.session.user.id)
        .single()

      const { data: userData } = await supabase
        .from('users')
        .select('is_vip')
        .eq('id', data.session.user.id)
        .single()

      if (stats) {
        setGameState({
          wave: 1,
          coins: parseInt(stats.coins),
          gems: parseInt(stats.gems),
          luck: stats.luck || 0,
          health: 100,
          isVIP: userData?.is_vip || false,
        })
      }

      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">Loading game...</p>
        </div>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <Card className="p-6 bg-slate-900 border-purple-500/30">
          <p className="text-red-500 mb-4">Failed to load game state</p>
          <Button onClick={() => router.push('/auth/login')}>Back to Login</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-screen bg-slate-950 overflow-hidden">
      {/* Navigation */}
      <GameNavigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-purple-500/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Toilet Tower Defense
          </h1>
          {gameState.isVIP && (
            <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-sm text-yellow-400 font-semibold">
              VIP
            </span>
          )}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Game Canvas */}
        <div className="flex-1 rounded-lg border border-purple-500/20 bg-slate-900 overflow-hidden shadow-lg shadow-purple-500/10">
          <GameCanvas gameState={gameState} setGameState={setGameState} />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex flex-col gap-4 overflow-auto">
          {/* HUD Stats */}
          <GameHUD gameState={gameState} />

          {/* Wave Info */}
          <WaveIndicator wave={gameState.wave} />
        </div>
      </div>
    </div>
  )
}
