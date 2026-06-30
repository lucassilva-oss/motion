This is a remotion based video app that uses React to render videos.

Full remotion docs can be found here: https://www.remotion.dev/docs/. Consult these docs often if you're uncertain.

## Project Structure

- `src/Root.jsx` — registers all Compositions
- `src/index.jsx` — entry point (`registerRoot`)
- `src/HelloWorld.jsx` — starter composition
- `src/InteligenMotion.jsx` — main cinematic infographic animation
- `public/` — static assets (place `infographic.png` here)

Default composition settings: **1920×1080, 30fps**.

## Rules (from Remotion CLAUDE.md)

- Use `<OffthreadVideo>` for video, `<Img>` for images, `<Audio>` for audio
- Use `staticFile()` when referencing assets from `public/`
- Layer elements with `<AbsoluteFill>`
- Use `<Sequence from={n}>` to time elements; child `useCurrentFrame()` resets to 0
- Use `<Series>` / `<TransitionSeries>` for sequential content
- **Never use `Math.random()`** — use `random('static-seed')` from remotion (must be deterministic)
- `Math.sin()` is fine — it's deterministic
- Use `interpolate()` for linear animation, `spring()` for physics-based motion
- Components must be pure and deterministic — no user interactions, no side effects

## Scripts

```bash
npm start        # Remotion Studio (preview)
npm run render   # Render InteligenMotion → out/inteligen-motion.mp4
npm run build    # Render HelloWorld    → out/hello.mp4
```

## Adding a new composition

1. Create `src/MyComp.jsx`
2. Add `<Composition id="MyComp" component={MyComp} ... />` in `src/Root.jsx`
