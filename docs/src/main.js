import { state, set } from './state.js';
import { renderWorkout } from './views/workout.js';
import { renderFood } from './views/food.js';
import { renderProgress } from './views/progress.js';
import { renderProfile } from './views/profile.js';
import { renderAuth, hideAuth } from './views/auth.js';

const VIEWS = {
  workout: renderWorkout,
  food: renderFood,
  progress: renderProgress,
  profile: renderProfile,
};

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  await initSupabase();
  initTabs();
  initErrorBanner();
  registerServiceWorker();
  initInstallPrompt();
  initDashHeader();
  hideLoading();

  // Render initial view
  await switchTab(state.tab);
}

// ─── Supabase ─────────────────────────────────────────────────────────────────
async function initSupabase() {
  const supabaseUrl = window.__SUPABASE_URL;
  const supabaseKey = window.__SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) return;

  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    const sb = createClient(supabaseUrl, supabaseKey);
    window.__supabase = sb;

    // Auth state
    const { data: { session } } = await sb.auth.getSession();
    if (session?.user) {
      set('user', session.user);
      set('supabaseReady', true);
      hideAuth();
    } else {
      // Show auth only if Supabase is configured (optional login)
      const authEl = document.getElementById('auth-screen');
      if (authEl) renderAuth();
    }

    sb.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set('user', session.user);
        set('supabaseReady', true);
        hideAuth();
      } else {
        set('user', null);
        set('supabaseReady', false);
      }
    });
  } catch (e) {
    console.warn('Supabase init failed, using localStorage:', e.message);
  }
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await switchTab(btn.dataset.tab);
    });
  });
}

async function switchTab(tab) {
  set('tab', tab);

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `${tab}-view`));

  try {
    await VIEWS[tab]?.();
  } catch (e) {
    showError('Error cargando la sección: ' + e.message);
    console.error(e);
  }
}

// ─── Error Banner ─────────────────────────────────────────────────────────────
function initErrorBanner() {
  const closeBtn = document.querySelector('#error-banner button');
  closeBtn?.addEventListener('click', hideError);
}

function showError(msg) {
  const banner = document.getElementById('error-banner');
  if (!banner) return;
  banner.querySelector('span').textContent = msg;
  banner.classList.remove('hidden');
}

function hideError() {
  document.getElementById('error-banner')?.classList.add('hidden');
}

window.__showAppError = showError;

// ─── Service Worker ───────────────────────────────────────────────────────────
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/font/sw.js').catch(e => {
      console.warn('SW registration failed:', e.message);
    });
  }
}

// ─── Dashboard Header ─────────────────────────────────────────────────────────
const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DAYS_ES   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

export function refreshDashAvatar() {
  const img      = document.getElementById('dash-avatar-img');
  const initials = document.getElementById('dash-avatar-initials');
  if (!img) return;
  const stored = localStorage.getItem('zivplan_avatar');
  if (stored) {
    img.src = stored;
    img.classList.remove('hidden');
    if (initials) initials.classList.add('hidden');
  } else {
    // fall back to brand image
    img.src = 'assets/brand.webp';
    img.classList.remove('hidden');
    if (initials) initials.classList.add('hidden');
  }
}

function initDashHeader() {
  // Live date
  const now = new Date();
  const dateEl = document.getElementById('dash-date');
  if (dateEl) {
    dateEl.textContent = `${DAYS_ES[now.getDay()]}, ${now.getDate()} ${MONTHS_ES[now.getMonth()]} ${now.getFullYear()}`;
  }

  // User name from localStorage
  const nameEl = document.getElementById('dash-name');
  if (nameEl) {
    try {
      const raw = localStorage.getItem('zivplan_profile');
      const p = raw ? JSON.parse(raw) : null;
      nameEl.textContent = (p?.nombre || 'ZIV MENDELSON').toUpperCase();
    } catch { nameEl.textContent = 'ZIV MENDELSON'; }
  }

  // Avatar display
  refreshDashAvatar();

  // Avatar click → go to profile tab to change photo
  document.getElementById('dash-avatar')?.addEventListener('click', () => {
    switchTab('profile');
  });
}

// ─── Install Prompt (A2HS) ────────────────────────────────────────────────────
function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    window.__deferredInstallPrompt = e;
  });
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function hideLoading() {
  const el = document.getElementById('loading-screen');
  if (el) {
    el.classList.add('hidden');
    setTimeout(() => el.remove(), 400);
  }
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  init().catch(e => {
    console.error('Init error:', e);
    hideLoading();
    showError('Error al iniciar la app: ' + e.message);
  });
});
