const API_BASE = window.location.origin;
let token = localStorage.getItem('ecocollect_token') || '';

function rupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function showResponse(data) {
  document.getElementById('responseBox').textContent = JSON.stringify(data, null, 2);
}

function setStatus(message, ok = true) {
  const el = document.getElementById('loginStatus');
  el.textContent = message;
  el.className = ok ? 'success' : 'danger';
}

function authHeaders(extra = {}) {
  return {
    ...extra,
    Authorization: `Bearer ${token}`
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const json = await res.json();
  showResponse(json);
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Request gagal');
  }
  return json;
}

async function registerUser() {
  try {
    const payload = {
      name: document.getElementById('registerName').value,
      email: document.getElementById('registerEmail').value,
      password: document.getElementById('registerPassword').value,
      phone: document.getElementById('registerPhone').value,
      address: document.getElementById('registerAddress').value
    };
    await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    document.getElementById('loginEmail').value = payload.email;
    document.getElementById('loginPassword').value = payload.password;
    setStatus('Registrasi berhasil. Silakan login.', true);
  } catch (err) {
    setStatus(err.message, false);
  }
}

async function loginUser() {
  try {
    const payload = {
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value
    };
    const json = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    token = json.data.token;
    localStorage.setItem('ecocollect_token', token);
    setStatus('Login berhasil. Token tersimpan di browser.', true);
    await Promise.all([loadCategories(), loadProfile(), loadDashboard(), loadDeposits(), loadWithdrawals()]);
  } catch (err) {
    setStatus(err.message, false);
  }
}

function logoutUser() {
  token = '';
  localStorage.removeItem('ecocollect_token');
  setStatus('Logout berhasil. Token dihapus.', true);
}

async function loadProfile() {
  try {
    const json = await request('/api/profile', { headers: authHeaders() });
    const user = json.data;
    document.getElementById('profileBox').innerHTML = `
      <p><strong>${user.name}</strong></p>
      <p>Email: ${user.email}</p>
      <p>No HP: ${user.phone}</p>
      <p>Alamat: ${user.address || '-'}</p>
      <p>Saldo: <strong>${rupiah(user.balance)}</strong></p>
    `;
  } catch (err) {
    document.getElementById('profileBox').innerHTML = `<span class="danger">${err.message}</span>`;
  }
}

async function loadDashboard() {
  try {
    const json = await request('/api/dashboard', { headers: authHeaders() });
    const d = json.data;
    document.getElementById('statBalance').textContent = rupiah(d.current_balance);
    document.getElementById('statDeposit').textContent = rupiah(d.total_deposit_amount);
    document.getElementById('statWithdrawal').textContent = rupiah(d.total_withdrawal_amount);
    document.getElementById('statWeight').textContent = `${Number(d.total_weight_kg || 0)} kg`;
  } catch (err) {
    setStatus(err.message, false);
  }
}

async function loadCategories() {
  try {
    const json = await request('/api/categories', { headers: authHeaders() });
    const rows = json.data.map(item => `
      <tr><td>${item.id}</td><td>${item.name}</td><td>${rupiah(item.price_per_kg)}</td></tr>
    `).join('');
    document.getElementById('categoriesTable').innerHTML = `
      <table><thead><tr><th>ID</th><th>Nama</th><th>Harga/Kg</th></tr></thead><tbody>${rows}</tbody></table>
    `;
    document.getElementById('depositCategory').innerHTML = json.data.map(item => `
      <option value="${item.id}">${item.name} - ${rupiah(item.price_per_kg)}/kg</option>
    `).join('');
  } catch (err) {
    document.getElementById('categoriesTable').innerHTML = `<span class="danger">${err.message}</span>`;
  }
}

async function createCategory() {
  try {
    const payload = {
      name: document.getElementById('categoryName').value,
      price_per_kg: Number(document.getElementById('categoryPrice').value)
    };
    await request('/api/categories', {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });
    await loadCategories();
  } catch (err) {
    setStatus(err.message, false);
  }
}

async function createDeposit() {
  try {
    const payload = {
      category_id: Number(document.getElementById('depositCategory').value),
      weight_kg: Number(document.getElementById('depositWeight').value),
      note: document.getElementById('depositNote').value
    };
    await request('/api/deposits', {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });
    await Promise.all([loadDashboard(), loadDeposits(), loadProfile()]);
  } catch (err) {
    setStatus(err.message, false);
  }
}

async function loadDeposits() {
  try {
    const json = await request('/api/deposits', { headers: authHeaders() });
    const rows = json.data.map(item => `
      <tr><td>${item.id}</td><td>${item.category ? item.category.name : '-'}</td><td>${item.weight_kg} kg</td><td>${rupiah(item.total_amount)}</td></tr>
    `).join('') || '<tr><td colspan="4">Belum ada setoran.</td></tr>';
    document.getElementById('depositsTable').innerHTML = `
      <table><thead><tr><th>ID</th><th>Kategori</th><th>Berat</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
    `;
  } catch (err) {
    document.getElementById('depositsTable').innerHTML = `<span class="danger">${err.message}</span>`;
  }
}

async function createWithdrawal() {
  try {
    const payload = {
      amount: Number(document.getElementById('withdrawalAmount').value),
      method: document.getElementById('withdrawalMethod').value,
      note: document.getElementById('withdrawalNote').value
    };
    await request('/api/withdrawals', {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });
    await Promise.all([loadDashboard(), loadWithdrawals(), loadProfile()]);
  } catch (err) {
    setStatus(err.message, false);
  }
}

async function loadWithdrawals() {
  try {
    const json = await request('/api/withdrawals', { headers: authHeaders() });
    const rows = json.data.map(item => `
      <tr><td>${item.id}</td><td>${rupiah(item.amount)}</td><td>${item.method}</td><td>${item.status}</td></tr>
    `).join('') || '<tr><td colspan="4">Belum ada penarikan.</td></tr>';
    document.getElementById('withdrawalsTable').innerHTML = `
      <table><thead><tr><th>ID</th><th>Nominal</th><th>Metode</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
    `;
  } catch (err) {
    document.getElementById('withdrawalsTable').innerHTML = `<span class="danger">${err.message}</span>`;
  }
}

if (token) {
  setStatus('Token lama ditemukan. Klik refresh dashboard/profil untuk memuat data.', true);
}
