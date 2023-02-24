const { SlashCommandBuilder } = require('discord.js');
const util = require('../util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the current song queue')
        .addIntegerOption(option =>
            option.setName('n')
                .setDescription('Number of tracks to display')
                .setRequired(false)),
    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guild);

        if (!queue) {
            return await interaction.reply(util.responseError('No songs are currently playing!'));
        }

        const queueLength = queue.tracks.length;
        const currentSong = queue.current;
        const numTracksToDisplay = util.clamp(interaction.options.getInteger('n') ?? 10);

        let queueString = `**Currently playing:**  ${currentSong.title} - ${currentSong.author}\n`;

        queueString +=
        `${queue.tracks.slice(0, numTracksToDisplay).map(
            (song, i) => {
                return `${i + 1})  [${song.duration}] ${song.title} - ${song.author}`;
            }
        ).join("\n")}`;

        if (queueLength > numTracksToDisplay) {
            queueString += `... and ${queueLength - numTracksToDisplay} other tracks.`;
        }

        await interaction.reply(util.responseInfo(queueString));
    },
};
