import { updateProfile } from '../storage.js';

const GOALS = [
  { key: 'fat_loss',  label: 'Bajar grasa',      desc: 'Reducir grasa corporal',        calMult: 0.82, protPerKg: 2.0 },
  { key: 'muscle',    label: 'Ganar músculo',     desc: 'Aumentar masa muscular',        calMult: 1.10, protPerKg: 2.4 },
  { key: 'maintain',  label: 'Mantener',          desc: 'Mantener composición actual',   calMult: 1.00, protPerKg: 1.8 },
  { key: 'recomp',    label: 'Recomposición',     desc: 'Bajar grasa y ganar músculo',   calMult: 0.95, protPerKg: 2.2 },
];

const ACTIVITY_LEVELS = [
  { key: 'sedentary',   label: 'Sedentario',    desc: 'Poco o ningún ejercicio',        factor: 22 },
  { key: 'light',       label: 'Ligero',        desc: '1–3 días de ejercicio/semana',   factor: 24 },
  { key: 'moderate',    label: 'Moderado',      desc: '3–5 días de ejercicio/semana',   factor: 26 },
  { key: 'active',      label: 'Activo',        desc: '6–7 días de ejercicio/semana',   factor: 28 },
  { key: 'very_active', label: 'Muy activo',    desc: 'Doble sesión o trabajo físico',  factor: 30 },
];

const TOTAL_STEPS = 6;

export function renderOnboarding() {
  if (localStorage.getItem('zivplan_profile')) return;

  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'background:#000', 'z-index:9000',
    'display:flex', 'flex-direction:column', 'align-items:center', 'overflow-y:auto',
  ].join(';');

  let step = 0;
  const answers = {};

  const stepRenderers = [
    renderGoalStep,
    renderNameStep,
    renderBodyStep,
    renderTargetStep,
    renderActivityStep,
    renderSummaryStep,
  ];

  function goTo(s) {
    step = s;
    overlay.innerHTML = '';
    const inner = document.createElement('div');
    inner.style.cssText = [
      'width:100%', 'max-width:380px', 'min-height:100%',
      'display:flex', 'flex-direction:column', 'justify-content:center',
      'padding:60px 24px 48px', 'box-sizing:border-box',
    ].join(';');
    overlay.appendChild(inner);

    const nav = {
      next: () => goTo(step + 1),
      back: step > 0 ? () => goTo(step - 1) : null,
      done: async () => {
        await saveOnboarding(answers);
        overlay.style.transition = 'opacity 0.3s';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      },
    };

    stepRenderers[step](inner, answers, step, TOTAL_STEPS, nav);
  }

  document.body.appendChild(overlay);
  goTo(0);
}

// ─── Progress header ──────────────────────────────────────────────────────────
function progressBar(step, total) {
  const bars = Array.from({ length: total }, (_, i) =>
    `<div style="height:2px;flex:1;background:${i <= step ? 'var(--text)' : 'var(--line)'};border-radius:2px;transition:background 0.3s;"></div>`
  ).join('');
  return `
    <div style="margin-bottom:36px;">
      <div style="font-family:'Oswald',sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;color:var(--muted);margin-bottom:12px;">TRACKLIFE</div>
      <div style="display:flex;gap:4px;margin-bottom:8px;">${bars}</div>
      <div style="font-family:'Oswald',sans-serif;font-size:10px;letter-spacing:2px;color:var(--muted);">PASO ${step + 1} DE ${total}</div>
    </div>
  `;
}

function backHtml(nav) {
  return nav.back
    ? `<button id="ob-back" style="background:none;border:none;color:var(--muted);font-family:'Inter',sans-serif;font-size:14px;padding:0 0 28px 0;cursor:pointer;display:block;">← Atrás</button>`
    : '';
}

function titleHtml(line1, line2 = '') {
  return `
    <div style="font-family:'Oswald',sans-serif;font-size:30px;font-weight:700;color:var(--text);line-height:1.2;margin-bottom:8px;">${line1}${line2 ? `<br>${line2}` : ''}</div>
  `;
}

