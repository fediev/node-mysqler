'use strict';

class Mysqler {
  constructor(actor, config) {
    this.actor = actor;
    this.config = config;
    this.lastSql = '';
    this.numRows = null;
    this.affectedRows = null;
    this.changedRows = null;
    this.insertId = null;
  }

  end(clbk) {
    this.actor.end(clbk);
  }

  query(sql) {
    this.lastSql = sql;
    const actor = this.actor;
    return new Promise((resolve, reject) => {
      actor.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          this._setResultInfos(result);
          resolve(result);
        }
      });
    });
  }

  _setResultInfos(result) {
    if (Array.isArray(result)) {
      this.numRows = result.length;
      this.affectedRows = null;
      this.changedRows = null;
      this.insertId = null;
    } else {
      this.numRows = null;
      this.affectedRows = result.affectedRows;
      this.changedRows = result.changedRows;
      this.insertId = result.insertId;
    }
  }
}

module.exports = Mysqler;
