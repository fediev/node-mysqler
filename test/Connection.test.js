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
  describe('constructor', () => {
    let conn;
    before(() => {
      conn = mysqler.createConnection(config);
    });
    after(() => {
      conn.end();
    });
    it('should set actor with mysql Connection instance', () => {
      conn.should.have.property('actor');
      conn.should.have.property('config');
      return conn.query('SELECT 1+1 AS s1').should.become([{ s1: 2 }]);
    });
  });
});
