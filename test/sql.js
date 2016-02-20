/**
 * @fileOverview Test sql statement helper module.
 * @author fediev
 */

'use strict';

const should = require('chai').should();
const Sql = require('../lib/sql');

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
      const fields = [ 'a' ];
      const expected = '`a`';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get field list from length > 1 array', () => {
      const fields = [ 'a', 'b', 'c' ];
      const expected = '`a`, `b`, `c`';
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
    it('should get * from undefined', () => {
      /* eslint no-undefined: 0 */
      const fields = undefined;
      const expected = '*';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get * from boolean', () => {
      const fields = true;
      const expected = '*';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get * from number', () => {
      const fields = 10;
      const expected = '*';
      Sql.selectFields(fields).should.equal(expected);
    });
    it('should get * from function', () => {
      const fields = () => {};
      const expected = '*';
      Sql.selectFields(fields).should.equal(expected);
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
      const infos = { a: 'now()' };
      const expected = '(NOW())';
      Sql.insertInfos(infos).values.should.eql(expected);
    });
    it('should get infos from property count > 1 object', () => {
      const infos = { a: 1, b: 'c', d: 'now()' };
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
      const infos = [ 5 ];
      const expected = {
        fields: '()',
        values: '(5)',
      };
      Sql.insertInfos(infos).should.eql(expected);
    });
    it('should get infos from length > 1 array', () => {
      const infos = [ 2, 'a', 'Now()' ];
      const expected = {
        fields: '()',
        values: "(2, 'a', NOW())",
      };
      Sql.insertInfos(infos).should.eql(expected);
    });
  });
});
