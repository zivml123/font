import { toastSaved, toastError } from '../components/toast.js';
import { confirmModal } from '../components/modal.js';
import { getProgressPhotos, addProgressPhotoMeta, deleteProgressPhotoMeta } from '../storage.js';
import { state } from '../state.js';

const LS_KEY    = 'zivplan_progress_photos';
const BUCKET    = 'progress-photos';
const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

// ─── Cloud helpers ────────────────────────────────────────────────────────────
function sb()       { return window.__supabase || null; }
function cloudUid() { return state.user?.id || null; }
function isCloud()  { return !!(sb() && cloudUid()); }

// Upload image blob to Supabase Storage; returns storage_path or null on failure
async function uploadToStorage(blob, date, id) {
  const s   = sb();
  const uid = cloudUid();
  if (!s || !uid) return null;

  const path = `${uid}/${date}-${id}.jpg`;
  try {
    const { error } = await s.storage.from(BUCKET).upload(path, blob, {
      contentType: 'image/jpeg',
      upsert: true,
    });
    if (error) throw error;
    return path;
  } catch (e) {
    console.warn('Storage upload failed:', e.message);
    return null;
  }
}

// Get a signed URL for a storage path (1-hour expiry)
async function getSignedUrl(storagePath) {
  const s = sb();
  if (!s || !storagePath) return null;
  try {
    const { data, error } = await s.storage.from(BUCKET).createSignedUrl(storagePath, 3600);
    if (error) throw error;
    return data.signedUrl;
  } catch { return null; }
}

// Delete image from Supabase Storage
async function deleteFromStorage(storagePath) {
  const s = sb();
  if (!s || !storagePath) return;
  try {
    await s.storage.from(BUCKET).remove([storagePath]);
  } catch (e) {
    console.warn('Storage delete failed:', e.message);
  }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
function lsGetPhotos() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function lsSavePhotos(photos) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(photos)); } catch {
    throw new Error('Foto demasiado grande. Intenta con una foto más pequeña.');
  }
}

// ─── Load photos for display ──────────────────────────────────────────────────
// Returns array of { id, date, displaySrc, weight_kg, fat_pct, waist_cm, notes, storage_path? }
async function loadPhotosForDisplay() {
  if (isCloud()) {
    const rows = await getProgressPhotos();
    // For cloud photos, generate signed URLs in parallel
    const withUrls = await Promise.all(rows.map(async row => {
      let displaySrc = null;
      if (row.storage_path) {
        displaySrc = await getSignedUrl(row.storage_path);
      }
      // Fallback: check localStorage for a local copy
      if (!displaySrc) {
        const local = lsGetPhotos().find(p => p.id === row.id);
        displaySrc = local?.dataUrl || null;
      }
      return { ...row, displaySrc };
    }));
    return withUrls.filter(p => p.displaySrc); // only show photos we can actually display
  }

  // Local mode: read from localStorage
  return lsGetPhotos().map(p => ({ ...p, displaySrc: p.dataUrl }));
}

// ─── Save a new photo ─────────────────────────────────────────────────────────
async function savePhoto(el, dataUrl, meta) {
  const compressed = await compressPhoto(dataUrl, 900, 0.75);
  const id = crypto.randomUUID();

  // Always save to localStorage first (offline-first)
  const localPhoto = { id, ...meta, dataUrl: compressed };
  const localPhotos = lsGetPhotos();
  localPhotos.push(localPhoto);
  lsSavePhotos(localPhotos);

  // Cloud sync if available
  if (isCloud()) {
    let storagePath = null;
    try {
      // Convert dataUrl to blob for upload
      const blob = await dataUrlToBlob(compressed);
      storagePath = await uploadToStorage(blob, meta.date, id);
    } catch (e) {
      console.warn('Photo upload failed, saved locally only:', e.message);
    }
    try {
      await addProgressPhotoMeta({ id, ...meta, storage_path: storagePath });
    } catch (e) {
      console.warn('Photo metadata cloud save failed:', e.message);
    }
  }

  return localPhoto;
}

// ─── Delete a photo ───────────────────────────────────────────────────────────
async function deletePhoto(photoId) {
  // Remove from localStorage
  const photos = lsGetPhotos().filter(p => p.id !== photoId);
  lsSavePhotos(photos);

  // Cloud: remove metadata + storage file
  if (isCloud()) {
    try {
      const rows = await getProgressPhotos();
      const row  = rows.find(r => r.id === photoId);
      if (row?.storage_path) await deleteFromStorage(row.storage_path);
      await deleteProgressPhotoMeta(photoId);
    } catch (e) {
      console.warn('Cloud photo delete failed:', e.message);
    }
  }
}

