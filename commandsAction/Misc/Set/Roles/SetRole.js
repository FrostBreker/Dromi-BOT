const { errorCommand, successCommand } = require("../../../../embeds/Misc");

module.exports.SetRole = async (client, interaction, type, name) => {
    const role = interaction.options.getRole("role");
    const guildDB = await client.getGuild(interaction.guild);
    if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

    const updated = await client.settingsSetter(guildDB._id, `roles.${type}`, role.id);
    if (!updated) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while updating the guild data")], ephemeral: true });

    return interaction.reply({ embeds: [successCommand("Success", `The **${name}** role has been set to <@&${role.id}>`)], ephemeral: true });
};