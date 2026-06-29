# TRACKLIFE — Roadmap

## Phase 1 — Core MVP ✓
- [x] Dashboard with calorie ring
- [x] Food log (manual entry)
- [x] Workout tracker (4-day split, 4 weeks)
- [x] Progress (weight log, InBody)
- [x] Profile with avatar
- [x] PWA (installable, offline)
- [x] Service Worker cache

## Phase 2 — Content & Polish ✓
- [x] Weekly meal plan (7 days × 3 meals × 3 options)
- [x] AI food analysis (text + photo via backend proxy)
- [x] Progress photos with comparison view
- [x] Workout heatmap
- [x] Achievement badges
- [x] Nutrition charts (Chart.js)
- [x] Minimalist redesign (black/white/gray, no neon)
- [x] 5-tab navigation

## Phase 3 — Multi-User Accounts ← Current
- [x] Supabase auth (email + password, sign up, forgot password)
- [x] User profiles (display name, username, avatar)
- [x] Cloud database (workouts, meals, weight, profile)
- [x] localStorage fallback (app works without Supabase)
- [x] Safe migration tool (local → cloud, user-initiated)
- [x] Row Level Security (each user sees only their data)
- [x] Settings screen (theme, language, units, goals, notifications)
- [x] AI service architecture (placeholders for Coach, Workouts)
- [ ] Progress photos in Supabase Storage (Phase 4)
- [ ] Full i18n (ES/EN translation strings) (Phase 4)

## Phase 4 — AI Features
- [ ] AI Coach — personalized weekly advice based on training + nutrition
- [ ] AI Workout Recommendations — suggest weight increases, flag plateaus
- [ ] Smarter food analysis — portion size context, meal history awareness
- [ ] Natural language workout logging ("hice 4x10 press banca con 80kg")
- [ ] Progress photo body composition estimate (AI vision)

## Phase 5 — Social & Sharing
- [ ] Share progress card (image export)
- [ ] Challenge a friend (workout challenge link)
- [ ] Leaderboard (opt-in)
- [ ] Public profile page

## Phase 6 — Monetization
- [ ] Premium tier (Stripe)
- [ ] Free: basic tracking, 1 week history, 1 user
- [ ] Premium: unlimited history, AI features, cloud sync, progress photos
- [ ] Team / coach plan: multiple users, coach dashboard

## Phase 7 — Native App
- [ ] React Native or Expo for iOS App Store distribution
- [ ] Native push notifications (APNs)
- [ ] HealthKit integration (steps, HRV, sleep)
- [ ] Watch complication

---

## Tech Debt Backlog

- Root `/src` directory is an outdated copy of `docs/src` — consolidate or delete
- Progress photos still use base64 localStorage (should go to Supabase Storage)
- `mealData.js` and `workoutData.js` are hardcoded for Ziv — parameterize for multi-user
- Workout structure (4-day PPL split) is hardcoded — make it configurable
- No automated tests — add Playwright E2E tests for critical paths
