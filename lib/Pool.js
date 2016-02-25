'use strict';

const mysql = require('mysql');
const Mysqler = require('./Mysqler.js');

class Pool extends Mysqler {
  constructor(config) {
    const actor = mysql.createPool(config);
    super(actor, config);
  }
}

module.exports = Pool;
