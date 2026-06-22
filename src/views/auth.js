import { state, set } from '../state.js';
import { toastError } from '../components/toast.js';

export function renderAuth() {
  const el = document.getElementById('auth-screen');
  if (!el) return;

  el.innerHTML = `
    <div class="auth-logo">ZIV PLAN</div>
    <p class="auth-sub">Tu plan de fitness personal.<br>Inicia sesión para sincronizar en la nube.</p>
    <form class="auth-form" id="auth-form" novalidate>
      <input class="auth-input" type="email" id="auth-email" placeholder="Correo electrónico" autocomplete="email" inputmode="email">
      <input class="auth-input" type="password" id="auth-password" placeholder="Contraseña" autocomplete="current-password">
      <p class="auth-error" id="auth-err"></p>
      <button type="submit" class="btn btn-primary btn-full">Iniciar sesión</button>
      <div class="auth-divider">o</div>
      <button type="button" class="btn btn-secondary btn-full" id="btn-register">Crear cuenta nueva</button>
      <button type="button" class="auth-skip" id="btn-skip">Continuar sin cuenta (solo local)</button>
    </form>
  `;

  const form = el.querySelector('#auth-form');
  const errEl = el.querySelector('#auth-err');
  const sb = window.__supabase;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    errEl.textContent = '';
    const email = el.querySelector('#auth-email').value.trim();
    const pw = el.querySelector('#auth-password').value;
    if (!email || !pw) { errEl.textContent = 'Completa todos los campos.'; return; }
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Ingresando...';
    try {
      const { error } = await sb.auth.signInWithPassword({ email, password: pw });
      if (error) throw error;
      // Session handled by onAuthStateChange in main.js
    } catch (err) {
      errEl.textContent = err.message || 'Error al iniciar sesión.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Iniciar sesión';
    }
  });

  el.querySelector('#btn-register').addEventListener('click', async () => {
    errEl.textContent = '';
    const email = el.querySelector('#auth-email').value.trim();
    const pw = el.querySelector('#auth-password').value;
    if (!email || !pw) { errEl.textContent = 'Completa todos los campos.'; return; }
    const btn = el.querySelector('#btn-register');
    btn.disabled = true;
    btn.textContent = 'Creando cuenta...';
    try {
      const { error } = await sb.auth.signUp({ email, password: pw });
      if (error) throw error;
      errEl.style.color = 'var(--done)';
      errEl.textContent = '✓ Cuenta creada. Revisa tu correo para confirmar.';
    } catch (err) {
      errEl.style.color = 'var(--fail)';
      errEl.textContent = err.message || 'Error al crear cuenta.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Crear cuenta nueva';
    }
  });

  el.querySelector('#btn-skip').addEventListener('click', () => {
    el.classList.add('hidden');
  });
}

export function showAuth() {
  const el = document.getElementById('auth-screen');
  if (el) el.classList.remove('hidden');
}

export function hideAuth() {
  const el = document.getElementById('auth-screen');
  if (el) el.classList.add('hidden');
}
