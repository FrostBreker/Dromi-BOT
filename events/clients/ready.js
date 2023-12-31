const cron = require("node-cron");
const { chatLeaderboard, voiceLeaderboard } = require("../../embeds/Leaderboards");
const { guildId, xp: { voice } } = require("../../config");
const { streamEmbed } = require("../../embeds/Twitch");
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

    //STREAMS FUNCTIONS
    cron.schedule("*/5 * * * *", async () => {
      const guild = await client.guilds.cache.get(guildId);
      if (!guild) return;

      const guildDB = await client.getGuild(guild);
      if (!guildDB) return;

      const twitchSettings = guildDB.settings.twitch;
      if (!twitchSettings.notification.enabled) return;

      const streamers = await client.getAllStreamers(guildId);
      if (!streamers) return;

      const channelId = twitchSettings.notification.channelId;
      if (!channelId) return;
      const channel = await guild.channels.fetch(channelId);
      if (!channel) return;

      streamers.forEach(async user => {
        const { twitchUsername, userId, notification } = user;
        if (!notification) return;
        const streamData = await client.twitchAPI.getStreamData(twitchUsername);
        if (streamData.data[0]) {
          if (client.currentTwitchStreams.get(userId)) return;
          return await channel.send({ content: `<@&${guildDB.settings.roles.twitchRoleId}>`, embeds: [streamEmbed(userId, streamData.data[0])] }).then((m) => {
            client.currentTwitchStreams.set(userId, m.id);
          })
        } else {
          client.currentTwitchStreams.delete(userId);
        }
      });
    });

    //VOICE STATS
    cron.schedule("*/1 * * * *", async () => {
      client.usersInVoice.forEach(async (user) => {
        const guildDB = await client.getGuild(user.guild);
        if (!guildDB) return;
        const timeSpent = Date.now() - user.time;
        //Update stats
        await client.updateStats(guildDB, user.userId, "voices", {
          time: timeSpent,
          channelId: user.channelId,
        });
        //we get the user from the database
        const userDB = await client.getUser(user.member);
        //we add xp to the user
        await client.addXpToUser(userDB, 1 * voice, "voice");
        client.usersInVoice.set(user.userId, {
          time: Date.now(),
          guild: user.guild,
          channelId: user.channelId,
          userId: user.userId,
          member: user.member
        });
      });
    });
  },
};
