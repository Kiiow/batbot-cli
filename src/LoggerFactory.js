const LoggerFactory = new (require('./Services/Logger'))("appLogger");

/**
 * Return an instance of Logger
 * @type {Logger}
 */
module.exports = LoggerFactory
