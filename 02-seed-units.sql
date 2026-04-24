-- Seed game unit definitions
INSERT INTO unit_definitions (name, rarity, damage_min, damage_max, dps_min, dps_max, range_min, range_max, cooldown_min, cooldown_max, special_abilities, description, coin_cost_min, coin_cost_max, gem_cost, image_url) VALUES
('Supreme Being Above All', 'Supreme', 100000, 1000000, 100000, 10000000, 70, 110, 1, 0.1, 'Summon Big Bang (one-hit full map), Knockback, 98% Stun, 10% Assassinate', 'The ultimate cosmic entity with universe-breaking power', 1000, 10000, 0, '/units/supreme-being.png'),
('Mat TV Astro', 'Ultimate', 50000, 100000, 50000, 1000000, 0, 0, 1, 0.1, '360° AOE, 70% Slow, Splash & Piercing', 'TV Man from space with quantum pulse attacks', 2000, 15000, 0, '/units/mat-tv-astro.png'),
('Chained Watchman', 'Celestial', 6500, 112000, 10000, 400000, 52, 80, 0, 0, 'Radioactive Splash, 85% Slow', 'Guardian with toxic radioactive powers', 800, 8000, 0, '/units/chained-watchman.png'),
('Super Farm Money', 'Celestial', 0, 0, 0, 0, 0, 0, 0, 0, 'Generate coins per second and per wave', 'Income generator for steady flow of coins', 1000, 10000, 0, '/units/super-farm-money.png');
