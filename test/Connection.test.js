/*eslint max-nested-callbacks: [2, 6] */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const should = chai.should();
const mysqler = require('../index.js');
const Connection = require('../lib/Connection');

const config = require('./config.json');

describe('Connection', () => {
  let conn;
  beforeEach(() => {
    conn = mysqler.createConnection(config);
  });
  afterEach(() => {
    if (conn.actor.state !== 'disconnected') {
      conn.end();
    }
  });

  describe('constructor', () => {
    it('should set actor with mysql Connection instance', () => {
      conn.should.have.property('actor');
      conn.should.have.property('config');
      return conn.query('SELECT 1+1 AS s1').should.become([{ s1: 2 }]);
    });
  });

  describe('end()', ()=> {
    it('should end connection', () => {
      conn.end();
      conn.actor.state.should.eql('disconnected');
    });
  });

  describe('destroy()', ()=> {
    it('should destroy connection', () => {
      conn.destroy();
      conn.actor.state.should.eql('disconnected');
    });
  });

  describe('query()', () => {
    it('should select data', () => {
      const sql = 'SELECT * FROM tbm_select';
      return conn.query(sql)
      .then((result) => {
        result.should.have.lengthOf(6);
        const row = result[0];
        row.product.should.eql('apple');
      });
    });
    it('should update data and get affectedRows', () => {
      const sql = 'UPDATE tbm_update SET price = 10 WHERE color = "red"';
      return conn.query(sql)
      .then((result) => {
        result.affectedRows.should.eql(2);
      });
    });
    it('should update data and get changedRows', () => {
      const sql = 'UPDATE tbm_update SET price = 20 WHERE color = "red"';
      return conn.query(sql)
      .then((result) => {
        result.changedRows.should.eql(2);
      });
    });
    it('should insert data', () => {
      const sql = 'INSERT INTO tbm_insert_delete () VALUES (), ()';
      return conn.query(sql)
      .then((result) => {
        result.affectedRows.should.eql(2);
        result.insertId.should.be.above(6);
      });
    });
    it('should delete data', () => {
      const sql1 = 'SELECT * FROM tbm_insert_delete';
      return conn.query(sql1)
      .then((result1) => {
        const sql2 = 'DELETE FROM tbm_insert_delete';
        const expected = result1.length;
        return conn.query(sql2)
        .then((result2) => {
          result2.affectedRows.should.eql(expected);
        });
      });
    });
    it('should set this.lastSql', () => {
      const sql = 'SELECT * FROM tbm_select';
      return conn.query(sql)
      .then(() => {
        conn.lastSql.should.eql(sql);
      });
    });
    it('should set this.numRows on select', () => {
      const sql = 'SELECT * FROM tbm_select';
      return conn.query(sql)
      .then((result) => {
        const expected = result.length;
        conn.numRows.should.eql(expected);
        should.not.exist(conn.affectedRows);
        should.not.exist(conn.changedRows);
        should.not.exist(conn.insertId);
      });
    });
    it('should set this.affectedRows on update', () => {
      const sql = 'UPDATE tbm_update SET price = 30 WHERE color = "red"';
      return conn.query(sql)
      .then(() => {
        const expected = 2;
        should.not.exist(conn.numRows);
        conn.affectedRows.should.eql(expected);
        conn.changedRows.should.be.at.least(0);
        conn.insertId.should.eql(0);
      });
    });
    it('should set this.changedRows on update', () => {
      const sql = 'UPDATE tbm_update SET price = 40 WHERE color = "red"';
      return conn.query(sql)
      .then(() => {
        const expected = 2;
        should.not.exist(conn.numRows);
        conn.affectedRows.should.eql(expected);
        conn.changedRows.should.eql(expected);
        conn.insertId.should.eql(0);
      });
    });
    it('should set this.affectedRows, insertId on insert', () => {
      const sql = 'INSERT INTO tbm_insert_delete () VALUES (), ()';
      return conn.query(sql)
      .then(() => {
        const expected = 2;
        should.not.exist(conn.numRows);
        conn.affectedRows.should.eql(expected);
        conn.changedRows.should.eql(0);
        conn.insertId.should.be.above(6);
      });
    });
    it('should set this.affectedRows on delete', () => {
      const sql1 = 'SELECT * FROM tbm_insert_delete';
      return conn.query(sql1)
      .then((result) => {
        const sql2 = 'DELETE FROM tbm_insert_delete';
        const expected = result.length;
        return conn.query(sql2)
        .then(() => {
          should.not.exist(conn.numRows);
          conn.affectedRows.should.eql(expected);
          conn.changedRows.should.eql(0);
          conn.insertId.should.eql(0);
        });
      });
    });
  });
});
