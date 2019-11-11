const knex = require('knex');

const knexConfig = require('../knexfile.js');

module.exports = knex(config[process.env.NODE.ENV]);