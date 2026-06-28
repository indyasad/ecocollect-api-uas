const fs = require('fs');
const path = require('path');
const dbPath = path.resolve('data', 'db.json');
const testPath = path.resolve('data', 'tmp-db-test.txt');
console.log('dbPath:', dbPath);
console.log('dbPath type:', typeof dbPath);
try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    console.log('read db.json OK:', raw.slice(0, 80).replace(/\n/g, ' '));
    fs.writeFileSync(dbPath, raw);
    console.log('write db.json OK');
} catch (e) {
    console.error('db.json write failed:', e);
}
try {
    fs.writeFileSync(testPath, 'hello world');
    console.log('write tmp file OK');
    const testContent = fs.readFileSync(testPath, 'utf8');
    console.log('tmp content:', testContent);
    fs.unlinkSync(testPath);
    console.log('tmp file removed');
} catch (e) {
    console.error('tmp file write failed:', e);
}