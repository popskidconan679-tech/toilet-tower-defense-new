'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getUnitDefinitions, purchaseUnit } from '@/lib/db-helpers'
import { toast } from 'sonner'

interface ShopUnitsProps {
  playerStats: any
  onPurchase: () => void
}

export default function ShopUnits({ playerStats, onPurchase }: ShopUnitsProps) {
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const data = await getUnitDefinitions()
        setUnits(data)
      } catch (error) {
        console.error('Failed to load units:', error)
        toast.error('Failed to load units')
      } finally {
        setLoading(false)
      }
    }
    loadUnits()
  }, [])

  const handleBuyUnit = async (unit: any, cost: number, currencyType: 'coins' | 'gems') => {
    try {
      if (currencyType === 'coins' && (playerStats?.coins || 0) < cost) {
        toast.error('Not enough coins!')
        return
      }
      if (currencyType === 'gems' && (playerStats?.gems || 0) < cost) {
        toast.error('Not enough gems!')
        return
      }

      await purchaseUnit(unit.name, cost, currencyType)
      toast.success(`Purchased ${unit.name}!`)
      onPurchase()
    } catch (error) {
      console.error('Purchase failed:', error)
      toast.error('Purchase failed')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading units...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filter/Search */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline">All Units</Badge>
        <Badge variant="outline">Coin Units</Badge>
        <Badge variant="outline">Gem Units</Badge>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => (
          <Card key={unit.id} className="bg-slate-900 border-purple-500/20 p-4 hover:border-purple-500/50 transition">
            <div className="space-y-3">
              {/* Unit Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{unit.name}</h3>
                  <Badge className="mt-1 bg-purple-600/50 text-purple-300 border-purple-500/50">
                    {unit.rarity}
                  </Badge>
                </div>
              </div>

              {/* Stats */}
              <div className="text-sm text-slate-400 space-y-1">
                {unit.damage_max > 0 && (
                  <div>Damage: {unit.damage_max.toLocaleString()}</div>
                )}
                {unit.dps_max > 0 && (
                  <div>DPS: {unit.dps_max.toLocaleString()}</div>
                )}
                {unit.range_max > 0 && (
                  <div>Range: {unit.range_max}</div>
                )}
                {unit.income_max > 0 && (
                  <div>Income: ${unit.income_max.toLocaleString()}</div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-500">{unit.description}</p>

              {/* Buy Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => handleBuyUnit(unit, unit.coin_cost_min, 'coins')}
                  disabled={(playerStats?.coins || 0) < unit.coin_cost_min}
                >
                  ${unit.coin_cost_min}
                </Button>
                {unit.gem_cost > 0 && (
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleBuyUnit(unit, unit.gem_cost, 'gems')}
                    disabled={(playerStats?.gems || 0) < unit.gem_cost}
                  >
                    {unit.gem_cost} Gems
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Lucky Bottles Section */}
      <div className="pt-6 border-t border-slate-700">
        <h3 className="text-xl font-bold mb-4 text-purple-400">Lucky Bottles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900 border-purple-500/20 p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold">Lucky Bottle</h4>
                  <p className="text-sm text-slate-400">+100% Luck</p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                49 Gems
              </Button>
            </div>
          </Card>

          <Card className="bg-slate-900 border-purple-500/20 p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold">Super Lucky Bottle</h4>
                  <p className="text-sm text-slate-400">+1000% Luck</p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                249 Gems
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
