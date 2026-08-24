// Workout starts Monday June 22, 2026
export const START_MONDAY = new Date(2026, 5, 22); // month is 0-indexed; June 22 = Monday

// Offsets from Monday (0=Mon, 1=Tue, 3=Thu, 4=Fri)
export const DAY_OFFSETS = [0, 1, 3, 4];
export const TOTAL_WEEKS_DEFAULT = 4;
export const SUBS = ['pesas', 'cam', 'abs'];
export const SUBS_PER_DAY = 3;
export const DAYS_PER_WEEK = 4;

export const DAY_NAMES = ['Empuje', 'Tirón', 'Kettlebell A', 'Kettlebell B'];
export const DAY_FOCUS = [
  'PECHO / HOMBRO / TRÍCEPS',
  'ESPALDA / BÍCEPS',
  'CUERPO COMPLETO',
  'CUERPO COMPLETO'
];

export const WEIGHTS = [
  // Day 0 — Empuje
  [
    { name: 'Press banca o press mancuernas', sets: '4', reps: '8-10' },
    { name: 'Press militar', sets: '3', reps: '8-10' },
    { name: 'Elevaciones laterales', sets: '3', reps: '12-15' },
    { name: 'Fondos o press francés', sets: '3', reps: '10-12' },
    { name: 'Extensión tríceps polea', sets: '3', reps: '12-15' },
  ],
  // Day 1 — Tirón
  [
    { name: 'Dominadas o jalón al pecho', sets: '4', reps: '8-10' },
    { name: 'Remo con barra o mancuerna', sets: '3', reps: '8-10' },
    { name: 'Remo en polea baja', sets: '3', reps: '10-12' },
    { name: 'Curl barra o mancuerna', sets: '3', reps: '10-12' },
    { name: 'Curl martillo', sets: '3', reps: '12' },
  ],
  // Day 2 — Kettlebell A (Jueves)
  [
    { name: 'Swing con kettlebell', sets: '4', reps: '20' },
    { name: 'Sentadilla goblet', sets: '4', reps: '12' },
    { name: 'Remo con kettlebell', sets: '3', reps: '12 c/lado' },
    { name: 'Peso muerto con kettlebell', sets: '3', reps: '15' },
    { name: 'Press con kettlebell', sets: '3', reps: '10 c/lado' },
  ],
  // Day 3 — Kettlebell B (Viernes)
  [
    { name: 'Clean y press', sets: '4', reps: '8 c/lado' },
    { name: 'Zancadas con kettlebell', sets: '3', reps: '10 c/pierna' },
    { name: 'High pull', sets: '4', reps: '12' },
    { name: 'Remo renegado', sets: '3', reps: '8 c/lado' },
    { name: 'Sentadilla sumo con kettlebell', sets: '3', reps: '15' },
  ],
];

export const ABS = [
  'Plancha 3×40 seg · Elevación de piernas 3×15 · Crunch en polea 3×15',
  'Bicicleta abdominal 3×20 · Plancha lateral 3×30 seg c/lado · Crunch inverso 3×15',
  'Plancha 3×40 seg · Elevación de piernas 3×15 · Russian twist 3×20',
  'Plancha con toque hombro 3×12 c/lado · Crunch en polea 3×15 · Mountain climbers 3×20',
];

export const CARDIO = '30 min caminadora — inclinación 8-12%, ritmo constante (zona 2, puedes hablar pero te cuesta)';

// ─── Month 2 (Weeks 5-8) ──────────────────────────────────────────────────────
export const MONTH1_WEEKS = 4;

