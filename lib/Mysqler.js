'use strict';

class Mysqler {
  constructor(actor, config) {
    this.actor = actor;
    this.config = config;
  }

  end(clbk) {
    this.actor.end(clbk);
  }

  query(sql) {
    const actor = this.actor;
    return new Promise((resolve, reject) => {
      actor.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Mysqler;
