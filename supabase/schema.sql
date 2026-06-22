-- Ziv Plan — Supabase Schema
-- Run this in the Supabase SQL editor after creating your project.

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre        TEXT NOT NULL DEFAULT 'Ziv Mendelson',
  inbody_current JSONB NOT NULL DEFAULT '{
    "fecha": "2026-06-19",
    "peso_kg": 79.8,
    "grasa_pct": 18.7,
    "smm_kg": 37.1,
    "tmb_kcal": 1771,
    "mineral_oseo_kg": 3.4,
    "grasa_visceral": 6.4,
    "cintura_cadera": 0.88
  }',
  inbody_history JSONB NOT NULL DEFAULT '[]',
  objetivos JSONB NOT NULL DEFAULT '{
    "peso_meta_kg": 74.84,
    "grasa_meta_pct": 15,
    "kcal_meta": 1950,
    "proteina_meta_g": 175
  }',
  num_weeks     INT NOT NULL DEFAULT 4,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── Workouts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workouts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week       INT NOT NULL CHECK (week >= 1),
  day        INT NOT NULL CHECK (day >= 0 AND day <= 3),
  sub        TEXT NOT NULL CHECK (sub IN ('pesas', 'cam', 'abs')),
  status     TEXT CHECK (status IN ('done', 'fail')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, week, day, sub)
);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own workouts"
  ON public.workouts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Meals ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.meals (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  item         TEXT NOT NULL,
  kcal         INT NOT NULL DEFAULT 0,
  protein      INT NOT NULL DEFAULT 0,
  carbs        INT NOT NULL DEFAULT 0,
  fat          INT NOT NULL DEFAULT 0,
  is_plan_meal BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own meals"
  ON public.meals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_meals_user_date ON public.meals (user_id, date DESC);

-- ─── Weight Log ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  weight_kg  DECIMAL(5,2) NOT NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own weight logs"
  ON public.weight_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Push Subscriptions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, (subscription->>'endpoint'))
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own push subscriptions"
  ON public.push_subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER workouts_updated_at BEFORE UPDATE ON public.workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
