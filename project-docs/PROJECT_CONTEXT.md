# TRACKLIFE — Project Context

## What Is This

TRACKLIFE is a personal fitness PWA built for Ziv Mendelson. It runs entirely in the browser with no build step, deploys to GitHub Pages, and uses Supabase for optional cloud sync. When Supabase is not configured, everything falls back to localStorage.

## URL

GitHub Pages: `https://zivml123.github.io/font/`

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla JS (ES modules, no bundler) |
| Styles | Plain CSS with custom properties |
| Charts | Chart.js 4.4.0 via CDN |
| Auth & DB | Supabase (optional; localStorage fallback) |
| Hosting | GitHub Pages (`/docs` folder) |
| Backend proxy | Node.js / Express on Render.com |
| AI | Anthropic Claude via backend proxy |
| PWA | Service Worker + Web Manifest |

## File Structure

```
/                            ← repo root
├── project-docs/            ← this documentation
├── supabase/schema.sql      ← Supabase SQL (run in dashboard)
├── server.js                ← Node.js backend proxy (AI / push)
├── src/                     ← OLD root src (outdated, do not edit)
└── docs/                    ← GitHub Pages web app root
    ├── index.html
    ├── sw.js                ← Service Worker
    ├── manifest.json
    ├── assets/
    ├── styles/
    │   ├── base.css         ← variables, splash, tab bar, hoy screen
    │   ├── components.css   ← buttons, cards, inputs, modals
    │   └── views.css        ← per-view styles
    └── src/
        ├── main.js          ← app init, tab routing, renderHoy
        ├── state.js         ← reactive state store
        ├── storage.js       ← dual-mode data layer (Supabase + localStorage)
        ├── api.js           ← backend proxy calls (AI food analysis)
        ├── mealData.js      ← weekly meal plan data + default goals
        ├── workoutData.js   ← workout exercises, structure, date math
        ├── services/
        │   └── ai.js        ← AI service interface (placeholders for future)
        ├── components/
        │   ├── modal.js
        │   └── toast.js
        └── views/
            ├── auth.js      ← login / sign-up screen
            ├── food.js      ← food log + weekly menu
            ├── workout.js   ← workout tracker
            ├── progress.js  ← progress sub-tabs (photos, measurements, charts)
            ├── photos.js    ← progress photos (localStorage; Supabase Storage future)
            ├── profile.js   ← profile + InBody + achievements
            └── settings.js  ← app settings (theme, language, goals, cloud)
```

## Architecture Principles

1. **No bundler** — files are ES modules loaded directly by the browser.
2. **Dual-mode storage** — `storage.js` routes all reads/writes: Supabase when logged in, localStorage when not. Never delete local data.
3. **No secrets in browser** — Anthropic API key lives only in the backend. The Supabase anon key is public by design; RLS handles access.
4. **5-tab navigation** — Hoy, Comidas, Entreno, Progreso, Perfil. No 6th tab. Settings lives inside Perfil.
5. **Minimal color system** — black background, white text, gray accents. No neon. No bright colors. See `UI_GUIDELINES.md`.

## Local Data Keys

All localStorage keys use the `zivplan_` prefix:

| Key | Content |
|---|---|
| `zivplan_profile` | Profile + InBody + goals JSON |
| `zivplan_workout_progress` | `{ "w1d0-pesas": "done", ... }` |
| `zivplan_num_weeks` | Integer (default 4) |
| `zivplan_meals_YYYY-MM-DD` | Array of meal objects |
| `zivplan_weight_log` | Array of `{ date, weight_kg, notes }` |
| `zivplan_avatar` | Base64 JPEG string |
| `zivplan_progress_photos` | Array of photo objects (with base64 dataUrl) |
| `zivplan_backend_url` | Backend proxy URL |
| `zivplan_supabase_url` | User-configured Supabase URL |
| `zivplan_supabase_key` | User-configured Supabase anon key |
| `zivplan_settings` | App settings JSON |

## Service Worker Cache

Current version: `tracklife-v9`. Bump the version string in `docs/sw.js` on every deployment to invalidate all client caches.
