const { acceptRulesButton } = require("../../../buttons/Misc");
const { rulesEmbed, successCommand, errorCommand } = require("../../../embeds/Misc");

module.exports.SetupRules = async (client, interaction, type, name) => {
    const ruleChannel = interaction.options.getChannel("rules");

    const guildDB = await client.getGuild(interaction.guild);
    if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

    const updateRulesChannel = await client.settingsSetter(guildDB._id, `channels.rulesChannelId`, ruleChannel.id);
    if (!updateRulesChannel) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while updating the guild data")] });

    await ruleChannel.send({
        embeds: [await rulesEmbed(interaction.guild)],
        components: [acceptRulesButton()],
    });

    return interaction.reply({ embeds: [successCommand("Success", `The guild rules has been successfully setup!`)], ephemeral: true });

};