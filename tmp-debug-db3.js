const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const cwdReal = fs.realpathSync(cwd);
console.log('cwd:', cwd);
console.log('cwdReal:', cwdReal);
console.log('cwd exists:', fs.existsSync(cwd));
const rootFile = path.resolve('test-root-3.txt');
const dataDir = path.resolve('data');
const dataFile = path.join(dataDir, 'db.json');
const tmpFile = path.join(dataDir, 'tmp-debug-db3.txt');
console.log('rootFile:', rootFile);
console.log('dataDir:', dataDir);
console.log('dataFile:', dataFile);
console.log('dataDir exists:', fs.existsSync(dataDir));
console.log('dataFile exists:', fs.existsSync(dataFile));
try {
    console.log('access root write', fs.accessSync(cwd, fs.constants.W_OK));
} catch (e) {
    console.error('access root write err', e);
}
try {
    console.log('access data write', fs.accessSync(dataDir, fs.constants.W_OK));
} catch (e) {
    console.error('access data write err', e);
}
try {
    fs.writeFileSync(rootFile, 'hello root');
    console.log('root writeFileSync ok');
    fs.unlinkSync(rootFile);
    console.log('root remove ok');
} catch (e) {
    console.error('root writeFileSync err', e);
}
try {
    fs.writeFileSync(tmpFile, 'hello data');
    console.log('data writeFileSync ok');
    fs.unlinkSync(tmpFile);
    console.log('data remove ok');
} catch (e) {
    console.error('data writeFileSync err', e);
}
try {
    const fd = fs.openSync(dataFile, 'w');
    console.log('openSync w ok', fd);
    const written = fs.writeSync(fd, Buffer.from('hello'));
    console.log('writeSync bytes', written);
    fs.closeSync(fd);
    console.log('openSync write close ok');
} catch (e) {
    console.error('openSync write err', e);
}