export const WEIGHTS_M2 = [
  // Day 0 — Empuje (variación)
  [
    { name: 'Press inclinado con mancuernas', sets: '4', reps: '10' },
    { name: 'Aperturas en máquina o cables', sets: '3', reps: '12-15' },
    { name: 'Arnold press', sets: '4', reps: '10' },
    { name: 'Elevaciones laterales en cable', sets: '3', reps: '15' },
    { name: 'Extensión tríceps en cuerda', sets: '4', reps: '15' },
  ],
  // Day 1 — Tirón (variación)
  [
    { name: 'Jalón agarre neutro', sets: '4', reps: '10' },
    { name: 'Remo Hammer Strength o máquina', sets: '4', reps: '10' },
    { name: 'Pull-over con mancuerna', sets: '3', reps: '12' },
    { name: 'Curl predicador', sets: '3', reps: '10-12' },
    { name: 'Curl en polea baja', sets: '3', reps: '15' },
  ],
  // Day 2 — Kettlebell A variación (Jueves Mes 2)
  [
    { name: 'Swing con kettlebell', sets: '5', reps: '20' },
    { name: 'Sentadilla goblet con pausa', sets: '4', reps: '10' },
    { name: 'Clean y press', sets: '4', reps: '8 c/lado' },
    { name: 'Peso muerto a una pierna', sets: '3', reps: '10 c/pierna' },
    { name: 'High pull', sets: '3', reps: '15' },
  ],
  // Day 3 — Kettlebell B variación (Viernes Mes 2)
  [
    { name: 'Snatch con kettlebell', sets: '4', reps: '8 c/lado' },
    { name: 'Zancadas inversas con kettlebell', sets: '4', reps: '10 c/pierna' },
    { name: 'Press militar', sets: '3', reps: '10 c/lado' },
    { name: 'Remo renegado', sets: '4', reps: '8 c/lado' },
    { name: 'Farmer carry', sets: '3', reps: '30 seg' },
  ],
];

export const ABS_M2 = [
  'Dead bug 3×10 c/lado · Ab wheel 3×8 · Plancha 3×45 seg',
  'V-up 3×15 · Russian twist con peso 3×20 · Plancha lateral 3×10 c/lado',
  'Mountain climbers lentos 3×20 · Elevación de piernas 3×12 · Hollow hold 3×20 seg',
  'Bicicleta 3×25 · Crunch inverso con peso 3×15 · Plancha con toque hombro 3×12 c/lado',
];

export const CARDIO_M2 = '40 min caminadora — inclinación 10-12%, ritmo 5-6 km/h (zona 2, foco en quema de grasa)';

// 7-day abs rotation for Phase 2 — index = day of week (0=Dom … 6=Sáb)
export const DAILY_ABS_M2 = [
  'Plancha 3×45 seg · Mountain climbers 3×20 · Dead bug 3×10 c/lado',
  'Crunch 3×20 · Elevación de piernas 3×15 · Plancha lateral 3×30 seg c/lado',
  'Russian twist 3×20 · V-up 3×12 · Plancha 3×45 seg',
  'Bicicleta abdominal 3×25 · Hollow hold 3×20 seg · Crunch inverso 3×15',
  'Dead bug 3×10 c/lado · Mountain climbers lentos 3×20 · Plancha 3×45 seg',
  'Ab wheel 3×8 · Plancha lateral dinámica 3×10 c/lado · V-up 3×12',
  'Crunch 3×20 · Plancha 3×45 seg · Elevación de piernas 3×12',
];

export function getPhase(week) {
  return week <= MONTH1_WEEKS ? 1 : 2;
}

export function getExercises(week, dayIndex) {
  return getPhase(week) === 1 ? WEIGHTS[dayIndex] : WEIGHTS_M2[dayIndex];
}

export function getCardioText(week) {
  return getPhase(week) === 1 ? CARDIO : CARDIO_M2;
}

export function getAbsText(week, dayIndex) {
  return getPhase(week) === 1 ? ABS[dayIndex] : ABS_M2[dayIndex];
}

export function getDailyAbsRoutine() {
  return DAILY_ABS_M2[new Date().getDay()];
}

export function getWeekFromDate(date) {
  const daysSince = Math.floor((date - START_MONDAY) / 86400000);
  if (daysSince < 0) return 0;
  return Math.floor(daysSince / 7) + 1;
}

export function getDateFor(week, dayIndex) {
  const d = new Date(START_MONDAY);
  d.setDate(START_MONDAY.getDate() + (week - 1) * 7 + DAY_OFFSETS[dayIndex]);
  return d;
}

export function getWeekDateRange(week) {
  const start = getDateFor(week, 0);
  const end = getDateFor(week, 3);
  return { start, end };
}

export function workoutKey(week, day, sub) {
  return `w${week}d${day}-${sub}`;
}

export function computeStreak(prog, numWeeks) {
  let streak = 0, streakRunning = true;
  for (let w = 1; w <= numWeeks; w++) {
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const statuses = SUBS.map(s => prog[workoutKey(w, d, s)]);
      const dayFullyDone = statuses.every(s => s === 'done');
      if (dayFullyDone) {
        if (streakRunning) streak++;
      } else if (statuses.some(s => s !== null && s !== undefined)) {
        streakRunning = false;
      }
    }
  }
  return streak;
}
