// Tyler Radabaugh

// Import the discord.js module
const Discord = require('discord.js');
const YTDL = require("ytdl-core");

// Create an instance of a Discord client
const bot = new Discord.Client();
const TOKEN = 'MzQzOTM1NjM2MTAyODQwMzIw.DGrTSQ.N3MX3Q8Tk1sqR0uCwPYAk7sJL0s';
const PREFIX = "!";

// Servers for multiple discord music queues
var servers = {};

// plays audio from youtube links in the queue
function play(connection, message) {
	var server = servers[message.guild.id];

	server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

	server.queue.shift();

	server.dispatcher.on("end", function() {
		if (server.queue[0]) play(connection, message);
		else connection.disconnect();
	});
}

// The ready event 
bot.on("ready", function() {
    console.log("Ready");
});

// Welcome newcomers
bot.on("guildMemberAdd", function(member) {
	member.guild.channels.find("name", "guild").sendMessage("Hi " + member.toString() + " welcome to Boomstick!");
});

// Commands
bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

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
    			.addField("All commands must be prefixed with an '!' and are not case sensitive.", "(╯°□°)╯︵ ┻━┻")
    			.addField("hello", "Say Hello to Flox Bot.")
    			.addField("help", "Get a list of all commands.")
    			.addField("ping", "Play ping-pong with Flox Bot! Or just see if he's online.")
    			.addField("play", "Give Flox Bot a youtube link and he will play the audio in the voice channel you are in.")
    			.addField("skip", "If Flox Bot is currently playing a song, skip it and play the next one.")
    			.addField("stop", "Have Flox Bot stop playing songs.")
    			.setColor(0xff6500);
    		message.channel.sendEmbed(embed);
    		break;
    	case "play":
    		if (!args[1]) {
    			message.channel.sendMessage("Please provide a link.");
    			return;
    		}

    		if (!message.member.voiceChannel) {
    			message.channel.sendMessage("You must be in a voice channel.");
    			return;
    		}

    		if (!servers[message.guild.id]) servers[message.guild.id] = {
    			queue: []
    		};

    		var server = servers[message.guild.id];

    		if (args[1].search(/youtube/i) == 12) {
    			server.queue.push(args[1]);
    		} else {
    			message.channel.sendMessage("Link must be from youtube.");
    			return;
    		}

    		if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
    			play(connection, message);
    		}).catch(function () {
    			message.channel.sendMessage("Connection timed out. Please try again.");
    			return;
    		});
    		break;
    	case "skip":
    		var server = servers[message.guild.id];

    		if (server.dispatcher) server.dispatcher.end();
    		break;
    	case "stop":
    		var server = servers[message.guild.id];

    		if (server.dispatcher) server.dispatcher.end();
    		if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect;
    		break;
    	default:
    		message.channel.sendMessage("Invalid command.");
    }
});

// Log our bot in
bot.login(TOKEN);