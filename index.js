// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const bot = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'MzQzOTM1NjM2MTAyODQwMzIw.DGllPQ.-y7TRmdyoxbHeFO21NbfiN6pLxk';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
bot.on("ready", function() {
    console.log("Ready");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (message.content == "!hello" || message.content == "!Hello") {
        message.channel.sendMessage("Hi, how can I help?");
    }
});

// Log our bot in
bot.login(token);