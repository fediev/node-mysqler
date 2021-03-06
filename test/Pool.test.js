/*eslint max-nested-callbacks: [2, 6] */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const should = chai.should();
const mysqler = require('../index.js');

const config = require('./config.json');

describe('Pool', () => {
  let actor;
  beforeEach(() => {
    actor = mysqler.createPool(config);
  });
  afterEach(() => {
    if (!actor._actor._closed) {
      actor.end();
    }
  });

  describe('constructor', () => {
    it('should set actor with mysql Pool instance', () => {
      actor.should.have.property('_actor');
      actor.should.have.property('config');
      return actor.query('SELECT 1+1 AS s1').should.become([{ s1: 2 }]);
    });
  });

  describe('end()', () => {
    it('should end pool', () => {
      actor.end();
      actor._actor._closed.should.eql(true);
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

  describe('queryValue()', () => {
    it('should be fulfilled on right sql', () => {
      const sql = 'SELECT 1+1 AS s';
      return actor.queryValue(sql).should.be.fulfilled;
    });
    it('should reject on wrong sql', () => {
      const sql = '_WRONG_SQL_';
      return actor.queryValue(sql).should.be.rejected;
    });
    it('should get value from row count > 1', () => {
      const sql = 'SELECT color FROM tbm_select';
      return actor.queryValue(sql)
      .then((result) => {
        result.should.not.be.an('array');
        result.should.not.be.an('object');
        result.should.eql('red');
      });
    });
    it('should get value from row count = 1', () => {
      const sql = 'SELECT color FROM tbm_select WHERE product = "mango"';
      return actor.queryValue(sql)
      .then((result) => {
        result.should.not.be.an('array');
        result.should.not.be.an('object');
        result.should.eql('yellow');
      });
    });
    it('should get undefined from row count = 0', () => {
      const sql = 'SELECT color FROM tbm_select WHERE product = "melon"';
      return actor.queryValue(sql)
      .then((result) => {
        should.not.exist(result);
      });
    });
    it('should get the first field value', () => {
      const sql = 'SELECT color, price, count FROM tbm_select';
      return actor.queryValue(sql)
      .then((result) => {
        result.should.not.be.an('array');
        result.should.not.be.an('object');
        result.should.eql('red');
      });
    });
    it('should get undefined on execute sql', () => {
      const sql = 'INSERT INTO tbm_insert_delete () VALUES ()';
      return actor.queryValue(sql)
      .then((result) => {
        should.not.exist(result);
      });
    });
  });

  describe('select()', () => {
    it('should select with tb', () => {
      const tb = 'tbm_select';
      return actor.select(tb)
      .then((result) => {
        result.should.have.lengthOf(6);
      });
    });
    it('should select with tb, fields', () => {
      const tb = 'tbm_select';
      const fields = ['product'];
      return actor.select(tb, fields)
      .then((result) => {
        result.should.have.lengthOf(6);
        result[0].should.have.property('product');
        result[0].should.have.not.property('color');
      });
    });
    it('should select with tb, fields, wheres', () => {
      const tb = 'tbm_select';
      const fields = ['product'];
      const wheres = { color: 'red' };
      return actor.select(tb, fields, wheres)
      .then((result) => {
        result.should.have.lengthOf(2);
      });
    });
    it('should select with tb, fields, wheres, orders', () => {
      const tb = 'tbm_select';
      const fields = ['product'];
      const wheres = { color: 'red' };
      const orders = { count: 'DESC' };
      return actor.select(tb, fields, wheres, orders)
      .then((result) => {
        result.should.have.lengthOf(2);
        result[0].should.have.property('product', 'strawberry');
      });
    });
    it('should select with tb, fields, wheres, orders, limits', () => {
      const tb = 'tbm_select';
      const fields = ['product'];
      const wheres = { color: 'red' };
      const orders = { count: 'DESC' };
      const limits = [1, 1];
      return actor.select(tb, fields, wheres, orders, limits)
      .then((result) => {
        result.should.have.lengthOf(1);
        result[0].should.have.property('product', 'apple');
      });
    });
    it('should select correctly with empty values', () => {
      const tb = 'tbm_select';
      const fields = '';
      const wheres = '';
      const orders = '';
      const limits = [2, 2];
      return actor.select(tb, fields, wheres, orders, limits)
      .then((result) => {
        result.should.have.lengthOf(2);
        result[0].should.have.property('product', 'mango');
      });
    });
  });

  describe('insert()', () => {
    it('should insert with object infos', () => {
      const tb = 'tbm_insert_delete';
      const infos = { product: 'papaya', color: 'green' };
      return actor.insert(tb, infos)
      .then((result) => {
        result.affectedRows.should.eql(1);
      });
    });
    it('should insert with array infos', () => {
      const tb = 'tbm_insert_delete';
      const infos = ['', 'watermelon', 'blue', 100, 30];
      return actor.insert(tb, infos)
      .then((result) => {
        result.affectedRows.should.eql(1);
      });
    });
    it('should insert with object {}', () => {
      const tb = 'tbm_insert_delete';
      const infos = {};
      return actor.insert(tb, infos)
      .then((result) => {
        result.affectedRows.should.eql(1);
      });
    });
  });

  describe('update()', () => {
    it('should update data with infos', () => {
      const tb = 'tbm_update';
      const infos = { price: 5 };
      return actor.update(tb, infos)
      .then((result) => {
        result.affectedRows.should.eql(6);
      });
    });
    it('should update data with infos, wheres', () => {
      const tb = 'tbm_update';
      const infos = { price: 99 };
      const wheres = { color: 'red' };
      return actor.update(tb, infos, wheres)
      .then((result) => {
        result.affectedRows.should.eql(2);
      });
    });
  });

  describe('delete()', () => {
    it('should delete data with infos', () => {
      const tb = 'tbm_insert_delete';
      const expected = 'DELETE_ALL_NOT_ALLOWED';
      return actor.delete(tb).should.be.rejectedWith(Error, expected);
    });
    it('should delete data with infos, wheres', () => {
      const tb = 'tbm_insert_delete';
      const wheres = { color: 'red' };
      return actor.insert(tb, wheres)
      .then(() => {
        return actor.delete(tb, wheres)
        .then((result) => {
          result.affectedRows.should.least(1);
        });
      });
    });
  });

  describe('getRow()', () => {
    it('should get a row with tb', () => {
      const tb = 'tbm_select';
      return actor.getRow(tb)
      .then((result) => {
        result.should.not.be.an('array');
        result.should.be.an('object');
        result.product.should.eql('apple');
        result.price.should.eql(100);
      });
    });
    it('should get a row with tb, fields', () => {
      const tb = 'tbm_select';
      const fields = ['product', 'color'];
      return actor.getRow(tb, fields)
      .then((result) => {
        result.product.should.eql('apple');
        should.not.exist(result.price);
      });
    });
    it('should get a row with tb, fields, wheres', () => {
      const tb = 'tbm_select';
      const fields = ['product', 'color'];
      const wheres = { color: 'yellow' };
      return actor.getRow(tb, fields, wheres)
      .then((result) => {
        result.product.should.eql('mango');
      });
    });
    it('should get a row with tb, fields, wheres, orders', () => {
      const tb = 'tbm_select';
      const fields = ['product', 'color'];
      const wheres = { color: 'yellow' };
      const orders = { count: 'DESC' };
      return actor.getRow(tb, fields, wheres, orders)
      .then((result) => {
        result.product.should.eql('banana');
      });
    });
    it('should get undefined when no result', () => {
      const tb = 'tbm_select';
      const fields = ['product', 'color'];
      const wheres = { color: '_NO_COLOR_' };
      return actor.getRow(tb, fields, wheres)
      .then((result) => {
        should.not.exist(result);
        (typeof result).should.eql('undefined');
      });
    });
  });

  describe('getValue()', () => {
    it('should get a value with tb', () => {
      const tb = 'tbm_select';
      return actor.getValue(tb)
      .then((result) => {
        result.should.not.be.an('array');
        result.should.not.be.an('object');
        result.should.eql(1);
      });
    });
    it('should get a value with tb, fields', () => {
      const tb = 'tbm_select';
      const fields = ['product', 'color'];
      const expected = 'apple';
      return actor.getValue(tb, fields).should.become(expected);
    });
    it('should get a value with tb, fields, wheres', () => {
      const tb = 'tbm_select';
      const fields = ['product', 'color'];
      const wheres = { color: 'yellow' };
      const expected = 'mango';
      return actor.getValue(tb, fields, wheres).should.become(expected);
    });
    it('should get a value with tb, fields, wheres, orders', () => {
      const tb = 'tbm_select';
      const fields = ['product', 'color'];
      const wheres = { color: 'yellow' };
      const orders = { count: 'DESC' };
      const expected = 'banana';
      return actor.getValue(tb, fields, wheres, orders).should.become(expected);
    });
    it('should get undefined when no result', () => {
      const tb = 'tbm_select';
      const fields = ['product', 'color'];
      const wheres = { color: '_NO_COLOR_' };
      return actor.getValue(tb, fields, wheres)
      .then((result) => {
        should.not.exist(result);
        (typeof result).should.eql('undefined');
      });
    });
  });

  describe('getCount()', () => {
    it('should get count with tb', () => {
      const tb = 'tbm_select';
      const expected = 6;
      return actor.getCount(tb).should.become(expected);
    });
    it('should get count with tb, fields, wheres', () => {
      const tb = 'tbm_select';
      const wheres = { color: 'yellow' };
      const expected = 2;
      return actor.getCount(tb, wheres).should.become(expected);
    });
    it('should get 0 when no result', () => {
      const tb = 'tbm_select';
      const wheres = { color: '_NO_COLOR_' };
      const expected = 0;
      return actor.getCount(tb, wheres).should.become(expected);
    });
  });

  describe('getSum()', () => {
    it('should get count with tb, field', () => {
      const tb = 'tbm_select';
      const field = 'count';
      const expected = 110;
      return actor.getSum(tb, field).should.become(expected);
    });
    it('should get count with tb, fields, wheres', () => {
      const tb = 'tbm_select';
      const field = 'count';
      const wheres = { color: 'yellow' };
      const expected = 45;
      return actor.getSum(tb, field, wheres).should.become(expected);
    });
    it('should get count with tb, fields, wheres, limits', () => {
      const tb = 'tbm_select';
      const field = 'count';
      const wheres = 'price < 100';
      const orders = { price: 'DESC' };
      const limits = 2;
      const expected = 50;
      return actor.getSum(tb, field, wheres, orders, limits)
             .should.become(expected);
    });
    it('should get 0 when no result', () => {
      const tb = 'tbm_select';
      const field = 'count';
      const wheres = { color: '_NO_COLOR_' };
      const expected = 0;
      return actor.getSum(tb, field, wheres).should.become(expected);
    });
  });

  describe('getTableFields()', () => {
    it('should get table field list', () => {
      const tb = 'tbm_select';
      const expected = ['id', 'product', 'color', 'price', 'count'];
      return actor.getTableFields(tb).should.become(expected);
    });
    it('should get ER_NO_SUCH_TABLE error on non exist table', () => {
      const tb = 'tbm_NOT_EXIST_';
      const expected = 'ER_NO_SUCH_TABLE';
      return actor.getTableFields(tb).should.be.rejectedWith(Error, expected);
    });
  });
});
