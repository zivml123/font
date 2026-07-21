// Storage layer — Supabase when configured + logged in, localStorage fallback.
// All functions return Promises. Never deletes localStorage data.

import { state, DEFAULT_SETTINGS } from './state.js';

const LS_PREFIX = 'zivplan_';

// ─── Detect Supabase ──────────────────────────────────────────────────────────
function sb() { return window.__supabase || null; }
function userId() { return state.user?.id || null; }
function useCloud() { return !!(sb() && userId()); }

// ─── localStorage helpers ─────────────────────────────────────────────────────
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(LS_PREFIX + key) || 'null'); } catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)); return true; } catch { return false; }
}

// ─── Workout Progress ─────────────────────────────────────────────────────────
export async function getWorkoutProgress() {
  if (useCloud()) {
    const { data, error } = await sb()
      .from('workouts')
      .select('week, day, sub, status')
      .eq('user_id', userId());
    if (error) throw error;
    const progress = {};
    for (const row of data) {
      if (row.status) progress[`w${row.week}d${row.day}-${row.sub}`] = row.status;
    }
    return progress;
  }
  return lsGet('workout_progress') || {};
}

export async function setWorkoutStatus(week, day, sub, status) {
  const key = `w${week}d${day}-${sub}`;
  const progress = { ...state.workoutProgress };
  if (status === null) delete progress[key];
  else progress[key] = status;

  if (useCloud()) {
    if (status === null) {
      await sb().from('workouts')
        .delete()
        .eq('user_id', userId())
        .eq('week', week).eq('day', day).eq('sub', sub);
    } else {
      await sb().from('workouts')
        .upsert({ user_id: userId(), week, day, sub, status }, { onConflict: 'user_id,week,day,sub' });
    }
  }
  lsSet('workout_progress', progress);
  return progress;
}

export async function resetWorkoutProgress() {
  if (useCloud()) {
    await sb().from('workouts').delete().eq('user_id', userId());
  }
  lsSet('workout_progress', {});
  return {};
}

// ─── Num Weeks ────────────────────────────────────────────────────────────────
export async function getNumWeeks() {
  if (useCloud()) {
    const { data } = await sb().from('profiles').select('num_weeks').eq('id', userId()).single();
    return data?.num_weeks || 4;
  }
  return lsGet('num_weeks') || 4;
}

export async function setNumWeeks(n) {
  if (useCloud()) {
    await sb().from('profiles').upsert({ id: userId(), num_weeks: n });
  }
  lsSet('num_weeks', n);
}

// ─── Meals ────────────────────────────────────────────────────────────────────
export async function getMeals(dateStr) {
  if (useCloud()) {
    const { data, error } = await sb()
      .from('meals')
      .select('*')
      .eq('user_id', userId())
      .eq('date', dateStr)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }
  return lsGet(`meals_${dateStr}`) || [];
}

export async function addMeal(dateStr, meal) {
  const id = meal.id || crypto.randomUUID();
  const entry = { ...meal, id };

  if (useCloud()) {
    const { data, error } = await sb().from('meals').insert({
      id,
      user_id: userId(),
      date: dateStr,
      item: meal.item,
      kcal: meal.kcal || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      is_plan_meal: meal.is_plan_meal || false,
    }).select().single();
    if (error) throw error;
    return data;
  }

  const meals = lsGet(`meals_${dateStr}`) || [];
  meals.push(entry);
  lsSet(`meals_${dateStr}`, meals);
  return entry;
}

export async function deleteMeal(dateStr, mealId) {
  if (useCloud()) {
    await sb().from('meals').delete().eq('id', mealId).eq('user_id', userId());
  }
  const meals = (lsGet(`meals_${dateStr}`) || []).filter(m => m.id !== mealId);
  lsSet(`meals_${dateStr}`, meals);
  return meals;
}

// ─── Weight Log ───────────────────────────────────────────────────────────────
export async function getWeightLog() {
  if (useCloud()) {
    const { data, error } = await sb()
      .from('weight_logs')
      .select('date, weight_kg, notes')
      .eq('user_id', userId())
      .order('date', { ascending: true });
    if (error) throw error;
    return data || [];
  }
  return lsGet('weight_log') || [];
}

