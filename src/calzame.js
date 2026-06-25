// CALZAME AI v2 — Parte 1: Config + Data Layer
'use strict';

const KEYS = {
  prospectos: 'calzame_prospectos',
  seguimientos: 'calzame_seguimientos',
  plantillas: 'calzame_plantillas',
  paises: 'calzame_paises',
  empresas: 'calzame_empresas',
};

const ESTADOS_PROSPECTO = ['nuevo','contactado','interesado','propuesta','cerrado','perdido'];
const TIPOS_CLIENTE = ['minorista','mayorista','distribuidor','representante','otro'];
const TIPOS_SEGUIMIENTO = ['llamada','whatsapp','email','reunión','visita'];
const CATEGORIAS_TPL = ['presentación','seguimiento','propuesta','cierre','otro'];
const CANALES_TPL = ['whatsapp','email','llamada'];
const NIVELES_OP = ['muy_alta','alta','media','baja','bloqueada'];
const DIFICULTADES = ['fácil','moderada','difícil','muy_difícil'];
const TIPOS_EMPRESA = ['cadena','distribuidor','importador','mayorista','tienda_dept','mercado','otro'];
const ETAPAS_EMPRESA = ['identificada','investigando','contactada','en_negociacion','ganada','descartada'];
const POTENCIALES = ['muy_alto','alto','medio','bajo'];

const PAISES_LATAM = [
  'México','Colombia','Argentina','Chile','Perú','Ecuador','Bolivia','Venezuela',
  'Uruguay','Paraguay','Guatemala','Honduras','El Salvador','Nicaragua','Costa Rica',
  'Panamá','Cuba','República Dominicana','Puerto Rico','España','Estados Unidos','Otro'
];

const COLORES_ESTADO = {
  nuevo:'#3b82f6', contactado:'#f59e0b', interesado:'#8b5cf6',
  propuesta:'#ec4899', cerrado:'#10b981', perdido:'#6b7280'
};

const OP_LABELS = {
  muy_alta: 'Muy Alta', alta: 'Alta', media: 'Media', baja: 'Baja', bloqueada: 'Bloqueada'
};

const DIF_LABELS = {
  fácil: 'Fácil', moderada: 'Moderada', difícil: 'Difícil', muy_difícil: 'Muy Difícil'
};

const TIPO_EMP_LABELS = {
  cadena:'Cadena de Tiendas', distribuidor:'Distribuidor', importador:'Importador',
  mayorista:'Mayorista', tienda_dept:'Tienda Departamental', mercado:'Mercado Mayorista', otro:'Otro'
};

const ETAPA_LABELS = {
  identificada:'Identificada', investigando:'Investigando', contactada:'Contactada',
  en_negociacion:'En Negociación', ganada:'Ganada', descartada:'Descartada'
};

// ── DATA LAYER ────────────────────────────────────────────────────────────────
const DB = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } },
  set(key, data) { localStorage.setItem(key, JSON.stringify(data)); },

  getProspectos()      { return DB.get(KEYS.prospectos); },
  saveProspectos(d)    { DB.set(KEYS.prospectos, d); },
  addProspecto(p)      { const d = DB.getProspectos(); d.unshift(p); DB.saveProspectos(d); },
  updateProspecto(p)   { DB.saveProspectos(DB.getProspectos().map(x => x.id === p.id ? p : x)); },
  deleteProspecto(id)  { DB.saveProspectos(DB.getProspectos().filter(x => x.id !== id)); },

  getSeguimientos()    { return DB.get(KEYS.seguimientos); },
  saveSeguimientos(d)  { DB.set(KEYS.seguimientos, d); },
  addSeguimiento(s)    { const d = DB.getSeguimientos(); d.unshift(s); DB.saveSeguimientos(d); },
  updateSeguimiento(s) { DB.saveSeguimientos(DB.getSeguimientos().map(x => x.id === s.id ? s : x)); },
  deleteSeguimiento(id){ DB.saveSeguimientos(DB.getSeguimientos().filter(x => x.id !== id)); },

  getPlantillas()      { return DB.get(KEYS.plantillas); },
  savePlantillas(d)    { DB.set(KEYS.plantillas, d); },
  addPlantilla(t)      { const d = DB.getPlantillas(); d.unshift(t); DB.savePlantillas(d); },
  updatePlantilla(t)   { DB.savePlantillas(DB.getPlantillas().map(x => x.id === t.id ? t : x)); },
  deletePlantilla(id)  { DB.savePlantillas(DB.getPlantillas().filter(x => x.id !== id)); },

  getPaises()          { return DB.get(KEYS.paises); },
  savePaises(d)        { DB.set(KEYS.paises, d); },
  addPais(p)           { const d = DB.getPaises(); d.push(p); DB.savePaises(d); },
  updatePais(p)        { DB.savePaises(DB.getPaises().map(x => x.id === p.id ? p : x)); },
  deletePais(id)       { DB.savePaises(DB.getPaises().filter(x => x.id !== id)); },

  getEmpresas()        { return DB.get(KEYS.empresas); },
  saveEmpresas(d)      { DB.set(KEYS.empresas, d); },
  addEmpresa(e)        { const d = DB.getEmpresas(); d.unshift(e); DB.saveEmpresas(d); },
  updateEmpresa(e)     { DB.saveEmpresas(DB.getEmpresas().map(x => x.id === e.id ? e : x)); },
  deleteEmpresa(id)    { DB.saveEmpresas(DB.getEmpresas().filter(x => x.id !== id)); },
};

// ── UTILITIES ─────────────────────────────────────────────────────────────────
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function today() { return new Date().toISOString().split('T')[0]; }
function fmtDate(iso) { if (!iso) return '—'; const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}`; }
function cap(str) { if (!str) return '—'; return str.charAt(0).toUpperCase() + str.slice(1); }
function initials(name) { if (!name) return '?'; return name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
function escHtml(str) { return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function daysFromNow(iso) { if (!iso) return null; return Math.ceil((new Date(iso) - new Date(today())) / 86400000); }
function fmtUSD(n) { if (!n) return '—'; return '$' + Number(n).toLocaleString('en-US'); }
function tipoIcon(tipo) { return {llamada:'📞',whatsapp:'💬',email:'✉️',reunión:'🤝',visita:'🚶',otro:'📌'}[tipo]||'📌'; }
function canalIcon(c) { return {whatsapp:'💬',email:'✉️',llamada:'📞'}[c]||''; }
function empresaTipoIcon(t) { return {cadena:'🏬',distribuidor:'🚛',importador:'📦',mayorista:'🏭',tienda_dept:'🛍',mercado:'🏪',otro:'🏢'}[t]||'🏢'; }

// ── TOAST ─────────────────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => { el.classList.add('hiding'); setTimeout(() => el.remove(), 200); }, 3000);
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
const Modal = {
  _stack: [],
  open(id) {
    const el = document.getElementById(id); if (!el) return;
    el.classList.add('open'); Modal._stack.push(id); document.body.style.overflow = 'hidden';
  },
  close(id) {
    const el = document.getElementById(id); if (!el) return;
    el.classList.remove('open'); Modal._stack = Modal._stack.filter(x=>x!==id);
    if (!Modal._stack.length) document.body.style.overflow = '';
  },
  closeTop() { if (Modal._stack.length) Modal.close(Modal._stack[Modal._stack.length-1]); }
};

// ── ROUTER ────────────────────────────────────────────────────────────────────
const Router = {
  current: 'dashboard', params: {},
  views: {}, afterRender: {},
  register(name, fn) { Router.views[name] = fn; },
  go(name, params = {}) {
    Router.current = name; Router.params = params;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === name));
    const content = document.getElementById('view-content');
    const view = Router.views[name];
    if (view) {
      content.innerHTML = view(params);
      const titles = { dashboard:'Dashboard', mapa:'Mapa Comercial Latinoamérica', empresas:'Empresas Objetivo', prospectos:'Prospectos', seguimientos:'Seguimientos', plantillas:'Plantillas', importar:'Importar / Exportar' };
      document.querySelector('.topbar-title').textContent = titles[name] || 'Calzame AI';
      if (Router.afterRender[name]) Router.afterRender[name](params);
    }
    updateNavBadges();
  }
};

function updateNavBadges() {
  const pending = DB.getSeguimientos().filter(s => !s.completado).length;
  const badge = document.getElementById('badge-seguimientos');
  if (badge) { badge.textContent = pending||''; badge.style.display = pending ? '' : 'none'; }
  const empCount = DB.getEmpresas().length;
  const badgeEmp = document.getElementById('badge-empresas');
  if (badgeEmp) { badgeEmp.textContent = empCount||''; badgeEmp.style.display = empCount ? '' : 'none'; }
}
// CALZAME AI v2 — Parte 2: Dashboard + Mapa Comercial + Empresas Objetivo

// ─────────────────────────────────────────────────────────────────────────────
//  DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
Router.register('dashboard', () => {
  const pros   = DB.getProspectos();
  const segs   = DB.getSeguimientos();
  const emps   = DB.getEmpresas();
  const paises = DB.getPaises();
  const hoy    = today();

  const pendientes = segs.filter(s => !s.completado).length;
  const altaPot    = emps.filter(e => e.potencial === 'muy_alto' || e.potencial === 'alto').length;
  const muyAlta    = paises.filter(p => p.nivelOportunidad === 'muy_alta' || p.nivelOportunidad === 'alta').length;

  const proxSegs = segs.filter(s=>!s.completado)
    .sort((a,b)=>new Date(a.fechaAgenda)-new Date(b.fechaAgenda)).slice(0,6);
  const pMap = {}; pros.forEach(p=>pMap[p.id]=p);
  const eMap = {}; emps.forEach(e=>eMap[e.id]=e);

  return `
<div class="page-header">
  <div><h2>Dashboard</h2><p>Vista general del pipeline comercial</p></div>
  <button class="btn btn-primary" onclick="Router.go('mapa')">🗺 Ver Mapa Comercial</button>
</div>

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-label">Países con Alta Oportunidad</div>
    <div class="stat-value">${muyAlta}</div>
    <div class="stat-sub">de ${paises.length} países mapeados</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Empresas Objetivo</div>
    <div class="stat-value">${emps.length}</div>
    <div class="stat-sub">${altaPot} con alto potencial</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Prospectos Activos</div>
    <div class="stat-value">${pros.filter(p=>!['cerrado','perdido'].includes(p.estado)).length}</div>
    <div class="stat-sub">${pros.length} total</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Seguimientos Pendientes</div>
    <div class="stat-value">${pendientes}</div>
    <div class="stat-sub">por completar</div>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">

  <div class="card">
    <div class="card-header">
      <span class="card-title">Empresas Objetivo por Etapa</span>
      <button class="btn btn-ghost btn-sm" onclick="Router.go('empresas')">Ver todas →</button>
    </div>
    <div class="card-body" style="padding:16px">
      ${emps.length === 0 ? '<p class="text-muted">Sin empresas objetivo registradas</p>' : (() => {
        const stages = {};
        ETAPAS_EMPRESA.forEach(e => stages[e] = emps.filter(x=>x.etapa===e).length);
        return ETAPAS_EMPRESA.filter(e=>stages[e]>0).map(e=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--gray-50)">
            <span class="badge empresa-stage-${e}">${ETAPA_LABELS[e]}</span>
            <strong style="font-size:16px">${stages[e]}</strong>
          </div>`).join('');
      })()}
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title">Próximos Seguimientos</span>
      <button class="btn btn-ghost btn-sm" onclick="Router.go('seguimientos')">Ver todos →</button>
    </div>
    <div class="card-body" style="padding:12px 16px">
      ${proxSegs.length === 0 ? '<p class="text-muted">Sin seguimientos pendientes</p>' : proxSegs.map(s => {
        const p = pMap[s.prospectoId]; const e = eMap[s.empresaId];
        const nombre = (p?.nombre)||(e?.nombre)||'—';
        const dias = daysFromNow(s.fechaAgenda);
        const urgente = dias !== null && dias <= 1;
        return `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--gray-50)">
          <span>${tipoIcon(s.tipo)}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(nombre)}</div>
            <div style="font-size:11px;color:var(--gray-400)">${cap(s.tipo)} · ${fmtDate(s.fechaAgenda)}</div>
          </div>
          <span style="font-size:11px;font-weight:600;color:${urgente?'var(--danger)':'var(--gray-400)'};white-space:nowrap">
            ${dias===0?'Hoy':dias===1?'Mañana':dias<0?`${Math.abs(dias)}d atrás`:`${dias}d`}
          </span>
        </div>`;
      }).join('')}
    </div>
  </div>

</div>

<div class="card">
  <div class="card-header">
    <span class="card-title">Mapa de Oportunidad por País</span>
    <button class="btn btn-ghost btn-sm" onclick="Router.go('mapa')">Ver mapa completo →</button>
  </div>
  <div class="card-body" style="padding:12px">
    ${DB.getPaises().filter(p=>p.nivelOportunidad==='muy_alta'||p.nivelOportunidad==='alta').slice(0,6).map(p => {
      const cnt = DB.getEmpresas().filter(e=>e.paisId===p.id).length;
      return `<div style="display:flex;align-items:center;gap:12px;padding:8px 6px;border-bottom:1px solid var(--gray-50);cursor:pointer" onclick="Router.go('mapa')">
        <span style="font-size:22px;width:30px;text-align:center">${p.bandera}</span>
        <div style="flex:1"><strong>${escHtml(p.nombre)}</strong>
          <span class="badge badge-op-${p.nivelOportunidad}" style="margin-left:8px">${OP_LABELS[p.nivelOportunidad]}</span>
        </div>
        <span style="font-size:12px;color:var(--gray-400)">${cnt} empresa${cnt!==1?'s':''}</span>
      </div>`;
    }).join('') || '<p class="text-muted">Agrega países en el Mapa Comercial</p>'}
  </div>
</div>`;
});

