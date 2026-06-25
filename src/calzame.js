// ─────────────────────────────────────────────────────────────────────────────
//  CALZAME AI — CRM v1
//  Storage: localStorage  |  Future: swap DB_* functions for API calls
// ─────────────────────────────────────────────────────────────────────────────

'use strict';

// ── CONFIG ────────────────────────────────────────────────────────────────────
const KEYS = { prospectos: 'calzame_prospectos', seguimientos: 'calzame_seguimientos', plantillas: 'calzame_plantillas' };

const ESTADOS_PROSPECTO = ['nuevo','contactado','interesado','propuesta','cerrado','perdido'];
const TIPOS_CLIENTE = ['minorista','mayorista','distribuidor','representante','otro'];
const TIPOS_SEGUIMIENTO = ['llamada','whatsapp','email','reunión','visita'];
const CATEGORIAS_TPL = ['presentación','seguimiento','propuesta','cierre','otro'];
const CANALES_TPL = ['whatsapp','email','llamada'];

const PAISES_LATAM = [
  'México','Colombia','Argentina','Chile','Perú','Ecuador','Bolivia','Venezuela',
  'Uruguay','Paraguay','Guatemala','Honduras','El Salvador','Nicaragua','Costa Rica',
  'Panamá','Cuba','República Dominicana','Puerto Rico','España','Estados Unidos','Otro'
];

const COLORES_ESTADO = {
  nuevo:'#3b82f6', contactado:'#f59e0b', interesado:'#8b5cf6',
  propuesta:'#ec4899', cerrado:'#10b981', perdido:'#6b7280'
};

// ── DATA LAYER ────────────────────────────────────────────────────────────────
// Future: replace these with fetch() calls to your backend

const DB = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Prospectos
  getProspectos()      { return DB.get(KEYS.prospectos); },
  saveProspectos(d)    { DB.set(KEYS.prospectos, d); },
  addProspecto(p)      { const d = DB.getProspectos(); d.unshift(p); DB.saveProspectos(d); },
  updateProspecto(p)   { const d = DB.getProspectos().map(x => x.id === p.id ? p : x); DB.saveProspectos(d); },
  deleteProspecto(id)  { DB.saveProspectos(DB.getProspectos().filter(x => x.id !== id)); },

  // Seguimientos
  getSeguimientos()    { return DB.get(KEYS.seguimientos); },
  saveSeguimientos(d)  { DB.set(KEYS.seguimientos, d); },
  addSeguimiento(s)    { const d = DB.getSeguimientos(); d.unshift(s); DB.saveSeguimientos(d); },
  updateSeguimiento(s) { const d = DB.getSeguimientos().map(x => x.id === s.id ? s : x); DB.saveSeguimientos(d); },
  deleteSeguimiento(id){ DB.saveSeguimientos(DB.getSeguimientos().filter(x => x.id !== id)); },

  // Plantillas
  getPlantillas()      { return DB.get(KEYS.plantillas); },
  savePlantillas(d)    { DB.set(KEYS.plantillas, d); },
  addPlantilla(t)      { const d = DB.getPlantillas(); d.unshift(t); DB.savePlantillas(d); },
  updatePlantilla(t)   { const d = DB.getPlantillas().map(x => x.id === t.id ? t : x); DB.savePlantillas(d); },
  deletePlantilla(id)  { DB.savePlantillas(DB.getPlantillas().filter(x => x.id !== id)); },
};

// ── UTILITIES ─────────────────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function today() {
  return new Date().toISOString().split('T')[0];
}
function fmtDate(iso) {
  if (!iso) return '—';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  const dt = new Date(iso);
  return dt.toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric' });
}
function cap(str) {
  if (!str) return '—';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase();
}
function escHtml(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function daysFromNow(iso) {
  if (!iso) return null;
  const diff = new Date(iso) - new Date(today());
  return Math.ceil(diff / 86400000);
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('hiding');
    setTimeout(() => el.remove(), 200);
  }, 3000);
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
const Modal = {
  _stack: [],
  open(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    Modal._stack.push(id);
    document.body.style.overflow = 'hidden';
  },
  close(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('open');
    Modal._stack = Modal._stack.filter(x => x !== id);
    if (!Modal._stack.length) document.body.style.overflow = '';
  },
  closeTop() {
    if (Modal._stack.length) Modal.close(Modal._stack[Modal._stack.length - 1]);
  }
};

// ── ROUTER ────────────────────────────────────────────────────────────────────
const Router = {
  current: 'dashboard',
  views: {},
  register(name, fn) { Router.views[name] = fn; },
  go(name, params = {}) {
    Router.current = name;
    Router.params = params;

    // update nav
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === name);
    });

    // render
    const view = Router.views[name];
    const content = document.getElementById('view-content');
    if (view) {
      content.innerHTML = view(params);
      // update topbar title
      const titles = {
        dashboard: 'Dashboard', prospectos: 'Prospectos', seguimientos: 'Seguimientos',
        plantillas: 'Plantillas de Mensajes', importar: 'Importar Datos'
      };
      document.querySelector('.topbar-title').textContent = titles[name] || 'Calzame AI';
      // run post-render hooks
      if (Router.afterRender[name]) Router.afterRender[name](params);
    }
    updateNavBadges();
  },
  afterRender: {}
};

// ── NAV BADGES ────────────────────────────────────────────────────────────────
function updateNavBadges() {
  const segs = DB.getSeguimientos().filter(s => !s.completado);
  const pending = document.getElementById('badge-seguimientos');
  if (pending) pending.textContent = segs.length || '';
  if (pending) pending.style.display = segs.length ? '' : 'none';
}

