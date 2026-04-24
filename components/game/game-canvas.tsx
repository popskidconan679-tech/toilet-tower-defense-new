'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import {
  GameState,
  GRID_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ENEMY_SPAWN_INTERVAL,
  WAVE_COMPLETION_DELAY,
} from '@/lib/game/types'
import {
  updateGameState,
  getGridPosition,
  placeTower,
  sellTower,
  Enemy,
} from '@/lib/game/engine'
import { getTowerData, TOWER_UNITS } from '@/lib/game/units'

interface GameCanvasProps {
  gameState: GameState
  onStateChange: (state: GameState) => void
  selectedUnit: string | null
}

export default function GameCanvas({
  gameState,
  onStateChange,
  selectedUnit,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(Date.now())
  const lastSpawnTimeRef = useRef<number>(0)
  const waveEndTimeRef = useRef<number>(0)
  const spawnQueueRef = useRef<Enemy[]>([])
  const localStateRef = useRef<GameState>(gameState)
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Sync local state ref with prop changes
  useEffect(() => {
    localStateRef.current = gameState
  }, [gameState])

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const now = Date.now()
    const deltaTime = now - lastTimeRef.current
    lastTimeRef.current = now

    let state = localStateRef.current

    // Spawn enemies during wave
    if (state.isWaveActive && spawnQueueRef.current.length > 0) {
      if (now - lastSpawnTimeRef.current > ENEMY_SPAWN_INTERVAL) {
        const newEnemy = spawnQueueRef.current.shift()
        if (newEnemy) {
          state = {
            ...state,
            enemies: [...state.enemies, newEnemy],
          }
          lastSpawnTimeRef.current = now
        }
      }
    }

    // Auto-start next wave if previous finished
    if (
      !state.isWaveActive &&
      state.enemies.length === 0 &&
      !state.gameOver &&
      spawnQueueRef.current.length === 0 &&
      now - waveEndTimeRef.current > WAVE_COMPLETION_DELAY
    ) {
      state.wave++
      state.maxWave = Math.max(state.maxWave, state.wave)
      state.isWaveActive = true

      const enemyCount = Math.min(3 + state.wave, 25)
      const waveHealth = 50 * Math.pow(1.15, state.wave - 1)
      const waveSpeed = 80 * (1 + (state.wave - 1) * 0.05)
      const waveBounty = 10 + Math.floor(state.wave / 2) * 5

      spawnQueueRef.current = Array.from({ length: enemyCount }, (_, i) => ({
        id: `enemy-${state.wave}-${i}`,
        position: { ...state.path[0] },
        speed: waveSpeed,
        health: waveHealth,
        maxHealth: waveHealth,
        pathIndex: 0,
        wave: state.wave,
        bounty: waveBounty,
        isAlive: true,
      }))
      lastSpawnTimeRef.current = now
    }

    // Update game state
    state = updateGameState(state, deltaTime, now)

    if (state.enemies.length === 0 && state.isWaveActive) {
      waveEndTimeRef.current = now
      state.isWaveActive = false
    }

    localStateRef.current = state
    onStateChange(state)

    // Draw game
    drawGame(canvas, state)

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [onStateChange])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animationRef.current)
  }, [gameLoop])

  // Auto-start wave 1 on mount
  useEffect(() => {
    const startInitialWave = () => {
      if (!localStateRef.current.isWaveActive && localStateRef.current.wave === 1) {
        // Create initial enemy spawn queue
        const enemyCount = 3
        const waveHealth = 50
        const waveSpeed = 80
        const waveBounty = 10

        spawnQueueRef.current = Array.from({ length: enemyCount }, (_, i) => ({
          id: `enemy-1-${i}`,
          position: { ...gameState.path[0] },
          speed: waveSpeed,
          health: waveHealth,
          maxHealth: waveHealth,
          pathIndex: 0,
          wave: 1,
          bounty: waveBounty,
          isAlive: true,
        }))

        localStateRef.current.isWaveActive = true
        lastSpawnTimeRef.current = Date.now()
        onStateChange(localStateRef.current)
      }
    }

    const timer = setTimeout(startInitialWave, 500)
    return () => clearTimeout(timer)
  }, [])

  const drawGame = (canvas: HTMLCanvasElement, state: GameState) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw grid
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, CANVAS_HEIGHT)
      ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(CANVAS_WIDTH, y)
      ctx.stroke()
    }

    // Draw path
    ctx.strokeStyle = '#ec4899'
    ctx.lineWidth = 4
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(state.path[0].x, state.path[0].y)
    for (let i = 1; i < state.path.length; i++) {
      ctx.lineTo(state.path[i].x, state.path[i].y)
    }
    ctx.stroke()
    ctx.globalAlpha = 1

    // Draw enemies
    state.enemies.forEach((enemy) => {
      if (enemy.isAlive) {
        const healthPercent = enemy.health / enemy.maxHealth
        const color =
          healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444'

        // Enemy
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(enemy.position.x, enemy.position.y, 6, 0, Math.PI * 2)
        ctx.fill()

        // Health bar
        ctx.fillStyle = '#22c55e'
        ctx.fillRect(enemy.position.x - 6, enemy.position.y - 12, 12 * healthPercent, 2)
        ctx.strokeStyle = '#666'
        ctx.lineWidth = 1
        ctx.strokeRect(enemy.position.x - 6, enemy.position.y - 12, 12, 2)
      }
    })

    // Draw towers
    state.towers.forEach((tower) => {
      const towerData = getTowerData(tower.unitName)

      // Tower base
      ctx.fillStyle = towerData.color
      ctx.fillRect(
        tower.position.x - GRID_SIZE / 2,
        tower.position.y - GRID_SIZE / 2,
        GRID_SIZE,
        GRID_SIZE
      )

      // Tower border
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.strokeRect(
        tower.position.x - GRID_SIZE / 2,
        tower.position.y - GRID_SIZE / 2,
        GRID_SIZE,
        GRID_SIZE
      )

      // Range indicator
      if (selectedUnit) {
        ctx.strokeStyle = '#a78bfa'
        ctx.globalAlpha = 0.1
        ctx.beginPath()
        ctx.arc(tower.position.x, tower.position.y, tower.range, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // Tower level
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(tower.level.toString(), tower.position.x, tower.position.y)
    })

    // Draw preview tower if selecting
    if (selectedUnit) {
      const gridX = Math.floor(mousePos.current.x / GRID_SIZE)
      const gridY = Math.floor(mousePos.current.y / GRID_SIZE)

      if (gridX >= 0 && gridY >= 0 && gridX * GRID_SIZE < CANVAS_WIDTH && gridY * GRID_SIZE < CANVAS_HEIGHT) {
        const cellOccupied = state.towers.some((t) => t.gridX === gridX && t.gridY === gridY)
        const previewColor = cellOccupied ? 'rgba(200, 50, 50, 0.3)' : 'rgba(139, 92, 246, 0.3)'
        
        ctx.fillStyle = previewColor
        ctx.fillRect(gridX * GRID_SIZE, gridY * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        
        if (cellOccupied) {
          ctx.strokeStyle = 'rgba(200, 50, 50, 0.6)'
          ctx.lineWidth = 2
          ctx.strokeRect(gridX * GRID_SIZE, gridY * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        }
      }
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !selectedUnit) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const { gridX, gridY } = getGridPosition(x, y)

    // Check valid placement area
    if (gridX < 0 || gridY < 0 || gridX * GRID_SIZE >= CANVAS_WIDTH || gridY * GRID_SIZE >= CANVAS_HEIGHT) {
      return
    }

    const towerData = getTowerData(selectedUnit)
    const result = placeTower(localStateRef.current, gridX, gridY, selectedUnit, towerData.cost)

    if (result.success) {
      localStateRef.current = result.state
      onStateChange(result.state)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mousePos.current.x = e.clientX - rect.left
    mousePos.current.y = e.clientY - rect.top

    canvas.style.cursor = selectedUnit ? 'pointer' : 'default'
  }

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      className="border-2 border-indigo-500 rounded-lg"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
