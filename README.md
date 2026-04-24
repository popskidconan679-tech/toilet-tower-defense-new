# Toilet Tower Defense - MVP

A real-time tower defense game built with Next.js 16, TypeScript, and Canvas API. Deploy instantly to Vercel and start playing!

## Features (MVP)

- **Real-time Gameplay**: 60fps smooth tower placement and combat
- **Wave System**: Progressively harder enemies with auto-advancing waves
- **Tower Placement**: Click-to-place towers on a 20x15 grid (800x600px)
- **Economic System**: Earn coins by defeating enemies, spend to place towers
- **Game Statistics**: Wave counter, health bar, coin/gem tracking, score system
- **Responsive UI**: Clean dark theme with Tailwind CSS

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Build project
npm run build

# Start production server
npm start
```

### Deploy to Vercel

```bash
# Deploy directly
vercel deploy

# Or connect GitHub repo for automatic deployments
# Visit https://vercel.com and link this repository
```

## Gameplay

1. **Start Wave**: Click "START WAVE" button to begin
2. **Select Tower**: Click a tower in the selector at the bottom
3. **Place Tower**: Click on the grid to place towers (costs coins)
4. **Defend**: Towers automatically attack enemies
5. **Earn Coins**: Kill enemies to earn coins and upgrade
6. **Progress**: Waves get harder, try to survive as long as possible

## Available Towers

- **Basic Plunger** ($25): Standard damage, medium range
- **Rubber Duck** ($50): Better damage, longer range
- **Gold Plunger** ($100): High damage, very long range
- **Super Farm** ($75): Generates coins per second (no combat)

## Game Mechanics

- **Enemies**: Start with 3 per wave, increase by 1 per wave (up to 25)
- **Scaling**: Enemy health increases 15% per wave
- **Coins**: Kill reward increases with wave number
- **Game Over**: Base health reaches 0 (start with 100 HP)
- **Score**: Tracked from coins earned and enemies defeated

## Technical Stack

- **Framework**: Next.js 16 with App Router
- **Rendering**: HTML5 Canvas (60fps)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Deployment**: Vercel (automatic)

## Project Structure

```
├── app/
│   ├── page.tsx              # Root redirect
│   ├── game/
│   │   └── page.tsx          # Main game page
│   └── layout.tsx            # App layout
├── components/
│   └── game/
│       ├── game-canvas.tsx   # Canvas rendering & game loop
│       ├── game-hud.tsx      # Status display
│       └── tower-selector.tsx # Tower selection UI
├── lib/
│   └── game/
│       ├── types.ts          # TypeScript types & constants
│       ├── engine.ts         # Game logic engine
│       └── units.ts          # Tower unit data
└── globals.css               # Tailwind CSS config
```

## Game Loop

The game runs at 60fps using `requestAnimationFrame`:

1. **Spawn Phase**: Enemies spawn from queue at intervals
2. **Update Phase**: Enemies move, towers attack
3. **Physics Phase**: Collision detection, path following
4. **Render Phase**: Draw canvas with current state

## MVP Limitations

- No persistence (game resets on reload)
- Single difficulty (waves get progressively harder)
- No audio
- No animations (combat is instant damage)
- No upgrades/merging system

## Future Enhancements

- Player accounts & progress saving
- Multiple game modes (Story, Endless, Challenge)
- Tower upgrades and merging
- Special abilities and power-ups
- Sound effects and music
- Mobile touch support
- Leaderboard system
- Skins and cosmetics

## Performance

- Canvas rendering optimized for smooth gameplay
- Enemy pooling to reduce GC pressure
- Tower targeting uses distance calculations
- Path following uses vector interpolation

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (responsive)

## License

MIT

---

**Ready to play?** Deploy now with `vercel deploy` or `npm run dev` locally!
