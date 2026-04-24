-- Create users table with game progression
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_vip BOOLEAN DEFAULT FALSE,
  vip_expiry TIMESTAMP,
  total_waves_completed INT DEFAULT 0,
  best_score INT DEFAULT 0,
  last_played TIMESTAMP
);

-- Currency & Progression
CREATE TABLE IF NOT EXISTS player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coins BIGINT DEFAULT 0,
  gems BIGINT DEFAULT 0,
  luck DECIMAL DEFAULT 0,
  total_gems_earned BIGINT DEFAULT 0,
  total_coins_earned BIGINT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Unit definitions (core game data)
CREATE TABLE IF NOT EXISTS unit_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  rarity TEXT NOT NULL, -- Supreme, Ultimate, Celestial
  damage_min INT NOT NULL,
  damage_max INT NOT NULL,
  dps_min INT NOT NULL,
  dps_max INT NOT NULL,
  range_min INT DEFAULT 0,
  range_max INT DEFAULT 0,
  cooldown_min DECIMAL DEFAULT 1,
  cooldown_max DECIMAL DEFAULT 0.1,
  income_min INT DEFAULT 0,
  income_max INT DEFAULT 0,
  income_per_sec_min INT DEFAULT 0,
  income_per_sec_max INT DEFAULT 0,
  special_abilities TEXT,
  description TEXT,
  coin_cost_min INT,
  coin_cost_max INT,
  gem_cost INT DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Player's unit inventory
CREATE TABLE IF NOT EXISTS player_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_definition_id UUID NOT NULL REFERENCES unit_definitions(id),
  quantity INT DEFAULT 1,
  level INT DEFAULT 1,
  shiny_form TEXT DEFAULT NULL, -- null, 'shiny', 'rainbow', 'void', 'galaxy', 'galaxy_void', 'supernova', 'black_hole', 'super_black_hole', 'big_bang', 'universe'
  trait_tier TEXT DEFAULT NULL, -- null, 'common', 'rare', 'mythic', 'supernova', 'gamma', 'black_hole', 'big_bang', 'universe', 'multiverse'
  acquired_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, unit_definition_id, level, shiny_form, trait_tier)
);

-- Gacha records (for pity system if needed)
CREATE TABLE IF NOT EXISTS gacha_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_definition_id UUID NOT NULL REFERENCES unit_definitions(id),
  shiny_form TEXT,
  trait_tier TEXT,
  pull_count INT DEFAULT 1,
  cost_gems INT NOT NULL,
  pulled_at TIMESTAMP DEFAULT NOW()
);

-- Lucky items & consumables
CREATE TABLE IF NOT EXISTS player_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'lucky_bottle', 'super_lucky_bottle'
  lucky_multiplier INT, -- 100, 1000
  quantity INT DEFAULT 1,
  acquired_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Gamepasses (active subscriptions)
CREATE TABLE IF NOT EXISTS player_gamepasses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gamepass_type TEXT NOT NULL, -- 'x2_luck', 'x5_luck', 'x10_luck', 'x100_luck'
  active_until TIMESTAMP NOT NULL,
  purchased_at TIMESTAMP DEFAULT NOW()
);

-- Game progression & waves
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT DEFAULT 'story', -- 'story', 'endless', 'challenge'
  wave INT DEFAULT 1,
  score INT DEFAULT 0,
  coins_earned INT DEFAULT 0,
  gems_earned INT DEFAULT 0,
  units_placed TEXT DEFAULT '[]', -- JSON array of unit placements
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  status TEXT DEFAULT 'active' -- 'active', 'paused', 'completed', 'failed'
);

-- Settings & preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  music_enabled BOOLEAN DEFAULT TRUE,
  notification_enabled BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_gamepasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gacha_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "users_read_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for player_stats
CREATE POLICY "stats_read_own" ON player_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "stats_update_own" ON player_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "stats_insert_own" ON player_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for player_units
CREATE POLICY "units_read_own" ON player_units FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "units_insert_own" ON player_units FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "units_update_own" ON player_units FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "units_delete_own" ON player_units FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for player_items
CREATE POLICY "items_read_own" ON player_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "items_insert_own" ON player_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "items_update_own" ON player_items FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for player_gamepasses
CREATE POLICY "gamepasses_read_own" ON player_gamepasses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "gamepasses_insert_own" ON player_gamepasses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for game_sessions
CREATE POLICY "sessions_read_own" ON game_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessions_insert_own" ON game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessions_update_own" ON game_sessions FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_settings
CREATE POLICY "settings_read_own" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "settings_update_own" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "settings_insert_own" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for gacha_records
CREATE POLICY "gacha_read_own" ON gacha_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "gacha_insert_own" ON gacha_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read for unit_definitions (no RLS needed - public data)
GRANT SELECT ON unit_definitions TO authenticated, anon;
