const { errorCommand, successCommand } = require("../../../../embeds/Misc");

module.exports.updateStreamer = async (client, interaction) => {
    const twitchId = interaction.options.getString("twitch");
    const notification = interaction.options.getBoolean("notification");

    const streamerFound = await client.getStreamerById(twitchId);
    if (!streamerFound) return interaction.reply({ embeds: [errorCommand("Error", `Streamer \`${twitchId}\` can't be found!`)], ephemeral: true });

    streamerFound.notification = notification;
    return await streamerFound.save().then((e) => {
        console.log(`${client.timestampParser()} --> Twitch streamer ${streamerFound.twitchUsername} has been updated!`);
        return interaction.reply({ embeds: [successCommand("Success", `The streamer \`${streamerFound.twitchUsername}\` has been successfully updated!`)], ephemeral: true });
    }).catch((e) => {
        if (e) return interaction.reply({ embeds: [errorCommand("Error", `Streamer \`${streamerFound.twitchUsername}\` can't be updated!`)], ephemeral: true });
    })
};