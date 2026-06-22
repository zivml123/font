// Anthropic API proxy — all calls go through /api/* on our Express server.
// In dev/prod, the API key stays on the server. Never in the browser.

async function post(endpoint, body) {
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
    throw new Error(err.error || `Error ${resp.status}`);
  }
  return resp.json();
}

// Analyze food from text description
export async function analyzeText(text) {
  const result = await post('/api/analyze-meal', { text });
  return sanitizeResult(result);
}

// Analyze food from photo (file object)
export async function analyzePhoto(file) {
  const base64 = await fileToBase64(file);
  const result = await post('/api/analyze-photo', {
    imageBase64: base64,
    mediaType: file.type || 'image/jpeg',
  });
  return sanitizeResult(result);
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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Get VAPID public key for push subscriptions
export async function getVapidKey() {
  const resp = await fetch('/api/push/vapid-key');
  if (!resp.ok) return null;
  const { publicKey } = await resp.json();
  return publicKey;
}

// Subscribe to push notifications
export async function subscribePush() {
  const vapidKey = await getVapidKey();
  if (!vapidKey || !('serviceWorker' in navigator) || !('PushManager' in window)) return false;

  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (existing) return true;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey),
  });
  await post('/api/push/subscribe', { subscription: sub });
  return true;
}

export async function unsubscribePush() {
  if (!('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await post('/api/push/unsubscribe', { subscription: sub });
    await sub.unsubscribe();
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}
