/*eslint max-nested-callbacks: [2, 6] */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const should = chai.should();
const mysqler = require('../index.js');
const Pool = require('../lib/Pool');

const config = require('./config.json');

describe('Pool', () => {
  let pool;
  beforeEach(() => {
    pool = mysqler.createPool(config);
  });
  afterEach(() => {
    if (!pool._actor._closed) {
      pool.end();
    }
  });

  describe('constructor', () => {
    it('should set actor with mysql Pool instance', () => {
      pool.should.have.property('_actor');
      pool.should.have.property('config');
      return pool.query('SELECT 1+1 AS s1').should.become([{ s1: 2 }]);
    });
  });

  describe('end()', () => {
    it('should end pool', () => {
      pool.end();
      pool._actor._closed.should.eql(true);
    });
  });

  describe('query()', () => {
    it('should select data', () => {
      const sql = 'SELECT * FROM tbm_select';
      return pool.query(sql)
      .then((result) => {
        result.should.have.lengthOf(6);
        const row = result[0];
        row.product.should.eql('apple');
      });
    });
    it('should update data and get affectedRows', () => {
      const sql = 'UPDATE tbm_update SET price = 10 WHERE color = "red"';
      return pool.query(sql)
      .then((result) => {
        result.affectedRows.should.eql(2);
      });
    });
    it('should update data and get changedRows', () => {
      const sql = 'UPDATE tbm_update SET price = 20 WHERE color = "red"';
      return pool.query(sql)
      .then((result) => {
        result.changedRows.should.eql(2);
      });
    });
    it('should insert data', () => {
      const sql = 'INSERT INTO tbm_insert_delete () VALUES (), ()';
      return pool.query(sql)
      .then((result) => {
        result.affectedRows.should.eql(2);
        result.insertId.should.be.above(6);
      });
    });
    it('should delete data', () => {
      const sql1 = 'SELECT * FROM tbm_insert_delete';
      return pool.query(sql1)
      .then((result1) => {
        const sql2 = 'DELETE FROM tbm_insert_delete';
        const expected = result1.length;
        return pool.query(sql2)
        .then((result2) => {
          result2.affectedRows.should.eql(expected);
        });
      });
    });
    it('should set this.lastSql', () => {
      const sql = 'SELECT * FROM tbm_select';
      return pool.query(sql)
      .then(() => {
        pool.lastSql.should.eql(sql);
      });
    });
    it('should set this.numRows on select', () => {
      const sql = 'SELECT * FROM tbm_select';
      return pool.query(sql)
      .then((result) => {
        const expected = result.length;
        pool.numRows.should.eql(expected);
        should.not.exist(pool.affectedRows);
        should.not.exist(pool.changedRows);
        should.not.exist(pool.insertId);
      });
    });
    it('should set this.affectedRows on update', () => {
      const sql = 'UPDATE tbm_update SET price = 30 WHERE color = "red"';
      return pool.query(sql)
      .then(() => {
        const expected = 2;
        should.not.exist(pool.numRows);
        pool.affectedRows.should.eql(expected);
        pool.changedRows.should.be.at.least(0);
        pool.insertId.should.eql(0);
      });
    });
    it('should set this.changedRows on update', () => {
      const sql = 'UPDATE tbm_update SET price = 40 WHERE color = "red"';
      return pool.query(sql)
      .then(() => {
        const expected = 2;
        should.not.exist(pool.numRows);
        pool.affectedRows.should.eql(expected);
        pool.changedRows.should.eql(expected);
        pool.insertId.should.eql(0);
      });
    });
    it('should set this.affectedRows, insertId on insert', () => {
      const sql = 'INSERT INTO tbm_insert_delete () VALUES (), ()';
      return pool.query(sql)
      .then(() => {
        const expected = 2;
        should.not.exist(pool.numRows);
        pool.affectedRows.should.eql(expected);
        pool.changedRows.should.eql(0);
        pool.insertId.should.be.above(6);
      });
    });
    it('should set this.affectedRows on delete', () => {
      const sql1 = 'SELECT * FROM tbm_insert_delete';
      return pool.query(sql1)
      .then((result) => {
        const sql2 = 'DELETE FROM tbm_insert_delete';
        const expected = result.length;
        return pool.query(sql2)
        .then(() => {
          should.not.exist(pool.numRows);
          pool.affectedRows.should.eql(expected);
          pool.changedRows.should.eql(0);
          pool.insertId.should.eql(0);
        });
      });
    });
  });
});
