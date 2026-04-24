## PWA Stale Cache Fix

### Goal
Stop the service worker from caching JS/CSS/HTML so every deploy is immediately visible to users, without manual cache clearing.

### Changes

**1. `vite.config.ts`** — Adjust `VitePWA` config:
- Change `registerType` from `'autoUpdate'` to `'prompt'`
- Change `globPatterns` from `['**/*.{js,css,html,ico,png,svg,woff2}']` to `['**/*.{ico,png,svg,woff2}']`
- This removes JS/CSS/HTML from the service worker cache. Images and fonts remain cached. All other `workbox` settings stay identical (runtimeCaching, Supabase cache, etc.).

**2. `src/main.tsx`** — Add auto-reload on service worker update:
- Insert a `controllerchange` listener after the existing iframe/preview guard. When a new service worker takes control after a deploy, the page reloads silently so the user gets the fresh version immediately.

### No other files touched
- No component, page, or data files are modified.
- The existing iframe/preview service-worker unregistration logic stays exactly as-is.
