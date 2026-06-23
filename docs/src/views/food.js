import { state, set } from '../state.js';
import { getMeals, addMeal, deleteMeal, dateStr, getProfile } from '../storage.js';
import { analyzeText, analyzePhoto } from '../api.js';
import { toastSaved, toastFailed, toastError, toastInfo } from '../components/toast.js';
import { confirmModal, openModal, closeModal } from '../components/modal.js';
import { WEEKLY_PLAN, GOALS, DOW_LABELS } from '../mealData.js';

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DAYS_ES_FULL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function formatFoodDate(d) {
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const ds = dateStr(d);
  if (ds === dateStr(today)) return 'Hoy';
  if (ds === dateStr(yesterday)) return 'Ayer';
  if (ds === dateStr(tomorrow)) return 'Mañana';
  return `${DAYS_ES_FULL[d.getDay()]}, ${d.getDate()} ${MONTHS_ES[d.getMonth()]}`;
}

export async function renderFood() {
  const el = document.getElementById('food-view');
  if (!el) return;

  let profile = state.profile;
  if (!profile) {
    try { profile = await getProfile(); set('profile', profile); } catch { profile = null; }
  }

  renderFoodShell(el, profile);
  await loadAndRenderLog(el);
  bindFoodEvents(el);
}

const KCAL_RING_CIRC = 282.74; // 2π × 45

function renderFoodShell(el, profile) {
  const goals = profile?.objetivos || GOALS;
  const kcalMeta = goals.kcal_meta || 1950;
  const protMeta = goals.proteina_meta_g || 175;
  const dow = state.menuDow;

  el.innerHTML = `
    <!-- Sub Tabs -->
    <div class="sub-nav">
      <button class="sub-tab ${state.foodSubTab === 'log' ? 'active' : ''}" data-subtab="log">Registro del día</button>
      <button class="sub-tab ${state.foodSubTab === 'menu' ? 'active' : ''}" data-subtab="menu">Menú semanal</button>
    </div>

    <!-- Log Sub-View -->
    <div id="food-log-view" class="${state.foodSubTab === 'log' ? '' : 'hidden'}">
      <!-- Date selector -->
      <div class="date-selector">
        <button class="date-nav-btn" id="btn-date-prev">‹</button>
        <span class="date-label" id="date-label">${formatFoodDate(state.foodDate)}</span>
        <button class="date-nav-btn" id="btn-date-next">›</button>
      </div>

      <!-- Calorie Ring + Macros -->
      <div class="kcal-ring-section" id="kcal-ring-section">
        <div class="kcal-ring-wrap">
          <svg class="kcal-ring-svg" viewBox="0 0 100 100">
            <circle class="kcal-ring-bg" cx="50" cy="50" r="45"/>
            <circle class="kcal-ring-fill" id="kcal-ring-fill" cx="50" cy="50" r="45"
              style="stroke-dasharray:${KCAL_RING_CIRC.toFixed(2)};stroke-dashoffset:${KCAL_RING_CIRC.toFixed(2)};"/>
          </svg>
          <div class="kcal-ring-center">
            <div class="kcal-ring-num" id="kcal-ring-num">0</div>
            <div class="kcal-ring-lbl">kcal</div>
          </div>
        </div>
        <div class="kcal-ring-meta">
          <div class="kcal-ring-goal">Meta: ${kcalMeta} kcal</div>
          <div class="kcal-ring-remaining" id="kcal-ring-remaining">${kcalMeta} restantes</div>
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px;">
            <div>
              <div class="progress-header" style="margin-bottom:4px;">
                <span class="progress-label">Proteína</span>
                <span class="progress-value protein" id="prot-val">0 / ${protMeta} g</span>
              </div>
              <div class="progress-track"><div class="progress-fill protein" id="prot-bar" style="width:0%"></div></div>
            </div>
            <div class="macro-pills-row">
              <span class="macro-pill">C: <strong id="carbs-val">0g</strong></span>
              <span class="macro-pill">G: <strong id="fat-val">0g</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add food -->
      <div class="add-food-section">
        <div class="add-food-header">Agregar comida</div>
        <div class="add-food-body">
          <textarea class="food-textarea" id="food-text" placeholder="Describe qué comiste… ej: pollo a la plancha con arroz integral y ensalada"></textarea>
          <div class="add-food-actions">
            <button class="btn btn-primary" id="btn-calc">Calcular y agregar</button>
            <button class="btn-photo" id="btn-photo">📷 Foto</button>
          </div>
          <div class="ai-loading hidden" id="ai-loading">
            <span class="ai-loading-dot"></span>
            <span class="ai-loading-dot"></span>
            <span class="ai-loading-dot"></span>
            <span>Analizando con IA...</span>
          </div>
        </div>
      </div>

      <!-- Hidden file input for camera -->
      <input type="file" id="photo-input" accept="image/*" class="hidden">

      <!-- Meals list -->
      <div class="section-row">
        <span class="section-eyebrow">Comidas del día</span>
      </div>
      <div class="meals-list" id="meals-list">
        <div class="empty-state"><span class="empty-state-icon">🍽️</span>Aún no has registrado comidas hoy.</div>
      </div>
    </div>

    <!-- Menu Sub-View -->
    <div id="food-menu-view" class="${state.foodSubTab === 'menu' ? '' : 'hidden'}">
      <!-- Day selector -->
      <div class="day-selector">
        ${DOW_LABELS.map((l, i) => `<button class="day-pill ${i === dow ? 'active' : ''}" data-dow="${i}">${l}</button>`).join('')}
      </div>
      <div id="menu-content">
        ${renderMenuContent(dow)}
      </div>
    </div>
  `;
}

