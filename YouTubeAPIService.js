const { GuildEmojiRoleManager } = require('discord.js');
const { google } = require('googleapis')

async function requestVideoUrlFromQuery(query, ytapikey, ytbaseurl) {
    return new Promise(
        resolve => {
            google.youtube('v3').search.list({
                key: ytapikey,
                part: 'snippet',
                maxResults: 1,
                q: query
            }).then(
                (response) => {
                    const url = "https://youtube.com/watch?v=" + response.data.items[0].id.videoId
                    return resolve(url)
                })
                .catch((err) => {
                    console.log(err)
                    return resolve(err)
                })
        }
    )
}

module.exports = {
    requestVideoUrlFromQuery: requestVideoUrlFromQuery
};

