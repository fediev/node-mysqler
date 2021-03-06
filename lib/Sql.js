/**
 * @fileOverview Sql statement helper module.
 * @author fediev
 * @module Sql
 */

'use strict';

const mysql = require('mysql');

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
    sql = (fields.length === 0) ? '*' : _getArraySelectFields(fields);
  } else if (typeof fields === 'object') {
    const arr = [];
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        const field = escapeId(key);
        const alias = fields[key];
        arr.push(`${field} AS ${alias}`);
      }
    }
    sql = (arr.length === 0) ? '*' : arr.join(', ');
  } else {
    sql = '*';
  }
  return sql;
}

function _getArraySelectFields(fields) {
  const escaped = fields.map((field) => {
    return (isMysqlFunction(field) || _hasAsAlias(field))
          ? field : escapeId(field);
  });
  return escaped.join(', ');
}

function _hasAsAlias(field) {
  const re = / AS /i;
  return re.test(field);
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

  const arrFields = [];
  const arrValues = [];
  for (const key in infos) {
    if (infos.hasOwnProperty(key)) {
      arrFields.push(escapeId(key));
      const val = isMysqlFunction(infos[key]) ? infos[key] : escape(infos[key]);
      arrValues.push(val);
    }
  }
  const sqlFields = Array.isArray(infos) ? '' : arrFields.join(', ');
  const sqlValues = arrValues.join(', ');
  return { fields: `(${sqlFields})`, values: `(${sqlValues})` };
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
    const arr = [];
    for (const key in infos) {
      if (infos.hasOwnProperty(key)) {
        const field = escapeId(key);
        const value = isMysqlFunction(infos[key])
                    ? infos[key] : escape(infos[key]);
        arr.push(`${field} = ${value}`);
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
 * Sql.where(['a = 1']);
 * // returns 'WHERE a = 1 AND b = c'
 * Sql.where(['a = 1', 'b = c']);
 * // returns 'WHERE a = 1 AND b = c'
 * Sql.where(['and', 'a = 1', 'b = c']);
 * // returns 'WHERE a = 1 OR b = c'
 * Sql.where(['or', 'a = 1', 'b = c']);
 * // returns 'WHERE `a` = 1'
 * Sql.where({ a: 1 });
 * // returns 'WHERE `a` IN (1, 2, 3)'
 * Sql.where({ a: [1, 2, 3] });
 * // returns 'WHERE `a` = 1 AND `b` IN (1, 2, 3) AND `c` = 4'
 * Sql.where({ a: 1, b: [1, 2, 3], c: 4 });
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
      sql = wheres.length > 0 ? wheres.join(` ${command} `) : '';
    } else {
      sql = wheres.length > 0 ? wheres.join(' AND ') : '';
    }
  } else if (typeof wheres === 'object') {
    const arr = [];
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
  return sql ? `WHERE ${sql}` : '';
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
 * Sql.orderBy(['a ASC']);
 * // returns 'ORDER BY ORDER BY a ASC, b DESC'
 * Sql.orderBy(['a ASC', 'b DESC']);
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
    const arr = [];
    for (const key in orders) {
      if (orders.hasOwnProperty(key)) {
        const field = escapeId(key);
        const val = orders[key];
        const dir = (strcmpi(val, 'DESC') || val === false) ? 'DESC' : 'ASC';
        arr.push(`${field} ${dir}`);
      }
    }
    sql = arr.join(', ');
  }
  return sql ? `ORDER BY ${sql}` : '';
}

/**
 * Make sql limit string.
 *
 * @param {number|string|Array|Object} limits Values to be compiled.
 * @returns {string} Returns compiled string.
 *
 * @example
 * // returns 'LIMIT 5'
 * Sql.limit(5);
 * // returns 'LIMIT 5 OFFSET 10'
 * Sql.limit('5 OFFSET 10');
 * // returns 'LIMIT 5'
 * Sql.limit([5]);
 * // returns 'LIMIT 5, 10'
 * Sql.limit([5, 10]);
 * // returns 'LIMIT 5'
 * Sql.limit({ count: 5 });
 * // returns 'LIMIT 5 OFFSET 10'
 * Sql.limit({ count: 5, offset: 10 });
 * // returns ''
 * Sql.limit();
 */
