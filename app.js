// ── DATA ──────────────────────────────────────────────
let products = [
  { id: 1, name: 'Laptop Pro 15"', sku: 'LP-PRO-002', cat: 'Electronics', uom: 'Units', stock: 142, loc: 'Zone A-12', icon: 'box', color: '#EFF6FF', iconColor: '#2563EB' },
  { id: 2, name: 'AA Batteries (48-Pack)', sku: 'BAT-AA-48', cat: 'Hardware', uom: 'Pack', stock: 12, loc: 'Zone B-04', icon: 'layers', color: '#FEF3C7', iconColor: '#D97706' },
  { id: 3, name: 'Smartphone X12', sku: 'SP-X12-BLK', cat: 'Electronics', uom: 'Units', stock: 89, loc: 'Zone A-07', icon: 'info', color: '#DCFCE7', iconColor: '#16A34A' },
  { id: 4, name: 'Wireless Mouse', sku: 'MS-WL-003', cat: 'Hardware', uom: 'Units', stock: 8, loc: 'Zone C-01', icon: 'sliders', color: '#FEE2E2', iconColor: '#DC2626' },
  { id: 5, name: 'Mechanical Keyboard', sku: 'KB-MECH-07', cat: 'Hardware', uom: 'Units', stock: 256, loc: 'Zone C-03', icon: 'list', color: '#F3E8FF', iconColor: '#7C3AED' },
  { id: 6, name: 'USB-C Hub (7-port)', sku: 'USB-HUB-7P', cat: 'Electronics', uom: 'Units', stock: 34, loc: 'Zone A-15', icon: 'globe', color: '#FFF7ED', iconColor: '#EA580C' },
];
let receipts = [
  { id: 'REC-2042', supplier: 'Acme Corporation', product: 'Laptop Pro 15"', qty: 50, date: '14 Mar 2026', status: 'Pending' },
  { id: 'REC-2043', supplier: 'TechSource Ltd', product: 'Wireless Mouse ×200', qty: 200, date: '14 Mar 2026', status: 'Ready' },
  { id: 'REC-2044', supplier: 'GlobalParts Inc', product: 'AA Batteries', qty: 1000, date: '15 Mar 2026', status: 'Pending' },
];
let deliveries = [
  { id: 'DO-5091', customer: 'TechHub Retail', product: 'Smartphone X12', qty: 30, dest: 'Mumbai, MH', date: '14 Mar 2026', status: 'Overdue' },
  { id: 'DO-5092', customer: 'Gadget World', product: 'Mechanical Keyboard', qty: 100, dest: 'Delhi, DL', date: '15 Mar 2026', status: 'Pending' },
  { id: 'DO-5093', customer: 'DigitalMart', product: 'USB-C Hub', qty: 20, dest: 'Pune, MH', date: '16 Mar 2026', status: 'Pending' },
];
let transfers = [
  { id: 'INT-0094', from: 'Zone A – WH1', to: 'Zone B – WH1', product: 'AA Batteries', qty: 500, date: '14 Mar 2026', status: 'In Progress' },
  { id: 'INT-0095', from: 'Zone C – WH2', to: 'Zone A – WH1', product: 'Wireless Mouse', qty: 50, date: '14 Mar 2026', status: 'Pending' },
];
let adjustments = [
  { id: 'ADJ-0031', product: 'Wireless Mouse', reason: 'Damaged / Defective', qty: -5, by: 'Rahul Sharma', date: '13 Mar 2026' },
  { id: 'ADJ-0032', product: 'Laptop Pro 15"', reason: 'Stock Count Correction', qty: +3, by: 'Priya Mehta', date: '12 Mar 2026' },
];
let warehouses = [
  { id: 1, name: 'Warehouse 1', city: 'Mumbai', zones: ['Zone A', 'Zone B'] },
  { id: 2, name: 'Warehouse 2', city: 'Pune', zones: ['Zone C'] },
];
let notifications = { lowStock: true, receipts: true, delivery: false };
let currentFilter = 'All';
let currentOpsTab = 'receipts';
let passVisible = false;

