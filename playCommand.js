const setup = require('./setupSong')
const ytApiService = require('./YouTubeAPIService')

async function executePlayCommand(message, currentQueue, globalMap) {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) {
        return message.channel.send(
            "You need to be in a voice channel to use Siren!"
        );
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need permissions to connect and speak in your voice channel!"
        );
    }

    const query = message.content.substring(message.content.indexOf(' ') + 1);
    if (isValidUrl(query)) {
        setup.setupSong(query, message, currentQueue, globalMap, voiceChannel);
    }
    else {
        return message.channel.send("Scaboodle has disabled YT Direct Term search for now. Please use urls.")
        //ytApiService.makeUrlCall(query, message, currentQueue, globalMap, voiceChannel);
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
    } catch (e) {
        return false;
    }

    return true;
}

module.exports = {
    executePlayCommand
};