function subHtml(text) {
  return `<div style="font-size:14px;color:var(--muted);margin-bottom:28px;">${text}</div>`;
}

// ─── Step 1: Goal ─────────────────────────────────────────────────────────────
function renderGoalStep(el, answers, step, total, nav) {
  el.innerHTML = `
    ${backHtml(nav)}
    ${progressBar(step, total)}
    ${titleHtml('¿Cuál es tu', 'objetivo?')}
    ${subHtml('Esto calibra tus metas de calorías y proteína.')}
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${GOALS.map(g => `
        <button class="btn btn-secondary ob-goal" data-key="${g.key}"
          style="text-align:left;padding:16px 18px;border-radius:12px;${answers.goal === g.key ? 'border-color:var(--text);' : ''}">
          <div style="font-family:'Oswald',sans-serif;font-size:17px;font-weight:600;color:var(--text);">${g.label}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:3px;">${g.desc}</div>
        </button>
      `).join('')}
    </div>
  `;
  el.querySelector('#ob-back')?.addEventListener('click', nav.back);
  el.querySelectorAll('.ob-goal').forEach(btn => {
    btn.addEventListener('click', () => { answers.goal = btn.dataset.key; nav.next(); });
  });
}

// ─── Step 2: Name ─────────────────────────────────────────────────────────────
function renderNameStep(el, answers, step, total, nav) {
  el.innerHTML = `
    ${backHtml(nav)}
    ${progressBar(step, total)}
    ${titleHtml('¿Cómo te', 'llamamos?')}
    ${subHtml('Solo tu nombre, para personalizar la app.')}
    <input id="ob-name" class="result-input" type="text" placeholder="Tu nombre"
      autocomplete="given-name" spellcheck="false" inputmode="text"
      style="font-size:22px;font-weight:600;text-align:center;padding:16px;width:100%;margin-bottom:24px;box-sizing:border-box;"
      value="${escAttr(answers.nombre || '')}">
    <button class="btn btn-primary btn-full" id="ob-next" style="padding:14px;">Siguiente →</button>
  `;
  const inp = el.querySelector('#ob-name');
  inp?.focus();
  el.querySelector('#ob-back')?.addEventListener('click', nav.back);
  el.querySelector('#ob-next')?.addEventListener('click', () => {
    const v = inp?.value?.trim();
    if (!v) { inp?.focus(); return; }
    answers.nombre = v;
    nav.next();
  });
  inp?.addEventListener('keydown', e => { if (e.key === 'Enter') el.querySelector('#ob-next')?.click(); });
}

// ─── Step 3: Current weight + height ─────────────────────────────────────────
function renderBodyStep(el, answers, step, total, nav) {
  el.innerHTML = `
    ${backHtml(nav)}
    ${progressBar(step, total)}
    ${titleHtml('Tu cuerpo', 'actual')}
    ${subHtml('Usamos esto para calcular tus metas nutricionales.')}
    <div style="margin-bottom:16px;">
      <label style="font-family:'Oswald',sans-serif;font-size:12px;letter-spacing:1px;color:var(--muted);display:block;margin-bottom:8px;">PESO ACTUAL (kg)</label>
      <input id="ob-weight" class="result-input" type="number" placeholder="80.0"
        min="30" max="300" step="0.1" inputmode="decimal"
        style="font-size:24px;font-weight:700;text-align:center;padding:14px;width:100%;box-sizing:border-box;"
        value="${answers.weight || ''}">
    </div>
    <div style="margin-bottom:28px;">
      <label style="font-family:'Oswald',sans-serif;font-size:12px;letter-spacing:1px;color:var(--muted);display:block;margin-bottom:8px;">ALTURA (cm)</label>
      <input id="ob-height" class="result-input" type="number" placeholder="175"
        min="100" max="250" step="1" inputmode="decimal"
        style="font-size:24px;font-weight:700;text-align:center;padding:14px;width:100%;box-sizing:border-box;"
        value="${answers.height || ''}">
    </div>
    <button class="btn btn-primary btn-full" id="ob-next" style="padding:14px;">Siguiente →</button>
  `;
  const wInp = el.querySelector('#ob-weight');
  const hInp = el.querySelector('#ob-height');
  wInp?.focus();
  el.querySelector('#ob-back')?.addEventListener('click', nav.back);
  el.querySelector('#ob-next')?.addEventListener('click', () => {
    const w = parseFloat(wInp?.value);
    const h = parseFloat(hInp?.value);
    if (!w || w < 30 || w > 300) { wInp?.focus(); return; }
    if (!h || h < 100 || h > 250) { hInp?.focus(); return; }
    answers.weight = w;
    answers.height = h;
    nav.next();
  });
}

