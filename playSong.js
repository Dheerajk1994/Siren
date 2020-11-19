const ytdl = require('ytdl-core');
const idleController = require('./idleOut')

var idler = null;

function playSong(guild, song, globalMap) {
    const sq = globalMap.get(guild.id);
    if (!song) {
        console.log("no more songs")
        sq.playing = false;
        idler = setInterval(function () {
            disconnectBot(guild, sq, globalMap);
        }, 1000 * 60 * 3);
        console.log("started idle timer")
        return;
    }
    console.log("playSong : " + song.url);
    sq.playing = true;
    if(idler){
        clearInterval(idler);
        idler = null;
    }
    const dispatcher = sq.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            sq.songs.shift();
            playSong(guild, sq.songs[0], globalMap);
        })
        .on("error", error => {
            console.error(error);
            sq.textChannel.send("Error playing " + song.title + ". Auto skipping.");
            sq.songs.shift();
            playSong(guild, sq.songs[0], globalMap);
        });

    dispatcher.setVolumeLogarithmic(sq.volume / 5);
    sq.textChannel.send("Now playing " + song.title + " " + song.url)
}

function disconnectBot(guild, sq, globalMap) {
    console.log("disconnecting bot")
    sq.voiceChannel.leave();
    globalMap.delete(guild.id);
    return;
}

module.exports = {
    playSong
};