const { Collection } = require("discord.js");
const cron = require("node-cron");
const { chatLeaderboard, voiceLeaderboard } = require("../../embeds/Leaderboards");
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.twitchAPI.on('ready', (async () => {
      console.log(`${client.timestampParser()} --> Twitch API initialized`);
    }));
    console.log(`${client.timestampParser()} --> ${client.user.tag} is online!`);

    //GUILDS FUNCTIONS
    await client.guilds.cache.map(async (g) => {
      await client.getGuild(g);

      //Fetch Members
      const members = await g.members.fetch()
      members.map(async (m) => {
        await client.getUser(m);
      });
    })

    //Create stats
    cron.schedule(`0 0 * * *`, async () => {
      await client.guilds.cache.map(async (g) => {
        const guildDB = await client.getGuild(g);
        if (!guildDB) return;

        const newGuildDB = await client.createStats(guildDB);
        if (!newGuildDB) return;
      });
    });

    //Update leaderboards
    cron.schedule(`*/5 * * * *`, async () => {
      return await client.guilds.cache.map(async (g) => {
        const guildDB = await client.getGuild(g);
        if (!guildDB) return;

        const leaderboard = guildDB.leaderboards;
        if (!leaderboard) return;

        if (leaderboard.channelId && leaderboard.messageId) {
          const channel = await g.channels.fetch(leaderboard.channelId);
          if (channel) {
            const message = await channel.messages.fetch(leaderboard.messageId);
            if (message) {
              await message.edit({
                embeds: [
                  await chatLeaderboard(g, await client.getTop10UsersWithMostMessagesLifetime(guildDB), await client.getTop10UsersWithMostMessagesThisWeek(guildDB)),
                  await voiceLeaderboard(client, g, await client.getTop10UsersWithMostTimeSpentInVoiceChannelsLifetime(guildDB), await client.getTop10UsersWithMostTimeSpentInVoiceChannelsThisWeek(guildDB))
                ]
              });
            }
          };
        };
      });
    });
  },
};