// ─── Step 4: Target weight ────────────────────────────────────────────────────
function renderTargetStep(el, answers, step, total, nav) {
  el.innerHTML = `
    ${backHtml(nav)}
    ${progressBar(step, total)}
    ${titleHtml('¿Cuál es tu', 'peso objetivo?')}
    ${subHtml('Tu meta de transformación.')}
    <input id="ob-target" class="result-input" type="number" placeholder="72.0"
      min="30" max="300" step="0.1" inputmode="decimal"
      style="font-size:28px;font-weight:700;text-align:center;padding:16px;width:100%;margin-bottom:8px;box-sizing:border-box;"
      value="${answers.targetWeight || ''}">
    <div style="text-align:center;font-size:13px;color:var(--muted);margin-bottom:28px;">kg</div>
    <button class="btn btn-primary btn-full" id="ob-next" style="padding:14px;">Siguiente →</button>
  `;
  const inp = el.querySelector('#ob-target');
  inp?.focus();
  el.querySelector('#ob-back')?.addEventListener('click', nav.back);
  el.querySelector('#ob-next')?.addEventListener('click', () => {
    const v = parseFloat(inp?.value);
    if (!v || v < 30 || v > 300) { inp?.focus(); return; }
    answers.targetWeight = v;
    nav.next();
  });
  inp?.addEventListener('keydown', e => { if (e.key === 'Enter') el.querySelector('#ob-next')?.click(); });
}

// ─── Step 5: Activity level ───────────────────────────────────────────────────
function renderActivityStep(el, answers, step, total, nav) {
  el.innerHTML = `
    ${backHtml(nav)}
    ${progressBar(step, total)}
    ${titleHtml('Nivel de', 'actividad')}
    ${subHtml('¿Cuánto te mueves en una semana típica?')}
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${ACTIVITY_LEVELS.map(a => `
        <button class="btn btn-secondary ob-activity" data-key="${a.key}"
          style="text-align:left;padding:14px 18px;border-radius:12px;${answers.activity === a.key ? 'border-color:var(--text);' : ''}">
          <div style="font-family:'Oswald',sans-serif;font-size:16px;font-weight:600;color:var(--text);">${a.label}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">${a.desc}</div>
        </button>
      `).join('')}
    </div>
  `;
  el.querySelector('#ob-back')?.addEventListener('click', nav.back);
  el.querySelectorAll('.ob-activity').forEach(btn => {
    btn.addEventListener('click', () => { answers.activity = btn.dataset.key; nav.next(); });
  });
}

