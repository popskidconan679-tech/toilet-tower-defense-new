// Complete game engine for Toilet Tower Defense MVP

import {
  Vector2,
  Tower,
  Enemy,
  GameState,
  GRID_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ENEMY_SPAWN_INTERVAL,
  WAVE_COMPLETION_DELAY,
} from './types'

// Generate enemy path across the map
export const generateEnemyPath = (): Vector2[] => {
  return [
    { x: 40, y: 300 },
    { x: 200, y: 300 },
    { x: 200, y: 150 },
    { x: 400, y: 150 },
    { x: 400, y: 450 },
    { x: 600, y: 450 },
    { x: 600, y: 250 },
    { x: 760, y: 250 },
  ]
}

// Get enemy stats for current wave (scaling system)
export const getEnemyStatsForWave = (wave: number) => {
  const baseHealth = 50
  const baseSpeed = 80 // pixels per second
  const baseReward = 10

  return {
    health: baseHealth * Math.pow(1.15, wave - 1),
    speed: baseSpeed * (1 + (wave - 1) * 0.05),
    reward: baseReward + Math.floor(wave / 2) * 5,
  }
}

// Spawn enemies for a wave
export const spawnWaveEnemies = (
  wave: number,
  path: Vector2[],
  existingEnemies: Enemy[]
): { enemies: Enemy[]; spawnQueue: Enemy[] } => {
  const enemyCount = Math.min(3 + wave, 25) // 3-25 enemies per wave
  const stats = getEnemyStatsForWave(wave)
  const spawnQueue: Enemy[] = []

  for (let i = 0; i < enemyCount; i++) {
    spawnQueue.push({
      id: `enemy-${wave}-${i}`,
      position: { ...path[0] },
      speed: stats.speed,
      health: stats.health,
      maxHealth: stats.health,
      pathIndex: 0,
      wave,
      bounty: stats.reward,
      isAlive: true,
    })
  }

  return { enemies: existingEnemies, spawnQueue }
}

// Update enemy positions along path
export const updateEnemies = (
  enemies: Enemy[],
  path: Vector2[],
  deltaTime: number
): { enemies: Enemy[]; completedCount: number; deadCount: number } => {
  let completedCount = 0
  let deadCount = 0
  const tolerance = 2

  const updatedEnemies = enemies
    .map((enemy) => {
      if (!enemy.isAlive) return enemy

      // Calculate movement distance
      const distanceToMove = (enemy.speed * deltaTime) / 1000 // deltaTime in ms
      let remainingDistance = distanceToMove
      let currentEnemy = { ...enemy }

      // Move along path
      while (remainingDistance > 0 && currentEnemy.pathIndex < path.length - 1) {
        const currentWaypoint = path[currentEnemy.pathIndex]
        const nextWaypoint = path[currentEnemy.pathIndex + 1]

        const dx = nextWaypoint.x - currentEnemy.position.x
        const dy = nextWaypoint.y - currentEnemy.position.y
        const distToWaypoint = Math.hypot(dx, dy)

        if (distToWaypoint <= tolerance) {
          // Move to next waypoint
          currentEnemy.pathIndex++
          if (currentEnemy.pathIndex < path.length) {
            currentEnemy.position = { ...path[currentEnemy.pathIndex] }
          }
        } else if (distToWaypoint <= remainingDistance) {
          // Move to waypoint exactly
          remainingDistance -= distToWaypoint
          const angle = Math.atan2(dy, dx)
          currentEnemy.position.x += Math.cos(angle) * distToWaypoint
          currentEnemy.position.y += Math.sin(angle) * distToWaypoint
          currentEnemy.pathIndex++
        } else {
          // Move partway to next waypoint
          const angle = Math.atan2(dy, dx)
          currentEnemy.position.x += Math.cos(angle) * remainingDistance
          currentEnemy.position.y += Math.sin(angle) * remainingDistance
          remainingDistance = 0
        }
      }

      // Check if reached end
      if (currentEnemy.pathIndex >= path.length - 1) {
        currentEnemy.isAlive = false
        completedCount++
      }

      return currentEnemy
    })
    .filter((e) => e.isAlive || e.pathIndex >= path.length - 1)

  return { enemies: updatedEnemies, completedCount, deadCount }
}

// Calculate tower damage with trait bonuses
export const calculateDamage = (tower: Tower): number => {
  let damage = tower.damage

  if (tower.traitTier) {
    const traitMultipliers: Record<string, number> = {
      common: 1.1,
      rare: 1.2,
      mythic: 1.3,
      supernova: 1.5,
      gamma: 1.7,
      black_hole: 2,
      big_bang: 3,
      universe: 4,
      multiverse: 11,
    }
    damage *= traitMultipliers[tower.traitTier] || 1
  }

  return Math.floor(damage)
}

// Get enemies in range of tower
export const getEnemiesInRange = (tower: Tower, enemies: Enemy[]): Enemy[] => {
  return enemies.filter((enemy) => {
    if (!enemy.isAlive) return false
    const distance = Math.hypot(
      tower.position.x - enemy.position.x,
      tower.position.y - enemy.position.y
    )
    return distance <= tower.range
  })
}

