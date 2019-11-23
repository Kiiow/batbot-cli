### BatBot.js

<p align="center">
  <img alt="BatBot Version" src="https://img.shields.io/badge/BatBot-2.0.2-brightgreen" height="20"/>
  <img alt="Node Js Version" src="https://img.shields.io/badge/Node.Js-v12.13.1-brightgreen" height="20"/>
</p>

##### ➤ Presentation:
BatBot is a discord bot developped in [Node.Js][node-js] by Me !


##### ➤ Functionality:
BatBot can do a lot of different stuff (and he's still learning !)

|  Command    |                Action              |           option          | Categorie |
|-------------|------------------------------------|---------------------------|-----------|
| `.blague`   | A little joke from BatBot ?        | `None`                    | [general] |
| `.emoji`    | Display help on Emoji module       | `(add|list)`              | [general] |
| `.google`   | Doing some research on google      | `<research>`              | [general] |
| `.help`     | Display help on help module        | `(general|admin|game|all)`| [general] |
| `.ping`     | Playing tennis table with the bot ?| `None`                    | [general] |
| `.profile`  | Display Profile informations       | `(@user)`                 | [general] |
| `.top`      | Display the scoreboard             | `None`                    | [general] |
| `.wiki`     | Search information on Wikipedia    | `<research>`              | [general] |
|             |                                    |                           |           |
| `.pokeinfo` | Getting informations about a pkmn  | `<pkmn_name>`             | [game]    |
| `.pokestats`| Getting stats of a pkmn            | `<pkmn_name>`             | [game]    |
| `.sw`       | Display help on SummonersWar module| `(info)`                  | [game]    |
|             |                                    |                           |           |
| `.admin`    | Display help on Admin module       | `(add|list)`              | [admin]   |
| `.announce` | Do an announce in a specific chan  | `<message>`               | [admin]   |
| `.ban`      | Ban a certain user                 | `<@user>`                 | [admin]   |
| `.clear`    | Erase a certain number of message  | `<nbMessage(s)>`          | [admin]   |
| `.config`   | Display help on Config module      | `(announce)`              | [admin]   |
| `.kick`     | Kick a user                        | `<@user>`                 | [admin]   |
| `.prison`   | Add the prison role to a user      | `<@user>`                 | [admin]   |
| `.stop`     | Stop the bot                       | `None`                    | [admin]   |

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
