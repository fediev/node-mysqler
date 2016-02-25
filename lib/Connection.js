'use strict';

const mysql = require('mysql');
const Mysqler = require('./Mysqler.js');

class Connection extends Mysqler {
  constructor(config) {
    const actor = mysql.createConnection(config);
    super(actor, config);
  }

  // only connection has destroy method
  destroy() {
    this._actor.destroy();
  }
}

module.exports = Connection;
