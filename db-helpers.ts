import { createClient } from './supabase/client';
import { GAME_UNITS, TRAIT_BONUSES, type TraitTier, type ShinyForm } from './game-constants';

const supabase = createClient();

export interface PlayerUnit {
  id: string;
  unitName: string;
  quantity: number;
  level: number;
  shinyForm: ShinyForm | null;
  traitTier: TraitTier | null;
  acquiredAt: string;
}

export interface PlayerStats {
  coins: bigint;
  gems: bigint;
  luck: number;
  totalGemsEarned: bigint;
  totalCoinsEarned: bigint;
}

// Get player stats
export async function getPlayerStats() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('player_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data;
}

// Update player currency
export async function updatePlayerCurrency(
  coinsDelta: number = 0,
  gemsDelta: number = 0,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase.rpc('add_currency', {
    user_id_param: user.id,
    coins_delta: coinsDelta,
    gems_delta: gemsDelta,
  });

  if (error) throw error;
  return data;
}

// Get player units
export async function getPlayerUnits() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('player_units')
    .select('*, unit_definitions(*)')
    .eq('user_id', user.id);

  if (error) throw error;
  return data;
}

// Search player units by name
export async function searchPlayerUnits(query: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('player_units')
    .select('*, unit_definitions(*)')
    .eq('user_id', user.id)
    .ilike('unit_definitions.name', `%${query}%`);

  if (error) throw error;
  return data;
}

// Get all unit definitions
export async function getUnitDefinitions() {
  const { data, error } = await supabase
    .from('unit_definitions')
    .select('*');

  if (error) throw error;
  return data;
}

// Add unit to inventory or increment quantity
export async function addUnitToInventory(
  unitDefinitionId: string,
  level: number = 1,
  shinyForm: ShinyForm | null = null,
  traitTier: TraitTier | null = null,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Try to find existing unit with same level, shiny form, and trait
  const { data: existing } = await supabase
    .from('player_units')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('unit_definition_id', unitDefinitionId)
    .eq('level', level)
    .is('shiny_form', shinyForm)
    .is('trait_tier', traitTier)
    .single();

  if (existing) {
    // Increment quantity
    const { error } = await supabase
      .from('player_units')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id);

    if (error) throw error;
    return existing.id;
  } else {
    // Insert new unit
    const { data, error } = await supabase
      .from('player_units')
      .insert({
        user_id: user.id,
        unit_definition_id: unitDefinitionId,
        level,
        shiny_form: shinyForm,
        trait_tier: traitTier,
        quantity: 1,
      })
      .select('id');

    if (error) throw error;
    return data[0].id;
  }
}

// Merge duplicate units (when quantity >= 2)
export async function mergeDuplicateUnits(playerUnitId: string) {
  const { data, error } = await supabase
    .from('player_units')
    .select('*')
    .eq('id', playerUnitId)
    .single();

  if (error) throw error;
  if (data.quantity < 2) throw new Error('Unit must have quantity >= 2 to merge');

  // Merge: decrement quantity and level up
  const { error: updateError } = await supabase
    .from('player_units')
    .update({
      quantity: data.quantity - 1,
      level: data.level + 1,
    })
    .eq('id', playerUnitId);

  if (updateError) throw updateError;
}

// Apply shiny transformation via gacha
export async function transformUnitShiny(
  playerUnitId: string,
  shinyForm: ShinyForm,
  gemCost: number,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Deduct gems
  await updatePlayerCurrency(0, -gemCost);

  // Update unit
  const { error } = await supabase
    .from('player_units')
    .update({ shiny_form: shinyForm })
    .eq('id', playerUnitId);

  if (error) throw error;

  // Log gacha record
  const { data: unit } = await supabase
    .from('player_units')
    .select('unit_definition_id')
    .eq('id', playerUnitId)
    .single();

  if (unit) {
    await supabase.from('gacha_records').insert({
      user_id: user.id,
      unit_definition_id: unit.unit_definition_id,
      shiny_form: shinyForm,
      pull_count: 1,
      cost_gems: gemCost,
    });
  }
}

