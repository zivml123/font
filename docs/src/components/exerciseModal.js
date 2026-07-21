import { getExerciseData } from '../exerciseData.js';

let overlay = null;

function ensureOverlay() {
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.className = 'ex-modal-overlay';
  overlay.id = 'ex-modal-overlay';
  overlay.innerHTML = `
    <div class="ex-modal" id="ex-modal">
      <div class="ex-modal-handle"></div>
      <button class="ex-modal-close" id="ex-modal-close" aria-label="Cerrar">×</button>
      <div class="ex-modal-img" id="ex-modal-img"></div>
      <div class="ex-modal-name" id="ex-modal-name"></div>
      <div class="ex-modal-muscles" id="ex-modal-muscles"></div>
      <div class="ex-modal-desc" id="ex-modal-desc"></div>
    </div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeExerciseModal();
  });
  overlay.querySelector('#ex-modal-close').addEventListener('click', closeExerciseModal);

  return overlay;
}

export function openExerciseModal(name) {
  const data = getExerciseData(name);
  const el = ensureOverlay();

  if (data) {
    el.querySelector('#ex-modal-img').innerHTML = data.svg;
    el.querySelector('#ex-modal-name').textContent = name;
    el.querySelector('#ex-modal-muscles').innerHTML =
      data.muscles.map(m => `<span class="ex-muscle-tag">${m}</span>`).join('');
    el.querySelector('#ex-modal-desc').textContent = data.description;
  } else {
    el.querySelector('#ex-modal-img').innerHTML = '';
    el.querySelector('#ex-modal-name').textContent = name;
    el.querySelector('#ex-modal-muscles').innerHTML = '';
    el.querySelector('#ex-modal-desc').textContent = 'No hay información disponible para este ejercicio.';
  }

  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeExerciseModal() {
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}
