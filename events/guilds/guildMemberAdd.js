const { generateImageJoined } = require("../../images/Canva");

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(client, member) {
        const guild = member.guild;
        const guildDB = await client.getGuild(guild);
        if (!guildDB) return;

        let firstJoin = false;
        let userDB = await client.getUserById(member.user.id, guild.id);
        if (!userDB) {
            firstJoin = true;
            userDB = await client.createUser(member);
        }
        userDB.joinedCounter += 1;
        await userDB.save();

        const channelId = guildDB.settings.channels.joinedChannelId;
        const channel = await guild.channels.fetch(channelId);
        if (!channel) return;

        const message = await channel.send({ content: `<@${member.user.id}>`, files: [await generateImageJoined(member.user, guild.memberCount)], fetchReply: true })
        return await message.react("👋");
    }
}