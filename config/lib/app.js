'use strict';

/**
 * Module dependencies.
 */
const config = require('../config'),
  mongooseService = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk'),
  seed = require('./mongo-seed');

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();
  }
}

module.exports.init = function init(callback) {
  mongooseService.connect(function (db) {
    // Initialize Models
    mongooseService.loadModels(seedDB);

    // Initialize express
    const app = express.init(db);
    if (callback) callback(app, db, config);

  });
};

module.exports.start = function start(callback) {
  const _this = this;

  _this.init(function (app, db, config) {

    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server URL
      const server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
      console.log(chalk.green('Server:          ' + server));
      console.log(chalk.green('Database:        ' + config.db.uri));
      console.log(chalk.green('App version:     ' + config.nodeApp.version));
      console.log('--');

      if (callback) callback(app, db, config);
    });

  });

};