// ─── Util ─────────────────────────────────────────────────────────────────────
function dataUrlToBlob(dataUrl) {
  return new Promise((resolve, reject) => {
    try {
      const [header, b64] = dataUrl.split(',');
      const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bytes = atob(b64);
      const arr = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
      resolve(new Blob([arr], { type: mime }));
    } catch (e) { reject(e); }
  });
}

function compressPhoto(dataUrl, maxWidth, quality) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function fmtDate(ds) {
  const d = new Date(ds + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
}
function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Public render ────────────────────────────────────────────────────────────
export async function renderPhotos() {
  const el = document.getElementById('fotos-view');
  if (!el) return;
  await renderPhotosView(el);
}

export async function renderPhotosInElement(el) {
  await renderPhotosView(el);
}

async function renderPhotosView(el) {
  el.innerHTML = `
    <div class="px py">
      <div class="section-eyebrow">TRANSFORMACIÓN</div>
      <div class="section-title mt-8">Fotos de Progreso</div>
    </div>
    <div class="px" style="margin-bottom:16px;">
      <button class="btn btn-primary btn-full" id="btn-add-photo">+ Agregar foto de hoy</button>
      <input type="file" id="photo-file-input" accept="image/*" class="hidden">
    </div>
    <div id="photos-content" style="display:flex;align-items:center;justify-content:center;padding:40px 0;">
      <span style="color:var(--muted);font-size:14px;">Cargando...</span>
    </div>
  `;

  bindAddEvent(el);

  let photos = [];
  try {
    photos = await loadPhotosForDisplay();
  } catch (e) {
    console.warn('loadPhotosForDisplay failed:', e.message);
    photos = lsGetPhotos().map(p => ({ ...p, displaySrc: p.dataUrl }));
  }

  const sorted = [...photos].sort((a, b) => a.date.localeCompare(b.date));
  const content = el.querySelector('#photos-content');
  if (!content) return;

  content.innerHTML = `
    ${sorted.length >= 2 ? renderComparison(sorted[0], sorted[sorted.length - 1]) : ''}
    <div class="px">
      <div style="margin-bottom:10px;">
        <span class="section-eyebrow">TIMELINE · ${photos.length} ${photos.length === 1 ? 'foto' : 'fotos'}</span>
      </div>
      ${sorted.length ? renderTimeline([...sorted].reverse()) : `
        <div class="empty-state">
          <span class="empty-state-icon">📸</span>
          Agrega tu primera foto para ver tu transformación.
        </div>
      `}
    </div>
  `;

  content.querySelectorAll('.btn-icon.danger[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      confirmModal('¿Eliminar esta foto?', async () => {
        try {
          await deletePhoto(btn.dataset.id);
          await renderPhotosView(el);
          toastSaved();
        } catch (e) { toastError(e.message); }
      }, 'Eliminar', true);
    });
  });
}

