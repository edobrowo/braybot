const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shmeef')
        .setDescription('shmeef'),
    async execute(interaction) {
        await interaction.reply('shmeef');
    },
};
