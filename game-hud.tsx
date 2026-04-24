'use client'

import { Card } from '@/components/ui/card'

interface GameHUDProps {
  gameState: {
    coins: number
    gems: number
    luck: number
    health: number
    isVIP: boolean
  }
}

export default function GameHUD({ gameState }: GameHUDProps) {
  return (
    <Card className="bg-slate-900 border-purple-500/20 p-4 space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Coins</span>
          <span className="font-bold text-yellow-400">${gameState.coins.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-yellow-500/30">
          <div
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Gems</span>
          <span className="font-bold text-blue-400">{gameState.gems}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-blue-500/30">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full"
            style={{ width: Math.min((gameState.gems / 1000) * 100, 100) + '%' }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Luck</span>
          <span className="font-bold text-purple-400">{gameState.luck.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-purple-500/30">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-400 h-full"
            style={{ width: Math.min(gameState.luck, 100) + '%' }}
          />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-700">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Health</span>
          <span className="font-bold text-red-400">{gameState.health}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-red-500/30">
          <div
            className="bg-gradient-to-r from-red-500 to-orange-400 h-full transition-all"
            style={{ width: gameState.health + '%' }}
          />
        </div>
      </div>
    </Card>
  )
}
