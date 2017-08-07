// Tyler Radabaugh

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const bot = new Discord.Client();
const TOKEN = 'MzQzOTM1NjM2MTAyODQwMzIw.DGllPQ.-y7TRmdyoxbHeFO21NbfiN6pLxk';
const PREFIX = "!";

// The ready event 
bot.on("ready", function() {
    console.log("Ready");
});

bot.on("guildMemberAdd", function(member) {
	member.guild.channels.find("name", "general").sendMessage("Welcome " + member.toString() + "!");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    // commands
    switch (args[0].toLowerCase()) {
    	case "ping":
    		message.channel.sendMessage("Pong!");
    		break;
    	case "hello":
    		message.channel.sendMessage("Hi " + message.author.toString() +", I'm Flox Bot. How can I help?");
    		message.channel.sendMessage("Typing '!help' will display a list of commands.");
    		break;
    	case "help":
    		var embed = new Discord.RichEmbed()
    			.addField("All commands must be prefixed with an '!' and are case insensitive.", "(╯°□°)╯︵ ┻━┻")
    			.addField("hello", "Say Hello to Flox Bot.")
    			.addField("help", "Get a list of all commands.")
    			.addField("ping", "Play ping-pong with Flox Bot! Or just see if he's online.")
    			.setColor(0xff6500);
    		message.channel.sendEmbed(embed);
    		break;
    	default:
    		message.channel.sendMessage("Invalid command.");
    }
});

// Log our bot in
bot.login(TOKEN);