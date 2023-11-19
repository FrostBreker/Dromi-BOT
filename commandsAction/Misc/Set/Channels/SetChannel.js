const { errorCommand, successCommand } = require("../../../../embeds/Misc");

module.exports.SetChannel = async (client, interaction, type, name) => {
    const channel = interaction.options.getChannel("channel");

    const guildDB = await client.getGuild(interaction.guild);
    if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

    const updated = await client.settingsSetter(guildDB._id, `channels.${type}`, channel.id);
    if (!updated) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while updating the guild data")], ephemeral: true });

    return interaction.reply({ embeds: [successCommand("Success", `The **${name}** channel has been set to <#${channel.id}>`)], ephemeral: true });
};