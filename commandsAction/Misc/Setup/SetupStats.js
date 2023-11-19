const { successCommand, errorCommand } = require("../../../embeds/Misc");

module.exports.SetupStats = async (client, interaction, type, name) => {
    const guildDB = await client.getGuild(interaction.guild);
    if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

    await client.createStats(guildDB);

    return interaction.reply({ embeds: [successCommand("Success", `The guild stats has been successfully setup!`)], ephemeral: true });

};