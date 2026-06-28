const http = require('http');
const { port } = require('./src/config');
const router = require('./src/router');

const server = http.createServer(router);

server.listen(port, () => {
  console.log(`EcoCollect API berjalan di http://localhost:${port}`);
});
