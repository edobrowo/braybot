const { SlashCommandBuilder } = require('discord.js');
const util = require('../util');

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
            return await interaction.reply(util.responseError(`You need to be in the same channel as me to play music!`));
        }

        const player = interaction.client.player;
        const queue = player.getQueue(interaction.guild);
        const queueLength = queue.tracks.length;

        if (!queue) {
            return await interaction.reply(util.responseError(`No songs are currently playing!`));
        }

        const n = util.clamp(interaction.options.getInteger('n') ?? 0, 0, queueLength);

        if (n === queueLength) {
            console.log(`Skipping all tracks, stopping player`);
            queue.clear();
            queue.stop();
        } else {
            console.log(`Skipping to track ${n}`);
            queue.skipTo(n);
        }

        interaction.reply(util.responseInfo(`*Skipping...*`));
    },
};
