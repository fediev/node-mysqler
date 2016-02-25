'use strict';

const mysql = require('mysql');
const Connection = require('./lib/Connection');
const Pool = require('./lib/Pool');

/**
 * Create a mysqler Connection instance.
 *
 * @param {Object} config Database connection configurations.
 * @returns {Connection} Returns a mysqler Connection instance.
 */
function createConnection(config) {
  return new Connection(config);
}

/**
 * Create a mysqler Pool instance.
 *
 * @param {Object} config Database connection configurations.
 * @returns {Pool} Returns a mysqler Pool instance.
 */
function createPool(config) {
  return new Pool(config);
}

const escape = mysql.escape;
const escapeId = mysql.escapeId;

module.exports = {
  createConnection,
  createPool,
  escape,
  escapeId,
};
