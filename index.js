const Discord = require('discord.js');

var playCommand = require('./playCommand')
var musiCommands = require('./musicCommands')
const utils = require('./utils')

const {
    SIREN_PREFIX,
    BOT_TOKEN,
    MUSIC_COMMAND_CHANNEL,
    PLAY_COMMAND,
    SKIP_COMMAND,
    STOP_COMMAND,
    PAUSE_COMMAND,
    RESUME_COMMAND
} = require('./config.json');
const musicCommands = require('./musicCommands');
const { playcustomapp } = require('googleapis/build/src/apis/playcustomapp');
const { title } = require('process');

const serverMap = new Map();

const client = new Discord.Client();
client.login(BOT_TOKEN);

client.once('ready', () => {
    console.log('bot is online');
});

client.on('message', async message => {
    if (message.channel.name != MUSIC_COMMAND_CHANNEL || message.author.bot || !message.content.startsWith(SIREN_PREFIX)) return;

    console.log("command receieved :" + message.content);
    const currentQueue = serverMap.get(message.guild.id);

    const command = message.content.split(" ")
    switch (command[0]) {
        case SIREN_PREFIX + PLAY_COMMAND:
            playCommand.executePlayCommand(message, currentQueue, serverMap);
            break;
        case SIREN_PREFIX + SKIP_COMMAND:
            musicCommands.executeSkipCommand(message, currentQueue, serverMap);
            break;
        case SIREN_PREFIX + STOP_COMMAND:
            musicCommands.executeStopCommand(message, currentQueue);
            break;
        case SIREN_PREFIX + PAUSE_COMMAND:
            musicCommands.executePauseCommand(message, currentQueue);
            break;
        case SIREN_PREFIX + RESUME_COMMAND:
            musicCommands.executeResmumeCommand(message, currentQueue);
            break;
        default:
            break;
    }
});