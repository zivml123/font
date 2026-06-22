// Backend proxy for AI food analysis.
// User enters their backend URL in Profile → IA (e.g. https://my-app.onrender.com).
// The backend holds the ANTHROPIC_API_KEY; no key is ever stored in the browser.

const LS_KEY = 'zivplan_backend_url';

export function getBackendUrl() {
  return (localStorage.getItem(LS_KEY) || '').replace(/\/$/, '');
}
export function setBackendUrl(url) {
  localStorage.setItem(LS_KEY, url.trim().replace(/\/$/, ''));
}

async function callBackend(endpoint, body) {
  const base = getBackendUrl();
  if (!base) throw new Error('Backend URL no configurada. Ve a Perfil → IA para configurarla.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  let resp;
  try {
    resp = await fetch(`${base}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('El servidor tardó demasiado. Intenta de nuevo.');
    throw e;
  } finally {
    clearTimeout(timer);
  }

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || `Error ${resp.status}`);
  }
  return resp.json();
}

function sanitizeResult(r) {
  return {
    item: String(r.item || 'Comida').slice(0, 60),
    kcal: Math.max(0, Math.round(Number(r.kcal) || 0)),
    protein: Math.max(0, Math.round(Number(r.protein) || 0)),
    carbs: Math.max(0, Math.round(Number(r.carbs) || 0)),
    fat: Math.max(0, Math.round(Number(r.fat) || 0)),
    warning: r.warning ? String(r.warning) : null,
    explanation: r.explanation ? String(r.explanation) : null,
  };
}

export async function analyzeText(text) {
  const result = await callBackend('/api/analyze-meal', { text });
  return sanitizeResult(result);
}

export async function analyzePhoto(file) {
  const base64 = await fileToBase64(file);
  const result = await callBackend('/api/analyze-photo', {
    imageBase64: base64,
    mediaType: file.type || 'image/jpeg',
  });
  return sanitizeResult(result);
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
