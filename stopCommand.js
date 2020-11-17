module.exports = {
    executeStopCommand : executeStopCommand
};

async function executeStopCommand(message, serverQueue) {
    if (serverQueue) {
        serverQueue.songs = [];
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.end();
    }
}

