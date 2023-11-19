const { EmbedBuilder } = require("discord.js");
const { embedOptions } = require("../config");

class TwitchEmbed {
    static dipslayTwitchProfile({ id, login, display_name, broadcaster_type, description, profile_image_url, view_count, created_at }) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.twitch} ` + display_name)
            .setDescription(`- **Twitch Login**: ${login}\n- **Twitch ID**: ${id}\n- **Broadcaster Type**: ${broadcaster_type}\n- **Description**: ${description}\n- **View Count**: ${view_count}\n- **Created At**: <t:${parseInt(new Date(created_at).valueOf() / 1000)}:R>`)
            .setThumbnail(profile_image_url)
            .setColor(embedOptions.colors.purple)
            .setTimestamp();
    }
}

module.exports = TwitchEmbed;