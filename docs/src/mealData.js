// Pre-calculated macros for the weekly meal plan
// Porciones: palma=proteína, puño=carbohidrato, pulgar=grasa

export const INBODY = {
  fecha: '19 jun 2026',
  peso_kg: 79.8,
  grasa_pct: 18.7,
  smm_kg: 37.1,
  tmb_kcal: 1771,
  mineral_oseo_kg: 3.4,
  grasa_visceral: 6.4,
  cintura_cadera: 0.88,
};

export const GOALS = {
  peso_meta_kg: 74.84,
  grasa_meta_pct: 15,
  kcal_meta: 1950,
  proteina_meta_g: 175,
};

export const DOW_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const DOW_LABELS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// ─── Shared option arrays ─────────────────────────────────────────────────────

const BREAKFAST_MON_THU = [
  { item: 'Lata de atún + pan Ezekiel + café con leche de almendra', kcal: 220, protein: 32, carbs: 15, fat: 3 },
  { item: '3 huevos revueltos + pan Ezekiel + café negro', kcal: 290, protein: 21, carbs: 18, fat: 14 },
  { item: 'Yogur griego s/azúcar + 30g avena + banana pequeña', kcal: 300, protein: 22, carbs: 45, fat: 5 },
];

const LUNCH_MON_THU = [
  { item: '200g pechuga de pollo + ensalada verde + vinagreta light', kcal: 420, protein: 50, carbs: 8, fat: 12 },
  { item: '200g carne res magra + ensalada verde', kcal: 500, protein: 45, carbs: 5, fat: 22 },
  { item: '200g pescado blanco + vegetales salteados', kcal: 430, protein: 45, carbs: 10, fat: 14 },
];

const DINNER_MON_THU = [
  { item: '200g filete de atún + ensalada', kcal: 350, protein: 45, carbs: 5, fat: 10 },
  { item: '200g salmón + ensalada', kcal: 500, protein: 40, carbs: 5, fat: 25 },
  { item: '200g pechuga de pollo + vegetales al vapor', kcal: 380, protein: 50, carbs: 8, fat: 8 },
];

const LUNCH_FRI_SAT = [
  { item: 'Pollo + ensalada + papa al horno', kcal: 550, protein: 50, carbs: 35, fat: 12 },
  { item: 'Carne res + ensalada + arroz', kcal: 650, protein: 45, carbs: 45, fat: 22 },
  { item: 'Salmón + vegetales + papa', kcal: 650, protein: 40, carbs: 35, fat: 28 },
];

const DINNER_FRI = [
  { item: 'Pollo + ensalada (Cena Shabbat)', kcal: 500, protein: 50, carbs: 5, fat: 15 },
  { item: 'Carne res + ensalada (Cena Shabbat)', kcal: 600, protein: 45, carbs: 5, fat: 30 },
  { item: 'Pescado + ensalada (Cena Shabbat)', kcal: 550, protein: 40, carbs: 5, fat: 22 },
];

const DINNER_SAT = [
  { item: '10 piezas de sushi', kcal: 450, protein: 25, carbs: 60, fat: 8 },
  { item: 'Carne res + ensalada', kcal: 600, protein: 45, carbs: 5, fat: 30 },
  { item: 'Pollo + ensalada', kcal: 500, protein: 50, carbs: 5, fat: 15 },
];

const LUNCH_SUN = [
  { item: 'Pollo + ensalada + papa', kcal: 550, protein: 50, carbs: 35, fat: 12 },
  { item: 'Carne res + ensalada + arroz', kcal: 650, protein: 45, carbs: 45, fat: 22 },
  { item: 'Pescado + vegetales', kcal: 500, protein: 45, carbs: 10, fat: 14 },
];

const DINNER_SUN = [
  { item: 'Atún + ensalada', kcal: 350, protein: 45, carbs: 5, fat: 10 },
  { item: 'Pollo + vegetales', kcal: 380, protein: 50, carbs: 8, fat: 8 },
  { item: 'Salmón + ensalada', kcal: 500, protein: 40, carbs: 5, fat: 25 },
];

// ─── Weekly plan — indexed by JS day-of-week (0=Sun … 6=Sat) ─────────────────
// desayuno: null → show "Sin desayuno planificado"
export const WEEKLY_PLAN = {
  0: { desayuno: null,             almuerzo: LUNCH_SUN,     cena: DINNER_SUN },
  1: { desayuno: BREAKFAST_MON_THU, almuerzo: LUNCH_MON_THU, cena: DINNER_MON_THU },
  2: { desayuno: BREAKFAST_MON_THU, almuerzo: LUNCH_MON_THU, cena: DINNER_MON_THU },
  3: { desayuno: BREAKFAST_MON_THU, almuerzo: LUNCH_MON_THU, cena: DINNER_MON_THU },
  4: { desayuno: BREAKFAST_MON_THU, almuerzo: LUNCH_MON_THU, cena: DINNER_MON_THU },
  5: { desayuno: null,             almuerzo: LUNCH_FRI_SAT,  cena: DINNER_FRI },
  6: { desayuno: null,             almuerzo: LUNCH_FRI_SAT,  cena: DINNER_SAT },
};
