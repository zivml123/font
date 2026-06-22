// Storage layer: Supabase when configured, localStorage fallback.
// All functions return promises. Supabase user must be set in state before calling cloud ops.

import { state } from './state.js';

const LS_PREFIX = 'zivplan_';

// ─── Detect Supabase ──────────────────────────────────────────────────────────
function sb() {
  return window.__supabase || null;
}
function userId() {
  return state.user?.id || null;
}
function useCloud() {
  return !!(sb() && userId());
}

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
  if (status === null) {
    delete progress[key];
  } else {
    progress[key] = status;
  }

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
      kcal: meal.kcal,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
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
  const existing = log.findIndex(e => e.date === dateStr);
  if (existing >= 0) log[existing] = { date: dateStr, weight_kg, notes };
  else log.push({ date: dateStr, weight_kg, notes });
  log.sort((a, b) => a.date.localeCompare(b.date));
  lsSet('weight_log', log);
  return { date: dateStr, weight_kg, notes };
}

// ─── Profile ──────────────────────────────────────────────────────────────────
const DEFAULT_PROFILE = {
  nombre: 'Ziv Mendelson',
  inbody_current: {
    fecha: '19 jun 2026',
    peso_kg: 79.8,
    grasa_pct: 18.7,
    smm_kg: 37.1,
    tmb_kcal: 1771,
    mineral_oseo_kg: 3.4,
    grasa_visceral: 6.4,
    cintura_cadera: 0.88,
  },
  inbody_history: [],
  objetivos: {
    peso_meta_kg: 74.84,
    grasa_meta_pct: 15,
    kcal_meta: 1950,
    proteina_meta_g: 175,
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
  // Archive current before updating
  history.push({ ...profile.inbody_current, archived_at: new Date().toISOString() });
  const updated = await updateProfile({
    inbody_current: inbodyData,
    inbody_history: history,
  });
  return updated;
}

// ─── Last N days of meals (for progress charts) ───────────────────────────────
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
  // Iterate through dates from localStorage
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

// ─── Utilities ────────────────────────────────────────────────────────────────
export function dateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
