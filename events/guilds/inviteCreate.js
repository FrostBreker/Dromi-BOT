module.exports = {
    name: "inviteCreate",
    once: false,
    async execute(client, invite) {
        client.invites.get(invite.guild.id).set(invite.code, invite.uses);
    },
};
