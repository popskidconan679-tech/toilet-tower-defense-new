'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { mergeDuplicateUnits, getUnitWithBonuses } from '@/lib/db-helpers'
import { SHINY_FORMS, TRAIT_TIERS, TRAIT_BONUSES } from '@/lib/game-constants'
import { toast } from 'sonner'

interface InventoryGridProps {
  units: any[]
  onUnitUpdate: () => void
}

export default function InventoryGrid({ units, onUnitUpdate }: InventoryGridProps) {
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [merging, setMerging] = useState(false)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Supreme':
        return 'from-purple-600 to-purple-700 text-purple-100'
      case 'Ultimate':
        return 'from-blue-600 to-blue-700 text-blue-100'
      case 'Celestial':
        return 'from-cyan-600 to-cyan-700 text-cyan-100'
      default:
        return 'from-slate-600 to-slate-700'
    }
  }

  const getShinyColor = (shinyForm: string | null) => {
    if (!shinyForm) return 'text-slate-400'
    switch (shinyForm) {
      case 'shiny':
        return 'text-yellow-400'
      case 'rainbow':
        return 'text-pink-400'
      case 'void':
        return 'text-purple-900'
      case 'galaxy':
        return 'text-indigo-400'
      case 'supernova':
        return 'text-orange-400'
      case 'black_hole':
        return 'text-slate-800'
      case 'big_bang':
        return 'text-yellow-200'
      case 'universe':
        return 'text-cyan-300'
      default:
        return 'text-slate-400'
    }
  }

  const handleMerge = async () => {
    if (!selectedUnit || selectedUnit.quantity < 2) {
      toast.error('Need 2 or more units to merge')
      return
    }

    try {
      setMerging(true)
      await mergeDuplicateUnits(selectedUnit.id)
      toast.success(`Merged! Unit is now Level ${selectedUnit.level + 1}`)
      onUnitUpdate()
      setSelectedUnit(null)
    } catch (error) {
      console.error('Merge failed:', error)
      toast.error('Merge failed')
    } finally {
      setMerging(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => {
          const bonusMultipliers = unit.trait_tier
            ? TRAIT_BONUSES[unit.trait_tier as keyof typeof TRAIT_BONUSES]
            : { damage: 1, cooldown: 1, range: 1 }

          return (
            <Card
              key={unit.id}
              className={`bg-gradient-to-br ${getRarityColor(
                unit.unit_definitions?.rarity
              )} p-0 border-2 cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 transition overflow-hidden`}
              onClick={() => setSelectedUnit(unit)}
            >
              <div className="bg-slate-900/90 backdrop-blur p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div>
                    <h3 className="font-bold text-lg">{unit.unit_definitions?.name}</h3>
                    <Badge className="mt-1 bg-slate-800/50 border-slate-600">
                      Lvl {unit.level}
                    </Badge>
                  </div>

                  {/* Quantity and Shiny Form */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">
                      Qty: <span className="font-bold text-white">{unit.quantity}</span>
                    </span>
                    {unit.shiny_form && (
                      <span className={`font-bold ${getShinyColor(unit.shiny_form)}`}>
                        ✨ {unit.shiny_form.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Trait */}
                  {unit.trait_tier && (
                    <div className="text-sm">
                      <span className="text-slate-400">Trait: </span>
                      <span className="text-purple-300 font-semibold">{unit.trait_tier.toUpperCase()}</span>
                    </div>
                  )}

                  {/* Stats with Bonuses */}
                  {unit.unit_definitions?.damage_max > 0 && (
                    <div className="text-sm text-slate-400">
                      DMG: {unit.unit_definitions.damage_max.toLocaleString()}
                      {unit.trait_tier && (
                        <span className="text-green-400 ml-1">
                          ×{bonusMultipliers.damage.toFixed(1)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Merge Button */}
                  {unit.quantity >= 2 && (
                    <Button
                      size="sm"
                      className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMerge()
                      }}
                    >
                      Merge ({unit.quantity})
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Unit Detail Dialog */}
      <Dialog open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
        <DialogContent className="bg-slate-900 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-purple-400">{selectedUnit?.unit_definitions?.name}</DialogTitle>
            <DialogDescription className="text-slate-400">
              Level {selectedUnit?.level} • Qty: {selectedUnit?.quantity}
            </DialogDescription>
          </DialogHeader>

          {selectedUnit && (
            <div className="space-y-4">
              {/* Base Stats */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-300">Stats</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {selectedUnit.unit_definitions?.damage_max > 0 && (
                    <>
                      <span className="text-slate-400">Damage:</span>
                      <span className="text-yellow-400">
                        {selectedUnit.unit_definitions.damage_max.toLocaleString()}
                      </span>
                    </>
                  )}
                  {selectedUnit.unit_definitions?.dps_max > 0 && (
                    <>
                      <span className="text-slate-400">DPS:</span>
                      <span className="text-yellow-400">
                        {selectedUnit.unit_definitions.dps_max.toLocaleString()}
                      </span>
                    </>
                  )}
                  {selectedUnit.unit_definitions?.range_max > 0 && (
                    <>
                      <span className="text-slate-400">Range:</span>
                      <span className="text-yellow-400">{selectedUnit.unit_definitions.range_max}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Cosmetics */}
              {(selectedUnit.shiny_form || selectedUnit.trait_tier) && (
                <div className="space-y-2 border-t border-slate-700 pt-4">
                  <h4 className="font-bold text-slate-300">Cosmetics</h4>
                  {selectedUnit.shiny_form && (
                    <div>
                      <span className="text-slate-400">Shiny Form: </span>
                      <span className={`font-bold ${getShinyColor(selectedUnit.shiny_form)}`}>
                        {selectedUnit.shiny_form.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {selectedUnit.trait_tier && (
                    <div>
                      <span className="text-slate-400">Trait: </span>
                      <span className="text-purple-300 font-bold">{selectedUnit.trait_tier.toUpperCase()}</span>
                      <div className="text-sm text-slate-400 mt-1">
                        +{(TRAIT_BONUSES[selectedUnit.trait_tier as keyof typeof TRAIT_BONUSES]?.damage - 1) * 100 | 0}% DMG, +{(TRAIT_BONUSES[selectedUnit.trait_tier as keyof typeof TRAIT_BONUSES]?.range - 1) * 100 | 0}% Range
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Merge Action */}
              {selectedUnit.quantity >= 2 && (
                <div className="border-t border-slate-700 pt-4">
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handleMerge}
                    disabled={merging}
                  >
                    {merging ? 'Merging...' : `Merge ${selectedUnit.quantity} into Level ${selectedUnit.level + 1}`}
                  </Button>
                  <p className="text-xs text-slate-400 mt-2">
                    Merging 2 units combines them into 1 unit at the next level, increasing power!
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
