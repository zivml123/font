import { state, set } from '../state.js';
import {
  getProfile, updateProfile, getSettings, setSettings,
  migrateLocalToCloud, hasLocalData,
} from '../storage.js';
import { getBackendUrl, setBackendUrl } from '../api.js';
import { toastSaved, toastError, toastInfo } from '../components/toast.js';
import { confirmModal } from '../components/modal.js';

// Renders settings screen into containerEl.
// onBack: callback to return to profile view.
export async function renderSettings(containerEl, onBack) {
  const settings = state.settings || {};
  const profile = state.profile || {};
  const user = state.user;
  const sb = window.__supabase;
  const isCloud = !!(sb && user);
  const hasLocal = hasLocalData();

  const nombre = profile.display_name || profile.nombre || user?.email || 'Usuario';
  const username = profile.username || '';
  const email = user?.email || '';

  containerEl.innerHTML = `
    <div class="settings-screen">

      <!-- Header -->
      <div class="settings-header">
        <button class="settings-back-btn" id="settings-back" aria-label="Volver al perfil">
          ← Perfil
        </button>
        <div class="settings-title">Ajustes</div>
      </div>

      <!-- Account -->
      <div class="profile-section">
        <div class="profile-section-title">Cuenta</div>
        <div class="settings-row">
          <span class="settings-label">Nombre</span>
          <input class="settings-input settings-input-inline" type="text" id="s-name"
            value="${escAttr(nombre)}" placeholder="Tu nombre">
        </div>
        <div class="settings-row">
          <span class="settings-label">Usuario</span>
          <input class="settings-input settings-input-inline" type="text" id="s-username"
            value="${escAttr(username)}" placeholder="usuario_único" autocomplete="off" spellcheck="false">
        </div>
        ${email ? `
        <div class="settings-row">
          <span class="settings-label">Correo</span>
          <span class="settings-value">${escHtml(email)}</span>
        </div>
        ` : ''}
        <div class="settings-row-action">
          <button class="btn btn-secondary btn-sm" id="s-save-account">Guardar cuenta</button>
        </div>
      </div>

      <!-- Goals -->
      <div class="profile-section">
        <div class="profile-section-title">Metas</div>
        <div class="settings-row">
          <span class="settings-label">Calorías / día</span>
          <input class="settings-input settings-input-num" type="number" id="s-kcal"
            value="${profile.objetivos?.kcal_meta || 2000}" min="1000" max="5000">
        </div>
        <div class="settings-row">
          <span class="settings-label">Proteína / día (g)</span>
          <input class="settings-input settings-input-num" type="number" id="s-prot"
            value="${profile.objetivos?.proteina_meta_g || 160}" min="30" max="500">
        </div>
        <div class="settings-row">
          <span class="settings-label">Peso meta (kg)</span>
          <input class="settings-input settings-input-num" type="number" id="s-peso"
            value="${profile.objetivos?.peso_meta_kg || 75}" step="0.1" min="40" max="200">
        </div>
        <div class="settings-row-action">
          <button class="btn btn-secondary btn-sm" id="s-save-goals">Guardar metas</button>
        </div>
      </div>

      <!-- Preferences -->
      <div class="profile-section">
        <div class="profile-section-title">Preferencias</div>

        <div class="settings-row">
          <span class="settings-label">Tema</span>
          <select class="settings-select" id="s-theme">
            <option value="dark" ${settings.theme === 'dark' || !settings.theme ? 'selected' : ''}>Oscuro (por defecto)</option>
            <option value="light" disabled>Claro (próximamente)</option>
            <option value="system" disabled>Sistema (próximamente)</option>
          </select>
        </div>

        <div class="settings-row">
          <span class="settings-label">Idioma</span>
          <select class="settings-select" id="s-language">
            <option value="es" ${settings.language !== 'en' ? 'selected' : ''}>Español</option>
            <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English (próximamente)</option>
          </select>
        </div>

        <div class="settings-row">
          <span class="settings-label">Unidades</span>
          <select class="settings-select" id="s-units">
            <option value="metric" ${settings.units !== 'imperial' ? 'selected' : ''}>Métrico (kg, cm)</option>
            <option value="imperial" ${settings.units === 'imperial' ? 'selected' : ''}>Imperial (lb, in)</option>
          </select>
        </div>

        <div class="settings-row">
          <span class="settings-label">Primer día de la semana</span>
          <select class="settings-select" id="s-firstday">
            <option value="1" ${(settings.firstDayOfWeek ?? 1) === 1 ? 'selected' : ''}>Lunes</option>
            <option value="0" ${settings.firstDayOfWeek === 0 ? 'selected' : ''}>Domingo</option>
          </select>
        </div>

        <div class="settings-row-action">
          <button class="btn btn-secondary btn-sm" id="s-save-prefs">Guardar preferencias</button>
        </div>
      </div>

      <!-- Notifications -->
      <div class="profile-section">
        <div class="profile-section-title">Notificaciones</div>
        <div class="settings-row">
          <span class="settings-label">Recordatorio de entreno</span>
          <label class="toggle-switch">
            <input type="checkbox" id="s-notif-workout" ${settings.notifications?.workout ? 'checked' : ''}>
            <span class="toggle-track"></span>
          </label>
        </div>
        <div class="settings-row">
          <span class="settings-label">Recordatorio de comida</span>
          <label class="toggle-switch">
            <input type="checkbox" id="s-notif-meal" ${settings.notifications?.meal ? 'checked' : ''}>
            <span class="toggle-track"></span>
          </label>
        </div>
        <div class="settings-row">
          <span class="settings-label">Recordatorio de pesaje</span>
          <label class="toggle-switch">
            <input type="checkbox" id="s-notif-weight" ${settings.notifications?.weight ? 'checked' : ''}>
            <span class="toggle-track"></span>
          </label>
        </div>
        <div class="settings-row-action">
          <button class="btn btn-secondary btn-sm" id="s-save-notif">Guardar notificaciones</button>
        </div>
      </div>

      <!-- Cloud Sync (Supabase) -->
      <div class="profile-section">
        <div class="profile-section-title">Sincronización en la nube</div>
        <div style="padding:8px 16px 4px;">
          <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">
            ${isCloud
              ? `<span style="color:var(--done)">✓ Conectado como ${escHtml(email)}</span>`
              : 'Ingresa tu URL y clave anónima de Supabase para activar la sincronización en la nube.'
            }
          </p>
          <input class="auth-input" type="url" id="s-sb-url"
            placeholder="https://xxxx.supabase.co"
            value="${escAttr(localStorage.getItem('zivplan_supabase_url') || window.__SUPABASE_URL || '')}"
            autocomplete="off">
          <input class="auth-input" type="text" id="s-sb-key"
            placeholder="eyJ... (anon key)"
            value="${escAttr(localStorage.getItem('zivplan_supabase_key') || window.__SUPABASE_KEY || '')}"
            autocomplete="off" spellcheck="false">
          <button class="btn btn-secondary btn-full" id="s-save-supabase" style="margin-top:10px;">
            Guardar y reconectar
          </button>
        </div>
      </div>

      <!-- AI Backend -->
      <div class="profile-section">
        <div class="profile-section-title">Análisis de comida con IA</div>
        <div style="padding:8px 16px 4px;">
          <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">
            URL de tu backend proxy (guarda tu API key de Anthropic de forma segura).
          </p>
          <input class="auth-input" type="url" id="s-backend-url"
            placeholder="https://mi-app.onrender.com"
            value="${escAttr(getBackendUrl())}" autocomplete="off">
          <button class="btn btn-secondary btn-full" id="s-save-backend" style="margin-top:10px;">
            Guardar URL del backend
          </button>
        </div>
      </div>

      <!-- Data Migration -->
      ${isCloud && hasLocal ? `
      <div class="profile-section" id="migration-section">
        <div class="profile-section-title">Datos locales</div>
        <div style="padding:8px 16px 4px;">
          <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">
            Tienes datos guardados en este dispositivo. Puedes moverlos a la nube para acceder desde cualquier lado.
            Tus datos locales NO serán eliminados.
          </p>
          <div id="migration-result" class="hidden" style="font-size:12px;padding:8px;border-radius:8px;margin-bottom:10px;"></div>
          <button class="btn btn-secondary btn-full" id="s-migrate">
            Mover mis datos a la nube
          </button>
        </div>
      </div>
      ` : ''}

      <!-- Session -->
      <div class="profile-section">
        <div class="profile-section-title">Sesión</div>
        ${user ? `
        <div style="padding:12px 16px;">
          <button class="btn btn-ghost btn-full" id="s-logout">Cerrar sesión</button>
        </div>
        ` : sb ? `
        <div style="padding:12px 16px;">
          <button class="btn btn-secondary btn-full" id="s-login">Iniciar sesión</button>
        </div>
        ` : `
        <div class="settings-row">
          <span class="settings-label" style="color:var(--muted);font-size:12px;">
            Configura Supabase arriba para activar cuentas.
          </span>
        </div>
        `}
      </div>

      <div style="height:32px;"></div>
    </div>
  `;

  bindSettingsEvents(containerEl, onBack);
}

