const Discord = require('discord.js');
var youtubeApiService = require('./YouTubeAPIService');
const {
    SIREN_PREFIX,
    BOT_TOKEN,
    YT_API_KEY,
    YT_BASE_REQUEST_URL,
    PLAY_COMMAND,
    PAUSE_COMMAND,
    SKIP_COMMAND,
    STOP_COMMAND
} = require('./config.json');

const ytdl = require('ytdl-core');
const { queue } = require('async');
const { url } = require('inspector');
const musicQueue = new Map();

const client = new Discord.Client();
client.login(BOT_TOKEN);

client.once('ready', () => {
    console.log('bot is online');
});

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(SIREN_PREFIX)) return;
    console.log("command receieved :" + message.content);
    const serverQueue = musicQueue.get(message.guild.id);

    const command = message.content.split(" ")
    console.log(command[0])
    switch (command[0]) {
        case SIREN_PREFIX + PLAY_COMMAND:
            executePlayCommand(message, serverQueue);
            break;
        case SIREN_PREFIX + SKIP_COMMAND:
            executeSkipCommand(message, serverQueue);
            break;
        case SIREN_PREFIX + STOP_COMMAND:
            executeStopCommand(message, serverQueue);
            break;
    }
});

async function executePlayCommand(message, serverQueue) {
    const args = message.content.split(" ")
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
    makeUrlCall(message, serverQueue, voiceChannel);
}

async function makeUrlCall(message, serverQueue, voiceChannel) {
    //const songInfo = await ytdl.getInfo(args[1]);
    const query = message.content.substring(SIREN_PREFIX + PLAY_COMMAND + " ")
    await youtubeApiService.requestVideoUrlFromQuery(query, YT_API_KEY, " ")
        .then((url) => {
            setupSong(url, message, serverQueue, voiceChannel)
        })
}

async function setupSong(url, message, serverQueue, voiceChannel) {

    const songInfo = await ytdl.getInfo(String(url));
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        musicQueue.set(message.guild.id, queueContruct);
        console.log("added song url to songs array " + song.url);
        queueContruct.songs.push(song);

        try {
            console.log("bot is joining voice channel")
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            playSong(message.guild, queueContruct.songs[0]);
        }
        catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err)
        }
    }
    else {
        serverQueue.songs.push(song);
        console.log("added song url to songs array " + song.url);
        return message.channel.send(song.title + " has been added to the queue. Queue size " + serverQueue.songs.length);
    }
}

async function executeStopCommand(message, serverQueue) {
    if (serverQueue) {
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
}

async function executeSkipCommand(message, serverQueue) {
    if (serverQueue) {
        serverQueue.connection.dispatcher.end()
    }
}

function playSong(guild, song) {
    const sq = musicQueue.get(guild.id);
    if (!song) {
        sq.voiceChannel.leave();
        musicQueue.delete(guild.id);
        return;
    }
    console.log("playSong : " + song.url);

    const dispatcher = sq.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            sq.songs.shift();
            playSong(guild, sq.songs[0]);
        })
        .on("error", error => console.error(error));

    dispatcher.setVolumeLogarithmic(sq.volume / 5);
    sq.textChannel.send("Now playing " + song.title)
}
