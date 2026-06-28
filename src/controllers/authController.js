const { readDb, writeDb, getNextId, sanitizeUser } = require('../database/db');
const { hashPassword, verifyPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

function validateRegister(body) {
  const errors = [];
  if (!body.name || body.name.trim().length < 3) errors.push('Nama minimal 3 karakter');
  if (!body.email || !body.email.includes('@')) errors.push('Email tidak valid');
  if (!body.password || body.password.length < 6) errors.push('Password minimal 6 karakter');
  if (!body.phone || body.phone.trim().length < 8) errors.push('Nomor HP minimal 8 karakter');
  return errors;
}

function register(body) {
  const errors = validateRegister(body);
  if (errors.length > 0) {
    return { status: 400, message: 'Validasi gagal', details: errors };
  }

  const db = readDb();
  const email = body.email.toLowerCase().trim();

  const existingUser = db.users.find((user) => user.email === email);
  if (existingUser) {
    return { status: 409, message: 'Email sudah terdaftar' };
  }

  const now = new Date().toISOString();
  const user = {
    id: getNextId(db.users),
    name: body.name.trim(),
    email,
    password: hashPassword(body.password),
    phone: body.phone.trim(),
    address: body.address || '',
    balance: 0,
    role: 'nasabah',
    created_at: now,
    updated_at: now
  };

  db.users.push(user);
  writeDb(db);

  return {
    status: 201,
    message: 'Registrasi berhasil',
    data: sanitizeUser(user)
  };
}

function login(body) {
  if (!body.email || !body.password) {
    return { status: 400, message: 'Email dan password wajib diisi' };
  }

  const db = readDb();
  const email = body.email.toLowerCase().trim();
  const user = db.users.find((item) => item.email === email);

  if (!user || !verifyPassword(body.password, user.password)) {
    return { status: 401, message: 'Email atau password salah' };
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return {
    status: 200,
    message: 'Login berhasil',
    data: {
      token,
      user: sanitizeUser(user)
    }
  };
}

module.exports = { register, login };
