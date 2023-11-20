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

    static streamEmbed(userId, { user_login, user_name, game_name, viewer_count, started_at, title, thumbnail_url }) {
        const embed = new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.streamers} ${user_name}`)
            .setDescription(`<@${userId}> is on Stream!\n**[${title}](https://www.twitch.tv/${user_login})** ${game_name ? `| **${game_name}**` : ""}\n- 👀: ${viewer_count}\n- 🕑: <t:${parseInt((new Date(started_at).getTime()) / 1000)}:R>`)
            .setColor(embedOptions.colors.info)
            .setImage(thumbnail_url.replace("{width}", "1920").replace("{height}", "1080"))
            .setTimestamp();
        return embed;
    }
}

module.exports = TwitchEmbed;