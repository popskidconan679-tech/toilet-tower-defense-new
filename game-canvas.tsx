'use client'

import { useRef, useEffect, useState } from 'react'
import { generateEnemyPath, spawnWaveEnemies, updateGameState, type GameState } from '@/lib/game-logic'

interface GameCanvasProps {
  gameState: any
  setGameState: (state: any) => void
}

export default function GameCanvas({ gameState, setGameState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameLogicState, setGameLogicState] = useState<GameState | null>(null)
  const [path, setPath] = useState<any[]>([])
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  // Initialize game state
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gamePath = generateEnemyPath(canvas.width, canvas.height)
    setPath(gamePath)

    setGameLogicState({
      wave: 1,
      health: 100,
      coins: gameState.coins || 0,
      gems: gameState.gems || 0,
      score: 0,
      gameOver: false,
      towers: [],
      enemies: spawnWaveEnemies(1, gamePath, []),
      path: gamePath,
      isWaveActive: true,
    })

    lastTimeRef.current = Date.now()
  }, [gameState.coins, gameState.gems])

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameLogicState) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateAndRender = () => {
      const now = Date.now()
      const deltaTime = now - lastTimeRef.current
      lastTimeRef.current = now

      // Update game state
      const newState = updateGameState(gameLogicState, deltaTime, now)
      setGameLogicState(newState)

      // Update main game state
      setGameState({
        ...gameState,
        coins: newState.coins,
        gems: newState.gems,
        health: newState.health,
      })

      // Draw game
      drawGame(ctx, canvas, newState)
      animationRef.current = requestAnimationFrame(updateAndRender)
    }

    animationRef.current = requestAnimationFrame(updateAndRender)

    return () => cancelAnimationFrame(animationRef.current)
  }, [gameLogicState, gameState, setGameState])

  const drawGame = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    state: GameState
  ) => {
    // Clear canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#1e1b4b')
    gradient.addColorStop(1, '#0f172a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#6366f1'
    ctx.globalAlpha = 0.1
    const gridSize = 50
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // Draw enemy path
    ctx.strokeStyle = '#ec4899'
    ctx.globalAlpha = 0.4
    ctx.lineWidth = 3
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
        const color = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444'

        // Enemy body
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(enemy.position.x, enemy.position.y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Health bar
        ctx.fillStyle = '#22c55e'
        ctx.fillRect(enemy.position.x - 8, enemy.position.y - 15, 16 * healthPercent, 3)
        ctx.strokeStyle = '#666'
        ctx.strokeRect(enemy.position.x - 8, enemy.position.y - 15, 16, 3)
      }
    })

    // Draw towers
    state.towers.forEach((tower) => {
      // Tower base
      ctx.fillStyle = '#8b5cf6'
      ctx.fillRect(tower.position.x - 20, tower.position.y - 20, 40, 40)
      ctx.strokeStyle = '#a78bfa'
      ctx.lineWidth = 2
      ctx.strokeRect(tower.position.x - 20, tower.position.y - 20, 40, 40)

      // Range indicator (faint)
      ctx.strokeStyle = '#a78bfa'
      ctx.globalAlpha = 0.2
      ctx.beginPath()
      ctx.arc(tower.position.x, tower.position.y, tower.range, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1

      // Tower level
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(tower.level.toString(), tower.position.x, tower.position.y)
    })

    // Draw UI text
    ctx.fillStyle = '#a78bfa'
    ctx.globalAlpha = 0.8
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Wave ' + state.wave, 20, 30)
    ctx.fillText('Enemies: ' + state.enemies.length, 20, 50)
    ctx.fillText('Towers: ' + state.towers.length, 20, 70)

    if (state.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 48px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2)
    }

    ctx.globalAlpha = 1
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !gameLogicState) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // TODO: Implement tower placement logic
    console.log('[v0] Clicked at:', x, y)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }, [])

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="w-full h-full cursor-crosshair"
    />
  )
}
