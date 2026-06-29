# TRACKLIFE — Feature List

## Implemented ✓

### Dashboard (Hoy)
- Big "HOY" heading with today's date
- Calorie progress ring (SVG, animated)
- Three stat rows: Calorías, Proteína, Entrenamiento
- Two action buttons: "Registrar comida" and "Ver entrenamiento"
- Avatar button in header → navigates to Perfil tab
- Refreshes automatically when food is logged

### Food Log (Comidas → Registro del día)
- Date navigation (prev/next day)
- Calorie ring + protein bar + macro pills
- AI food analysis via text description (calls backend proxy)
- AI food analysis via photo (calls backend proxy)
- Editable confirmation modal before saving
- Delete individual meals
- Daily totals update live

### Weekly Meal Plan (Comidas → Menú semanal)
- 7-day plan with day-of-week pills
- 3 options per meal per day (desayuno, almuerzo, cena)
- "Agregar al día" button copies meal to today's food log
- 100% kosher diet constraint
- Pre-calculated macros

### Workouts (Entreno)
- 4-day split: Empuje, Tirón, Pierna, Full Body
- 3 sub-sessions per day: pesas, cardio, abs
- Mark each sub-session done / failed / reset
- Per-week stats header (done/fail counts, progress %)
- Multi-week support (default 4 weeks, expandable)
- Add or remove week
- Reset all progress with confirmation

### Progress (Progreso) — 3 sub-tabs

**Fotos:**
- Upload progress photos with date, weight, fat %, waist
- Comparison view: first photo vs latest
- Timeline with all photos sorted by date
- Photo compression before storage (max 900px, 75% quality)
- Delete individual photos

**Medidas:**
- Weight log: add today's weight
- Weight trend chart (Chart.js)
- Historical entries (last 5)
- InBody comparison table (current vs previous)
- Weight goal progress bar

**Gráficas:**
- Weekly nutrition chart (kcal + protein last 7 days)
- Workout heatmap (all weeks × days)
- Summary grid: avg kcal/day, avg protein/day, days logged
- Push notification setup card

### Profile (Perfil)
- Avatar upload (compresses to 256px, base64 localStorage)
- Display name, age, height displayed
- Sessions / Streak / Total sessions stats
- Achievement badges (first workout, 10 sessions, 7-day streak, 14-day streak)
- Edit name, calorie goal, protein goal, weight goal, fat goal
- InBody data entry (current + history)
- AI backend URL configuration
- Cloud sync status (Supabase connected / local only)
- Login / Logout
- PWA install instructions

### Settings (inside Perfil)
- Display name + username editing
- Daily calorie goal
- Daily protein goal
- Weight goal
- Theme selector (Dark default; prepared for future themes)
- Language selector (ES / EN — preference saved; full translation future)
- Units selector (Metric / Imperial — preference saved)
- First day of week
- Notification toggles (workout, meal, weight)
- Supabase URL + anon key configuration
- AI backend URL
- "Mover mis datos a la nube" migration tool
- Logout

### Authentication (Supabase)
- Sign in with email + password
- Sign up with email, password, display name, username
- Forgot password (reset email)
- Skip (continue without account, local-only mode)
- Auto session restore on reload
- onAuthStateChange listener

### PWA
- Service Worker with cache-first strategy
- Web App Manifest
- Apple touch icon + theme color
- `viewport-fit=cover` + safe area insets
- Installable on iOS Safari and Android Chrome

## Partially Implemented ~

- **Progress photos in cloud** — localStorage only today; `progress_photos` table in DB schema ready for Supabase Storage upload (Phase 2)
- **Push notifications** — UI exists; VAPID keys not configured in production
- **AI analysis** — works when backend URL is set; not self-contained in the app

## Planned (not started) —

### AI Coach
- Personalized advice based on workout + nutrition patterns
- Placeholder in `src/services/ai.js` → `AICoach.getAdvice()`

### AI Workout Recommendations
- Weight progression suggestions
- Rest day / deload detection
- Placeholder in `src/services/ai.js` → `AIWorkoutRecommendations.getNextWorkout()`

### Full i18n
- Translation strings in `src/i18n/es.js` and `src/i18n/en.js`
- Language switch updates all UI text live

### Themes
- Light theme
- System-preference-based auto theme
- Additional accent color options

### Premium / Stripe
- Not started. No payment infrastructure yet.

### Social
- Not started. Share progress, challenges, leaderboards.
