// ═══════════════════════════════════════════════════════
//  AgroFresh ERP — Lógica principal v2.0
// ═══════════════════════════════════════════════════════

let paginaActual = 'dashboard';

const TITULOS = {
  dashboard:'Dashboard', inventario:'Inventario', ventas:'Ventas y Facturación',
  compras:'Compras y Proveedores', rrhh:'Recursos Humanos',
  contabilidad:'Contabilidad', reportes:'Reportes'
};

// ── Datos: Libro Diario ────────────────────────────────
const libroDiario = [
  { id:1, fecha:'01/06/2026', descripcion:'Apertura de operaciones', cuenta:'Caja', debe:25000, haber:0 },
  { id:1, fecha:'01/06/2026', descripcion:'Apertura de operaciones', cuenta:'Bancos', debe:45000, haber:0 },
  { id:1, fecha:'01/06/2026', descripcion:'Apertura de operaciones', cuenta:'Mercaderías', debe:35000, haber:0 },
  { id:1, fecha:'01/06/2026', descripcion:'Apertura de operaciones', cuenta:'Equipo de Reparto', debe:30000, haber:0 },
  { id:1, fecha:'01/06/2026', descripcion:'Apertura de operaciones', cuenta:'Mobiliario y Equipo', debe:12000, haber:0 },
  { id:1, fecha:'01/06/2026', descripcion:'Apertura de operaciones', cuenta:'Equipo de Cómputo', debe:18000, haber:0 },
  { id:1, fecha:'01/06/2026', descripcion:'Apertura de operaciones', cuenta:'Capital', debe:0, haber:165000 },
  { id:2, fecha:'02/06/2026', descripcion:'Compra de mercadería al contado', cuenta:'Mercaderías', debe:12000, haber:0 },
  { id:2, fecha:'02/06/2026', descripcion:'Compra de mercadería al contado', cuenta:'IVA Crédito Fiscal', debe:1440, haber:0 },
  { id:2, fecha:'02/06/2026', descripcion:'Compra de mercadería al contado', cuenta:'Bancos', debe:0, haber:13440 },
  { id:3, fecha:'03/06/2026', descripcion:'Venta al contado', cuenta:'Caja', debe:19600, haber:0 },
  { id:3, fecha:'03/06/2026', descripcion:'Venta al contado', cuenta:'Ventas', debe:0, haber:17500 },
  { id:3, fecha:'03/06/2026', descripcion:'Venta al contado', cuenta:'IVA Débito Fiscal', debe:0, haber:2100 },
  { id:4, fecha:'03/06/2026', descripcion:'Costo de venta', cuenta:'Costo de Ventas', debe:10500, haber:0 },
  { id:4, fecha:'03/06/2026', descripcion:'Costo de venta', cuenta:'Mercaderías', debe:0, haber:10500 },
  { id:5, fecha:'04/06/2026', descripcion:'Venta al crédito', cuenta:'Clientes', debe:13440, haber:0 },
  { id:5, fecha:'04/06/2026', descripcion:'Venta al crédito', cuenta:'Ventas', debe:0, haber:12000 },
  { id:5, fecha:'04/06/2026', descripcion:'Venta al crédito', cuenta:'IVA Débito Fiscal', debe:0, haber:1440 },
  { id:6, fecha:'04/06/2026', descripcion:'Costo de venta crédito', cuenta:'Costo de Ventas', debe:7200, haber:0 },
  { id:6, fecha:'04/06/2026', descripcion:'Costo de venta crédito', cuenta:'Mercaderías', debe:0, haber:7200 },
  { id:7, fecha:'05/06/2026', descripcion:'Pago de nómina', cuenta:'Sueldos y Salarios', debe:20000, haber:0 },
  { id:7, fecha:'05/06/2026', descripcion:'Pago de nómina', cuenta:'Bancos', debe:0, haber:20000 },
  { id:8, fecha:'05/06/2026', descripcion:'Cobro a clientes', cuenta:'Bancos', debe:13440, haber:0 },
  { id:8, fecha:'05/06/2026', descripcion:'Cobro a clientes', cuenta:'Clientes', debe:0, haber:13440 },
  { id:9, fecha:'30/06/2026', descripcion:'Depreciación equipo de reparto', cuenta:'Gasto Depreciación Equipo Reparto', debe:750, haber:0 },
  { id:9, fecha:'30/06/2026', descripcion:'Depreciación equipo de reparto', cuenta:'Depreciación Acumulada Equipo Reparto', debe:0, haber:750 },
  { id:10, fecha:'30/06/2026', descripcion:'Depreciación mobiliario', cuenta:'Gasto Depreciación Mobiliario', debe:600, haber:0 },
  { id:10, fecha:'30/06/2026', descripcion:'Depreciación mobiliario', cuenta:'Depreciación Acumulada Mobiliario', debe:0, haber:600 },
  { id:11, fecha:'30/06/2026', descripcion:'Depreciación equipo cómputo', cuenta:'Gasto Depreciación Equipo Cómputo', debe:450, haber:0 },
  { id:11, fecha:'30/06/2026', descripcion:'Depreciación equipo cómputo', cuenta:'Depreciación Acumulada Equipo Cómputo', debe:0, haber:450 },
];

