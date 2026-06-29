-- TRACKLIFE — Supabase Schema
-- Run this in the Supabase SQL Editor after creating your project.
-- It is safe to re-run (uses IF NOT EXISTS and OR REPLACE).

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Extends auth.users. One row per user, created automatically by trigger below.
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT        UNIQUE,
  display_name    TEXT        NOT NULL DEFAULT 'Usuario',
  nombre          TEXT        NOT NULL DEFAULT 'Usuario',  -- legacy compat field
  avatar_url      TEXT,                                    -- Supabase Storage path (future)
  num_weeks       INT         NOT NULL DEFAULT 4,
  inbody_current  JSONB       NOT NULL DEFAULT '{
    "fecha": "2026-06-19",
    "peso_kg": 79.8,
    "grasa_pct": 18.7,
    "smm_kg": 37.1,
    "tmb_kcal": 1771,
    "mineral_oseo_kg": 3.4,
    "grasa_visceral": 6.4,
    "cintura_cadera": 0.88
  }'::jsonb,
  inbody_history  JSONB       NOT NULL DEFAULT '[]'::jsonb,
  objetivos       JSONB       NOT NULL DEFAULT '{
    "peso_meta_kg": 74.84,
    "grasa_meta_pct": 15,
    "kcal_meta": 1950,
    "proteina_meta_g": 175
  }'::jsonb,
  settings        JSONB       NOT NULL DEFAULT '{
    "theme": "dark",
    "language": "es",
    "units": "metric",
    "firstDayOfWeek": 1,
    "notifications": { "workout": false, "meal": false, "weight": false }
  }'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own profile" ON public.profiles;
CREATE POLICY "Users manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── Workouts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workouts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week       INT         NOT NULL CHECK (week >= 1),
  day        INT         NOT NULL CHECK (day >= 0 AND day <= 3),
  sub        TEXT        NOT NULL CHECK (sub IN ('pesas', 'cam', 'abs')),
  status     TEXT        CHECK (status IN ('done', 'fail')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, week, day, sub)
);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own workouts" ON public.workouts;
CREATE POLICY "Users manage own workouts"
  ON public.workouts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Meals ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.meals (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date         DATE        NOT NULL,
  item         TEXT        NOT NULL,
  kcal         INT         NOT NULL DEFAULT 0 CHECK (kcal >= 0),
  protein      INT         NOT NULL DEFAULT 0 CHECK (protein >= 0),
  carbs        INT         NOT NULL DEFAULT 0 CHECK (carbs >= 0),
  fat          INT         NOT NULL DEFAULT 0 CHECK (fat >= 0),
  is_plan_meal BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own meals" ON public.meals;
CREATE POLICY "Users manage own meals"
  ON public.meals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_meals_user_date ON public.meals (user_id, date DESC);

-- ─── Weight Log ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date       DATE        NOT NULL,
  weight_kg  DECIMAL(5,2) NOT NULL CHECK (weight_kg > 0),
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own weight logs" ON public.weight_logs;
CREATE POLICY "Users manage own weight logs"
  ON public.weight_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Progress Photos ─────────────────────────────────────────────────────────
-- Metadata only. Images stored in Supabase Storage bucket 'progress-photos'.
-- Path convention: {user_id}/{date}-{uuid}.jpg
CREATE TABLE IF NOT EXISTS public.progress_photos (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date         DATE        NOT NULL,
  storage_path TEXT,                    -- path inside 'progress-photos' bucket
  weight_kg    DECIMAL(5,2),
  fat_pct      DECIMAL(4,1),
  waist_cm     DECIMAL(5,1),
  notes        TEXT        DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own progress photos" ON public.progress_photos;
CREATE POLICY "Users manage own progress photos"
  ON public.progress_photos FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Push Subscriptions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB       NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, (subscription->>'endpoint'))
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users manage own push subscriptions"
  ON public.push_subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS workouts_updated_at ON public.workouts;
CREATE TRIGGER workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── Auto-create Profile on Sign-Up ──────────────────────────────────────────
-- Reads display_name and username from signUp options.data metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_display TEXT;
  v_username TEXT;
BEGIN
  v_display  := COALESCE(NEW.raw_user_meta_data->>'display_name', 'Usuario');
  v_username := NEW.raw_user_meta_data->>'username';

  INSERT INTO public.profiles (id, display_name, nombre, username)
  VALUES (NEW.id, v_display, v_display, v_username)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─── Supabase Storage (run separately in Storage section) ────────────────────
-- Create a private bucket named 'progress-photos', then add this RLS policy:
--
-- CREATE POLICY "photos_own" ON storage.objects
--   FOR ALL
--   USING (
--     bucket_id = 'progress-photos'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   )
--   WITH CHECK (
--     bucket_id = 'progress-photos'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );
