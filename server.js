const express = require('express');
const session = require('express-session')

const UserRouter = require('./database/users/user-router');
const KnexSessionStore = require('connect-session-knex')(session);


const server = express();

server.use(logger)
server.use(express.json());
server.use(session(sessionConfig));
server.use('/api/users', UserRouter);


const sessionConfig = {
  name: 'test',
  secret: 'keep this with you till death!',
  cookie: {
    maxAge: 1000 * 60 * 60, 
    secure: false, // with secure, the cookie only gets set when https !!
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require('./database/db-config'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
}

function logger(req, res, next) {
    console.log(`${req.method} to ${req.originalUrl}`)
    next();
  }

module.exports = server;