// Apply trait via gacha
export async function applyTraitToUnit(
  playerUnitId: string,
  traitTier: TraitTier,
  gemCost: number,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Deduct gems
  await updatePlayerCurrency(0, -gemCost);

  // Update unit
  const { error } = await supabase
    .from('player_units')
    .update({ trait_tier: traitTier })
    .eq('id', playerUnitId);

  if (error) throw error;

  // Log gacha record
  const { data: unit } = await supabase
    .from('player_units')
    .select('unit_definition_id')
    .eq('id', playerUnitId)
    .single();

  if (unit) {
    await supabase.from('gacha_records').insert({
      user_id: user.id,
      unit_definition_id: unit.unit_definition_id,
      trait_tier: traitTier,
      pull_count: 1,
      cost_gems: gemCost,
    });
  }
}

// Get unit with applied bonuses
export function getUnitWithBonuses(
  unitDefinition: any,
  traitTier: TraitTier | null,
) {
  let bonusMultipliers = {
    damage: 1,
    cooldown: 1,
    range: 1,
  };

  if (traitTier && TRAIT_BONUSES[traitTier]) {
    bonusMultipliers = TRAIT_BONUSES[traitTier];
  }

  return {
    ...unitDefinition,
    damageMax: Math.floor(
      unitDefinition.damage_max * bonusMultipliers.damage,
    ),
    cooldownMin: Math.floor(
      unitDefinition.cooldown_min / bonusMultipliers.cooldown,
    ),
    rangeMax: Math.floor(
      (unitDefinition.range_max || 0) * bonusMultipliers.range,
    ),
  };
}

// Purchase unit with coins or gems
export async function purchaseUnit(
  unitName: string,
  cost: number,
  currencyType: 'coins' | 'gems' = 'coins',
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Get unit definition
  const { data: unitDef, error: unitError } = await supabase
    .from('unit_definitions')
    .select('id')
    .eq('name', unitName)
    .single();

  if (unitError) throw unitError;

  // Deduct currency
  if (currencyType === 'coins') {
    await updatePlayerCurrency(-cost, 0);
  } else {
    await updatePlayerCurrency(0, -cost);
  }

  // Add unit to inventory
  await addUnitToInventory(unitDef.id);
}

// Get lucky items
export async function getPlayerLuckyItems() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('player_items')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  return data;
}

// Add lucky item
export async function addLuckyItem(itemType: string, quantity: number = 1) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data: existing } = await supabase
    .from('player_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('item_type', itemType)
    .single();

  if (existing) {
    await supabase
      .from('player_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);
  } else {
    await supabase.from('player_items').insert({
      user_id: user.id,
      item_type: itemType,
      quantity,
    });
  }
}

// Use lucky item
export async function useLuckyItem(itemId: string) {
  const { data: item } = await supabase
    .from('player_items')
    .select('*')
    .eq('id', itemId)
    .single();

  if (item && item.quantity > 1) {
    await supabase
      .from('player_items')
      .update({ quantity: item.quantity - 1 })
      .eq('id', itemId);
  } else {
    await supabase.from('player_items').delete().eq('id', itemId);
  }

  // Return luck bonus
  return item.lucky_multiplier || 0;
}

// Get active gamepasses
export async function getActiveGamepasses() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('player_gamepasses')
    .select('*')
    .eq('user_id', user.id)
    .gt('active_until', new Date().toISOString());

  if (error) throw error;
  return data;
}

// Purchase gamepass
export async function purchaseGamepass(
  gamepassType: string,
  durationDays: number = 30,
  gemCost: number,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Deduct gems
  await updatePlayerCurrency(0, -gemCost);

  // Add gamepass
  const activeUntil = new Date();
  activeUntil.setDate(activeUntil.getDate() + durationDays);

  await supabase.from('player_gamepasses').insert({
    user_id: user.id,
    gamepass_type: gamepassType,
    active_until: activeUntil.toISOString(),
  });
}

// Purchase VIP
export async function purchaseVIP(durationDays: number = 30, gemCost: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Deduct gems
  await updatePlayerCurrency(0, -gemCost);

  // Update user VIP status
  const vipExpiry = new Date();
  vipExpiry.setDate(vipExpiry.getDate() + durationDays);

  await supabase
    .from('users')
    .update({
      is_vip: true,
      vip_expiry: vipExpiry.toISOString(),
    })
    .eq('id', user.id);
}
