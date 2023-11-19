const { successCommand, errorCommand } = require("../../../embeds/Misc");
const { chatLeaderboard, voiceLeaderboard } = require("../../../embeds/Leaderboards");

module.exports.SetupLeaderboards = async (client, interaction, type, name) => {
    const channel = interaction.options.getChannel("channel");

    const guildDB = await client.getGuild(interaction.guild);
    if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

    const message = await channel.send({
        embeds: [
            await chatLeaderboard(interaction.guild, await client.getTop10UsersWithMostMessagesLifetime(guildDB), await client.getTop10UsersWithMostMessagesThisWeek(guildDB)),
            await voiceLeaderboard(client, interaction.guild, await client.getTop10UsersWithMostTimeSpentInVoiceChannelsLifetime(guildDB), await client.getTop10UsersWithMostTimeSpentInVoiceChannelsThisWeek(guildDB))
        ]
    });

    guildDB.leaderboards.channelId = channel.id;
    guildDB.leaderboards.messageId = message.id;
    return await guildDB.save().then(() => {
        return interaction.reply({ embeds: [successCommand("Success", `The guild leaderboard has been successfully setup!`)], ephemeral: true });
    })
};