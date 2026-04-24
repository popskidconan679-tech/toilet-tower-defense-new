// Tower units data for MVP
export const TOWER_UNITS = {
  BASIC_PLUNGER: {
    id: 'basic-plunger',
    name: 'Basic Plunger',
    damage: 12,
    cooldown: 0.6,
    range: 80,
    cost: 25,
    color: '#8b5cf6',
    description: 'Standard tower, steady damage',
  },
  RUBBER_DUCK: {
    id: 'rubber-duck',
    name: 'Rubber Duck',
    damage: 20,
    cooldown: 0.8,
    range: 90,
    cost: 50,
    color: '#fbbf24',
    description: 'Better damage output',
  },
  GOLD_PLUNGER: {
    id: 'gold-plunger',
    name: 'Gold Plunger',
    damage: 35,
    cooldown: 1.0,
    range: 120,
    cost: 100,
    color: '#fbbf24',
    description: 'Long range, high damage',
  },
  SUPER_FARM: {
    id: 'super-farm',
    name: 'Super Farm',
    damage: 0,
    cooldown: 1.0,
    range: 0,
    cost: 75,
    color: '#10b981',
    isIncome: true,
    incomePerSec: 2,
    description: 'Generates coins passively',
  },
} as const

export const getTowerData = (unitName: string) => {
  return Object.values(TOWER_UNITS).find((u) => u.id === unitName) || Object.values(TOWER_UNITS)[0]
}

export const getAllTowers = () => {
  return Object.values(TOWER_UNITS)
}
