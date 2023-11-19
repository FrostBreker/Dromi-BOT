const { Collection } = require("discord.js");

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
      // const guildDB = await client.getGuild(g);
      const firstInvites = await g.invites.fetch();
      client.invites.set(g.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));

      //Fetch Members
      const members = await g.members.fetch()
      members.map(async (m) => {
        await client.getUser(m);
      });
    })
  },
};
