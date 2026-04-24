'use client'

import { GameState } from '@/lib/game/types'
import { TOWER_UNITS } from '@/lib/game/units'

interface TowerSelectorProps {
  gameState: GameState
  selectedUnit: string | null
  onSelectUnit: (unitId: string | null) => void
}

export default function TowerSelector({
  gameState,
  selectedUnit,
  onSelectUnit,
}: TowerSelectorProps) {
  return (
    <div className="p-4 bg-slate-900 border-t-2 border-indigo-500 max-h-40 overflow-y-auto">
      <div className="text-xs text-slate-400 mb-3 font-semibold">SELECT TOWER</div>

      <div className="grid grid-cols-2 gap-2">
        {Object.values(TOWER_UNITS).map((tower) => {
          const canAfford = gameState.coins >= tower.cost
          const isSelected = selectedUnit === tower.id

          return (
            <button
              key={tower.id}
              onClick={() => (onSelectUnit(isSelected ? null : tower.id))}
              disabled={!canAfford && !isSelected}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-indigo-400 bg-indigo-900'
                  : canAfford
                    ? 'border-slate-600 hover:border-indigo-400 bg-slate-800'
                    : 'border-slate-700 bg-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-sm font-bold text-white">{tower.name}</div>
              <div className="text-xs text-slate-300 mt-1">
                {tower.isIncome ? `+${tower.incomePerSec}/sec` : `${tower.damage} dmg`}
              </div>
              <div
                className={`text-xs mt-1 font-semibold ${
                  canAfford ? 'text-yellow-400' : 'text-slate-500'
                }`}
              >
                $ {tower.cost}
              </div>
            </button>
          )
        })}
      </div>

      {selectedUnit && (
        <div className="mt-3 p-3 bg-slate-800 rounded-lg border border-indigo-400">
          <div className="text-xs text-slate-400 mb-1">SELECTED</div>
          <div className="text-sm text-indigo-300">
            {Object.values(TOWER_UNITS).find((t) => t.id === selectedUnit)?.name}
          </div>
          <div className="text-xs text-slate-400 mt-2">Click on grid to place</div>
        </div>
      )}
    </div>
  )
}
