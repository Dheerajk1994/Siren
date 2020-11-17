module.exports = {
    executeSkipCommand : executeSkipCommand
};

async function executeSkipCommand(message, serverQueue) {
    if (serverQueue) {
        serverQueue.connection.dispatcher.end()
    }
}

