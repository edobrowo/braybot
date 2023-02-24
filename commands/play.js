const path = require('node:path');
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
//const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const { QueryType, QueryResolver } = require('discord-player');
const util = require('../util');

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
            return await interaction.reply(util.responseError(`You need to be in a channel to play music!`));
        }
        if (userChannelId && userChannelId !== botChannelId) {
            return await interaction.reply(util.responseError(`You need to be in the same channel as me to play music!`));
        }
        if (!botChannelPermissions.has(PermissionsBitField.Flags.Connect) || !botChannelPermissions.has(PermissionsBitField.Flags.Speak)) {
            return await interaction.reply(util.responseError(`I need permissions to join that channel!`));
        }

        const player = interaction.client.player;
        const queue = await player.createQueue(interaction.guild);

        try {
            if (!queue.connection) {
                await queue.connect(channel);
                console.log(`Connected to channel ${channel}`);

                // TODO: join sound. Make a small module for playing MP3s.
                /*const soundsPath = path.join(__dirname, '../resources/sounds/');
                const joinCallSound = createAudioResource(path.join(soundsPath, 'BrayBotJoin02'));

                const joinCallSoundPlayer = createAudioPlayer();
                joinCallSoundPlayer.play(joinCallSound);
                queue.connection.subscribe(joinCallSoundPlayer);
                joinCallSoundPlayer.stop();*/
            }
        } catch(err) {
            queue.destroy();
            console.log(`Failed to connect to channel ${channel} due to ${err}`);
            return await interaction.reply(util.responseError(`I couldn't join that channel!`));
        }

        let query = interaction.options.getString('query');
        const queryType = QueryResolver.resolve(query);
        console.log(`Query is: ${query}, Query type is: ${queryType}`);

        // TODO: add a Spotify query method to avoid this. On that note, some tracks on Spotify seem to be unavailable.
        //      To work around this, add a redundancy search on YouTube if the Spotify query returns null.

        // Extremely scuffed method to avoid queueing music videos from YouTube:
        if (queryType === QueryType.YOUTUBE_SEARCH) {
            query += ' lyrics';
        }

        const result = await player
            .search(query, {
                requestedBy: interaction.user,
                QueryType: QueryType.AUTO
        });

        let trackList = result.tracks;

        if (trackList.length === 0) {
            return await interaction.reply(util.responseError(`I couldn't find that song!`));
        }

        // There's an issue with how discord-player handles Spotify albums so for now they're disabled
        if (queryType === QueryType.SPOTIFY_ALBUM) {
            return await interaction.reply(util.responseError(`I can't play Spotify Albums right now, sorry :(`));
        }

        // Only add the first track from a YouTube search query, otherwise add all tracks
        if (queryType === QueryType.YOUTUBE_SEARCH) {
            trackList = [trackList[0]];
        }

        console.log(`Adding ${trackList}`);
        await queue.addTracks(trackList);

        // Set response message based on the number of tracks played
        let msgStr;
        if (trackList.length === 1) {
            msgStr = `*Added* **${trackList[0].title}** *to queue*`;
        } else {
            msgStr = `*Added ${trackList.length} tracks to queue*`;
        }

        if (!queue.playing) {
            console.log(queue.play);
            await queue.play();
            console.log(`Player has started. Now playing ${trackList}`);
        }

        await interaction.reply(util.responseInfo(msgStr));
    },
};
