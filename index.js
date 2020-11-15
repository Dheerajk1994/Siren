const Discord = require('discord.js');
const {
    prefix,
    token
} = require('./config.json');
const ytdl = require('ytdl-core');
const { queue } = require('async');
const musicQueue = new Map();

const client = new Discord.Client();
client.login(token);

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async message => {
    if (message.author.bot ||!message.content.startsWith(prefix)) return;
    console.log("Command receieved :" + message.content)

    const serverQueue = musicQueue.get(message.guild.id)

    //PLAY COMMAND
    if (message.content.startsWith(prefix + "play")) {
        console.log("Play command");
        executePlayCommand(message, serverQueue);
        return;
    }
    //SKIP COMMAND
    else if(message.content.startsWith(prefix + "skip")){
        console.log("SKip command");
        executeSkipCommand(message, serverQueue);
        return;
    }
    //STOP COMMAND
    else if(message.content.startsWith(prefix + "stop")){
        console.log("Stop command");
        executeStopCommand(message, serverQueue);
        return;
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

    //!path sdf asdf asdf sadfsd f
    //const songTitle = message.content.substring("!play ")

    //const songURLFromTitle = await searchYouTubeAsync(songTitle);
    const songInfo = await ytdl.getInfo(args[1]);
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

        try{
            console.log("Joining voice channel")
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            playSong(message.guild, queueContruct.songs[0]);
        }
        catch(err){
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err)
        }
    }
    else{
        serverQueue.songs.push(song);
        console.log("added song url to songs array " + song.url);
        return message.channel.send(song.title + " has been added to the queue. Queue size " + serverQueue.songs.length);
    }
}

async function executeStopCommand(message, serverQueue){
    if(serverQueue){
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
}

async function executeSkipCommand(message, serverQueue){
    if(serverQueue){
        serverQueue.connection.dispatcher.end()
    } 
}

function playSong(guild, song){
    const sq = musicQueue.get(guild.id);
    if(!song){
        sq.voiceChannel.leave();
        musicQueue.delete(guild.id);
        return;
    }
    console.log("song to play: " + song.url);

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
