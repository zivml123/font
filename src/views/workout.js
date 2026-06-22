import { state, set } from '../state.js';
import {
  WEIGHTS, ABS, CARDIO, DAY_NAMES, DAY_FOCUS, DAY_OFFSETS,
  getDateFor, getWeekDateRange, workoutKey, DAYS_PER_WEEK, SUBS
} from '../workoutData.js';
import {
  getWorkoutProgress, setWorkoutStatus, resetWorkoutProgress, getNumWeeks, setNumWeeks
} from '../storage.js';
import { toastSaved, toastFailed, toastError } from '../components/toast.js';
import { confirmModal, openModal, closeModal } from '../components/modal.js';

const DAYS_ES = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatDate(d) {
  return `${DAYS_ES[d.getDay()]}, ${d.getDate()} ${MONTHS_ES[d.getMonth()]}`;
}

function formatDateRange(start, end) {
  return `${start.getDate()} ${MONTHS_ES[start.getMonth()]} — ${end.getDate()} ${MONTHS_ES[end.getMonth()]}`;
}

function getStatus(w, d, sub) {
  return state.workoutProgress[workoutKey(w, d, sub)] || null;
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function computeStats() {
  const prog = state.workoutProgress;
  const total = state.numWeeks * DAYS_PER_WEEK * SUBS.length;
  let done = 0, fail = 0, streak = 0, streakRunning = true;

  // Iterate sub-sessions in chronological order
  for (let w = 1; w <= state.numWeeks; w++) {
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      for (const sub of SUBS) {
        const s = prog[workoutKey(w, d, sub)];
        if (s === 'done') { done++; if (streakRunning) streak++; }
        else if (s === 'fail') { fail++; streakRunning = false; }
        else streakRunning = false;
      }
    }
  }

  return { done, fail, streak, pct: Math.round((done / total) * 100), total };
}

// ─── Day card status ──────────────────────────────────────────────────────────
function dayCardClass(w, d) {
  const statuses = SUBS.map(s => getStatus(w, d, s));
  if (statuses.some(s => s === 'fail')) return 'has-fail';
  if (statuses.every(s => s === 'done')) return 'all-done';
  return '';
}

// ─── Render ───────────────────────────────────────────────────────────────────
export async function renderWorkout() {
  const el = document.getElementById('workout-view');
  if (!el) return;

  try {
    const [progress, numWeeks] = await Promise.all([getWorkoutProgress(), getNumWeeks()]);
    set('workoutProgress', progress);
    set('numWeeks', numWeeks);
  } catch (e) {
    toastError('Error cargando entreno: ' + e.message);
  }

  updateWorkoutView(el);
  bindWorkoutEvents(el);
}

function updateWorkoutView(el) {
  const stats = computeStats();
  const numWeeks = state.numWeeks;

  let weeksHTML = '';
  for (let w = 1; w <= numWeeks; w++) {
    const { start, end } = getWeekDateRange(w);
    let weekDone = 0;
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      for (const sub of SUBS) {
        if (getStatus(w, d, sub) === 'done') weekDone++;
      }
    }

    let daysHTML = '';
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const date = getDateFor(w, d);
      const cardClass = dayCardClass(w, d);
      const dots = SUBS.map(s => {
        const st = getStatus(w, d, s);
        return `<span class="status-dot ${st || ''}"></span>`;
      }).join('');

      daysHTML += `
        <div class="day-card ${cardClass}" data-w="${w}" data-d="${d}">
          <div class="day-header">
            <div class="day-info">
              <span class="day-name">${DAY_NAMES[d]}</span>
              <span class="day-focus">${DAY_FOCUS[d]}</span>
              <div class="day-status-dots">${dots}</div>
            </div>
            <span class="day-date">${formatDate(date)}</span>
            <span class="day-chevron">›</span>
          </div>
          <div class="day-body">
            ${renderBlock(w, d, 'pesas')}
            ${renderBlock(w, d, 'cam')}
            ${renderBlock(w, d, 'abs')}
          </div>
        </div>`;
    }

    weeksHTML += `
      <div class="week-section">
        <div class="week-header">
          <span class="week-title">Semana ${w}</span>
          <span class="week-dates">${formatDateRange(start, end)}</span>
          <span class="week-count">${weekDone}/${DAYS_PER_WEEK * SUBS.length}</span>
        </div>
        ${daysHTML}
      </div>`;
  }

  el.innerHTML = `
    <div class="stats-bar">
      <div class="stat-card done">
        <span class="stat-value">${stats.done}</span>
        <span class="stat-label">Hechos</span>
      </div>
      <div class="stat-card fail">
        <span class="stat-value">${stats.fail}</span>
        <span class="stat-label">Fallados</span>
      </div>
      <div class="stat-card streak">
        <span class="stat-value">${stats.streak}</span>
        <span class="stat-label">Racha</span>
      </div>
      <div class="stat-card pct">
        <span class="stat-value">${stats.pct}%</span>
        <span class="stat-label">Completado</span>
      </div>
    </div>

    <div id="weeks-container">
      ${weeksHTML}
    </div>

    <div class="add-week-section">
      <p class="add-week-info">Plan actual: <strong style="color:var(--text)">${numWeeks} semana${numWeeks !== 1 ? 's' : ''}</strong> · ${numWeeks * DAYS_PER_WEEK * SUBS.length} sub-sesiones totales</p>
      <button class="btn btn-secondary btn-full" id="btn-add-week">+ Agregar semana ${numWeeks + 1}</button>
    </div>

    <div class="reset-section">
      <button class="btn-reset" id="btn-reset-workout">Reiniciar todo el progreso</button>
    </div>
  `;

  bindWorkoutEvents(el);
}

