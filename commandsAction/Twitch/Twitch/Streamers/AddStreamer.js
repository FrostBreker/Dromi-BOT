const { yesOrNoButtons } = require("../../../../buttons/Misc");
const { errorCommand, successCommand } = require("../../../../embeds/Misc");
const { dipslayTwitchProfile } = require("../../../../embeds/Twitch");

module.exports.addStreamer = async (client, interaction) => {
    const user = interaction.options.getUser("user");
    const twitchUsername = interaction.options.getString("twitch");
    const notification = interaction.options.getBoolean("notification");

    const streamerFound = await client.getStreamerByUsername(twitchUsername);
    if (streamerFound) return interaction.reply({ embeds: [errorCommand("Error", `Streamer \`${twitchUsername}\` already exists!`)], ephemeral: true });

    const twitchData = await client.twitchAPI.getChannelData(twitchUsername);
    if (!twitchData) return interaction.reply({ embeds: [errorCommand("Error", "Twitch channel not found!")], ephemeral: true });

    const response = await interaction.reply({ embeds: [dipslayTwitchProfile(twitchData)], components: [yesOrNoButtons()], ephemeral: true });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 120000 });
        if (confirmation.customId === "yes") {
            const streamer = await client.createStreamer(interaction.guild.id, {
                userId: user.id,
                username: user.username,
                twitchId: twitchData.id,
                twitchUsername: twitchData.login,
                notification: notification
            });
            if (!streamer) return await confirmation.update({ embeds: [errorCommand("Error", `Error while saving <@${user.id}> as \`${twitchUsername}\`!`)], components: [], ephemeral: true });
            return await confirmation.update({ content: `<@${user.id}> has been successfully saved as \`${twitchUsername}\`!`, components: [], ephemeral: true });
        } else if (confirmation.customId === "no") {
            return await confirmation.update({ embeds: [successCommand("Success", `Action has been successfully **canceled**!`)], components: [], ephemeral: true });
        }
    } catch (e) {
        console.log(e);
        return await interaction.editReply({ content: 'Confirmation not received within 2 minute, cancelling', components: [], ephemeral: true });
    }
};