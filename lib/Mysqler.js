'use strict';

const Sql = require('./Sql');

class Mysqler {
  constructor(actor, config) {
    this._actor = actor;
    this.config = config;
    this.lastSql = '';
    this.numRows = null;
    this.affectedRows = null;
    this.changedRows = null;
    this.insertId = null;
  }

  end(clbk) {
    this._actor.end(clbk);
  }

  query(sql) {
    this.lastSql = sql;
    const actor = this._actor;
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

  queryRow(sql) {
    return this.query(sql)
    .then((result) => {
      return result[0];
    });
  }

  queryValue(sql) {
    return this.query(sql)
    .then((result) => {
      const row = result[0];
      // eslint-disable-next-line no-undefined
      return row ? row[Object.keys(row)[0]] : undefined;
    });
  }

  select(tb, fields, wheres, orders, limits) {
    const sql = Sql.select(tb, fields, wheres, orders, limits);
    return this.query(sql);
  }

  insert(tb, infos) {
    const sql = Sql.insert(tb, infos);
    return this.query(sql);
  }

  update(tb, infos, wheres) {
    const sql = Sql.update(tb, infos, wheres);
    return this.query(sql);
  }

  delete(tb, wheres) {
    if (!Sql.where(wheres)) {
      return new Promise((resolve, reject) => {
        reject(new Error('DELETE_ALL_NOT_ALLOWED'));
      });
    }

    const sql = Sql.delete(tb, wheres);
    return this.query(sql);
  }

  getRow(tb, fields, wheres, orders) {
    const limits = 1;
    const sql = Sql.select(tb, fields, wheres, orders, limits);
    return this.queryRow(sql);
  }
}

module.exports = Mysqler;
