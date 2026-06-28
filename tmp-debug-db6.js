const fs = require('fs');
const path = require('path');
const dataDir = path.resolve('data');
const dbPath = path.join(dataDir, 'db.json');
const tmpPath = path.join(dataDir, 'tmp-debug-db6.txt');
const content = 'hello world';
console.log('dbPath', dbPath);

function safe(name, fn) {
    try {
        fn();
        console.log(name, 'ok');
    } catch (err) {
        console.error(name, 'err', err.code, err.errno, err.syscall, err.message);
    }
}
safe('writeFileSync db', () => fs.writeFileSync(dbPath, content));
safe('createWriteStream db', () => {
    const ws = fs.createWriteStream(dbPath);
    ws.write(content);
    ws.end();
});
fs.writeFile(tmpPath, content, (err) => {
    if (err) return console.error('writeFile db async err', err.code, err.message);
    console.log('writeFile db async ok');
    fs.unlinkSync(tmpPath);
    console.log('tmp clean ok');
});