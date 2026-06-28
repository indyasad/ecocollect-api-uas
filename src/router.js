const fs = require('fs');
const path = require('path');
const { success, error } = require('./utils/response');
const { authenticate } = require('./middleware/auth');
const authController = require('./controllers/authController');
const profileController = require('./controllers/profileController');
const categoryController = require('./controllers/categoryController');
const depositController = require('./controllers/depositController');
const withdrawalController = require('./controllers/withdrawalController');
const dashboardController = require('./controllers/dashboardController');

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 1_000_000) {
        reject(new Error('Payload terlalu besar'));
      }
    });

    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Format JSON tidak valid'));
      }
    });
  });
}

function getEndpointList() {
  return [
    { method: 'POST', path: '/api/auth/register', access: 'public', description: 'Registrasi user baru' },
    { method: 'POST', path: '/api/auth/login', access: 'public', description: 'Login dan mendapatkan token' },
    { method: 'GET', path: '/api/profile', access: 'protected', description: 'Melihat profil user login' },
    { method: 'PUT', path: '/api/profile', access: 'protected', description: 'Mengubah profil user login' },
    { method: 'GET', path: '/api/categories', access: 'protected', description: 'Melihat daftar kategori sampah' },
    { method: 'POST', path: '/api/categories', access: 'protected', description: 'Menambah kategori sampah' },
    { method: 'GET', path: '/api/deposits', access: 'protected', description: 'Melihat riwayat setoran sampah' },
    { method: 'POST', path: '/api/deposits', access: 'protected', description: 'Membuat transaksi setoran sampah' },
    { method: 'GET', path: '/api/withdrawals', access: 'protected', description: 'Melihat riwayat penarikan saldo' },
    { method: 'POST', path: '/api/withdrawals', access: 'protected', description: 'Membuat transaksi penarikan saldo' },
    { method: 'GET', path: '/api/balance', access: 'protected', description: 'Melihat saldo user' },
    { method: 'GET', path: '/api/dashboard', access: 'protected', description: 'Melihat ringkasan dashboard' }
  ];
}


function sendText(res, statusCode, content, contentType) {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(content);
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.js') return 'application/javascript; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.svg') return 'image/svg+xml';
  return 'application/octet-stream';
}

function serveStatic(reqPath, res) {
  const publicDir = path.resolve(__dirname, '../public');
  const rawPath = reqPath === '/web' ? '/index.html' : reqPath.replace(/^\/public/, '');
  const requestedPath = path.resolve(publicDir, `.${rawPath}`);

  if (!requestedPath.startsWith(publicDir) || !fs.existsSync(requestedPath) || !fs.statSync(requestedPath).isFile()) {
    return false;
  }

  const content = fs.readFileSync(requestedPath);
  sendText(res, 200, content, getContentType(requestedPath));
  return true;
}

async function router(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;
  const path = url.pathname;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  if (method === 'GET' && (path === '/web' || path.startsWith('/public/'))) {
    const served = serveStatic(path, res);
    if (served) return;
    return error(res, 404, 'File frontend tidak ditemukan');
  }

  if (method === 'GET' && (path === '/' || path === '/api/routes')) {
    return success(res, 200, 'EcoCollect API aktif', {
      app: 'EcoCollect API UTS',
      version: '1.0.0',
      frontend: '/web',
      endpoints: getEndpointList()
    });
  }

  try {
    const body = ['POST', 'PUT', 'PATCH'].includes(method) ? await parseBody(req) : {};
    let result;

    if (method === 'POST' && path === '/api/auth/register') {
      result = authController.register(body);
      return result.status >= 400
        ? error(res, result.status, result.message, result.details || null)
        : success(res, result.status, result.message, result.data);
    }

    if (method === 'POST' && path === '/api/auth/login') {
      result = authController.login(body);
      return result.status >= 400
        ? error(res, result.status, result.message, result.details || null)
        : success(res, result.status, result.message, result.data);
    }

    let authUser;
    try {
      authUser = authenticate(req);
    } catch (authError) {
      return error(res, 401, authError.message);
    }

    if (method === 'GET' && path === '/api/profile') {
      result = profileController.getProfile(authUser);
    } else if (method === 'PUT' && path === '/api/profile') {
      result = profileController.updateProfile(authUser, body);
    } else if (method === 'GET' && path === '/api/categories') {
      result = categoryController.getCategories();
    } else if (method === 'POST' && path === '/api/categories') {
      result = categoryController.createCategory(body);
    } else if (method === 'GET' && path === '/api/deposits') {
      result = depositController.getDeposits(authUser);
    } else if (method === 'POST' && path === '/api/deposits') {
      result = depositController.createDeposit(authUser, body);
    } else if (method === 'GET' && path === '/api/withdrawals') {
      result = withdrawalController.getWithdrawals(authUser);
    } else if (method === 'POST' && path === '/api/withdrawals') {
      result = withdrawalController.createWithdrawal(authUser, body);
    } else if (method === 'GET' && path === '/api/balance') {
      result = dashboardController.getBalance(authUser);
    } else if (method === 'GET' && path === '/api/dashboard') {
      result = dashboardController.getDashboard(authUser);
    } else {
      return error(res, 404, 'Endpoint tidak ditemukan');
    }

    return result.status >= 400
      ? error(res, result.status, result.message, result.details || null)
      : success(res, result.status, result.message, result.data);
  } catch (err) {
    return error(res, 500, 'Terjadi kesalahan pada server', err.message);
  }
}

module.exports = router;