function renderBlock(w, d, sub) {
  const status = getStatus(w, d, sub);
  const doneClass = status === 'done' ? 'done' : '';
  const failClass = status === 'fail' ? 'fail' : '';

  if (sub === 'pesas') {
    const exercises = WEIGHTS[d];
    const exerciseItems = exercises.map(ex =>
      `<li class="exercise-item">
        <span class="exercise-name">${ex.name}</span>
        <span class="exercise-sets">${ex.sets} × ${ex.reps}</span>
      </li>`
    ).join('');
    return `
      <div class="block" data-w="${w}" data-d="${d}" data-sub="pesas">
        <div class="block-header">
          <span class="block-icon">🏋️</span>
          <span class="block-title">Pesas</span>
        </div>
        <ul class="exercises">${exerciseItems}</ul>
        <div class="block-buttons">
          <button class="btn-block-action ${doneClass}" data-action="done">✓ Hecho</button>
          <button class="btn-block-action ${failClass}" data-action="fail">✕ Fallé</button>
        </div>
      </div>`;
  }

  if (sub === 'cam') {
    return `
      <div class="block" data-w="${w}" data-d="${d}" data-sub="cam">
        <div class="block-header">
          <span class="block-icon">🏃</span>
          <span class="block-title">Caminadora</span>
        </div>
        <p class="cardio-text">${CARDIO}</p>
        <div class="block-buttons">
          <button class="btn-block-action ${doneClass}" data-action="done">✓ Hecho</button>
          <button class="btn-block-action ${failClass}" data-action="fail">✕ Fallé</button>
        </div>
      </div>`;
  }

  // abs
  return `
    <div class="block" data-w="${w}" data-d="${d}" data-sub="abs">
      <div class="block-header">
        <span class="block-icon">🔥</span>
        <span class="block-title">Abs</span>
      </div>
      <p class="abs-text">${ABS[d]}</p>
      <div class="block-buttons">
        <button class="btn-block-action ${doneClass}" data-action="done">✓ Hecho</button>
        <button class="btn-block-action ${failClass}" data-action="fail">✕ Fallé</button>
      </div>
    </div>`;
}

function bindWorkoutEvents(el) {
  // Expand/collapse day cards
  el.querySelectorAll('.day-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.day-card');
      card.classList.toggle('expanded');
    });
  });

  // Done / Fail buttons
  el.querySelectorAll('.btn-block-action').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      const block = btn.closest('.block');
      const w = parseInt(block.dataset.w);
      const d = parseInt(block.dataset.d);
      const sub = block.dataset.sub;
      const action = btn.dataset.action; // 'done' or 'fail'
      const current = getStatus(w, d, sub);
      const newStatus = current === action ? null : action; // toggle

      try {
        const progress = await setWorkoutStatus(w, d, sub, newStatus);
        set('workoutProgress', progress);
        toastSaved();
        // Re-render just the buttons in this block
        updateBlockButtons(block, w, d, sub, newStatus);
        // Update day card border
        const dayCard = block.closest('.day-card');
        dayCard.className = `day-card ${dayCardClass(w, d)} ${dayCard.classList.contains('expanded') ? 'expanded' : ''}`;
        // Update dots
        const dots = dayCard.querySelectorAll('.status-dot');
        SUBS.forEach((s, i) => {
          dots[i].className = `status-dot ${getStatus(w, d, s) || ''}`;
        });
        // Update stats bar
        updateStatsBar(el);
        // Update week count
        updateWeekCount(el, w);
      } catch (err) {
        toastFailed();
        console.error(err);
      }
    });
  });

  // Add week
  const addWeekBtn = el.querySelector('#btn-add-week');
  if (addWeekBtn) {
    addWeekBtn.addEventListener('click', async () => {
      const n = state.numWeeks + 1;
      await setNumWeeks(n);
      set('numWeeks', n);
      updateWorkoutView(el);
    });
  }

  // Reset
  const resetBtn = el.querySelector('#btn-reset-workout');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      confirmModal(
        '¿Reiniciar todo el progreso de entreno? Esta acción no se puede deshacer.',
        async () => {
          const progress = await resetWorkoutProgress();
          set('workoutProgress', progress);
          updateWorkoutView(el);
          toastSaved();
        },
        'Reiniciar todo',
        true
      );
    });
  }
}

function updateBlockButtons(block, w, d, sub, status) {
  block.querySelectorAll('.btn-block-action').forEach(btn => {
    btn.classList.remove('done', 'fail');
    if (status === btn.dataset.action) btn.classList.add(status);
  });
}

function updateStatsBar(el) {
  const stats = computeStats();
  const bar = el.querySelector('.stats-bar');
  if (!bar) return;
  bar.querySelectorAll('.stat-value').forEach((v, i) => {
    v.textContent = [stats.done, stats.fail, stats.streak, stats.pct + '%'][i];
  });
}

function updateWeekCount(el, week) {
  const weekSections = el.querySelectorAll('.week-section');
  const section = weekSections[week - 1];
  if (!section) return;
  let weekDone = 0;
  for (let d = 0; d < DAYS_PER_WEEK; d++) {
    for (const sub of SUBS) {
      if (getStatus(week, d, sub) === 'done') weekDone++;
    }
  }
  const countEl = section.querySelector('.week-count');
  if (countEl) countEl.textContent = `${weekDone}/${DAYS_PER_WEEK * SUBS.length}`;
}
