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
  let actor;
  beforeEach(() => {
    actor = mysqler.createConnection(config);
  });
  afterEach(() => {
    if (actor._actor.state !== 'disconnected') {
      actor.end();
    }
  });

  describe('constructor', () => {
    it('should set actor with mysql Connection instance', () => {
      actor.should.have.property('_actor');
      actor.should.have.property('config');
      return actor.query('SELECT 1+1 AS s1').should.become([{ s1: 2 }]);
    });
  });

  describe('end()', ()=> {
    it('should end connection', () => {
      actor.end();
      actor._actor.state.should.eql('disconnected');
    });
  });

  describe('destroy()', ()=> {
    it('should destroy connection', () => {
      actor.destroy();
      actor._actor.state.should.eql('disconnected');
    });
  });

  describe('query()', () => {
    it('should be fulfilled on right sql', () => {
      const sql = 'SELECT 1+1 AS s';
      return actor.query(sql).should.be.fulfilled;
    });
    it('should be rejected on wrong sql', () => {
      const sql = '_WRONG_SQL_';
      return actor.query(sql).should.be.rejected;
    });
    it('should select data', () => {
      const sql = 'SELECT * FROM tbm_select';
      return actor.query(sql)
      .then((result) => {
        result.should.have.lengthOf(6);
        const row = result[0];
        row.product.should.eql('apple');
      });
    });
    it('should update data and get affectedRows', () => {
      const sql = 'UPDATE tbm_update SET price = 10 WHERE color = "red"';
      return actor.query(sql)
      .then((result) => {
        result.affectedRows.should.eql(2);
      });
    });
    it('should update data and get changedRows', () => {
      const sql = 'UPDATE tbm_update SET price = 20 WHERE color = "red"';
      return actor.query(sql)
      .then((result) => {
        result.changedRows.should.eql(2);
      });
    });
    it('should insert data', () => {
      const sql = 'INSERT INTO tbm_insert_delete () VALUES (), ()';
      return actor.query(sql)
      .then((result) => {
        result.affectedRows.should.eql(2);
        result.insertId.should.be.above(6);
      });
    });
    it('should delete data', () => {
      const sql1 = 'SELECT * FROM tbm_insert_delete';
      return actor.query(sql1)
      .then((result1) => {
        const sql2 = 'DELETE FROM tbm_insert_delete';
        const expected = result1.length;
        return actor.query(sql2)
        .then((result2) => {
          result2.affectedRows.should.eql(expected);
        });
      });
    });
    it('should set this.lastSql', () => {
      const sql = 'SELECT * FROM tbm_select';
      return actor.query(sql)
      .then(() => {
        actor.lastSql.should.eql(sql);
      });
    });
    it('should set this.numRows on select', () => {
      const sql = 'SELECT * FROM tbm_select';
      return actor.query(sql)
      .then((result) => {
        const expected = result.length;
        actor.numRows.should.eql(expected);
        should.not.exist(actor.affectedRows);
        should.not.exist(actor.changedRows);
        should.not.exist(actor.insertId);
      });
    });
    it('should set this.affectedRows on update', () => {
      const sql = 'UPDATE tbm_update SET price = 30 WHERE color = "red"';
      return actor.query(sql)
      .then(() => {
        const expected = 2;
        should.not.exist(actor.numRows);
        actor.affectedRows.should.eql(expected);
        actor.changedRows.should.be.at.least(0);
        actor.insertId.should.eql(0);
      });
    });
    it('should set this.changedRows on update', () => {
      const sql = 'UPDATE tbm_update SET price = 40 WHERE color = "red"';
      return actor.query(sql)
      .then(() => {
        const expected = 2;
        should.not.exist(actor.numRows);
        actor.affectedRows.should.eql(expected);
        actor.changedRows.should.eql(expected);
        actor.insertId.should.eql(0);
      });
    });
    it('should set this.affectedRows, insertId on insert', () => {
      const sql = 'INSERT INTO tbm_insert_delete () VALUES (), ()';
      return actor.query(sql)
      .then(() => {
        const expected = 2;
        should.not.exist(actor.numRows);
        actor.affectedRows.should.eql(expected);
        actor.changedRows.should.eql(0);
        actor.insertId.should.be.above(6);
      });
    });
    it('should set this.affectedRows on delete', () => {
      const sql1 = 'SELECT * FROM tbm_insert_delete';
      return actor.query(sql1)
      .then((result) => {
        const sql2 = 'DELETE FROM tbm_insert_delete';
        const expected = result.length;
        return actor.query(sql2)
        .then(() => {
          should.not.exist(actor.numRows);
          actor.affectedRows.should.eql(expected);
          actor.changedRows.should.eql(0);
          actor.insertId.should.eql(0);
        });
      });
    });
  });

  describe('queryRow()', () => {
    it('should be fulfilled on right sql', () => {
      const sql = 'SELECT 1+1 AS s';
      return actor.queryRow(sql).should.be.fulfilled;
    });
    it('should reject on wrong sql', () => {
      const sql = '_WRONG_SQL_';
      return actor.queryRow(sql).should.be.rejected;
    });
    it('should get a row from row count > 1', () => {
      const sql = 'SELECT * FROM tbm_select';
      return actor.queryRow(sql)
      .then((result) => {
        result.should.not.be.an('array');
        result.should.be.an('object');
        result.color.should.eql('red');
      });
    });
    it('should get a row from row count = 1', () => {
      const sql = 'SELECT * FROM tbm_select WHERE product = "mango"';
      return actor.queryRow(sql)
      .then((result) => {
        result.should.not.be.an('array');
        result.should.be.an('object');
        result.color.should.eql('yellow');
      });
    });
    it('should get undefined from row count = 0', () => {
      const sql = 'SELECT * FROM tbm_select WHERE product = "melon"';
      return actor.queryRow(sql)
      .then((result) => {
        should.not.exist(result);
      });
    });
    it('should get undefined on execute sql', () => {
      const sql = 'INSERT INTO tbm_insert_delete () VALUES ()';
      return actor.queryRow(sql)
      .then((result) => {
        should.not.exist(result);
      });
    });
  });
});