// ── NAVIGATION ────────────────────────────────────────
const navScreens = ['dashboard', 'products', 'operations', 'settings', 'profile'];
function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const nav = document.getElementById('bnav');
  if (navScreens.includes(id)) {
    nav.style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const ni = document.getElementById('ni-' + id);
    if (ni) ni.classList.add('active');
  } else {
    nav.style.display = 'none';
  }
  if (id === 'products') {
    // Reset search state when navigating to products
    const si = document.getElementById('prodSearch');
    if (si) si.value = '';
    currentFilter = 'All';
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.cat === 'All'));
    renderProducts();
    const sub = document.getElementById('prodSubtitle');
    if (sub) sub.textContent = products.length + ' items across ' + warehouses.length + ' warehouses';
  }
  if (id === 'operations') { renderOps(); switchTab(currentOpsTab); }
  if (id === 'settings') renderSettings();
  if (id === 'profile') renderProfile();
}

// ── TOAST ─────────────────────────────────────────────
function showToast(msg, duration = 2200) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', duration);
}

// ── LOGIN ─────────────────────────────────────────────
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  let ok = true;
  const emailErr = document.getElementById('emailErr');
  const passErr = document.getElementById('passErr');
  emailErr.style.display = 'none'; passErr.style.display = 'none';
  document.getElementById('loginEmail').classList.remove('err');
  document.getElementById('loginPass').classList.remove('err');
  if (!email || !email.includes('@')) {
    emailErr.style.display = 'block';
    document.getElementById('loginEmail').classList.add('err');
    ok = false;
  }
  if (pass.length < 6) {
    passErr.style.display = 'block';
    document.getElementById('loginPass').classList.add('err');
    ok = false;
  }
  if (ok) go('dashboard');
}
function togglePass() {
  passVisible = !passVisible;
  const inp = document.getElementById('loginPass');
  inp.type = passVisible ? 'text' : 'password';
  document.getElementById('eyeToggle').innerHTML = ic(passVisible ? 'eyeOff' : 'eye', 18);
}
function openOtpModal() { document.getElementById('otpModal').classList.add('open') }
function closeOtpModal() { document.getElementById('otpModal').classList.remove('open') }
function verifyOtp() {
  const boxes = [...document.querySelectorAll('.otp-b')];
  const val = boxes.map(b => b.value).join('');
  if (val.length === 6) { closeOtpModal(); showToast('Password reset link sent!'); }
  else showToast('Please enter the 6-digit OTP');
}