// ─────────────────────────────────────────────────────────────────────────────
//  MAPA COMERCIAL
// ─────────────────────────────────────────────────────────────────────────────
Router.register('mapa', () => {
  const paises = DB.getPaises();
  const emps   = DB.getEmpresas();

  const byOp = { muy_alta:0, alta:0, media:0, baja:0, bloqueada:0 };
  paises.forEach(p => byOp[p.nivelOportunidad] = (byOp[p.nivelOportunidad]||0)+1);

  return `
<div class="page-header">
  <div><h2>Mapa Comercial Latinoamérica</h2><p>Inteligencia comercial por país</p></div>
  <button class="btn btn-primary" onclick="openAddPais()">+ Agregar País</button>
</div>

<div class="map-legend">
  <span style="font-size:13px;font-weight:600;color:var(--gray-500)">Oportunidad:</span>
  ${Object.entries({muy_alta:'#10b981',alta:'#3b82f6',media:'#f59e0b',baja:'#9ca3af',bloqueada:'#ef4444'}).map(([k,c])=>`
  <div class="map-legend-item">
    <span class="map-legend-dot" style="background:${c}"></span>
    <span>${OP_LABELS[k]} (${byOp[k]||0})</span>
  </div>`).join('')}
  <div style="margin-left:auto;font-size:13px;color:var(--gray-500)">${paises.length} países · ${emps.length} empresas objetivo</div>
</div>

${paises.length === 0 ? `
<div class="empty-state">
  <div class="empty-icon">🗺</div>
  <h3>Sin países registrados</h3>
  <p>Agrega países para construir tu inteligencia comercial de Latinoamérica</p>
</div>` : `
<div class="countries-grid">
  ${paises.map(p => {
    const cnt = emps.filter(e=>e.paisId===p.id).length;
    const mercados = (p.mercadosMayoristas||[]).slice(0,2);
    return `
  <div class="country-card op-${p.nivelOportunidad}" onclick="openPaisDetail('${p.id}')">
    <div class="oportunidad-strip"></div>
    <div class="cc-top">
      <div class="cc-flag">${p.bandera||'🌎'}</div>
      <div class="cc-name">${escHtml(p.nombre)}</div>
      <div class="cc-badges">
        <span class="badge badge-op-${p.nivelOportunidad}">${OP_LABELS[p.nivelOportunidad]||p.nivelOportunidad}</span>
        <span class="badge badge-dif-${p.dificultadEntrada}">${DIF_LABELS[p.dificultadEntrada]||p.dificultadEntrada}</span>
      </div>
    </div>
    <div class="cc-body">
      ${mercados.length ? `<div class="cc-markets"><strong>Mercados clave:</strong><br>${mercados.map(m=>escHtml(m)).join('<br>')}</div>` : ''}
      ${p.restricciones_aranceles ? `<div class="cc-restriction">⚠️ ${escHtml(p.restricciones_aranceles)}</div>` : ''}
    </div>
    <div class="cc-bottom">
      <span class="cc-stat"><strong>${cnt}</strong> empresa${cnt!==1?'s':''} objetivo</span>
      <div style="display:flex;gap:6px" onclick="event.stopPropagation()">
        <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="openEditPais('${p.id}')">✏️</button>
        <button class="btn btn-ghost btn-sm btn-icon" title="Ver empresas" onclick="Router.go('empresas',{paisId:'${p.id}'})">🏢</button>
        <button class="btn btn-ghost btn-sm btn-icon" title="Eliminar" onclick="confirmDeletePais('${p.id}')">🗑</button>
      </div>
    </div>
  </div>`;
  }).join('')}
</div>`}`;
});

// ── PAÍS FORM ─────────────────────────────────────────────────────────────────
const BANDERAS = { México:'🇲🇽', Colombia:'🇨🇴', Argentina:'🇦🇷', Chile:'🇨🇱', Perú:'🇵🇪', Ecuador:'🇪🇨', Bolivia:'🇧🇴', Venezuela:'🇻🇪', Uruguay:'🇺🇾', Paraguay:'🇵🇾', Guatemala:'🇬🇹', Honduras:'🇭🇳', 'El Salvador':'🇸🇻', Nicaragua:'🇳🇮', 'Costa Rica':'🇨🇷', Panamá:'🇵🇦', Cuba:'🇨🇺', 'República Dominicana':'🇩🇴', 'Puerto Rico':'🇵🇷', España:'🇪🇸', 'Estados Unidos':'🇺🇸' };

