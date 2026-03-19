# Tangier — Presence-First Immersive Experience

This app is designed as a **threshold**, not a dashboard. The goal is to make users feel the slow pull of Tangier through motion, atmosphere, and sparse narrative.

## What it takes to enrich the experience without clutter

A richer experience comes from deepening what already exists, not adding visible UI chrome.

### 1) Reward stillness, not interaction volume
- Make lingering meaningful: visual warmth, nuanced audio lift, and deeper text legibility after a few seconds of pause.
- Keep this effect ambient and reversible so users never feel trapped in a “mode.”

### 2) Add contextual guidance as atmosphere, not controls
- Use one-line field notes that appear only after stillness and then disappear.
- Keep copy short, reflective, and location-aware (arrival, descent, medina, strait).

### 3) Increase perceived depth using micro-textures
- Add subtle atmospheric texture (dust/haze) that appears with stillness.
- Avoid icons, badges, progress bars, and explicit overlays.

### 4) Maintain emotional pacing
- Preserve the existing slow cadence: no jump-cuts, no aggressive prompts, no tutorial blocks.
- Every enhancement should feel like a continuation of the place, not an app feature.

## Implementation approach used

The current implementation follows those principles through four low-clutter upgrades:

1. **Linger Intelligence**
   - Track stillness duration (`lingerMs`) and use it as the core enrichment signal.

2. **Stillness-Responsive Atmosphere**
   - Horizon glow gradually increases when the user pauses.
   - Medina atmospheric texture softly emerges during longer pauses.

3. **Contextual Field Notes**
   - A single line of zone-aware text appears after ~3.5s of stillness.
   - The note is minimalist and non-interactive.

4. **Narrative Deepening Without Added UI**
   - Existing narrative fragments become slightly more legible while lingering.
   - Historical marginalia behavior remains the same; no extra panels introduced.

## Run

```bash
npm install
npm run dev
```