// ─── Render helpers ───────────────────────────────────────────────────────────
function renderComparison(first, last) {
  const deltaW = (first.weight_kg && last.weight_kg)
    ? (last.weight_kg - first.weight_kg).toFixed(1) : null;
  const deltaF = (first.fat_pct && last.fat_pct)
    ? (last.fat_pct - first.fat_pct).toFixed(1) : null;

  return `
    <div class="px" style="margin-bottom:16px;">
      <div class="chart-card">
        <div class="chart-title" style="margin-bottom:14px;">Inicio vs Ahora</div>
        <div class="photo-cmp-row">
          <div class="photo-cmp-col">
            <img src="${escHtml(first.displaySrc)}" class="photo-cmp-img" alt="foto inicial" loading="lazy">
            <div class="photo-cmp-label">${fmtDate(first.date)}</div>
            ${first.weight_kg ? `<div class="photo-cmp-weight">${first.weight_kg} kg</div>` : ''}
          </div>
          <div class="photo-cmp-mid">
            <div style="font-size:24px;color:var(--muted);">→</div>
            ${deltaW !== null ? `<div class="photo-delta" style="color:${deltaW < 0 ? 'var(--done)' : 'var(--fail)'}">
              <span style="font-size:20px;font-weight:700;">${deltaW > 0 ? '+' : ''}${deltaW} kg</span>
              <span style="font-size:10px;color:var(--muted);">PESO</span>
            </div>` : ''}
            ${deltaF !== null ? `<div class="photo-delta" style="color:${deltaF < 0 ? 'var(--done)' : 'var(--fail)'}">
              <span style="font-size:18px;font-weight:700;">${deltaF > 0 ? '+' : ''}${deltaF}%</span>
              <span style="font-size:10px;color:var(--muted);">GRASA</span>
            </div>` : ''}
          </div>
          <div class="photo-cmp-col">
            <img src="${escHtml(last.displaySrc)}" class="photo-cmp-img" alt="foto actual" loading="lazy">
            <div class="photo-cmp-label">${fmtDate(last.date)}</div>
            ${last.weight_kg ? `<div class="photo-cmp-weight">${last.weight_kg} kg</div>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTimeline(photos) {
  return photos.map(p => `
    <div class="photo-timeline-item">
      <img src="${escHtml(p.displaySrc)}" class="photo-timeline-img" alt="progreso ${p.date}" loading="lazy">
      <div class="photo-timeline-info">
        <div class="photo-timeline-date">${fmtDate(p.date)}</div>
        <div class="photo-timeline-stats">
          ${p.weight_kg ? `<span>${p.weight_kg} kg</span>` : ''}
          ${p.fat_pct ? `<span>${p.fat_pct}% grasa</span>` : ''}
          ${p.waist_cm ? `<span>${p.waist_cm} cm</span>` : ''}
        </div>
        ${p.notes ? `<div class="photo-timeline-notes">${escHtml(p.notes)}</div>` : ''}
      </div>
      <button class="btn-icon danger" data-id="${p.id}" title="Eliminar foto">✕</button>
    </div>
  `).join('');
}

// ─── Add photo flow ───────────────────────────────────────────────────────────
function bindAddEvent(el) {
  const fileInput = el.querySelector('#photo-file-input');
  el.querySelector('#btn-add-photo')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => showAddPhotoModal(el, e.target.result);
    reader.readAsDataURL(file);
    fileInput.value = '';
  });
}

function showAddPhotoModal(el, dataUrl) {
  const today = dateStr(new Date());
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:300;display:flex;align-items:flex-end;';
  overlay.innerHTML = `
    <div style="width:100%;background:var(--panel);border-radius:16px 16px 0 0;padding:20px 20px calc(20px + env(safe-area-inset-bottom,0px));max-height:90dvh;overflow-y:auto;">
      <div class="modal-handle"></div>
      <div class="modal-title">Foto de progreso</div>
      <img src="${dataUrl}" style="width:100%;height:200px;object-fit:cover;border-radius:10px;margin-bottom:16px;" alt="">
      <div class="result-form">
        <div class="result-field">
          <label>Fecha</label>
          <input class="result-input" type="date" id="pf-date" value="${today}">
        </div>
        <div class="result-form-row">
          <div class="result-field">
            <label>Peso (kg)</label>
            <input class="result-input" type="number" id="pf-weight" placeholder="79.8" step="0.1" min="30" max="300" inputmode="decimal">
          </div>
          <div class="result-field">
            <label>Grasa %</label>
            <input class="result-input" type="number" id="pf-fat" placeholder="18.7" step="0.1" min="3" max="60" inputmode="decimal">
          </div>
        </div>
        <div class="result-field">
          <label>Cintura (cm, opcional)</label>
          <input class="result-input" type="number" id="pf-waist" placeholder="82" step="0.5" min="40" max="200" inputmode="decimal">
        </div>
        <div class="result-field">
          <label>Notas (opcional)</label>
          <input class="result-input name-input" type="text" id="pf-notes" placeholder="Semana 4, después de entreno...">
        </div>
      </div>
      <div class="modal-actions" style="margin-top:16px;">
        <button class="btn btn-secondary" id="pf-cancel">Cancelar</button>
        <button class="btn btn-primary" id="pf-save">Guardar foto</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const saveBtn = overlay.querySelector('#pf-save');

  overlay.querySelector('#pf-cancel').addEventListener('click', () => overlay.remove());
  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Guardando...';

    const date   = overlay.querySelector('#pf-date').value || today;
    const wVal   = overlay.querySelector('#pf-weight').value;
    const fVal   = overlay.querySelector('#pf-fat').value;
    const waistV = overlay.querySelector('#pf-waist').value;
    const notes  = overlay.querySelector('#pf-notes').value.trim();

    const meta = {
      date,
      weight_kg: wVal   ? parseFloat(wVal)   : null,
      fat_pct:   fVal   ? parseFloat(fVal)   : null,
      waist_cm:  waistV ? parseFloat(waistV) : null,
      notes:     notes  || null,
    };

    try {
      await savePhoto(el, dataUrl, meta);
      overlay.remove();
      await renderPhotosView(el);
      toastSaved();
    } catch (e) {
      toastError(e.message);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Guardar foto';
    }
  });
}