// ─────────────────────────────────────────────────────────────────────────────
//  VIEW: DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
Router.register('dashboard', () => {
  const prospectos = DB.getProspectos();
  const seguimientos = DB.getSeguimientos();
  const hoy = today();

  const total = prospectos.length;
  const nuevosHoy = prospectos.filter(p => p.fechaCreacion && p.fechaCreacion.startsWith(hoy)).length;
  const cerradosMes = prospectos.filter(p => {
    if (p.estado !== 'cerrado') return false;
    const m = new Date().toISOString().slice(0,7);
    return p.fechaActualizacion && p.fechaActualizacion.startsWith(m);
  }).length;
  const segPendientes = seguimientos.filter(s => !s.completado).length;

  // pipeline
  const counts = {};
  ESTADOS_PROSPECTO.forEach(e => counts[e] = prospectos.filter(p => p.estado === e).length);
  const pipelineTotal = total || 1;

  // próximos seguimientos (no completados, ordenados por fecha)
  const proximos = seguimientos
    .filter(s => !s.completado)
    .sort((a,b) => new Date(a.fechaAgenda) - new Date(b.fechaAgenda))
    .slice(0, 8);

  const prospectoMap = {};
  prospectos.forEach(p => prospectoMap[p.id] = p);

  return `
<div class="page-header">
  <div><h2>Dashboard</h2><p>Resumen de tu pipeline de ventas</p></div>
  <button class="btn btn-primary" onclick="openAddProspecto()">+ Agregar Prospecto</button>
</div>

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-label">Total Prospectos</div>
    <div class="stat-value">${total}</div>
    <div class="stat-sub">en tu base de datos</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Nuevos Hoy</div>
    <div class="stat-value">${nuevosHoy}</div>
    <div class="stat-sub">${fmtDate(hoy)}</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Seguimientos Pendientes</div>
    <div class="stat-value">${segPendientes}</div>
    <div class="stat-sub">por completar</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Cerrados este Mes</div>
    <div class="stat-value">${cerradosMes}</div>
    <div class="stat-sub">clientes ganados</div>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">

  <div class="card">
    <div class="card-header"><span class="card-title">Pipeline de Ventas</span></div>
    <div class="card-body">
      ${total === 0 ? '<p class="text-muted">Sin prospectos todavía</p>' : `
      <div class="pipeline-bar">
        ${ESTADOS_PROSPECTO.map(e => `<div class="seg" style="width:${(counts[e]/pipelineTotal*100).toFixed(1)}%;background:${COLORES_ESTADO[e]};min-width:${counts[e]?'4px':'0'}"></div>`).join('')}
      </div>
      <div class="pipeline-legend">
        ${ESTADOS_PROSPECTO.map(e => `
          <div class="legend-item">
            <span class="legend-dot" style="background:${COLORES_ESTADO[e]}"></span>
            ${cap(e)}: <strong>${counts[e]}</strong>
          </div>`).join('')}
      </div>`}
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title">Próximos Seguimientos</span>
      <button class="btn btn-ghost btn-sm" onclick="Router.go('seguimientos')">Ver todos →</button>
    </div>
    <div class="card-body" style="padding:12px 16px">
      ${proximos.length === 0 ? '<p class="text-muted">No hay seguimientos pendientes</p>' : proximos.map(s => {
        const p = prospectoMap[s.prospectoId];
        const dias = daysFromNow(s.fechaAgenda);
        const urgente = dias !== null && dias <= 1;
        return `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--gray-50)">
          <span style="font-size:15px">${tipoIcon(s.tipo)}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(p ? p.nombre : 'Desconocido')}</div>
            <div style="font-size:11px;color:var(--gray-400)">${cap(s.tipo)} · ${fmtDate(s.fechaAgenda)}</div>
          </div>
          <span style="font-size:11px;font-weight:600;color:${urgente?'var(--danger)':'var(--gray-500)'};white-space:nowrap">
            ${dias === 0 ? 'Hoy' : dias === 1 ? 'Mañana' : dias < 0 ? `${Math.abs(dias)}d atrás` : `En ${dias}d`}
          </span>
        </div>`;
      }).join('')}
    </div>
  </div>

</div>

<div class="card">
  <div class="card-header">
    <span class="card-title">Prospectos Recientes</span>
    <button class="btn btn-ghost btn-sm" onclick="Router.go('prospectos')">Ver todos →</button>
  </div>
  <div class="table-wrap">
    ${prospectos.length === 0 ? `
    <div class="empty-state">
      <div class="empty-icon">👟</div>
      <h3>Sin prospectos aún</h3>
      <p>Agrega tu primer prospecto para empezar</p>
    </div>` : `
    <table>
      <thead><tr>
        <th>Nombre</th><th>Empresa</th><th>País</th><th>Tipo</th><th>Estado</th><th>Fecha</th>
      </tr></thead>
      <tbody>
        ${prospectos.slice(0,8).map(p => `
        <tr style="cursor:pointer" onclick="openDetailProspecto('${p.id}')">
          <td><div class="cell-main">${escHtml(p.nombre)}</div></td>
          <td>${escHtml(p.empresa||'—')}</td>
          <td>${escHtml(p.pais||'—')}</td>
          <td><span class="badge badge-gray">${cap(p.tipoCliente||'—')}</span></td>
          <td><span class="badge badge-${p.estado}">${cap(p.estado)}</span></td>
          <td class="text-muted">${fmtDate(p.fechaCreacion)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`}
  </div>
</div>`;
});

// ─────────────────────────────────────────────────────────────────────────────
//  VIEW: PROSPECTOS
// ─────────────────────────────────────────────────────────────────────────────
Router.register('prospectos', (params = {}) => {
  const all = DB.getProspectos();

  return `
<div class="page-header">
  <div><h2>Prospectos</h2><p>${all.length} prospectos registrados</p></div>
  <div style="display:flex;gap:8px">
    <button class="btn btn-secondary" onclick="Router.go('importar')">⬆ Importar CSV</button>
    <button class="btn btn-secondary" onclick="exportCSV()">⬇ Exportar CSV</button>
    <button class="btn btn-primary" onclick="openAddProspecto()">+ Agregar</button>
  </div>
</div>

<div class="card">
  <div class="filters-bar">
    <div class="search-input-wrap">
      <span class="search-icon">🔍</span>
      <input type="text" id="search-prospectos" placeholder="Buscar por nombre, empresa, email..." oninput="filterProspectos()" value="${escHtml(params.search||'')}">
    </div>
    <select class="filter-select" id="filter-pais" onchange="filterProspectos()">
      <option value="">Todos los países</option>
      ${PAISES_LATAM.map(p => `<option value="${escHtml(p)}">${escHtml(p)}</option>`).join('')}
    </select>
    <select class="filter-select" id="filter-tipo" onchange="filterProspectos()">
      <option value="">Todos los tipos</option>
      ${TIPOS_CLIENTE.map(t => `<option value="${t}">${cap(t)}</option>`).join('')}
    </select>
    <select class="filter-select" id="filter-estado" onchange="filterProspectos()">
      <option value="">Todos los estados</option>
      ${ESTADOS_PROSPECTO.map(e => `<option value="${e}">${cap(e)}</option>`).join('')}
    </select>
    <button class="btn btn-ghost btn-sm" onclick="clearFilters()">Limpiar</button>
  </div>
  <div id="prospectos-table-wrap" class="table-wrap">
    ${renderProspectosTable(all)}
  </div>
</div>`;
});

Router.afterRender['prospectos'] = (params) => {
  if (params.pais) document.getElementById('filter-pais').value = params.pais;
  if (params.tipo) document.getElementById('filter-tipo').value = params.tipo;
  if (params.estado) document.getElementById('filter-estado').value = params.estado;
  filterProspectos();
};

function renderProspectosTable(data) {
  if (data.length === 0) return `
    <div class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>Sin resultados</h3>
      <p>Prueba con otros filtros o agrega un nuevo prospecto</p>
    </div>`;
  return `
  <table>
    <thead><tr>
      <th>Nombre / Empresa</th>
      <th>Contacto</th>
      <th>País / Estado</th>
      <th>Tipo</th>
      <th>Estado</th>
      <th>Último contacto</th>
      <th>Acciones</th>
    </tr></thead>
    <tbody>
      ${data.map(p => `
      <tr>
        <td style="cursor:pointer" onclick="openDetailProspecto('${p.id}')">
          <div class="cell-main">${escHtml(p.nombre)}</div>
          <div class="cell-sub">${escHtml(p.empresa||'—')}</div>
        </td>
        <td>
          <div>${p.telefono ? `<a href="tel:${escHtml(p.telefono)}" style="color:inherit">${escHtml(p.telefono)}</a>` : '—'}</div>
          <div class="cell-sub">${p.email ? `<a href="mailto:${escHtml(p.email)}" style="color:var(--gray-400);font-size:12px">${escHtml(p.email)}</a>` : ''}</div>
        </td>
        <td>
          <div>${escHtml(p.pais||'—')}</div>
          <div class="cell-sub">${escHtml(p.estadoRegion||'')}</div>
        </td>
        <td><span class="badge badge-gray">${cap(p.tipoCliente||'—')}</span></td>
        <td><span class="badge badge-${p.estado}">${cap(p.estado)}</span></td>
        <td class="text-muted">${fmtDate(p.fechaUltimoContacto||p.fechaCreacion)}</td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-ghost btn-sm btn-icon" title="Ver detalle" onclick="openDetailProspecto('${p.id}')">👁</button>
            <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="openEditProspecto('${p.id}')">✏️</button>
            <button class="btn btn-ghost btn-sm btn-icon" title="Agregar seguimiento" onclick="openAddSeguimiento('${p.id}')">📅</button>
            <button class="btn btn-ghost btn-sm btn-icon" title="Eliminar" onclick="confirmDeleteProspecto('${p.id}')">🗑</button>
          </div>
        </td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

function filterProspectos() {
  const search = (document.getElementById('search-prospectos')?.value || '').toLowerCase();
  const pais   = document.getElementById('filter-pais')?.value || '';
  const tipo   = document.getElementById('filter-tipo')?.value || '';
  const estado = document.getElementById('filter-estado')?.value || '';

  let data = DB.getProspectos();
  if (search) data = data.filter(p =>
    (p.nombre||'').toLowerCase().includes(search) ||
    (p.empresa||'').toLowerCase().includes(search) ||
    (p.email||'').toLowerCase().includes(search) ||
    (p.telefono||'').toLowerCase().includes(search)
  );
  if (pais)   data = data.filter(p => p.pais === pais);
  if (tipo)   data = data.filter(p => p.tipoCliente === tipo);
  if (estado) data = data.filter(p => p.estado === estado);

  document.getElementById('prospectos-table-wrap').innerHTML = renderProspectosTable(data);
}

function clearFilters() {
  ['search-prospectos','filter-pais','filter-tipo','filter-estado'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  filterProspectos();
}

// ── EXPORT CSV ─────────────────────────────────────────────────────────────────
function exportCSV() {
  const data = DB.getProspectos();
  if (!data.length) { toast('No hay prospectos para exportar', 'error'); return; }
  const cols = ['id','nombre','empresa','telefono','email','pais','estadoRegion','tipoCliente','estado','notas','fechaCreacion','fechaUltimoContacto'];
  const header = cols.join(',');
  const rows = data.map(p => cols.map(c => `"${String(p[c]||'').replace(/"/g,'""')}"`).join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['﻿'+csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `calzame-prospectos-${today()}.csv`; a.click();
  URL.revokeObjectURL(url);
  toast(`${data.length} prospectos exportados`);
}

