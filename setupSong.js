const player = require('./playSong')
const ytdl = require('ytdl-core');
const utils = require('./utils')

async function setupSong(url, message, currentQueue, globalMap, voiceChannel) {
    console.log("setupSong")
    let songInfo = null
    try{
        songInfo = await ytdl.getInfo(String(url));
    }
    catch(err){
        console.log("ytdl getInfo error")
        return message.channel.send("Sorry I was unable to get the info for that request.")
    }
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if (!currentQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: utils.PlayStates.STOPPED
        };

        globalMap.set(message.guild.id, queueContruct);
        console.log("added song url to songs array " + song.url);
        queueContruct.songs.push(song);

        try {
            console.log("bot is joining voice channel")
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            player.playSong(message.guild, queueContruct.songs[0], globalMap);
        }
        catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err)
        }
    }
    else {
        currentQueue.songs.push(song);
        console.log("added song url to songs array " + song.url);
        if(currentQueue.playing == utils.PlayStates.STOPPED){
            player.playSong(message.guild, currentQueue.songs[0], globalMap);
        }
        return message.channel.send(song.title + " has been added to the queue. Queue size " + currentQueue.songs.length);
    }
}

module.exports = {
    setupSong
};