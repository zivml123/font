import { state, set } from '../state.js';
import { getProfile, updateProfile, addInBodyEntry } from '../storage.js';
import { INBODY, GOALS } from '../mealData.js';
import { toastSaved, toastError, toastInfo } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { getBackendUrl, setBackendUrl } from '../api.js';
import { computeStreak, DAYS_PER_WEEK, SUBS } from '../workoutData.js';

export async function renderProfile() {
  const el = document.getElementById('profile-view');
  if (!el) return;

  let profile = state.profile;
  if (!profile) {
    try { profile = await getProfile(); set('profile', profile); } catch { profile = null; }
  }

  const p = profile || {};
  const nombre = p.nombre || 'Ziv Mendelson';
  const ib = p.inbody_current || INBODY;
  const goals = p.objetivos || GOALS;
  const history = p.inbody_history || [];
  const initials = nombre.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const supabase = window.__supabase;

  const avatarDataUrl = localStorage.getItem('zivplan_avatar') || '';
  const avatarSrc = avatarDataUrl || 'assets/brand.webp';

  // Compute stats from localStorage without extra async calls
  const prog = JSON.parse(localStorage.getItem('zivplan_workout_progress') || '{}');
  const numWeeks = JSON.parse(localStorage.getItem('zivplan_num_weeks') || '4');
  const totalSessions = Object.values(prog).filter(v => v === 'done').length;
  const streak = computeStreak(prog, numWeeks);
  const achievements = [
    { icon: '🥇', title: 'Primer entreno',  done: totalSessions >= 1 },
    { icon: '💪', title: '10 sesiones',      done: totalSessions >= 10 },
    { icon: '🔥', title: '7 días racha',     done: streak >= 7 },
    { icon: '⚡', title: '14 días racha',    done: streak >= 14 },
  ];

  el.innerHTML = `
    <div class="profile-view">
      <!-- Header with photo upload -->
      <div class="profile-header">
        <div class="profile-avatar-upload" id="profile-avatar-upload" title="Cambiar foto de perfil">
          <img id="profile-avatar-photo" class="profile-avatar-photo" src="${escAttr(avatarSrc)}" alt="foto">
          <span id="profile-avatar-letters" class="profile-avatar-letters hidden">${initials}</span>
          <div class="profile-avatar-overlay">
            <span class="profile-avatar-edit-icon">📷</span>
          </div>
          <input type="file" id="avatar-file-input" accept="image/*" class="hidden">
        </div>
        <div class="profile-header-info">
          <div class="profile-name">${escHtml(nombre)}</div>
          <div class="profile-meta">21 años · 171.9 cm · Kosher</div>
          ${state.user ? `<div class="profile-meta" style="margin-top:4px;font-size:11px;">${escHtml(state.user.email)}</div>` : '<div class="profile-meta" style="margin-top:4px;font-size:11px;color:var(--muted);">Modo local · sin cuenta</div>'}
          <button class="btn-text-sm" id="btn-remove-photo" style="${avatarDataUrl ? '' : 'display:none'}">Restaurar imagen por defecto</button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="profile-stats-row">
        <div class="profile-stat-item">
          <span class="profile-stat-val">${totalSessions}</span>
          <span class="profile-stat-lbl">Sesiones</span>
        </div>
        <div class="profile-stat-item">
          <span class="profile-stat-val" style="color:var(--accent)">${streak}</span>
          <span class="profile-stat-lbl">Racha</span>
        </div>
        <div class="profile-stat-item">
          <span class="profile-stat-val" style="color:var(--text)">${numWeeks * DAYS_PER_WEEK * SUBS.length}</span>
          <span class="profile-stat-lbl">Total sesiones</span>
        </div>
      </div>

      <!-- Achievement Badges -->
      <div class="profile-section" style="margin-bottom:16px;">
        <div class="profile-section-title">Logros</div>
        <div class="achievements-grid" style="padding:12px 16px;">
          ${achievements.map(a => `
            <div class="achievement-badge ${a.done ? 'done' : 'locked'}">
              <div class="achievement-icon">${a.icon}</div>
              <div class="achievement-title">${a.title}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Datos personales -->
      <div class="profile-section">
        <div class="profile-section-title">Datos personales</div>
        <div class="settings-row">
          <span class="settings-label">Nombre</span>
          <input class="settings-input" type="text" id="field-nombre" value="${escAttr(nombre)}" placeholder="Tu nombre">
        </div>
        <div class="settings-row">
          <span class="settings-label">Meta calorías/día</span>
          <input class="settings-input" type="number" id="field-kcal" value="${goals.kcal_meta}" min="1000" max="4000">
        </div>
        <div class="settings-row">
          <span class="settings-label">Meta proteína/día (g)</span>
          <input class="settings-input" type="number" id="field-prot" value="${goals.proteina_meta_g}" min="50" max="400">
        </div>
        <div class="settings-row">
          <span class="settings-label">Meta peso (kg)</span>
          <input class="settings-input" type="number" id="field-peso-meta" value="${goals.peso_meta_kg}" step="0.1" min="40" max="200">
        </div>
        <div class="settings-row">
          <span class="settings-label">Meta grasa (%)</span>
          <input class="settings-input" type="number" id="field-grasa-meta" value="${goals.grasa_meta_pct}" step="0.1" min="5" max="50">
        </div>
        <div style="padding:12px 16px;">
          <button class="btn btn-primary btn-full" id="btn-save-profile">Guardar cambios</button>
        </div>
      </div>

      <!-- InBody actual -->
      <div class="profile-section">
        <div class="profile-section-title">InBody actual · ${ib.fecha || 'sin fecha'}</div>
        <div class="settings-row"><span class="settings-label">Peso</span><span class="settings-value">${ib.peso_kg} kg</span></div>
        <div class="settings-row"><span class="settings-label">Grasa corporal</span><span class="settings-value">${ib.grasa_pct}%</span></div>
        <div class="settings-row"><span class="settings-label">Músculo (SMM)</span><span class="settings-value">${ib.smm_kg} kg</span></div>
        <div class="settings-row"><span class="settings-label">TMB</span><span class="settings-value">${ib.tmb_kcal} kcal</span></div>
        <div class="settings-row"><span class="settings-label">Mineral óseo</span><span class="settings-value">${ib.mineral_oseo_kg} kg</span></div>
        <div class="settings-row"><span class="settings-label">Grasa visceral</span><span class="settings-value">${ib.grasa_visceral}</span></div>
        <div class="settings-row"><span class="settings-label">Cintura/cadera</span><span class="settings-value">${ib.cintura_cadera}</span></div>
        <div style="padding:12px 16px;">
          <button class="btn btn-secondary btn-full" id="btn-new-inbody">Registrar nuevo InBody</button>
        </div>
      </div>

      <!-- Historial InBody -->
      ${history.length > 0 ? `
      <div class="profile-section">
        <div class="profile-section-title">Historial InBody (${history.length} entradas)</div>
        ${history.slice().reverse().map((h, i) => `
          <div class="settings-row">
            <span class="settings-label">${h.fecha || 'Sin fecha'}</span>
            <span class="settings-value">${h.peso_kg} kg · ${h.grasa_pct}% grasa</span>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- IA config -->
      <div class="profile-section">
        <div class="profile-section-title">Análisis de comida con IA</div>
        <div style="padding:8px 16px 4px;">
          <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">
            Ingresa la URL de tu backend para activar el análisis de comidas por texto y foto.<br>
            El backend guarda tu API key de forma segura — nunca se almacena en el navegador.
          </p>
          <p style="font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 10px;">
            <strong style="color:var(--text)">Cómo desplegar gratis:</strong><br>
            1. Crea una cuenta en <strong style="color:var(--text)">render.com</strong><br>
            2. New → Web Service → conecta este repositorio<br>
            3. Build: <code style="background:var(--surface2);padding:1px 4px;border-radius:3px;">npm install</code>  Start: <code style="background:var(--surface2);padding:1px 4px;border-radius:3px;">node server.js</code><br>
            4. En Environment Variables agrega: <code style="background:var(--surface2);padding:1px 4px;border-radius:3px;">ANTHROPIC_API_KEY=sk-ant-...</code><br>
            5. Copia la URL pública de Render (ej: https://mi-app.onrender.com) y pégala abajo.
          </p>
          <input class="auth-input" type="url" id="field-backend-url" placeholder="https://mi-app.onrender.com" value="${escAttr(getBackendUrl())}" autocomplete="off">
          <button class="btn btn-secondary btn-full" id="btn-save-backend-url" style="margin-top:10px;">Guardar URL del backend</button>
        </div>
      </div>

      <!-- Cuenta -->
      <div class="profile-section">
        <div class="profile-section-title">Cuenta</div>
        ${state.user ? `
          <div class="settings-row">
            <span class="settings-label">Sincronización</span>
            <span class="settings-value" style="color:var(--done)">✓ Activa</span>
          </div>
          <div style="padding:12px 16px;">
            <button class="btn btn-ghost btn-full" id="btn-logout">Cerrar sesión</button>
          </div>
        ` : `
          <div class="settings-row">
            <span class="settings-label">Sincronización</span>
            <span class="settings-value">Solo local</span>
          </div>
          ${supabase ? `
          <div style="padding:12px 16px;">
            <button class="btn btn-secondary btn-full" id="btn-login-profile">Iniciar sesión para sincronizar</button>
          </div>
          ` : '<div class="settings-row"><span class="settings-label" style="color:var(--muted);font-size:12px;">Configura Supabase para activar la nube.</span></div>'}
        `}
      </div>

      <!-- Instalar PWA -->
      <div class="profile-section">
        <div class="profile-section-title">Instalar en tu celular</div>
        <div style="padding:12px 16px;">
          <div class="install-step">
            <span class="install-step-num">1</span>
            <span><strong style="color:var(--text)">iPhone (Safari):</strong> Toca el botón de compartir →, luego "Agregar a pantalla de inicio"</span>
          </div>
          <div class="install-step">
            <span class="install-step-num">2</span>
            <span><strong style="color:var(--text)">Android (Chrome):</strong> Toca los 3 puntos del menú → "Agregar a pantalla de inicio"</span>
          </div>
          <div class="install-step">
            <span class="install-step-num">3</span>
            <span>La app se instala como una app nativa sin necesidad de App Store</span>
          </div>
          <button class="btn btn-secondary btn-full" id="btn-install" style="margin-top:8px;">Instalar app</button>
        </div>
      </div>
    </div>
  `;

  bindProfileEvents(el);
}

function bindProfileEvents(el) {
  // Profile photo upload
  const avatarUpload = el.querySelector('#profile-avatar-upload');
  const avatarFileInput = el.querySelector('#avatar-file-input');
  avatarUpload?.addEventListener('click', e => {
    if (e.target === avatarFileInput) return;
    avatarFileInput?.click();
  });
  avatarFileInput?.addEventListener('change', async () => {
    const file = avatarFileInput.files[0];
    if (!file) return;
    try {
      const dataUrl = await compressAvatar(file, 256);
      localStorage.setItem('zivplan_avatar', dataUrl);
      const photo = el.querySelector('#profile-avatar-photo');
      const letters = el.querySelector('#profile-avatar-letters');
      const removeBtn = el.querySelector('#btn-remove-photo');
      if (photo) { photo.src = dataUrl; photo.classList.remove('hidden'); }
      if (letters) letters.classList.add('hidden');
      if (removeBtn) removeBtn.style.display = '';
      syncDashAvatar(dataUrl);
      toastSaved();
    } catch (e) {
      toastError('No se pudo guardar la foto: ' + e.message);
    }
    avatarFileInput.value = '';
  });
  el.querySelector('#btn-remove-photo')?.addEventListener('click', () => {
    localStorage.removeItem('zivplan_avatar');
    const photo = el.querySelector('#profile-avatar-photo');
    const removeBtn = el.querySelector('#btn-remove-photo');
    if (photo) photo.src = 'assets/brand.webp';
    if (removeBtn) removeBtn.style.display = 'none';
    syncDashAvatar(null);
    toastInfo('Foto restaurada.');
  });

  // Save backend URL
  el.querySelector('#btn-save-backend-url')?.addEventListener('click', () => {
    const url = el.querySelector('#field-backend-url')?.value.trim();
    if (!url) { toastInfo('Ingresa la URL de tu backend.'); return; }
    if (!url.startsWith('http')) { toastInfo('La URL debe empezar con https://'); return; }
    setBackendUrl(url);
    toastSaved();
    toastInfo('Backend URL guardada. Ya puedes analizar comidas.');
  });

  // Save profile
  el.querySelector('#btn-save-profile')?.addEventListener('click', async () => {
    const nombre = el.querySelector('#field-nombre').value.trim();
    const kcal_meta = parseInt(el.querySelector('#field-kcal').value) || 1950;
    const proteina_meta_g = parseInt(el.querySelector('#field-prot').value) || 175;
    const peso_meta_kg = parseFloat(el.querySelector('#field-peso-meta').value) || 74.84;
    const grasa_meta_pct = parseFloat(el.querySelector('#field-grasa-meta').value) || 15;
    try {
      const updated = await updateProfile({
        nombre,
        objetivos: { kcal_meta, proteina_meta_g, peso_meta_kg, grasa_meta_pct },
      });
      set('profile', updated);
      window.__refreshDashPills?.();
      toastSaved();
    } catch (e) {
      toastError('Error guardando: ' + e.message);
    }
  });

  // New InBody entry
  el.querySelector('#btn-new-inbody')?.addEventListener('click', () => {
    const ib = state.profile?.inbody_current || INBODY;
    openModal({
      title: 'Nuevo InBody',
      content: `
        <p style="font-size:13px;color:var(--muted);margin-bottom:14px;">Ingresa los datos de tu nuevo InBody. Los datos actuales (${ib.fecha}) se guardarán en el historial.</p>
        <div class="result-form">
          <div class="result-field">
            <label>Fecha (ej: 19 jul 2026)</label>
            <input class="result-input name-input" type="text" id="ib-fecha" placeholder="19 jul 2026">
          </div>
          <div class="result-form-row">
            <div class="result-field"><label>Peso (kg)</label><input class="result-input" type="number" id="ib-peso" step="0.1" placeholder="${ib.peso_kg}"></div>
            <div class="result-field"><label>Grasa %</label><input class="result-input" type="number" id="ib-grasa" step="0.1" placeholder="${ib.grasa_pct}"></div>
          </div>
          <div class="result-form-row">
            <div class="result-field"><label>Músculo (kg)</label><input class="result-input" type="number" id="ib-smm" step="0.1" placeholder="${ib.smm_kg}"></div>
            <div class="result-field"><label>TMB (kcal)</label><input class="result-input" type="number" id="ib-tmb" placeholder="${ib.tmb_kcal}"></div>
          </div>
          <div class="result-form-row">
            <div class="result-field"><label>Mineral óseo</label><input class="result-input" type="number" id="ib-mineral" step="0.01" placeholder="${ib.mineral_oseo_kg}"></div>
            <div class="result-field"><label>Grasa visceral</label><input class="result-input" type="number" id="ib-visceral" step="0.1" placeholder="${ib.grasa_visceral}"></div>
          </div>
          <div class="result-field">
            <label>Cintura/cadera</label>
            <input class="result-input" type="number" id="ib-cc" step="0.01" placeholder="${ib.cintura_cadera}">
          </div>
        </div>
      `,
      actions: [
        { id: 'cancel', label: 'Cancelar', class: 'btn-secondary', onClick: closeModal },
        { id: 'save', label: 'Guardar InBody', class: 'btn-primary', onClick: async () => {
          const newIb = {
            fecha: document.getElementById('ib-fecha').value.trim() || new Date().toLocaleDateString('es-PA'),
            peso_kg: parseFloat(document.getElementById('ib-peso').value) || ib.peso_kg,
            grasa_pct: parseFloat(document.getElementById('ib-grasa').value) || ib.grasa_pct,
            smm_kg: parseFloat(document.getElementById('ib-smm').value) || ib.smm_kg,
            tmb_kcal: parseInt(document.getElementById('ib-tmb').value) || ib.tmb_kcal,
            mineral_oseo_kg: parseFloat(document.getElementById('ib-mineral').value) || ib.mineral_oseo_kg,
            grasa_visceral: parseFloat(document.getElementById('ib-visceral').value) || ib.grasa_visceral,
            cintura_cadera: parseFloat(document.getElementById('ib-cc').value) || ib.cintura_cadera,
          };
          closeModal();
          try {
            const updated = await addInBodyEntry(newIb);
            set('profile', updated);
            toastSaved();
            await renderProfile();
          } catch (e) {
            toastError('Error guardando InBody: ' + e.message);
          }
        }},
      ],
    });
  });

  // Logout
  el.querySelector('#btn-logout')?.addEventListener('click', async () => {
    if (window.__supabase) {
      await window.__supabase.auth.signOut();
      set('user', null);
      await renderProfile();
    }
  });

  // Login from profile
  el.querySelector('#btn-login-profile')?.addEventListener('click', () => {
    import('./auth.js').then(({ showAuth }) => showAuth());
  });

  // Install PWA
  el.querySelector('#btn-install')?.addEventListener('click', () => {
    if (window.__deferredInstallPrompt) {
      window.__deferredInstallPrompt.prompt();
    } else {
      toastInfo('Usa el menú de tu navegador para instalar la app.');
    }
  });
}

function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return String(s||'').replace(/"/g,'&quot;'); }

function compressAvatar(file, maxSize) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = ev => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const size = Math.min(img.width, img.height, maxSize);
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const sx = (img.width  - Math.min(img.width, img.height)) / 2;
        const sy = (img.height - Math.min(img.width, img.height)) / 2;
        const sw = Math.min(img.width, img.height);
        ctx.drawImage(img, sx, sy, sw, sw, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function syncDashAvatar(dataUrl) {
  const src = dataUrl || 'assets/brand.webp';
  const hoyImg = document.querySelector('#hoy-avatar-btn img');
  if (hoyImg) hoyImg.src = src;
}
