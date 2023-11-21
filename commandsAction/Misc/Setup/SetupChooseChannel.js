const { successCommand, errorCommand } = require("../../../embeds/Misc");
const { chooseRoleEmbed } = require("../../../embeds/Misc");
const { getNotificationRoleSelectMenu, getMusicRoleSelectMenu, getAgeRoleSelectMenu, getCountryRoleSelectMenu } = require("../../../selectMenus/Misc");

module.exports.SetupChooseChannel = async (client, interaction, type, name) => {
    const chooseChannel = interaction.options.getChannel("channel");

    const guildDB = await client.getGuild(interaction.guild);
    if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

    const roles = guildDB.settings.roles;
    const updateChooseChannel = await client.settingsSetter(guildDB._id, `channels.chooseRoleChannelId`, chooseChannel.id);
    if (!updateChooseChannel) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while updating the guild data")] });

    await chooseChannel.send({
        embeds: [await chooseRoleEmbed(interaction.guild)],
        components: [getNotificationRoleSelectMenu(roles), getCountryRoleSelectMenu(), getMusicRoleSelectMenu(), getAgeRoleSelectMenu()],
    });

    return interaction.reply({ embeds: [successCommand("Success", `The guild choose channel has been successfully setup!`)], ephemeral: true });

};