// ── ADD / EDIT PROSPECTO ───────────────────────────────────────────────────────
function prospecto_form_html(p = {}) {
  return `
  <div class="form-row">
    <div class="form-group">
      <label>Nombre completo *</label>
      <input type="text" id="f-nombre" value="${escHtml(p.nombre||'')}" placeholder="Ej: Juan García" required>
    </div>
    <div class="form-group">
      <label>Empresa / Negocio</label>
      <input type="text" id="f-empresa" value="${escHtml(p.empresa||'')}" placeholder="Ej: Zapatería El Buen Paso">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Teléfono / WhatsApp</label>
      <input type="tel" id="f-telefono" value="${escHtml(p.telefono||'')}" placeholder="+52 55 1234 5678">
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" id="f-email" value="${escHtml(p.email||'')}" placeholder="correo@ejemplo.com">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>País</label>
      <select id="f-pais">
        <option value="">Seleccionar...</option>
        ${PAISES_LATAM.map(c => `<option value="${c}" ${p.pais===c?'selected':''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Estado / Provincia</label>
      <input type="text" id="f-estado-region" value="${escHtml(p.estadoRegion||'')}" placeholder="Ej: Jalisco, CDMX">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Tipo de cliente</label>
      <select id="f-tipo-cliente">
        ${TIPOS_CLIENTE.map(t => `<option value="${t}" ${p.tipoCliente===t?'selected':''}>${cap(t)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Estado del prospecto</label>
      <select id="f-estado">
        ${ESTADOS_PROSPECTO.map(e => `<option value="${e}" ${(p.estado||'nuevo')===e?'selected':''}>${cap(e)}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="form-group">
    <label>Notas</label>
    <textarea id="f-notas" placeholder="Información relevante sobre el prospecto...">${escHtml(p.notas||'')}</textarea>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Fuente / Cómo llegó</label>
      <input type="text" id="f-fuente" value="${escHtml(p.fuente||'')}" placeholder="Ej: Referido, Facebook, Feria">
    </div>
    <div class="form-group">
      <label>Último contacto</label>
      <input type="date" id="f-ultimo-contacto" value="${p.fechaUltimoContacto||today()}">
    </div>
  </div>`;
}

function openAddProspecto() {
  document.getElementById('modal-prospecto-title').textContent = 'Agregar Prospecto';
  document.getElementById('modal-prospecto-body').innerHTML = prospecto_form_html();
  document.getElementById('modal-prospecto-id').value = '';
  Modal.open('modal-prospecto');
}

function openEditProspecto(id) {
  const p = DB.getProspectos().find(x => x.id === id);
  if (!p) return;
  document.getElementById('modal-prospecto-title').textContent = 'Editar Prospecto';
  document.getElementById('modal-prospecto-body').innerHTML = prospecto_form_html(p);
  document.getElementById('modal-prospecto-id').value = id;
  Modal.open('modal-prospecto');
}

function saveProspecto() {
  const nombre = document.getElementById('f-nombre').value.trim();
  if (!nombre) { toast('El nombre es obligatorio', 'error'); return; }

  const id = document.getElementById('modal-prospecto-id').value;
  const isEdit = !!id;
  const existing = isEdit ? DB.getProspectos().find(x => x.id === id) : null;

  const p = {
    id: id || uid(),
    nombre,
    empresa: document.getElementById('f-empresa').value.trim(),
    telefono: document.getElementById('f-telefono').value.trim(),
    email: document.getElementById('f-email').value.trim(),
    pais: document.getElementById('f-pais').value,
    estadoRegion: document.getElementById('f-estado-region').value.trim(),
    tipoCliente: document.getElementById('f-tipo-cliente').value,
    estado: document.getElementById('f-estado').value,
    notas: document.getElementById('f-notas').value.trim(),
    fuente: document.getElementById('f-fuente').value.trim(),
    fechaUltimoContacto: document.getElementById('f-ultimo-contacto').value,
    fechaCreacion: existing?.fechaCreacion || today(),
    fechaActualizacion: today(),
    // Future: asignadoA: null, vendedorId: null
  };

  if (isEdit) { DB.updateProspecto(p); toast('Prospecto actualizado'); }
  else { DB.addProspecto(p); toast('Prospecto agregado'); }

  Modal.close('modal-prospecto');
  if (Router.current === 'prospectos') Router.go('prospectos');
  if (Router.current === 'dashboard') Router.go('dashboard');
}

// ── DELETE PROSPECTO ───────────────────────────────────────────────────────────
function confirmDeleteProspecto(id) {
  const p = DB.getProspectos().find(x => x.id === id);
  if (!p) return;
  document.getElementById('confirm-msg').textContent = `¿Eliminar a "${p.nombre}"? Se eliminarán también sus seguimientos.`;
  document.getElementById('confirm-ok').onclick = () => {
    DB.deleteProspecto(id);
    DB.saveSeguimientos(DB.getSeguimientos().filter(s => s.prospectoId !== id));
    Modal.close('modal-confirm');
    toast('Prospecto eliminado');
    if (Router.current === 'prospectos') Router.go('prospectos');
    if (Router.current === 'dashboard') Router.go('dashboard');
  };
  Modal.open('modal-confirm');
}

// ── DETAIL PROSPECTO ───────────────────────────────────────────────────────────
function openDetailProspecto(id) {
  const p = DB.getProspectos().find(x => x.id === id);
  if (!p) return;
  const segs = DB.getSeguimientos().filter(s => s.prospectoId === id);

  document.getElementById('modal-detail-body').innerHTML = `
  <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
    <div class="avatar" style="width:48px;height:48px;font-size:18px">${initials(p.nombre)}</div>
    <div>
      <div style="font-size:18px;font-weight:700">${escHtml(p.nombre)}</div>
      <div style="font-size:13px;color:var(--gray-400)">${escHtml(p.empresa||'')}</div>
    </div>
    <span class="badge badge-${p.estado}" style="margin-left:auto">${cap(p.estado)}</span>
  </div>

  <div class="detail-section">
    <h4>Información de contacto</h4>
    <div class="detail-grid">
      <div class="detail-field"><div class="df-label">Teléfono</div><div class="df-value">${p.telefono ? `<a href="tel:${escHtml(p.telefono)}">${escHtml(p.telefono)}</a>` : '—'}</div></div>
      <div class="detail-field"><div class="df-label">Email</div><div class="df-value">${p.email ? `<a href="mailto:${escHtml(p.email)}">${escHtml(p.email)}</a>` : '—'}</div></div>
      <div class="detail-field"><div class="df-label">País</div><div class="df-value">${escHtml(p.pais||'—')}</div></div>
      <div class="detail-field"><div class="df-label">Estado/Región</div><div class="df-value">${escHtml(p.estadoRegion||'—')}</div></div>
    </div>
  </div>

  <div class="detail-section">
    <h4>Perfil comercial</h4>
    <div class="detail-grid">
      <div class="detail-field"><div class="df-label">Tipo de cliente</div><div class="df-value">${cap(p.tipoCliente||'—')}</div></div>
      <div class="detail-field"><div class="df-label">Fuente</div><div class="df-value">${escHtml(p.fuente||'—')}</div></div>
      <div class="detail-field"><div class="df-label">Registrado</div><div class="df-value">${fmtDate(p.fechaCreacion)}</div></div>
      <div class="detail-field"><div class="df-label">Último contacto</div><div class="df-value">${fmtDate(p.fechaUltimoContacto)}</div></div>
    </div>
  </div>

  ${p.notas ? `<div class="detail-section">
    <h4>Notas</h4>
    <p style="font-size:13px;color:var(--gray-600);background:var(--gray-50);padding:12px;border-radius:6px;white-space:pre-wrap">${escHtml(p.notas)}</p>
  </div>` : ''}

  <div class="detail-section">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <h4 style="margin:0">Seguimientos (${segs.length})</h4>
      <button class="btn btn-primary btn-sm" onclick="Modal.close('modal-detail');openAddSeguimiento('${p.id}')">+ Agregar</button>
    </div>
    ${segs.length === 0 ? '<p class="text-muted">Sin seguimientos registrados</p>' :
      segs.sort((a,b) => new Date(b.fechaAgenda)-new Date(a.fechaAgenda)).map(s => `
      <div class="seg-card ${s.completado?'completed':''}">
        <div class="seg-check" onclick="toggleSeguimiento('${s.id}')"></div>
        <div class="seg-body">
          <div class="seg-title">${tipoIcon(s.tipo)} ${cap(s.tipo)} · ${fmtDate(s.fechaAgenda)}</div>
          ${s.notas ? `<div class="seg-meta">${escHtml(s.notas)}</div>` : ''}
        </div>
      </div>`).join('')}
  </div>

  <div style="display:flex;gap:8px;margin-top:8px">
    <button class="btn btn-secondary" onclick="Modal.close('modal-detail');openEditProspecto('${p.id}')">Editar prospecto</button>
    <button class="btn btn-danger" onclick="Modal.close('modal-detail');confirmDeleteProspecto('${p.id}')">Eliminar</button>
  </div>`;

  Modal.open('modal-detail');
}

// ─────────────────────────────────────────────────────────────────────────────
//  VIEW: SEGUIMIENTOS
// ─────────────────────────────────────────────────────────────────────────────
Router.register('seguimientos', (params = {}) => {
  const segs = DB.getSeguimientos();
  const prospectos = DB.getProspectos();
  const pMap = {};
  prospectos.forEach(p => pMap[p.id] = p);

  return `
<div class="page-header">
  <div><h2>Seguimientos</h2><p>${segs.filter(s=>!s.completado).length} pendientes</p></div>
  <button class="btn btn-primary" onclick="openAddSeguimiento()">+ Agregar Seguimiento</button>
</div>

<div class="tabs">
  <button class="tab-btn active" id="tab-pendientes" onclick="switchSegTab('pendientes')">Pendientes (${segs.filter(s=>!s.completado).length})</button>
  <button class="tab-btn" id="tab-completados" onclick="switchSegTab('completados')">Completados (${segs.filter(s=>s.completado).length})</button>
  <button class="tab-btn" id="tab-todos" onclick="switchSegTab('todos')">Todos (${segs.length})</button>
</div>

<div id="seg-list">
  ${renderSeguimientosList(segs.filter(s=>!s.completado), pMap)}
</div>`;
});

function renderSeguimientosList(segs, pMap) {
  if (!segs.length) return `<div class="empty-state"><div class="empty-icon">✅</div><h3>Sin seguimientos aquí</h3><p>Todo en orden</p></div>`;
  const sorted = [...segs].sort((a,b) => new Date(a.fechaAgenda)-new Date(b.fechaAgenda));
  return sorted.map(s => {
    const p = pMap[s.prospectoId];
    const dias = daysFromNow(s.fechaAgenda);
    const urgente = !s.completado && dias !== null && dias <= 0;
    return `
    <div class="seg-card ${s.completado?'completed':''}" ${urgente?'style="border-color:#f87171;background:#fff8f8"':''}>
      <div class="seg-check" onclick="toggleSeguimiento('${s.id}')"></div>
      <div class="seg-body">
        <div class="seg-title">
          ${tipoIcon(s.tipo)} <strong>${cap(s.tipo)}</strong>
          ${p ? `· <span style="cursor:pointer;text-decoration:underline" onclick="openDetailProspecto('${p.id}')">${escHtml(p.nombre)}</span>` : ''}
        </div>
        <div class="seg-meta">
          📅 ${fmtDate(s.fechaAgenda)}
          ${s.completado ? ' · ✓ Completado' : dias !== null ? ` · ${dias===0?'<strong style="color:var(--warning)">Hoy</strong>':dias<0?`<strong style="color:var(--danger)">${Math.abs(dias)}d atrás</strong>`:`En ${dias}d`}` : ''}
          ${p ? ` · ${escHtml(p.pais||'')}` : ''}
        </div>
        ${s.notas ? `<div style="font-size:12px;color:var(--gray-500);margin-top:4px">${escHtml(s.notas)}</div>` : ''}
        ${s.resultado ? `<div style="font-size:12px;color:var(--success);margin-top:3px">Resultado: ${escHtml(s.resultado)}</div>` : ''}
      </div>
      <div class="seg-actions">
        <button class="btn btn-ghost btn-sm btn-icon" onclick="openEditSeguimiento('${s.id}')" title="Editar">✏️</button>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteSeguimiento('${s.id}')" title="Eliminar">🗑</button>
      </div>
    </div>`;
  }).join('');
}

function switchSegTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  const segs = DB.getSeguimientos();
  const pMap = {};
  DB.getProspectos().forEach(p => pMap[p.id] = p);
  let filtered = segs;
  if (tab === 'pendientes') filtered = segs.filter(s => !s.completado);
  if (tab === 'completados') filtered = segs.filter(s => s.completado);
  document.getElementById('seg-list').innerHTML = renderSeguimientosList(filtered, pMap);
}

function tipoIcon(tipo) {
  const icons = { llamada:'📞', whatsapp:'💬', email:'✉️', reunión:'🤝', visita:'🚶', otro:'📌' };
  return icons[tipo] || '📌';
}

function toggleSeguimiento(id) {
  const s = DB.getSeguimientos().find(x => x.id === id);
  if (!s) return;
  s.completado = !s.completado;
  s.fechaCompletado = s.completado ? today() : null;
  DB.updateSeguimiento(s);
  // update prospecto last contact
  if (s.completado) {
    const p = DB.getProspectos().find(x => x.id === s.prospectoId);
    if (p) { p.fechaUltimoContacto = today(); DB.updateProspecto(p); }
  }
  if (Router.current === 'seguimientos') Router.go('seguimientos');
  if (Router.current === 'dashboard') Router.go('dashboard');
  updateNavBadges();
  toast(s.completado ? 'Seguimiento completado ✓' : 'Marcado como pendiente');
}

function seguimiento_form_html(s = {}, prospectoIdPre = null) {
  const prospectos = DB.getProspectos();
  const pid = s.prospectoId || prospectoIdPre || '';
  return `
  <div class="form-group">
    <label>Prospecto *</label>
    <select id="fs-prospecto" required>
      <option value="">Seleccionar prospecto...</option>
      ${prospectos.map(p => `<option value="${p.id}" ${pid===p.id?'selected':''}>${escHtml(p.nombre)}${p.empresa?` (${escHtml(p.empresa)})`:''}</option>`).join('')}
    </select>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Tipo de seguimiento</label>
      <select id="fs-tipo">
        ${TIPOS_SEGUIMIENTO.map(t => `<option value="${t}" ${(s.tipo||'llamada')===t?'selected':''}>${cap(t)} ${tipoIcon(t)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Fecha programada</label>
      <input type="date" id="fs-fecha" value="${s.fechaAgenda||today()}" required>
    </div>
  </div>
  <div class="form-group">
    <label>Notas / Objetivo</label>
    <textarea id="fs-notas" placeholder="¿Qué vas a tratar en este seguimiento?">${escHtml(s.notas||'')}</textarea>
  </div>
  ${s.id ? `<div class="form-group">
    <label>Resultado (si ya se realizó)</label>
    <textarea id="fs-resultado" placeholder="¿Cómo resultó?">${escHtml(s.resultado||'')}</textarea>
  </div>` : '<input type="hidden" id="fs-resultado" value="">'}`;
}

function openAddSeguimiento(prospectoId = null) {
  document.getElementById('modal-seg-title').textContent = 'Agregar Seguimiento';
  document.getElementById('modal-seg-body').innerHTML = seguimiento_form_html({}, prospectoId);
  document.getElementById('modal-seg-id').value = '';
  Modal.open('modal-seguimiento');
}

function openEditSeguimiento(id) {
  const s = DB.getSeguimientos().find(x => x.id === id);
  if (!s) return;
  document.getElementById('modal-seg-title').textContent = 'Editar Seguimiento';
  document.getElementById('modal-seg-body').innerHTML = seguimiento_form_html(s);
  document.getElementById('modal-seg-id').value = id;
  Modal.open('modal-seguimiento');
}

function saveSeguimiento() {
  const prospectoId = document.getElementById('fs-prospecto').value;
  if (!prospectoId) { toast('Selecciona un prospecto', 'error'); return; }
  const fecha = document.getElementById('fs-fecha').value;
  if (!fecha) { toast('La fecha es obligatoria', 'error'); return; }

  const id = document.getElementById('modal-seg-id').value;
  const isEdit = !!id;

  const s = {
    id: id || uid(),
    prospectoId,
    tipo: document.getElementById('fs-tipo').value,
    fechaAgenda: fecha,
    notas: document.getElementById('fs-notas').value.trim(),
    resultado: document.getElementById('fs-resultado').value.trim(),
    completado: isEdit ? (DB.getSeguimientos().find(x=>x.id===id)?.completado||false) : false,
    fechaCreacion: isEdit ? (DB.getSeguimientos().find(x=>x.id===id)?.fechaCreacion||today()) : today(),
  };

  if (isEdit) { DB.updateSeguimiento(s); toast('Seguimiento actualizado'); }
  else { DB.addSeguimiento(s); toast('Seguimiento agregado'); }

  Modal.close('modal-seguimiento');
  if (Router.current === 'seguimientos') Router.go('seguimientos');
  if (Router.current === 'dashboard') Router.go('dashboard');
  updateNavBadges();
}

function confirmDeleteSeguimiento(id) {
  document.getElementById('confirm-msg').textContent = '¿Eliminar este seguimiento?';
  document.getElementById('confirm-ok').onclick = () => {
    DB.deleteSeguimiento(id);
    Modal.close('modal-confirm');
    toast('Seguimiento eliminado');
    if (Router.current === 'seguimientos') Router.go('seguimientos');
    updateNavBadges();
  };
  Modal.open('modal-confirm');
}

// ─────────────────────────────────────────────────────────────────────────────
//  VIEW: PLANTILLAS
// ─────────────────────────────────────────────────────────────────────────────
Router.register('plantillas', () => {
  const plantillas = DB.getPlantillas();
  return `
<div class="page-header">
  <div><h2>Plantillas de Mensajes</h2><p>${plantillas.length} plantillas guardadas</p></div>
  <button class="btn btn-primary" onclick="openAddPlantilla()">+ Nueva Plantilla</button>
</div>

<div class="tabs">
  <button class="tab-btn active" id="tab-all-tpl" onclick="filterPlantillas('')">Todas</button>
  ${CATEGORIAS_TPL.map(c=>`<button class="tab-btn" id="tab-${c}" onclick="filterPlantillas('${c}')">${cap(c)}</button>`).join('')}
</div>

<div id="plantillas-list">
  ${renderPlantillasList(plantillas)}
</div>`;
});

function renderPlantillasList(data) {
  if (!data.length) return `<div class="empty-state"><div class="empty-icon">📝</div><h3>Sin plantillas</h3><p>Crea una plantilla para reutilizar mensajes</p></div>`;
  return data.map(t => `
  <div class="tpl-card">
    <div class="tpl-header">
      <span class="tpl-name">${escHtml(t.nombre)}</span>
      <div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="copyPlantilla('${t.id}')">📋 Copiar</button>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="openEditPlantilla('${t.id}')">✏️</button>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeletePlantilla('${t.id}')">🗑</button>
      </div>
    </div>
    <div class="tpl-tags">
      <span class="badge badge-gray">${cap(t.categoria)}</span>
      <span class="badge badge-black">${cap(t.canal)} ${canalIcon(t.canal)}</span>
    </div>
    <div class="tpl-content">${escHtml(t.contenido)}</div>
  </div>`).join('');
}

function canalIcon(canal) {
  return { whatsapp:'💬', email:'✉️', llamada:'📞' }[canal] || '';
}

function filterPlantillas(cat) {
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(cat ? `tab-${cat}` : 'tab-all-tpl')?.classList.add('active');
  let data = DB.getPlantillas();
  if (cat) data = data.filter(t => t.categoria === cat);
  document.getElementById('plantillas-list').innerHTML = renderPlantillasList(data);
}

function plantilla_form_html(t = {}) {
  return `
  <div class="form-group">
    <label>Nombre de la plantilla *</label>
    <input type="text" id="ft-nombre" value="${escHtml(t.nombre||'')}" placeholder="Ej: Primer contacto mayorista">
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Categoría</label>
      <select id="ft-categoria">
        ${CATEGORIAS_TPL.map(c=>`<option value="${c}" ${(t.categoria||'presentación')===c?'selected':''}>${cap(c)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Canal</label>
      <select id="ft-canal">
        ${CANALES_TPL.map(c=>`<option value="${c}" ${(t.canal||'whatsapp')===c?'selected':''}>${cap(c)} ${canalIcon(c)}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="form-group">
    <label>Contenido del mensaje *</label>
    <textarea id="ft-contenido" style="min-height:160px" placeholder="Escribe el mensaje aquí. Puedes usar variables como {{nombre}}, {{empresa}}, {{producto}}...">${escHtml(t.contenido||'')}</textarea>
    <div class="form-hint">Variables disponibles: {{nombre}}, {{empresa}}, {{telefono}}, {{producto}}</div>
  </div>`;
}

function openAddPlantilla() {
  document.getElementById('modal-tpl-title').textContent = 'Nueva Plantilla';
  document.getElementById('modal-tpl-body').innerHTML = plantilla_form_html();
  document.getElementById('modal-tpl-id').value = '';
  Modal.open('modal-plantilla');
}

function openEditPlantilla(id) {
  const t = DB.getPlantillas().find(x => x.id === id);
  if (!t) return;
  document.getElementById('modal-tpl-title').textContent = 'Editar Plantilla';
  document.getElementById('modal-tpl-body').innerHTML = plantilla_form_html(t);
  document.getElementById('modal-tpl-id').value = id;
  Modal.open('modal-plantilla');
}

function savePlantilla() {
  const nombre = document.getElementById('ft-nombre').value.trim();
  const contenido = document.getElementById('ft-contenido').value.trim();
  if (!nombre) { toast('El nombre es obligatorio', 'error'); return; }
  if (!contenido) { toast('El contenido es obligatorio', 'error'); return; }

  const id = document.getElementById('modal-tpl-id').value;
  const isEdit = !!id;

  const t = {
    id: id || uid(),
    nombre,
    categoria: document.getElementById('ft-categoria').value,
    canal: document.getElementById('ft-canal').value,
    contenido,
    fechaCreacion: isEdit ? (DB.getPlantillas().find(x=>x.id===id)?.fechaCreacion||today()) : today(),
  };

  if (isEdit) { DB.updatePlantilla(t); toast('Plantilla actualizada'); }
  else { DB.addPlantilla(t); toast('Plantilla creada'); }

  Modal.close('modal-plantilla');
  Router.go('plantillas');
}

function copyPlantilla(id) {
  const t = DB.getPlantillas().find(x => x.id === id);
  if (!t) return;
  navigator.clipboard.writeText(t.contenido).then(() => toast('Copiado al portapapeles ✓')).catch(() => {
    // fallback
    const el = document.createElement('textarea');
    el.value = t.contenido; document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
    toast('Copiado al portapapeles ✓');
  });
}

function confirmDeletePlantilla(id) {
  document.getElementById('confirm-msg').textContent = '¿Eliminar esta plantilla?';
  document.getElementById('confirm-ok').onclick = () => {
    DB.deletePlantilla(id);
    Modal.close('modal-confirm');
    toast('Plantilla eliminada');
    Router.go('plantillas');
  };
  Modal.open('modal-confirm');
}

// ─────────────────────────────────────────────────────────────────────────────
//  VIEW: IMPORTAR
// ─────────────────────────────────────────────────────────────────────────────
Router.register('importar', () => `
<div class="page-header">
  <div><h2>Importar Datos</h2><p>Sube un archivo CSV o Excel para importar prospectos</p></div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">

  <div class="card">
    <div class="card-header"><span class="card-title">Subir archivo</span></div>
    <div class="card-body">
      <div class="drop-zone" id="drop-zone" onclick="document.getElementById('file-input').click()">
        <div class="drop-icon">📂</div>
        <h3>Haz clic o arrastra tu archivo aquí</h3>
        <p>Soporta CSV y Excel (.csv, .xlsx, .xls)</p>
      </div>
      <input type="file" id="file-input" accept=".csv,.xlsx,.xls" style="display:none" onchange="handleFileSelect(this)">
      <div id="import-status" style="margin-top:12px"></div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><span class="card-title">Formato esperado</span></div>
    <div class="card-body">
      <p style="font-size:13px;color:var(--gray-600);margin-bottom:12px">El archivo debe tener una fila de encabezados. Las columnas reconocidas son:</p>
      <table style="width:100%;font-size:12px">
        <thead><tr><th>Columna CSV</th><th>Campo</th><th></th></tr></thead>
        <tbody>
          <tr><td>nombre / name</td><td>Nombre completo</td><td style="color:var(--danger)">*req</td></tr>
          <tr><td>empresa / company</td><td>Empresa</td><td></td></tr>
          <tr><td>telefono / phone</td><td>Teléfono</td><td></td></tr>
          <tr><td>email</td><td>Email</td><td></td></tr>
          <tr><td>pais / country</td><td>País</td><td></td></tr>
          <tr><td>estado / state / region</td><td>Estado/Región</td><td></td></tr>
          <tr><td>tipo / tipo_cliente</td><td>Tipo de cliente</td><td></td></tr>
          <tr><td>notas / notes</td><td>Notas</td><td></td></tr>
        </tbody>
      </table>
      <div style="margin-top:14px">
        <button class="btn btn-secondary btn-sm" onclick="downloadTemplate()">⬇ Descargar plantilla CSV</button>
      </div>
    </div>
  </div>

</div>

<div id="import-preview"></div>
`);

Router.afterRender['importar'] = () => {
  const dz = document.getElementById('drop-zone');
  if (!dz) return;
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('over'));
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('over');
    const file = e.dataTransfer.files[0];
    if (file) processImportFile(file);
  });
};

function handleFileSelect(input) {
  if (input.files[0]) processImportFile(input.files[0]);
}

function processImportFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const status = document.getElementById('import-status');
  status.innerHTML = `<p style="font-size:13px;color:var(--gray-500)">Procesando <strong>${escHtml(file.name)}</strong>...</p>`;

  if (ext === 'csv') {
    const reader = new FileReader();
    reader.onload = e => parseCSVImport(e.target.result);
    reader.readAsText(file, 'UTF-8');
  } else if (ext === 'xlsx' || ext === 'xls') {
    const reader = new FileReader();
    reader.onload = e => parseXLSXImport(e.target.result);
    reader.readAsArrayBuffer(file);
  } else {
    status.innerHTML = `<p style="color:var(--danger)">Formato no soportado. Usa CSV o Excel.</p>`;
  }
}

function parseCSVImport(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) { document.getElementById('import-status').innerHTML = '<p style="color:var(--danger)">Archivo vacío o sin datos</p>'; return; }

  const rawHeader = lines[0].split(',').map(h => h.replace(/^"|"$/g,'').trim().toLowerCase());
  const rows = lines.slice(1).map(line => {
    const cols = parseCSVLine(line);
    const obj = {};
    rawHeader.forEach((h,i) => obj[h] = (cols[i]||'').replace(/^"|"$/g,'').trim());
    return obj;
  }).filter(r => Object.values(r).some(v=>v));

  showImportPreview(rows);
}

function parseCSVLine(line) {
  const result = []; let cur = ''; let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; }
    else if (ch === ',' && !inQ) { result.push(cur); cur = ''; }
    else { cur += ch; }
  }
  result.push(cur);
  return result;
}

function parseXLSXImport(buffer) {
  // Simple XLSX parser — reads first sheet using a minimal approach
  // For production: use SheetJS (xlsx npm) loaded via CDN
  try {
    if (typeof XLSX !== 'undefined') {
      const wb = XLSX.read(buffer, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
      const normalized = data.map(row => {
        const n = {};
        Object.keys(row).forEach(k => n[k.toLowerCase()] = String(row[k]||'').trim());
        return n;
      });
      showImportPreview(normalized);
    } else {
      document.getElementById('import-status').innerHTML = `
        <p style="color:var(--warning)">Para importar Excel, convierte tu archivo a CSV primero, o exporta desde Excel como CSV.</p>
        <button class="btn btn-secondary btn-sm mt-16" onclick="document.getElementById('file-input').click()">Seleccionar CSV</button>`;
    }
  } catch(e) {
    document.getElementById('import-status').innerHTML = '<p style="color:var(--danger)">Error al leer el archivo Excel. Intenta con CSV.</p>';
  }
}

const COL_MAP = {
  nombre:['nombre','name','nombres','nombre completo','full name','contacto'],
  empresa:['empresa','company','negocio','business','razón social'],
  telefono:['telefono','teléfono','phone','tel','celular','whatsapp','móvil'],
  email:['email','correo','mail','e-mail'],
  pais:['pais','país','country','paises'],
  estadoRegion:['estado','state','region','región','provincia','city','ciudad'],
  tipoCliente:['tipo','tipo_cliente','type','cliente','tipo cliente'],
  notas:['notas','notes','comentarios','observaciones','nota'],
};

function mapCol(headers, field) {
  const aliases = COL_MAP[field] || [field];
  for (const alias of aliases) {
    const found = headers.find(h => h === alias || h.includes(alias));
    if (found) return found;
  }
  return null;
}

let _importRows = [];

function showImportPreview(rows) {
  if (!rows.length) {
    document.getElementById('import-status').innerHTML = '<p style="color:var(--danger)">No se encontraron datos en el archivo</p>';
    return;
  }

  const headers = Object.keys(rows[0]);
  const mapping = {};
  Object.keys(COL_MAP).forEach(field => { mapping[field] = mapCol(headers, field); });

  _importRows = rows;

  const validCount = rows.filter(r => {
    const nk = mapping.nombre;
    return nk && (r[nk]||'').trim();
  }).length;

  document.getElementById('import-status').innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--gray-50);border-radius:6px;font-size:13px">
      <span style="color:var(--success);font-size:16px">✓</span>
      <span>Archivo leído: <strong>${rows.length}</strong> filas, <strong>${validCount}</strong> con nombre válido</span>
    </div>`;

  document.getElementById('import-preview').innerHTML = `
  <div class="card">
    <div class="card-header">
      <span class="card-title">Vista previa — ${Math.min(rows.length, 5)} de ${rows.length} filas</span>
      <button class="btn btn-primary" onclick="executeImport()">⬆ Importar ${validCount} prospectos</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr>
          ${Object.keys(COL_MAP).map(f=>`<th>${cap(f.replace(/([A-Z])/g,' $1'))}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${rows.slice(0,5).map(r=>`<tr>${Object.keys(COL_MAP).map(f=>{
            const col = mapping[f];
            return `<td>${escHtml(col ? r[col]||'' : '—')}</td>`;
          }).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="padding:12px 16px;font-size:12px;color:var(--gray-400)">
      Mostrando las primeras 5 filas. Se importarán los ${validCount} prospectos con nombre válido.
      Los duplicados exactos (mismo email) serán omitidos.
    </div>
  </div>`;
}

function executeImport() {
  if (!_importRows.length) return;
  const headers = Object.keys(_importRows[0]);
  const mapping = {};
  Object.keys(COL_MAP).forEach(field => { mapping[field] = mapCol(headers, field); });

  const existing = DB.getProspectos();
  const existingEmails = new Set(existing.map(p => p.email).filter(Boolean));

  let added = 0, skipped = 0;
  _importRows.forEach(row => {
    const nombre = (mapping.nombre ? row[mapping.nombre] : '') || '';
    if (!nombre.trim()) { skipped++; return; }
    const email = (mapping.email ? row[mapping.email] : '') || '';
    if (email && existingEmails.has(email)) { skipped++; return; }

    const p = {
      id: uid(),
      nombre: nombre.trim(),
      empresa: (mapping.empresa ? row[mapping.empresa] : '') || '',
      telefono: (mapping.telefono ? row[mapping.telefono] : '') || '',
      email: email.trim(),
      pais: (mapping.pais ? row[mapping.pais] : '') || '',
      estadoRegion: (mapping.estadoRegion ? row[mapping.estadoRegion] : '') || '',
      tipoCliente: (mapping.tipoCliente ? row[mapping.tipoCliente] : '') || 'otro',
      estado: 'nuevo',
      notas: (mapping.notas ? row[mapping.notas] : '') || '',
      fechaCreacion: today(),
      fechaActualizacion: today(),
      fuente: 'Importación CSV',
    };

    DB.addProspecto(p);
    if (email) existingEmails.add(email);
    added++;
  });

  _importRows = [];
  document.getElementById('import-preview').innerHTML = '';
  document.getElementById('import-status').innerHTML = `
    <div style="padding:12px;background:#e8f8f0;border-radius:6px;font-size:13px;color:var(--success)">
      ✓ Importación completa: <strong>${added}</strong> prospectos agregados, ${skipped} omitidos (sin nombre o duplicados)
    </div>`;
  document.getElementById('file-input').value = '';
  toast(`${added} prospectos importados`);
  updateNavBadges();
}

function downloadTemplate() {
  const csv = 'nombre,empresa,telefono,email,pais,estado,tipo_cliente,notas\nJuan García,Zapatería El Buen Paso,+52 55 1234 5678,juan@ejemplo.com,México,Jalisco,mayorista,"Interesado en colección de otoño"';
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'calzame-plantilla-importacion.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
//  SAMPLE DATA (solo si no hay nada guardado)
// ─────────────────────────────────────────────────────────────────────────────
function seedData() {
  if (DB.getProspectos().length > 0) return;

  const prospectos = [
    { id:uid(), nombre:'María López', empresa:'Calzado Roma', telefono:'+52 33 9876 5432', email:'maria@calzadoroma.mx', pais:'México', estadoRegion:'Jalisco', tipoCliente:'mayorista', estado:'interesado', notas:'Pidió catálogo de temporada otoño-invierno', fuente:'Feria de Calzado GDL', fechaCreacion:today(), fechaActualizacion:today(), fechaUltimoContacto:today() },
    { id:uid(), nombre:'Carlos Mendez', empresa:'Boutique Trends', telefono:'+57 300 123 4567', email:'carlos@trends.co', pais:'Colombia', estadoRegion:'Bogotá', tipoCliente:'minorista', estado:'propuesta', notas:'Enviar propuesta para 50 pares', fuente:'Instagram', fechaCreacion:today(), fechaActualizacion:today(), fechaUltimoContacto:today() },
    { id:uid(), nombre:'Ana Torres', empresa:'Distribuidora Sur', telefono:'+54 11 5555 0000', email:'ana@distrisur.ar', pais:'Argentina', estadoRegion:'Buenos Aires', tipoCliente:'distribuidor', estado:'nuevo', notas:'', fuente:'Referido', fechaCreacion:today(), fechaActualizacion:today(), fechaUltimoContacto:today() },
    { id:uid(), nombre:'Roberto Sánchez', empresa:'Zapatos Premium', telefono:'+52 55 6789 0123', email:'roberto@zpremium.mx', pais:'México', estadoRegion:'CDMX', tipoCliente:'minorista', estado:'cerrado', notas:'Primer pedido de 120 pares enviado', fuente:'Llamada en frío', fechaCreacion:today(), fechaActualizacion:today(), fechaUltimoContacto:today() },
    { id:uid(), nombre:'Linda Castro', empresa:'Fashion House', telefono:'+56 9 1234 5678', email:'linda@fashionhouse.cl', pais:'Chile', estadoRegion:'Santiago', tipoCliente:'mayorista', estado:'contactado', notas:'Llamar la próxima semana', fuente:'LinkedIn', fechaCreacion:today(), fechaActualizacion:today(), fechaUltimoContacto:today() },
  ];

  prospectos.forEach(p => DB.addProspecto(p));

  DB.addSeguimiento({ id:uid(), prospectoId:prospectos[0].id, tipo:'whatsapp', fechaAgenda:today(), notas:'Enviar catálogo y lista de precios', completado:false, fechaCreacion:today() });
  DB.addSeguimiento({ id:uid(), prospectoId:prospectos[1].id, tipo:'email', fechaAgenda:today(), notas:'Hacer seguimiento a la propuesta enviada', completado:false, fechaCreacion:today() });
  DB.addSeguimiento({ id:uid(), prospectoId:prospectos[4].id, tipo:'llamada', fechaAgenda:today(), notas:'Primera llamada de presentación', completado:false, fechaCreacion:today() });

  DB.addPlantilla({ id:uid(), nombre:'Primer contacto', categoria:'presentación', canal:'whatsapp', contenido:'Hola {{nombre}}, soy de Calzame AI 👟\n\nTe contacto porque creo que nuestro calzado puede ser una excelente oportunidad para {{empresa}}.\n\n¿Tienes 5 minutos para conocer nuestra propuesta?\n\nSaludos', fechaCreacion:today() });
  DB.addPlantilla({ id:uid(), nombre:'Seguimiento propuesta', categoria:'seguimiento', canal:'whatsapp', contenido:'Hola {{nombre}}, ¿cómo estás? 🤝\n\nTe escribo para dar seguimiento a la propuesta que te enviamos.\n\n¿Pudiste revisarla? ¿Tienes alguna duda o comentario?\n\nQuedo atento.\n\nSaludos', fechaCreacion:today() });
  DB.addPlantilla({ id:uid(), nombre:'Envío de catálogo', categoria:'presentación', canal:'email', contenido:'Estimado/a {{nombre}},\n\nAdjunto nuestro catálogo de la nueva temporada con los mejores modelos de calzado para {{empresa}}.\n\nPrecios especiales para pedidos desde 24 pares.\n\nNo dude en contactarme para cualquier consulta.\n\nAtentamente,\nEquipo Calzame AI', fechaCreacion:today() });
}

// ─────────────────────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // wire nav clicks
  document.querySelectorAll('.nav-item[data-view]').forEach(el => {
    el.addEventListener('click', () => Router.go(el.dataset.view));
  });

  // close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) Modal.closeTop(); });
  });

  // seed demo data
  seedData();

  // start
  Router.go('dashboard');
  updateNavBadges();
});
