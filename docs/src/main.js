import { state, set } from './state.js';
import { renderWorkout } from './views/workout.js';
import { renderFood } from './views/food.js';
import { renderProgress } from './views/progress.js';
import { renderProfile } from './views/profile.js';
import { renderAuth, hideAuth } from './views/auth.js';
import { getDateFor, workoutKey, DAYS_PER_WEEK, SUBS } from './workoutData.js';
import { getNumWeeks } from './storage.js';

const TAB_VIEW_MAP = {
  hoy:      'hoy',
  comidas:  'food',
  entreno:  'workout',
  progreso: 'progress',
  perfil:   'profile',
};

const VIEWS = {
  hoy:      renderHoy,
  comidas:  renderFood,
  entreno:  renderWorkout,
  progreso: renderProgress,
  perfil:   renderProfile,
};

const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DAYS_ES   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const HOY_CIRC  = 282.74; // 2π × 45

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  await initSupabase();
  initTabs();
  initErrorBanner();
  registerServiceWorker();
  initInstallPrompt();
  checkOnboarding();
  hideLoading();
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

    const { data: { session } } = await sb.auth.getSession();
    if (session?.user) {
      set('user', session.user);
      set('supabaseReady', true);
      hideAuth();
    } else {
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
  const viewId = TAB_VIEW_MAP[tab] || tab;

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `${viewId}-view`));

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

