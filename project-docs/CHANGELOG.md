# TRACKLIFE — Changelog

## v1.3.0 — Multi-User Accounts (2026-06-29)

### Added
- Supabase authentication: sign up with email, password, display name, username
- Forgot password flow (reset via email)
- Username field (unique @handle) on registration
- Settings screen inside Perfil tab: theme, language, units, first day of week, notifications, goals, Supabase config, AI config, data migration
- "Mover mis datos a la nube" migration tool — safe, user-initiated, localStorage data never deleted
- `src/services/ai.js` — AI service architecture with clean placeholders for AI Coach, AI Food Analysis, AI Workout Recommendations
- `progress_photos` table in Supabase schema (metadata; images still localStorage for now)
- `settings` JSONB column in `profiles` table
- `username`, `display_name`, `avatar_url` columns in `profiles`
- DB trigger: auto-creates profile row on user sign-up
- Supabase URL + anon key configurable via Settings (no HTML editing required)
- Project documentation in `project-docs/`

### Changed
- Auth screen: added username, display name fields for sign-up; forgot password link
- Profile screen: settings button added; logout button always visible when logged in
- `storage.js`: added `getSettings()`, `setSettings()`, `migrateLocalToCloud()`, `getProgressPhotos()`, `addProgressPhoto()`, `deleteProgressPhoto()`
- `state.js`: added `settings` field with defaults
- `main.js`: reads Supabase URL/key from localStorage (no HTML editing needed); loads settings on init
- Service Worker bumped to `tracklife-v9`
- `supabase/schema.sql`: updated with new columns, progress_photos table, DB trigger, RLS policies

### Fixed
- All `var(--gold)` / `#FFD60A` references removed from inline styles and CSS

---

## v1.2.0 — Minimalist Redesign (2026-06-29)

### Added
- New 5-tab navigation: Hoy, Comidas, Entreno, Progreso, Perfil
- Hoy screen: calorie ring, 3 stat rows, 2 action buttons
- Progress sub-tabs: Fotos, Medidas, Gráficas
- CSS custom property system (--bg, --panel, --panel2, --line, --text, --muted, --accent)

### Changed
- Color scheme: black background, white text, gray accents only
- All neon green (`#30D158`) removed as accent — kept only for success states
- All yellow/gold (`#FFD60A`) removed entirely
- Hoy ring simplified: no card background, centered column layout
- Service Worker bumped to `tracklife-v8`

---

## v1.1.0 — Weekly Meal Plan (2026-06-22)

### Added
- Weekly meal plan: 7 days × desayuno, almuerzo, cena × 3 options each
- "Agregar al día" button copies meal option to today's food log
- Day-of-week pills navigation
- 100% kosher diet constraint respected in all meal options

---

## v1.0.0 — Initial MVP (2026-06-22)

### Added
- Dashboard with calorie ring and stats
- Food log: text description → AI analysis → add to log
- Photo food analysis (camera capture → AI)
- Workout tracker: 4-day PPL split, 3 sub-sessions, 4 weeks
- Progress photos with comparison and timeline
- Weight log with Chart.js chart
- InBody data entry and history
- Profile with avatar upload
- Achievement badges
- PWA: service worker, manifest, iOS meta tags
- Supabase dual-mode storage (cloud + localStorage fallback)
- Backend proxy for Anthropic API (no key in browser)
