'use client'

import { GameState } from '@/lib/game/types'

interface GameHUDProps {
  state: GameState
  onStartWave: () => void
}

export default function GameHUD({ state, onStartWave }: GameHUDProps) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-900 border-l-2 border-indigo-500 h-full min-w-64">
      {/* Wave Info */}
      <div className="p-3 bg-slate-800 rounded-lg border border-indigo-400">
        <div className="text-xs text-slate-400 mb-1">WAVE</div>
        <div className="text-2xl font-bold text-indigo-400">{state.wave}</div>
        <div className="text-xs text-slate-500 mt-1">Max: {state.maxWave}</div>
      </div>

      {/* Base Health */}
      <div className="p-3 bg-slate-800 rounded-lg border border-red-400">
        <div className="text-xs text-slate-400 mb-1">BASE HEALTH</div>
        <div className="text-2xl font-bold text-red-400">{Math.floor(state.baseHealth)}</div>
        <div className="w-full bg-slate-700 rounded h-2 mt-2">
          <div
            className="bg-red-500 h-2 rounded transition-all"
            style={{ width: `${(state.baseHealth / 100) * 100}%` }}
          />
        </div>
      </div>

      {/* Coins */}
      <div className="p-3 bg-slate-800 rounded-lg border border-yellow-400">
        <div className="text-xs text-slate-400 mb-1">COINS</div>
        <div className="text-2xl font-bold text-yellow-400">$ {state.coins}</div>
      </div>

      {/* Gems */}
      <div className="p-3 bg-slate-800 rounded-lg border border-cyan-400">
        <div className="text-xs text-slate-400 mb-1">GEMS</div>
        <div className="text-2xl font-bold text-cyan-400">◆ {state.gems}</div>
      </div>

      {/* Enemies */}
      <div className="p-3 bg-slate-800 rounded-lg border border-pink-400">
        <div className="text-xs text-slate-400 mb-1">ENEMIES</div>
        <div className="text-2xl font-bold text-pink-400">{state.enemies.length}</div>
      </div>

      {/* Towers */}
      <div className="p-3 bg-slate-800 rounded-lg border border-purple-400">
        <div className="text-xs text-slate-400 mb-1">TOWERS</div>
        <div className="text-2xl font-bold text-purple-400">{state.towers.length}</div>
      </div>

      {/* Wave Control */}
      <button
        onClick={onStartWave}
        disabled={state.isWaveActive || state.gameOver}
        className="w-full p-3 mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white font-bold rounded-lg transition-colors"
      >
        {state.gameOver ? 'GAME OVER' : state.isWaveActive ? 'WAVE ACTIVE' : 'START WAVE'}
      </button>

      {/* Score */}
      <div className="p-3 bg-slate-800 rounded-lg border border-slate-600 mt-auto">
        <div className="text-xs text-slate-400 mb-1">SCORE</div>
        <div className="text-xl font-bold text-slate-200">{state.score}</div>
      </div>
    </div>
  )
}