// ─── HOY (Dashboard) ─────────────────────────────────────────────────────────
async function renderHoy() {
  const el = document.getElementById('hoy-view');
  if (!el) return;

  const today = dateStr(new Date());
  const now = new Date();

  const meals = JSON.parse(localStorage.getItem(`zivplan_meals_${today}`) || '[]');
  const kcal = meals.reduce((s, m) => s + (m.kcal || 0), 0);
  const prot = Math.round(meals.reduce((s, m) => s + (m.protein || 0), 0));

  let profile = null;
  try { profile = JSON.parse(localStorage.getItem('zivplan_profile') || 'null'); } catch {}

  const kcalGoal = profile?.objetivos?.kcal_meta || 1950;
  const protGoal = profile?.objetivos?.proteina_meta_g || 175;

  const numWeeks = await getNumWeeks();
  const prog = JSON.parse(localStorage.getItem('zivplan_workout_progress') || '{}');
  let wrkStatus = 'Descanso', wrkClass = '';
  outer: for (let w = 1; w <= numWeeks; w++) {
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      if (dateStr(getDateFor(w, d)) === today) {
        let done = 0, fail = 0;
        for (const sub of SUBS) {
          const st = prog[workoutKey(w, d, sub)];
          if (st === 'done') done++;
          if (st === 'fail') fail++;
        }
        if (done === SUBS.length)   { wrkStatus = '✓ Completado';  wrkClass = 'done'; }
        else if (fail > 0)          { wrkStatus = '✗ No completado'; wrkClass = 'fail'; }
        else if (done > 0)          { wrkStatus = `En progreso ${done}/${SUBS.length}`; }
        else                        { wrkStatus = 'Pendiente'; }
        break outer;
      }
    }
  }

  const kcalPct    = Math.min(1, kcal / kcalGoal);
  const kcalRemain = Math.max(0, kcalGoal - kcal);
  const ringOffset = HOY_CIRC * (1 - kcalPct);
  const protPct    = Math.min(100, Math.round((prot / protGoal) * 100));

  const avatarSrc = localStorage.getItem('zivplan_avatar') || 'assets/brand.webp';
  const nombre    = (profile?.nombre || 'Ziv').split(' ')[0];
  const dateLabel = `${DAYS_ES[now.getDay()]}, ${now.getDate()} ${MONTHS_ES[now.getMonth()]}`;

  el.innerHTML = `
    <div class="hoy-inner">
      <div class="hoy-header">
        <div>
          <div class="hoy-brand">TRACKLIFE</div>
          <div class="hoy-date">${dateLabel}</div>
        </div>
        <button class="hoy-avatar-btn" id="hoy-avatar-btn" aria-label="Perfil">
          <img src="${escAttr(avatarSrc)}" alt="" class="hoy-avatar-img" draggable="false">
        </button>
      </div>

      <div class="hoy-date-section">
        <div class="hoy-big-title">HOY</div>
      </div>

      <div class="hoy-ring-section">
        <div class="hoy-ring-wrap">
          <svg class="hoy-ring-svg" viewBox="0 0 110 110">
            <circle class="hoy-ring-bg" cx="55" cy="55" r="45"/>
            <circle class="hoy-ring-fill" cx="55" cy="55" r="45" id="hoy-ring-arc"
              style="stroke-dashoffset:${HOY_CIRC};"/>
          </svg>
          <div class="hoy-ring-center">
            <span class="hoy-ring-num">${kcal > 0 ? kcal.toLocaleString() : '0'}</span>
            <span class="hoy-ring-lbl">kcal</span>
          </div>
        </div>
        <div class="hoy-ring-sub">${kcalRemain > 0 ? `${kcalRemain.toLocaleString()} kcal restantes` : 'Meta alcanzada'}</div>
      </div>

      <div class="hoy-stats-list">
        <div class="hoy-stat-row">
          <span class="hoy-stat-lbl">Calorías</span>
          <span class="hoy-stat-val">${kcal.toLocaleString()} / ${kcalGoal.toLocaleString()}</span>
        </div>
        <div class="hoy-stat-row">
          <span class="hoy-stat-lbl">Proteína</span>
          <span class="hoy-stat-val">${prot}g / ${protGoal}g</span>
        </div>
        <div class="hoy-stat-row">
          <span class="hoy-stat-lbl">Entrenamiento</span>
          <span class="hoy-stat-val ${wrkClass}">${wrkStatus}</span>
        </div>
      </div>

      <div class="hoy-actions">
        <button class="btn btn-primary btn-full" id="hoy-btn-food">+ Registrar comida</button>
        <button class="btn btn-secondary btn-full" id="hoy-btn-workout">Ver entrenamiento</button>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const arc = document.getElementById('hoy-ring-arc');
      if (arc) arc.style.strokeDashoffset = String(ringOffset);
    });
  });

  document.getElementById('hoy-avatar-btn')?.addEventListener('click', () => switchTab('perfil'));
  document.getElementById('hoy-btn-food')?.addEventListener('click', () => switchTab('comidas'));
  document.getElementById('hoy-btn-workout')?.addEventListener('click', () => switchTab('entreno'));
}

export function refreshDashAvatar() {
  const img = document.querySelector('#hoy-avatar-btn img');
  if (!img) return;
  img.src = localStorage.getItem('zivplan_avatar') || 'assets/brand.webp';
}

window.__refreshDashStats = () => { if (state.tab === 'hoy') renderHoy(); };
window.__refreshDashPills  = () => { if (state.tab === 'hoy') renderHoy(); };

// ─── Onboarding ───────────────────────────────────────────────────────────────
function checkOnboarding() {
  if (localStorage.getItem('zivplan_profile')) return;
  showOnboarding();
}

function showOnboarding() {
  const steps = [
    { key: 'peso_actual', label: 'Tu peso actual (kg)', placeholder: '80', type: 'number', unit: 'kg', min: 30, max: 300, step: 0.1 },
    { key: 'peso_meta',   label: 'Tu peso objetivo (kg)', placeholder: '72', type: 'number', unit: 'kg', min: 30, max: 300, step: 0.1 },
    { key: 'edad',        label: 'Tu edad', placeholder: '25', type: 'number', unit: 'años', min: 14, max: 80, step: 1 },
    { key: 'dias_semana', label: 'Días de entreno / semana', placeholder: '4', type: 'number', unit: 'días/sem', min: 1, max: 7, step: 1 },
    { key: 'objetivo',    label: 'Tu objetivo principal', type: 'select', options: ['Bajar grasa', 'Ganar músculo', 'Recomposición corporal'] },
  ];
  let current = 0;
  const answers = {};

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;';

  function renderStep() {
    const s = steps[current];
    const isLast = current === steps.length - 1;

    if (s.type === 'select') {
      overlay.innerHTML = `
        <div style="width:100%;max-width:360px;">
          <div style="font-family:'Oswald',sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;color:var(--muted);margin-bottom:24px;">CONFIGURACIÓN ${current + 1} / ${steps.length}</div>
          <div style="font-family:'Oswald',sans-serif;font-size:26px;font-weight:700;color:var(--text);margin-bottom:32px;line-height:1.2;">${s.label}</div>
          ${s.options.map(o => `<button class="btn btn-secondary ob-opt" data-val="${o}" style="width:100%;text-align:left;justify-content:flex-start;font-size:15px;padding:14px 18px;margin-bottom:10px;">${o}</button>`).join('')}
        </div>
      `;
      overlay.querySelectorAll('.ob-opt').forEach(btn => {
        btn.addEventListener('click', () => { answers[s.key] = btn.dataset.val; advance(); });
      });
    } else {
      overlay.innerHTML = `
        <div style="width:100%;max-width:360px;">
          <div style="font-family:'Oswald',sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;color:var(--muted);margin-bottom:24px;">CONFIGURACIÓN ${current + 1} / ${steps.length}</div>
          <div style="font-family:'Oswald',sans-serif;font-size:26px;font-weight:700;color:var(--text);margin-bottom:32px;line-height:1.2;">${s.label}</div>
          <input id="ob-input" class="result-input" type="${s.type}" placeholder="${s.placeholder}"
            min="${s.min}" max="${s.max}" step="${s.step}" inputmode="decimal"
            style="font-size:28px;font-weight:700;text-align:center;padding:16px;width:100%;margin-bottom:8px;"
            value="${answers[s.key] || ''}">
          <div style="text-align:center;font-size:14px;color:var(--muted);margin-bottom:28px;">${s.unit}</div>
          <button class="btn btn-primary btn-full" id="ob-next" style="padding:14px;">${isLast ? 'Empezar →' : 'Siguiente →'}</button>
        </div>
      `;
      const inp = overlay.querySelector('#ob-input');
      inp?.focus();
      overlay.querySelector('#ob-next')?.addEventListener('click', () => {
        if (!inp?.value?.trim()) { inp?.focus(); return; }
        answers[s.key] = inp.value.trim();
        advance();
      });
      inp?.addEventListener('keydown', e => { if (e.key === 'Enter') overlay.querySelector('#ob-next')?.click(); });
    }
  }

  function advance() {
    if (current < steps.length - 1) { current++; renderStep(); }
    else { saveOnboarding(answers); overlay.remove(); }
  }

  function saveOnboarding(a) {
    const pesoActual = parseFloat(a.peso_actual) || 80;
    const pesoMeta   = parseFloat(a.peso_meta)   || 72;
    const profile = {
      nombre: 'ZIV MENDELSON',
      edad: parseInt(a.edad) || 25,
      dias_semana: parseInt(a.dias_semana) || 4,
      objetivo: a.objetivo || 'Bajar grasa',
      inbody_current: { peso_kg: pesoActual, grasa_pct: null, smm_kg: null, tmb_kcal: null },
      inbody_history: [],
      objetivos: {
        peso_meta_kg: pesoMeta,
        kcal_meta: Math.round(pesoActual * 24),
        proteina_meta_g: Math.round(pesoActual * 2.2),
      },
    };
    localStorage.setItem('zivplan_profile', JSON.stringify(profile));
  }

  document.body.appendChild(overlay);
  renderStep();
}

// ─── Install Prompt ───────────────────────────────────────────────────────────
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
function dateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escAttr(s) {
  return String(s || '').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  init().catch(e => {
    console.error('Init error:', e);
    hideLoading();
    showError('Error al iniciar la app: ' + e.message);
  });
});