// ─── Step 6: Summary ─────────────────────────────────────────────────────────
function renderSummaryStep(el, answers, step, total, nav) {
  const { kcal, protein } = calcGoals(answers);
  const goalLabel = GOALS.find(g => g.key === answers.goal)?.label || answers.goal;
  const actLabel  = ACTIVITY_LEVELS.find(a => a.key === answers.activity)?.label || answers.activity;
  const firstName = (answers.nombre || 'Usuario').split(' ')[0];

  el.innerHTML = `
    ${backHtml(nav)}
    ${progressBar(step, total)}
    <div style="font-family:'Oswald',sans-serif;font-size:30px;font-weight:700;color:var(--text);line-height:1.2;margin-bottom:8px;">¡Listo,<br>${escHtml(firstName)}!</div>
    ${subHtml('Aquí están tus metas diarias personalizadas.')}

    <div style="background:var(--panel);border-radius:14px;padding:20px;margin-bottom:16px;display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:14px;color:var(--muted);">Objetivo</span>
        <span style="font-family:'Oswald',sans-serif;font-size:15px;font-weight:600;color:var(--text);">${goalLabel}</span>
      </div>
      <div style="height:1px;background:var(--line);"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:14px;color:var(--muted);">Actividad</span>
        <span style="font-family:'Oswald',sans-serif;font-size:15px;font-weight:600;color:var(--text);">${actLabel}</span>
      </div>
      <div style="height:1px;background:var(--line);"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:14px;color:var(--muted);">Peso actual</span>
        <span style="font-family:'Oswald',sans-serif;font-size:15px;font-weight:600;color:var(--text);">${answers.weight} kg</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:14px;color:var(--muted);">Peso objetivo</span>
        <span style="font-family:'Oswald',sans-serif;font-size:15px;font-weight:600;color:var(--text);">${answers.targetWeight} kg</span>
      </div>
    </div>

    <div style="background:var(--panel);border-radius:14px;padding:20px;margin-bottom:28px;">
      <div style="font-family:'Oswald',sans-serif;font-size:11px;letter-spacing:2px;color:var(--muted);margin-bottom:14px;">TUS METAS DIARIAS</div>
      <div style="display:flex;justify-content:space-around;text-align:center;">
        <div>
          <div style="font-family:'Oswald',sans-serif;font-size:36px;font-weight:700;color:var(--text);">${kcal}</div>
          <div style="font-size:12px;color:var(--muted);">kcal</div>
        </div>
        <div style="width:1px;background:var(--line);"></div>
        <div>
          <div style="font-family:'Oswald',sans-serif;font-size:36px;font-weight:700;color:var(--text);">${protein}g</div>
          <div style="font-size:12px;color:var(--muted);">proteína</div>
        </div>
      </div>
      <div style="margin-top:14px;font-size:11px;color:var(--muted);text-align:center;">Puedes ajustar estas metas en Perfil → Ajustes</div>
    </div>

    <button class="btn btn-primary btn-full" id="ob-done" style="padding:16px;font-size:17px;">Empezar →</button>
  `;
  el.querySelector('#ob-back')?.addEventListener('click', nav.back);
  el.querySelector('#ob-done')?.addEventListener('click', () => nav.done());
}

// ─── Calculation ──────────────────────────────────────────────────────────────
function calcGoals(answers) {
  const actLevel   = ACTIVITY_LEVELS.find(a => a.key === answers.activity) || ACTIVITY_LEVELS[2];
  const goalConfig = GOALS.find(g => g.key === answers.goal) || GOALS[0];
  const weight     = answers.weight || 75;

  const baseTdee  = weight * actLevel.factor;
  const kcal      = Math.round(baseTdee * goalConfig.calMult / 50) * 50;
  const protein   = Math.round(weight * goalConfig.protPerKg);

  return { kcal, protein };
}

// ─── Save profile ─────────────────────────────────────────────────────────────
async function saveOnboarding(answers) {
  const { kcal, protein } = calcGoals(answers);
  const goalConfig = GOALS.find(g => g.key === answers.goal);

  const profile = {
    nombre: answers.nombre || 'Usuario',
    display_name: answers.nombre || 'Usuario',
    objetivo: goalConfig?.label || 'Bajar grasa',
    goal_key: answers.goal || 'fat_loss',
    activity_level: answers.activity || 'moderate',
    altura_cm: answers.height || null,
    onboarding_done: true,
    inbody_current: {
      peso_kg: answers.weight || 0,
      grasa_pct: null,
      smm_kg: null,
      tmb_kcal: null,
    },
    inbody_history: [],
    objetivos: {
      peso_meta_kg: answers.targetWeight || 0,
      kcal_meta: kcal,
      proteina_meta_g: protein,
    },
  };

  try {
    await updateProfile(profile);
  } catch {
    // Fallback to direct localStorage if storage.js fails
    localStorage.setItem('zivplan_profile', JSON.stringify(profile));
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(s) {
  return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