const Q = n => 'Q ' + Number(n).toLocaleString('es-GT', {minimumFractionDigits:2, maximumFractionDigits:2});

// ── Inicialización ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const f = document.getElementById('fecha-venta');
  if (f) f.value = new Date().toISOString().split('T')[0];
  calcTotal();
  renderLibroDiario();
  renderLibroMayor();
  renderBalanceSaldos();
});

// ── Navegación ─────────────────────────────────────────
function nav(pagina, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + pagina);
  if (pg) pg.classList.add('active');
  document.getElementById('topbar-title').textContent = TITULOS[pagina] || pagina;
  paginaActual = pagina;
}

function quickAction() {
  const map = { inventario:'modal-inv', compras:'modal-compra', rrhh:'modal-emp', ventas:'modal-venta-nueva' };
  if (map[paginaActual]) showModal(map[paginaActual]);
  else showToast('Selecciona un módulo para crear un registro');
}

// ── Tabs ───────────────────────────────────────────────
function switchTab(el, panelId) {
  const bar = el.closest('.tab-bar');
  bar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  let sib = bar.nextElementSibling;
  while (sib) { if (sib.id) sib.style.display = 'none'; sib = sib.nextElementSibling; }
  const panel = document.getElementById(panelId);
  if (panel) panel.style.display = 'block';
}

// ── Modales ────────────────────────────────────────────
function showModal(id) {
  const m = document.getElementById(id);
  if (m) { m.style.display = 'flex'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.style.display = 'none';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.style.display = 'none');
  }
});

// ── Detalle de partida (modal) ─────────────────────────
function verPartida(num) {
  const filas = libroDiario.filter(r => r.id === num);
  if (!filas.length) return;
  const desc = filas[0].descripcion;
  const fecha = filas[0].fecha;
  let tbody = '';
  let totDebe = 0, totHaber = 0;
  filas.forEach(r => {
    tbody += `<tr>
      <td>${r.cuenta}</td>
      <td style="text-align:right">${r.debe ? Q(r.debe) : '—'}</td>
      <td style="text-align:right">${r.haber ? Q(r.haber) : '—'}</td>
    </tr>`;
    totDebe += r.debe; totHaber += r.haber;
  });
  tbody += `<tr style="font-weight:600;border-top:2px solid #ccc">
    <td>Totales</td>
    <td style="text-align:right;color:#185FA5">${Q(totDebe)}</td>
    <td style="text-align:right;color:#185FA5">${Q(totHaber)}</td>
  </tr>`;
  document.getElementById('detalle-partida-titulo').textContent = 'Partida No. ' + num + ' — ' + desc;
  document.getElementById('detalle-partida-fecha').textContent = 'Fecha: ' + fecha;
  document.getElementById('detalle-partida-tbody').innerHTML = tbody;
  showModal('modal-detalle-partida');
}

