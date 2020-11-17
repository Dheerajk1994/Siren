const ytdl = require('ytdl-core');

function playSong(guild, song, globalMap) {
    const sq = globalMap.get(guild.id);
    if (!song) {
        sq.voiceChannel.leave();
        globalMap.delete(guild.id);
        return;
    }
    console.log("playSong : " + song.url);

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

module.exports = {
    playSong
};