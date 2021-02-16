#!/bin/bash
COMMAND_EXEC='/usr/local/bin/node';
APP_FOLDER=/path/to/bot;
APP_FILE=$APP_FOLDER/app.js;

export DIRENV_CONFIG='/usr/bin';
cd $APP_FOLDER;
direnv allow . && eval "$(direnv export bash)";
/usr/bin/direnv exec $APP_FOLDER $COMMAND_EXEC $APP_FILE;
