// const ytdl = require('ytdl-core');
const { joinVoiceChannel, getVoiceConnection, entersState } = require('@discordjs/voice');
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {

    getUserCurrentChannelFromMsg: function(message) {
        return new Promise((resolve) => {
            let currentChannel;
            const connection = getVoiceConnection(process.env.SERVER_ID);
            if (connection) {
                const id = connection.joinConfig.channelId;
                currentChannel = message.guild.channels.cache.find(element => (element.id.includes(id)));
            }
            resolve(currentChannel);
        });
    },


    joinVoice: function(requestedChannel, currentChannel) {
        return new Promise((resolve, reject) => {
            try {
                if (!requestedChannel && !currentChannel) {
                    throw ('Désolée, l\'un de nous deux doit être dans un canal vocal');
                }
                if (requestedChannel) {
                    if (currentChannel != requestedChannel) {
                        joinVoiceChannel({
                            channelId: requestedChannel.id,
                            guildId: requestedChannel.guild.id,
                            adapterCreator: requestedChannel.guild.voiceAdapterCreator,
                        });
                    }
                }
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    },


    destroyConnection: function(VoiceControl) {
        // TODO Do I use the correct way to handle VoiceConnection ? (similar to how I was using isPlaying instead of Player state)
        // https://discordjs.guide/voice/life-cycles.html#subscribing-to-individual-events
        // investigate "VoiceConnection – maintains a network connection to a Discord voice server"
        return new Promise((resolve, reject) => {
            const connection = getVoiceConnection(process.env.SERVER_ID);
            if (connection) {
                connection.destroy();
                resolve(VoiceControl);
            }
            else {
                reject('Je ne suis actuellement connectée à aucun salon vocal.');
            }
        });
    },


    pausePlayer: function(player) {
        return new Promise((resolve, reject) => {
            if (player !== null) {
                player.pause();
                resolve();
            }
            else {
                reject('Je ne joue actuellement aucune musique.');
            }
        });
    },


    resumePlayer: function(player) {
        return new Promise((resolve, reject) => {
            if (player !== null) {
                player.unpause();
                resolve();
            }
            else {
                reject('Je ne joue actuellement aucune musique.');
            }
        });
    },


    stopPlayer: function(player) {
        return new Promise((resolve, reject) => {
            if (player !== null) {
                player.stop();
                resolve();
            }
            else {
                reject('Je ne joue actuellement aucune musique.');
            }
        });
    },


    playAudioResource: function(audioResource, VoiceControl) {
        return new Promise((resolve) => {
            const connection = getVoiceConnection(process.env.SERVER_ID);
            VoiceControl.player.play(audioResource);
            try {
                entersState(VoiceControl.player, AudioPlayerStatus.Playing, 5_000);
                // The player has entered the Playing state within 5 seconds
                console.log('Playback has started!');
                resolve();
            }
            catch (error) {
                // The player has not entered the Playing state and either:
                // 1) The 'error' event has been emitted and should be handled
                // 2) 5 seconds have passed
                console.error(error);
            }
            VoiceControl.subscription = connection.subscribe(VoiceControl.player);
        });
    },

    addElementToQueue: function(VoiceControl, url, title, duration) {
        VoiceControl.queue.push(url);
        VoiceControl.frontQueue.push(title);
        VoiceControl.durationQueue.push(duration);

        return VoiceControl;
    },

    getSourceFromUrl: function(url) {
        if (url.includes('youtube') || url.includes('youtu.be')) {
            return 'youtube';
        }
        if (url.includes('twitch')) {
            return 'twitch';
        }
        return 'Unhandled source';
    },
};