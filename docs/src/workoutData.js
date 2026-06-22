// Workout starts Monday June 22, 2026
export const START_MONDAY = new Date(2026, 5, 22); // month is 0-indexed; June 22 = Monday

// Offsets from Monday (0=Mon, 1=Tue, 3=Thu, 4=Fri)
export const DAY_OFFSETS = [0, 1, 3, 4];
export const TOTAL_WEEKS_DEFAULT = 4;
export const SUBS = ['pesas', 'cam', 'abs'];
export const SUBS_PER_DAY = 3;
export const DAYS_PER_WEEK = 4;

export const DAY_NAMES = ['Empuje', 'Tirón', 'Pierna', 'Full Body'];
export const DAY_FOCUS = [
  'PECHO / HOMBRO / TRÍCEPS',
  'ESPALDA / BÍCEPS',
  'PIERNA COMPLETA',
  'GLÚTEO / CORE'
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
  // Day 2 — Pierna
  [
    { name: 'Sentadilla', sets: '4', reps: '8-10' },
    { name: 'Peso muerto rumano', sets: '3', reps: '8-10' },
    { name: 'Prensa de pierna', sets: '3', reps: '10-12' },
    { name: 'Curl femoral', sets: '3', reps: '12' },
    { name: 'Elevación de pantorrilla', sets: '4', reps: '15' },
  ],
  // Day 3 — Full Body
  [
    { name: 'Hip thrust', sets: '4', reps: '10-12' },
    { name: 'Zancadas con mancuernas', sets: '3', reps: '10 c/pierna' },
    { name: 'Press inclinado mancuernas', sets: '3', reps: '10' },
    { name: 'Remo en máquina', sets: '3', reps: '10' },
    { name: 'Face pull', sets: '3', reps: '15' },
  ],
];

export const ABS = [
  'Plancha 3×40 seg · Elevación de piernas 3×15 · Crunch en polea 3×15',
  'Bicicleta abdominal 3×20 · Plancha lateral 3×30 seg c/lado · Crunch inverso 3×15',
  'Plancha 3×40 seg · Elevación de piernas 3×15 · Russian twist 3×20',
  'Plancha con toque hombro 3×12 c/lado · Crunch en polea 3×15 · Mountain climbers 3×20',
];

export const CARDIO = '30 min caminadora — inclinación 8-12%, ritmo constante (zona 2, puedes hablar pero te cuesta)';

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
