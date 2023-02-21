const path = require('node:path');
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const { QueryType, QueryResolver } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays the requested song')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The search term or URL of the song to be played')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const userChannelId = interaction.guild.members.me.voice.channelId;
        const botChannelId = interaction.member.voice.channelId;
        
        const botChannelPermissions = channel.permissionsFor(interaction.guild.members.me);

        if (!channel) {
            return await interaction.reply({ content: 'you need to be in a channel to play music silly', ephemeral: true });
        }
        if (userChannelId && userChannelId !== botChannelId) {
            return await interaction.reply({ content: 'I need to be the same channel as you to play music silly', ephemeral: true });
        }
        if (!botChannelPermissions.has(PermissionsBitField.Flags.Connect) || !botChannelPermissions.has(PermissionsBitField.Flags.Speak)) {
            return await interaction.reply({ content: 'I need permissions to join your call and talk silly', ephemeral: true });
        }

        const player = interaction.client.player;
        const queue = await player.createQueue(interaction.guild);

        try {
            if (!queue.connection) {
                await queue.connect(channel);

                /*const soundsPath = path.join(__dirname, '../resources/sounds/');
                const joinCallSound = createAudioResource(path.join(soundsPath, 'BrayBotJoin02'));

                const joinCallSoundPlayer = createAudioPlayer();
                joinCallSoundPlayer.play(joinCallSound);
                queue.connection.subscribe(joinCallSoundPlayer);
                joinCallSoundPlayer.stop();*/
            }
        } catch {
            queue.destroy();
            return await interaction.reply({ content: 'what the helllll I couldn\'t join your channel shmeef', ephemeral: true });
        }

        let query = interaction.options.getString('query');
        const queryType = QueryResolver.resolve(query);

        // lmao
        if (queryType === QueryType.YOUTUBE_SEARCH) {
            query += ' lyrics';
        }

        const result = await interaction.client.player
            .search(query, {
                requestedBy: interaction.user,
                QueryType: QueryType.AUTO
        });

        let trackList = result.tracks;
        if (queryType === QueryType.YOUTUBE_SEARCH) {
            trackList = [trackList[0]];
        }

        if (trackList.length === 0) {
            return await interaction.reply({ content: "didn't find it silly :(", ephemeral: true });
        }

        let msg;
        if (trackList.length === 1) {
            await queue.addTrack(trackList[0]);
            msg = `*Added* **${trackList[0].title}** *to queue*`;
        } else {
            await queue.addTracks(trackList);
            msg = `*Added ${trackList.length} tracks to queue*`;
        }

        if (!queue.playing) {
            await queue.play();
        }

        interaction.reply(msg);
    },
};
