const { verifyToken } = require('../utils/jwt');
const { readDb, sanitizeUser } = require('../database/db');

function authenticate(req) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    throw new Error('Token wajib dikirim melalui header Authorization: Bearer <token>');
  }

  const decoded = verifyToken(token);
  const db = readDb();
  const user = db.users.find((item) => item.id === decoded.id);

  if (!user) {
    throw new Error('User pemilik token tidak ditemukan');
  }

  return sanitizeUser(user);
}

module.exports = { authenticate };
