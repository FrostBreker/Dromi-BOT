const { xp: { voice } } = require("../../config.js");

module.exports = {
    name: "voiceStateUpdate",
    once: false,
    async execute(client, oldState, newState) {
        if (oldState.member.user.bot) return;

        const updateStatsAndLevel = async () => {
            const userData = client.voicesCooldowns.get(oldState.member.id);
            const { time, channelId } = userData;
            const timeSpent = Date.now() - time;
            const minutes = Math.floor(timeSpent / 60000);
            const guildDB = await client.getGuild(oldState.guild);
            if (!guildDB) return;
            //Update stats
            await client.updateStats(guildDB, oldState.member.id, "voices", {
                time: timeSpent,
                channelId,
            });
            console.log(`${client.timestampParser()} --> User <@${oldState.member.id}> was in the channel for ${minutes} minutes`);
            //we check if the user was in the voice channel for more than 1 minute
            if (minutes > 1) {
                //we get the user from the database
                const userDB = await client.getUser(oldState.member);
                //we add xp to the user
                await client.addXpToUser(userDB, minutes * voice, "voice");
            }
            client.voicesCooldowns.delete(oldState.member.id);
        };

        //User join or left a new channel
        if (oldState.channelId && newState.channelId !== oldState.channelId) {
            // User left a channel
            if (!newState.channelId) {
                console.log(`${client.timestampParser()} --> User <@${oldState.member.id}> left a channel <#${oldState.channelId}>`);
                await updateStatsAndLevel();
            } else {
                console.log(`${client.timestampParser()} --> User <@${oldState.member.id}> changed channel <#${oldState.channelId}> to <#${newState.channelId}>`);
                // User joined a channel
                await updateStatsAndLevel();
                //we add the user to the collection
                client.voicesCooldowns.set(oldState.member.id, {
                    time: Date.now(),
                    channelId: newState.channelId,
                });
            }
        } else if (!oldState.channelId && newState.channelId) {
            console.log(`${client.timestampParser()} --> User <@${newState.member.id}> joined a channel <#${newState.channelId}>`);
            // User joined a channel
            if (client.voicesCooldowns.has(oldState.member.id)) {
                client.voicesCooldowns.delete(oldState.member.id);
            }
            //we add the user to the collection
            client.voicesCooldowns.set(oldState.member.id, {
                time: Date.now(),
                channelId: newState.channelId,
            });
        }
    },
};
