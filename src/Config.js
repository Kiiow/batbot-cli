/**
 * Configuration of the bot
 * @type {JSONObject}
 */
module.exports = CONFIG =  {
  PROJECT_PATH: process.env.PROJECT_PATH || __dirname,
  LOGS_PATH: process.env.LOGS_PATH || __dirname + "/logs",
  LOGGER: {
    CONSOLE: {
      LEVEL: process.env.CONSOLE_LOGGER_LEVEL || "MORE"
    },
    FILE: {
      LEVEL: process.env.FILE_LOGGER_LEVEL || "DEBUG"
    }
  },
  BOT: {
    NAME: process.env.BOT_NAME || "BatDev",
    VERSION: process.env.BOT_VERSION || "0.0.0",
    PROFIL_PICTURE: process.env.BOT_PROFIL_PICTURE || "",
    TOKEN: process.env.BOT_TOKEN || "",
    PREFIX: process.env.BOT_PREFIX || ".",
    STATUS: {
      GAME: {
        NAME: process.env.BOT_STATUS_MESSAGE || "(.help)",
        TYPE: process.env.BOT_STATUS_TYPE || "PLAYING",
      }
    }
  }
};
