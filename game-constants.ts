// Game constants and types
export const GAME_UNITS = {
  SUPREME_BEING: {
    id: 'supreme-being-above-all',
    name: 'Supreme Being Above All',
    rarity: 'Supreme' as const,
    damageRange: { min: 100000, max: 1000000 },
    dpsRange: { min: 100000, max: 10000000 },
    rangeRange: { min: 70, max: 110 },
    cooldownRange: { min: 1, max: 0.1 },
    abilities: [
      'Summon Big Bang (One-hit full map)',
      'Knockback effect',
      '98% Stun',
      '10% Assassinate (one-hit kill)',
    ],
    coinCostRange: { min: 1000, max: 10000 },
    gemCost: 0,
    description: 'The ultimate cosmic entity with universe-breaking power',
  },
  MAT_TV_ASTRO: {
    id: 'mat-tv-astro',
    name: 'Mat TV Astro',
    rarity: 'Ultimate' as const,
    damageRange: { min: 50000, max: 100000 },
    dpsRange: { min: 50000, max: 1000000 },
    rangeRange: { min: 0, max: 0 },
    cooldownRange: { min: 1, max: 0.1 },
    abilities: ['360° AOE', '70% Slow', 'Splash & Piercing'],
    coinCostRange: { min: 2000, max: 15000 },
    gemCost: 0,
    description: 'TV Man from space with quantum pulse attacks',
  },
  CHAINED_WATCHMAN: {
    id: 'chained-watchman',
    name: 'Chained Watchman',
    rarity: 'Celestial' as const,
    damageRange: { min: 6500, max: 112000 },
    dpsRange: { min: 10000, max: 400000 },
    rangeRange: { min: 52, max: 80 },
    cooldownRange: { min: 1, max: 1 },
    abilities: ['Radioactive Splash', '85% Slow'],
    coinCostRange: { min: 800, max: 8000 },
    gemCost: 0,
    description: 'Guardian with toxic radioactive powers',
  },
  SUPER_FARM_MONEY: {
    id: 'super-farm-money',
    name: 'Super Farm Money',
    rarity: 'Celestial' as const,
    damageRange: { min: 0, max: 0 },
    dpsRange: { min: 0, max: 0 },
    rangeRange: { min: 0, max: 0 },
    cooldownRange: { min: 0, max: 0 },
    incomeRange: { min: 1000, max: 300000 },
    incomePerSecRange: { min: 1000, max: 30000 },
    abilities: ['Generate coins per second', 'Generate coins per wave'],
    coinCostRange: { min: 1000, max: 10000 },
    gemCost: 0,
    description: 'Income generator for steady flow of coins',
  },
} as const;

export const SHINY_FORMS = {
  NONE: null,
  SHINY: 'shiny' as const,
  RAINBOW: 'rainbow' as const,
  VOID: 'void' as const,
  GALAXY: 'galaxy' as const,
  GALAXY_VOID: 'galaxy_void' as const,
  SUPERNOVA: 'supernova' as const,
  BLACK_HOLE: 'black_hole' as const,
  SUPER_BLACK_HOLE: 'super_black_hole' as const,
  BIG_BANG: 'big_bang' as const,
  UNIVERSE: 'universe' as const,
} as const;

export const SHINY_GACHA_RATES = {
  [SHINY_FORMS.NONE]: 0.5, // 50%
  [SHINY_FORMS.SHINY]: 0.2, // 20%
  [SHINY_FORMS.RAINBOW]: 0.15, // 15%
  [SHINY_FORMS.VOID]: 0.05, // 5%
  [SHINY_FORMS.GALAXY]: 0.03, // 3%
  [SHINY_FORMS.GALAXY_VOID]: 0.02, // 2%
  [SHINY_FORMS.SUPERNOVA]: 0.02, // 2%
  [SHINY_FORMS.BLACK_HOLE]: 0.01, // 1%
  [SHINY_FORMS.SUPER_BLACK_HOLE]: 0.01, // 1%
  [SHINY_FORMS.BIG_BANG]: 0.0099, // 0.99%
  [SHINY_FORMS.UNIVERSE]: 0.0001, // 0.01%
} as const;

