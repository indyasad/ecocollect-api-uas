const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_DB_PATH = path.join(__dirname, '../../data/db.json');

function isUnsafeDatabasePath(dbPath) {
    return /onedrive/i.test(dbPath) || /[^\x00-\x7f]/.test(dbPath);
}

const DB_PATH = process.env.ECOCOLLECT_DB_PATH || (isUnsafeDatabasePath(DEFAULT_DB_PATH) ?
    path.join(os.homedir(), 'AppData', 'Local', 'ecocollect-api-uas', 'data', 'db.json') :
    DEFAULT_DB_PATH);

if (DB_PATH !== DEFAULT_DB_PATH) {
    console.warn(`EcoCollect: menggunakan path database fallback ${DB_PATH}`);
}

function ensureDatabase() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], categories: [], deposits: [], withdrawals: [] }, null, 2));
    }
}

function readDb() {
    ensureDatabase();
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
}

function writeDb(data) {
    ensureDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getNextId(collection) {
    if (!Array.isArray(collection) || collection.length === 0) return 1;
    return Math.max(...collection.map((item) => Number(item.id) || 0)) + 1;
}

function sanitizeUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
}

module.exports = {
    readDb,
    writeDb,
    getNextId,
    sanitizeUser
};