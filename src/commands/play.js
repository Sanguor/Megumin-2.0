const ytdl = require('ytdl-core');
const voiceUtils = require('../utils/voiceUtils.js');
const utils = require('../utils/utils.js');

module.exports = {
    name: 'play',
    description: 'this is the music command.',

    async execute(message, args, VoiceControl) {
        try {
            const url = args[0];
            const channelToJoin = message.member.voice.channel;
            const currentChannel = voiceUtils.getCurrentChannelFromMsg(VoiceControl, message);

            await voiceUtils.joinVoice(channelToJoin, currentChannel, VoiceControl).catch((error) => {
                throw (error);
            });
            if (url.includes("http://") || url.includes("https://")) {
                VoiceControl.queue.push(url);
                if (url.includes("youtube") || url.includes("youtu.be")) {
                    let readableStream = ytdl(url);
                    readableStream
                        .on('info', (info, format) => {
                            VoiceControl.frontQueue.push(info.videoDetails.title);
                            // let fileName = info.title.replace(/[^a-z0-9\-]/gi, '_');
                            // let container = format.container;
                            // let writeableSteam = fs.createWriteStream(`${fileName}.${container}`);
                            // readableStream.pipe(writeableSteam);
                        })
                        .on('error', (error, format) => {
                            utils.logError(error.message);
                        });
                    if (VoiceControl.isPlaying == false) {
                        voiceUtils.playYoutube(VoiceControl, message);
                    }
                } else {
                    throw ('\`\`\`La lecture de contenus extérieurs à youtube n\'a pas encore été implémentée\`\`\`')
                }
            }
            else {
                throw ('\`\`\`La recherche de vidéos par titre n\'a pas encore été implémentée\`\`\`');
            }

        } catch (error) {
            utils.logError(error, message.channel);
        }
    }
}