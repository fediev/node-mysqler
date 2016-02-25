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
    if (!pool.actor._closed) {
      pool.end();
    }
  });

  describe('constructor', () => {
    it('should set actor with mysql Pool instance', () => {
      pool.should.have.property('actor');
      pool.should.have.property('config');
      return pool.query('SELECT 1+1 AS s1').should.become([{ s1: 2 }]);
    });
  });
  describe('end()', () => {
    it('should end pool', () => {
      pool.end();
      pool.actor._closed.should.eql(true);
    });
  });
});
