'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GAMEPASSES } from '@/lib/game-constants'

interface ShopGamepassProps {
  playerStats: any
  onPurchase: () => void
}

export default function ShopGamepass({ playerStats, onPurchase }: ShopGamepassProps) {
  const gamepasses = [
    {
      name: 'x2 Luck Gamepass',
      multiplier: 'x2',
      benefits: ['Double Luck multiplier for 30 days', 'Stack with other gamepasses'],
      price: 499,
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'x5 Luck Gamepass',
      multiplier: 'x5',
      benefits: ['5x Luck multiplier for 30 days', 'Stack with other gamepasses', 'Popular!'],
      price: 999,
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'x10 Luck Gamepass',
      multiplier: 'x10',
      benefits: ['10x Luck multiplier for 30 days', 'Stack with other gamepasses', 'Recommended'],
      price: 1999,
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      name: 'x100 Luck Gamepass',
      multiplier: 'x100',
      benefits: ['100x Luck multiplier for 30 days', 'Stack with other gamepasses', 'INSANE'],
      price: 9999,
      color: 'from-yellow-500 to-yellow-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
        <p className="text-purple-300">
          🎮 Gamepasses multiply your luck gains and stack with other active gamepasses!
        </p>
      </div>

      {/* Gamepass Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gamepasses.map((gp) => (
          <Card key={gp.name} className={`bg-gradient-to-br ${gp.color} p-0 border-0 overflow-hidden`}>
            <div className="bg-slate-900/80 backdrop-blur border border-white/10 p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{gp.name}</h3>
                    <div className="text-3xl font-bold mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                      {gp.multiplier}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <ul className="text-sm text-slate-300 space-y-1">
                  {gp.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span>✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Price and Button */}
                <div className="pt-2 border-t border-white/10">
                  <Button className="w-full bg-white text-black hover:bg-slate-100 font-bold">
                    {gp.price} Gems
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <h4 className="font-bold mb-2 text-slate-300">How Gamepasses Work</h4>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• All active gamepasses multiply your luck</li>
          <li>• Lasts 30 days from purchase</li>
          <li>• Can stack multiple gamepasses</li>
          <li>• Example: x2 + x5 + x10 = x170 multiplier!</li>
        </ul>
      </Card>
    </div>
  )
}
