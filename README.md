### BatBot.js

<p align="center">
  <img alt="BatBot Version" src="https://img.shields.io/badge/BatBot-2.0.2-brightgreen" height="20"/>
  <img alt="Node Js Version" src="https://img.shields.io/badge/Node.Js-v12.13.1-brightgreen" height="20"/>
</p>

##### ➤ Presentation:
BatBot is a discord bot developped in [Node.Js][node-js] by Me !


##### ➤ Tree view:
.
├── app.js
├── package.json
├── package-lock.json
├── README.md
└── src
    ├── Command.js
    ├── Commands
    │   ├── Blague.js
    │   ├── Clear.js
    │   ├── Game
    │   │   ├── SW
    │   │   │   └── MobsInfos.js
    │   │   └── Sw.js
    │   ├── Help.js
    │   ├── Ping.js
    │   ├── Stop.js
    │   └── Top.js
    ├── Config.js
    ├── Dal
    │   ├── CommandsDAL.js
    │   └── UserDAL.js
    ├── DataFiles
    │   ├── JSON
    │   └── Logs
    │       └── BatBot.log
    ├── LoggerFactory.js
    ├── Services
    │   ├── AccessData.js
    │   ├── CommandsExecuter.js
    │   ├── Error
    │   │   └── Errors.js
    │   ├── Level
    │   │   └── LevelService.js
    │   ├── LevelManager.js
    │   ├── Logger.js
    │   ├── MessageAnalyzer.js
    │   └── MessageSender.js
    ├── src
    │   └── DataFiles
    │       └── Logs
    └── Util
        ├── Command.js
        └── User.js

##### ➤ Module:

```sh
  npm install discord.js
  npm install fs-extra
  npm install Winston
  npm install request
```

1. [discord.js][discord-js] = doing discord stuff, send message, lstening channel ...
2. [fs-extra][fs-extra] = reading and writing file
3. [Winston][winston] = logging informations
4. [request][request] = facilitate http request


[//]: # (Referenced links that can be used instead of putting links everywhere)

   [git-repo-url]: <https://github.com/KioHugo/BatBot>
   [node-js]: <https://nodejs.org/en/>
   [discord-js]: <https://discord.js.org/#/docs/main/stable/general/welcome>
   [winston]: <https://github.com/winstonjs/winston/tree/2.x>
   [fs-extra]: <https://www.npmjs.com/package/fs-extra>
   [request]: <https://www.npmjs.com/package/request>


   [Package]: <https://github.com/KioHugo/BatBot/blob/master/package.json>
   [Commands]: <https://github.com/KioHugo/BatBot/blob/master/JSONFiles/commands.JSON>