function renderMenuContent(dow) {
  const plan = WEEKLY_PLAN[dow] || WEEKLY_PLAN[1];

  function optionCards(options) {
    return options.map((m, i) => `
      <div class="menu-option-card">
        <div class="menu-option-header">
          <span class="menu-option-num">Opción ${i + 1}</span>
          <button class="menu-add-btn" data-meal='${JSON.stringify({ ...m, is_plan_meal: true })}'>Agregar al día</button>
        </div>
        <div class="menu-option-name">${escHtml(m.item)}</div>
        <div class="menu-option-stats">
          <span class="menu-stat-kcal">🔥 ${m.kcal} kcal</span>
          <span class="menu-stat-prot">💪 ${m.protein}g prot</span>
        </div>
      </div>`).join('');
  }

  function section(emoji, label, options) {
    if (!options) {
      return `<div class="menu-section">
        <div class="menu-section-title">${emoji} ${label}</div>
        <div class="menu-no-meal">Sin desayuno planificado</div>
      </div>`;
    }
    return `<div class="menu-section">
      <div class="menu-section-title">${emoji} ${label}</div>
      <div class="menu-options">${optionCards(options)}</div>
    </div>`;
  }

  return `
    ${section('☕', 'Desayuno', plan.desayuno)}
    ${section('🥗', 'Almuerzo', plan.almuerzo)}
    ${section('🍽️', 'Cena', plan.cena)}
    <div style="padding:0 16px 16px;">
      <p style="font-size:12px;color:var(--muted);line-height:1.6;">
        ⚠️ Dieta <strong style="color:var(--done)">100% kosher</strong>. Macros son estimaciones.
      </p>
    </div>
  `;
}

async function loadAndRenderLog(el) {
  const ds = dateStr(state.foodDate);
  try {
    const meals = await getMeals(ds);
    const existing = state.meals[ds] || [];
    // Merge to avoid duplicates
    const merged = [...meals];
    state.meals[ds] = merged;
    renderMealsList(el, merged);
    updateBars(el, merged);
  } catch (e) {
    toastError('Error cargando comidas: ' + e.message);
  }
}

