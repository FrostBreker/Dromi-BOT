const { errorCommand, newsMakerEmbed, successCommand } = require("../../embeds/Misc");
const { getNotificationRoleSelectMenu, getCountryRoleSelectMenu, getAgeRoleSelectMenu, getMusicRoleSelectMenu } = require("../../selectMenus/Misc");

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
                    content: `<@&${guildDB.settings.roles.newsRoleId}>`,
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
        } else if (interaction.isStringSelectMenu()) {
            const customId = interaction.customId.split("-");
            if (customId[0] === "notificationRoleMenuChooser") {
                const guild = interaction.guild;
                const guildDB = await client.getGuild(guild);
                await interaction.message.edit({ components: [getNotificationRoleSelectMenu(guildDB.settings.roles), getCountryRoleSelectMenu(), getMusicRoleSelectMenu(), getAgeRoleSelectMenu()] });
                const rolesId = interaction.values;
                const member = interaction.member;

                for (id of rolesId) {
                    const role = await guild.roles.fetch(id);
                    if (!role) return interaction.reply({ embeds: [errorCommand("Error", "The role does not exist")], ephemeral: true });
                    if (member.roles.cache.has(role.id)) {
                        await member.roles.remove(role);
                    } else {
                        await member.roles.add(role);
                    }
                }
                return interaction.reply({ embeds: [successCommand("Success", `You've successfully updated your roles roles!`)], ephemeral: true });
            } else if (customId[0] === "countryRoleMenuChooser") {
                const guild = interaction.guild;
                await interaction.message.edit({ components: [getNotificationRoleSelectMenu(guildDB.settings.roles), getCountryRoleSelectMenu(), getMusicRoleSelectMenu(), getAgeRoleSelectMenu()] });
                const rolesId = interaction.values;
                const member = interaction.member;

                const aboveDividerRole = await guild.roles.fetch("830547487285706782");
                if (!aboveDividerRole) return interaction.reply({ embeds: [errorCommand("Error", "The role does not exist")], ephemeral: true });
                const belowDividerRole = await guild.roles.fetch("830547596338266173");
                if (!belowDividerRole) return interaction.reply({ embeds: [errorCommand("Error", "The role does not exist")], ephemeral: true });
                await member.roles.add(aboveDividerRole);
                await member.roles.remove(belowDividerRole);

                for (id of rolesId) {
                    const role = await guild.roles.fetch(id);
                    if (!role) return interaction.reply({ embeds: [errorCommand("Error", "The role does not exist")], ephemeral: true });
                    if (member.roles.cache.has(role.id)) {
                        await member.roles.remove(role);
                    } else {
                        await member.roles.add(role);
                    }
                }
                return interaction.reply({ embeds: [successCommand("Success", `You've successfully updated your roles roles!`)], ephemeral: true });
            } else if (customId[0] === "musicRoleMenuChooser") {
                const guild = interaction.guild;
                await interaction.message.edit({ components: [getNotificationRoleSelectMenu(guildDB.settings.roles), getCountryRoleSelectMenu(), getMusicRoleSelectMenu(), getAgeRoleSelectMenu()] });
                const rolesId = interaction.values;
                const member = interaction.member;

                const aboveDividerRole = await guild.roles.fetch("830547596338266173");
                if (!aboveDividerRole) return interaction.reply({ embeds: [errorCommand("Error", "The role does not exist")], ephemeral: true });
                const belowDividerRole = await guild.roles.fetch("830547601874878464");
                if (!belowDividerRole) return interaction.reply({ embeds: [errorCommand("Error", "The role does not exist")], ephemeral: true });
                await member.roles.add(aboveDividerRole);
                await member.roles.remove(belowDividerRole);

                for (id of rolesId) {
                    const role = await guild.roles.fetch(id);
                    if (!role) return interaction.reply({ embeds: [errorCommand("Error", "The role does not exist")], ephemeral: true });
                    if (member.roles.cache.has(role.id)) {
                        await member.roles.remove(role);
                    } else {
                        await member.roles.add(role);
                    }
                }
                return interaction.reply({ embeds: [successCommand("Success", `You've successfully updated your roles roles!`)], ephemeral: true });
            } else if (customId[0] === "ageRoleMenuChooser") {
                const guild = interaction.guild;
                await interaction.message.edit({ components: [getNotificationRoleSelectMenu(guildDB.settings.roles), getCountryRoleSelectMenu(), getMusicRoleSelectMenu(), getAgeRoleSelectMenu()] });
                const rolesId = interaction.values;
                const member = interaction.member;

                const aboveDividerRole = await guild.roles.fetch("830547601874878464");
                if (!aboveDividerRole) return interaction.reply({ embeds: [errorCommand("Error", "The role does not exist")], ephemeral: true });
                const belowDividerRole = await guild.roles.fetch("830547605410676746");
                if (!belowDividerRole) return interaction.reply({ embeds: [errorCommand("Error", "The role does not exist")], ephemeral: true });
                await member.roles.add(aboveDividerRole);
                await member.roles.remove(belowDividerRole);

                for (id of rolesId) {
                    const role = await guild.roles.fetch(id);
                    if (!role) return interaction.reply({ embeds: [errorCommand("Error", "The role does not exist")], ephemeral: true });
                    if (member.roles.cache.has(role.id)) {
                        await member.roles.remove(role);
                    } else {
                        await member.roles.add(role);
                    }
                }
                return interaction.reply({ embeds: [successCommand("Success", `You've successfully updated your roles roles!`)], ephemeral: true });
            }
        }
    }
}