// ── PRODUCTS ──────────────────────────────────────────
function renderProducts(filter = currentFilter, query = '') {
  let list = products;
  if (filter !== 'All') list = list.filter(p => p.cat === filter || (filter === 'Low Stock' && p.stock < 20));
  if (query) list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()));
  const container = document.getElementById('prodList');
  if (!container) return;
  if (list.length === 0) { container.innerHTML = `<div class="prod-empty">${ic('box', 40, '#94A3B8')}<p style="margin-top:12px">No products found</p></div>`; return; }
  container.innerHTML = list.map(p => `
    <div class="prod" onclick="showProductDetail(${p.id})">
      <div class="prod-ico" style="background:${p.color}">${ic(p.icon, 26, p.iconColor)}</div>
      <div style="flex:1;min-width:0">
        <div class="prod-n">${p.name}</div>
        <div class="prod-sku">${p.sku}</div>
        <div class="prod-row">
          <span class="prod-cat">${p.cat}</span>
          <span class="prod-loc">${ic('pin', 10, '#94A3B8')} ${p.loc}</span>
        </div>
      </div>
      <div class="prod-stock">
        <div class="s-num${p.stock < 20 ? ' low' : ''}">${p.stock}</div>
        <div class="s-lbl${p.stock < 20 ? ' low' : ''}">${p.stock < 20 ? 'LOW' : 'units'}</div>
      </div>
    </div>`).join('');
}
function filterChip(cat) {
  currentFilter = cat;
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.cat === cat);
  });
  renderProducts(cat, document.getElementById('prodSearch')?.value || '');
}
function searchProducts(q) { renderProducts(currentFilter, q) }
function showProductDetail(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  openProductModal(p);
}
function openProductModal(p) {
  document.getElementById('pdModal').classList.add('open');
  document.getElementById('pdContent').innerHTML = `
    <div style="text-align:center;margin-bottom:18px">
      <div style="width:72px;height:72px;border-radius:20px;background:${p.color};display:flex;align-items:center;justify-content:center;margin:0 auto 12px">${ic(p.icon, 36, p.iconColor)}</div>
      <div style="font-size:18px;font-weight:800;color:var(--text)">${p.name}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:3px">${p.sku}</div>
    </div>
    <div style="background:var(--bg);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:10px">
      ${detailRow('Category', p.cat)}
      ${detailRow('Unit', p.uom)}
      ${detailRow('Stock', `<span style="font-weight:800;color:${p.stock < 20 ? 'var(--danger)' : 'var(--success)'}">${p.stock} ${p.uom}</span>`)}
      ${detailRow('Location', p.loc)}
      ${detailRow('Status', p.stock < 20 ? `<span class="badge bd">${ic('alert', 11, '#991B1B')} Low Stock</span>` : `<span class="badge bg">${ic('check', 11, '#166534')} Adequate</span>`)}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">
      <button class="btn-primary-sm" onclick="closeProductModal();go('addprod')">${ic('edit', 15)} Edit</button>
      <button class="btn-primary-sm" style="background:${p.stock < 20 ? 'linear-gradient(135deg,var(--warn),#D97706)' : 'linear-gradient(135deg,var(--success),#15803D)'}" onclick="closeProductModal();showToast('Reorder request sent!')">${ic('inbox', 15)} ${p.stock < 20 ? 'Reorder' : 'Receipt'}</button>
    </div>`;
}
function detailRow(l, v) { return `<div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:12px;color:var(--muted)">${l}</span><span style="font-size:13px;font-weight:600">${v}</span></div>`; }
function closeProductModal() { document.getElementById('pdModal').classList.remove('open') }

// ── ADD PRODUCT ───────────────────────────────────────
function saveProduct() {
  const name = document.getElementById('ap-name').value.trim();
  const sku = document.getElementById('ap-sku').value.trim();
  const cat = document.getElementById('ap-cat').value;
  const uom = document.getElementById('ap-uom').value;
  const stock = parseInt(document.getElementById('ap-stock').value) || 0;
  const loc = document.getElementById('ap-loc').value;
  let ok = true;
  ['ap-name', 'ap-sku'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('err');
    if (!el.value.trim()) { el.classList.add('err'); ok = false; }
  });
  if (!ok) { showToast('Please fill required fields'); return; }
  const colors = ['#EFF6FF', '#DCFCE7', '#FEF3C7', '#FEE2E2', '#F3E8FF'];
  const iconColors = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#7C3AED'];
  const icons = ['box', 'tag', 'layers', 'ruler', 'list'];
  const idx = products.length % 5;
  products.unshift({ id: Date.now(), name, sku, cat, uom, stock, loc, icon: icons[idx], color: colors[idx], iconColor: iconColors[idx] });
  document.getElementById('saveToast').style.display = 'flex';
  setTimeout(() => { document.getElementById('saveToast').style.display = 'none'; go('products'); }, 1800);
  ['ap-name', 'ap-sku'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('ap-stock').value = '';
}

