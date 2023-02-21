const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the current queue of songs'),
    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guild);

        if (!queue) {
            return await interaction.reply('nothing\'s playing silly');
        }

        const currentSong = queue.current;

        let queueString = `**Currently playing:**  ${currentSong.title} - ${currentSong.author}\n`;
        queueString += `${queue.tracks.slice(0, 10).map(
            (song, i) => {
                return `${i + 1})  [${song.duration}] ${song.title} - ${song.author}`;
            }
        ).join("\n")}`;
        if (queue.tracks.length > 10) {
            queueString += `...\n`;
        }

        interaction.reply(queueString);
    },
};