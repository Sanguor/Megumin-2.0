const voiceUtils = require('../utils/voiceUtils.js');
require('dotenv').config();

module.exports = {
    name: 'sound',
    description: 'this is the soundboard command.',
    async execute(message, args, type, client, VoiceControl) {
        try {
            const channelToJoin = message.member.voice.channel;
            const currentChannel = client.voice.connections.get(process.env.SERVER_ID);

            await voiceUtils.joinVoice(channelToJoin, currentChannel, VoiceControl)
            if (type == 'sound')
                VoiceControl.dispatcher = VoiceControl.connection.play(`soundboard/${args}.mp3`);
            if (type == 'music')
                VoiceControl.dispatcher = VoiceControl.connection.play(`music/${args}.mp3`);
        } catch (error) {
            console.error(error);
            message.channel.send(error);
        }
    }
}