// ── OPERATIONS ────────────────────────────────────────
function renderOps() {
  renderReceipts(); renderDeliveries(); renderTransfers(); renderAdjustments();
}
function renderReceipts() {
  const sc = { Pending: 'bw', Ready: 'bg', Done: 'bi' };
  const active = receipts.filter(r => r.status !== 'Done');
  const done = receipts.filter(r => r.status === 'Done');
  document.getElementById('tab-receipts').innerHTML = `
    ${active.map(r => `
    <div class="op-card">
      <div class="op-hdr">
        <div><div class="op-ref">${r.id}</div><div class="op-date">${ic('calendar', 12, '#94A3B8')} ${r.date}</div></div>
        <span class="badge ${sc[r.status] || 'bw'}">${r.status}</span>
      </div>
      <div class="op-f"><span class="op-fl">Supplier</span><span class="op-fv">${r.supplier}</span></div>
      <div class="op-f"><span class="op-fl">Product</span><span class="op-fv">${r.product}</span></div>
      <div class="op-f"><span class="op-fl">Quantity</span><span class="op-fv">${r.qty} units</span></div>
      <button class="btn btn-success op-action" style="padding:12px" onclick="validateReceipt('${r.id}')">${ic('check', 16)} Validate Receipt</button>
    </div>`).join('')}
    ${done.length ? `<div style="padding:10px 0 2px"><div class="sec-t" style="padding:0">Completed (${done.length})</div></div>${done.map(r => `
    <div class="op-card" style="opacity:.6">
      <div class="op-hdr" style="margin-bottom:0">
        <div><div class="op-ref">${r.id}</div><div class="op-date">${ic('calendar', 12, '#94A3B8')} ${r.date} · ${r.qty} units from ${r.supplier}</div></div>
        <span class="badge bi">Done</span>
      </div>
    </div>`).join('')}` : ''}
    <button class="new-op-btn" onclick="openNewReceiptModal()">${ic('plus', 18, '#2563EB')} Create New Receipt</button>`;
}
function renderDeliveries() {
  const sc = { Overdue: 'bd', Pending: 'bw', Dispatched: 'bi' };
  const active = deliveries.filter(d => d.status !== 'Dispatched');
  const done = deliveries.filter(d => d.status === 'Dispatched');
  document.getElementById('tab-deliveries').innerHTML = `
    ${active.map(d => `
    <div class="op-card">
      <div class="op-hdr">
        <div><div class="op-ref">${d.id}</div><div class="op-date">${ic('calendar', 12, '#94A3B8')} ${d.date}</div></div>
        <span class="badge ${sc[d.status] || 'bw'}">${d.status}</span>
      </div>
      <div class="op-f"><span class="op-fl">Customer</span><span class="op-fv">${d.customer}</span></div>
      <div class="op-f"><span class="op-fl">Product</span><span class="op-fv">${d.product}</span></div>
      <div class="op-f"><span class="op-fl">Quantity</span><span class="op-fv">${d.qty} units</span></div>
      <div class="op-f"><span class="op-fl">Ship To</span><span class="op-fv">${d.dest}</span></div>
      <button class="btn btn-warn op-action" style="padding:12px" onclick="confirmDelivery('${d.id}')">${ic('truck', 16)} Confirm Delivery</button>
    </div>`).join('')}
    ${done.length ? `<div style="padding:10px 0 2px"><div class="sec-t" style="padding:0">Dispatched (${done.length})</div></div>${done.map(d => `
    <div class="op-card" style="opacity:.6">
      <div class="op-hdr" style="margin-bottom:0">
        <div><div class="op-ref">${d.id}</div><div class="op-date">${ic('calendar', 12, '#94A3B8')} ${d.date} · ${d.qty} units → ${d.dest}</div></div>
        <span class="badge bi">Dispatched</span>
      </div>
    </div>`).join('')}` : ''}
    <button class="new-op-btn" onclick="openNewDeliveryModal()">${ic('plus', 18, '#2563EB')} Create Delivery Order</button>`;
}
function renderTransfers() {
  const sc = { 'In Progress': 'bi', Pending: 'bw', Done: 'bg' };
  const active = transfers.filter(t => t.status !== 'Done');
  const done = transfers.filter(t => t.status === 'Done');
  document.getElementById('tab-transfers').innerHTML = `
    ${active.map(t => `
    <div class="op-card">
      <div class="op-hdr">
        <div><div class="op-ref">${t.id}</div><div class="op-date">${ic('calendar', 12, '#94A3B8')} ${t.date}</div></div>
        <span class="badge ${sc[t.status] || 'bw'}">${t.status}</span>
      </div>
      <div class="op-f"><span class="op-fl">From</span><span class="op-fv">${t.from}</span></div>
      <div class="op-f"><span class="op-fl">To</span><span class="op-fv">${t.to}</span></div>
      <div class="op-f"><span class="op-fl">Product</span><span class="op-fv">${t.product}</span></div>
      <div class="op-f"><span class="op-fl">Quantity</span><span class="op-fv">${t.qty} units</span></div>
      <button class="btn btn-success op-action" style="padding:12px" onclick="completeTransfer('${t.id}')">${ic('check', 16)} Mark Transfer Done</button>
    </div>`).join('')}
    ${done.length ? `<div style="padding:10px 0 2px"><div class="sec-t" style="padding:0">Completed (${done.length})</div></div>${done.map(t => `
    <div class="op-card" style="opacity:.6">
      <div class="op-hdr" style="margin-bottom:0">
        <div><div class="op-ref">${t.id}</div><div class="op-date">${ic('calendar', 12, '#94A3B8')} ${t.date} · ${t.from} → ${t.to}</div></div>
        <span class="badge bg">Done</span>
      </div>
    </div>`).join('')}` : ''}
    <button class="new-op-btn" onclick="openNewTransferModal()">${ic('plus', 18, '#2563EB')} Create Internal Transfer</button>`;
}
function renderAdjustments() {
  document.getElementById('tab-adjustments').innerHTML = `
    ${adjustments.map(a => `
    <div class="op-card">
      <div class="op-hdr">
        <div><div class="op-ref">${a.id}</div><div class="op-date">${ic('calendar', 12, '#94A3B8')} ${a.date}</div></div>
        <span class="badge ${a.qty < 0 ? 'bd' : 'bg'}">${a.qty < 0 ? 'Negative' : 'Positive'}</span>
      </div>
      <div class="op-f"><span class="op-fl">Product</span><span class="op-fv">${a.product}</span></div>
      <div class="op-f"><span class="op-fl">Reason</span><span class="op-fv">${a.reason}</span></div>
      <div class="op-f"><span class="op-fl">Adjustment</span><span class="op-fv" style="color:${a.qty < 0 ? 'var(--danger)' : 'var(--success)'};font-weight:800">${a.qty > 0 ? '+' : ''}${a.qty} units</span></div>
      <div class="op-f"><span class="op-fl">By</span><span class="op-fv">${a.by}</span></div>
      <button class="btn ${a.qty < 0 ? 'btn-danger' : 'btn-success'} op-action" style="padding:12px" onclick="applyAdjustment('${a.id}')">${ic('barchart', 16)} Apply Adjustment</button>
    </div>`).join('')}
    <button class="new-op-btn" onclick="openAdjModal()">${ic('plus', 18, '#2563EB')} New Stock Adjustment</button>`;
}
function validateReceipt(id) {
  const r = receipts.find(x => x.id === id);
  if (r) { r.status = 'Done'; const p = products.find(x => x.name.includes(r.product.split(' ×')[0])); if (p) p.stock += r.qty; renderReceipts(); showToast(id + ' validated – stock updated!'); }
}
function confirmDelivery(id) {
  const d = deliveries.find(x => x.id === id);
  if (d) { d.status = 'Dispatched'; renderDeliveries(); showToast(id + ' confirmed – dispatched!'); }
}
function completeTransfer(id) {
  const t = transfers.find(x => x.id === id);
  if (t) { t.status = 'Done'; renderTransfers(); showToast(id + ' transfer complete!'); }
}
function applyAdjustment(id) {
  const a = adjustments.find(x => x.id === id);
  if (a) { const p = products.find(x => x.name.includes(a.product.split(' ')[0])); if (p) { p.stock = Math.max(0, p.stock + a.qty); } adjustments = adjustments.filter(x => x.id !== id); renderAdjustments(); showToast('Adjustment ' + id + ' applied!'); }
}
function switchTab(tabId) {
  currentOpsTab = tabId;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  document.querySelector('[data-tab="' + tabId + '"]').classList.add('active');
}