function pais_form_html(p = {}) {
  const arrToText = arr => (arr||[]).join('\n');
  return `
  <div class="form-row">
    <div class="form-group">
      <label>País *</label>
      <select id="fp-nombre" onchange="document.getElementById('fp-bandera').value=window.BANDERAS[this.value]||''">
        <option value="">Seleccionar...</option>
        ${Object.keys(BANDERAS).map(n=>`<option value="${n}" ${p.nombre===n?'selected':''}>${BANDERAS[n]} ${n}</option>`).join('')}
        <option value="Otro" ${p.nombre==='Otro'?'selected':''}>Otro</option>
      </select>
    </div>
    <div class="form-group">
      <label>Bandera / Emoji</label>
      <input type="text" id="fp-bandera" value="${escHtml(p.bandera||'')}" placeholder="🇳🇮" style="font-size:22px">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Nivel de Oportunidad</label>
      <select id="fp-oportunidad">
        ${NIVELES_OP.map(o=>`<option value="${o}" ${(p.nivelOportunidad||'media')===o?'selected':''}>${OP_LABELS[o]}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Dificultad de Entrada</label>
      <select id="fp-dificultad">
        ${DIFICULTADES.map(d=>`<option value="${d}" ${(p.dificultadEntrada||'moderada')===d?'selected':''}>${DIF_LABELS[d]}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="form-group">
    <label>Mercados Mayoristas (uno por línea)</label>
    <textarea id="fp-mercados" rows="3" placeholder="Mercado Oriental (Managua)&#10;Mercado Iván Montenegro">${arrToText(p.mercadosMayoristas)}</textarea>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Cadenas de Tiendas (una por línea)</label>
      <textarea id="fp-cadenas" rows="3" placeholder="Wal-Mart&#10;La Colonia">${arrToText(p.cadenasTiendas)}</textarea>
    </div>
    <div class="form-group">
      <label>Distribuidores / Importadores (uno por línea)</label>
      <textarea id="fp-distribuidores" rows="3" placeholder="Distribuidora González">${arrToText(p.distribuidores)}</textarea>
    </div>
  </div>
  <div class="form-group">
    <label>Restricciones — Aranceles</label>
    <input type="text" id="fp-aranceles" value="${escHtml(p.restricciones_aranceles||'')}" placeholder="Ej: ~15% DAI sobre calzado">
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Impuestos locales</label>
      <input type="text" id="fp-impuestos" value="${escHtml(p.restricciones_impuestos||'')}" placeholder="IVA 15%">
    </div>
    <div class="form-group">
      <label>Otras restricciones</label>
      <input type="text" id="fp-otros" value="${escHtml(p.restricciones_otros||'')}" placeholder="Requerimientos de etiquetado">
    </div>
  </div>
  <div class="form-group">
    <label>Notas Comerciales Estratégicas</label>
    <textarea id="fp-notas" rows="4" placeholder="Contexto del mercado, cómo operan, oportunidades específicas...">${escHtml(p.notasComerciales||'')}</textarea>
  </div>`;
}

function openAddPais() {
  document.getElementById('modal-pais-title').textContent = 'Agregar País';
  document.getElementById('modal-pais-body').innerHTML = pais_form_html();
  document.getElementById('modal-pais-id').value = '';
  Modal.open('modal-pais');
}

function openEditPais(id) {
  const p = DB.getPaises().find(x=>x.id===id); if (!p) return;
  document.getElementById('modal-pais-title').textContent = `Editar — ${p.nombre}`;
  document.getElementById('modal-pais-body').innerHTML = pais_form_html(p);
  document.getElementById('modal-pais-id').value = id;
  Modal.open('modal-pais');
}

function savePais() {
  const nombre = document.getElementById('fp-nombre').value;
  if (!nombre) { toast('Selecciona un país', 'error'); return; }
  const toArr = id => document.getElementById(id).value.split('\n').map(s=>s.trim()).filter(Boolean);
  const id = document.getElementById('modal-pais-id').value;
  const isEdit = !!id;
  const existing = isEdit ? DB.getPaises().find(x=>x.id===id) : null;

  const p = {
    id: id || uid(),
    nombre,
    bandera: document.getElementById('fp-bandera').value.trim() || BANDERAS[nombre] || '🌎',
    nivelOportunidad: document.getElementById('fp-oportunidad').value,
    dificultadEntrada: document.getElementById('fp-dificultad').value,
    mercadosMayoristas: toArr('fp-mercados'),
    cadenasTiendas: toArr('fp-cadenas'),
    distribuidores: toArr('fp-distribuidores'),
    restricciones_aranceles: document.getElementById('fp-aranceles').value.trim(),
    restricciones_impuestos: document.getElementById('fp-impuestos').value.trim(),
    restricciones_otros: document.getElementById('fp-otros').value.trim(),
    notasComerciales: document.getElementById('fp-notas').value.trim(),
    fechaActualizacion: today(),
    fechaCreacion: existing?.fechaCreacion || today(),
  };

  if (isEdit) { DB.updatePais(p); toast('País actualizado'); }
  else { DB.addPais(p); toast('País agregado'); }
  Modal.close('modal-pais');
  Router.go('mapa');
}

function confirmDeletePais(id) {
  const p = DB.getPaises().find(x=>x.id===id); if (!p) return;
  const cnt = DB.getEmpresas().filter(e=>e.paisId===id).length;
  document.getElementById('confirm-msg').textContent = `¿Eliminar ${p.nombre}? ${cnt>0?`También se eliminarán ${cnt} empresas objetivo vinculadas.`:''}`;
  document.getElementById('confirm-ok').onclick = () => {
    DB.deletePais(id);
    if (cnt > 0) DB.saveEmpresas(DB.getEmpresas().filter(e=>e.paisId!==id));
    Modal.close('modal-confirm');
    toast('País eliminado');
    Router.go('mapa');
  };
  Modal.open('modal-confirm');
}

// ── PAÍS DETAIL ───────────────────────────────────────────────────────────────
function openPaisDetail(id) {
  const p = DB.getPaises().find(x=>x.id===id); if (!p) return;
  const emps = DB.getEmpresas().filter(e=>e.paisId===id);

  const intel = `
    ${p.notasComerciales ? `<div class="highlight-note" style="margin-bottom:16px">${escHtml(p.notasComerciales)}</div>` : ''}
    ${p.mercadosMayoristas?.length ? `<div class="intel-section"><h4>Mercados Mayoristas</h4><div class="intel-tags">${p.mercadosMayoristas.map(m=>`<span class="intel-tag">🏪 ${escHtml(m)}</span>`).join('')}</div></div>` : ''}
    ${p.cadenasTiendas?.length ? `<div class="intel-section"><h4>Cadenas de Tiendas</h4><div class="intel-tags">${p.cadenasTiendas.map(m=>`<span class="intel-tag">🏬 ${escHtml(m)}</span>`).join('')}</div></div>` : ''}
    ${p.distribuidores?.length ? `<div class="intel-section"><h4>Distribuidores / Importadores</h4><div class="intel-tags">${p.distribuidores.map(m=>`<span class="intel-tag">🚛 ${escHtml(m)}</span>`).join('')}</div></div>` : ''}
    ${(p.restricciones_aranceles||p.restricciones_impuestos||p.restricciones_otros) ? `
    <div class="intel-section"><h4>Restricciones Comerciales</h4>
    <div class="restriction-box">
      ${p.restricciones_aranceles?`<div class="rb-row"><span class="rb-label">Aranceles:</span> ${escHtml(p.restricciones_aranceles)}</div>`:''}
      ${p.restricciones_impuestos?`<div class="rb-row"><span class="rb-label">Impuestos:</span> ${escHtml(p.restricciones_impuestos)}</div>`:''}
      ${p.restricciones_otros?`<div class="rb-row"><span class="rb-label">Otros:</span> ${escHtml(p.restricciones_otros)}</div>`:''}
    </div></div>` : ''}`;

  const empsList = emps.length === 0 ? '<p class="text-muted">Sin empresas objetivo en este país. <button class="btn btn-primary btn-sm" onclick="Modal.close(\'modal-pais-detail\');openAddEmpresa(\''+id+'\')">+ Agregar empresa</button></p>' : `
    <div style="margin-bottom:12px;display:flex;justify-content:flex-end">
      <button class="btn btn-primary btn-sm" onclick="Modal.close('modal-pais-detail');openAddEmpresa('${id}')">+ Agregar empresa</button>
    </div>
    ${emps.map(e=>`
    <div style="display:flex;align-items:center;gap:10px;padding:10px;border:1px solid var(--gray-100);border-radius:6px;margin-bottom:8px;cursor:pointer" onclick="Modal.close('modal-pais-detail');openEmpresaDetail('${e.id}')">
      <span style="font-size:20px">${empresaTipoIcon(e.tipo)}</span>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(e.nombre)}</div>
        <div style="font-size:12px;color:var(--gray-400)">${TIPO_EMP_LABELS[e.tipo]||e.tipo} ${e.ciudad?'· '+escHtml(e.ciudad):''}</div>
      </div>
      <span class="badge empresa-stage-${e.etapa}">${ETAPA_LABELS[e.etapa]}</span>
      <span class="badge pot-${e.potencial}">${cap(e.potencial)}</span>
    </div>`).join('')}`;

  document.getElementById('modal-pais-detail-body').innerHTML = `
  <div style="padding:20px 24px;border-bottom:1px solid var(--gray-100);display:flex;align-items:center;gap:16px">
    <span style="font-size:40px">${p.bandera||'🌎'}</span>
    <div>
      <div style="font-size:22px;font-weight:700">${escHtml(p.nombre)}</div>
      <div style="display:flex;gap:8px;margin-top:6px">
        <span class="badge badge-op-${p.nivelOportunidad}">${OP_LABELS[p.nivelOportunidad]}</span>
        <span class="badge badge-dif-${p.dificultadEntrada}">Entrada ${DIF_LABELS[p.dificultadEntrada]}</span>
        <span class="badge badge-gray">${emps.length} empresa${emps.length!==1?'s':''}</span>
      </div>
    </div>
    <div style="margin-left:auto;display:flex;gap:8px">
      <button class="btn btn-secondary btn-sm" onclick="Modal.close('modal-pais-detail');openEditPais('${id}')">✏️ Editar</button>
    </div>
  </div>
  <div class="modal-tabs">
    <button class="modal-tab active" onclick="switchPaisTab(event,'ptab-intel')">Inteligencia Comercial</button>
    <button class="modal-tab" onclick="switchPaisTab(event,'ptab-emps')">Empresas Objetivo (${emps.length})</button>
  </div>
  <div style="padding:20px 24px;overflow-y:auto;flex:1">
    <div id="ptab-intel" class="modal-tab-panel active">${intel||'<p class="text-muted">Sin información registrada. Haz clic en Editar para agregar.</p>'}</div>
    <div id="ptab-emps" class="modal-tab-panel">${empsList}</div>
  </div>`;

  Modal.open('modal-pais-detail');
}

function switchPaisTab(ev, panelId) {
  ev.target.closest('.modal-tabs').querySelectorAll('.modal-tab').forEach(t=>t.classList.remove('active'));
  ev.target.classList.add('active');
  document.querySelectorAll('.modal-tab-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(panelId)?.classList.add('active');
}

// ─────────────────────────────────────────────────────────────────────────────
//  EMPRESAS OBJETIVO
// ─────────────────────────────────────────────────────────────────────────────
Router.register('empresas', (params = {}) => {
  const emps   = DB.getEmpresas();
  const paises = DB.getPaises();
  const pMap   = {}; paises.forEach(p=>pMap[p.id]=p);

  return `
<div class="page-header">
  <div><h2>Empresas Objetivo</h2><p>${emps.length} empresas en el radar</p></div>
  <button class="btn btn-primary" onclick="openAddEmpresa()">+ Agregar Empresa</button>
</div>

<div class="card">
  <div class="filters-bar">
    <div class="search-input-wrap" style="flex:1;min-width:180px">
      <span class="search-icon">🔍</span>
      <input type="text" id="search-emps" placeholder="Buscar por nombre, ciudad..." oninput="filterEmpresas()">
    </div>
    <select class="filter-select" id="filter-emp-pais" onchange="filterEmpresas()">
      <option value="">Todos los países</option>
      ${paises.map(p=>`<option value="${p.id}" ${params.paisId===p.id?'selected':''}>${p.bandera} ${escHtml(p.nombre)}</option>`).join('')}
    </select>
    <select class="filter-select" id="filter-emp-tipo" onchange="filterEmpresas()">
      <option value="">Todos los tipos</option>
      ${TIPOS_EMPRESA.map(t=>`<option value="${t}">${TIPO_EMP_LABELS[t]||t}</option>`).join('')}
    </select>
    <select class="filter-select" id="filter-emp-etapa" onchange="filterEmpresas()">
      <option value="">Todas las etapas</option>
      ${ETAPAS_EMPRESA.map(e=>`<option value="${e}">${ETAPA_LABELS[e]}</option>`).join('')}
    </select>
    <select class="filter-select" id="filter-emp-pot" onchange="filterEmpresas()">
      <option value="">Todo potencial</option>
      ${POTENCIALES.map(p=>`<option value="${p}">${cap(p)}</option>`).join('')}
    </select>
    <button class="btn btn-ghost btn-sm" onclick="clearEmpresasFilters()">Limpiar</button>
  </div>
  <div id="empresas-table-wrap" class="table-wrap">
    ${renderEmpresasTable(emps, pMap)}
  </div>
</div>`;
});

Router.afterRender['empresas'] = (params) => {
  if (params.paisId) {
    const sel = document.getElementById('filter-emp-pais');
    if (sel) sel.value = params.paisId;
    filterEmpresas();
  }
};

function renderEmpresasTable(data, pMap) {
  if (!pMap) { pMap = {}; DB.getPaises().forEach(p=>pMap[p.id]=p); }
  if (!data.length) return `<div class="empty-state"><div class="empty-icon">🏢</div><h3>Sin empresas objetivo</h3><p>Agrega empresas para construir tu lista de targets de alto valor</p></div>`;
  return `<table>
    <thead><tr>
      <th>Empresa</th><th>País / Ciudad</th><th>Tipo</th>
      <th>Tiendas</th><th>Potencial Anual</th><th>Potencial</th><th>Etapa</th><th>Acciones</th>
    </tr></thead>
    <tbody>
      ${data.map(e => {
        const p = pMap[e.paisId];
        return `<tr style="cursor:pointer" onclick="openEmpresaDetail('${e.id}')">
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:16px">${empresaTipoIcon(e.tipo)}</span>
              <div><div class="cell-main">${escHtml(e.nombre)}</div></div>
            </div>
          </td>
          <td>
            <div>${p?`${p.bandera} ${escHtml(p.nombre)}`:'—'}</div>
            <div class="cell-sub">${escHtml(e.ciudad||'')}</div>
          </td>
          <td><span class="badge badge-gray">${TIPO_EMP_LABELS[e.tipo]||e.tipo}</span></td>
          <td>${e.numeroTiendas||'—'}</td>
          <td>${e.estimadoAnual?fmtUSD(e.estimadoAnual)+'/año':'—'}</td>
          <td><span class="badge pot-${e.potencial}">${cap(e.potencial)}</span></td>
          <td><span class="badge empresa-stage-${e.etapa}">${ETAPA_LABELS[e.etapa]}</span></td>
          <td onclick="event.stopPropagation()">
            <div style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-sm btn-icon" onclick="openEmpresaDetail('${e.id}')" title="Ver detalle">👁</button>
              <button class="btn btn-ghost btn-sm btn-icon" onclick="openEditEmpresa('${e.id}')" title="Editar">✏️</button>
              <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteEmpresa('${e.id}')" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>`;
}

function filterEmpresas() {
  const search = (document.getElementById('search-emps')?.value||'').toLowerCase();
  const pais   = document.getElementById('filter-emp-pais')?.value||'';
  const tipo   = document.getElementById('filter-emp-tipo')?.value||'';
  const etapa  = document.getElementById('filter-emp-etapa')?.value||'';
  const pot    = document.getElementById('filter-emp-pot')?.value||'';
  const pMap   = {}; DB.getPaises().forEach(p=>pMap[p.id]=p);

  let data = DB.getEmpresas();
  if (search) data = data.filter(e=>(e.nombre||'').toLowerCase().includes(search)||(e.ciudad||'').toLowerCase().includes(search));
  if (pais)   data = data.filter(e=>e.paisId===pais);
  if (tipo)   data = data.filter(e=>e.tipo===tipo);
  if (etapa)  data = data.filter(e=>e.etapa===etapa);
  if (pot)    data = data.filter(e=>e.potencial===pot);

  document.getElementById('empresas-table-wrap').innerHTML = renderEmpresasTable(data, pMap);
}

function clearEmpresasFilters() {
  ['search-emps','filter-emp-pais','filter-emp-tipo','filter-emp-etapa','filter-emp-pot'].forEach(id=>{
    const el = document.getElementById(id); if(el) el.value='';
  });
  filterEmpresas();
}

// ── EMPRESA FORM ──────────────────────────────────────────────────────────────
function empresa_form_html(e = {}, defaultPaisId = null) {
  const paises = DB.getPaises();
  const pid = e.paisId || defaultPaisId || '';
  return `
  <div class="form-row">
    <div class="form-group">
      <label>Nombre de la empresa *</label>
      <input type="text" id="fe-nombre" value="${escHtml(e.nombre||'')}" placeholder="Ej: Distribuidora Central S.A.">
    </div>
    <div class="form-group">
      <label>País</label>
      <select id="fe-pais">
        <option value="">Seleccionar...</option>
        ${paises.map(p=>`<option value="${p.id}" ${pid===p.id?'selected':''}>${p.bandera} ${escHtml(p.nombre)}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Tipo de empresa</label>
      <select id="fe-tipo">
        ${TIPOS_EMPRESA.map(t=>`<option value="${t}" ${(e.tipo||'mayorista')===t?'selected':''}>${empresaTipoIcon(t)} ${TIPO_EMP_LABELS[t]}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Ciudad</label>
      <input type="text" id="fe-ciudad" value="${escHtml(e.ciudad||'')}" placeholder="Ej: Managua, Bogotá">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Número de tiendas / sucursales</label>
      <input type="number" id="fe-tiendas" value="${e.numeroTiendas||''}" placeholder="0" min="0">
    </div>
    <div class="form-group">
      <label>Estimado compra anual (USD)</label>
      <input type="number" id="fe-estimado" value="${e.estimadoAnual||''}" placeholder="50000" min="0">
      <div class="form-hint">Cuánto podrían comprarnos al año</div>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Potencial</label>
      <select id="fe-potencial">
        ${POTENCIALES.map(p=>`<option value="${p}" ${(e.potencial||'alto')===p?'selected':''}>${cap(p)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Etapa</label>
      <select id="fe-etapa">
        ${ETAPAS_EMPRESA.map(et=>`<option value="${et}" ${(e.etapa||'identificada')===et?'selected':''}>${ETAPA_LABELS[et]}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Teléfono</label>
      <input type="tel" id="fe-telefono" value="${escHtml(e.telefono||'')}" placeholder="+505 1234 5678">
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" id="fe-email" value="${escHtml(e.email||'')}" placeholder="contacto@empresa.com">
    </div>
  </div>
  <div class="form-group">
    <label>Sitio web</label>
    <input type="text" id="fe-website" value="${escHtml(e.website||'')}" placeholder="www.empresa.com">
  </div>
  <div class="form-group">
    <label>Notas</label>
    <textarea id="fe-notas" rows="3" placeholder="Información relevante sobre esta empresa...">${escHtml(e.notas||'')}</textarea>
  </div>`;
}

function openAddEmpresa(defaultPaisId = null) {
  document.getElementById('modal-empresa-title').textContent = 'Agregar Empresa Objetivo';
  document.getElementById('modal-empresa-body').innerHTML = empresa_form_html({}, defaultPaisId);
  document.getElementById('modal-empresa-id').value = '';
  Modal.open('modal-empresa');
}

function openEditEmpresa(id) {
  const e = DB.getEmpresas().find(x=>x.id===id); if (!e) return;
  document.getElementById('modal-empresa-title').textContent = 'Editar Empresa';
  document.getElementById('modal-empresa-body').innerHTML = empresa_form_html(e);
  document.getElementById('modal-empresa-id').value = id;
  Modal.open('modal-empresa');
}

function saveEmpresa() {
  const nombre = document.getElementById('fe-nombre').value.trim();
  if (!nombre) { toast('El nombre es obligatorio', 'error'); return; }
  const id = document.getElementById('modal-empresa-id').value;
  const isEdit = !!id;
  const existing = isEdit ? DB.getEmpresas().find(x=>x.id===id) : null;

  const e = {
    id: id || uid(),
    nombre,
    paisId: document.getElementById('fe-pais').value,
    tipo: document.getElementById('fe-tipo').value,
    ciudad: document.getElementById('fe-ciudad').value.trim(),
    numeroTiendas: parseInt(document.getElementById('fe-tiendas').value)||0,
    estimadoAnual: parseFloat(document.getElementById('fe-estimado').value)||0,
    potencial: document.getElementById('fe-potencial').value,
    etapa: document.getElementById('fe-etapa').value,
    telefono: document.getElementById('fe-telefono').value.trim(),
    email: document.getElementById('fe-email').value.trim(),
    website: document.getElementById('fe-website').value.trim(),
    notas: document.getElementById('fe-notas').value.trim(),
    // strategy fields (preserve if editing)
    tomadorDecision: existing?.tomadorDecision || '',
    cargoDecision: existing?.cargoDecision || '',
    comoLlegar: existing?.comoLlegar || '',
    contactoComun: existing?.contactoComun || '',
    quienContacto: existing?.quienContacto || '',
    queFalta: existing?.queFalta || '',
    proximoPaso: existing?.proximoPaso || '',
    contactos: existing?.contactos || [],
    fechaCreacion: existing?.fechaCreacion || today(),
    fechaActualizacion: today(),
  };

  if (isEdit) { DB.updateEmpresa(e); toast('Empresa actualizada'); }
  else { DB.addEmpresa(e); toast('Empresa agregada'); }
  Modal.close('modal-empresa');
  if (Router.current === 'empresas') Router.go('empresas', Router.params);
  if (Router.current === 'dashboard') Router.go('dashboard');
  updateNavBadges();
}

function confirmDeleteEmpresa(id) {
  const e = DB.getEmpresas().find(x=>x.id===id); if (!e) return;
  document.getElementById('confirm-msg').textContent = `¿Eliminar "${e.nombre}"?`;
  document.getElementById('confirm-ok').onclick = () => {
    DB.deleteEmpresa(id);
    Modal.close('modal-confirm');
    toast('Empresa eliminada');
    if (Router.current === 'empresas') Router.go('empresas', Router.params);
    if (Router.current === 'dashboard') Router.go('dashboard');
    updateNavBadges();
  };
  Modal.open('modal-confirm');
}

// ── EMPRESA DETAIL ────────────────────────────────────────────────────────────
function openEmpresaDetail(id) {
  const e = DB.getEmpresas().find(x=>x.id===id); if (!e) return;
  const p = DB.getPaises().find(x=>x.id===e.paisId);
  const segs = DB.getSeguimientos().filter(s=>s.empresaId===id);

  function q(label, val) {
    return `<div class="estrategia-q"><div class="eq-label">${label}</div>${val?`<div class="eq-value">${escHtml(val)}</div>`:'<div class="eq-empty">Sin definir</div>'}</div>`;
  }

  const perfil = `
    <table class="mini-table" style="margin-bottom:16px">
      <tr><td>País</td><td>${p?`${p.bandera} ${escHtml(p.nombre)}`:'—'}</td></tr>
      <tr><td>Ciudad</td><td>${escHtml(e.ciudad||'—')}</td></tr>
      <tr><td>Tipo</td><td>${TIPO_EMP_LABELS[e.tipo]||e.tipo}</td></tr>
      <tr><td>Tiendas</td><td>${e.numeroTiendas||'—'}</td></tr>
      <tr><td>Potencial anual</td><td><strong>${e.estimadoAnual?fmtUSD(e.estimadoAnual):' —'}</strong></td></tr>
      <tr><td>Teléfono</td><td>${e.telefono?`<a href="tel:${escHtml(e.telefono)}">${escHtml(e.telefono)}</a>`:'—'}</td></tr>
      <tr><td>Email</td><td>${e.email?`<a href="mailto:${escHtml(e.email)}">${escHtml(e.email)}</a>`:'—'}</td></tr>
      <tr><td>Web</td><td>${e.website||'—'}</td></tr>
    </table>
    ${e.notas?`<div class="highlight-note">${escHtml(e.notas)}</div>`:''}`;

  const estrategia = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
      <button class="btn btn-primary btn-sm" onclick="openEditEstrategia('${e.id}')">✏️ Editar Estrategia</button>
    </div>
    <div class="estrategia-grid">
      ${q('¿Quién toma la decisión de compra?', e.tomadorDecision ? `${e.tomadorDecision}${e.cargoDecision?' — '+e.cargoDecision:''}` : '')}
      ${q('¿Cómo podemos llegar a esa persona?', e.comoLlegar)}
      ${q('¿Tenemos algún contacto en común?', e.contactoComun)}
      ${q('¿Quién ya habló con ellos?', e.quienContacto)}
      ${q('¿Qué falta para convertirlos en clientes?', e.queFalta)}
      ${q('Próximo paso concreto', e.proximoPaso)}
    </div>`;

  const contactos = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
      <button class="btn btn-primary btn-sm" onclick="openAddContactoEmpresa('${e.id}')">+ Agregar Contacto</button>
    </div>
    ${(e.contactos||[]).length === 0 ? '<p class="text-muted">Sin contactos registrados</p>' :
      (e.contactos||[]).map(c=>`
      <div class="contacto-card">
        <div class="avatar">${initials(c.nombre)}</div>
        <div class="co-info">
          <div class="co-name">${escHtml(c.nombre)} ${c.esDecisionMaker?'<span class="badge badge-black" style="font-size:9px">Decision Maker</span>':''}</div>
          <div class="co-cargo">${escHtml(c.cargo||'')}</div>
          <div class="co-contact">${[c.telefono,c.email].filter(Boolean).map(escHtml).join(' · ')}</div>
        </div>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="removeContactoEmpresa('${e.id}','${c.id}')">🗑</button>
      </div>`).join('')}`;

  const actividad = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
      <button class="btn btn-primary btn-sm" onclick="openAddSeguimientoEmpresa('${e.id}')">+ Agregar Seguimiento</button>
    </div>
    ${segs.length === 0 ? '<p class="text-muted">Sin seguimientos registrados</p>' :
      [...segs].sort((a,b)=>new Date(b.fechaAgenda)-new Date(a.fechaAgenda)).map(s=>`
      <div class="seg-card ${s.completado?'completed':''}">
        <div class="seg-check" onclick="toggleSeguimientoEmpresa('${s.id}','${e.id}')"></div>
        <div class="seg-body">
          <div class="seg-title">${tipoIcon(s.tipo)} ${cap(s.tipo)} · ${fmtDate(s.fechaAgenda)}</div>
          ${s.notas?`<div class="seg-meta">${escHtml(s.notas)}</div>`:''}
        </div>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="deleteSeguimientoEmpresa('${s.id}','${e.id}')">🗑</button>
      </div>`).join('')}`;

  document.getElementById('modal-empresa-detail-content').innerHTML = `
  <div class="empresa-detail-header">
    <div class="empresa-icon">${empresaTipoIcon(e.tipo)}</div>
    <div style="flex:1;min-width:0">
      <div class="eh-name">${escHtml(e.nombre)}</div>
      <div class="eh-sub">${p?`${p.bandera} ${escHtml(p.nombre)}`:''}${e.ciudad?' · '+escHtml(e.ciudad):''}</div>
      <div class="eh-badges">
        <span class="badge empresa-stage-${e.etapa}">${ETAPA_LABELS[e.etapa]}</span>
        <span class="badge pot-${e.potencial}">${cap(e.potencial)}</span>
        ${e.estimadoAnual?`<span class="badge badge-gray">${fmtUSD(e.estimadoAnual)}/año</span>`:''}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-shrink:0">
      <button class="btn btn-secondary btn-sm" onclick="Modal.close('modal-empresa-detail');openEditEmpresa('${e.id}')">✏️</button>
      <button class="btn btn-danger btn-sm" onclick="Modal.close('modal-empresa-detail');confirmDeleteEmpresa('${e.id}')">🗑</button>
    </div>
  </div>
  <div class="modal-tabs">
    <button class="modal-tab active" onclick="switchEmpresaTab(event,'etab-perfil')">Perfil</button>
    <button class="modal-tab" onclick="switchEmpresaTab(event,'etab-estrategia')">Estrategia de Entrada</button>
    <button class="modal-tab" onclick="switchEmpresaTab(event,'etab-contactos')">Contactos (${(e.contactos||[]).length})</button>
    <button class="modal-tab" onclick="switchEmpresaTab(event,'etab-actividad')">Seguimientos (${segs.length})</button>
  </div>
  <div style="padding:20px 24px;overflow-y:auto;flex:1">
    <div id="etab-perfil" class="modal-tab-panel active">${perfil}</div>
    <div id="etab-estrategia" class="modal-tab-panel">${estrategia}</div>
    <div id="etab-contactos" class="modal-tab-panel">${contactos}</div>
    <div id="etab-actividad" class="modal-tab-panel">${actividad}</div>
  </div>`;

  Modal.open('modal-empresa-detail');
}

function switchEmpresaTab(ev, panelId) {
  ev.target.closest('.modal-tabs').querySelectorAll('.modal-tab').forEach(t=>t.classList.remove('active'));
  ev.target.classList.add('active');
  document.querySelectorAll(`#modal-empresa-detail-content .modal-tab-panel`).forEach(p=>p.classList.remove('active'));
  document.getElementById(panelId)?.classList.add('active');
}

// ── ESTRATEGIA EDIT ────────────────────────────────────────────────────────────
function openEditEstrategia(id) {
  const e = DB.getEmpresas().find(x=>x.id===id); if (!e) return;
  document.getElementById('modal-estrategia-id').value = id;
  document.getElementById('modal-estrategia-title').textContent = `Estrategia — ${e.nombre}`;
  document.getElementById('fes-tomador').value = e.tomadorDecision||'';
  document.getElementById('fes-cargo').value = e.cargoDecision||'';
  document.getElementById('fes-como').value = e.comoLlegar||'';
  document.getElementById('fes-contacto').value = e.contactoComun||'';
  document.getElementById('fes-quien').value = e.quienContacto||'';
  document.getElementById('fes-falta').value = e.queFalta||'';
  document.getElementById('fes-proximo').value = e.proximoPaso||'';
  Modal.open('modal-estrategia');
}

function saveEstrategia() {
  const id = document.getElementById('modal-estrategia-id').value;
  const e = DB.getEmpresas().find(x=>x.id===id); if (!e) return;
  e.tomadorDecision = document.getElementById('fes-tomador').value.trim();
  e.cargoDecision   = document.getElementById('fes-cargo').value.trim();
  e.comoLlegar      = document.getElementById('fes-como').value.trim();
  e.contactoComun   = document.getElementById('fes-contacto').value.trim();
  e.quienContacto   = document.getElementById('fes-quien').value.trim();
  e.queFalta        = document.getElementById('fes-falta').value.trim();
  e.proximoPaso     = document.getElementById('fes-proximo').value.trim();
  e.fechaActualizacion = today();
  DB.updateEmpresa(e);
  Modal.close('modal-estrategia');
  toast('Estrategia guardada');
  openEmpresaDetail(id);
}

// ── CONTACTOS EMPRESA ─────────────────────────────────────────────────────────
function openAddContactoEmpresa(empresaId) {
  document.getElementById('modal-contacto-empresa-id').value = empresaId;
  document.getElementById('fco-nombre').value = '';
  document.getElementById('fco-cargo').value = '';
  document.getElementById('fco-telefono').value = '';
  document.getElementById('fco-email').value = '';
  document.getElementById('fco-decision').checked = false;
  Modal.open('modal-contacto');
}

function saveContactoEmpresa() {
  const nombre = document.getElementById('fco-nombre').value.trim();
  if (!nombre) { toast('El nombre es obligatorio', 'error'); return; }
  const empresaId = document.getElementById('modal-contacto-empresa-id').value;
  const e = DB.getEmpresas().find(x=>x.id===empresaId); if (!e) return;
  if (!e.contactos) e.contactos = [];
  e.contactos.push({
    id: uid(),
    nombre,
    cargo: document.getElementById('fco-cargo').value.trim(),
    telefono: document.getElementById('fco-telefono').value.trim(),
    email: document.getElementById('fco-email').value.trim(),
    esDecisionMaker: document.getElementById('fco-decision').checked,
  });
  e.fechaActualizacion = today();
  DB.updateEmpresa(e);
  Modal.close('modal-contacto');
  toast('Contacto agregado');
  openEmpresaDetail(empresaId);
}

function removeContactoEmpresa(empresaId, contactoId) {
  const e = DB.getEmpresas().find(x=>x.id===empresaId); if (!e) return;
  e.contactos = (e.contactos||[]).filter(c=>c.id!==contactoId);
  DB.updateEmpresa(e);
  toast('Contacto eliminado');
  openEmpresaDetail(empresaId);
}

// ── SEGUIMIENTOS EMPRESA ──────────────────────────────────────────────────────
function openAddSeguimientoEmpresa(empresaId) {
  const e = DB.getEmpresas().find(x=>x.id===empresaId); if (!e) return;
  document.getElementById('modal-seg-empresa-id').value = empresaId;
  document.getElementById('modal-seg-empresa-title').textContent = `Seguimiento — ${e.nombre}`;
  document.getElementById('fse-tipo').value = 'llamada';
  document.getElementById('fse-fecha').value = today();
  document.getElementById('fse-notas').value = '';
  Modal.open('modal-seg-empresa');
}

function saveSeguimientoEmpresa() {
  const empresaId = document.getElementById('modal-seg-empresa-id').value;
  const s = {
    id: uid(),
    empresaId,
    prospectoId: null,
    tipo: document.getElementById('fse-tipo').value,
    fechaAgenda: document.getElementById('fse-fecha').value,
    notas: document.getElementById('fse-notas').value.trim(),
    completado: false,
    fechaCreacion: today(),
  };
  DB.addSeguimiento(s);
  Modal.close('modal-seg-empresa');
  toast('Seguimiento agregado');
  openEmpresaDetail(empresaId);
  updateNavBadges();
}

function toggleSeguimientoEmpresa(segId, empresaId) {
  const s = DB.getSeguimientos().find(x=>x.id===segId); if (!s) return;
  s.completado = !s.completado;
  DB.updateSeguimiento(s);
  openEmpresaDetail(empresaId);
  updateNavBadges();
}

function deleteSeguimientoEmpresa(segId, empresaId) {
  DB.deleteSeguimiento(segId);
  openEmpresaDetail(empresaId);
  updateNavBadges();
}
// CALZAME AI v2 — Parte 3: Prospectos, Seguimientos, Plantillas, Importar, Seed, Init

// ─────────────────────────────────────────────────────────────────────────────
//  PROSPECTOS
// ─────────────────────────────────────────────────────────────────────────────
Router.register('prospectos', (params = {}) => {
  const all = DB.getProspectos();
  const paises = DB.getPaises();
  return `
<div class="page-header">
  <div><h2>Prospectos</h2><p>${all.length} en pipeline</p></div>
  <div style="display:flex;gap:8px">
    <button class="btn btn-secondary" onclick="Router.go('importar')">⬆ Importar CSV</button>
    <button class="btn btn-secondary" onclick="exportCSV()">⬇ Exportar CSV</button>
    <button class="btn btn-primary" onclick="openAddProspecto()">+ Agregar</button>
  </div>
</div>
<div class="card">
  <div class="filters-bar">
    <div class="search-input-wrap" style="flex:1;min-width:180px">
      <span class="search-icon">🔍</span>
      <input type="text" id="search-prospectos" placeholder="Buscar por nombre, empresa, email..." oninput="filterProspectos()" value="${escHtml(params.search||'')}">
    </div>
    <select class="filter-select" id="filter-pais" onchange="filterProspectos()">
      <option value="">Todos los países</option>
      ${PAISES_LATAM.map(p=>`<option value="${p}">${p}</option>`).join('')}
    </select>
    <select class="filter-select" id="filter-tipo" onchange="filterProspectos()">
      <option value="">Todos los tipos</option>
      ${TIPOS_CLIENTE.map(t=>`<option value="${t}">${cap(t)}</option>`).join('')}
    </select>
    <select class="filter-select" id="filter-estado" onchange="filterProspectos()">
      <option value="">Todos los estados</option>
      ${ESTADOS_PROSPECTO.map(e=>`<option value="${e}">${cap(e)}</option>`).join('')}
    </select>
    <button class="btn btn-ghost btn-sm" onclick="clearFilters()">Limpiar</button>
  </div>
  <div id="prospectos-table-wrap" class="table-wrap">${renderProspectosTable(all)}</div>
</div>`;
});

Router.afterRender['prospectos'] = (params) => {
  if (params.pais)   { const el=document.getElementById('filter-pais'); if(el) el.value=params.pais; }
  if (params.tipo)   { const el=document.getElementById('filter-tipo'); if(el) el.value=params.tipo; }
  if (params.estado) { const el=document.getElementById('filter-estado'); if(el) el.value=params.estado; }
  filterProspectos();
};

function renderProspectosTable(data) {
  if (!data.length) return `<div class="empty-state"><div class="empty-icon">🔍</div><h3>Sin resultados</h3><p>Prueba con otros filtros</p></div>`;
  return `<table>
    <thead><tr><th>Nombre / Empresa</th><th>Contacto</th><th>País</th><th>Tipo</th><th>Estado</th><th>Último contacto</th><th>Acciones</th></tr></thead>
    <tbody>${data.map(p=>`
    <tr>
      <td style="cursor:pointer" onclick="openDetailProspecto('${p.id}')">
        <div class="cell-main">${escHtml(p.nombre)}</div>
        <div class="cell-sub">${escHtml(p.empresa||'')}</div>
      </td>
      <td>
        <div>${p.telefono?`<a href="tel:${escHtml(p.telefono)}" style="color:inherit">${escHtml(p.telefono)}</a>`:'—'}</div>
        <div class="cell-sub">${p.email?`<a href="mailto:${escHtml(p.email)}" style="color:var(--gray-400);font-size:12px">${escHtml(p.email)}</a>`:''}</div>
      </td>
      <td>${escHtml(p.pais||'—')}</td>
      <td><span class="badge badge-gray">${cap(p.tipoCliente||'—')}</span></td>
      <td><span class="badge badge-${p.estado}">${cap(p.estado)}</span></td>
      <td class="text-muted">${fmtDate(p.fechaUltimoContacto||p.fechaCreacion)}</td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-ghost btn-sm btn-icon" onclick="openDetailProspecto('${p.id}')">👁</button>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="openEditProspecto('${p.id}')">✏️</button>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="openAddSeguimiento('${p.id}')">📅</button>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteProspecto('${p.id}')">🗑</button>
        </div>
      </td>
    </tr>`).join('')}
    </tbody>
  </table>`;
}

function filterProspectos() {
  const search = (document.getElementById('search-prospectos')?.value||'').toLowerCase();
  const pais   = document.getElementById('filter-pais')?.value||'';
  const tipo   = document.getElementById('filter-tipo')?.value||'';
  const estado = document.getElementById('filter-estado')?.value||'';
  let data = DB.getProspectos();
  if (search) data = data.filter(p=>(p.nombre||'').toLowerCase().includes(search)||(p.empresa||'').toLowerCase().includes(search)||(p.email||'').toLowerCase().includes(search));
  if (pais)   data = data.filter(p=>p.pais===pais);
  if (tipo)   data = data.filter(p=>p.tipoCliente===tipo);
  if (estado) data = data.filter(p=>p.estado===estado);
  document.getElementById('prospectos-table-wrap').innerHTML = renderProspectosTable(data);
}

function clearFilters() {
  ['search-prospectos','filter-pais','filter-tipo','filter-estado'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  filterProspectos();
}

function exportCSV() {
  const data = DB.getProspectos();
  if (!data.length) { toast('No hay prospectos para exportar', 'error'); return; }
  const cols = ['id','nombre','empresa','telefono','email','pais','estadoRegion','tipoCliente','estado','notas','fechaCreacion','fechaUltimoContacto'];
  const csv = [cols.join(','), ...data.map(p=>cols.map(c=>`"${String(p[c]||'').replace(/"/g,'""')}"`).join(','))].join('\n');
  const blob = new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`calzame-prospectos-${today()}.csv`; a.click();
  URL.revokeObjectURL(url);
  toast(`${data.length} prospectos exportados`);
}

function prospecto_form_html(p = {}) {
  return `
  <div class="form-row">
    <div class="form-group"><label>Nombre completo *</label><input type="text" id="f-nombre" value="${escHtml(p.nombre||'')}" placeholder="Juan García"></div>
    <div class="form-group"><label>Empresa</label><input type="text" id="f-empresa" value="${escHtml(p.empresa||'')}" placeholder="Zapatería El Buen Paso"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Teléfono / WhatsApp</label><input type="tel" id="f-telefono" value="${escHtml(p.telefono||'')}" placeholder="+52 55 1234 5678"></div>
    <div class="form-group"><label>Email</label><input type="email" id="f-email" value="${escHtml(p.email||'')}" placeholder="correo@ejemplo.com"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>País</label><select id="f-pais"><option value="">Seleccionar...</option>${PAISES_LATAM.map(c=>`<option value="${c}" ${p.pais===c?'selected':''}>${c}</option>`).join('')}</select></div>
    <div class="form-group"><label>Estado / Región</label><input type="text" id="f-estado-region" value="${escHtml(p.estadoRegion||'')}" placeholder="Jalisco, CDMX"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Tipo de cliente</label><select id="f-tipo-cliente">${TIPOS_CLIENTE.map(t=>`<option value="${t}" ${p.tipoCliente===t?'selected':''}>${cap(t)}</option>`).join('')}</select></div>
    <div class="form-group"><label>Estado del prospecto</label><select id="f-estado">${ESTADOS_PROSPECTO.map(e=>`<option value="${e}" ${(p.estado||'nuevo')===e?'selected':''}>${cap(e)}</option>`).join('')}</select></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Fuente</label><input type="text" id="f-fuente" value="${escHtml(p.fuente||'')}" placeholder="Referido, Facebook, Feria"></div>
    <div class="form-group"><label>Último contacto</label><input type="date" id="f-ultimo-contacto" value="${p.fechaUltimoContacto||today()}"></div>
  </div>
  <div class="form-group"><label>Notas</label><textarea id="f-notas">${escHtml(p.notas||'')}</textarea></div>`;
}

function openAddProspecto() {
  document.getElementById('modal-prospecto-title').textContent = 'Agregar Prospecto';
  document.getElementById('modal-prospecto-body').innerHTML = prospecto_form_html();
  document.getElementById('modal-prospecto-id').value = '';
  Modal.open('modal-prospecto');
}

function openEditProspecto(id) {
  const p = DB.getProspectos().find(x=>x.id===id); if (!p) return;
  document.getElementById('modal-prospecto-title').textContent = 'Editar Prospecto';
  document.getElementById('modal-prospecto-body').innerHTML = prospecto_form_html(p);
  document.getElementById('modal-prospecto-id').value = id;
  Modal.open('modal-prospecto');
}

function saveProspecto() {
  const nombre = document.getElementById('f-nombre').value.trim();
  if (!nombre) { toast('El nombre es obligatorio', 'error'); return; }
  const id = document.getElementById('modal-prospecto-id').value;
  const existing = id ? DB.getProspectos().find(x=>x.id===id) : null;
  const p = {
    id: id||uid(), nombre,
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
    fechaCreacion: existing?.fechaCreacion||today(),
    fechaActualizacion: today(),
  };
  if (id) { DB.updateProspecto(p); toast('Prospecto actualizado'); }
  else { DB.addProspecto(p); toast('Prospecto agregado'); }
  Modal.close('modal-prospecto');
  if (Router.current==='prospectos') Router.go('prospectos');
  if (Router.current==='dashboard') Router.go('dashboard');
}

function openDetailProspecto(id) {
  const p = DB.getProspectos().find(x=>x.id===id); if (!p) return;
  const segs = DB.getSeguimientos().filter(s=>s.prospectoId===id);
  document.getElementById('modal-detail-body').innerHTML = `
  <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
    <div class="avatar" style="width:48px;height:48px;font-size:18px">${initials(p.nombre)}</div>
    <div><div style="font-size:18px;font-weight:700">${escHtml(p.nombre)}</div><div style="font-size:13px;color:var(--gray-400)">${escHtml(p.empresa||'')}</div></div>
    <span class="badge badge-${p.estado}" style="margin-left:auto">${cap(p.estado)}</span>
  </div>
  <div class="detail-grid" style="margin-bottom:16px">
    <div class="detail-field"><div class="df-label">Teléfono</div><div class="df-value">${p.telefono?`<a href="tel:${escHtml(p.telefono)}">${escHtml(p.telefono)}</a>`:'—'}</div></div>
    <div class="detail-field"><div class="df-label">Email</div><div class="df-value">${p.email||'—'}</div></div>
    <div class="detail-field"><div class="df-label">País</div><div class="df-value">${p.pais||'—'}</div></div>
    <div class="detail-field"><div class="df-label">Tipo</div><div class="df-value">${cap(p.tipoCliente||'—')}</div></div>
  </div>
  ${p.notas?`<div class="highlight-note" style="margin-bottom:16px">${escHtml(p.notas)}</div>`:''}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
    <strong>Seguimientos (${segs.length})</strong>
    <button class="btn btn-primary btn-sm" onclick="Modal.close('modal-detail');openAddSeguimiento('${p.id}')">+ Agregar</button>
  </div>
  ${segs.sort((a,b)=>new Date(b.fechaAgenda)-new Date(a.fechaAgenda)).map(s=>`
  <div class="seg-card ${s.completado?'completed':''}">
    <div class="seg-check" onclick="toggleSeguimiento('${s.id}')"></div>
    <div class="seg-body"><div class="seg-title">${tipoIcon(s.tipo)} ${cap(s.tipo)} · ${fmtDate(s.fechaAgenda)}</div>${s.notas?`<div class="seg-meta">${escHtml(s.notas)}</div>`:''}</div>
  </div>`).join('')||'<p class="text-muted">Sin seguimientos</p>'}
  <div style="display:flex;gap:8px;margin-top:16px">
    <button class="btn btn-secondary" onclick="Modal.close('modal-detail');openEditProspecto('${p.id}')">Editar</button>
    <button class="btn btn-danger" onclick="Modal.close('modal-detail');confirmDeleteProspecto('${p.id}')">Eliminar</button>
  </div>`;
  Modal.open('modal-detail');
}

function confirmDeleteProspecto(id) {
  const p = DB.getProspectos().find(x=>x.id===id); if (!p) return;
  document.getElementById('confirm-msg').textContent = `¿Eliminar a "${p.nombre}"?`;
  document.getElementById('confirm-ok').onclick = () => {
    DB.deleteProspecto(id);
    DB.saveSeguimientos(DB.getSeguimientos().filter(s=>s.prospectoId!==id));
    Modal.close('modal-confirm');
    toast('Prospecto eliminado');
    if (Router.current==='prospectos') Router.go('prospectos');
    if (Router.current==='dashboard') Router.go('dashboard');
  };
  Modal.open('modal-confirm');
}

// ─────────────────────────────────────────────────────────────────────────────
//  SEGUIMIENTOS
// ─────────────────────────────────────────────────────────────────────────────
Router.register('seguimientos', () => {
  const segs = DB.getSeguimientos();
  const pMap = {}; DB.getProspectos().forEach(p=>pMap[p.id]=p);
  const eMap = {}; DB.getEmpresas().forEach(e=>eMap[e.id]=e);
  return `
<div class="page-header">
  <div><h2>Seguimientos</h2><p>${segs.filter(s=>!s.completado).length} pendientes</p></div>
  <button class="btn btn-primary" onclick="openAddSeguimiento()">+ Agregar</button>
</div>
<div class="tabs">
  <button class="tab-btn active" id="tab-pendientes" onclick="switchSegTab('pendientes')">Pendientes (${segs.filter(s=>!s.completado).length})</button>
  <button class="tab-btn" id="tab-completados" onclick="switchSegTab('completados')">Completados (${segs.filter(s=>s.completado).length})</button>
  <button class="tab-btn" id="tab-todos-segs" onclick="switchSegTab('todos')">Todos (${segs.length})</button>
</div>
<div id="seg-list">${renderSeguimientosList(segs.filter(s=>!s.completado), pMap, eMap)}</div>`;
});

function renderSeguimientosList(segs, pMap, eMap) {
  if (!pMap) { pMap={}; DB.getProspectos().forEach(p=>pMap[p.id]=p); }
  if (!eMap) { eMap={}; DB.getEmpresas().forEach(e=>eMap[e.id]=e); }
  if (!segs.length) return `<div class="empty-state"><div class="empty-icon">✅</div><h3>Sin seguimientos aquí</h3></div>`;
  return [...segs].sort((a,b)=>new Date(a.fechaAgenda)-new Date(b.fechaAgenda)).map(s=>{
    const p = pMap[s.prospectoId]; const e = eMap[s.empresaId];
    const nombre = p?.nombre || e?.nombre || '—';
    const dias = daysFromNow(s.fechaAgenda);
    const urgente = !s.completado && dias!==null && dias<=0;
    return `<div class="seg-card ${s.completado?'completed':''}" ${urgente?'style="border-color:#f87171;background:#fff8f8"':''}>
      <div class="seg-check" onclick="toggleSeguimiento('${s.id}')"></div>
      <div class="seg-body">
        <div class="seg-title">${tipoIcon(s.tipo)} <strong>${cap(s.tipo)}</strong> · <span style="font-weight:500">${escHtml(nombre)}</span></div>
        <div class="seg-meta">📅 ${fmtDate(s.fechaAgenda)} ${s.completado?'· ✓ Completado':dias!==null?` · ${dias===0?'<strong style="color:var(--warning)">Hoy</strong>':dias<0?`<strong style="color:var(--danger)">${Math.abs(dias)}d atrás</strong>`:`En ${dias}d`}`:''}
        </div>
        ${s.notas?`<div style="font-size:12px;color:var(--gray-500);margin-top:3px">${escHtml(s.notas)}</div>`:''}
      </div>
      <div class="seg-actions">
        <button class="btn btn-ghost btn-sm btn-icon" onclick="openEditSeguimiento('${s.id}')">✏️</button>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteSeguimiento('${s.id}')">🗑</button>
      </div>
    </div>`;
  }).join('');
}

function switchSegTab(tab) {
  document.querySelectorAll('.tabs .tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(`tab-${tab==='todos'?'todos-segs':tab}`)?.classList.add('active');
  const segs = DB.getSeguimientos();
  let filtered = segs;
  if (tab==='pendientes') filtered = segs.filter(s=>!s.completado);
  if (tab==='completados') filtered = segs.filter(s=>s.completado);
  document.getElementById('seg-list').innerHTML = renderSeguimientosList(filtered);
}

function toggleSeguimiento(id) {
  const s = DB.getSeguimientos().find(x=>x.id===id); if (!s) return;
  s.completado = !s.completado;
  DB.updateSeguimiento(s);
  if (s.completado && s.prospectoId) {
    const p = DB.getProspectos().find(x=>x.id===s.prospectoId);
    if (p) { p.fechaUltimoContacto=today(); DB.updateProspecto(p); }
  }
  if (Router.current==='seguimientos') Router.go('seguimientos');
  if (Router.current==='dashboard') Router.go('dashboard');
  updateNavBadges();
  toast(s.completado?'Completado ✓':'Marcado como pendiente');
}

function seguimiento_form_html(s = {}, prospectoIdPre = null) {
  const prospectos = DB.getProspectos();
  const empresas = DB.getEmpresas();
  const pid = s.prospectoId||prospectoIdPre||'';
  const eid = s.empresaId||'';
  return `
  <div class="form-group"><label>Prospecto (si aplica)</label>
    <select id="fs-prospecto">
      <option value="">— Ninguno —</option>
      ${prospectos.map(p=>`<option value="${p.id}" ${pid===p.id?'selected':''}>${escHtml(p.nombre)}${p.empresa?' ('+escHtml(p.empresa)+')':''}</option>`).join('')}
    </select>
  </div>
  <div class="form-group"><label>Empresa Objetivo (si aplica)</label>
    <select id="fs-empresa">
      <option value="">— Ninguna —</option>
      ${empresas.map(e=>`<option value="${e.id}" ${eid===e.id?'selected':''}>${escHtml(e.nombre)}</option>`).join('')}
    </select>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Tipo</label><select id="fs-tipo">${TIPOS_SEGUIMIENTO.map(t=>`<option value="${t}" ${(s.tipo||'llamada')===t?'selected':''}>${cap(t)} ${tipoIcon(t)}</option>`).join('')}</select></div>
    <div class="form-group"><label>Fecha *</label><input type="date" id="fs-fecha" value="${s.fechaAgenda||today()}"></div>
  </div>
  <div class="form-group"><label>Notas</label><textarea id="fs-notas">${escHtml(s.notas||'')}</textarea></div>`;
}

function openAddSeguimiento(prospectoId = null) {
  document.getElementById('modal-seg-title').textContent = 'Agregar Seguimiento';
  document.getElementById('modal-seg-body').innerHTML = seguimiento_form_html({}, prospectoId);
  document.getElementById('modal-seg-id').value = '';
  Modal.open('modal-seguimiento');
}

function openEditSeguimiento(id) {
  const s = DB.getSeguimientos().find(x=>x.id===id); if (!s) return;
  document.getElementById('modal-seg-title').textContent = 'Editar Seguimiento';
  document.getElementById('modal-seg-body').innerHTML = seguimiento_form_html(s);
  document.getElementById('modal-seg-id').value = id;
  Modal.open('modal-seguimiento');
}

function saveSeguimiento() {
  const fecha = document.getElementById('fs-fecha').value;
  if (!fecha) { toast('La fecha es obligatoria', 'error'); return; }
  const id = document.getElementById('modal-seg-id').value;
  const existing = id ? DB.getSeguimientos().find(x=>x.id===id) : null;
  const s = {
    id: id||uid(),
    prospectoId: document.getElementById('fs-prospecto').value||null,
    empresaId: document.getElementById('fs-empresa').value||null,
    tipo: document.getElementById('fs-tipo').value,
    fechaAgenda: fecha,
    notas: document.getElementById('fs-notas').value.trim(),
    completado: existing?.completado||false,
    fechaCreacion: existing?.fechaCreacion||today(),
  };
  if (id) { DB.updateSeguimiento(s); toast('Seguimiento actualizado'); }
  else { DB.addSeguimiento(s); toast('Seguimiento agregado'); }
  Modal.close('modal-seguimiento');
  if (Router.current==='seguimientos') Router.go('seguimientos');
  if (Router.current==='dashboard') Router.go('dashboard');
  updateNavBadges();
}

function confirmDeleteSeguimiento(id) {
  document.getElementById('confirm-msg').textContent = '¿Eliminar este seguimiento?';
  document.getElementById('confirm-ok').onclick = () => {
    DB.deleteSeguimiento(id);
    Modal.close('modal-confirm');
    toast('Seguimiento eliminado');
    if (Router.current==='seguimientos') Router.go('seguimientos');
    updateNavBadges();
  };
  Modal.open('modal-confirm');
}

// ─────────────────────────────────────────────────────────────────────────────
//  PLANTILLAS
// ─────────────────────────────────────────────────────────────────────────────
Router.register('plantillas', () => {
  const all = DB.getPlantillas();
  return `
<div class="page-header">
  <div><h2>Plantillas de Mensajes</h2><p>${all.length} plantillas</p></div>
  <button class="btn btn-primary" onclick="openAddPlantilla()">+ Nueva</button>
</div>
<div class="tabs">
  <button class="tab-btn active" id="tab-all-tpl" onclick="filterPlantillas('')">Todas</button>
  ${CATEGORIAS_TPL.map(c=>`<button class="tab-btn" id="tab-tpl-${c}" onclick="filterPlantillas('${c}')">${cap(c)}</button>`).join('')}
</div>
<div id="plantillas-list">${renderPlantillasList(all)}</div>`;
});

function renderPlantillasList(data) {
  if (!data.length) return `<div class="empty-state"><div class="empty-icon">📝</div><h3>Sin plantillas</h3></div>`;
  return data.map(t=>`
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

function filterPlantillas(cat) {
  document.querySelectorAll('.tabs .tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(cat?`tab-tpl-${cat}`:'tab-all-tpl')?.classList.add('active');
  let data = DB.getPlantillas();
  if (cat) data = data.filter(t=>t.categoria===cat);
  document.getElementById('plantillas-list').innerHTML = renderPlantillasList(data);
}

function plantilla_form_html(t={}) {
  return `
  <div class="form-group"><label>Nombre *</label><input type="text" id="ft-nombre" value="${escHtml(t.nombre||'')}" placeholder="Primer contacto mayorista"></div>
  <div class="form-row">
    <div class="form-group"><label>Categoría</label><select id="ft-categoria">${CATEGORIAS_TPL.map(c=>`<option value="${c}" ${(t.categoria||'presentación')===c?'selected':''}>${cap(c)}</option>`).join('')}</select></div>
    <div class="form-group"><label>Canal</label><select id="ft-canal">${CANALES_TPL.map(c=>`<option value="${c}" ${(t.canal||'whatsapp')===c?'selected':''}>${cap(c)} ${canalIcon(c)}</option>`).join('')}</select></div>
  </div>
  <div class="form-group"><label>Contenido *</label>
    <textarea id="ft-contenido" style="min-height:160px" placeholder="{{nombre}}, {{empresa}}, {{producto}}...">${escHtml(t.contenido||'')}</textarea>
    <div class="form-hint">Variables: {{nombre}}, {{empresa}}, {{telefono}}, {{producto}}</div>
  </div>`;
}

function openAddPlantilla() {
  document.getElementById('modal-tpl-title').textContent = 'Nueva Plantilla';
  document.getElementById('modal-tpl-body').innerHTML = plantilla_form_html();
  document.getElementById('modal-tpl-id').value = '';
  Modal.open('modal-plantilla');
}

function openEditPlantilla(id) {
  const t = DB.getPlantillas().find(x=>x.id===id); if(!t) return;
  document.getElementById('modal-tpl-title').textContent = 'Editar Plantilla';
  document.getElementById('modal-tpl-body').innerHTML = plantilla_form_html(t);
  document.getElementById('modal-tpl-id').value = id;
  Modal.open('modal-plantilla');
}

function savePlantilla() {
  const nombre = document.getElementById('ft-nombre').value.trim();
  const contenido = document.getElementById('ft-contenido').value.trim();
  if (!nombre||!contenido) { toast('Nombre y contenido son obligatorios', 'error'); return; }
  const id = document.getElementById('modal-tpl-id').value;
  const t = { id:id||uid(), nombre, categoria:document.getElementById('ft-categoria').value, canal:document.getElementById('ft-canal').value, contenido, fechaCreacion:id?(DB.getPlantillas().find(x=>x.id===id)?.fechaCreacion||today()):today() };
  if (id) { DB.updatePlantilla(t); toast('Plantilla actualizada'); } else { DB.addPlantilla(t); toast('Plantilla creada'); }
  Modal.close('modal-plantilla');
  Router.go('plantillas');
}

function copyPlantilla(id) {
  const t = DB.getPlantillas().find(x=>x.id===id); if(!t) return;
  navigator.clipboard.writeText(t.contenido).then(()=>toast('Copiado al portapapeles ✓')).catch(()=>{
    const el=document.createElement('textarea'); el.value=t.contenido; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); toast('Copiado ✓');
  });
}

function confirmDeletePlantilla(id) {
  document.getElementById('confirm-msg').textContent = '¿Eliminar esta plantilla?';
  document.getElementById('confirm-ok').onclick = () => { DB.deletePlantilla(id); Modal.close('modal-confirm'); toast('Plantilla eliminada'); Router.go('plantillas'); };
  Modal.open('modal-confirm');
}

// ─────────────────────────────────────────────────────────────────────────────
//  IMPORTAR
// ─────────────────────────────────────────────────────────────────────────────
Router.register('importar', () => `
<div class="page-header"><div><h2>Importar / Exportar</h2><p>Importa prospectos desde CSV o Excel</p></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
  <div class="card">
    <div class="card-header"><span class="card-title">Subir archivo</span></div>
    <div class="card-body">
      <div class="drop-zone" id="drop-zone" onclick="document.getElementById('file-input').click()">
        <div class="drop-icon">📂</div>
        <h3>Haz clic o arrastra aquí</h3>
        <p>CSV o Excel (.csv, .xlsx)</p>
      </div>
      <input type="file" id="file-input" accept=".csv,.xlsx,.xls" style="display:none" onchange="handleFileSelect(this)">
      <div id="import-status" style="margin-top:12px"></div>
    </div>
  </div>
  <div class="card">
    <div class="card-header"><span class="card-title">Formato esperado</span></div>
    <div class="card-body">
      <p style="font-size:13px;color:var(--gray-600);margin-bottom:12px">Columnas reconocidas:</p>
      <table style="width:100%;font-size:12px">
        <thead><tr><th>Columna CSV</th><th>Campo</th><th></th></tr></thead>
        <tbody>
          <tr><td>nombre / name</td><td>Nombre</td><td style="color:var(--danger)">*req</td></tr>
          <tr><td>empresa / company</td><td>Empresa</td><td></td></tr>
          <tr><td>telefono / phone</td><td>Teléfono</td><td></td></tr>
          <tr><td>email</td><td>Email</td><td></td></tr>
          <tr><td>pais / country</td><td>País</td><td></td></tr>
          <tr><td>estado / region</td><td>Estado/Región</td><td></td></tr>
          <tr><td>tipo / tipo_cliente</td><td>Tipo cliente</td><td></td></tr>
          <tr><td>notas / notes</td><td>Notas</td><td></td></tr>
        </tbody>
      </table>
      <div style="margin-top:14px"><button class="btn btn-secondary btn-sm" onclick="downloadTemplate()">⬇ Plantilla CSV</button></div>
    </div>
  </div>
</div>
<div id="import-preview"></div>`);

Router.afterRender['importar'] = () => {
  const dz = document.getElementById('drop-zone'); if (!dz) return;
  dz.addEventListener('dragover', e=>{e.preventDefault();dz.classList.add('over');});
  dz.addEventListener('dragleave', ()=>dz.classList.remove('over'));
  dz.addEventListener('drop', e=>{e.preventDefault();dz.classList.remove('over');if(e.dataTransfer.files[0])processImportFile(e.dataTransfer.files[0]);});
};

function handleFileSelect(input) { if(input.files[0]) processImportFile(input.files[0]); }

function processImportFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  document.getElementById('import-status').innerHTML=`<p style="font-size:13px;color:var(--gray-500)">Procesando <strong>${escHtml(file.name)}</strong>...</p>`;
  if (ext==='csv') { const r=new FileReader(); r.onload=e=>parseCSVImport(e.target.result); r.readAsText(file,'UTF-8'); }
  else document.getElementById('import-status').innerHTML=`<p style="color:var(--warning)">Para Excel, convierte a CSV primero.</p>`;
}

function parseCSVImport(text) {
  const lines = text.split(/\r?\n/).filter(l=>l.trim());
  if (lines.length<2) { document.getElementById('import-status').innerHTML='<p style="color:var(--danger)">Archivo vacío</p>'; return; }
  const rawHeader = lines[0].split(',').map(h=>h.replace(/^"|"$/g,'').trim().toLowerCase());
  const rows = lines.slice(1).map(line=>{ const cols=parseCSVLine(line); const obj={}; rawHeader.forEach((h,i)=>obj[h]=(cols[i]||'').replace(/^"|"$/g,'').trim()); return obj; }).filter(r=>Object.values(r).some(v=>v));
  showImportPreview(rows);
}

function parseCSVLine(line) {
  const result=[]; let cur=''; let inQ=false;
  for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){inQ=!inQ;}else if(ch===','&&!inQ){result.push(cur);cur='';}else{cur+=ch;}}
  result.push(cur); return result;
}

const COL_MAP = {
  nombre:['nombre','name','nombres','contacto','full name'],
  empresa:['empresa','company','negocio','business'],
  telefono:['telefono','teléfono','phone','tel','celular','whatsapp'],
  email:['email','correo','mail'],
  pais:['pais','país','country'],
  estadoRegion:['estado','state','region','región','provincia','ciudad','city'],
  tipoCliente:['tipo','tipo_cliente','type'],
  notas:['notas','notes','comentarios'],
};

let _importRows = [];

function showImportPreview(rows) {
  if (!rows.length) { document.getElementById('import-status').innerHTML='<p style="color:var(--danger)">Sin datos</p>'; return; }
  const headers=Object.keys(rows[0]);
  const mapping={}; Object.keys(COL_MAP).forEach(f=>{const a=COL_MAP[f];mapping[f]=headers.find(h=>a.some(al=>h===al||h.includes(al)))||null;});
  _importRows=rows;
  const valid=rows.filter(r=>mapping.nombre&&(r[mapping.nombre]||'').trim()).length;
  document.getElementById('import-status').innerHTML=`<div style="padding:10px 12px;background:var(--gray-50);border-radius:6px;font-size:13px">✓ ${rows.length} filas leídas, <strong>${valid}</strong> con nombre válido</div>`;
  document.getElementById('import-preview').innerHTML=`
  <div class="card">
    <div class="card-header"><span class="card-title">Vista previa (${Math.min(rows.length,5)} de ${rows.length})</span><button class="btn btn-primary" onclick="executeImport()">⬆ Importar ${valid} prospectos</button></div>
    <div class="table-wrap"><table>
      <thead><tr>${Object.keys(COL_MAP).map(f=>`<th>${cap(f)}</th>`).join('')}</tr></thead>
      <tbody>${rows.slice(0,5).map(r=>`<tr>${Object.keys(COL_MAP).map(f=>`<td>${escHtml(mapping[f]?r[mapping[f]]||'':'—')}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

function executeImport() {
  if (!_importRows.length) return;
  const headers=Object.keys(_importRows[0]);
  const mapping={}; Object.keys(COL_MAP).forEach(f=>{const a=COL_MAP[f];mapping[f]=headers.find(h=>a.some(al=>h===al||h.includes(al)))||null;});
  const existing=DB.getProspectos();
  const existingEmails=new Set(existing.map(p=>p.email).filter(Boolean));
  let added=0,skipped=0;
  _importRows.forEach(row=>{
    const nombre=(mapping.nombre?row[mapping.nombre]:'')||'';
    if (!nombre.trim()){skipped++;return;}
    const email=(mapping.email?row[mapping.email]:'')||'';
    if (email&&existingEmails.has(email)){skipped++;return;}
    DB.addProspecto({id:uid(),nombre:nombre.trim(),empresa:(mapping.empresa?row[mapping.empresa]:'')||'',telefono:(mapping.telefono?row[mapping.telefono]:'')||'',email:email.trim(),pais:(mapping.pais?row[mapping.pais]:'')||'',estadoRegion:(mapping.estadoRegion?row[mapping.estadoRegion]:'')||'',tipoCliente:(mapping.tipoCliente?row[mapping.tipoCliente]:'')||'otro',estado:'nuevo',notas:(mapping.notas?row[mapping.notas]:'')||'',fechaCreacion:today(),fechaActualizacion:today(),fuente:'Importación CSV'});
    if(email)existingEmails.add(email); added++;
  });
  _importRows=[]; document.getElementById('import-preview').innerHTML=''; document.getElementById('file-input').value='';
  document.getElementById('import-status').innerHTML=`<div style="padding:12px;background:#e8f8f0;border-radius:6px;font-size:13px;color:var(--success)">✓ ${added} prospectos importados, ${skipped} omitidos</div>`;
  toast(`${added} prospectos importados`);
  updateNavBadges();
}

function downloadTemplate() {
  const csv='nombre,empresa,telefono,email,pais,estado,tipo_cliente,notas\nJuan García,Zapatería El Buen Paso,+52 55 1234 5678,juan@ejemplo.com,México,Jalisco,mayorista,"Interesado en calzado económico"';
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='calzame-plantilla.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
//  SEED DATA
// ─────────────────────────────────────────────────────────────────────────────
function seedData() {
  if (DB.getPaises().length > 0) return; // already seeded

  const paises = [
    { id:'nic', nombre:'Nicaragua', bandera:'🇳🇮', nivelOportunidad:'muy_alta', dificultadEntrada:'fácil',
      mercadosMayoristas:['Mercado Oriental (Managua)','Mercado Iván Montenegro','Mercado Huembes'],
      cadenasTiendas:['La Colonia','Palí / Walmart','Maxi Palí'],
      distribuidores:['Importadores directos desde Colón','Distribuidoras informales Mercado Oriental'],
      restricciones_aranceles:'~15% DAI sobre calzado importado', restricciones_impuestos:'IVA 15%',
      restricciones_otros:'Muchos compradores viajan directamente a la Zona Libre de Colón',
      notasComerciales:'MERCADO PRIORITARIO. El Mercado Oriental es el mayor mercado informal de Centroamérica. Altísima demanda de calzado económico. Clientes históricos con volúmenes altos. Relación comercial natural con Panamá.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'hon', nombre:'Honduras', bandera:'🇭🇳', nivelOportunidad:'alta', dificultadEntrada:'fácil',
      mercadosMayoristas:['Mercado Zonal Belén (Tegucigalpa)','Mercado Mayoreo San Pedro Sula','Mercado San Isidro'],
      cadenasTiendas:['Carrión','Megapaca','Despensa Familiar','La Colonia'],
      distribuidores:['Distribuidoras San Pedro Sula','Importadores Tegucigalpa'],
      restricciones_aranceles:'~20% DAI calzado', restricciones_impuestos:'ISV 15%', restricciones_otros:'',
      notasComerciales:'San Pedro Sula es el centro manufacturero y comercial. Mercado amplio para calzado económico. Buenos distribuidores con capacidad de volumen.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'gtm', nombre:'Guatemala', bandera:'🇬🇹', nivelOportunidad:'alta', dificultadEntrada:'moderada',
      mercadosMayoristas:['Mercado Central Guatemala City','La Terminal','Mercado de Mayoreo (CENMA)'],
      cadenasTiendas:['Walmart / Maxi Despensa','La Torre','Hiper Paiz','Cemaco'],
      distribuidores:['Distribuidoras zona 1 y zona 4','Importadores Guatemala City'],
      restricciones_aranceles:'~15-20% arancel calzado', restricciones_impuestos:'IVA 12%', restricciones_otros:'Requiere registro sanitario para algunos productos',
      notasComerciales:'Mercado grande. La Terminal y CENMA son los centros mayoristas más importantes. Alta densidad poblacional = alto volumen potencial. Competencia con productos asiáticos directos.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'slv', nombre:'El Salvador', bandera:'🇸🇻', nivelOportunidad:'alta', dificultadEntrada:'fácil',
      mercadosMayoristas:['Mercado La Tiendona (San Salvador)','Mercado Central','Mercado Ex Cuartel'],
      cadenasTiendas:['Almacén Simán','La Curacao','Walmart','Super Selectos'],
      distribuidores:['Importadores San Salvador'],
      restricciones_aranceles:'~20% arancel calzado', restricciones_impuestos:'IVA 13%', restricciones_otros:'',
      notasComerciales:'La Tiendona es el principal centro mayorista. País dolarizado = transacciones simples. Mercado competitivo pero con buena demanda de calzado económico.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'cri', nombre:'Costa Rica', bandera:'🇨🇷', nivelOportunidad:'media', dificultadEntrada:'moderada',
      mercadosMayoristas:['Mercado Borbón (San José)','Mercado Central'],
      cadenasTiendas:['Walmart','MegaSuper','Perimercados','Almacén EPA'],
      distribuidores:['Distribuidoras San José'],
      restricciones_aranceles:'~14% arancel calzado', restricciones_impuestos:'IVA 13%', restricciones_otros:'Estándares de calidad más exigentes',
      notasComerciales:'Mercado de mayor poder adquisitivo en CA. Menor demanda de calzado ultra-económico. Oportunidad en segmento medio-bajo. Mercado más formal que el resto de CA.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'dom', nombre:'República Dominicana', bandera:'🇩🇴', nivelOportunidad:'alta', dificultadEntrada:'moderada',
      mercadosMayoristas:['Mercado Nuevo (Santo Domingo)','Vía España (Santiago)'],
      cadenasTiendas:['Jumbo','La Sirena','Iberia','Bravo'],
      distribuidores:['Importadores Santo Domingo','Distribuidoras calzado Santiago'],
      restricciones_aranceles:'~20% arancel calzado + recargos', restricciones_impuestos:'ITBIS 18%', restricciones_otros:'Buena conectividad marítima con Panamá',
      notasComerciales:'Economía turística dinámica. Alta rotación de calzado. Importadores dominicanos acostumbrados a comprar en Zona Libre de Colón. Oportunidad real de alto volumen.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'mex', nombre:'México', bandera:'🇲🇽', nivelOportunidad:'alta', dificultadEntrada:'difícil',
      mercadosMayoristas:['Mercado de Calzado Tepito (CDMX)','Plaza del Calzado León Gto.','Mercado de Abastos Guadalajara'],
      cadenasTiendas:['Coppel','Walmart','Liverpool','Suburbia','Price Shoes'],
      distribuidores:['Distribuidores León Guanajuato','Mayoristas CDMX Tepito'],
      restricciones_aranceles:'~10-20% arancel según origen', restricciones_impuestos:'IVA 16%', restricciones_otros:'Industria nacional muy fuerte (León, Guanajuato). Alta competencia.',
      notasComerciales:'Mercado enorme pero con fuerte industria local en León. Coppel y Price Shoes dominan el segmento económico masivo. Oportunidad en distribuidores regionales y mercados informales como Tepito. Entrada difícil pero precio es el diferenciador.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'per', nombre:'Perú', bandera:'🇵🇪', nivelOportunidad:'alta', dificultadEntrada:'moderada',
      mercadosMayoristas:['Emporio Comercial Gamarra (Lima)','Mercado Central Lima','Mercados Provinciales'],
      cadenasTiendas:['Tottus','Metro','Plaza Vea','Saga Falabella'],
      distribuidores:['Importadores Gamarra','Distribuidoras Lima'],
      restricciones_aranceles:'~11% arancel calzado', restricciones_impuestos:'IGV 18%', restricciones_otros:'Industria textil-calzado fuerte en Gamarra',
      notasComerciales:'Gamarra es uno de los mayores centros de moda de América Latina. Altísima rotación de mercancía. Importadores acostumbrados a volumen. Precio muy sensible.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'ecu', nombre:'Ecuador', bandera:'🇪🇨', nivelOportunidad:'media', dificultadEntrada:'moderada',
      mercadosMayoristas:['Mercado Mayorista Quito','Centro Comercial El Recreo Guayaquil'],
      cadenasTiendas:['Supermaxi','Mi Comisariato','Coral Hipermercados'],
      distribuidores:['Importadores Guayaquil','Distribuidoras Quito'],
      restricciones_aranceles:'~10% arancel calzado + salvaguardias históricas', restricciones_impuestos:'IVA 12%', restricciones_otros:'Salvaguardias cambiantes según política económica',
      notasComerciales:'País dolarizado = facilidad de transacción. Historial de salvaguardias puede complicar el timing de importación. Mercado estable con buena demanda.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'bol', nombre:'Bolivia', bandera:'🇧🇴', nivelOportunidad:'media', dificultadEntrada:'moderada',
      mercadosMayoristas:['Mercado 16 de Julio (El Alto)','Mercado Rodríguez La Paz','Cancha de Cochabamba'],
      cadenasTiendas:['Hipermaxi','Ketal'],
      distribuidores:['Importadores El Alto','Distribuidoras La Paz'],
      restricciones_aranceles:'~30% GA + IVA 13% + IT 3%', restricciones_impuestos:'Carga fiscal total ~46%', restricciones_otros:'Fuerte mercado informal. Ruta Iquique-Bolivia también competencia.',
      notasComerciales:'Alta sensibilidad al precio = calzado económico muy demandado. Mercado informal muy grande (El Alto). Carga arancelaria alta pero compensada por precios de ZLC. La Cancha de Cochabamba es clave.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'pry', nombre:'Paraguay', bandera:'🇵🇾', nivelOportunidad:'media', dificultadEntrada:'moderada',
      mercadosMayoristas:['Ciudad del Este (Zona Franca)','Mercado 4 Asunción'],
      cadenasTiendas:['Stock Center','Casa Rica'],
      distribuidores:['Importadores Ciudad del Este'],
      restricciones_aranceles:'Bajos aranceles (zona franca CD Este)', restricciones_impuestos:'IVA 10%', restricciones_otros:'Ciudad del Este compite directamente con Colón como ZL',
      notasComerciales:'Ciudad del Este es competidor directo de Colón. Sin embargo importadores paraguayos también compran en Colón. Mercado de reexportación hacia Argentina y Brasil.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'col', nombre:'Colombia', bandera:'🇨🇴', nivelOportunidad:'bloqueada', dificultadEntrada:'muy_difícil',
      mercadosMayoristas:['San Victorino (Bogotá)','La Minorista (Medellín)'],
      cadenasTiendas:['Éxito','Falabella','Flamingo'],
      distribuidores:['No recomendado actualmente'],
      restricciones_aranceles:'35-40% arancel calzado + IVA 19%', restricciones_impuestos:'Carga total puede superar 60%', restricciones_otros:'Dumping antidumping contra calzado chino. Industria nacional protegida.',
      notasComerciales:'NO ES PRIORIDAD. Aranceles de importación hacen inviable el calzado económico importado vs local. La industria colombiana de calzado (Bucaramanga, Medellín) está protegida políticamente. Revisar en futuro si cambia política arancelaria.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'arg', nombre:'Argentina', bandera:'🇦🇷', nivelOportunidad:'bloqueada', dificultadEntrada:'muy_difícil',
      mercadosMayoristas:['Mercado de Flores Buenos Aires'],
      cadenasTiendas:['Frávega','Carrefour'],
      distribuidores:['No recomendado'],
      restricciones_aranceles:'35% arancel + restricciones de importación', restricciones_impuestos:'IVA 21% + percepciones adicionales', restricciones_otros:'Restricciones de divisas, SIMI/SIRA para importaciones',
      notasComerciales:'BLOQUEADO. Restricciones de importación y tipo de cambio hacen casi imposible la operación normal. Revisar cuando normalice la política económica.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'ven', nombre:'Venezuela', bandera:'🇻🇪', nivelOportunidad:'bloqueada', dificultadEntrada:'muy_difícil',
      mercadosMayoristas:['Mercado de Ropa Quinta Crespo'],
      cadenasTiendas:['Farmatodo','Central Madeirense'],
      distribuidores:['Alto riesgo — no recomendado'],
      restricciones_aranceles:'Variable', restricciones_impuestos:'Variable / hiperinflación histórica', restricciones_otros:'Riesgo de impago, riesgo político, tipo de cambio',
      notasComerciales:'BLOQUEADO por ahora. Riesgo de crédito muy alto. Si se opera, solo contra pago total anticipado. Monitorear estabilización económica.', fechaCreacion:today(), fechaActualizacion:today() },

    { id:'chl', nombre:'Chile', bandera:'🇨🇱', nivelOportunidad:'baja', dificultadEntrada:'moderada',
      mercadosMayoristas:['Mercado Central Santiago','Barrio Meiggs'],
      cadenasTiendas:['Falabella','Ripley','La Polar','Walmart Chile'],
      distribuidores:['Importadores Santiago'],
      restricciones_aranceles:'~6% arancel (TLC con muchos países)', restricciones_impuestos:'IVA 19%', restricciones_otros:'Mercado exige calidad y branding más fuerte',
      notasComerciales:'Mercado más sofisticado. Calzado ultra-económico tiene menor demanda que en otros mercados. Oportunidad en segmento medio-bajo. Requiere mayor inversión en presentación del producto.', fechaCreacion:today(), fechaActualizacion:today() },
  ];

  paises.forEach(p => DB.addPais(p));

  // Seed empresas objetivo
  const empresas = [
    { id:uid(), paisId:'nic', nombre:'Distribuidora Calzado Oriental', tipo:'distribuidor', ciudad:'Managua', numeroTiendas:0, estimadoAnual:150000, potencial:'muy_alto', etapa:'contactada', telefono:'+505 2222 3333', email:'', website:'', notas:'Distribuidor principal del Mercado Oriental. Compra por volumen. Ya conocen la Zona Libre.', tomadorDecision:'Carlos Rivas', cargoDecision:'Gerente de Compras', comoLlegar:'Visita directa al Mercado Oriental', contactoComun:'', quienContacto:'', queFalta:'Primera visita presencial para establecer relación', proximoPaso:'Planificar viaje a Managua en próxima gira', contactos:[], fechaCreacion:today(), fechaActualizacion:today() },
    { id:uid(), paisId:'hon', nombre:'Cadena Carrión Honduras', tipo:'cadena', ciudad:'Tegucigalpa', numeroTiendas:45, estimadoAnual:400000, potencial:'muy_alto', etapa:'investigando', telefono:'', email:'', website:'www.carrion.hn', notas:'Cadena nacional con 45 tiendas. Segmento popular. Importan directamente.', tomadorDecision:'', cargoDecision:'Director Comercial', comoLlegar:'Contactar a través de LinkedIn o feria de calzado', contactoComun:'', quienContacto:'', queFalta:'Identificar al director de compras y hacer primer contacto', proximoPaso:'Investigar en LinkedIn y buscar contacto', contactos:[], fechaCreacion:today(), fechaActualizacion:today() },
    { id:uid(), paisId:'dom', nombre:'Importadora Calzado del Caribe', tipo:'importador', ciudad:'Santo Domingo', numeroTiendas:0, estimadoAnual:200000, potencial:'alto', etapa:'identificada', telefono:'', email:'', website:'', notas:'Importador con experiencia en Zona Libre de Colón. Segmento económico.', tomadorDecision:'', cargoDecision:'', comoLlegar:'', contactoComun:'', quienContacto:'', queFalta:'Conseguir datos de contacto', proximoPaso:'Buscar referidos que operen con RD', contactos:[], fechaCreacion:today(), fechaActualizacion:today() },
    { id:uid(), paisId:'per', nombre:'Mayoristas Gamarra SAC', tipo:'mayorista', ciudad:'Lima', numeroTiendas:0, estimadoAnual:300000, potencial:'alto', etapa:'investigando', telefono:'', email:'', website:'', notas:'Mayorista consolidado en Gamarra. Alta rotación. Precio-sensible.', tomadorDecision:'', cargoDecision:'', comoLlegar:'Ferias de calzado Lima / contacto directo en Gamarra', contactoComun:'', quienContacto:'', queFalta:'Visita a Lima para conocer la operación', proximoPaso:'Incluir Lima en próxima gira Sudamérica', contactos:[], fechaCreacion:today(), fechaActualizacion:today() },
  ];

  empresas.forEach(e => DB.addEmpresa(e));

  // Seed prospectos
  if (DB.getProspectos().length === 0) {
    DB.addProspecto({id:uid(),nombre:'María López',empresa:'Calzado Roma',telefono:'+52 33 9876 5432',email:'maria@calzadoroma.mx',pais:'México',estadoRegion:'Jalisco',tipoCliente:'mayorista',estado:'interesado',notas:'Pidió catálogo. Pedido mínimo $10,000.',fuente:'Feria de Calzado',fechaCreacion:today(),fechaActualizacion:today(),fechaUltimoContacto:today()});
    DB.addProspecto({id:uid(),nombre:'Roberto Méndez',empresa:'Distribuidora Centroamérica',telefono:'+505 8888 1234',email:'roberto@districa.com',pais:'Nicaragua',estadoRegion:'Managua',tipoCliente:'distribuidor',estado:'propuesta',notas:'Propuesta enviada por $25,000. Esperando respuesta.',fuente:'Referido cliente actual',fechaCreacion:today(),fechaActualizacion:today(),fechaUltimoContacto:today()});
  }

  // Seed plantillas
  if (DB.getPlantillas().length === 0) {
    DB.addPlantilla({id:uid(),nombre:'Primer contacto WhatsApp',categoria:'presentación',canal:'whatsapp',contenido:'Hola {{nombre}}, soy de Calzame, exportadores de calzado desde la Zona Libre de Colón, Panamá 🇵🇦👟\n\nNos especializamos en calzado económico al por mayor, con pedidos desde US$5,000.\n\nTenemos clientes en toda Latinoamérica y creo que podemos darle un precio muy competitivo a {{empresa}}.\n\n¿Tiene 5 minutos para hablar esta semana?\n\nSaludos',fechaCreacion:today()});
    DB.addPlantilla({id:uid(),nombre:'Seguimiento propuesta',categoria:'seguimiento',canal:'whatsapp',contenido:'Hola {{nombre}}, buen día 👋\n\nTe escribo para dar seguimiento a la propuesta que le enviamos la semana pasada.\n\n¿Pudo revisarla? ¿Tiene alguna pregunta sobre precios o condiciones?\n\nEstamos disponibles para coordinar una videollamada cuando le convenga.\n\nSaludos',fechaCreacion:today()});
    DB.addPlantilla({id:uid(),nombre:'Invitación a visitar Colón',categoria:'propuesta',canal:'email',contenido:'Estimado/a {{nombre}},\n\nQueremos invitarle a visitar nuestras instalaciones en la Zona Libre de Colón, Panamá.\n\nAquí podrá ver en persona toda nuestra línea de calzado, negociar precios directamente y coordinar su primer pedido.\n\nMuchos de nuestros mejores clientes tomaron la decisión después de su primera visita.\n\n¿Cuándo podría planificar un viaje a Panamá?\n\nAtentamente,\nEquipo Calzame',fechaCreacion:today()});
  }

  // Seed seguimientos
  if (DB.getSeguimientos().length === 0) {
    const pros = DB.getProspectos();
    if (pros[0]) DB.addSeguimiento({id:uid(),prospectoId:pros[0].id,empresaId:null,tipo:'whatsapp',fechaAgenda:today(),notas:'Dar seguimiento a solicitud de catálogo',completado:false,fechaCreacion:today()});
    if (pros[1]) DB.addSeguimiento({id:uid(),prospectoId:pros[1].id,empresaId:null,tipo:'llamada',fechaAgenda:today(),notas:'Llamar para confirmar si recibió la propuesta',completado:false,fechaCreacion:today()});
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item[data-view]').forEach(el => {
    el.addEventListener('click', () => Router.go(el.dataset.view));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target===overlay) Modal.closeTop(); });
  });

  seedData();
  Router.go('dashboard');
  updateNavBadges();
});
