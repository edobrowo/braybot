# braybot
This is a music bot made with Discord.js. Music downloading and playing is handled by discord-player. The bot is hosted on a Vultr VPS.

The goal of this bot is to provide an extremely simple interface for music playing and queue management.

## Commands
* /play <query> - play a song given the search query.
* /skip [n] - skip the next n (1 if not specified) songs.
* /queue [n] - display the next n (10 if not specified) songs.
* [TODO] /remove <index> - remove the ith song from queue.
* [TODO] /insert <index> <query> - insert a song at the ith index in queue. May incorporate this feature with /play.
* [TODO] /alias <name> <query> - alias a name to a search query.
