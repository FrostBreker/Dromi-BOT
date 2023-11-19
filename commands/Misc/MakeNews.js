const { SlashCommandBuilder } = require("discord.js");
const { errorCommand } = require("../../embeds/Misc");
const { NewsMakerModal } = require("../../modals/Misc");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("news")
        .setDescription("Send a news")
        .setDefaultMemberPermissions(8),
    runSlash: async (client, interaction) => {
        const guildDB = await client.getGuild(interaction.guild);
        if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

        const newsChannelId = guildDB.settings.channels.newsChannelId;
        if (!newsChannelId) return interaction.reply({ embeds: [errorCommand("Error", "The news channel is not set")], ephemeral: true });
        else return interaction.showModal(NewsMakerModal())
    },
};