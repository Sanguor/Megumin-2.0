module.exports = {
    name: 'clear',
    description: 'this is the clear command, it clears the queue.',

    execute(message, args, client, VoiceControl) {
        try {
            if (VoiceControl.frontQueue.length == 0) {
                message.channel.send('La queue est déjà vide.');
            } else {
                VoiceControl.queue = [];
                VoiceControl.frontQueue = [];
                VoiceControl.queueIndex = 0;
                message.channel.send('Nettoyage effectué.');
            }
        } catch (error) {
            console.log(error);
            message.channel.send(error);
        }
    }
}