// Tower attacks nearest enemy
export const towerAttack = (
  tower: Tower,
  enemies: Enemy[],
  currentTime: number
): { tower: Tower; enemies: Enemy[] } => {
  if (currentTime < tower.nextAttack) {
    return { tower, enemies }
  }

  const enemiesInRange = getEnemiesInRange(tower, enemies)
  if (enemiesInRange.length === 0) {
    return { tower, enemies }
  }

  // Target closest enemy
  const target = enemiesInRange.reduce((closest, enemy) => {
    const closestDist = Math.hypot(
      tower.position.x - closest.position.x,
      tower.position.y - closest.position.y
    )
    const enemyDist = Math.hypot(
      tower.position.x - enemy.position.x,
      tower.position.y - enemy.position.y
    )
    return enemyDist < closestDist ? enemy : closest
  })

  const damage = calculateDamage(tower)
  const updatedEnemies = enemies.map((e) => {
    if (e.id === target.id) {
      return {
        ...e,
        health: Math.max(0, e.health - damage),
        isAlive: e.health - damage > 0,
      }
    }
    return e
  })

  const updatedTower = {
    ...tower,
    lastAttack: currentTime,
    nextAttack: currentTime + tower.cooldown * 1000,
  }

  return { tower: updatedTower, enemies: updatedEnemies }
}

// Initialize game state
export const initializeGameState = (): GameState => {
  const path = generateEnemyPath()

  return {
    wave: 1,
    maxWave: 1,
    baseHealth: 100,
    coins: 100,
    gems: 0,
    score: 0,
    gameOver: false,
    towers: [],
    enemies: [],
    path,
    isWaveActive: false,
    waveStartTime: 0,
    selectedTower: null,
    gameTime: 0,
  }
}

// Place tower on grid
export const placeTower = (
  state: GameState,
  gridX: number,
  gridY: number,
  unitName: string,
  cost: number
): { success: boolean; state: GameState; error?: string } => {
  // Check if can afford
  if (state.coins < cost) {
    return { success: false, state, error: 'Not enough coins' }
  }

  // Check if cell is empty
  const cellOccupied = state.towers.some((t) => t.gridX === gridX && t.gridY === gridY)
  if (cellOccupied) {
    return { success: false, state, error: 'Cell occupied' }
  }

  const tower: Tower = {
    id: `tower-${Date.now()}`,
    unitName,
    position: { x: gridX * GRID_SIZE + GRID_SIZE / 2, y: gridY * GRID_SIZE + GRID_SIZE / 2 },
    gridX,
    gridY,
    level: 1,
    shinyForm: null,
    traitTier: null,
    damage: 15,
    cooldown: 0.5,
    range: 100,
    lastAttack: 0,
    nextAttack: 0,
  }

  return {
    success: true,
    state: {
      ...state,
      towers: [...state.towers, tower],
      coins: state.coins - cost,
    },
  }
}

// Sell tower
export const sellTower = (
  state: GameState,
  towerId: string,
  sellPrice: number
): GameState => {
  return {
    ...state,
    towers: state.towers.filter((t) => t.id !== towerId),
    coins: state.coins + sellPrice,
  }
}

// Get cells in grid
export const getGridPosition = (x: number, y: number): { gridX: number; gridY: number } => {
  return {
    gridX: Math.floor(x / GRID_SIZE),
    gridY: Math.floor(y / GRID_SIZE),
  }
}

// Complete game update loop
export const updateGameState = (
  state: GameState,
  deltaTime: number,
  currentTime: number
): GameState => {
  let newState = { ...state, gameTime: state.gameTime + deltaTime }

  // Update enemies
  const { enemies: updatedEnemies, completedCount } = updateEnemies(
    newState.enemies,
    newState.path,
    deltaTime
  )
  newState.enemies = updatedEnemies

  // Handle enemies reaching base
  const healthLoss = completedCount
  newState.baseHealth = Math.max(0, newState.baseHealth - healthLoss)

  // Update towers and have them attack
  const updatedTowers: Tower[] = []
  let updatedEnemies2 = newState.enemies

  for (const tower of newState.towers) {
    const { tower: updatedTower, enemies: afterAttack } = towerAttack(
      tower,
      updatedEnemies2,
      currentTime
    )
    updatedTowers.push(updatedTower)
    updatedEnemies2 = afterAttack
  }

  newState.towers = updatedTowers
  newState.enemies = updatedEnemies2

  // Calculate coins and gems from killed enemies
  let coinsEarned = 0
  let gemsEarned = 0

  newState.enemies = newState.enemies.filter((enemy) => {
    if (enemy.health <= 0 && enemy.isAlive) {
      coinsEarned += enemy.bounty
      if (Math.random() < 0.01) {
        gemsEarned += 1
      }
      return false
    }
    return true
  })

  newState.coins += coinsEarned
  newState.gems += gemsEarned
  newState.score += coinsEarned + gemsEarned * 10

  // Check wave completion
  if (newState.isWaveActive && newState.enemies.length === 0) {
    newState.isWaveActive = false
  }

  // Check game over
  if (newState.baseHealth <= 0) {
    newState.gameOver = true
  }

  return newState
}
