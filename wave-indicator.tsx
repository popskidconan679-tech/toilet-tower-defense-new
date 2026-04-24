'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface WaveIndicatorProps {
  wave: number
}

export default function WaveIndicator({ wave }: WaveIndicatorProps) {
  return (
    <Card className="bg-slate-900 border-purple-500/20 p-4">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Wave {wave}
          </div>
          <p className="text-slate-400 text-sm">Prepare for incoming enemies</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="text-purple-400 font-semibold">{Math.floor((wave / 50) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-purple-500/30">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
              style={{ width: Math.min((wave / 50) * 100, 100) + '%' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">∞</div>
            <div className="text-xs text-slate-400">Coins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">+</div>
            <div className="text-xs text-slate-400">Gems</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">★</div>
            <div className="text-xs text-slate-400">XP</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
