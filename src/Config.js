function getEnv(env, defVal) {
  return process.env[env] || defVal;
}

function toBool(val) {
  try {
    return val == 1 || val.toLowerCase() == "true";
  } catch (_err) {
    return false;
  }
}

/**
 * Configuration of the bot
 * @type {JSONObject}
 */
module.exports = {
  APP_NAME: getEnv("APP_NAME", "BatDev"),
  APP_VERSION: getEnv("APP_VERSION", "1.0.0"),
  PROJECT_PATH: getEnv("PROJECT_PATH", __dirname),
  NODE_ENV : getEnv("NODE_ENV", "production"),
  LOGGER: {
    CONSOLE: {
      ACTIVE: toBool(getEnv("CONSOLE_LOGGER_ACTIVE", true)),
      LEVEL: getEnv("CONSOLE_LOGGER_LEVEL", "MORE"),
    },
    FILE: {
      ACTIVE: toBool(getEnv("FILE_LOGGER_ACTIVE", true)),
      LEVEL: getEnv("FILE_LOGGER_LEVEL", "DEBUG"),
    },
    LOGS_PATH: getEnv("LOGS_PATH", __dirname + "/src/DataFiles/Logs"),
    LOG_FILENAME: getEnv("LOG_FILENAME", "Bot"),
    DISPLAY_ERROR: toBool(getEnv("LOGGER_DISPLAY_ERROR", true)),
  },
  BOT: {
    NAME: getEnv("BOT_NAME", "BatDev"),
    VERSION: getEnv("BOT_VERSION", "1.0.0"),
    PROFIL_PICTURE: getEnv("BOT_PROFIL_PICTURE", ""),
    TOKEN: getEnv("BOT_TOKEN", ""),
    PREFIX: getEnv("BOT_PREFIX", "."),
    STATUS: {
      'game': {
        'name': getEnv("BOT_STATUS_MESSAGE", "(.help)"),
        'type': getEnv("BOT_STATUS_TYPE", "PLAYING"),
      },
      'status' : getEnv("BOT_STATUS_STATUS", "online"),
    },
    SETTINGS: { // TODO utiliser ces settings pour activer / désactiver certains parties du bot
      BRAIN_ACTIVE: toBool(getEnv("BOT_BRAIN_ACTIVE", false)),
      XP_ACTIVE: toBool(getEnv("BOT_XP_ACTIVE", false)),
    }
  },
  API: {
    GOOGLE_AI_TOKEN: getEnv("API_GOOGLE_AI_TOKEN", undefined),
    BLAGUE_TOKEN: getEnv("API_BLAGUE_TOKEN", undefined),
    BOT_BASE_URL: getEnv("API_BOT_BASE_URL", "http://127.0.0.1:8080/api"),
  }
};
