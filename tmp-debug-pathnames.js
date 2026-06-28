const fs = require('fs');
const path = require('path');
const file = path.resolve('data', 'db.json');
const namespaced = path.toNamespacedPath(file);
console.log('file', file);
console.log('namespaced', namespaced);
console.log('exists', fs.existsSync(file));
console.log('exists namespaced', fs.existsSync(namespaced));
try {
    fs.writeFileSync(namespaced, JSON.stringify({ ok: true }, null, 2));
    console.log('write namespaced ok');
} catch (e) {
    console.error('namespaced err', e);
}