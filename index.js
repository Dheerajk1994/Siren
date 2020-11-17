const Discord = require('discord.js');

var playCommand = require('./playCommand')
var stopCommand = require('./stopCommand')
var skipCommand = require('./skipCommand')

const {
    SIREN_PREFIX,
    BOT_TOKEN,
    PLAY_COMMAND,
    SKIP_COMMAND,
    STOP_COMMAND
} = require('./config.json');

const serverMap = new Map();

const client = new Discord.Client();
client.login(BOT_TOKEN);

client.once('ready', () => {
    console.log('bot is online');
});

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(SIREN_PREFIX)) return;
    console.log("command receieved :" + message.content);
    const currentQueue = serverMap.get(message.guild.id);

    const command = message.content.split(" ")
    switch (command[0]) {
        case SIREN_PREFIX + PLAY_COMMAND:
            playCommand.executePlayCommand(message, currentQueue, serverMap);
            break;
        case SIREN_PREFIX + SKIP_COMMAND:
            skipCommand.executeSkipCommand(message, currentQueue);
            break;
        case SIREN_PREFIX + STOP_COMMAND:
            stopCommand.executeStopCommand(message, currentQueue);
            break;
    }
});