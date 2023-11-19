const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { errorCommand, successCommand, rulesEmbed, chooseRoleEmbed } = require("../../embeds/Misc");
const { acceptRulesButton } = require("../../buttons/Misc");
const { getNotificationRoleSelectMenu, getRolesSelectMenu } = require("../../selectMenus/Misc");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the guild")
        .setDefaultMemberPermissions(8)
        .addChannelOption((option) =>
            option
                .setName("rules")
                .setDescription("Rules channel")
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption((option) =>
            option
                .setName("choose")
                .setDescription("Choose role channel")
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)
        ),
    runSlash: async (client, interaction) => {
        const ruleChannel = interaction.options.getChannel("rules");
        const chooseChannel = interaction.options.getChannel("choose");

        const guildDB = await client.getGuild(interaction.guild);
        if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

        if (ruleChannel) {
            const updateRulesChannel = await client.settingsSetter(guildDB._id, `channels.rulesChannelId`, ruleChannel.id);
            if (!updateRulesChannel) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while updating the guild data")] });

            await ruleChannel.send({
                embeds: [await rulesEmbed(interaction.guild)],
                components: [acceptRulesButton()],
            });
        }

        if (chooseChannel) {
            const roles = guildDB.settings.roles;
            const updateChooseChannel = await client.settingsSetter(guildDB._id, `channels.chooseRoleChannelId`, chooseChannel.id);
            if (!updateChooseChannel) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while updating the guild data")] });

            await chooseChannel.send({
                embeds: [await chooseRoleEmbed(interaction.guild)],
                components: [getNotificationRoleSelectMenu(roles)],
            });
        }

        return interaction.reply({ embeds: [successCommand("Success", `The guild has been successfully setup!`)], ephemeral: true });
    },
};