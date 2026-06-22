// Minimal pub/sub state store
const listeners = {};

export const state = {
  tab: 'workout',            // 'workout' | 'food' | 'progress' | 'profile'
  foodSubTab: 'log',         // 'log' | 'menu'
  foodDate: new Date(),      // current date shown in food log
  menuDow: new Date().getDay(), // 0-6
  workoutProgress: {},       // { 'w1d0-pesas': 'done', ... }
  numWeeks: 4,
  meals: {},                 // { '2026-06-22': [...] }
  weightLog: [],             // [{ date, weight_kg }, ...]
  user: null,                // Supabase user or null
  profile: null,             // profile object
  supabaseReady: false,
};

export function get(key) { return state[key]; }

export function set(key, value) {
  state[key] = value;
  emit(key, value);
}

export function on(event, cb) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(cb);
}

export function off(event, cb) {
  if (listeners[event]) listeners[event] = listeners[event].filter(f => f !== cb);
}

function emit(event, data) {
  if (listeners[event]) listeners[event].forEach(cb => cb(data));
}