// ── OPERATION MODALS ──────────────────────────────────
function openNewReceiptModal() {
  document.getElementById('genericModal').classList.add('open');
  document.getElementById('genericModalContent').innerHTML = `
    <div class="modal-handle"></div>
    <button class="modal-close" onclick="closeGenericModal()">${ic('x', 16)}</button>
    <div class="modal-title">New Receipt</div>
    <div class="modal-sub">Fill in supplier and product details</div>
    <label class="m-lbl">Supplier Name</label><input class="m-inp" id="nr-sup" placeholder="e.g. Acme Corp">
    <label class="m-lbl">Product</label>
    <select class="m-inp" id="nr-prod">${products.map(p => `<option>${p.name}</option>`).join('')}</select>
    <label class="m-lbl">Quantity</label><input class="m-inp" id="nr-qty" type="number" placeholder="0">
    <button class="btn btn-success" onclick="submitNewReceipt()">${ic('check', 16)} Create Receipt</button>`;
}
function submitNewReceipt() {
  const sup = document.getElementById('nr-sup').value.trim();
  const prod = document.getElementById('nr-prod').value;
  const qty = parseInt(document.getElementById('nr-qty').value) || 0;
  if (!sup || !qty) { showToast('Please fill all fields'); return; }
  const id = 'REC-' + (2045 + receipts.length);
  const now = new Date(); const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  receipts.push({ id, supplier: sup, product: prod, qty, date, status: 'Pending' });
  closeGenericModal(); renderReceipts(); showToast(id + ' created!');
}
function openNewDeliveryModal() {
  document.getElementById('genericModal').classList.add('open');
  document.getElementById('genericModalContent').innerHTML = `
    <div class="modal-handle"></div>
    <button class="modal-close" onclick="closeGenericModal()">${ic('x', 16)}</button>
    <div class="modal-title">New Delivery Order</div>
    <div class="modal-sub">Create a delivery for a customer</div>
    <label class="m-lbl">Customer Name</label><input class="m-inp" id="nd-cust" placeholder="e.g. TechHub Retail">
    <label class="m-lbl">Product</label>
    <select class="m-inp" id="nd-prod">${products.map(p => `<option>${p.name}</option>`).join('')}</select>
    <label class="m-lbl">Quantity</label><input class="m-inp" id="nd-qty" type="number" placeholder="0">
    <label class="m-lbl">Destination</label><input class="m-inp" id="nd-dest" placeholder="e.g. Mumbai, MH">
    <button class="btn btn-warn" onclick="submitNewDelivery()">${ic('truck', 16)} Create Delivery</button>`;
}
function submitNewDelivery() {
  const cust = document.getElementById('nd-cust').value.trim();
  const prod = document.getElementById('nd-prod').value;
  const qty = parseInt(document.getElementById('nd-qty').value) || 0;
  const dest = document.getElementById('nd-dest').value.trim();
  if (!cust || !qty || !dest) { showToast('Please fill all fields'); return; }
  const id = 'DO-' + (5094 + deliveries.length);
  const now = new Date(); const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = (now.getDate() + 2) + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  deliveries.push({ id, customer: cust, product: prod, qty, dest, date, status: 'Pending' });
  closeGenericModal(); renderDeliveries(); showToast(id + ' created!');
}
function openNewTransferModal() {
  document.getElementById('genericModal').classList.add('open');
  // Build zones dynamically from warehouses
  const zones = warehouses.flatMap(w => w.zones.map(z => z + ' – ' + w.name));
  if (zones.length < 2) { zones.push('Zone A – WH1', 'Zone B – WH1'); }
  document.getElementById('genericModalContent').innerHTML = `
    <div class="modal-handle"></div>
    <button class="modal-close" onclick="closeGenericModal()">${ic('x', 16)}</button>
    <div class="modal-title">Internal Transfer</div>
    <div class="modal-sub">Move stock between locations</div>
    <label class="m-lbl">From Location</label>
    <select class="m-inp" id="nt-from">${zones.map(z => `<option>${z}</option>`).join('')}</select>
    <label class="m-lbl">To Location</label>
    <select class="m-inp" id="nt-to">${zones.map((z, i) => `<option${i === 1 ? ' selected' : ''}>${z}</option>`).join('')}</select>
    <label class="m-lbl">Product</label>
    <select class="m-inp" id="nt-prod">${products.map(p => `<option>${p.name}</option>`).join('')}</select>
    <label class="m-lbl">Quantity</label><input class="m-inp" id="nt-qty" type="number" placeholder="0">
    <button class="btn btn-primary" onclick="submitNewTransfer()">${ic('transfer', 16)} Create Transfer</button>`;
}
function submitNewTransfer() {
  const from = document.getElementById('nt-from').value;
  const to = document.getElementById('nt-to').value;
  const prod = document.getElementById('nt-prod').value;
  const qty = parseInt(document.getElementById('nt-qty').value) || 0;
  if (!qty) { showToast('Enter a valid quantity'); return; }
  if (from === to) { showToast('From and To locations must differ'); return; }
  const id = 'INT-' + (96 + transfers.length).toString().padStart(4, '0');
  const now = new Date(); const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  transfers.push({ id, from, to, product: prod, qty, date, status: 'Pending' });
  closeGenericModal(); renderTransfers(); showToast(id + ' created!');
}
function openAdjModal() {
  document.getElementById('genericModal').classList.add('open');
  document.getElementById('genericModalContent').innerHTML = `
    <div class="modal-handle"></div>
    <button class="modal-close" onclick="closeGenericModal()">${ic('x', 16)}</button>
    <div class="modal-title">Stock Adjustment</div>
    <div class="modal-sub">Correct stock levels with a reason</div>
    <label class="m-lbl">Product</label>
    <select class="m-inp" id="na-prod">${products.map(p => `<option>${p.name}</option>`).join('')}</select>
    <label class="m-lbl">Reason</label>
    <select class="m-inp" id="na-reason">
      <option>Damaged / Defective</option><option>Stock Count Correction</option>
      <option>Expired Goods</option><option>Supplier Error</option><option>Other</option>
    </select>
    <label class="m-lbl">Adjustment Quantity (use − for negative)</label>
    <input class="m-inp" id="na-qty" type="number" placeholder="e.g. -5 or +10">
    <button class="btn btn-primary" onclick="submitAdj()">${ic('barchart', 16)} Create Adjustment</button>`;
}
function submitAdj() {
  const prod = document.getElementById('na-prod').value;
  const reason = document.getElementById('na-reason').value;
  const qty = parseInt(document.getElementById('na-qty').value) || 0;
  if (!qty) { showToast('Enter a non-zero quantity'); return; }
  const id = 'ADJ-' + (33 + adjustments.length).toString().padStart(4, '0');
  const now = new Date(); const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  adjustments.push({ id, product: prod, reason, qty, by: 'Rahul Sharma', date });
  closeGenericModal(); renderAdjustments(); showToast(id + ' created!');
}
function closeGenericModal() { document.getElementById('genericModal').classList.remove('open') }

