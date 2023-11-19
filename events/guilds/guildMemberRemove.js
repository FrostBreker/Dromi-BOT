const { AuditLogEvent } = require("discord.js");
const { generateImageBan, generateImageKicked } = require("../../images/Canva");

module.exports = {
    name: "guildMemberRemove",
    once: false,
    async execute(client, member) {
        const guild = member.guild;
        const guildDB = await client.getGuild(guild);
        if (!guildDB) return;

        const userDB = await client.getUserById(member.user.id, guild.id);
        if (!userDB) return;

        const audits = await guild.fetchAuditLogs();
        const audit = audits.entries.first();
        if (!audit) return;

        const channelId = guildDB.settings.channels.activityChannelId;
        const channel = await guild.channels.fetch(channelId);
        if (!channel) return;

        switch (audit.action) {
            case AuditLogEvent.MemberBanAdd: {
                userDB.guildActivity.ban.counter = userDB.guildActivity.ban.counter + 1;
                const message = await channel.send({ content: `<@${member.user.id}>`, files: [await generateImageBan(member.user, userDB.guildActivity.ban.counter)], fetchReply: true })
                await message.react("👍");
                await message.react("👎");
                await userDB.save();
                break;
            }
            case AuditLogEvent.MemberKick: {
                userDB.guildActivity.kick.counter = userDB.guildActivity.kick.counter + 1;
                const message = await channel.send({ content: `<@${member.user.id}>`, files: [await generateImageKicked(member.user, userDB.guildActivity.kick.counter)], fetchReply: true })
                await message.react("👍");
                await message.react("👎");
                await userDB.save();
                break;
            }
        }
    }
}