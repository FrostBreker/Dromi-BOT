const { errorCommand, successCommand } = require("../../../../embeds/Misc");

module.exports.removeStreamer = async (client, interaction) => {
    const twitchId = interaction.options.getString("twitch");

    const streamerFound = await client.getStreamerById(twitchId);
    if (!streamerFound) return interaction.reply({ embeds: [errorCommand("Error", `Streamer \`${twitchId}\` can't be found!`)], ephemeral: true });

    const removedStreamer = await client.deleteStreamer(interaction.guild.id, twitchId);
    if (!removedStreamer) return interaction.reply({ embeds: [errorCommand("Error", `Streamer \`${streamerFound.twitchUsername}\` can't be removed!`)], ephemeral: true });
    else return interaction.reply({ embeds: [successCommand("Success", `Streamer \`${streamerFound.twitchUsername}\` has been removed!`)], ephemeral: true });
};