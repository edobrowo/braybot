const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song or (optionally) the next *n* songs')
        .addIntegerOption(option =>
            option.setName('n')
                .setDescription('Number of songs to skip')
                .setRequired(false)),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const userChannelId = interaction.guild.members.me.voice.channelId;
        const botChannelId = interaction.member.voice.channelId;

        if (!channel || userChannelId && userChannelId !== botChannelId) {
            await interaction.reply({ content: 'you need to be in the same channel as me to skip songs silly', ephemeral: true });
            return;
        }

        const player = interaction.client.player;
        const queue = player.getQueue(interaction.guild);
        if (!queue) {
            return await interaction.reply({ content: 'nothing\'s playing silly', ephemeral: true });
        }

        const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
        const n = interaction.options.getInteger('n') ?? 0;

        if (n > queue.tracks.length) {
            queue.clear();
            queue.skip();
        } else {
            const i = clamp(n, 0, queue.tracks.length - 1);
            console.log(i);
            queue.skipTo(i);
        }

        interaction.reply(`*Skipping...*`);
    },
};