const { xp: { chat } } = require("../../config")
module.exports = {
    name: "messageCreate",
    once: false,
    async execute(client, message) {
        if (message.author.bot) return;
        const channel = message.channel;

        const guildDB = await client.getGuild(message.guild);
        if (guildDB) {
            await client.updateStats(
                guildDB,
                message.author.id,
                "chat",
                {
                    channelId: channel.id,
                }
            )
        }

        const now = Date.now();
        const cooldown = client.chatCooldowns.get(message.author.id) || 0;
        if (now > cooldown) {
            //Add 5xp to the user's account
            const userDB = await client.getUser(message.member);
            await client.addXpToUser(userDB, chat, "chat");
        }
    },
};
