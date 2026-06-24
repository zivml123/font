import { state, set } from '../state.js';
import {
  getWeightLog, addWeightEntry, getMealsRange, getProfile, dateStr,
  getWorkoutProgress, getNumWeeks
} from '../storage.js';
import { GOALS, INBODY } from '../mealData.js';
import { DAYS_PER_WEEK, SUBS, workoutKey, getDateFor, computeStreak } from '../workoutData.js';
import { toastSaved, toastError, toastInfo } from '../components/toast.js';
import { renderPhotosInElement } from './photos.js';

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function fmtDate(ds) {
  const d = new Date(ds + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]}`;
}

let _nutritionChart = null;
let _weightChart = null;

export async function renderProgress() {
  const el = document.getElementById('progress-view');
  if (!el) return;
  el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">Cargando...</div>';

  try {
    const today = new Date();
    const sevenAgo = new Date(today);
    sevenAgo.setDate(today.getDate() - 6);

    const [weightLog, profile, numWeeks, workoutProgress, mealRows] = await Promise.all([
      getWeightLog(),
      getProfile(),
      getNumWeeks(),
      Object.keys(state.workoutProgress).length
        ? Promise.resolve(state.workoutProgress)
        : getWorkoutProgress(),
      getMealsRange(dateStr(sevenAgo), dateStr(today)),
    ]);

    set('weightLog', weightLog);
    if (profile) set('profile', profile);
    set('workoutProgress', workoutProgress);

    const data = { weightLog, profile, mealRows, numWeeks, workoutProgress };

    el.innerHTML = `
      <div class="sub-nav">
        <button class="sub-tab" data-sub="fotos">FOTOS</button>
        <button class="sub-tab" data-sub="medidas">MEDIDAS</button>
        <button class="sub-tab" data-sub="graficas">GRÁFICAS</button>
      </div>
      <div id="progress-sub-content"></div>
    `;

    const subEl = el.querySelector('#progress-sub-content');

    function showSub(sub) {
      set('progressSubTab', sub);
      el.querySelectorAll('.sub-tab').forEach(b => b.classList.toggle('active', b.dataset.sub === sub));
      renderProgressSubTab(subEl, sub, data);
    }

    el.querySelectorAll('.sub-tab').forEach(btn => {
      btn.addEventListener('click', () => showSub(btn.dataset.sub));
    });

    showSub(state.progressSubTab || 'fotos');

  } catch (e) {
    el.innerHTML = `<div style="padding:32px 16px;color:var(--fail);">Error cargando datos: ${e.message}</div>`;
  }
}

function renderProgressSubTab(subEl, sub, data) {
  if (sub === 'fotos') {
    renderFotos(subEl);
  } else if (sub === 'medidas') {
    renderMedidas(subEl, data);
  } else {
    renderGraficas(subEl, data);
  }
}

// ─── Fotos ────────────────────────────────────────────────────────────────────
function renderFotos(subEl) {
  renderPhotosInElement(subEl);
}

// ─── Medidas ──────────────────────────────────────────────────────────────────
function renderMedidas(subEl, { weightLog, profile }) {
  const ib     = profile?.inbody_current || INBODY;
  const goals  = profile?.objetivos      || GOALS;
  const history = profile?.inbody_history || [];

  const latestWeight = weightLog.length ? weightLog[weightLog.length - 1].weight_kg : ib.peso_kg;
  const startWeight  = ib.peso_kg;
  const targetWeight = goals.peso_meta_kg;
  const weightRange  = startWeight - targetWeight;
  const progressPct  = weightRange === 0
    ? 100
    : Math.min(100, Math.max(0, ((startWeight - latestWeight) / weightRange) * 100));

  const prevIb = history.length ? history[history.length - 1] : null;

  subEl.innerHTML = `
    <div class="chart-card">
      <div class="chart-title">⚖️ Progreso de Peso</div>
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
          <span style="font-size:13px;color:var(--muted);">Actual</span>
          <span style="font-family:'Oswald',sans-serif;font-size:22px;font-weight:700;color:var(--text)">${latestWeight} kg</span>
        </div>
        <div style="display:flex;gap:16px;font-size:12px;color:var(--muted);margin-bottom:10px;">
          <span>Inicio: <strong style="color:var(--text)">${startWeight} kg</strong></span>
          <span>Meta: <strong style="color:var(--done)">${targetWeight} kg</strong></span>
          <span style="color:${latestWeight < startWeight ? 'var(--done)' : 'var(--fail)'}">
            <strong>${latestWeight < startWeight ? '−' : '+'}${Math.abs(latestWeight - startWeight).toFixed(1)} kg</strong>
          </span>
        </div>
        <div class="progress-track" style="height:8px;">
          <div class="progress-fill" style="background:var(--muted);width:${progressPct.toFixed(1)}%;height:100%;"></div>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-top:4px;text-align:right;">${progressPct.toFixed(0)}% hacia la meta</div>
      </div>

      ${weightLog.length ? `
        <div class="chart-canvas-wrap">
          <canvas id="weight-chart"></canvas>
        </div>
      ` : '<p style="font-size:13px;color:var(--muted);">Sin datos de peso aún.</p>'}

      <div class="weight-input-row">
        <input class="weight-input" type="number" id="weight-input" placeholder="${latestWeight}" step="0.1" min="40" max="200" inputmode="decimal">
        <button class="btn btn-secondary" id="btn-log-weight" style="white-space:nowrap;">Registrar hoy</button>
      </div>

      ${weightLog.length ? `
        <div class="weight-history" style="margin-top:10px;">
          ${weightLog.slice(-5).reverse().map(e => `
            <div class="weight-entry">
              <span class="weight-date">${fmtDate(e.date)}</span>
              <span class="weight-val">${e.weight_kg} kg</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>

    ${prevIb ? `
      <div class="chart-card">
        <div class="chart-title">📊 Comparativa InBody</div>
        <div style="display:flex;gap:8px;font-size:11px;color:var(--muted);margin-bottom:10px;">
          <span style="flex:1;">Métrica</span>
          <span style="width:70px;text-align:right;">Anterior</span>
          <span style="width:70px;text-align:right;">Actual</span>
          <span style="width:56px;text-align:right;">Delta</span>
        </div>
        <div class="inbody-compare">
          ${renderCompareRow('Peso (kg)',    prevIb.peso_kg,  ib.peso_kg,  -1)}
          ${renderCompareRow('Grasa %',      prevIb.grasa_pct, ib.grasa_pct, -1)}
          ${renderCompareRow('Músculo (kg)', prevIb.smm_kg,   ib.smm_kg,    1)}
          ${renderCompareRow('TMB kcal',     prevIb.tmb_kcal, ib.tmb_kcal,  1)}
        </div>
      </div>
    ` : `
      <div class="chart-card">
        <div class="chart-title">📊 Comparativa InBody</div>
        <p style="font-size:13px;color:var(--muted);">Registra tu próximo InBody en Perfil para ver la comparativa.</p>
      </div>
    `}
  `;

  if (weightLog.length) {
    requestAnimationFrame(() => drawWeightChart(weightLog, targetWeight));
  }

  subEl.querySelector('#btn-log-weight')?.addEventListener('click', async () => {
    const input = subEl.querySelector('#weight-input');
    const kg = parseFloat(input?.value);
    if (!kg || kg < 40 || kg > 200) { toastInfo('Ingresa un peso válido (40–200 kg).'); return; }
    try {
      const entry = await addWeightEntry(dateStr(new Date()), kg);
      weightLog.push(entry);
      set('weightLog', weightLog);
      toastSaved();
      renderMedidas(subEl, { weightLog, profile });
    } catch (e) {
      toastError('Error guardando peso: ' + e.message);
    }
  });
}

// ─── Gráficas ─────────────────────────────────────────────────────────────────
function renderGraficas(subEl, { weightLog, profile, mealRows, numWeeks, workoutProgress }) {
  const goals = profile?.objetivos || GOALS;
  const prog  = workoutProgress || state.workoutProgress;

  const today = new Date();
  const days7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    days7.push({ ds: dateStr(d), label: `${d.getDate()}/${d.getMonth() + 1}`, kcal: 0, protein: 0 });
  }
  mealRows.forEach(r => {
    const day = days7.find(d => d.ds === r.date);
    if (day) { day.kcal += r.kcal || 0; day.protein += r.protein || 0; }
  });

  const avgKcal    = Math.round(days7.reduce((s, d) => s + d.kcal, 0) / 7);
  const avgProt    = Math.round(days7.reduce((s, d) => s + d.protein, 0) / 7);
  const daysLogged = days7.filter(d => d.kcal > 0).length;

  const daily = calcDailyTasks(mealRows, weightLog, prog, numWeeks);
  const RING_CIRC = 314.16;

  const heatmapCells = buildHeatmap(numWeeks, prog);

  subEl.innerHTML = `
    <div class="daily-ring-section">
      <div class="daily-ring-eyebrow">PROGRESO DE HOY</div>
      <div class="daily-ring-layout">
        <div class="daily-ring-wrap">
          <svg class="daily-ring-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <circle class="daily-ring-bg" cx="60" cy="60" r="50"/>
            <circle class="daily-ring-fill" id="daily-ring-fill" cx="60" cy="60" r="50"
              style="stroke-dashoffset:${RING_CIRC}"/>
          </svg>
          <div class="daily-ring-center">
            <div class="daily-ring-pct">${daily.pct}%</div>
            <div class="daily-ring-sub">${daily.done}/${daily.total} tareas</div>
          </div>
        </div>
        <div class="daily-ring-checklist">
          ${daily.tasks.map(t => `
            <div class="daily-check-item${t.done ? ' done' : ''}">
              <span class="daily-check-icon">${t.done ? '✓' : '○'}</span>
              <span>${t.icon} ${t.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-item">
        <span class="summary-val" style="color:var(--accent)">${avgKcal}</span>
        <div class="summary-lbl">Prom kcal/día</div>
      </div>
      <div class="summary-item">
        <span class="summary-val" style="color:var(--text)">${avgProt}g</span>
        <div class="summary-lbl">Prom prot/día</div>
      </div>
      <div class="summary-item">
        <span class="summary-val" style="color:var(--text)">${daysLogged}/7</span>
        <div class="summary-lbl">Días logueados</div>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-title">🍽️ Nutrición — últimos 7 días</div>
      <div class="chart-canvas-wrap">
        <canvas id="nutrition-chart"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-title">🏋️ Heatmap de Entrenos</div>
      <div style="display:flex;gap:6px;margin-bottom:8px;">
        <span style="font-size:11px;color:var(--muted);">
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--done);margin-right:3px;vertical-align:middle;"></span>Hecho
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--fail);margin-right:3px;margin-left:8px;vertical-align:middle;"></span>Fallado
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--muted);margin-right:3px;margin-left:8px;vertical-align:middle;"></span>Parcial
        </span>
      </div>
      <div class="heatmap-grid" style="grid-template-columns:repeat(${numWeeks * 4},1fr);">
        ${heatmapCells}
      </div>
    </div>

    ${renderAchievements(prog, numWeeks)}

    <div class="push-card">
      <div class="push-card-title">🔔 Recordatorios</div>
      <div class="push-card-desc">Activa las notificaciones para recibir recordatorios automáticos.</div>
      <div class="push-times">
        <div class="push-time">🏋️ <strong>6:00 AM</strong> días de gym (Lun, Mar, Jue, Vie)</div>
        <div class="push-time">🍽️ <strong>8:00 PM</strong> diario — registra tu comida</div>
        <div class="push-time">⚖️ <strong>7:00 AM</strong> los lunes — pesaje semanal</div>
      </div>
      <button class="btn btn-secondary btn-full" id="btn-push">Activar recordatorios</button>
    </div>

    <div class="share-card">
      <div class="share-card-title">📤 Compartir progreso</div>
      <div class="share-card-desc">Genera una tarjeta con tu resumen semanal.</div>
      <button class="btn btn-secondary btn-full" id="btn-share">Compartir esta semana</button>
    </div>
  `;

  requestAnimationFrame(() => {
    const ringFill = subEl.querySelector('#daily-ring-fill');
    if (ringFill) {
      setTimeout(() => {
        ringFill.style.strokeDashoffset = RING_CIRC * (1 - daily.pct / 100);
      }, 80);
    }
    drawNutritionChart(days7, goals);
  });

  subEl.querySelector('#btn-push')?.addEventListener('click', async () => {
    if (!('Notification' in window)) { toastInfo('Este navegador no soporta notificaciones.'); return; }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { toastInfo('Permiso de notificaciones denegado.'); return; }
    try {
      const { subscribePush } = await import('../api.js');
      await subscribePush();
      toastInfo('✓ Recordatorios activados');
      const btn = subEl.querySelector('#btn-push');
      if (btn) { btn.textContent = '✓ Recordatorios activos'; btn.disabled = true; }
    } catch (e) {
      toastError('Error activando notificaciones: ' + e.message);
    }
  });

  subEl.querySelector('#btn-share')?.addEventListener('click', () => {
    let done = 0, fail = 0;
    Object.values(prog).forEach(v => { if (v === 'done') done++; if (v === 'fail') fail++; });
    const text = `💪 Mi semana en TRACKLIFE\n\n✅ Entrenos completados: ${done}\n❌ Fallados: ${fail}\n\n🏋️ Meta: bajar de ${INBODY.peso_kg}kg a ${GOALS.peso_meta_kg}kg\n\n#TRACKLIFE`;
    if (navigator.share) {
      navigator.share({ title: 'Mi semana — TRACKLIFE', text });
    } else {
      navigator.clipboard.writeText(text).then(() => toastInfo('✓ Copiado al portapapeles'));
    }
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcDailyTasks(mealRows, weightLog, prog, numWeeks) {
  const todayDs = dateStr(new Date());
  const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const mealToday    = mealRows.some(r => r.date === todayDs && r.kcal > 0);
  const weightRecent = weightLog.some(e => new Date(e.date + 'T00:00:00') >= oneWeekAgo);

  let workoutToday = false;
  outer: for (let w = 1; w <= numWeeks; w++) {
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      if (dateStr(getDateFor(w, d)) === todayDs) {
        workoutToday = SUBS.some(s => prog[workoutKey(w, d, s)] === 'done');
        break outer;
      }
    }
  }

  const tasks = [
    { label: 'Comida registrada', icon: '🍽️', done: mealToday },
    { label: 'Peso esta semana',  icon: '⚖️',  done: weightRecent },
    { label: 'Entreno hoy',       icon: '🏋️', done: workoutToday },
  ];
  const done = tasks.filter(t => t.done).length;
  return { tasks, done, total: tasks.length, pct: Math.round((done / tasks.length) * 100) };
}

function renderAchievements(prog, numWeeks) {
  const totalDone = Object.values(prog).filter(v => v === 'done').length;
  const streak    = computeStreak(prog, numWeeks);
  const all = [
    { icon: '🥇', title: 'Primer entreno',  desc: 'Completa tu primera sesión',     done: totalDone >= 1 },
    { icon: '💪', title: '10 sesiones',      desc: 'Completa 10 sesiones en total',  done: totalDone >= 10 },
    { icon: '🔥', title: '7 días seguidos',  desc: 'Racha de 7 días completados',    done: streak >= 7 },
    { icon: '⚡', title: '14 días de racha', desc: 'Racha de 14 días completados',   done: streak >= 14 },
    { icon: '🏆', title: '25 sesiones',      desc: 'Completa 25 sesiones en total',  done: totalDone >= 25 },
    { icon: '🌟', title: 'Plan completo',    desc: 'Termina las 4 semanas del plan', done: totalDone >= 48 },
  ];
  return `
    <div class="chart-card">
      <div class="chart-title">🏆 Logros</div>
      <div class="achievements-grid">
        ${all.map(a => `
          <div class="achievement-badge ${a.done ? 'done' : 'locked'}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-title">${a.title}</div>
            <div class="achievement-desc">${a.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCompareRow(label, oldVal, newVal, direction) {
  if (oldVal == null || newVal == null) return '';
  const delta = (newVal - oldVal).toFixed(1);
  const cls = delta > 0
    ? (direction > 0 ? 'pos' : 'neg')
    : (delta < 0 ? (direction < 0 ? 'pos' : 'neg') : '');
  return `
    <div class="inbody-compare-row">
      <span class="inbody-compare-label">${label}</span>
      <span class="inbody-compare-old">${oldVal}</span>
      <span class="inbody-compare-new">${newVal}</span>
      <span class="inbody-compare-delta ${cls}">${delta > 0 ? '+' : ''}${delta}</span>
    </div>
  `;
}

function buildHeatmap(numWeeks, prog) {
  const today = new Date();
  let cells = '';
  for (let w = 1; w <= numWeeks; w++) {
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const date = getDateFor(w, d);
      const isPast = date < today;
      const statuses  = SUBS.map(s => prog[workoutKey(w, d, s)]);
      const doneCount = statuses.filter(s => s === 'done').length;
      const failCount = statuses.filter(s => s === 'fail').length;
      let cls = '';
      if (doneCount === 3)   cls = 'done';
      else if (failCount > 0) cls = 'fail';
      else if (doneCount > 0) cls = 'partial';
      else if (!isPast)       cls = 'future';
      const label = `Sem ${w} · ${['Lun','Mar','Jue','Vie'][d]}`;
      cells += `<div class="heatmap-cell ${cls}" title="${label}"></div>`;
    }
  }
  return cells;
}

function drawNutritionChart(days7, goals) {
  const canvas = document.getElementById('nutrition-chart');
  if (!canvas || !window.Chart) return;
  if (_nutritionChart) { _nutritionChart.destroy(); _nutritionChart = null; }

  _nutritionChart = new window.Chart(canvas, {
    type: 'bar',
    data: {
      labels: days7.map(d => d.label),
      datasets: [
        {
          label: 'Calorías',
          data: days7.map(d => d.kcal),
          backgroundColor: 'rgba(255,77,28,0.7)',
          borderColor: '#FF4D1C',
          borderWidth: 1,
          yAxisID: 'kcal',
        },
        {
          label: 'Proteína (g)',
          data: days7.map(d => d.protein),
          backgroundColor: 'rgba(232,179,61,0.7)',
          borderColor: '#E8B33D',
          borderWidth: 1,
          type: 'line',
          yAxisID: 'protein',
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ctx.dataset.label + ': ' + ctx.raw + (ctx.datasetIndex === 0 ? ' kcal' : ' g'),
          },
        },
      },
      scales: {
        x: { ticks: { color: '#8A8A8A', font: { size: 11 } }, grid: { color: '#2E2E2E' } },
        kcal: {
          type: 'linear', position: 'left',
          ticks: { color: '#8A8A8A', font: { size: 11 } },
          grid: { color: '#2E2E2E' },
          suggestedMax: goals.kcal_meta * 1.2,
        },
        protein: {
          type: 'linear', position: 'right',
          ticks: { color: '#E8B33D', font: { size: 11 } },
          grid: { drawOnChartArea: false },
          suggestedMax: goals.proteina_meta_g * 1.2,
        },
      },
    },
  });
}

function drawWeightChart(weightLog, targetKg) {
  const canvas = document.getElementById('weight-chart');
  if (!canvas || !window.Chart) return;
  if (_weightChart) { _weightChart.destroy(); _weightChart = null; }

  const labels     = weightLog.map(e => fmtDate(e.date));
  const data       = weightLog.map(e => e.weight_kg);
  const targetLine = data.map(() => targetKg);

  _weightChart = new window.Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Peso (kg)',
          data,
          borderColor: '#E8B33D',
          backgroundColor: 'rgba(232,179,61,0.1)',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#E8B33D',
          fill: true,
        },
        {
          label: 'Meta',
          data: targetLine,
          borderColor: '#3DDC84',
          borderDash: [5, 4],
          borderWidth: 1.5,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.raw + ' kg' },
        },
      },
      scales: {
        x: { ticks: { color: '#8A8A8A', font: { size: 11 } }, grid: { color: '#2E2E2E' } },
        y: {
          ticks: { color: '#8A8A8A', font: { size: 11 } },
          grid: { color: '#2E2E2E' },
          suggestedMin: Math.min(...data, targetKg) - 2,
          suggestedMax: Math.max(...data) + 2,
        },
      },
    },
  });
}
