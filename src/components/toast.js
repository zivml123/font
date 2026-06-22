let container;

function getContainer() {
  if (!container) {
    container = document.getElementById('toast-container');
  }
  return container;
}

export function toast(msg, type = 'default', ms = 1800) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  getContainer().appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut 0.2s ease forwards';
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, ms);
}

export function toastSaved() { toast('✓ Guardado', 'saved', 900); }
export function toastFailed() { toast('✗ No se guardó — reintentando...', 'error', 1600); }
export function toastInfo(msg) { toast(msg, 'default', 2000); }
export function toastError(msg) { toast(msg, 'error', 3000); }
