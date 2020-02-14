class NotAnActiveCommandError extends Error {
    /**
     * NotAnActiveCommandError constructor
     *
     * @param {String}  message     Description of the error
     * @param {JSON}    commandData Informations about the Command
     */
  constructor(message, commandData) {
    super(message);
    this.name = this.constructor.name;
    if(commandData) { this.commandData = commandData; }
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotANormalUserError extends Error {
    /**
     * NotANormalUserError constructor
     *
     * @param {String}  message     Description of the error
     * @param {JSON}    userInfo Informations about the user that created the Error
     */
  constructor(message, userInfo) {
    super(message);
    this.name = this.constructor.name;
    if(userInfo) { this.userInfo = userInfo; }
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotACorrectChannelError extends Error {
    /**
     * NotACorrectChannelError constructor
     *
     * @param {String}  message     Description of the error
     * @param {JSON}    userInfo Informations about the user that created the Error
     */
  constructor(message, userInfo) {
    super(message);
    this.name = this.constructor.name;
    if(userInfo) { this.userInfo = userInfo; }
    Error.captureStackTrace(this, this.constructor);
  }
}
class UnkownCommandError extends Error {
  /**
   * UnkownCommandError constructor
   *
   * @param {String} message     Description of the error
   * @param {String} commandName Name of the command
   */
  constructor(message, commandName) {
    super(message);
    this.name = this.constructor.name;
    if(commandName) { this.commandName = commandName; }
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  NotAnActiveCommandError,
  NotACorrectChannelError,
  UnkownCommandError,
  NotANormalUserError
};
