const ytdl = require('ytdl-core');
const utils = require('./utils')

var idler = null;

function playSong(guild, song, globalMap) {
    const sq = globalMap.get(guild.id);
    if (!song) {
        console.log("no more songs")
        sq.playing = utils.PlayStates.STOPPED;
        idler = setInterval(function () {
            disconnectBot(guild, sq, globalMap);
        }, 1000 * 60 * 3);
        console.log("started idle timer")
        return;
    }
    console.log("playSong : " + song.url);
    sq.playing = utils.PlayStates.PLAYING;
    if(idler){
        clearInterval(idler);
        idler = null;
    }
    const dispatcher = sq.connection
        .play(ytdl(song.url, { filter : 'audioonly' }))
        .on("finish", () => {
            skipSong(guild, sq, globalMap);
        })
        .on("error", error => {
            console.error(error);
            sq.textChannel.send("Error playing " + song.title + ". Auto skipping.");
            skipSong(guild, sq, globalMap);
        });

    dispatcher.setVolumeLogarithmic(sq.volume / 5);
    sq.textChannel.send("Now playing " + song.title + " " + song.url)
}

function skipSong(guild, sq, globalMap){
    sq.songs.shift();
    playSong(guild, sq.songs[0], globalMap);
}

function disconnectBot(guild, sq, globalMap) {
    console.log("disconnecting bot")
    sq.voiceChannel.leave();
    globalMap.delete(guild.id);
    clearInterval(idler);
    idler = null;
    return;
}

module.exports = {
    playSong,
    skipSong
};