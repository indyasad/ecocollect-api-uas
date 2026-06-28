const { readDb, writeDb, getNextId, sanitizeUser } = require('../database/db');

function getDeposits(authUser) {
  const db = readDb();
  const deposits = db.deposits
    .filter((item) => item.user_id === authUser.id)
    .map((deposit) => ({
      ...deposit,
      category: db.categories.find((category) => category.id === deposit.category_id) || null
    }));

  return {
    status: 200,
    message: 'Riwayat setoran berhasil diambil',
    data: deposits
  };
}

function createDeposit(authUser, body) {
  if (!body.category_id) {
    return { status: 400, message: 'category_id wajib diisi' };
  }

  if (!body.weight_kg || Number(body.weight_kg) <= 0) {
    return { status: 400, message: 'weight_kg wajib lebih dari 0' };
  }

  const db = readDb();
  const userIndex = db.users.findIndex((item) => item.id === authUser.id);
  const category = db.categories.find((item) => item.id === Number(body.category_id));

  if (userIndex === -1) {
    return { status: 404, message: 'User tidak ditemukan' };
  }

  if (!category) {
    return { status: 404, message: 'Kategori sampah tidak ditemukan' };
  }

  const weightKg = Number(body.weight_kg);
  const totalAmount = weightKg * Number(category.price_per_kg);

  const deposit = {
    id: getNextId(db.deposits),
    user_id: authUser.id,
    category_id: category.id,
    weight_kg: weightKg,
    price_per_kg: Number(category.price_per_kg),
    total_amount: totalAmount,
    note: body.note || '',
    created_at: new Date().toISOString()
  };

  db.deposits.push(deposit);
  db.users[userIndex].balance = Number(db.users[userIndex].balance || 0) + totalAmount;
  db.users[userIndex].updated_at = new Date().toISOString();

  writeDb(db);

  return {
    status: 201,
    message: 'Setoran sampah berhasil dibuat',
    data: {
      deposit,
      current_user: sanitizeUser(db.users[userIndex])
    }
  };
}

module.exports = { getDeposits, createDeposit };
