const app = require('./server/bin/bin.express');
const db = require('./server/bin/bin.db');
const routes = require('./server/bin/bin.routes');
const server = require('./server/bin/bin.server');
//const socket = require('./server/bin/bin.server.socket');

db();
routes(app);
server(app);
//socket(app);
