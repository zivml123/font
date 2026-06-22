// Pre-calculated macros for the weekly meal plan
// Porciones medidas con la mano: palma=proteína, puño=carbo, pulgar=grasa

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
  peso_meta_kg: 74.84, // 165 lb
  grasa_meta_pct: 15,
  kcal_meta: 1950,
  proteina_meta_g: 175,
};

// Fixed breakfast — every day
export const DESAYUNO = {
  item: '3 huevos + pan integral + ¼ aguacate + café almendra',
  kcal: 435,
  protein: 24,
  carbs: 29,
  fat: 26,
  detail: '3 huevos revueltos + 1 pan integral + ¼ aguacate + café con leche de almendra sin azúcar',
};

// Fixed dinner options — by day of week (0=Sun, 1=Mon, ...)
// Atún: Lun(1), Mar(2), Jue(4), Dom(0)  → indices 0,1,3,6
// Salmón: Mié(3), Vie(5), Sáb(6)       → indices 2,4,5
export const CENA_ATUN = {
  item: 'Atún en agua + ensalada de vegetales',
  kcal: 190,
  protein: 33,
  carbs: 10,
  fat: 2,
  detail: 'Atún en agua SIN salsas + ensalada de vegetales sin límite',
};
export const CENA_SALMON = {
  item: 'Salmón a la plancha + ensalada de vegetales',
  kcal: 310,
  protein: 34,
  carbs: 10,
  fat: 14,
  detail: 'Salmón a la plancha/horno SIN aceite extra + ensalada de vegetales sin límite',
};

// DOW → cena (0=Sun)
export function getCenaForDow(dow) {
  return [0, 1, 3].includes(dow % 7) ? CENA_ATUN : CENA_SALMON;
}

// Lunch options — rotating weekly, one per day of week
export const ALMUERZOS = [
  { // Domingo / Lunes
    item: 'Pollo a la plancha + arroz integral + vegetales',
    kcal: 430,
    protein: 45,
    carbs: 45,
    fat: 8,
    detail: '2 palmas pollo a la plancha + 1 puño arroz integral + vegetales a voluntad',
  },
  { // Lunes / Martes
    item: 'Carne res magra + papa + vegetales',
    kcal: 390,
    protein: 40,
    carbs: 35,
    fat: 10,
    detail: '2 palmas carne res magra kosher + 1 puño papa cocida + vegetales a voluntad',
  },
  { // Martes / Miércoles
    item: 'Pescado blanco + quinoa + vegetales',
    kcal: 370,
    protein: 42,
    carbs: 40,
    fat: 5,
    detail: '2 palmas pescado blanco (tilapia/merluza) + 1 puño quinoa + vegetales a voluntad',
  },
  { // Miércoles / Jueves
    item: 'Pollo al horno + quinoa + vegetales',
    kcal: 405,
    protein: 44,
    carbs: 42,
    fat: 7,
    detail: '2 palmas pollo al horno sin piel + 1 puño quinoa + vegetales a voluntad',
  },
  { // Jueves / Viernes
    item: 'Carne picada kosher + arroz integral + vegetales',
    kcal: 440,
    protein: 38,
    carbs: 45,
    fat: 12,
    detail: '2 palmas carne picada 90% magra kosher + 1 puño arroz integral + vegetales a voluntad',
  },
  { // Viernes / Sábado
    item: 'Atún en agua + papa + vegetales',
    kcal: 290,
    protein: 36,
    carbs: 32,
    fat: 2,
    detail: '2 latas atún en agua + 1 puño papa cocida + vegetales a voluntad',
  },
  { // Sábado / Domingo
    item: 'Pollo salteado + arroz integral + vegetales',
    kcal: 450,
    protein: 46,
    carbs: 48,
    fat: 9,
    detail: '2 palmas pollo salteado con vegetales + 1 puño arroz integral',
  },
];

// Day-of-week → lunch index
export function getAlmuerzoForDow(dow) {
  return ALMUERZOS[dow % 7];
}

// DOW labels in Spanish
export const DOW_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const DOW_LABELS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
