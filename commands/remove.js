const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes the specifies song from queue')
        .addIntegerOption(option =>
            option.setName('index')
                .setDescription('The index of the song to skip')
                .setRequired(true)),
    async execute(client, interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply("you need to be in a channel to remove songs silly");
            return;
        }

        const index = Number(interaction.options.getString('index'));
        console.log(index);
    },
};