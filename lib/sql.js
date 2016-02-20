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

/**
 * Make sql insert field and value list string.
 *
 * @param {Object|Array} infos Values to be compiled.
 * @returns {string} Returns compiled string.
 */
function insertInfos(infos) {
  if (typeof infos !== 'object') {
    return { fields: '()', values: '()' };
  }

  let arrFields = [];
  let arrValues = [];
  for (const key in infos) {
    if (infos.hasOwnProperty(key)) {
      arrFields.push(escapeId(key));
      const val = strcmpi(infos[key], 'NOW()') ? 'NOW()' : escape(infos[key]);
      arrValues.push(val);
    }
  }
  const sqlFields = Array.isArray(infos)
                  ? '()' : ('(' + arrFields.join(', ') + ')');
  const sqlValues = '(' + arrValues.join(', ') + ')';
  return { fields: sqlFields, values: sqlValues };
}

// ---------------------------------------------------------------------

/**
 * Inner use only. Compare string case insensitive.
 * If value is not a string, it returns false.
 *
 * @param {string} str1 Value to compare.
 * @param {string} str2 Value to compare.
 * @returns {boolean} Return compare result.
 */
function strcmpi(str1, str2) {
  if (typeof str1 !== 'string' || typeof str2 !== 'string') {
    return false;
  } else {
    return str1.trim().toUpperCase() === str2.trim().toUpperCase();
  }
}

// ---------------------------------------------------------------------

module.exports = {
  selectFields,
  insertInfos,
};
