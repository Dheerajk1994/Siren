##Siren is a simple Discord music bot.

The bot is not built and optmized for multi server usage with huge traffic. The Google API limits direct video searches to 100 videos per day. The bot thrives in small community servers and will smoothly run on low resource cloud services - I have one currently running on AWS' LightSail (2 GB RAM, 1 vCPU) for my personal server. 

##Installation:
requires Node, GoogleAPI library, discord.js, youtube-dl... (simply download the package and run 'node index.js' and install the needed libraries until it works :)
 
##Config.JSON
You will need to provide a config.json file with the required APIS and commands. This way your API keys will be kept hidden and you have greater control on the commands the bot responds to.
Sample config.json file:
```
{
    "SIREN_PREFIX":"!",
    "BOT_TOKEN":"<DISCORD BOT TOKEN - CAN BE CREATED THROUGH DISCORD DEV PORTAL>",
    "YT_API_KEY":"<YOUTUBE API KEY - YOU CAN CREATE ONE IN GOOGLE CLOUD PORTAL - FREE VERSION LIMITS TO 100 UNIT OF CALLS PER DAY>",
    "YT_BASE_REQUEST_URL":"https://www.googleapis.com/youtube/v3/search",

    "MUSIC_COMMAND_CHANNEL" : "music-commands", //THE CHANNEL YOU WANT THE BOT TO LISTEN IN ON FOR COMMANDS
    "PLAY_COMMAND" : "play",
    "PAUSE_COMMAND" : "pause",
    "SKIP_COMMAND" : "skip",
    "STOP_COMMAND" : "stop",
    "PAUSE_COMMAND" : "pause",
    "RESUME_COMMAND" : "resume"
}
```
##Further Development:
  - A SQL server to allow users to add songs to their personal playlist
  - A HTML scraper so that the bot doesnt have to depend on the Google API
  - Multi server support