// ── Detalle de cuenta Mayor (modal) ───────────────────
function verCuentaMayor(cuenta) {
  const movimientos = libroDiario.filter(r => r.cuenta === cuenta);
  let saldo = 0;
  let tbody = '';
  movimientos.forEach((r, i) => {
    saldo += r.debe - r.haber;
    tbody += `<tr>
      <td>${r.fecha}</td>
      <td>${r.descripcion}</td>
      <td style="text-align:right">${r.debe ? Q(r.debe) : '—'}</td>
      <td style="text-align:right">${r.haber ? Q(r.haber) : '—'}</td>
      <td style="text-align:right;font-weight:500;color:${saldo>=0?'#185FA5':'#E24B4A'}">${Q(Math.abs(saldo))}</td>
    </tr>`;
  });
  const totalDebe = movimientos.reduce((a,r)=>a+r.debe,0);
  const totalHaber = movimientos.reduce((a,r)=>a+r.haber,0);
  tbody += `<tr style="font-weight:600;border-top:2px solid #ccc;background:#f5f4f0">
    <td colspan="2">Totales</td>
    <td style="text-align:right;color:#185FA5">${Q(totalDebe)}</td>
    <td style="text-align:right;color:#185FA5">${Q(totalHaber)}</td>
    <td style="text-align:right;color:${saldo>=0?'#185FA5':'#E24B4A'};font-weight:700">${Q(Math.abs(saldo))} ${saldo>=0?'D':'H'}</td>
  </tr>`;
  document.getElementById('mayor-cuenta-titulo').textContent = 'Cuenta: ' + cuenta;
  document.getElementById('mayor-tbody-detalle').innerHTML = tbody;
  showModal('modal-mayor-detalle');
}

// ── Render: Libro Diario ───────────────────────────────
function renderLibroDiario() {
  const tbody = document.getElementById('diario-tbody');
  if (!tbody) return;
  const grupos = {};
  libroDiario.forEach(r => { if (!grupos[r.id]) grupos[r.id] = []; grupos[r.id].push(r); });
  let html = '';
  Object.keys(grupos).forEach(num => {
    const filas = grupos[num];
    let totD = filas.reduce((a,r)=>a+r.debe,0);
    let totH = filas.reduce((a,r)=>a+r.haber,0);
    filas.forEach((r, i) => {
      html += `<tr class="fila-partida" data-partida="${num}">
        ${i===0 ? `<td rowspan="${filas.length}" style="font-weight:500;vertical-align:top;color:#185FA5">${num}</td>` : ''}
        ${i===0 ? `<td rowspan="${filas.length}" style="vertical-align:top;font-size:12px;color:#666">${r.fecha}</td>` : ''}
        <td>${i===0?'<strong>':''}${r.cuenta}${i===0?'</strong>':''}</td>
        <td style="text-align:right">${r.debe ? Q(r.debe) : ''}</td>
        <td style="text-align:right">${r.haber ? Q(r.haber) : ''}</td>
        ${i===0 ? `<td rowspan="${filas.length}" style="text-align:center;vertical-align:middle;white-space:nowrap">
          <button class="btn-sm" onclick="verPartida(${num})" style="margin-bottom:4px"><i class="ti ti-eye"></i> Ver</button>
          <button class="btn-sm danger" onclick="confirmarEliminarPartida(${num})"><i class="ti ti-trash"></i> Eliminar</button>
        </td>` : ''}
      </tr>`;
    });
    html += `<tr style="background:#f0f4fa;font-weight:600">
      <td colspan="3" style="text-align:right;font-size:12px;color:#555">Totales partida ${num}</td>
      <td style="text-align:right;color:#185FA5">${Q(totD)}</td>
      <td style="text-align:right;color:#185FA5">${Q(totH)}</td>
      <td></td>
    </tr>`;
  });
  tbody.innerHTML = html;
  const totD = libroDiario.reduce((a,r)=>a+r.debe,0);
  const totH = libroDiario.reduce((a,r)=>a+r.haber,0);
  document.getElementById('diario-total-debe').textContent = Q(totD);
  document.getElementById('diario-total-haber').textContent = Q(totH);
}

