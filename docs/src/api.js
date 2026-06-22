// Browser-direct Anthropic API for static/GitHub Pages preview.
// API key entered once in Profile → saved in localStorage.
// For production, use the Express backend instead (keeps key server-side).

const KOSHER = `Si la comida contiene mezcla de carne con lácteos, cerdo, mariscos o cualquier ingrediente no kosher, agrega el campo "warning": "No kosher: [razón]". Si es completamente kosher, omite el campo warning.`;

export function getApiKey() {
  return localStorage.getItem('zivplan_anthropic_key') || '';
}
export function setApiKey(k) {
  localStorage.setItem('zivplan_anthropic_key', k);
}

async function callAnthropic(messages) {
  const key = getApiKey();
  if (!key) throw new Error('API key no configurada. Agrégala en Perfil → IA para análisis de comida.');
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 300, messages }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error ${resp.status}`);
  }
  const data = await resp.json();
  return data.content.map(b => b.text || '').join('');
}

function sanitizeResult(r) {
  return {
    item: String(r.item || 'Comida').slice(0, 60),
    kcal: Math.max(0, Math.round(Number(r.kcal) || 0)),
    protein: Math.max(0, Math.round(Number(r.protein) || 0)),
    carbs: Math.max(0, Math.round(Number(r.carbs) || 0)),
    fat: Math.max(0, Math.round(Number(r.fat) || 0)),
    warning: r.warning ? String(r.warning) : null,
  };
}

export async function analyzeText(text) {
  const raw = await callAnthropic([{ role: 'user', content:
    `Eres un nutricionista experto. Analiza esta comida y estima calorías y macronutrientes.\nComida: "${text}"\n${KOSHER}\nResponde ÚNICAMENTE con JSON válido sin backticks:\n{"item":"descripción (max 6 palabras)","kcal":0,"protein":0,"carbs":0,"fat":0}` }]);
  return sanitizeResult(JSON.parse(raw.replace(/```json|```/g, '').trim()));
}

export async function analyzePhoto(file) {
  const base64 = await fileToBase64(file);
  const raw = await callAnthropic([{ role: 'user', content: [
    { type: 'image', source: { type: 'base64', media_type: file.type || 'image/jpeg', data: base64 } },
    { type: 'text', text: `Eres un nutricionista experto. Estima calorías y macros de esta foto.\n${KOSHER}\nResponde ÚNICAMENTE con JSON válido sin backticks:\n{"item":"descripción (max 6 palabras)","kcal":0,"protein":0,"carbs":0,"fat":0}` }
  ]}]);
  return sanitizeResult(JSON.parse(raw.replace(/```json|```/g, '').trim()));
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Push notifications not available in static preview
export async function getVapidKey() { return null; }
export async function subscribePush() { return false; }
export async function unsubscribePush() {}
