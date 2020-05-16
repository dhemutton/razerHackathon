const express = require('express');
const http = require('http');
var cors = require('cors');
var bodyParser = require('body-parser');

function createServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  const server = http.createServer(app);

  server.keepAliveTimeout = 65000;

  // Database setup
  require('./database');

  
  app.use('/cards', require('./routers/card'));
  app.use('/documents', require('./routers/document'));
  app.use('/users', require('./routers/user'));


  return app;
}

module.exports = createServer();