export async function addWeightEntry(dateStr, weight_kg, notes = '') {
  if (useCloud()) {
    const { data, error } = await sb().from('weight_logs')
      .upsert({ user_id: userId(), date: dateStr, weight_kg, notes }, { onConflict: 'user_id,date' })
      .select().single();
    if (error) throw error;
    return data;
  }
  const log = lsGet('weight_log') || [];
  const idx = log.findIndex(e => e.date === dateStr);
  if (idx >= 0) log[idx] = { date: dateStr, weight_kg, notes };
  else log.push({ date: dateStr, weight_kg, notes });
  log.sort((a, b) => a.date.localeCompare(b.date));
  lsSet('weight_log', log);
  return { date: dateStr, weight_kg, notes };
}

// ─── Profile ──────────────────────────────────────────────────────────────────
const DEFAULT_PROFILE = {
  nombre: 'Usuario',
  display_name: 'Usuario',
  username: null,
  inbody_current: {
    fecha: '—',
    peso_kg: 0,
    grasa_pct: 0,
    smm_kg: 0,
    tmb_kcal: 0,
    mineral_oseo_kg: 0,
    grasa_visceral: 0,
    cintura_cadera: 0,
  },
  inbody_history: [],
  objetivos: {
    peso_meta_kg: 75,
    grasa_meta_pct: 15,
    kcal_meta: 2000,
    proteina_meta_g: 160,
  },
};

export async function getProfile() {
  if (useCloud()) {
    const { data } = await sb().from('profiles').select('*').eq('id', userId()).single();
    return data || DEFAULT_PROFILE;
  }
  return lsGet('profile') || DEFAULT_PROFILE;
}

export async function updateProfile(updates) {
  const current = await getProfile();
  const merged = { ...current, ...updates };
  if (useCloud()) {
    await sb().from('profiles').upsert({ id: userId(), ...merged });
  }
  lsSet('profile', merged);
  return merged;
}

export async function addInBodyEntry(inbodyData) {
  const profile = await getProfile();
  const history = [...(profile.inbody_history || [])];
  history.push({ ...profile.inbody_current, archived_at: new Date().toISOString() });
  return updateProfile({ inbody_current: inbodyData, inbody_history: history });
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export async function getSettings() {
  if (useCloud()) {
    const { data } = await sb().from('profiles').select('settings').eq('id', userId()).single();
    return { ...DEFAULT_SETTINGS, ...(data?.settings || {}) };
  }
  return { ...DEFAULT_SETTINGS, ...(lsGet('settings') || {}) };
}

export async function setSettings(updates) {
  const current = await getSettings();
  const merged = {
    ...current,
    ...updates,
    notifications: { ...current.notifications, ...(updates.notifications || {}) },
  };
  if (useCloud()) {
    await sb().from('profiles').upsert({ id: userId(), settings: merged });
  }
  lsSet('settings', merged);
  return merged;
}

// ─── Progress Photos (metadata) ───────────────────────────────────────────────
// Full images stay in localStorage (base64). Cloud stores metadata + storage path.
export async function getProgressPhotos() {
  if (useCloud()) {
    const { data, error } = await sb()
      .from('progress_photos')
      .select('*')
      .eq('user_id', userId())
      .order('date', { ascending: true });
    if (error) throw error;
    return data || [];
  }
  return lsGet('progress_photos') || [];
}

export async function addProgressPhotoMeta(meta) {
  const id = meta.id || crypto.randomUUID();
  if (useCloud()) {
    const { data, error } = await sb().from('progress_photos').insert({
      id,
      user_id: userId(),
      date: meta.date,
      storage_path: meta.storage_path || null,
      weight_kg: meta.weight_kg || null,
      fat_pct: meta.fat_pct || null,
      waist_cm: meta.waist_cm || null,
      notes: meta.notes || '',
    }).select().single();
    if (error) throw error;
    return data;
  }
  return { id, ...meta };
}

export async function deleteProgressPhotoMeta(photoId) {
  if (useCloud()) {
    await sb().from('progress_photos').delete().eq('id', photoId).eq('user_id', userId());
  }
}

// ─── Range query for progress charts ──────────────────────────────────────────
export async function getMealsRange(startDateStr, endDateStr) {
  if (useCloud()) {
    const { data, error } = await sb()
      .from('meals')
      .select('date, kcal, protein, carbs, fat')
      .eq('user_id', userId())
      .gte('date', startDateStr)
      .lte('date', endDateStr)
      .order('date', { ascending: true });
    if (error) throw error;
    return data || [];
  }
  const results = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const ds = dateStr(d);
    const meals = lsGet(`meals_${ds}`) || [];
    results.push(...meals.map(m => ({ date: ds, ...m })));
  }
  return results;
}

