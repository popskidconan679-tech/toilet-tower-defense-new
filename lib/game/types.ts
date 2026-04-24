// Complete game type definitions for Toilet Tower Defense MVP

export interface Vector2 {
  x: number
  y: number
}

export interface Tower {
  id: string
  unitName: string
  position: Vector2
  gridX: number
  gridY: number
  level: number
  shinyForm: string | null
  traitTier: string | null
  damage: number
  cooldown: number
  range: number
  lastAttack: number
  nextAttack: number
  income?: number
  incomePerSec?: number
}

export interface Enemy {
  id: string
  position: Vector2
  speed: number
  health: number
  maxHealth: number
  pathIndex: number
  wave: number
  bounty: number
  isAlive: boolean
}

export interface GameState {
  wave: number
  maxWave: number
  baseHealth: number
  coins: number
  gems: number
  score: number
  gameOver: boolean
  towers: Tower[]
  enemies: Enemy[]
  path: Vector2[]
  isWaveActive: boolean
  waveStartTime: number
  selectedTower: string | null
  gameTime: number
}

export const GRID_SIZE = 40 // 40px cells for 800x600 canvas (20x15 grid)
export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600

export const ENEMY_SPAWN_INTERVAL = 300 // milliseconds between spawns in wave
export const WAVE_COMPLETION_DELAY = 1500 // milliseconds before next wave auto-starts
