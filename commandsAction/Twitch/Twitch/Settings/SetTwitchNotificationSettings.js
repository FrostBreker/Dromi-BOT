const { errorCommand, successCommand } = require("../../../../embeds/Misc");

module.exports.setTwitchNotificationSettings = async (client, interaction) => {
    const enabled = interaction.options.getBoolean("enabled");
    const channel = interaction.options.getChannel("channel");
    const interval = interaction.options.getInteger("interval");

    const guildDB = await client.getGuild(interaction.guild);
    if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

    if (enabled !== null) {
        const enbaledUpdated = await client.settingsSetter(guildDB._id, "twitch.notification.enabled", enabled);
        if (!enbaledUpdated) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while updating the guild data")], ephemeral: true });
    }

    if (channel) {
        const channelUpdated = await client.settingsSetter(guildDB._id, "twitch.notification.channelId", channel.id);
        if (!channelUpdated) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while updating the guild data")], ephemeral: true });
    }

    if (interval) {
        const intervalUpdated = await client.settingsSetter(guildDB._id, "twitch.notification.interval", interval);
        if (!intervalUpdated) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while updating the guild data")], ephemeral: true });
    }

    return interaction.reply({ embeds: [successCommand("Success", `Twitch notification settings has been sucessfully updated!\n- **Enabled**:${enabled}\n- **Channel**: <#${channel ? channel.id : guildDB.settings.twitch.notification.channelId}>\n- **Interval**: ${interval ? interval : guildDB.settings.twitch.notification.interval}`)], ephemeral: true });
};