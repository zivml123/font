# TRACKLIFE — Database

## Overview

TRACKLIFE uses Supabase (PostgreSQL) when configured, with a full localStorage fallback. Every table includes `user_id` and Row Level Security (RLS) so users can only access their own data.

## Tables

### `profiles`
Extends `auth.users`. Created automatically by a DB trigger on sign-up.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | uuid PK | — | References `auth.users(id)` |
| `username` | text UNIQUE | null | Unique @handle (e.g. `ziv123`) |
| `display_name` | text | null | Public display name |
| `nombre` | text | `'Usuario'` | Legacy name field (kept for compat) |
| `avatar_url` | text | null | Supabase Storage path (future) |
| `num_weeks` | int | 4 | Number of workout weeks |
| `inbody_current` | jsonb | default INBODY | Latest InBody scan data |
| `inbody_history` | jsonb | `[]` | Array of past InBody scans |
| `objetivos` | jsonb | default goals | `{ kcal_meta, proteina_meta_g, peso_meta_kg, grasa_meta_pct }` |
| `settings` | jsonb | `{}` | App settings (theme, language, units, etc.) |
| `created_at` | timestamptz | now() | |
| `updated_at` | timestamptz | now() | Auto-updated by trigger |

### `workouts`
Tracks each sub-session status (done/fail).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | → `auth.users` |
| `week` | int | 1-indexed |
| `day` | int | 0–3 (Mon/Tue/Thu/Fri) |
| `sub` | text | `pesas` \| `cam` \| `abs` |
| `status` | text | `done` \| `fail` |
| `updated_at` | timestamptz | |

Unique constraint: `(user_id, week, day, sub)`

### `meals`
One row per logged food item per day.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | Client-generated UUID |
| `user_id` | uuid FK | |
| `date` | date | YYYY-MM-DD |
| `item` | text | Food name |
| `kcal` | int | |
| `protein` | int | grams |
| `carbs` | int | grams |
| `fat` | int | grams |
| `is_plan_meal` | boolean | Added from weekly plan |
| `created_at` | timestamptz | |

Index: `(user_id, date DESC)`

### `weight_logs`
One entry per date per user.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `date` | date | |
| `weight_kg` | decimal(5,2) | |
| `notes` | text | Optional |
| `created_at` | timestamptz | |

Unique constraint: `(user_id, date)`

### `progress_photos`
Metadata only. Actual images go in Supabase Storage (`progress-photos` bucket).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `date` | date | Photo date |
| `storage_path` | text | Path inside bucket, e.g. `{uid}/2026-07-01.jpg` |
| `weight_kg` | decimal(5,2) | Optional measurement at photo time |
| `fat_pct` | decimal(4,1) | Optional |
| `waist_cm` | decimal(5,1) | Optional |
| `notes` | text | |
| `created_at` | timestamptz | |

### `push_subscriptions`
Web Push notification subscriptions.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `subscription` | jsonb | Full push subscription object |
| `created_at` | timestamptz | |

## RLS Policies

All tables use the same pattern: users can only SELECT / INSERT / UPDATE / DELETE their own rows.

```sql
-- Pattern applied to every table:
ALTER TABLE public.<table> ENABLE ROW LEVEL SECURITY;
CREATE POLICY "<table>_own" ON public.<table>
  FOR ALL
  USING (auth.uid() = <id_column>)
  WITH CHECK (auth.uid() = <id_column>);
```

- `profiles`: `id_column = id`
- All others: `id_column = user_id`

## Auto-create Profile on Sign-Up

A PostgreSQL trigger creates a row in `profiles` automatically when a user signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, nombre, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Usuario'),
    NEW.raw_user_meta_data->>'username'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Supabase Setup Steps

1. Go to [supabase.com](https://supabase.com) → New Project
2. In SQL Editor → run `supabase/schema.sql` from this repo
3. In Authentication → Settings:
   - Site URL: `https://zivml123.github.io/font/`
   - Disable email confirmation (optional, but recommended for mobile UX)
4. Copy your Project URL and anon key
5. In TRACKLIFE → Perfil → Ajustes → Sincronización: paste URL and anon key
6. The app will reload and sync all future data to Supabase

## Migration from localStorage

When a user has existing local data and signs in for the first time:
- The app detects local data under `zivplan_*` keys
- Shows a "Mover mis datos a la nube" button in Settings
- Migration reads each key and upserts to Supabase (no data is deleted from localStorage)
- The function is `migrateLocalToCloud()` in `src/storage.js`

## Supabase Storage (Progress Photos)

Bucket: `progress-photos` (private, RLS-protected)

Storage RLS policy:
```sql
CREATE POLICY "photos_own" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'progress-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'progress-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

File path convention: `{user_id}/{date}-{uuid}.jpg`

> **Phase 2:** Photo upload to Storage not yet implemented in the app. Currently photos are stored as compressed base64 in localStorage.
