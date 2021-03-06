/**
 * @fileOverview Test sql statement helper module.
 * @author fediev
 */

/* eslint-disable no-empty-function, no-unused-expressions */

// eslint-disable-next-line no-unused-vars
const should = require('chai').should();
const Sql = require('../lib/Sql');

describe('Sql', () => {
  describe('selectFields()', () => {
    it('should get * from empty string', () => {
      const fields = '';
      const expected = '*';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get * from string *', () => {
      const fields = '*';
      const expected = '*';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get sum(*) from string sum(*)', () => {
      const fields = 'sum(*)';
      const expected = 'sum(*)';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get * from length = 0 array', () => {
      const fields = [];
      const expected = '*';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get field list from length = 1 array', () => {
      const fields = ['a'];
      const expected = '`a`';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get field list from length > 1 array', () => {
      const fields = ['a', 'b', 'c'];
      const expected = '`a`, `b`, `c`';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get mysql function field in array', () => {
      const fields = ['a', 'SUM(a)', 'AVG(a)'];
      const expected = '`a`, SUM(a), AVG(a)';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get AS alias field in array', () => {
      const fields = ['a', 'SUM(a) AS s1', 'AVG(a) as a1'];
      const expected = '`a`, SUM(a) AS s1, AVG(a) as a1';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get * from object {}', () => {
      const fields = {};
      const expected = '*';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get alias field list from property count = 1 object', () => {
      const fields = { a: 'b' };
      const expected = '`a` AS b';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get alias field list from property count > 1 object', () => {
      const fields = { a: 'b', c: 'd' };
      const expected = '`a` AS b, `c` AS d';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get * from invalid types', () => {
      // eslint-disable-next-line no-undefined
      const arr = [undefined, true, 10, () => {}];
      const expected = '*';
      arr.forEach((fields) => {
        Sql.selectFields(fields).should.eql(expected);
      });
    });
  });
  describe('insertInfos()', () => {
    it('should get empty string and () from non-object', () => {
      const infos = 'abc';
      const expected = {
        fields: '()',
        values: '()',
      };
      Sql.insertInfos(infos).should.eql(expected);
    });
    it('should get empty string and () from object {}', () => {
      const infos = {};
      const expected = {
        fields: '()',
        values: '()',
      };
      Sql.insertInfos(infos).should.eql(expected);
    });
    it('should get infos from property count = 1 object', () => {
      const infos = { a: 1 };
      const expected = {
        fields: '(`a`)',
        values: '(1)',
      };
      Sql.insertInfos(infos).should.eql(expected);
    });
    it('should not escape string NOW()', () => {
      const infos = { a: 'NOW()' };
      const expected = '(NOW())';
      Sql.insertInfos(infos).values.should.eql(expected);
    });
    it('should get infos from property count > 1 object', () => {
      const infos = { a: 1, b: 'c', d: 'NOW()' };
      const expected = {
        fields: '(`a`, `b`, `d`)',
        values: "(1, 'c', NOW())",
      };
      Sql.insertInfos(infos).should.eql(expected);
    });
    it('should get infos from length = 0 array', () => {
      const infos = [];
      const expected = {
        fields: '()',
        values: '()',
      };
      Sql.insertInfos(infos).should.eql(expected);
    });
    it('should get infos from length = 1 array', () => {
      const infos = [5];
      const expected = {
        fields: '()',
        values: '(5)',
      };
      Sql.insertInfos(infos).should.eql(expected);
    });
    it('should get infos from length > 1 array', () => {
      const infos = [2, 'a', 'NOW()'];
      const expected = {
        fields: '()',
        values: "(2, 'a', NOW())",
      };
      Sql.insertInfos(infos).should.eql(expected);
    });
  });
  describe('updateInfos()', () => {
    it('should get string from string', () => {
      const infos = 'a = 1';
      const expected = 'a = 1';
      Sql.updateInfos(infos).should.eql(expected);
    });
    it('should get empty string from length = 0 array', () => {
      const infos = [];
      const expected = '';
      Sql.updateInfos(infos).should.eql(expected);
    });
    it('should get infos from length = 1 array', () => {
      const infos = ['a = 1'];
      const expected = 'a = 1';
      Sql.updateInfos(infos).should.eql(expected);
    });
    it('should get infos from length > 1 array', () => {
      const infos = ['a = 1', 'b = 2', "c = '3'"];
      const expected = "a = 1, b = 2, c = '3'";
      Sql.updateInfos(infos).should.eql(expected);
    });
    it('should get empty string from object {}', () => {
      const infos = {};
      const expected = '';
      Sql.updateInfos(infos).should.eql(expected);
    });
    it('should get infos from property count = 1 object', () => {
      const infos = { a: 1 };
      const expected = '`a` = 1';
      Sql.updateInfos(infos).should.eql(expected);
    });
    it('should not escape NOW()', () => {
      const infos = { a: 'NOW()' };
      const expected = '`a` = NOW()';
      Sql.updateInfos(infos).should.eql(expected);
    });
    it('should get infos from property count > 1 object', () => {
      const infos = { a: 1, b: 'c', d: 'NOW()' };
      const expected = "`a` = 1, `b` = 'c', `d` = NOW()";
      Sql.updateInfos(infos).should.eql(expected);
    });
    it('should get empty string from invalid types', () => {
      // eslint-disable-next-line no-undefined
      const arr = [undefined, true, 10, () => {}];
      const expected = '';
      arr.forEach((infos) => {
        Sql.updateInfos(infos).should.eql(expected);
      });
    });
  });
  describe('where()', () => {
    it('should get wheres from string', () => {
      const wheres = 'a = 1';
      const expected = 'WHERE a = 1';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get empty string from empty string', () => {
      const wheres = '';
      const expected = '';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get wheres from length = 1 array without command', () => {
      const wheres = ['a = 1'];
      const expected = 'WHERE a = 1';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get wheres from length > 1 array without command', () => {
      const wheres = ['a = 1', 'b = c'];
      const expected = 'WHERE a = 1 AND b = c';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get empty string from length = 1 array with command', () => {
      const wheres = ['OR'];
      const expected = '';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get wheres from length = 2 array with command', () => {
      const wheres = ['OR', 'a = 1'];
      const expected = 'WHERE a = 1';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get wheres from length > 2 array with command OR', () => {
      const wheres = ['or', 'a = 1', 'b = c'];
      const expected = 'WHERE a = 1 OR b = c';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get wheres from length > 2 array with command AND', () => {
      const wheres = ['and', 'a = 1', 'b = c'];
      const expected = 'WHERE a = 1 AND b = c';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get empty string from length = 0 array', () => {
      const wheres = [];
      const expected = '';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get wheres from property count = 1 object', () => {
      const wheres = { a: 1 };
      const expected = 'WHERE `a` = 1';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get IN where from array-value property object', () => {
      const wheres = { a: [1, 2, 3] };
      const expected = 'WHERE `a` IN (1, 2, 3)';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get wheres from property count > 1 object', () => {
      const wheres = { a: 1, b: [1, 2, 3], c: 4 };
      const expected = 'WHERE `a` = 1 AND `b` IN (1, 2, 3) AND `c` = 4';
      Sql.where(wheres).should.eql(expected);
    });
    it('should get empty string from invalid types', () => {
      // eslint-disable-next-line no-undefined
      const arr = [undefined, true, 10, () => {}];
      const expected = '';
      arr.forEach((wheres) => {
        Sql.where(wheres).should.eql(expected);
      });
    });
  });
  describe('orderBy()', () => {
    it('should get orders from string', () => {
      const orders = 'a ASC, b DESC';
      const expected = 'ORDER BY a ASC, b DESC';
      Sql.orderBy(orders).should.eql(expected);
    });
    it('should get empty string from empty string', () => {
      const orders = '';
      const expected = '';
      Sql.orderBy(orders).should.eql(expected);
    });
    it('should get orders from length = 1 array', () => {
      const orders = ['a ASC'];
      const expected = 'ORDER BY a ASC';
      Sql.orderBy(orders).should.eql(expected);
    });
    it('should get orders from length > 1 array', () => {
      const orders = ['a ASC', 'b DESC'];
      const expected = 'ORDER BY a ASC, b DESC';
      Sql.orderBy(orders).should.eql(expected);
    });
    it('should get empty string from length = 0 array', () => {
      const orders = [];
      const expected = '';
      Sql.orderBy(orders).should.eql(expected);
    });
    it('should get orders from property count = 1 object', () => {
      const orders = { a: 'ASC' };
      const expected = 'ORDER BY `a` ASC';
      Sql.orderBy(orders).should.eql(expected);
    });
    it('should get orders from property count > 1 object', () => {
      const orders = { a: 'ASC', b: 'DESC' };
      const expected = 'ORDER BY `a` ASC, `b` DESC';
      Sql.orderBy(orders).should.eql(expected);
    });
    it('should get DESC from object property value false', () => {
      const orders = { a: false };
      const expected = 'ORDER BY `a` DESC';
      Sql.orderBy(orders).should.eql(expected);
    });
    it('should get ASC from object property value invalid', () => {
      const orders = { a: 10 };
      const expected = 'ORDER BY `a` ASC';
      Sql.orderBy(orders).should.eql(expected);
    });
    it('should get empty string from invalid types', () => {
      // eslint-disable-next-line no-undefined
      const arr = [undefined, true, 10, () => {}];
      const expected = '';
      arr.forEach((orders) => {
        Sql.orderBy(orders).should.eql(expected);
      });
    });
  });
  describe('limit()', () => {
    it('should get limits from number', () => {
      const limits = 5;
      const expected = 'LIMIT 5';
      Sql.limit(limits).should.eql(expected);
    });
    it('should get limits from number 0', () => {
      const limits = 0;
      const expected = 'LIMIT 0';
      Sql.limit(limits).should.eql(expected);
    });
    it('should get limits from string', () => {
      const limits = '5 OFFSET 10';
      const expected = 'LIMIT 5 OFFSET 10';
      Sql.limit(limits).should.eql(expected);
    });
    it('should get limits from length = 1 array', () => {
      const limits = [5];
      const expected = 'LIMIT 5';
      Sql.limit(limits).should.eql(expected);
    });
    it('should get limits from length = 2 array', () => {
      const limits = [5, 10];
      const expected = 'LIMIT 5, 10';
      Sql.limit(limits).should.eql(expected);
    });
    it('should get limits from object with property count', () => {
      const limits = { count: 5 };
      const expected = 'LIMIT 5';
      Sql.limit(limits).should.eql(expected);
    });
    it('should get limits from object with property count and offset', () => {
      const limits = { count: 5, offset: 10 };
      const expected = 'LIMIT 5 OFFSET 10';
      Sql.limit(limits).should.eql(expected);
    });
    it('should get empty string from object without property count', () => {
      const limits = { offset: 5 };
      const expected = '';
      Sql.limit(limits).should.eql(expected);
    });
    it('should get empty string from invalid values', () => {
      // eslint-disable-next-line no-undefined
      const arr = [undefined, true, '', [], {}, () => {}];
      const expected = '';
      arr.forEach((limits) => {
        Sql.limit(limits).should.eql(expected);
      });
    });
  });
  describe('select()', () => {
    it('should make select sql on tb', () => {
      const tb = 'tdb_select';
      const expected = 'SELECT * FROM `tdb_select`';
      Sql.select(tb).should.eql(expected);
    });
    it('should make select sql on tb, fields', () => {
      const tb = 'tdb_select';
      const fields = ['a'];
      const expected = 'SELECT `a` FROM `tdb_select`';
      Sql.select(tb, fields).should.eql(expected);
    });
    it('should make select sql on tb, fields, wheres', () => {
      const tb = 'tdb_select';
      const fields = ['a'];
      const wheres = { a: 1 };
      const expected = 'SELECT `a` FROM `tdb_select` WHERE `a` = 1';
      Sql.select(tb, fields, wheres).should.eql(expected);
    });
    it('should make select sql on tb, fields, wheres, orders', () => {
      const tb = 'tdb_select';
      const fields = ['a'];
      const wheres = { a: 1 };
      const orders = { a: 'DESC' };
      const expected = 'SELECT `a` FROM `tdb_select` WHERE `a` = 1'
                     + ' ORDER BY `a` DESC';
      Sql.select(tb, fields, wheres, orders).should.eql(expected);
    });
    it('should make select sql on tb, fields, wheres, orders, limits', () => {
      const tb = 'tdb_select';
      const fields = ['a'];
      const wheres = { a: 1 };
      const orders = { a: 'DESC' };
      const limits = [5, 10];
      const expected = 'SELECT `a` FROM `tdb_select` WHERE `a` = 1'
                     + ' ORDER BY `a` DESC LIMIT 5, 10';
      Sql.select(tb, fields, wheres, orders, limits).should.eql(expected);
    });
    it('should make select sql correctly with empty values', () => {
      const tb = 'tdb_select';
      const fields = '';
      const wheres = '';
      const orders = '';
      const limits = [5, 10];
      const expected = 'SELECT * FROM `tdb_select` LIMIT 5, 10';
      Sql.select(tb, fields, wheres, orders, limits).should.eql(expected);
    });
  });
  describe('insert()', () => {
    it('should make insert sql with object infos', () => {
      const tb = 'tdb';
      const infos = { id: '', name: 'a', point: 5, time: 'NOW()' };
      const expected = 'INSERT INTO `tdb` (`id`, `name`, `point`, `time`)'
                     + " VALUES ('', 'a', 5, NOW())";
      Sql.insert(tb, infos).should.eql(expected);
    });
    it('should make insert sql with array infos', () => {
      const tb = 'tdb';
      const infos = ['', 'a', 5, 'NOW()'];
      const expected = 'INSERT INTO `tdb` ()'
                     + " VALUES ('', 'a', 5, NOW())";
      Sql.insert(tb, infos).should.eql(expected);
    });
    it('should make insert sql with object {}', () => {
      const tb = 'tdb';
      const infos = {};
      const expected = 'INSERT INTO `tdb` () VALUES ()';
      Sql.insert(tb, infos).should.eql(expected);
    });
    it('should make insert sql with invalid values', () => {
      const tb = 'tdb';
      // eslint-disable-next-line no-undefined
      const arr = [undefined, true, 5, '_INVALID_TYPE_', [], {}, () => {}];
      const expected = 'INSERT INTO `tdb` () VALUES ()';
      arr.forEach((infos) => {
        Sql.insert(tb, infos).should.eql(expected);
      });
    });
  });
  describe('update()', () => {
    it('should make update sql with string infos', () => {
      const tb = 'tdb';
      const infos = 'a = 1';
      const expected = 'UPDATE `tdb` SET a = 1';
      Sql.update(tb, infos).should.eql(expected);
    });
    it('should make update sql with array infos', () => {
      const tb = 'tdb';
      const infos = ['a = 1', 'b = c'];
      const expected = 'UPDATE `tdb` SET a = 1, b = c';
      Sql.update(tb, infos).should.eql(expected);
    });
    it('should make update sql with object infos', () => {
      const tb = 'tdb';
      const infos = { a: 1, b: 'c', d: 'NOW()' };
      const expected = "UPDATE `tdb` SET `a` = 1, `b` = 'c', `d` = NOW()";
      Sql.update(tb, infos).should.eql(expected);
    });
    it('should make update sql with infos, wheres, orders', () => {
      const tb = 'tdb';
      const infos = { a: 1 };
      const wheres = { a: 2 };
      const orders = { a: 'DESC' };
      const expected = 'UPDATE `tdb` SET `a` = 1 WHERE `a` = 2'
                     + ' ORDER BY `a` DESC';
      Sql.update(tb, infos, wheres, orders).should.eql(expected);
    });
    it('should make update sql correctly with empty values', () => {
      const tb = 'tdb';
      const infos = { a: 1 };
      const wheres = '';
      const orders = { a: 'DESC' };
      const expected = 'UPDATE `tdb` SET `a` = 1 ORDER BY `a` DESC';
      Sql.update(tb, infos, wheres, orders).should.eql(expected);
    });
  });
  describe('delete()', () => {
    it('should make delete sql with tb', () => {
      const tb = 'tdb';
      const expected = 'DELETE FROM `tdb`';
      Sql.delete(tb).should.eql(expected);
    });
    it('should make delete sql with tb, wheres', () => {
      const tb = 'tdb';
      const wheres = { a: 1 };
      const expected = 'DELETE FROM `tdb` WHERE `a` = 1';
      Sql.delete(tb, wheres).should.eql(expected);
    });
  });

  describe('isMysqlFunction()', () => {
    it('should return true on lower case without param', () => {
      const str = 'now()';
      const result = Sql.isMysqlFunction(str);
      result.should.be.true;
    });
    it('should return true on lower case with param', () => {
      const str = 'now(3)';
      const result = Sql.isMysqlFunction(str);
      result.should.be.true;
    });
    it('should return true on upper case without param', () => {
      const str = 'NOW()';
      const result = Sql.isMysqlFunction(str);
      result.should.be.true;
    });
    it('should return true on upper case with param', () => {
      const str = 'NOW(3)';
      const result = Sql.isMysqlFunction(str);
      result.should.be.true;
    });
    it('should return true on mixed case without param', () => {
      const str = 'Now()';
      const result = Sql.isMysqlFunction(str);
      result.should.be.true;
    });
    it('should return true on mixed case with param', () => {
      const str = 'Now(3)';
      const result = Sql.isMysqlFunction(str);
      result.should.be.true;
    });
    it('should return false on not listed function', () => {
      const str = '_NOT_LISTED_(3)';
      const result = Sql.isMysqlFunction(str);
      result.should.be.false;
    });
  });
});
