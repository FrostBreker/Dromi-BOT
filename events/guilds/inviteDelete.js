module.exports = {
    name: "inviteDelete",
    once: false,
    async execute(client, invite) {
        client.invites.get(invite.guild.id).delete(invite.code);
    },
};