// ─── Migration: localStorage → Supabase ───────────────────────────────────────
// Safe: reads local data and upserts to cloud. Never deletes localStorage.
// Returns { migrated: string[], errors: string[] }
export async function migrateLocalToCloud() {
  if (!useCloud()) throw new Error('Debes estar conectado a Supabase para migrar.');

  const migrated = [];
  const errors = [];

  // Profile
  const localProfile = lsGet('profile');
  if (localProfile) {
    try {
      await sb().from('profiles').upsert({ id: userId(), ...localProfile });
      migrated.push('Perfil');
    } catch (e) { errors.push(`Perfil: ${e.message}`); }
  }

  // Settings
  const localSettings = lsGet('settings');
  if (localSettings) {
    try {
      await sb().from('profiles').upsert({ id: userId(), settings: localSettings });
      migrated.push('Ajustes');
    } catch (e) { errors.push(`Ajustes: ${e.message}`); }
  }

  // Workout progress
  const localWorkouts = lsGet('workout_progress') || {};
  const workoutEntries = Object.entries(localWorkouts);
  if (workoutEntries.length) {
    let wOk = 0;
    for (const [key, status] of workoutEntries) {
      const m = key.match(/^w(\d+)d(\d+)-(\w+)$/);
      if (!m) continue;
      try {
        await sb().from('workouts').upsert({
          user_id: userId(),
          week: parseInt(m[1]),
          day: parseInt(m[2]),
          sub: m[3],
          status,
        }, { onConflict: 'user_id,week,day,sub' });
        wOk++;
      } catch (e) { errors.push(`Entreno ${key}: ${e.message}`); }
    }
    if (wOk) migrated.push(`Entrenos (${wOk} registros)`);
  }

  // Weight log
  const weightLog = lsGet('weight_log') || [];
  if (weightLog.length) {
    let wOk = 0;
    for (const e of weightLog) {
      try {
        await sb().from('weight_logs').upsert({
          user_id: userId(), date: e.date, weight_kg: e.weight_kg, notes: e.notes || '',
        }, { onConflict: 'user_id,date' });
        wOk++;
      } catch (err) { errors.push(`Peso ${e.date}: ${err.message}`); }
    }
    if (wOk) migrated.push(`Peso (${wOk} entradas)`);
  }

  // Meals — last 60 days
  const today = new Date();
  let mealCount = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    const meals = lsGet(`meals_${ds}`) || [];
    for (const meal of meals) {
      try {
        await sb().from('meals').upsert({
          id: meal.id || crypto.randomUUID(),
          user_id: userId(),
          date: ds,
          item: meal.item,
          kcal: meal.kcal || 0,
          protein: meal.protein || 0,
          carbs: meal.carbs || 0,
          fat: meal.fat || 0,
          is_plan_meal: meal.is_plan_meal || false,
        }, { onConflict: 'id' });
        mealCount++;
      } catch { /* skip duplicate */ }
    }
  }
  if (mealCount) migrated.push(`Comidas (${mealCount} registros)`);

  return { migrated, errors };
}

// ─── Daily Abs Tracker (localStorage only) ───────────────────────────────────
export function getDailyAbsStatus(ds) {
  try {
    const map = JSON.parse(localStorage.getItem('zivplan_daily_abs') || '{}');
    return !!map[ds];
  } catch { return false; }
}

export function toggleDailyAbs(ds) {
  try {
    const map = JSON.parse(localStorage.getItem('zivplan_daily_abs') || '{}');
    if (map[ds]) delete map[ds];
    else map[ds] = true;
    localStorage.setItem('zivplan_daily_abs', JSON.stringify(map));
    return !!map[ds];
  } catch { return false; }
}

export function getAbsStreak() {
  try {
    const map = JSON.parse(localStorage.getItem('zivplan_daily_abs') || '{}');
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (map[ds]) streak++;
      else break;
    }
    return streak;
  } catch { return 0; }
}

// ─── Utilities ────────────────────────────────────────────────────────────────
export function dateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function hasLocalData() {
  return !!(
    lsGet('profile') ||
    Object.keys(lsGet('workout_progress') || {}).length ||
    (lsGet('weight_log') || []).length
  );
}
