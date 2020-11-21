module.exports = {
    executeStopCommand,
    executeSkipCommand,
    executePauseCommand,
    executeResmumeCommand
}

const utils = require('./utils');
const player = require('./playSong')

//STOP
async function executeStopCommand(message, serverQueue) {
    if (serverQueue) {
        serverQueue.songs = [];
        serverQueue.playing = utils.PlayStates.STOPPED;
        serverQueue.connection.dispatcher.end();
    }
}

//SKIP
async function executeSkipCommand(message, serverQueue, globalMap) {
    if (serverQueue) {
        player.skipSong(message.guild, serverQueue, globalMap);
    }
}

//PAUSE
async function executePauseCommand(message, serverQueue){
    if(serverQueue && serverQueue.playing == utils.PlayStates.PLAYING){
        serverQueue.playing = utils.PlayStates.PAUSED;
        serverQueue.connection.dispatcher.pause();
        message.channel.send("I am pausing the music.")
    }
    else{
        message.channel.send("Sorry there is nothing to pause.")
    }
}

//RESUME
async function executeResmumeCommand(message, serverQueue){
    if(serverQueue && serverQueue.playing == utils.PlayStates.PAUSED){
        serverQueue.playing = utils.PlayStates.PLAYING;
        serverQueue.connection.dispatcher.resume();
        message.channel.send("I am resuming the music.");
    }
    else{
        message.channel.send("Sorry there is nothing paused right now.")
    }
}