const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { errorCommand, successCommand, rulesEmbed } = require("../../embeds/Misc");
const { acceptRulesButton } = require("../../buttons/Misc");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the guild")
        .setDefaultMemberPermissions(8)
        .addChannelOption((option) =>
            option
                .setName("rules")
                .setDescription("Rules channel")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    runSlash: async (client, interaction) => {
        const ruleChannel = interaction.options.getChannel("rules");

        const guildDB = await client.getGuild(interaction.guild);
        if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

        const updateRulesChannel = await client.settingsSetter(guildDB._id, `channels.rulesChannelId`, ruleChannel.id);
        if (!updateRulesChannel) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while updating the guild data")] });

        await ruleChannel.send({
            embeds: [await rulesEmbed(interaction.guild)],
            components: [acceptRulesButton()],
        });

        return interaction.reply({ embeds: [successCommand("Success", `The rules channel has been set to <#${ruleChannel.id}>`)], ephemeral: true });
    },
};