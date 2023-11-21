const { xp: { voice } } = require("../../config.js");

module.exports = {
    name: "voiceStateUpdate",
    once: false,
    async execute(client, oldState, newState) {
        if (oldState.member.user.bot) return;

        //User join or left a new channel
        if (oldState.channelId && newState.channelId !== oldState.channelId) {
            // User left a channel
            if (!newState.channelId) {
                console.log(`${client.timestampParser()} --> User <@${oldState.member.id}> left a channel <#${oldState.channelId}>`);
                //we remove the user from the collection
                client.usersInVoice.delete(oldState.member.id);
            } else {
                console.log(`${client.timestampParser()} --> User <@${oldState.member.id}> changed channel <#${oldState.channelId}> to <#${newState.channelId}>`);
                // User joined a channel
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

            //We Save the user joined the voice channel
            client.usersInVoice.set(newState.member.id, {
                time: Date.now(),
                guild: newState.guild,
                channelId: newState.channelId,
                userId: newState.member.id,
                member: newState.member,
            });
        }
    },
};