function bindSettingsEvents(el, onBack) {
  el.querySelector('#settings-back')?.addEventListener('click', onBack);

  // Username lowercase-only
  el.querySelector('#s-username')?.addEventListener('input', e => {
    e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
  });

  // Save account
  el.querySelector('#s-save-account')?.addEventListener('click', async () => {
    const nombre = el.querySelector('#s-name')?.value.trim();
    const username = el.querySelector('#s-username')?.value.trim();
    if (!nombre) { toastInfo('Ingresa tu nombre.'); return; }
    try {
      // Check username uniqueness if changed
      const sb = window.__supabase;
      const uid = state.user?.id;
      if (sb && uid && username && username !== (state.profile?.username || '')) {
        const { data } = await sb.from('profiles')
          .select('id').eq('username', username).maybeSingle();
        if (data) { toastError('Ese nombre de usuario ya está en uso.'); return; }
      }
      const updated = await updateProfile({ nombre, display_name: nombre, username: username || null });
      set('profile', updated);
      toastSaved();
    } catch (e) { toastError('Error: ' + e.message); }
  });

  // Save goals
  el.querySelector('#s-save-goals')?.addEventListener('click', async () => {
    const kcal_meta = parseInt(el.querySelector('#s-kcal')?.value) || 2000;
    const proteina_meta_g = parseInt(el.querySelector('#s-prot')?.value) || 160;
    const peso_meta_kg = parseFloat(el.querySelector('#s-peso')?.value) || 75;
    try {
      const profile = state.profile || {};
      const updated = await updateProfile({
        objetivos: { ...(profile.objetivos || {}), kcal_meta, proteina_meta_g, peso_meta_kg },
      });
      set('profile', updated);
      window.__refreshDashPills?.();
      toastSaved();
    } catch (e) { toastError('Error: ' + e.message); }
  });

  // Save preferences
  el.querySelector('#s-save-prefs')?.addEventListener('click', async () => {
    const theme = el.querySelector('#s-theme')?.value || 'dark';
    const language = el.querySelector('#s-language')?.value || 'es';
    const units = el.querySelector('#s-units')?.value || 'metric';
    const firstDayOfWeek = parseInt(el.querySelector('#s-firstday')?.value ?? 1);
    try {
      const updated = await setSettings({ theme, language, units, firstDayOfWeek });
      set('settings', updated);
      applyTheme(theme);
      toastSaved();
    } catch (e) { toastError('Error: ' + e.message); }
  });

  // Save notifications
  el.querySelector('#s-save-notif')?.addEventListener('click', async () => {
    const workout = el.querySelector('#s-notif-workout')?.checked || false;
    const meal = el.querySelector('#s-notif-meal')?.checked || false;
    const weight = el.querySelector('#s-notif-weight')?.checked || false;
    try {
      const updated = await setSettings({ notifications: { workout, meal, weight } });
      set('settings', updated);
      toastSaved();
    } catch (e) { toastError('Error: ' + e.message); }
  });

  // Save Supabase config
  el.querySelector('#s-save-supabase')?.addEventListener('click', () => {
    const url = el.querySelector('#s-sb-url')?.value.trim().replace(/\/$/, '');
    const key = el.querySelector('#s-sb-key')?.value.trim();
    if (!url || !key) { toastInfo('Ingresa la URL y la clave anónima de Supabase.'); return; }
    if (!url.startsWith('https://')) { toastInfo('La URL debe empezar con https://'); return; }
    localStorage.setItem('zivplan_supabase_url', url);
    localStorage.setItem('zivplan_supabase_key', key);
    toastInfo('Guardado. Recargando para conectar...');
    setTimeout(() => location.reload(), 1200);
  });

  // Save backend URL
  el.querySelector('#s-save-backend')?.addEventListener('click', () => {
    const url = el.querySelector('#s-backend-url')?.value.trim();
    if (!url) { toastInfo('Ingresa la URL de tu backend.'); return; }
    if (!url.startsWith('http')) { toastInfo('La URL debe empezar con https://'); return; }
    setBackendUrl(url);
    toastSaved();
    toastInfo('Backend guardado. Ya puedes analizar comidas.');
  });

  // Migration
  el.querySelector('#s-migrate')?.addEventListener('click', async () => {
    const resultEl = el.querySelector('#migration-result');
    const btn = el.querySelector('#s-migrate');
    btn.disabled = true; btn.textContent = 'Migrando...';
    try {
      const { migrated, errors } = await migrateLocalToCloud();
      if (resultEl) {
        resultEl.classList.remove('hidden');
        resultEl.style.background = errors.length ? 'var(--fail-dim)' : 'var(--done-dim)';
        resultEl.style.color = errors.length ? 'var(--fail)' : 'var(--done)';
        resultEl.innerHTML = migrated.length
          ? `✓ Migrado: ${migrated.join(', ')}` + (errors.length ? `<br>⚠ Errores: ${errors.join(', ')}` : '')
          : 'No se encontraron datos locales para migrar.';
      }
      if (!errors.length) toastSaved();
    } catch (e) {
      toastError('Error al migrar: ' + e.message);
    } finally {
      btn.disabled = false; btn.textContent = 'Mover mis datos a la nube';
    }
  });

  // Logout
  el.querySelector('#s-logout')?.addEventListener('click', () => {
    confirmModal('¿Cerrar sesión?', async () => {
      await window.__supabase?.auth.signOut();
      set('user', null);
      set('supabaseReady', false);
      set('profile', null);
      location.reload();
    }, 'Cerrar sesión', false);
  });

  // Login (when no user but Supabase configured)
  el.querySelector('#s-login')?.addEventListener('click', () => {
    const { showAuth } = window.__authModule || {};
    if (showAuth) showAuth();
  });
}

// Apply theme to document root (Dark is default, no attribute needed)
function applyTheme(theme) {
  if (theme === 'dark' || !theme) {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.dataset.theme = theme;
  }
}

export function applyStoredTheme() {
  try {
    const s = JSON.parse(localStorage.getItem('zivplan_settings') || '{}');
    applyTheme(s.theme || 'dark');
  } catch { /* default dark */ }
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) {
  return String(s || '').replace(/"/g, '&quot;');
}
