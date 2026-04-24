// Game logic engine for Toilet Tower Defense

import { GAME_UNITS } from './game-constants'

export interface Vector2 {
  x: number
  y: number
}

export interface Tower {
  id: string
  unitName: string
  position: Vector2
  level: number
  shinyForm: string | null
  traitTier: string | null
  damage: number
  cooldown: number
  range: number
  lastAttack: number
  nextAttack: number
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
  health: number
  coins: number
  gems: number
  score: number
  gameOver: boolean
  towers: Tower[]
  enemies: Enemy[]
  path: Vector2[]
  isWaveActive: boolean
}

// Enemy path (simplified straight line)
export const generateEnemyPath = (canvasWidth: number, canvasHeight: number): Vector2[] => {
  return [
    { x: 50, y: canvasHeight / 2 },
    { x: canvasWidth / 4, y: canvasHeight / 2 },
    { x: (canvasWidth * 2) / 4, y: canvasHeight / 3 },
    { x: (canvasWidth * 3) / 4, y: canvasHeight / 2 },
    { x: canvasWidth - 50, y: canvasHeight / 2 },
  ]
}

// Calculate enemy wave scaling
export const getEnemyStatsForWave = (wave: number) => {
  const baseHealth = 50
  const baseSpeed = 1.5
  const baseReward = 10

  return {
    health: baseHealth * (1 + wave * 0.1),
    speed: baseSpeed * (1 + wave * 0.05),
    reward: baseReward * (1 + Math.floor(wave / 5)),
  }
}

// Spawn enemies for wave
export const spawnWaveEnemies = (
  wave: number,
  path: Vector2[],
  existingEnemies: Enemy[]
): Enemy[] => {
  const enemyCount = Math.min(5 + wave, 20) // 5-20 enemies per wave
  const stats = getEnemyStatsForWave(wave)
  const newEnemies: Enemy[] = []

  for (let i = 0; i < enemyCount; i++) {
    newEnemies.push({
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

  return [...existingEnemies, ...newEnemies]
}

// Update enemy positions
export const updateEnemies = (
  enemies: Enemy[],
  path: Vector2[],
  deltaTime: number
): { enemies: Enemy[]; completedEnemies: number } => {
  let completedEnemies = 0

  const updatedEnemies = enemies
    .map((enemy) => {
      if (!enemy.isAlive) return enemy

      const pathSegmentLength = Math.hypot(
        path[enemy.pathIndex + 1].x - path[enemy.pathIndex].x,
        path[enemy.pathIndex + 1].y - path[enemy.pathIndex].y
      )

      const distanceToMove = (enemy.speed * deltaTime) / 1000
      let remainingDistance = distanceToMove

      let currentEnemy = { ...enemy }

      while (remainingDistance > 0 && currentEnemy.pathIndex < path.length - 1) {
        const currentPos = currentEnemy.position
        const nextWaypoint = path[currentEnemy.pathIndex + 1]

        const distToWaypoint = Math.hypot(
          nextWaypoint.x - currentPos.x,
          nextWaypoint.y - currentPos.y
        )

        if (distToWaypoint <= remainingDistance) {
          // Move to next waypoint
          remainingDistance -= distToWaypoint
          currentEnemy.pathIndex++
          if (currentEnemy.pathIndex < path.length) {
            currentEnemy.position = { ...path[currentEnemy.pathIndex] }
          }
        } else {
          // Move partway to next waypoint
          const angle = Math.atan2(
            nextWaypoint.y - currentPos.y,
            nextWaypoint.x - currentPos.x
          )
          currentEnemy.position.x += Math.cos(angle) * remainingDistance
          currentEnemy.position.y += Math.sin(angle) * remainingDistance
          remainingDistance = 0
        }
      }

      // Check if enemy reached end
      if (currentEnemy.pathIndex >= path.length - 1) {
        currentEnemy.isAlive = false
        completedEnemies++
      }

      return currentEnemy
    })
    .filter((e) => e.isAlive || e.pathIndex >= path.length - 1)

  return { enemies: updatedEnemies, completedEnemies }
}

// Calculate tower damage
export const calculateDamage = (tower: Tower): number => {
  let damage = tower.damage

  // Apply trait bonuses
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

// Attack enemy
export const attackEnemy = (
  tower: Tower,
  enemy: Enemy,
  currentTime: number
): { tower: Tower; enemy: Enemy; damaged: boolean } => {
  if (currentTime < tower.nextAttack) {
    return { tower, enemy, damaged: false }
  }

  const distance = Math.hypot(
    tower.position.x - enemy.position.x,
    tower.position.y - enemy.position.y
  )

  if (distance > tower.range) {
    return { tower, enemy, damaged: false }
  }

  const damage = calculateDamage(tower)
  const updatedEnemy = {
    ...enemy,
    health: Math.max(0, enemy.health - damage),
    isAlive: enemy.health - damage > 0,
  }

  const updatedTower = {
    ...tower,
    lastAttack: currentTime,
    nextAttack: currentTime + tower.cooldown * 1000,
  }

  return { tower: updatedTower, enemy: updatedEnemy, damaged: true }
}

// Get all enemies in range
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

// Update game state
export const updateGameState = (
  state: GameState,
  deltaTime: number,
  currentTime: number
): GameState => {
  // Update enemies
  let { enemies, completedEnemies } = updateEnemies(state.enemies, state.path, deltaTime)

  // Handle enemies reaching end
  const healthLoss = completedEnemies
  const newHealth = Math.max(0, state.health - healthLoss)

  // Update towers attacking enemies
  let totalDamage = 0
  state.towers.forEach((tower) => {
    const enemiesInRange = getEnemiesInRange(tower, enemies)
    if (enemiesInRange.length > 0) {
      const target = enemiesInRange[0]
      const result = attackEnemy(tower, target, currentTime)
      totalDamage += result.damaged ? 1 : 0
    }
  })

  // Calculate coins and gems from killed enemies
  let coinsEarned = 0
  let gemsEarned = 0

  enemies = enemies.filter((enemy) => {
    if (enemy.health <= 0 && enemy.isAlive) {
      coinsEarned += enemy.bounty
      // Small chance to get gems (1%)
      if (Math.random() < 0.01) {
        gemsEarned += 1
      }
      return false
    }
    return true
  })

  // Check wave completion
  const isWaveActive = enemies.length > 0 || (state.isWaveActive && completedEnemies > 0)

  return {
    ...state,
    health: newHealth,
    coins: state.coins + coinsEarned,
    gems: state.gems + gemsEarned,
    score: state.score + completedEnemies * 100 + totalDamage * 10,
    enemies,
    gameOver: newHealth <= 0,
    isWaveActive,
  }
}
