const { boostServer } = require("../../embeds/Misc");

module.exports = {
    name: "guildMemberUpdate",
    once: false,
    async execute(client, oldMember, newMember) {
        const guild = newMember.guild;
        const guildDB = await client.getGuild(guild);
        if (!guildDB) return;
        if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) {
            const boostChannelId = guildDB.settings.channels.boostChannelId;
            if (!boostChannelId) return;
            const channel = await guild.channels.fetch(boostChannelId);
            if (!channel) return;
            return await channel.send({
                embeds: [await boostServer(newMember.user)]
            })
        }
    },
};