// ── Render: Libro Mayor ────────────────────────────────
function renderLibroMayor() {
  const cont = document.getElementById('mayor-cards');
  if (!cont) return;
  const cuentas = {};
  libroDiario.forEach(r => {
    if (!cuentas[r.cuenta]) cuentas[r.cuenta] = [];
    cuentas[r.cuenta].push(r);
  });
  let html = '';
  Object.keys(cuentas).forEach(cuenta => {
    const movs = cuentas[cuenta];
    const totD = movs.reduce((a,r)=>a+r.debe,0);
    const totH = movs.reduce((a,r)=>a+r.haber,0);
    const saldo = totD - totH;
    const tipo = saldo >= 0 ? 'D' : 'H';
    html += `<div class="mayor-card">
      <div class="mayor-card-head">
        <span class="mayor-nombre">${cuenta}</span>
        <span class="badge ${saldo>=0?'blue':'red'}">${Q(Math.abs(saldo))} ${tipo}</span>
      </div>
      <table style="width:100%;font-size:12px">
        <thead><tr><th>Fecha</th><th style="text-align:right">Debe</th><th style="text-align:right">Haber</th></tr></thead>
        <tbody>
          ${movs.map(r=>`<tr>
            <td style="font-size:11px;color:#666">${r.fecha}</td>
            <td style="text-align:right">${r.debe?Q(r.debe):'—'}</td>
            <td style="text-align:right">${r.haber?Q(r.haber):'—'}</td>
          </tr>`).join('')}
          <tr style="font-weight:600;border-top:1px solid #ddd">
            <td>Total</td>
            <td style="text-align:right;color:#185FA5">${Q(totD)}</td>
            <td style="text-align:right;color:#185FA5">${Q(totH)}</td>
          </tr>
        </tbody>
      </table>
      <div style="text-align:right;margin-top:6px">
        <button class="btn-sm" onclick="verCuentaMayor('${cuenta}')"><i class="ti ti-eye"></i> Detalle</button>
      </div>
    </div>`;
  });
  cont.innerHTML = html;
}

// ── Render: Balance de Saldos ─────────────────────────
function renderBalanceSaldos() {
  const tbody = document.getElementById('balance-tbody');
  if (!tbody) return;
  const cuentas = {};
  libroDiario.forEach(r => {
    if (!cuentas[r.cuenta]) cuentas[r.cuenta] = {debe:0,haber:0};
    cuentas[r.cuenta].debe += r.debe;
    cuentas[r.cuenta].haber += r.haber;
  });
  let html = '', totD=0, totH=0, totSD=0, totSH=0;
  Object.keys(cuentas).forEach(cuenta => {
    const d = cuentas[cuenta].debe;
    const h = cuentas[cuenta].haber;
    const saldo = d - h;
    const sd = saldo>=0 ? saldo : 0;
    const sh = saldo<0 ? Math.abs(saldo) : 0;
    totD+=d; totH+=h; totSD+=sd; totSH+=sh;
    html += `<tr>
      <td>${cuenta}</td>
      <td style="text-align:right">${Q(d)}</td>
      <td style="text-align:right">${Q(h)}</td>
      <td style="text-align:right;color:#185FA5">${sd?Q(sd):'—'}</td>
      <td style="text-align:right;color:#E24B4A">${sh?Q(sh):'—'}</td>
    </tr>`;
  });
  tbody.innerHTML = html;
  document.getElementById('bs-tot-d').textContent = Q(totD);
  document.getElementById('bs-tot-h').textContent = Q(totH);
  document.getElementById('bs-tot-sd').textContent = Q(totSD);
  document.getElementById('bs-tot-sh').textContent = Q(totSH);
}

// ── Nueva Partida ──────────────────────────────────────
function guardarNuevaPartida() {
  const fecha = document.getElementById('np-fecha').value;
  const desc = document.getElementById('np-desc').value.trim();
  const cuenta1 = document.getElementById('np-cuenta1').value.trim();
  const debe1 = parseFloat(document.getElementById('np-debe1').value)||0;
  const cuenta2 = document.getElementById('np-cuenta2').value.trim();
  const haber2 = parseFloat(document.getElementById('np-haber2').value)||0;
  if (!fecha||!desc||!cuenta1||!debe1||!cuenta2||!haber2) {
    showToast('Completa todos los campos'); return;
  }
  if (Math.abs(debe1-haber2)>0.01) { showToast('El debe y haber no cuadran'); return; }
  const nuevoId = Math.max(...libroDiario.map(r=>r.id))+1;
  const [d,m,a] = fecha.split('-');
  const fechaFmt = `${d}/${m}/${a}`;
  libroDiario.push({id:nuevoId, fecha:fechaFmt, descripcion:desc, cuenta:cuenta1, debe:debe1, haber:0});
  libroDiario.push({id:nuevoId, fecha:fechaFmt, descripcion:desc, cuenta:cuenta2, debe:0, haber:haber2});
  renderLibroDiario(); renderLibroMayor(); renderBalanceSaldos();
  closeModal('modal-nueva-partida');
  showToast('Partida No. '+nuevoId+' registrada correctamente');
}