function renderMealsList(el, meals) {
  const list = el.querySelector('#meals-list');
  if (!list) return;
  if (!meals.length) {
    list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">🍽️</span>Aún no has registrado comidas hoy.</div>`;
    return;
  }
  list.innerHTML = meals.map(m => `
    <div class="meal-card" data-id="${m.id}">
      <div class="meal-info">
        <div class="meal-name">${escHtml(m.item)}</div>
        <div class="meal-macros">P:${m.protein}g · C:${m.carbs}g · G:${m.fat}g</div>
        ${m.warning ? `<div class="meal-warning">⚠️ ${escHtml(m.warning)}</div>` : ''}
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <span class="meal-kcal">${m.kcal}</span><span class="meal-kcal-unit"> kcal</span>
        <div style="margin-top:6px;">
          <button class="btn-icon danger meal-delete-btn" data-id="${m.id}" title="Eliminar">✕</button>
        </div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.meal-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      confirmModal('¿Eliminar esta comida del registro?', async () => {
        const ds = dateStr(state.foodDate);
        const meals = await deleteMeal(ds, id);
        state.meals[ds] = meals;
        renderMealsList(el, meals);
        updateBars(el, meals);
        toastSaved();
      }, 'Eliminar', true);
    });
  });
}

function updateBars(el, meals) {
  const profile = state.profile;
  const goals = profile?.objetivos || GOALS;
  const kcalMeta = goals.kcal_meta || 1950;
  const protMeta = goals.proteina_meta_g || 175;

  const totalKcal  = meals.reduce((s, m) => s + (m.kcal    || 0), 0);
  const totalProt  = meals.reduce((s, m) => s + (m.protein  || 0), 0);
  const totalCarbs = meals.reduce((s, m) => s + (m.carbs    || 0), 0);
  const totalFat   = meals.reduce((s, m) => s + (m.fat      || 0), 0);

  // Calorie ring
  const ringFill = el.querySelector('#kcal-ring-fill');
  const ringNum  = el.querySelector('#kcal-ring-num');
  const ringRem  = el.querySelector('#kcal-ring-remaining');
  if (ringFill) {
    const pct = Math.min(1, totalKcal / kcalMeta);
    ringFill.style.strokeDashoffset = KCAL_RING_CIRC * (1 - pct);
  }
  if (ringNum) ringNum.textContent = totalKcal;
  if (ringRem) ringRem.textContent = `${Math.max(0, kcalMeta - totalKcal)} restantes`;

  // Macro bars
  const protVal = el.querySelector('#prot-val');
  const protBar = el.querySelector('#prot-bar');
  if (protVal) protVal.textContent = `${totalProt} / ${protMeta} g`;
  if (protBar) protBar.style.width = `${Math.min(100, (totalProt / protMeta) * 100)}%`;

  // Carbs & fat pills
  const carbsEl = el.querySelector('#carbs-val');
  const fatEl   = el.querySelector('#fat-val');
  if (carbsEl) carbsEl.textContent = `${totalCarbs}g`;
  if (fatEl)   fatEl.textContent   = `${totalFat}g`;

  // Refresh global stats
  window.__refreshDashStats?.();
}

async function handleAnalyzeAndAdd(el, resultData) {
  // Show editable result modal
  openModal({
    title: 'Confirmar comida',
    content: `
      ${resultData._photoSrc ? `<img src="${resultData._photoSrc}" class="photo-preview-img" alt="foto">` : ''}
      ${resultData.warning ? `<div style="background:var(--fail-dim);border:1px solid var(--fail);border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:13px;color:var(--fail);">⚠️ ${escHtml(resultData.warning)}</div>` : ''}
      <div class="result-form">
        <div class="result-field">
          <label>Nombre</label>
          <input class="result-input name-input" type="text" id="r-item" value="${escAttr(resultData.item)}">
        </div>
        <div class="result-form-row">
          <div class="result-field">
            <label>Calorías</label>
            <input class="result-input" type="number" id="r-kcal" value="${resultData.kcal}" min="0" max="9999">
          </div>
          <div class="result-field">
            <label>Proteína (g)</label>
            <input class="result-input" type="number" id="r-prot" value="${resultData.protein}" min="0" max="999">
          </div>
        </div>
        <div class="result-form-row">
          <div class="result-field">
            <label>Carbs (g)</label>
            <input class="result-input" type="number" id="r-carbs" value="${resultData.carbs}" min="0" max="999">
          </div>
          <div class="result-field">
            <label>Grasa (g)</label>
            <input class="result-input" type="number" id="r-fat" value="${resultData.fat}" min="0" max="999">
          </div>
        </div>
      </div>
      ${resultData.explanation ? `<p style="font-size:12px;color:var(--muted);margin:10px 0 0;line-height:1.5;">🤖 ${escHtml(resultData.explanation)}</p>` : ''}
    `,
    actions: [
      { id: 'cancel', label: 'Cancelar', class: 'btn-secondary', onClick: closeModal },
      { id: 'save', label: 'Guardar', class: 'btn-primary', onClick: async () => {
        const meal = {
          item: document.getElementById('r-item').value.trim() || resultData.item,
          kcal: parseInt(document.getElementById('r-kcal').value) || 0,
          protein: parseInt(document.getElementById('r-prot').value) || 0,
          carbs: parseInt(document.getElementById('r-carbs').value) || 0,
          fat: parseInt(document.getElementById('r-fat').value) || 0,
          warning: resultData.warning || null,
        };
        closeModal();
        const ds = dateStr(state.foodDate);
        try {
          await addMeal(ds, meal);
          const meals = await getMeals(ds);
          state.meals[ds] = meals;
          renderMealsList(el, meals);
          updateBars(el, meals);
          const textarea = el.querySelector('#food-text');
          if (textarea) textarea.value = '';
          toastSaved();
        } catch (e) {
          toastError('No se pudo guardar: ' + e.message);
        }
      }},
    ],
  });
}

function bindFoodEvents(el) {
  // Sub-tab switching
  el.querySelectorAll('.sub-tab').forEach(tab => {
    tab.addEventListener('click', async () => {
      const which = tab.dataset.subtab;
      set('foodSubTab', which);
      el.querySelectorAll('.sub-tab').forEach(t => t.classList.toggle('active', t.dataset.subtab === which));
      el.querySelector('#food-log-view').classList.toggle('hidden', which !== 'log');
      el.querySelector('#food-menu-view').classList.toggle('hidden', which !== 'menu');
      if (which === 'log') await loadAndRenderLog(el);
    });
  });

  // Date navigation
  el.querySelector('#btn-date-prev')?.addEventListener('click', async () => {
    const d = new Date(state.foodDate);
    d.setDate(d.getDate() - 1);
    set('foodDate', d);
    el.querySelector('#date-label').textContent = formatFoodDate(d);
    await loadAndRenderLog(el);
  });
  el.querySelector('#btn-date-next')?.addEventListener('click', async () => {
    const d = new Date(state.foodDate);
    d.setDate(d.getDate() + 1);
    set('foodDate', d);
    el.querySelector('#date-label').textContent = formatFoodDate(d);
    await loadAndRenderLog(el);
  });

  // Text analyze
  el.querySelector('#btn-calc')?.addEventListener('click', async () => {
    const text = el.querySelector('#food-text')?.value.trim();
    if (!text) { toastInfo('Describe qué comiste primero.'); return; }
    const loading = el.querySelector('#ai-loading');
    if (loading) loading.classList.remove('hidden');
    try {
      const result = await analyzeText(text);
      if (loading) loading.classList.add('hidden');
      await handleAnalyzeAndAdd(el, result);
    } catch (e) {
      if (loading) loading.classList.add('hidden');
      if (e.message.includes('JSON') || e.message.includes('parse')) {
        toastError('No se pudo calcular — describe la comida de otra forma.');
      } else {
        toastError('Error: ' + e.message);
      }
    }
  });

  // Photo capture
  const photoInput = el.querySelector('#photo-input');
  el.querySelector('#btn-photo')?.addEventListener('click', () => photoInput?.click());
  photoInput?.addEventListener('change', async () => {
    const file = photoInput.files[0];
    if (!file) return;

    // Show preview before sending
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target.result;
      openModal({
        title: 'Usar esta foto',
        content: `<img src="${src}" class="photo-preview-img" alt="foto">
          <p style="font-size:13px;color:var(--muted);text-align:center;">¿Enviar esta foto para análisis con IA?</p>`,
        actions: [
          { id: 'retake', label: 'Retomar', class: 'btn-secondary', onClick: () => { closeModal(); photoInput.click(); } },
          { id: 'analyze', label: 'Analizar 🤖', class: 'btn-primary', onClick: async () => {
            closeModal();
            const loading = el.querySelector('#ai-loading');
            if (loading) loading.classList.remove('hidden');
            try {
              const result = await analyzePhoto(file);
              result._photoSrc = src;
              if (loading) loading.classList.add('hidden');
              await handleAnalyzeAndAdd(el, result);
            } catch (err) {
              if (loading) loading.classList.add('hidden');
              toastError('Error analizando foto: ' + err.message);
            }
            photoInput.value = '';
          }},
        ],
      });
    };
    reader.readAsDataURL(file);
  });

  // Menu day pills
  el.querySelectorAll('.day-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const dow = parseInt(pill.dataset.dow);
      set('menuDow', dow);
      el.querySelectorAll('.day-pill').forEach(p => p.classList.toggle('active', parseInt(p.dataset.dow) === dow));
      const menuContent = el.querySelector('#menu-content');
      if (menuContent) menuContent.innerHTML = renderMenuContent(dow);
      bindMenuAddButtons(el);
    });
  });

  bindMenuAddButtons(el);
}

function bindMenuAddButtons(el) {
  el.querySelectorAll('.menu-add-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      let meal;
      try { meal = JSON.parse(btn.dataset.meal); } catch { return; }
      delete meal.detail;
      meal.is_plan_meal = true;
      const ds = dateStr(state.foodDate);
      try {
        await addMeal(ds, meal);
        const meals = await getMeals(ds);
        state.meals[ds] = meals;
        if (state.foodSubTab === 'log') {
          renderMealsList(el, meals);
          updateBars(el, meals);
        }
        toastInfo('✓ Agregado al log del día');
      } catch (e) {
        toastError('Error al agregar: ' + e.message);
      }
    });
  });
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) {
  return String(s || '').replace(/"/g, '&quot;');
}
