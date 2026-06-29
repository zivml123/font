// Minimal reactive state store — pub/sub over a plain object.
const listeners = {};

export const DEFAULT_SETTINGS = {
  theme: 'dark',          // 'dark' | future: 'light' | 'system'
  language: 'es',         // 'es' | 'en' (full i18n strings: future)
  units: 'metric',        // 'metric' | 'imperial'
  firstDayOfWeek: 1,      // 0=Sunday, 1=Monday
  notifications: {
    workout: false,
    meal: false,
    weight: false,
  },
};

export const state = {
  tab: 'hoy',               // 'hoy' | 'comidas' | 'entreno' | 'progreso' | 'perfil'
  progressSubTab: 'fotos',  // 'fotos' | 'medidas' | 'graficas'
  foodSubTab: 'log',        // 'log' | 'menu'
  foodDate: new Date(),     // current date shown in food log
  menuDow: new Date().getDay(),
  workoutProgress: {},      // { 'w1d0-pesas': 'done', ... }
  numWeeks: 4,
  meals: {},                // { '2026-06-22': [...] }
  weightLog: [],
  user: null,               // Supabase user or null
  profile: null,            // profile object
  supabaseReady: false,
  settings: { ...DEFAULT_SETTINGS },
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
