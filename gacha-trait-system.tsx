'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getPlayerUnits, applyTraitToUnit, updatePlayerCurrency } from '@/lib/db-helpers'
import { TRAIT_RATES, TRAIT_BONUSES } from '@/lib/game-constants'
import { toast } from 'sonner'

interface GachaTraitSystemProps {
  playerStats: any
  onApply: () => void
}

export default function GachaTraitSystem({ playerStats, onApply }: GachaTraitSystemProps) {
  const [playerUnits, setPlayerUnits] = useState<any[]>([])
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    const loadUnits = async () => {
      const data = await getPlayerUnits()
      setPlayerUnits(data)
    }
    loadUnits()
  }, [])

  const traitOptions = [
    {
      tier: 'common',
      name: 'Common Trait',
      cost: 50,
      rate: '50%',
      bonus: { damage: '+10%', cooldown: '-10%', range: '+0%' },
    },
    {
      tier: 'rare',
      name: 'Rare Trait',
      cost: 100,
      rate: '25%',
      bonus: { damage: '+20%', cooldown: '-20%', range: '+10%' },
    },
    {
      tier: 'mythic',
      name: 'Mythic Trait',
      cost: 200,
      rate: '10%',
      bonus: { damage: '+30%', cooldown: '-30%', range: '+30%' },
    },
    {
      tier: 'supernova',
      name: 'Supernova Trait',
      cost: 500,
      rate: '5%',
      bonus: { damage: '+50%', cooldown: '-50%', range: '+50%' },
    },
    {
      tier: 'gamma',
      name: 'Gamma Trait',
      cost: 700,
      rate: '5%',
      bonus: { damage: '+70%', cooldown: '-30%', range: '+50%' },
    },
    {
      tier: 'black_hole',
      name: 'Black Hole Trait',
      cost: 1000,
      rate: '4.9%',
      bonus: { damage: '+100%', cooldown: '-70%', range: '+70%' },
    },
    {
      tier: 'big_bang',
      name: 'Big Bang Trait',
      cost: 2000,
      rate: '0.09%',
      bonus: { damage: '+200%', cooldown: '-78%', range: '+80%' },
    },
    {
      tier: 'universe',
      name: 'Universe Trait',
      cost: 3500,
      rate: '0.009%',
      bonus: { damage: '+300%', cooldown: '-80%', range: '+80%' },
    },
    {
      tier: 'multiverse',
      name: 'Multiverse Trait',
      cost: 5000,
      rate: '0.001%',
      bonus: { damage: '+1000%', cooldown: '-90%', range: '+100%' },
    },
  ]

  const handleApply = async (trait: string, cost: number) => {
    if (!selectedUnit) return

    try {
      setApplying(true)

      if ((playerStats?.gems || 0) < cost) {
        toast.error(`Need ${cost} gems`)
        return
      }

      await applyTraitToUnit(selectedUnit.id, trait, cost)
      toast.success(`Applied ${trait} trait!`)
      onApply()

      // Reload units
      const data = await getPlayerUnits()
      setPlayerUnits(data)
      setSelectedUnit(null)
    } catch (error) {
      console.error('Apply failed:', error)
      toast.error('Apply failed')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-purple-600/20 border-purple-500/30 p-4">
        <p className="text-purple-300">
          🎨 Apply powerful traits to units for massive stat bonuses!
        </p>
      </Card>

      {/* Unit Selection */}
      {selectedUnit ? (
        <Card className="bg-slate-900 border-purple-500/20 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedUnit.unit_definitions?.name}</h3>
              <p className="text-slate-400">Level {selectedUnit.level}</p>
            </div>

            {/* Current Trait */}
            {selectedUnit.trait_tier && (
              <div className="bg-slate-800/50 p-2 rounded">
                <p className="text-sm text-slate-400">Current Trait:</p>
                <p className="font-bold text-purple-300">{selectedUnit.trait_tier.toUpperCase()}</p>
              </div>
            )}

            {/* Trait Options */}
            <div className="grid grid-cols-1 gap-2">
              {traitOptions.map((option) => (
                <Button
                  key={option.tier}
                  onClick={() => handleApply(option.tier, option.cost)}
                  disabled={
                    applying || (playerStats?.gems || 0) < option.cost || selectedUnit.trait_tier === option.tier
                  }
                  className="justify-between h-auto p-3 bg-slate-800 hover:bg-slate-700 border border-purple-500/30"
                >
                  <div className="text-left">
                    <div className="font-bold">{option.name}</div>
                    <div className="text-xs text-slate-400 space-x-2">
                      <span>{option.rate}</span>
                      <span className="text-purple-300">{option.bonus.damage} DMG</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-400">{option.cost}</div>
                    <div className="text-xs">gems</div>
                  </div>
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setSelectedUnit(null)}
              disabled={applying}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-purple-400">Select a Unit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {playerUnits.map((unit) => (
              <Card
                key={unit.id}
                className="bg-slate-900 border-purple-500/20 p-3 cursor-pointer hover:border-purple-500/50 transition"
                onClick={() => setSelectedUnit(unit)}
              >
                <p className="font-bold">{unit.unit_definitions?.name}</p>
                <p className="text-sm text-slate-400">Level {unit.level}</p>
                {unit.trait_tier && (
                  <Badge className="mt-1 bg-purple-600/50 text-purple-300 border-purple-500/50 text-xs">
                    {unit.trait_tier}
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
