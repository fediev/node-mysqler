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
  describe('constructor', () => {
    let pool;
    before(() => {
      pool = mysqler.createPool(config);
    });
    after(() => {
      pool.end();
    });
    it('should set actor with mysql Pool instance', () => {
      pool.should.have.property('actor');
      pool.should.have.property('config');
      return pool.query('SELECT 1+1 AS s1').should.become([{ s1: 2 }]);
    });
  });
});
