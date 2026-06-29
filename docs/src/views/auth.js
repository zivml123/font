import { state, set } from '../state.js';

export function renderAuth() {
  const el = document.getElementById('auth-screen');
  if (!el) return;
  showLoginForm(el);
}

function showLoginForm(el) {
  el.innerHTML = `
    <div class="auth-logo">TRACKLIFE</div>
    <p class="auth-sub">Tu mejor versión.<br>Inicia sesión para sincronizar en la nube.</p>
    <form class="auth-form" id="auth-form" novalidate>
      <input class="auth-input" type="email" id="auth-email"
        placeholder="Correo electrónico" autocomplete="email" inputmode="email">
      <input class="auth-input" type="password" id="auth-password"
        placeholder="Contraseña" autocomplete="current-password">
      <p class="auth-error" id="auth-err"></p>
      <button type="submit" class="btn btn-primary btn-full">Iniciar sesión</button>
      <div class="auth-divider">o</div>
      <button type="button" class="btn btn-secondary btn-full" id="btn-show-register">
        Crear cuenta nueva
      </button>
      <div class="auth-links">
        <button type="button" class="auth-link" id="btn-show-forgot">¿Olvidaste tu contraseña?</button>
        <button type="button" class="auth-skip" id="btn-skip">Continuar sin cuenta</button>
      </div>
    </form>
  `;

  const errEl = el.querySelector('#auth-err');
  const sb = window.__supabase;

  el.querySelector('#auth-form').addEventListener('submit', async e => {
    e.preventDefault();
    errEl.style.color = 'var(--fail)';
    errEl.textContent = '';
    const email = el.querySelector('#auth-email').value.trim();
    const pw = el.querySelector('#auth-password').value;
    if (!email || !pw) { errEl.textContent = 'Completa todos los campos.'; return; }
    const btn = el.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Ingresando...';
    try {
      const { error } = await sb.auth.signInWithPassword({ email, password: pw });
      if (error) throw error;
      // onAuthStateChange in main.js handles the rest
    } catch (err) {
      errEl.textContent = err.message || 'Error al iniciar sesión.';
      btn.disabled = false; btn.textContent = 'Iniciar sesión';
    }
  });

  el.querySelector('#btn-show-register').addEventListener('click', () => showRegisterForm(el));
  el.querySelector('#btn-show-forgot').addEventListener('click', () => showForgotForm(el));
  el.querySelector('#btn-skip').addEventListener('click', () => {
    el.classList.add('hidden');
  });
}

function showRegisterForm(el) {
  el.innerHTML = `
    <div class="auth-logo">TRACKLIFE</div>
    <p class="auth-sub">Crea tu cuenta gratuita.</p>
    <form class="auth-form" id="reg-form" novalidate>
      <input class="auth-input" type="text" id="reg-name"
        placeholder="Tu nombre (ej: Ziv Mendelson)" autocomplete="name">
      <input class="auth-input" type="text" id="reg-username"
        placeholder="Usuario único (ej: ziv123)" autocomplete="username" spellcheck="false">
      <input class="auth-input" type="email" id="reg-email"
        placeholder="Correo electrónico" autocomplete="email" inputmode="email">
      <input class="auth-input" type="password" id="reg-password"
        placeholder="Contraseña (mín. 6 caracteres)" autocomplete="new-password">
      <p class="auth-error" id="reg-err"></p>
      <button type="submit" class="btn btn-primary btn-full">Crear cuenta</button>
      <button type="button" class="auth-skip" id="btn-back-login">← Volver al inicio de sesión</button>
    </form>
  `;

  const errEl = el.querySelector('#reg-err');
  const sb = window.__supabase;

  el.querySelector('#reg-username').addEventListener('input', e => {
    e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
  });

  el.querySelector('#reg-form').addEventListener('submit', async e => {
    e.preventDefault();
    errEl.style.color = 'var(--fail)';
    errEl.textContent = '';
    const display_name = el.querySelector('#reg-name').value.trim();
    const username = el.querySelector('#reg-username').value.trim();
    const email = el.querySelector('#reg-email').value.trim();
    const pw = el.querySelector('#reg-password').value;

    if (!display_name) { errEl.textContent = 'Ingresa tu nombre.'; return; }
    if (!username || username.length < 3) { errEl.textContent = 'El usuario debe tener al menos 3 caracteres.'; return; }
    if (!email) { errEl.textContent = 'Ingresa tu correo.'; return; }
    if (!pw || pw.length < 6) { errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return; }

    const btn = el.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Creando cuenta...';

    try {
      // Check username availability
      const { data: existing } = await sb
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();
      if (existing) {
        errEl.textContent = 'Ese nombre de usuario ya está en uso. Elige otro.';
        btn.disabled = false; btn.textContent = 'Crear cuenta';
        return;
      }

      const { error } = await sb.auth.signUp({
        email,
        password: pw,
        options: { data: { display_name, username } },
      });
      if (error) throw error;

      errEl.style.color = 'var(--done)';
      errEl.textContent = '✓ Cuenta creada. Revisa tu correo para confirmar, o inicia sesión directamente si la confirmación está desactivada.';
      btn.textContent = 'Creando...';
    } catch (err) {
      errEl.style.color = 'var(--fail)';
      errEl.textContent = err.message || 'Error al crear cuenta.';
      btn.disabled = false; btn.textContent = 'Crear cuenta';
    }
  });

  el.querySelector('#btn-back-login').addEventListener('click', () => showLoginForm(el));
}

function showForgotForm(el) {
  el.innerHTML = `
    <div class="auth-logo">TRACKLIFE</div>
    <p class="auth-sub">Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
    <form class="auth-form" id="forgot-form" novalidate>
      <input class="auth-input" type="email" id="forgot-email"
        placeholder="Correo electrónico" autocomplete="email" inputmode="email">
      <p class="auth-error" id="forgot-err"></p>
      <button type="submit" class="btn btn-primary btn-full">Enviar enlace</button>
      <button type="button" class="auth-skip" id="btn-back-login">← Volver</button>
    </form>
  `;

  const errEl = el.querySelector('#forgot-err');
  const sb = window.__supabase;

  el.querySelector('#forgot-form').addEventListener('submit', async e => {
    e.preventDefault();
    errEl.style.color = 'var(--fail)';
    errEl.textContent = '';
    const email = el.querySelector('#forgot-email').value.trim();
    if (!email) { errEl.textContent = 'Ingresa tu correo.'; return; }
    const btn = el.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Enviando...';
    try {
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.href,
      });
      if (error) throw error;
      errEl.style.color = 'var(--done)';
      errEl.textContent = '✓ Enlace enviado. Revisa tu correo (también el spam).';
      btn.textContent = 'Enviado';
    } catch (err) {
      errEl.textContent = err.message || 'Error al enviar enlace.';
      btn.disabled = false; btn.textContent = 'Enviar enlace';
    }
  });

  el.querySelector('#btn-back-login').addEventListener('click', () => showLoginForm(el));
}

export function showAuth() {
  const el = document.getElementById('auth-screen');
  if (el) { el.classList.remove('hidden'); renderAuth(); }
}

export function hideAuth() {
  const el = document.getElementById('auth-screen');
  if (el) el.classList.add('hidden');
}
