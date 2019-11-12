const express = require('express');
const session = require('express-session')

const UserRouter = require('./database/users/user-router');


const server = express();

server.use(logger)
server.use(express.json());
server.use(session(sessionConfig));
server.use('/api/users', UserRouter);

function logger(req, res, next) {
    console.log(`${req.method} to ${req.originalUrl}`)
    next();
  }

module.exports = server;