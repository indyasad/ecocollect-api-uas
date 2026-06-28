const { readDb, writeDb, sanitizeUser } = require('../database/db');

function getProfile(authUser) {
  const db = readDb();
  const user = db.users.find((item) => item.id === authUser.id);
  return {
    status: 200,
    message: 'Data profil berhasil diambil',
    data: sanitizeUser(user)
  };
}

function updateProfile(authUser, body) {
  const db = readDb();
  const userIndex = db.users.findIndex((item) => item.id === authUser.id);

  if (userIndex === -1) {
    return { status: 404, message: 'User tidak ditemukan' };
  }

  if (body.name && body.name.trim().length < 3) {
    return { status: 400, message: 'Nama minimal 3 karakter' };
  }

  db.users[userIndex] = {
    ...db.users[userIndex],
    name: body.name ? body.name.trim() : db.users[userIndex].name,
    phone: body.phone ? body.phone.trim() : db.users[userIndex].phone,
    address: body.address !== undefined ? body.address : db.users[userIndex].address,
    updated_at: new Date().toISOString()
  };

  writeDb(db);

  return {
    status: 200,
    message: 'Profil berhasil diperbarui',
    data: sanitizeUser(db.users[userIndex])
  };
}

module.exports = { getProfile, updateProfile };
