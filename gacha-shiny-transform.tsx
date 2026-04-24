'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getPlayerUnits, transformUnitShiny, updatePlayerCurrency } from '@/lib/db-helpers'
import { SHINY_GACHA_RATES } from '@/lib/game-constants'
import { toast } from 'sonner'

interface GachaShinyTransformProps {
  playerStats: any
  onTransform: () => void
}

export default function GachaShinyTransform({ playerStats, onTransform }: GachaShinyTransformProps) {
  const [playerUnits, setPlayerUnits] = useState<any[]>([])
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [transforming, setTransforming] = useState(false)

  useEffect(() => {
    const loadUnits = async () => {
      const data = await getPlayerUnits()
      setPlayerUnits(data)
    }
    loadUnits()
  }, [])

  const shinyOptions = [
    { form: 'shiny', name: 'Shiny', cost: 100, rate: '20%' },
    { form: 'rainbow', name: 'Rainbow', cost: 200, rate: '15%' },
    { form: 'void', name: 'Void', cost: 500, rate: '5%' },
    { form: 'galaxy', name: 'Galaxy', cost: 750, rate: '3%' },
    { form: 'galaxy_void', name: 'Galaxy Void', cost: 1000, rate: '2%' },
    { form: 'supernova', name: 'Supernova', cost: 1500, rate: '2%' },
    { form: 'black_hole', name: 'Black Hole', cost: 2000, rate: '1%' },
    { form: 'super_black_hole', name: 'Super Black Hole', cost: 2500, rate: '1%' },
    { form: 'big_bang', name: 'Big Bang', cost: 3000, rate: '0.99%' },
    { form: 'universe', name: 'Universe', cost: 5000, rate: '0.01%' },
  ]

  const handleTransform = async (shinyForm: string, cost: number) => {
    if (!selectedUnit) return

    try {
      setTransforming(true)

      if ((playerStats?.gems || 0) < cost) {
        toast.error(`Need ${cost} gems`)
        return
      }

      await transformUnitShiny(selectedUnit.id, shinyForm, cost)
      toast.success(`Transformed to ${shinyForm}!`)
      onTransform()

      // Reload units
      const data = await getPlayerUnits()
      setPlayerUnits(data)
      setSelectedUnit(null)
    } catch (error) {
      console.error('Transform failed:', error)
      toast.error('Transform failed')
    } finally {
      setTransforming(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-blue-600/20 border-blue-500/30 p-4">
        <p className="text-blue-300">
          ✨ Transform your units into rare shiny forms with unique visual effects!
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

            {/* Shiny Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {shinyOptions.map((option) => (
                <Button
                  key={option.form}
                  onClick={() => handleTransform(option.form, option.cost)}
                  disabled={transforming || (playerStats?.gems || 0) < option.cost}
                  className="justify-between h-auto p-3 bg-slate-800 hover:bg-slate-700 border border-purple-500/30"
                >
                  <div className="text-left">
                    <div className="font-bold">{option.name}</div>
                    <div className="text-xs text-slate-400">{option.rate} drop rate</div>
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
              disabled={transforming}
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
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
