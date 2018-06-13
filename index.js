// Tyler Radabaugh

// Import the discord.js module
const Discord = require('discord.js');
const YTDL = require("ytdl-core");
const config = require("./config.json");

// Create an instance of a Discord client
const bot = new Discord.Client();
const PREFIX = "!";

// Servers for multiple discord music queues
var servers = {};

// plays audio from youtube links in the queue
function play(connection, message) {
	var server = servers[message.guild.id];

	server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

	server.queue.shift();

	server.dispatcher.on("end", function() {
		if (server.queue[0]) {
			play(connection, message);
		} else { 
			connection.disconnect();
		}
	});
}

// The ready event 
bot.on("ready", function() {
	console.log("Ready");
});

// Welcome newcomers
bot.on("guildMemberAdd", function(member) {
	member.guild.channels.find("name", "guild").send("Hi " + member.toString() + " welcome to Boomstick!");
});

// Commands
bot.on("message", function(message) {
	if (message.author.equals(bot.user)) return;

	if (!message.content.startsWith(PREFIX)) return;

	var args = message.content.substring(PREFIX.length).split(" ");

	switch (args[0].toLowerCase()) {
		case "ban":
			var modRole = message.guild.roles.find("name", "Overlord");
			if (!message.member.roles.has(modRole.id)) {
				return message.reply("You don't have the permission to use this command.");
			}
			if (message.mentions.users.size == 0) {
				return message.reply("Please mention a user to ban.");
			}
			let banMember = message.guild.member(message.mentions.users.first());
			if (!banMember) {
				return message.reply("That user does not seem valid.");
			}
			if (!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) {
				return message.reply("I don't have the permission to BAN_MEMBERS.");
			}
			banMember.ban().then(member => {
				message.reply(member.toString() + ' was successfully banned.');
			}).catch(console.error);
			break;
		case "hello":
			message.channel.send("Hi " + message.author.toString() +", I'm Flox Bot. How can I help?");
			message.channel.send("Typing '!help' will display a list of commands.");
			break;
		case "help":
			var embed = new Discord.RichEmbed()
				.addField("All commands must be prefixed with an '!' and are not case sensitive.", "(╯°□°)╯︵ ┻━┻")
				.addField("ban", "Flox Bot will ban the first person mentioned after the command.")
				.addField("hello", "Say Hello to Flox Bot.")
				.addField("help", "Get a list of all commands.")
				.addField("kick", "Flox Bot will kick the first person mentioned after the command.")
				.addField("ping", "Play ping-pong with Flox Bot! Or just see if he's online.")
				.addField("play", "Give Flox Bot a youtube link and he will play the audio in the voice channel you are in.")
				.addField("skip", "If Flox Bot is currently playing a song, skip it and play the next one.")
				.addField("stop", "Have Flox Bot stop playing songs.")
				.setColor(0xff6500);
			message.channel.send(embed);
			break;
		case "kick":
			var modRole = message.guild.roles.find("name", "Overlord");
			if (!message.member.roles.has(modRole.id)) {
				return message.reply("You don't have the permission to use this command.");
			}
			if (message.mentions.users.size == 0) {
				return message.reply("Please mention a user to kick.");
			}
			let kickMember = message.guild.member(message.mentions.users.first());
			if (!kickMember) {
				return message.reply("That user does not seem valid.");
			}
			if (!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
				return message.reply("I don't have the permission to KICK_MEMBERS.");
			}
			kickMember.kick().then(member => {
				message.reply(member.toString() + ' was successfully kicked.');
			}).catch(console.error);
			break;
		case "ping":
			message.channel.send("Pong!");
			break;
		case "play":
			if (!args[1]) {
				message.channel.send("Please provide a link.");
				return;
			}

			if (!message.member.voiceChannel) {
				message.channel.send("You must be in a voice channel.");
				return;
			}

			if (!servers[message.guild.id]) servers[message.guild.id] = {
				queue: []
			};

			var server = servers[message.guild.id];

			if (args[1].search(/youtube/i) == 12) {
				server.queue.push(args[1]);
			} else {
				message.channel.send("Link must be from youtube.");
				return;
			}

			if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
				play(connection, message);
			}).catch(function() {
				message.channel.send("Connection timed out. Please try again.");
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
			message.channel.send("Invalid command.");
	}
});

// Log bot in
bot.login(config.TOKEN);
