'use strict';

const should = require('chai').should();
const mysqler = require('../index.js');
const Connection = require('../lib/Connection');
const Pool = require('../lib/Pool');

describe('mysqler', () => {
  describe('createConnection()', () => {
    it('should get Connection', () => {
      mysqler.createConnection({}).should.instanceOf(Connection);
    });
  });
  describe('createPool()', () => {
    it('should get Pool', () => {
      mysqler.createPool({}).should.instanceOf(Pool);
    });
  });
  describe('escape()', () => {
    it('should escape string as value', () => {
      const str = "a'b";
      const expected = "'a\\'b'";
      mysqler.escape(str).should.eql(expected);
    });
  });
  describe('escapeId()', () => {
    it('should escape string as id', () => {
      const str = 'ab';
      const expected = '`ab`';
      mysqler.escapeId(str).should.eql(expected);
    });
  });
});
