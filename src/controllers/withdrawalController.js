const { readDb, writeDb, getNextId, sanitizeUser } = require('../database/db');

function getWithdrawals(authUser) {
  const db = readDb();
  const withdrawals = db.withdrawals.filter((item) => item.user_id === authUser.id);

  return {
    status: 200,
    message: 'Riwayat penarikan saldo berhasil diambil',
    data: withdrawals
  };
}

function createWithdrawal(authUser, body) {
  if (!body.amount || Number(body.amount) <= 0) {
    return { status: 400, message: 'amount wajib lebih dari 0' };
  }

  const db = readDb();
  const userIndex = db.users.findIndex((item) => item.id === authUser.id);

  if (userIndex === -1) {
    return { status: 404, message: 'User tidak ditemukan' };
  }

  const amount = Number(body.amount);
  const currentBalance = Number(db.users[userIndex].balance || 0);

  if (amount > currentBalance) {
    return { status: 400, message: 'Saldo tidak mencukupi' };
  }

  const withdrawal = {
    id: getNextId(db.withdrawals),
    user_id: authUser.id,
    amount,
    method: body.method || 'tunai',
    status: 'berhasil',
    note: body.note || '',
    created_at: new Date().toISOString()
  };

  db.withdrawals.push(withdrawal);
  db.users[userIndex].balance = currentBalance - amount;
  db.users[userIndex].updated_at = new Date().toISOString();

  writeDb(db);

  return {
    status: 201,
    message: 'Penarikan saldo berhasil dibuat',
    data: {
      withdrawal,
      current_user: sanitizeUser(db.users[userIndex])
    }
  };
}

module.exports = { getWithdrawals, createWithdrawal };
