const { SlashCommandBuilder } = require('discord.js');
const util = require('../util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes the specifies song from queue')
        .addIntegerOption(option =>
            option.setName('index')
                .setDescription('The index of the song to skip')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply(util.responseError(`You need to be in a channel to remove songs from the queue!`));
        }

        const index = interaction.options.getString('index');
    },
};