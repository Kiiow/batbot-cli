function getEnv(env, defVal) {
  return process.env[env] || defVal;
}

/**
 * Configuration of the bot
 * @type {JSONObject}
 */
module.exports = {
  PROJECT_PATH: getEnv("PROJECT_PATH" || __dirname),
  LOGS_PATH: getEnv("LOGS_PATH" || __dirname + "/src/DataFiles/Logs"),
  LOGGER: {
    CONSOLE: {
      LEVEL: getEnv("CONSOLE_LOGGER_LEVEL" || "MORE"),
    },
    FILE: {
      LEVEL: getEnv("FILE_LOGGER_LEVEL" || "DEBUG"),
    }
  },
  BOT: {
    NAME: getEnv("BOT_NAME" || "BatDev"),
    VERSION: getEnv("BOT_VERSION" || "0.0.0"),
    PROFIL_PICTURE: getEnv("BOT_PROFIL_PICTURE" || ""),
    TOKEN: getEnv("BOT_TOKEN" || ""),
    PREFIX: getEnv("BOT_PREFIX" || "."),
    STATUS: {
      GAME: {
        NAME: getEnv("BOT_STATUS_MESSAGE" || "(.help)"),
        TYPE: getEnv("BOT_STATUS_TYPE" || "PLAYING"),
      }
    }
  },
  API: {
    BLAGUE_TOKEN: "sz-2PLZ_PJdDWGFaPjeXf4JDTrAczWZjT.EcI1KqLTNmLaycB.2m2JK6-3RLjHUL",
    BOT_BASE_URL: "http://127.0.0.1:8080/api",
  }
};