// ── SETTINGS ──────────────────────────────────────────
function renderSettings() {
  document.getElementById('whList').innerHTML = warehouses.map((w, i) => `
    <div class="si" onclick="showToast('${w.name} settings coming soon')">
      <div class="si-ico" style="background:#EFF6FF;color:var(--p)">${ic('building', 18, '#2563EB')}</div>
      <div style="flex:1"><div class="si-lbl">${w.name}</div><div style="font-size:11px;color:var(--muted)">${w.city} · ${w.zones.join(', ')}</div></div>
      <span style="color:var(--muted)">${ic('chevRight', 16)}</span>
    </div>`).join('');
}
function addWarehouse() {
  const name = document.getElementById('wh-name').value.trim();
  const city = document.getElementById('wh-city').value.trim();
  if (!name || !city) { showToast('Please fill warehouse name and city'); return; }
  warehouses.push({ id: warehouses.length + 1, name, city, zones: [] });
  closeGenericModal(); renderSettings(); showToast(name + ' added!');
}
function openAddWhModal() {
  document.getElementById('genericModal').classList.add('open');
  document.getElementById('genericModalContent').innerHTML = `
    <div class="modal-handle"></div>
    <button class="modal-close" onclick="closeGenericModal()">${ic('x', 16)}</button>
    <div class="modal-title">Add Warehouse</div>
    <div class="modal-sub">Register a new warehouse location</div>
    <label class="m-lbl">Warehouse Name</label><input class="m-inp" id="wh-name" placeholder="e.g. Warehouse 3">
    <label class="m-lbl">City / Location</label><input class="m-inp" id="wh-city" placeholder="e.g. Bangalore">
    <button class="btn btn-primary" onclick="addWarehouse()">${ic('plus', 16)} Add Warehouse</button>`;
}
const notifLabels = { lowStock: 'Low Stock Alerts', receipts: 'Receipt Notifications', delivery: 'Delivery Reminders' };
function toggleNotif(key) {
  notifications[key] = !notifications[key];
  document.getElementById('tog-' + key).classList.toggle('on', notifications[key]);
  showToast((notifLabels[key] || key) + ' ' + (notifications[key] ? 'enabled' : 'disabled'));
}

