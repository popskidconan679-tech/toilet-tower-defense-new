'use client'

import { useState, useCallback } from 'react'
import GameCanvas from '@/components/game/game-canvas'
import GameHUD from '@/components/game/game-hud'
import TowerSelector from '@/components/game/tower-selector'
import { GameState } from '@/lib/game/types'
import { initializeGameState } from '@/lib/game/engine'

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>(initializeGameState())
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)

  const handleStateChange = useCallback((newState: GameState) => {
    setGameState(newState)
  }, [])

  const handleStartWave = useCallback(() => {
    if (!gameState.isWaveActive && gameState.enemies.length === 0) {
      setGameState((prev) => ({
        ...prev,
        isWaveActive: true,
      }))
    }
  }, [gameState.isWaveActive, gameState.enemies.length])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b-2 border-indigo-500 p-4">
        <h1 className="text-3xl font-bold text-indigo-400">Toilet Tower Defense</h1>
        <p className="text-slate-400 text-sm mt-1">Defend your bathroom from invading enemies!</p>
      </div>

      {/* Main game area */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Game canvas */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 flex items-center justify-center">
            <GameCanvas
              gameState={gameState}
              onStateChange={handleStateChange}
              selectedUnit={selectedUnit}
            />
          </div>

          {/* Tower selector */}
          <div className="w-full">
            <TowerSelector
              gameState={gameState}
              selectedUnit={selectedUnit}
              onSelectUnit={setSelectedUnit}
            />
          </div>
        </div>

        {/* Right sidebar HUD */}
        <div className="w-72">
          <GameHUD state={gameState} onStartWave={handleStartWave} />
        </div>
      </div>

      {/* Game Over overlay */}
      {gameState.gameOver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-lg border-2 border-red-500 text-center">
            <h2 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h2>
            <p className="text-slate-300 text-lg mb-2">Final Score: {gameState.score}</p>
            <p className="text-slate-400 mb-6">Wave reached: {gameState.maxWave}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
