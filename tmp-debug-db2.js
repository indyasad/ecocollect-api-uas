const fs = require('fs');
const path = require('path');
const dir = path.resolve('data');
const dbPath = path.join(dir, 'db.json');
const tmpPath = path.join(dir, 'tmp-debug-db2.txt');
console.log('dir:', dir);
console.log('dbPath:', dbPath);
console.log('dir exists:', fs.existsSync(dir));
console.log('db exists:', fs.existsSync(dbPath));
console.log('dir stat:', fs.statSync(dir));
console.log('db stat:', fs.statSync(dbPath));
try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    console.log('read OK length', raw.length);
} catch (e) {
    console.error('read error', e);
}
try {
    const fd = fs.openSync(dbPath, 'r');
    console.log('open r ok', fd);
    fs.closeSync(fd);
} catch (e) {
    console.error('open r err', e);
}
try {
    const fd = fs.openSync(dbPath, 'r+');
    console.log('open r+ ok', fd);
    fs.closeSync(fd);
} catch (e) {
    console.error('open r+ err', e);
}
try {
    const fd = fs.openSync(dbPath, 'w');
    console.log('open w ok', fd);
    fs.writeSync(fd, 'test');
    fs.closeSync(fd);
    console.log('write direct ok');
} catch (e) {
    console.error('open w/write err', e);
}
try {
    fs.writeFileSync(tmpPath, 'hello');
    console.log('tmp writeFileSync ok', tmpPath);
    fs.unlinkSync(tmpPath);
    console.log('tmp removed');
} catch (e) {
    console.error('tmp writeFileSync err', e);
}