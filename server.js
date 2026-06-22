import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import Anthropic from '@anthropic-ai/sdk';
import webpush from 'web-push';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// VAPID setup for push notifications
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@zivplan.app',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve index.html with injected Supabase config
app.get('/', (req, res) => {
  try {
    let html = readFileSync(join(__dirname, 'index.html'), 'utf8');
    html = html
      .replace(/window\.__SUPABASE_URL\s*=\s*'[^']*';[^\n]*/, `window.__SUPABASE_URL = '${process.env.SUPABASE_URL || ''}';`)
      .replace(/window\.__SUPABASE_KEY\s*=\s*'[^']*';[^\n]*/, `window.__SUPABASE_KEY = '${process.env.SUPABASE_ANON_KEY || ''}';`);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (e) {
    res.status(500).send('Error loading app: ' + e.message);
  }
});

app.use(express.static(__dirname));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones. Espera un momento.' }
});

const KOSHER_SUFFIX = `Si la comida contiene mezcla de carne con lácteos, cerdo, mariscos o cualquier ingrediente no kosher, agrega el campo "warning": "No kosher: [razón específica]" al JSON. Si es completamente kosher, omite el campo warning.`;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Health check — lets the frontend verify the backend is reachable
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ai: !!process.env.ANTHROPIC_API_KEY });
});

// Analyze food from text description
app.post('/api/analyze-meal', apiLimiter, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Texto requerido.' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'ANTHROPIC_API_KEY no configurada en el servidor.' });

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Eres un nutricionista experto. Analiza esta comida y estima sus calorías y macronutrientes de forma realista, usando porciones típicas si no se especifican gramos exactos.\nComida: "${text}"\n${KOSHER_SUFFIX}\nResponde ÚNICAMENTE con un objeto JSON válido, sin texto adicional ni backticks:\n{"item":"descripción corta en español (max 6 palabras)","kcal":número_entero,"protein":número_entero,"carbs":número_entero,"fat":número_entero,"explanation":"1 frase corta explicando la estimación"}`
      }]
    });
    const raw = msg.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (e) {
    console.error('analyze-meal error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Analyze food from photo (base64)
app.post('/api/analyze-photo', apiLimiter, async (req, res) => {
  const { imageBase64, mediaType } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'Imagen requerida.' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'ANTHROPIC_API_KEY no configurada en el servidor.' });

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: imageBase64 } },
          { type: 'text', text: `Eres un nutricionista experto. Mira esta foto y estima las calorías y macronutrientes de la comida que ves, según las porciones visibles en la imagen.\n${KOSHER_SUFFIX}\nResponde ÚNICAMENTE con un objeto JSON válido, sin texto adicional ni backticks:\n{"item":"descripción corta en español (max 6 palabras)","kcal":número_entero,"protein":número_entero,"carbs":número_entero,"fat":número_entero,"explanation":"1 frase corta explicando la estimación"}` }
        ]
      }]
    });
    const raw = msg.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (e) {
    console.error('analyze-photo error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// VAPID public key for push subscription
app.get('/api/push/vapid-key', (req, res) => {
  if (!process.env.VAPID_PUBLIC_KEY) return res.status(503).json({ error: 'Push no configurado.' });
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Push subscriptions stored in memory (in production, save to Supabase)
const pushSubscriptions = new Set();

app.post('/api/push/subscribe', (req, res) => {
  const { subscription } = req.body;
  if (!subscription) return res.status(400).json({ error: 'Subscription requerida.' });
  pushSubscriptions.add(JSON.stringify(subscription));
  res.json({ ok: true });
});

app.post('/api/push/unsubscribe', (req, res) => {
  const { subscription } = req.body;
  pushSubscriptions.delete(JSON.stringify(subscription));
  res.json({ ok: true });
});

// Send test push notification
app.post('/api/push/test', async (req, res) => {
  if (!process.env.VAPID_PUBLIC_KEY) return res.status(503).json({ error: 'Push no configurado.' });
  const payload = JSON.stringify({ title: 'Ziv Plan', body: '¡Listo para entrenar hoy! 💪', url: '/' });
  const results = await Promise.allSettled(
    [...pushSubscriptions].map(s => webpush.sendNotification(JSON.parse(s), payload))
  );
  res.json({ sent: results.filter(r => r.status === 'fulfilled').length });
});

// Cron-style scheduled notifications (runs every minute, checks time)
setInterval(async () => {
  if (!process.env.VAPID_PUBLIC_KEY || pushSubscriptions.size === 0) return;
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes(), d = now.getDay();
  let notification = null;

  // 6:00 AM on Mon(1), Tue(2), Thu(4), Fri(5)
  if (h === 6 && m === 0 && [1, 2, 4, 5].includes(d)) {
    notification = { title: 'Ziv Plan — Día de gym 🏋️', body: 'Hoy toca entrenar. ¡No lo pospongas!', url: '/#workout' };
  }
  // 8:00 PM every day
  if (h === 20 && m === 0) {
    notification = { title: 'Ziv Plan — Registra tu comida 🍽️', body: '¿Ya registraste lo que comiste hoy?', url: '/#food' };
  }
  // 7:00 AM on Monday
  if (h === 7 && m === 0 && d === 1) {
    notification = { title: 'Ziv Plan — Pesaje semanal ⚖️', body: 'Es lunes. Recuerda pesarte antes de desayunar.', url: '/#progress' };
  }

  if (notification) {
    const payload = JSON.stringify(notification);
    await Promise.allSettled([...pushSubscriptions].map(s => webpush.sendNotification(JSON.parse(s), payload)));
  }
}, 60 * 1000);

app.listen(PORT, () => {
  console.log(`Ziv Plan server → http://localhost:${PORT}`);
  console.log(`Anthropic API: ${process.env.ANTHROPIC_API_KEY ? '✓' : '✗ (set ANTHROPIC_API_KEY)'}`);
  console.log(`Supabase: ${process.env.SUPABASE_URL ? '✓' : '✗ (using localStorage fallback)'}`);
  console.log(`Push: ${process.env.VAPID_PUBLIC_KEY ? '✓' : '✗ (set VAPID keys)'}`);
});
