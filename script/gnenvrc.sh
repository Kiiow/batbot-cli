echo '
# General Config
export APP_NAME="Bot";
export APP_VERSION="0.0.0";
export PROJECT_PATH="/path/to/bot/";

# Logger Config
export CONSOLE_LOGGER_ACTIVE="true";
export CONSOLE_LOGGER_LEVEL="DEBUG";

export FILE_LOGGER_ACTIVE="true";
export FILE_LOGGER_LEVEL="DEBUG";

export LOGS_PATH="/path/to/bot/logs/folder/";
export LOG_FILENAME="botlogs";
export LOGGER_DISPLAY_ERROR="true";

# Bot Config
export BOT_NAME="Bot";
export BOT_VERSION="0.0.0";
export BOT_PROFIL_PICTURE=;
export BOT_TOKEN="";
export BOT_PREFIX="!";

export BOT_STATUS_MESSAGE="default message";
export BOT_STATUS_TYPE="WATCHING";
export BOT_STATUS_STATUS="online";

export BOT_BRAIN_ACTIVE="false";
export BOT_XP_ACTIVE="false";

# API Config
export API_GOOGLE_AI_TOKEN="84687e22274a4178b31567fa51ff8009";
export API_BLAGUE_TOKEN="sz-2PLZ_PJdDWGFaPjeXf4JDTrAczWZjT.EcI1KqLTNmLaycB.2m2JK6-3RLjHUL";
export API_BOT_BASE_URL="http://127.0.0.1:8080/api";
' > .envrc
