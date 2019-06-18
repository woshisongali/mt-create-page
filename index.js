#!/usr/bin/env node

require('./src/commander.js');
const server = require('./src/server.js');

server.serverStart();
console.log('to start the test');