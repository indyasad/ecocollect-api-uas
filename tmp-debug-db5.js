const fs = require('fs');
const path = require('path');
const file = path.resolve('data', 'db.json');
console.log('file:', file);
console.log('exists:', fs.existsSync(file));

function safe(fn) {
    try {
        fn();
    } catch (err) {
        console.error(err.name, err.code, err.syscall, err.message);
    }
}

safe(() => {
    const fd = fs.openSync(file, 'r+');
    console.log('open r+ fd', fd);
    const written = fs.writeSync(fd, 'TEST', 0, 'utf8');
    console.log('writeSync r+ bytes', written);
    fs.closeSync(fd);
});

safe(() => {
    fs.appendFileSync(file, '\n');
    console.log('appendFileSync ok');
});

safe(() => {
    fs.writeFileSync(file, JSON.stringify({ ok: true }, null, 2));
    console.log('writeFileSync ok');
});