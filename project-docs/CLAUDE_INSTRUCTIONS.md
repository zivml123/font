# Instructions for Claude

Read this before touching any code.

## Branch

Always work on: `claude/ziv-plan-fitness-app-lr3rl5`

Before any significant change:
1. Verify you're on the right branch: `git branch`
2. Create a backup branch if requested by the user

## Critical Rules

1. **Never expose API keys in frontend code.** The Anthropic key lives in `server.js` (backend). The Supabase anon key is public by design (safe). The Supabase service_role key must never be in the browser.

2. **Never delete localStorage data.** The `storage.js` dual-mode layer always writes to localStorage AND cloud. Never remove the localStorage fallback.

3. **Never add a 6th tab.** Settings lives inside the Perfil tab. The nav has exactly 5 tabs.

4. **Never change the color system** without the user explicitly asking. Keep: bg `#000000`, cards `#1C1C1E`, text `#FFFFFF`, muted `#A1A1A6`, accent `#FFFFFF`. No neon, no gold, no gradients.

5. **Edit `docs/src/` only** for frontend changes. The root `src/` is an outdated copy — do not edit it.

6. **Always bump `sw.js` cache version** when deploying. Current: `tracklife-v9`. Next: `tracklife-v10`, etc.

## File Map (quick reference)

| What you need to change | File |
|---|---|
| CSS variables, splash, tab bar | `docs/styles/base.css` |
| Buttons, cards, inputs, modals | `docs/styles/components.css` |
| Per-view layout styles | `docs/styles/views.css` |
| App init, tab routing, renderHoy | `docs/src/main.js` |
| Reactive state | `docs/src/state.js` |
| Data reads/writes (cloud + local) | `docs/src/storage.js` |
| AI backend calls | `docs/src/api.js` |
| AI service architecture | `docs/src/services/ai.js` |
| Login / Sign-up screen | `docs/src/views/auth.js` |
| Food log + weekly menu | `docs/src/views/food.js` |
| Workout tracker | `docs/src/views/workout.js` |
| Progress sub-tabs | `docs/src/views/progress.js` |
| Progress photos | `docs/src/views/photos.js` |
| Profile view | `docs/src/views/profile.js` |
| Settings screen | `docs/src/views/settings.js` |
| Service Worker | `docs/sw.js` |
| Supabase DB schema + RLS | `supabase/schema.sql` |
| Backend proxy (Node.js) | `server.js` |

## How to Add a New Feature

1. Check `ROADMAP.md` to see if it's planned
2. Add data functions to `storage.js` (dual-mode: Supabase + localStorage)
3. If it needs a new DB table: add to `supabase/schema.sql` with RLS
4. Create or edit the view file in `docs/src/views/`
5. Wire it in `main.js` if it needs tab routing
6. Add CSS to the appropriate stylesheet
7. Bump `sw.js` cache version
8. Update `CHANGELOG.md`
9. Commit with a descriptive message

## How to Add AI Features

See `docs/src/services/ai.js`. The placeholders define the interface:
- `AICoach.getAdvice(context)` — coaching messages
- `AIWorkoutRecommendations.getNextWorkout(progress, profile)` — workout suggestions
- `AIFoodAnalysis.analyzeText(text)` / `analyzePhoto(file)` — already implemented via `api.js`

To implement: replace the stub functions, route through the backend proxy in `server.js`, never call Anthropic directly from the browser.

## How Storage Works

```
User action
    ↓
storage.js function
    ↓
useCloud()? → YES → write to Supabase + localStorage
             → NO  → write to localStorage only
```

`useCloud()` returns true only when `window.__supabase` exists AND `state.user` is set.

## Common Mistakes to Avoid

- Don't use `document.querySelector` in module-level scope — always inside functions (elements may not exist yet)
- Don't import `profile.js` from `settings.js` — use a callback pattern to avoid circular deps
- Don't hardcode colors like `#FFD60A` or `#30D158` as primary accent — use CSS variables
- Don't forget `escHtml()` / `escAttr()` when rendering user data into HTML
- Don't call `renderHoy()` directly — use `window.__refreshDashStats?.()` or `window.__refreshDashPills?.()` hooks

## localStorage Key Naming

All keys must use the `zivplan_` prefix:
```
zivplan_profile
zivplan_workout_progress
zivplan_num_weeks
zivplan_meals_YYYY-MM-DD
zivplan_weight_log
zivplan_avatar
zivplan_progress_photos
zivplan_backend_url
zivplan_supabase_url
zivplan_supabase_key
zivplan_settings
```

## Testing on iPhone

Before pushing:
1. Open Safari → `https://zivml123.github.io/font/`
2. Hard reload (close and reopen tab) to pick up new SW
3. Test: login → log food → complete workout → check Hoy ring updates
4. Test: install as PWA → open from home screen → verify safe areas
5. Test: airplane mode → verify app still works (localStorage fallback)

## Commit Message Format

```
type: short description

- detail 1
- detail 2

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`
