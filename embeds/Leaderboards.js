const { EmbedBuilder } = require("discord.js");
const { embedOptions } = require("../config");

class LeaderboardEmbeds {
    static async chatLeaderboard(guild, lifetimeData, weeklyData) {
        return new EmbedBuilder()
            .setTitle(`${embedOptions.icons.message} | ` + "Messages Leaderboard")
            .addFields(
                {
                    name: "> Lifetime                     ",
                    value: `${lifetimeData.map(({ userId, totalMessages }, index) => {
                        return `- <@${userId}>   ▶️   **${totalMessages}**`
                    }).join("\n")}`,
                    inline: true,
                },
                {
                    name: "> Weekly                     ",
                    value: `${weeklyData.map(({ userId, totalMessages }, index) => {
                        return `- <@${userId}>   ▶️   **${totalMessages}**`
                    }).join("\n")}`,
                    inline: true,
                }
            )
            .setThumbnail(await guild.iconURL({ dynamic: true }))
            .setColor(embedOptions.colors.info)
            .setTimestamp();
    }

    static async voiceLeaderboard(client, guild, lifetimeData, weeklyData) {
        return new EmbedBuilder()
            .setTitle(`${embedOptions.icons.sound} | ` + "Voice Leaderboard")
            .addFields(
                {
                    name: "> Lifetime",
                    value: `${lifetimeData.map(({ userId, totalTime }, index) => {
                        return `- <@${userId}>   ▶️   **${client.convertMsToTime(totalTime)}**`
                    }).join("\n")}`,
                    inline: true,
                },
                {
                    name: "> Weekly",
                    value: `${weeklyData.map(({ userId, totalTime }, index) => {
                        return `- <@${userId}>   ▶️   **${client.convertMsToTime(totalTime)}**`
                    }).join("\n")}`,
                    inline: true,
                }
            )
            // .setThumbnail(await guild.iconURL({ dynamic: true }))
            .setColor(embedOptions.colors.info)
            .setTimestamp();
    }
}

module.exports = LeaderboardEmbeds;