// ── PROFILE ───────────────────────────────────────────
let profileData = { name: 'Rahul Sharma', email: 'rahul@stockpilot.com', phone: '+91 98765 43210', role: 'Inventory Manager · Warehouse A' };
function renderProfile() {
  document.getElementById('profName').textContent = profileData.name;
  document.getElementById('profRole').textContent = profileData.role;
  // Update account info items
  const items = document.querySelectorAll('#profile .pi-t');
  if (items[0]) items[0].textContent = profileData.name;
  if (items[1]) items[1].textContent = profileData.email;
  if (items[2]) items[2].textContent = profileData.phone;
}
function openEditProfile() {
  document.getElementById('genericModal').classList.add('open');
  document.getElementById('genericModalContent').innerHTML = `
    <div class="modal-handle"></div>
    <button class="modal-close" onclick="closeGenericModal()">${ic('x', 16)}</button>
    <div class="modal-title">Edit Profile</div>
    <div class="modal-sub">Update your account information</div>
    <label class="m-lbl">Full Name</label><input class="m-inp" id="ep-name" value="${profileData.name}">
    <label class="m-lbl">Email</label><input class="m-inp" id="ep-email" value="${profileData.email}">
    <label class="m-lbl">Phone</label><input class="m-inp" id="ep-phone" value="${profileData.phone}">
    <button class="btn btn-primary" onclick="saveProfile()">${ic('check', 16)} Save Changes</button>`;
}
function saveProfile() {
  const name = document.getElementById('ep-name').value.trim();
  const email = document.getElementById('ep-email').value.trim();
  const phone = document.getElementById('ep-phone').value.trim();
  if (!name || !email) { showToast('Name and email are required'); return; }
  profileData.name = name; profileData.email = email; profileData.phone = phone;
  closeGenericModal();
  renderProfile();
  // Also update dashboard greeting
  const dn = document.getElementById('dash-name-el');
  if (dn) dn.textContent = name;
  showToast('Profile updated successfully!');
}

// ── DASHBOARD COUNTS ──────────────────────────────────
function updateDashboardCounts() {
  const safe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  safe('kpi-total', products.length);
  safe('kpi-low', products.filter(p => p.stock < 20).length);
  safe('kpi-rec', receipts.filter(r => r.status !== 'Done').length);
  safe('kpi-del', deliveries.filter(d => d.status === 'Pending' || d.status === 'Overdue').length);
  safe('kpi-trans', transfers.filter(t => t.status !== 'Done').length);
}

// ── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Splash progress
  setTimeout(() => { document.getElementById('splashFill').style.width = '100%'; }, 50);
  setTimeout(() => go('login'), 2600);

  // OTP auto-advance
  document.querySelectorAll('.otp-b').forEach((inp, i, arr) => {
    inp.addEventListener('input', () => { if (inp.value && arr[i + 1]) arr[i + 1].focus(); });
    inp.addEventListener('keydown', e => { if (e.key === 'Backspace' && !inp.value && arr[i - 1]) arr[i - 1].focus(); });
  });

  // Dashboard periodic update
  setInterval(updateDashboardCounts, 500);
});
