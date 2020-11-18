const { google } = require('googleapis');
const setup = require('./setupSong');

const {YT_API_KEY} = require('./config.json')

async function makeUrlCall(query, message, currentQueue, globalMap, voiceChannel) {
    console.log("makeUrlCall")
    try {
        await requestVideoUrlFromQuery(query, YT_API_KEY)
            .then((url) => {
                setup.setupSong(url, message, currentQueue, globalMap, voiceChannel)
            })
            .catch(err => {
                console.log(err);
                return message.channel.send("Sorry but I was unable to get the associated url for that.")
            })
    }
    catch(error){
        console.log(error) 
        return message.channel.send("Sorry but I was unable to get the associated url for that.")
    }
}

async function requestVideoUrlFromQuery(query, ytapikey) {
    console.log("makign youtube search for  " + query)
    return new Promise(
        resolve => {
            google.youtube('v3').search.list({
                key: ytapikey,
                part: 'snippet',
                maxResults: 1,
                q: query
            }).then(
                (response) => {
                    console.log("youtube search response : " + response.data.items[0].id.videoId)
                    const url = "https://youtube.com/watch?v=" + response.data.items[0].id.videoId
                    return resolve(url)
                })
                .catch((err) => {
                    console.log("youtube search response failure : " + err)
                    return Error
                })
        }
    )
}

module.exports = {
    makeUrlCall : makeUrlCall 
};

