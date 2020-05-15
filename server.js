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

  // app.use('/participants', require('./routers/participant'));
  // app.use('/researchers', require('./routers/researcher'));
  // app.use('/studies', require('./routers/study'));
  // app.use('/organisations', require('./routers/organisation'));
  app.use('/tags', require('./routers/tag'));
  app.use('/users', require('./routers/user'));
  // app.use('/options', require('./routers/option'));
  // app.use('/questions', require('./routers/question'));

  return app;
}

module.exports = createServer();
