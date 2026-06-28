const { readDb } = require('../database/db');

function getBalance(authUser) {
  const db = readDb();
  const user = db.users.find((item) => item.id === authUser.id);

  return {
    status: 200,
    message: 'Saldo berhasil diambil',
    data: {
      balance: Number(user.balance || 0)
    }
  };
}

function getDashboard(authUser) {
  const db = readDb();
  const userDeposits = db.deposits.filter((item) => item.user_id === authUser.id);
  const userWithdrawals = db.withdrawals.filter((item) => item.user_id === authUser.id);
  const totalDepositAmount = userDeposits.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
  const totalWithdrawalAmount = userWithdrawals.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalWeightKg = userDeposits.reduce((sum, item) => sum + Number(item.weight_kg || 0), 0);

  return {
    status: 200,
    message: 'Ringkasan dashboard berhasil diambil',
    data: {
      user_id: authUser.id,
      current_balance: totalDepositAmount - totalWithdrawalAmount,
      total_deposit_amount: totalDepositAmount,
      total_withdrawal_amount: totalWithdrawalAmount,
      total_weight_kg: totalWeightKg,
      total_deposit_transaction: userDeposits.length,
      total_withdrawal_transaction: userWithdrawals.length
    }
  };
}

module.exports = { getBalance, getDashboard };
