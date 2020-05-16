const dotenv = require('dotenv').config();

const config = require('./config');
const createServer = require('./server');

const server = createServer;
server.listen(config.port, () => {
  console.log(`RazerBank server (${process.pid}) listening on *:${config.port}`);
});