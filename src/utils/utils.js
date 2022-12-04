const { EmbedBuilder } = require('discord.js');

module.exports = {

    logError: function(error, channel) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0x0000)
            .setDescription(`:x:\xa0\xa0${error}`);

        console.error(error);
        channel.send({ embeds: [errorEmbed] });
        return;
    },


    sendMessage: function(text, channel) {
        const messageEmbed = new EmbedBuilder()
            .setColor(0x0000)
            .setDescription(`:information_source:\xa0\xa0${text}`);

        channel.send({ embeds: [messageEmbed] });
        return;
    },


    reactMessage: function(reaction, message) {
        message.react(reaction)
            .catch((error) => {
                this.logError(error, message.channel);
            });
        return;
    },
};