// Bottom-sheet modal system
let activeOverlay = null;

export function openModal({ title, content, actions = [] }) {
  closeModal();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-handle"></div>
      ${title ? `<h2 class="modal-title">${title}</h2>` : ''}
      <div class="modal-content">${content}</div>
      ${actions.length ? `<div class="modal-actions">${actions.map(a =>
        `<button class="btn ${a.class || 'btn-secondary'} ${a.full ? 'modal-action-single' : ''}" data-action="${a.id || ''}">${a.label}</button>`
      ).join('')}</div>` : ''}
    </div>
  `;

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.body.appendChild(overlay);
  activeOverlay = overlay;

  // Bind actions
  actions.forEach(a => {
    const btn = overlay.querySelector(`[data-action="${a.id || ''}"]`);
    if (btn && a.onClick) btn.addEventListener('click', () => { a.onClick(); });
  });

  return overlay;
}

export function closeModal() {
  if (activeOverlay) { activeOverlay.remove(); activeOverlay = null; }
}

export function confirmModal(msg, onConfirm, confirmLabel = 'Confirmar', destructive = false) {
  openModal({
    title: null,
    content: `<p style="font-size:15px;color:var(--text);line-height:1.5;">${msg}</p>`,
    actions: [
      { id: 'cancel', label: 'Cancelar', class: 'btn-secondary', onClick: closeModal },
      { id: 'confirm', label: confirmLabel, class: destructive ? 'btn-fail-state' : 'btn-primary', onClick: () => { closeModal(); onConfirm(); } },
    ],
  });
}