export const TRAIT_TIERS = {
  NONE: null,
  COMMON: 'common' as const,
  RARE: 'rare' as const,
  MYTHIC: 'mythic' as const,
  SUPERNOVA: 'supernova' as const,
  GAMMA: 'gamma' as const,
  BLACK_HOLE: 'black_hole' as const,
  BIG_BANG: 'big_bang' as const,
  UNIVERSE: 'universe' as const,
  MULTIVERSE: 'multiverse' as const,
} as const;

export const TRAIT_RATES = {
  [TRAIT_TIERS.COMMON]: 0.5, // 50% +10% damage, -10% cd
  [TRAIT_TIERS.RARE]: 0.25, // 25% +20% damage, -20% cd, +10% range
  [TRAIT_TIERS.MYTHIC]: 0.1, // 10% +30% damage, -30% cd, +30% range
  [TRAIT_TIERS.SUPERNOVA]: 0.05, // 5% +50% damage, -50% cd, +50% range
  [TRAIT_TIERS.GAMMA]: 0.05, // 5% +70% damage, -30% cd, +50% range
  [TRAIT_TIERS.BLACK_HOLE]: 0.049, // 4.9% +100% damage, -70% cd, +70% range
  [TRAIT_TIERS.BIG_BANG]: 0.0009, // 0.09% +200% damage, -78% cd, +80% range
  [TRAIT_TIERS.UNIVERSE]: 0.00009, // 0.009% +300% damage, -80% cd, +80% range
  [TRAIT_TIERS.MULTIVERSE]: 0.00001, // 0.001% +1000% damage, -90% cd, +100% range
} as const;

export const TRAIT_BONUSES = {
  [TRAIT_TIERS.COMMON]: { damage: 1.1, cooldown: 0.9, range: 1 },
  [TRAIT_TIERS.RARE]: { damage: 1.2, cooldown: 0.8, range: 1.1 },
  [TRAIT_TIERS.MYTHIC]: { damage: 1.3, cooldown: 0.7, range: 1.3 },
  [TRAIT_TIERS.SUPERNOVA]: { damage: 1.5, cooldown: 0.5, range: 1.5 },
  [TRAIT_TIERS.GAMMA]: { damage: 1.7, cooldown: 0.7, range: 1.5 },
  [TRAIT_TIERS.BLACK_HOLE]: { damage: 2, cooldown: 0.3, range: 1.7 },
  [TRAIT_TIERS.BIG_BANG]: { damage: 3, cooldown: 0.22, range: 1.8 },
  [TRAIT_TIERS.UNIVERSE]: { damage: 4, cooldown: 0.2, range: 1.8 },
  [TRAIT_TIERS.MULTIVERSE]: { damage: 11, cooldown: 0.1, range: 2 },
} as const;

export const GAMEPASSES = {
  X2_LUCK: { name: 'x2 Luck', multiplier: 2, gemCost: 499 },
  X5_LUCK: { name: 'x5 Luck', multiplier: 5, gemCost: 999 },
  X10_LUCK: { name: 'x10 Luck', multiplier: 10, gemCost: 1999 },
  X100_LUCK: { name: 'x100 Luck', multiplier: 100, gemCost: 9999 },
} as const;

export const VIP_BONUSES = {
  coinMultiplier: 3,
  gemMultiplier: 3,
  luckMultiplier: 3,
  unitCostDiscount: 0.7, // 30% discount = 70% of original price
} as const;

export const LUCKY_BOTTLES = {
  LUCKY: { name: 'Lucky Bottle', luckBonus: 100, gemCost: 49 }, // +100% luck
  SUPER_LUCKY: { name: 'Super Lucky Bottle', luckBonus: 1000, gemCost: 249 }, // +1000% luck
} as const;

export const GAME_MODES = {
  STORY: 'story' as const,
  ENDLESS: 'endless' as const,
  CHALLENGE: 'challenge' as const,
} as const;

export const ENDLESS_MODE_GEM_REWARD = 100; // 100 gems per wave in endless

export type ShinyForm = typeof SHINY_FORMS[keyof typeof SHINY_FORMS];
export type TraitTier = typeof TRAIT_TIERS[keyof typeof TRAIT_TIERS];
export type GameMode = typeof GAME_MODES[keyof typeof GAME_MODES];
