const { readDb, writeDb, getNextId } = require('../database/db');

function getCategories() {
  const db = readDb();
  return {
    status: 200,
    message: 'Data kategori sampah berhasil diambil',
    data: db.categories
  };
}

function createCategory(body) {
  if (!body.name || body.name.trim().length < 2) {
    return { status: 400, message: 'Nama kategori minimal 2 karakter' };
  }

  if (!body.price_per_kg || Number(body.price_per_kg) <= 0) {
    return { status: 400, message: 'Harga per kg wajib lebih dari 0' };
  }

  const db = readDb();
  const duplicate = db.categories.find((item) => item.name.toLowerCase() === body.name.toLowerCase().trim());

  if (duplicate) {
    return { status: 409, message: 'Kategori sudah ada' };
  }

  const category = {
    id: getNextId(db.categories),
    name: body.name.trim(),
    price_per_kg: Number(body.price_per_kg),
    created_at: new Date().toISOString()
  };

  db.categories.push(category);
  writeDb(db);

  return {
    status: 201,
    message: 'Kategori berhasil ditambahkan',
    data: category
  };
}

module.exports = { getCategories, createCategory };
