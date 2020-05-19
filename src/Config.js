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
  PROJECT_PATH: getEnv("PROJECT_PATH", __dirname),
  LOGS_PATH: getEnv("LOGS_PATH", __dirname + "/src/DataFiles/Logs"),
  LOGGER: {
    CONSOLE: {
      LEVEL: getEnv("CONSOLE_LOGGER_LEVEL", "MORE"),
    },
    FILE: {
      LEVEL: getEnv("FILE_LOGGER_LEVEL", "DEBUG"),
    }
  },
  BOT: {
    NAME: getEnv("BOT_NAME", "BatDev"),
    VERSION: getEnv("BOT_VERSION", "0.0.0"),
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
    GOOGLE_AI_TOKEN: "84687e22274a4178b31567fa51ff8009",
    BLAGUE_TOKEN: "sz-2PLZ_PJdDWGFaPjeXf4JDTrAczWZjT.EcI1KqLTNmLaycB.2m2JK6-3RLjHUL",
    BOT_BASE_URL: "http://127.0.0.1:8080/api",
  }
};
