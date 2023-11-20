const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedOptions } = require("../../config");
const { errorCommand } = require("../../embeds/Misc");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Check your Stats!")
        .addUserOption(option => option.setName("user").setDescription("The user you want to check the stats of!").setRequired(false)),
    runSlash: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const user = interaction.options.getUser("user") || interaction.user;
        const guildDB = await client.getGuild(interaction.guild);
        if (!guildDB) return await interaction.editReply({ embeds: [errorCommand("Error", "This guild has no database. Please contact the bot owner.")], ephemeral: true });
        const userDB = await client.getUserById(user.id, interaction.guild.id);
        if (!userDB) return await interaction.editReply({ embeds: [errorCommand("Error", "This user has no database. Please contact the bot owner.")], ephemeral: true });
        const userStats = await client.getUserStats(guildDB, user.id);
        if (!userStats) return await interaction.editReply({ embeds: [errorCommand("Error", "You have no stats!")], ephemeral: true });
        const { chat, voices } = userStats;

        const embed = new EmbedBuilder()
            .setTitle(`${embedOptions.icons.stats} | Stats for ${user.username}`)
            .setDescription(`✦<@${user.id}> Server stats✦`)
            .addFields(
                {
                    name: `Chat`,
                    value: chat.totalMessages >= 1 ? `Most used channel: <#${chat.mostUsedChannel.channelId}> with **${chat.mostUsedChannel.messages}** messages.\nTotal messages sent in server: **${chat.totalMessages}**` : `Total messages sent in server: **${chat.totalMessages}**`,
                    inline: true
                },
                {
                    name: `Voices`,
                    value: voices.totalTime >= 1 ? `Most used channel: <#${voices.mostUsedChannel.channelId}> with **${client.convertMsToTime(voices.mostUsedChannel.time)}**.\nTime Spent in VC: **${client.convertMsToTime(voices.totalTime)}**` : `Time spent in VC: **${client.convertMsToTime(voices.totalTime)}**`,
                    inline: true
                },
                {
                    name: "Chat Level",
                    value: `**LVL: ${client.convertToRoman(userDB.messageActivity.chatLevel)}** | Current XP: **${userDB.messageActivity.chatTotalXp}**. XP needed to level up: **${client.calculateRemainingXpToNextLevel(userDB.messageActivity.chatTotalXp)}**`,
                },
                {
                    name: "Voices Level",
                    value: `**LVL: ${client.convertToRoman(userDB.voiceActivity.voiceLevel)}** | Current XP: **${userDB.voiceActivity.voiceTotalXp}**. XP needed to level up: **${client.calculateRemainingXpToNextLevel(userDB.voiceActivity.voiceTotalXp)}**`,
                }
            )
            .setTimestamp()
            .setColor(embedOptions.colors.info)


        return interaction.editReply({ embeds: [embed] });
    }
}