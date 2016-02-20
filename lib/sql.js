/**
 * @fileOverview Sql statement helper module.
 * @author fediev
 * @module Sql
 */

'use strict';

const mysql = require('mysql');

const format = mysql.format;
const escape = mysql.escape;
const escapeId = mysql.escapeId;

// ---------------------------------------------------------------------

/**
 * Make sql select field list string.
 *
 * @param {string|Array|Object} fields Values to be compiled.
 * @returns {string} Returns compiled string.
 */
function selectFields(fields) {
  let sql = '';
  if (typeof fields === 'string') {
    sql = (fields === '') ? '*' : fields;
  } else if (Array.isArray(fields)) {
    sql = (fields.length === 0) ? '*' : format('??', [ fields ]);
  } else if (typeof fields === 'object') {
    let arr = [];
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        arr.push(escapeId(key) + ' AS ' + fields[key]);
      }
    }
    sql = (arr.length === 0) ? '*' : arr.join(', ');
  } else {
    sql = '*';
  }
  return sql;
}

// ---------------------------------------------------------------------

module.exports = {
  selectFields,
};