function limit(limits) {
  let sql = '';
  if (typeof limits === 'number' || typeof limits === 'string') {
    sql = `${limits}`;
  } else if (Array.isArray(limits) && limits.length > 0) {
    sql = limits[0] + (limits[1] ? `, ${limits[1]}` : '');
  } else if (typeof limits === 'object' && limits.count > 0) {
    const offset = limits.offset > 0 ? ` OFFSET ${limits.offset}` : '';
    sql = limits.count + offset;
  }
  return sql ? `LIMIT ${sql}` : '';
}

/**
 * Make select sql statement.
 *
 * @param {string} tb Table name.
 * @param {string|Array|Object} fields Field list.
 * @param {string|Array|Object} wheres Where options.
 * @param {string|Array|Object} orders Order by options.
 * @param {number|string|Array|Object} limits Limit options.
 * @returns {string} Returns compiled string.
 */
function select(tb, fields, wheres, orders, limits) {
  const sqls = [
    'SELECT',
    selectFields(fields),
    'FROM',
    escapeId(tb),
    where(wheres),
    orderBy(orders),
    limit(limits),
  ];
  // join non-emtpy string values only
  return sqls.filter(hasValue).join(' ');
}

/**
 * Make insert sql statement.
 *
 * @param {string} tb Table name.
 * @param {Object|Array} infos Insert fields and values.
 * @returns {string} Returns compiled string.
 */
function insert(tb, infos) {
  const pairs = insertInfos(infos);
  const sqls = [
    'INSERT INTO',
    escapeId(tb),
    pairs.fields,
    'VALUES',
    pairs.values,
  ];
  // join non-emtpy string values only
  return sqls.filter(hasValue).join(' ');
}

/**
 * Make update sql statement.
 *
 * @param {string} tb Table name.
 * @param {string|Array|Object} infos Update set infos.
 * @param {string|Array|Object} wheres Where options.
 * @param {string|Array|Object} orders Order by options.
 * @returns {string} Returns compiled string.
 */
function update(tb, infos, wheres, orders) {
  const sqls = [
    'UPDATE',
    escapeId(tb),
    'SET',
    updateInfos(infos),
    where(wheres),
    orderBy(orders),
  ];
  // join non-emtpy string values only
  return sqls.filter(hasValue).join(' ');
}

/**
 * Make delete sql statement.
 * Use `del` instead of `delete` that is the js keyword,
 * but exported method name is `delete`.
 *
 * @param {string} tb Table name.
 * @param {string|Array|Object} wheres Where options.
 * @returns {string} Returns compiled string.
 */
function del(tb, wheres) {
  const sqls = [
    'DELETE FROM',
    escapeId(tb),
    where(wheres),
  ];
  // join non-emtpy string values only
  return sqls.filter(hasValue).join(' ');
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

/**
 * Inner user only. Check if string has value.
 *
 * @param {string} str String value to check.
 * @returns {boolean} Return if string has value.
 */
function hasValue(str) {
  return !!str;
}

/**
 * Inner use only. Check if str is a mysql function.
 *
 * @param   {string} str string value to Check
 * @returns {boolean}
 */
function isMysqlFunction(str) {
  const funcs = [
    'NOW', 'LOCALTIME', 'LOCALTIMESTAMP', 'CURDATE', 'CURTIME', 'DATE',
    'ADDTIME', 'SUBTIME', 'TIMEDIF', 'ADDDATE', 'SUBDATE', 'DATEDIFF',
    'FROM_UNIXTIME', 'UNIX_TIMESTAMP', 'UTC_TIMESTAMP',
    'AVG', 'COUNT', 'MAX', 'MIN', 'SUM', 'CONCAT', 'HEX', 'LEFT', 'LENGTH',
    'LOWER', 'REPLACE', 'RIGHT', 'SUBSTR', 'UPPER',
  ];
  return funcs.some((func) => {
    const re = new RegExp('^' + func + '\\(.*\\)$', 'i');
    return re.test(str);
  });
}
// ---------------------------------------------------------------------

module.exports = {
  selectFields,
  insertInfos,
  updateInfos,
  where,
  orderBy,
  limit,
  select,
  insert,
  update,
  'delete': del,
  // export for testing
  isMysqlFunction,
};
