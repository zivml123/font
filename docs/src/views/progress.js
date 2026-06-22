import { state, set } from '../state.js';
import {
  getWeightLog, addWeightEntry, getMealsRange, getProfile, dateStr,
  getWorkoutProgress, getNumWeeks
} from '../storage.js';
import { GOALS, INBODY } from '../mealData.js';
import { DAYS_PER_WEEK, SUBS, workoutKey, getDateFor } from '../workoutData.js';
import { toastSaved, toastError, toastInfo } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function fmtDate(ds) {
  const d = new Date(ds + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]}`;
}

export async function renderProgress() {
  const el = document.getElementById('progress-view');
  if (!el) return;
  el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">Cargando...</div>';

  try {
    const [weightLog, profile, numWeeks, workoutProgress] = await Promise.all([
      getWeightLog(),
      getProfile(),
      getNumWeeks(),
      Object.keys(state.workoutProgress).length ? Promise.resolve(state.workoutProgress) : getWorkoutProgress(),
    ]);
    set('weightLog', weightLog);
    if (profile) set('profile', profile);
    set('workoutProgress', workoutProgress);

    // 7-day meal range
    const today = new Date();
    const sevenAgo = new Date(today);
    sevenAgo.setDate(today.getDate() - 6);
    const mealRows = await getMealsRange(dateStr(sevenAgo), dateStr(today));

    renderProgressView(el, { weightLog, profile, mealRows, numWeeks });
  } catch (e) {
    el.innerHTML = `<div style="padding:32px 16px;color:var(--fail);">Error cargando datos: ${e.message}</div>`;
  }
}

const RING_CIRC = 314.16; // 2π × 50

// Module-level chart instances — destroyed before recreating to prevent Chart.js memory leak
let _nutritionChart = null;
let _weightChart = null;

function calcDailyTasks(mealRows, weightLog, prog, numWeeks) {
  const todayDs = dateStr(new Date());
  const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const mealToday = mealRows.some(r => r.date === todayDs && r.kcal > 0);
  const weightRecent = weightLog.some(e => new Date(e.date + 'T00:00:00') >= oneWeekAgo);

  // Check if TODAY has a workout day and at least one sub-session is done
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
    { label: 'Peso esta semana', icon: '⚖️', done: weightRecent },
    { label: 'Entreno hoy',       icon: '🏋️', done: workoutToday },
  ];
  const done = tasks.filter(t => t.done).length;
  return { tasks, done, total: tasks.length, pct: Math.round((done / tasks.length) * 100) };
}

function renderProgressView(el, { weightLog, profile, mealRows, numWeeks }) {
  const ib = profile?.inbody_current || INBODY;
  const goals = profile?.objetivos || GOALS;
  const history = profile?.inbody_history || [];

  // Build 7-day daily totals
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

  const avgKcal = Math.round(days7.reduce((s, d) => s + d.kcal, 0) / 7);
  const avgProt = Math.round(days7.reduce((s, d) => s + d.protein, 0) / 7);
  const daysLogged = days7.filter(d => d.kcal > 0).length;

  // Weight progress — guard against division by zero when start === target
  const latestWeight = weightLog.length ? weightLog[weightLog.length - 1].weight_kg : ib.peso_kg;
  const startWeight = ib.peso_kg;
  const targetWeight = goals.peso_meta_kg;
  const weightRange = startWeight - targetWeight;
  const progressPct = weightRange === 0
    ? 100
    : Math.min(100, Math.max(0, ((startWeight - latestWeight) / weightRange) * 100));

  // Workout heatmap
  const prog = state.workoutProgress;
  const heatmapCells = buildHeatmap(numWeeks, prog);

  // Daily tasks ring
  const daily = calcDailyTasks(mealRows, weightLog, prog, numWeeks);

  // InBody comparison
  const prevIb = history.length ? history[history.length - 1] : null;

  el.innerHTML = `
    <!-- Daily Progress Ring -->
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

    <!-- Summary Stats -->
    <div class="summary-grid" style="margin-top:0;">
      <div class="summary-item">
        <span class="summary-val" style="color:var(--accent)">${avgKcal}</span>
        <div class="summary-lbl">Prom kcal/día</div>
      </div>
      <div class="summary-item">
        <span class="summary-val" style="color:var(--gold)">${avgProt}g</span>
        <div class="summary-lbl">Prom prot/día</div>
      </div>
      <div class="summary-item">
        <span class="summary-val" style="color:var(--done)">${daysLogged}/7</span>
        <div class="summary-lbl">Días logueados</div>
      </div>
    </div>

    <!-- Weight Progress -->
    <div class="chart-card">
      <div class="chart-title">⚖️ Progreso de Peso</div>
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
          <span style="font-size:13px;color:var(--muted);">Inicio → Meta</span>
          <span style="font-family:'Oswald',sans-serif;font-size:22px;font-weight:700;color:var(--gold)">${latestWeight} kg</span>
        </div>
        <div style="display:flex;gap:16px;font-size:12px;color:var(--muted);margin-bottom:10px;">
          <span>Inicio: <strong style="color:var(--text)">${startWeight} kg</strong></span>
          <span>Meta: <strong style="color:var(--done)">${targetWeight} kg</strong></span>
          <span>Diferencia: <strong style="color:${latestWeight < startWeight ? 'var(--done)' : 'var(--fail)'}">${(latestWeight - startWeight).toFixed(1)} kg</strong></span>
        </div>
        <div class="progress-track" style="height:8px;">
          <div class="progress-fill" style="background:var(--gold);width:${progressPct.toFixed(1)}%;height:100%;"></div>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-top:4px;text-align:right;">${progressPct.toFixed(0)}% del camino hacia la meta</div>
      </div>
      ${weightLog.length ? `
        <div class="chart-canvas-wrap">
          <canvas id="weight-chart"></canvas>
        </div>
      ` : '<p style="font-size:13px;color:var(--muted);">Sin datos de peso aún.</p>'}

      <!-- Weight log input -->
      <div class="weight-input-row">
        <input class="weight-input" type="number" id="weight-input" placeholder="78.5" step="0.1" min="40" max="200" inputmode="decimal">
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

    <!-- 7-Day Nutrition Chart -->
    <div class="chart-card">
      <div class="chart-title">🍽️ Nutrición — últimos 7 días</div>
      <div class="chart-canvas-wrap">
        <canvas id="nutrition-chart"></canvas>
      </div>
    </div>

    <!-- Workout Heatmap -->
    <div class="chart-card">
      <div class="chart-title">🏋️ Heatmap de Entrenos</div>
      <div style="display:flex;gap:6px;margin-bottom:8px;">
        <span style="font-size:11px;color:var(--muted);">
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--done);margin-right:3px;vertical-align:middle;"></span>Hecho
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--fail);margin-right:3px;margin-left:8px;vertical-align:middle;"></span>Fallado
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--gold);margin-right:3px;margin-left:8px;vertical-align:middle;"></span>Parcial
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--line);margin-right:3px;margin-left:8px;vertical-align:middle;"></span>Sin registrar
        </span>
      </div>
      <div class="heatmap-grid" style="grid-template-columns:repeat(${numWeeks * 4},1fr);">
        ${heatmapCells}
      </div>
    </div>

    <!-- InBody Comparison -->
    ${history.length > 0 ? `
    <div class="chart-card">
      <div class="chart-title">📊 Comparativa InBody</div>
      <div style="display:flex;gap:8px;font-size:11px;color:var(--muted);margin-bottom:10px;">
        <span style="flex:1;">Métrica</span>
        <span style="width:70px;text-align:right;">Anterior</span>
        <span style="width:70px;text-align:right;">Actual</span>
        <span style="width:56px;text-align:right;">Delta</span>
      </div>
      <div class="inbody-compare">
        ${renderCompareRow('Peso (kg)', prevIb.peso_kg, ib.peso_kg, -1)}
        ${renderCompareRow('Grasa %', prevIb.grasa_pct, ib.grasa_pct, -1)}
        ${renderCompareRow('Músculo (kg)', prevIb.smm_kg, ib.smm_kg, 1)}
        ${renderCompareRow('TMB kcal', prevIb.tmb_kcal, ib.tmb_kcal, 1)}
      </div>
    </div>
    ` : `
    <div class="chart-card">
      <div class="chart-title">📊 Comparativa InBody</div>
      <p style="font-size:13px;color:var(--muted);">Registra tu próximo InBody en Perfil para ver la comparativa.</p>
    </div>
    `}

    <!-- Push Notifications -->
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

    <!-- Share Progress -->
    <div class="share-card">
      <div class="share-card-title">📤 Compartir progreso</div>
      <div class="share-card-desc">Genera una tarjeta con tu resumen semanal.</div>
      <button class="btn btn-secondary btn-full" id="btn-share">Compartir esta semana</button>
    </div>
  `;

  // Draw charts + animate ring
  requestAnimationFrame(() => {
    const ringFill = document.getElementById('daily-ring-fill');
    if (ringFill) {
      setTimeout(() => {
        ringFill.style.strokeDashoffset = RING_CIRC * (1 - daily.pct / 100);
      }, 80);
    }
    drawNutritionChart(days7, goals);
    if (weightLog.length) drawWeightChart(weightLog, goals.peso_meta_kg);
    bindProgressEvents(el, weightLog);
  });
}

function renderCompareRow(label, oldVal, newVal, direction) {
  const delta = (newVal - oldVal).toFixed(1);
  const isGood = (direction > 0 && delta > 0) || (direction < 0 && delta < 0);
  const cls = delta > 0 ? (direction > 0 ? 'pos' : 'neg') : (delta < 0 ? (direction < 0 ? 'pos' : 'neg') : '');
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
      const statuses = SUBS.map(s => prog[workoutKey(w, d, s)]);
      const doneCount = statuses.filter(s => s === 'done').length;
      const failCount = statuses.filter(s => s === 'fail').length;
      let cls = '';
      if (doneCount === 3) cls = 'done';
      else if (failCount > 0) cls = 'fail';
      else if (doneCount > 0) cls = 'partial';
      else if (!isPast) cls = 'future';
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

  const labels = weightLog.map(e => fmtDate(e.date));
  const data = weightLog.map(e => e.weight_kg);
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

function bindProgressEvents(el, weightLog) {
  // Log weight
  el.querySelector('#btn-log-weight')?.addEventListener('click', async () => {
    const input = el.querySelector('#weight-input');
    const kg = parseFloat(input?.value);
    if (!kg || kg < 40 || kg > 200) { toastInfo('Ingresa un peso válido (40-200 kg).'); return; }
    try {
      const today = dateStr(new Date());
      const entry = await addWeightEntry(today, kg);
      weightLog.push(entry);
      set('weightLog', weightLog);
      toastSaved();
      await renderProgress();
    } catch (e) {
      toastError('Error guardando peso: ' + e.message);
    }
  });

  // Push notifications
  el.querySelector('#btn-push')?.addEventListener('click', async () => {
    if (!('Notification' in window)) { toastInfo('Este navegador no soporta notificaciones.'); return; }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { toastInfo('Permiso de notificaciones denegado.'); return; }
    try {
      const { subscribePush } = await import('../api.js');
      await subscribePush();
      toastInfo('✓ Recordatorios activados');
      el.querySelector('#btn-push').textContent = '✓ Recordatorios activos';
      el.querySelector('#btn-push').disabled = true;
    } catch (e) {
      toastError('Error activando notificaciones: ' + e.message);
    }
  });

  // Share
  el.querySelector('#btn-share')?.addEventListener('click', () => {
    const prog = state.workoutProgress;
    let done = 0, fail = 0;
    Object.values(prog).forEach(v => { if (v === 'done') done++; if (v === 'fail') fail++; });
    const text = `💪 Mi semana en TRACKLIFE\n\n✅ Entrenos completados: ${done}\n❌ Fallados: ${fail}\n\n🏋️ Meta: bajar de ${INBODY.peso_kg}kg a ${GOALS.peso_meta_kg}kg y grasa de ${INBODY.grasa_pct}% a ${GOALS.grasa_meta_pct}%\n\n#TRACKLIFE #FitnessKosher`;
    if (navigator.share) {
      navigator.share({ title: 'Mi semana — TRACKLIFE', text });
    } else {
      navigator.clipboard.writeText(text).then(() => toastInfo('✓ Copiado al portapapeles'));
    }
  });
}
