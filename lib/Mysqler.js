'use strict';

class Mysqler {
  constructor(actor, config) {
    this.actor = actor;
    this.config = config;
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

  end(clbk) {
    this.actor.end(clbk);
  }
}

module.exports = Mysqler;
