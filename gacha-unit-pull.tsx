'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getUnitDefinitions, addUnitToInventory, updatePlayerCurrency } from '@/lib/db-helpers'
import { SHINY_GACHA_RATES } from '@/lib/game-constants'
import { toast } from 'sonner'

interface GachaUnitPullProps {
  playerStats: any
  onPull: () => void
}

export default function GachaUnitPull({ playerStats, onPull }: GachaUnitPullProps) {
  const [units, setUnits] = useState<any[]>([])
  const [pulling, setPulling] = useState(false)
  const [pullCount, setPullCount] = useState(1)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    const loadUnits = async () => {
      const data = await getUnitDefinitions()
      setUnits(data)
    }
    loadUnits()
  }, [])

  const getRandomShinyForm = () => {
    const rand = Math.random()
    let cumulative = 0

    for (const [form, rate] of Object.entries(SHINY_GACHA_RATES)) {
      cumulative += rate as number
      if (rand <= cumulative) {
        return form === 'none' ? null : form
      }
    }
    return null
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Supreme':
        return 'text-purple-400 font-bold text-lg'
      case 'Ultimate':
        return 'text-blue-400 font-bold'
      case 'Celestial':
        return 'text-cyan-400'
      default:
        return ''
    }
  }

  const handlePull = async () => {
    try {
      setPulling(true)

      const costPerPull = 100
      const totalCost = costPerPull * pullCount
      
      if ((playerStats?.gems || 0) < totalCost) {
        toast.error(`Need ${totalCost} gems (you have ${playerStats?.gems || 0})`)
        setPulling(false)
        return
      }

      // Deduct gems
      await updatePlayerCurrency(0, -totalCost)

      // Perform pulls
      const newResults = []
      for (let i = 0; i < pullCount; i++) {
        const randomUnit = units[Math.floor(Math.random() * units.length)]
        const shinyForm = getRandomShinyForm()
        
        await addUnitToInventory(randomUnit.id, 1, shinyForm, null)

        newResults.push({
          ...randomUnit,
          shinyForm,
        })
      }

      setResults(newResults)
      toast.success(`Pulled ${pullCount} unit${pullCount > 1 ? 's' : ''}!`)
      onPull()
    } catch (error) {
      console.error('Pull failed:', error)
      toast.error('Pull failed')
    } finally {
      setPulling(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Rates Info */}
      <Card className="bg-purple-600/20 border-purple-500/30 p-4">
        <h4 className="font-bold mb-2 text-purple-300">Drop Rates</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-300">
          <div>🪨 50% Nothing</div>
          <div>✨ 20% Shiny</div>
          <div>🌈 15% Rainbow</div>
          <div>🌑 5% Void</div>
          <div>🌌 3% Galaxy</div>
          <div>💥 2% Supernova</div>
          <div>⭐ 1% Black Hole</div>
          <div>🔥 0.99% Big Bang</div>
          <div>🌍 0.01% Universe</div>
        </div>
      </Card>

      {/* Pull Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 5, 10, 100].map((count) => (
          <Button
            key={count}
            onClick={() => setPullCount(count)}
            variant={pullCount === count ? 'default' : 'outline'}
            className={pullCount === count ? 'bg-purple-600 hover:bg-purple-700' : ''}
            disabled={pulling}
          >
            x{count}
            <div className="text-xs text-slate-400">{count * 100} gems</div>
          </Button>
        ))}
      </div>

      {/* Pull Button */}
      <Button
        size="lg"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
        onClick={handlePull}
        disabled={pulling || (playerStats?.gems || 0) < pullCount * 100}
      >
        {pulling ? 'Pulling...' : `Pull x${pullCount} (${pullCount * 100} Gems)`}
      </Button>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-purple-400">Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {results.map((result, idx) => (
              <Card key={idx} className="bg-slate-900 border-purple-500/20 p-3 text-center">
                <p className={getRarityColor(result.rarity)}>{result.name}</p>
                {result.shinyForm && (
                  <Badge className="mt-1 bg-yellow-600/50 text-yellow-300 border-yellow-500/50">
                    {result.shinyForm}
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
