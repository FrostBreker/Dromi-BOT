const { errorCommand, newsMakerEmbed, successCommand } = require("../../embeds/Misc");

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return await interaction.reply("Cette commande n'existe pas!");
            return cmd.runSlash(client, interaction);
        } else if (interaction.isAutocomplete()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return await interaction.reply({ content: "This command does not exist! Please contact an administrator !", ephemeral: true });
            return cmd.autoComplete(client, interaction);
        } else if (interaction.isModalSubmit()) {
            const id = interaction.customId.split("-");
            if (id[0] === "newMakerModal") {
                const title = interaction.fields.getTextInputValue("title");
                const description = interaction.fields.getTextInputValue("description");
                const image = interaction.fields.getTextInputValue("image");
                const thumbnail = interaction.fields.getTextInputValue("thumbnail");

                const guild = interaction.guild;
                const guildDB = await client.getGuild(guild);
                if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });
                const channelId = guildDB.settings.channels.newsChannelId;
                if (!channelId) return interaction.reply({ embeds: [errorCommand("Error", "The news channel is not set")], ephemeral: true });
                const channel = await guild.channels.fetch(channelId);
                if (!channel) return interaction.reply({ embeds: [errorCommand("Error", "The news channel is not set")], ephemeral: true });
                return await channel.send({
                    content: "@everyone",
                    embeds: [await newsMakerEmbed(interaction.guild, title, description, image, thumbnail)],
                }).then(async () => {
                    return await interaction.reply({ embeds: [successCommand("Success", "The news has been sent")], ephemeral: true });
                });
            }
        } else if (interaction.isButton()) {
            const id = interaction.customId.split("-");
            if (id[0] === "acceptRules") {
                const member = interaction.member;
                const guild = interaction.guild;

                const guildDB = await client.getGuild(guild);
                if (!guildDB) return interaction.reply({ embeds: [errorCommand("Error", "An error occurred while getting the guild data")], ephemeral: true });

                const roleId = guildDB.settings.roles.memberRoleId;
                if (!roleId) return interaction.reply({ embeds: [errorCommand("Error", "The member role is not set")], ephemeral: true });
                const role = await guild.roles.fetch(roleId);
                if (!role) return interaction.reply({ embeds: [errorCommand("Error", "The member role does not exist")], ephemeral: true });

                return await member.roles.add(role).then((m) => {
                    return interaction.reply({ embeds: [successCommand("Success", `You've successfully accepted the rules and receive <@&${roleId}>!`)], ephemeral: true });
                })
            }
        }
    }
}