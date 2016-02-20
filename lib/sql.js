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

/**
 * Make sql update field and value list string.
 *
 * @param {string|Array|Object} infos Values to be compiled.
 * @returns {string} Returns compiled sql string.
 */
function updateInfos(infos) {
  let sql = '';
  if (typeof infos === 'string') {
    sql = infos;
  } else if (Array.isArray(infos)) {
    sql = infos.join(', ');
  } else if (typeof infos === 'object') {
    let arr = [];
    for (const key in infos) {
      if (infos.hasOwnProperty(key)) {
        const field = escapeId(key);
        const value = strcmpi(infos[key], 'NOW()')
                    ? 'NOW()' : escape(infos[key]);
        arr.push(field + ' = ' + value);
      }
    }
    sql = arr.join(', ');
  }
  return sql;
}

/**
 * Make sql where string.
 *
 * @param {string|Array|Object} wheres Values to be compiled.
 * @returns {string} Returns compiled sql string.
 *
 * @example
 * // returns 'WHERE a = 1'
 * Sql.where('a = 1');
 * // returns 'WHERE a = 1'
 * Sql.where([ 'a = 1' ]);
 * // returns 'WHERE a = 1 AND b = c'
 * Sql.where([ 'a = 1', 'b = c' ]);
 * // returns 'WHERE a = 1 AND b = c'
 * Sql.where([ 'and', 'a = 1', 'b = c' ]);
 * // returns 'WHERE a = 1 OR b = c'
 * Sql.where([ 'or', 'a = 1', 'b = c' ]);
 * // returns 'WHERE `a` = 1'
 * Sql.where({ a: 1 });
 * // returns 'WHERE `a` IN (1, 2, 3)'
 * Sql.where({ a: [ 1, 2, 3 ] });
 * // returns 'WHERE `a` = 1 AND `b` IN (1, 2, 3) AND `c` = 4'
 * Sql.where({ a: 1, b: [ 1, 2, 3 ], c: 4 });
 * // returns ''
 * Sql.where();
 */
function where(wheres) {
  let sql = '';
  if (typeof wheres === 'string') {
    sql = wheres;
  } else if (Array.isArray(wheres)) {
    if (strcmpi(wheres[0], 'OR') || strcmpi(wheres[0], 'AND')) {
      const command = wheres.shift().trim().toUpperCase();
      sql = wheres.length > 0 ? wheres.join(' ' + command + ' ') : '';
    } else {
      sql = wheres.length > 0 ? wheres.join(' AND ') : '';
    }
  } else if (typeof wheres === 'object') {
    let arr = [];
    for (const key in wheres) {
      if (wheres.hasOwnProperty(key)) {
        const value = wheres[key];
        const command = Array.isArray(value) ? ' IN (' : ' = ';
        const tail = Array.isArray(value) ? ')' : '';
        arr.push(escapeId(key) + command + escape(value) + tail);
      }
    }
    sql = arr.join(' AND ');
  }
  return sql ? ('WHERE ' + sql) : '';
}

/**
 * Make sql order by string.
 *
 * @param {string|Array|Object} orders Values to be compiled.
 * @returns {string} Returns compiled string.
 *
 * @example
 * // returns 'ORDER BY a ASC, b DESC'
 * Sql.orderBy('a ASC, b DESC');
 * // returns 'ORDER BY a ASC'
 * Sql.orderBy([ 'a ASC' ]);
 * // returns 'ORDER BY ORDER BY a ASC, b DESC'
 * Sql.orderBy([ 'a ASC', 'b DESC' ]);
 * // returns 'ORDER BY `a` ASC'
 * Sql.orderBy({ a: 'ASC' });
 * // returns 'ORDER BY `a` ASC, `b` DESC'
 * Sql.orderBy({ a: 'ASC', b: 'DESC' });
 * // returns 'ORDER BY `a` DESC'
 * Sql.orderBy({ a: false });
 * // returns 'ORDER BY `a` ASC, `b` DESC'
 * Sql.orderBy({ a: true, b: false });
 * // returns ''
 * Sql.orderBy();
 */
function orderBy(orders) {
  let sql = '';
  if (typeof orders === 'string') {
    sql = orders;
  } else if (Array.isArray(orders)) {
    sql = orders.join(', ');
  } else if (typeof orders === 'object') {
    let arr = [];
    for (const key in orders) {
      if (orders.hasOwnProperty(key)) {
        const val = orders[key];
        const dir = (strcmpi(val, 'DESC') || val === false) ? 'DESC' : 'ASC';
        arr.push(escapeId(key) + ' ' + dir);
      }
    }
    sql = arr.join(', ');
  }
  return sql ? ('ORDER BY ' + sql) : '';
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
  updateInfos,
  where,
  orderBy,
};