// ── Ventas ─────────────────────────────────────────────
function filtrarTabla(input, tablaId) {
  const f = input.value.toLowerCase();
  document.querySelectorAll('#'+tablaId+' tbody tr').forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(f) ? '' : 'none';
  });
}

function addLineaVenta() {
  const tbody = document.querySelector('#tabla-det-venta tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><select style="border:none;background:transparent;font-size:13px;color:var(--text-main)">
      <option>Manzanas Red</option><option>Tomate Cherry</option>
      <option>Queso Fresco 500g</option><option>Frijol Negro 1 lb</option>
    </select></td>
    <td><input type="number" value="1" min="1" class="input-num" oninput="calcTotal()"/></td>
    <td><input type="number" value="7.50" step="0.01" class="input-num" oninput="calcTotal()"/></td>
    <td class="subtotal-cell">Q 7.50</td>
    <td><button class="btn-sm danger" onclick="this.closest('tr').remove();calcTotal()">✕</button></td>`;
  tbody.appendChild(tr); calcTotal();
}

function calcTotal() {
  let sub = 0;
  document.querySelectorAll('#tabla-det-venta tbody tr').forEach(r => {
    const inputs = r.querySelectorAll('input[type="number"]');
    if (inputs.length < 2) return;
    const s = (parseFloat(inputs[0].value)||0) * (parseFloat(inputs[1].value)||0);
    sub += s;
    const sc = r.querySelector('.subtotal-cell');
    if (sc) sc.textContent = 'Q ' + s.toFixed(2);
  });
  const iva = sub*0.12;
  const elS = document.getElementById('total-sub');
  const elI = document.getElementById('total-iva');
  const elT = document.getElementById('total-final');
  if(elS) elS.textContent = 'Q '+sub.toFixed(2);
  if(elI) elI.textContent = 'Q '+iva.toFixed(2);
  if(elT) elT.textContent = 'Q '+(sub+iva).toFixed(2);
}

function registrarVenta() {
  closeModal('modal-venta-nueva');
  showToast('Venta registrada correctamente');
}

function editarProd(n) { showToast('Editando: '+n); }

// ── Toast ──────────────────────────────────────────────
let _tt = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.style.display = 'block';
  if(_tt) clearTimeout(_tt);
  _tt = setTimeout(()=>{ t.style.display='none'; }, 3000);
}

// ═══════════════════════════════════════════════════════
//  ELIMINAR PARTIDAS
// ═══════════════════════════════════════════════════════

// Partida pendiente de confirmar eliminación
let _partidaAEliminar = null;

/**
 * Muestra el modal de confirmación antes de eliminar.
 * @param {number} num - ID de la partida
 */
function confirmarEliminarPartida(num) {
  const filas = libroDiario.filter(r => r.id === num);
  if (!filas.length) return;
  _partidaAEliminar = num;
  document.getElementById('eliminar-partida-num').textContent = num;
  document.getElementById('eliminar-partida-desc').textContent = filas[0].descripcion;
  document.getElementById('eliminar-partida-fecha').textContent = filas[0].fecha;
  showModal('modal-confirmar-eliminar');
}

/**
 * Ejecuta la eliminación tras confirmación del usuario.
 */
function ejecutarEliminarPartida() {
  if (_partidaAEliminar === null) return;
  const num = _partidaAEliminar;
  // Eliminar todas las filas de esa partida
  for (let i = libroDiario.length - 1; i >= 0; i--) {
    if (libroDiario[i].id === num) libroDiario.splice(i, 1);
  }
  _partidaAEliminar = null;
  closeModal('modal-confirmar-eliminar');
  // Re-renderizar los tres libros
  renderLibroDiario();
  renderLibroMayor();
  renderBalanceSaldos();
  showToast('Partida No. ' + num + ' eliminada correctamente');
}
