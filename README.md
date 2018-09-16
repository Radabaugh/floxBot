# floxBot
A discord bot in node JS!

# Installation

+ Clone the repository.
+ Create a `config.json` file:

```JSON
{
    "TOKEN" : "secretDiscordTokenString"
}
```

+ Run `npm update` command to update the necessary node modules.
+ Install [ffmpeg](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-FFmpeg) so the [ytdl-core](https://github.com/fent/node-ytdl-core) library works.

# Starting floxBot

To run floxBot locally, use this command to start the node app:
```bash
node index.js
```

To run floxBot on a server you might want to use something like [forever](https://www.npmjs.com/package/forever) to keep the bot up and running. The command would then look like this:
```bash
forever start index.js
```

# Commands

floxBot processes all messages in text channels he has access to. Messages prefixed with __!__ indicate a command.

| Command | Description |
|---------|-------------|
| !ban | floxBot will ban the first person mentioned after the command. |
| !hello | Say hello to floxBot. |
| !help | Get a list of all commands. |
| !kick | floxBot will kick the first person mentioned after the command. |
| !ping | Play ping-pong with floxBot! Or just see if he's online. |
| !play | Give floxBot a youtube link and he will play the audio in the voice channel you are in. |
| !skip | If floxBot is currently playing a song, skip it and play the next one. |
| !stop | Have floxBot stop playing songs. |
