const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { SetChannel } = require("../../commandsAction/Misc/Set/Channels/SetChannel");
const { SetRole } = require("../../commandsAction/Misc/Set/Roles/SetRole");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set")
        .setDescription("Set guild settings")
        .setDefaultMemberPermissions(8)
        .addSubcommandGroup(group =>
            group
                .setName("roles")
                .setDescription("Set roles settings")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("administrator")
                        .setDescription("Set the administrator role")
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription("The administrator role")
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("dromi")
                        .setDescription("Set the dromi role")
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription("The dromi role")
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("twitch")
                        .setDescription("Set the twitch notification role")
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription("The twitch notification role")
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("member")
                        .setDescription("Set the member role")
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription("The member role")
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(group =>
            group
                .setName("channels")
                .setDescription("Set channels settings")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("activity")
                        .setDescription("Set the activity channel")
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription("The activity channel")
                                .setRequired(true)
                                .addChannelTypes(ChannelType.GuildText)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("joined")
                        .setDescription("Set the joined channel")
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription("The joined channel")
                                .setRequired(true)
                                .addChannelTypes(ChannelType.GuildText)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("news")
                        .setDescription("Set the news channel")
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription("The news channel")
                                .setRequired(true)
                                .addChannelTypes(ChannelType.GuildText)
                        )
                )
        ),
    runSlash: async (client, interaction) => {
        const subGroup = interaction.options.getSubcommandGroup();
        const sub = interaction.options.getSubcommand();

        switch (subGroup) {
            case "roles": {
                switch (sub) {
                    case "administrator": {
                        SetRole(client, interaction, "administatorRoleId", "administrator");
                        break;
                    }
                    case "dromi": {
                        SetRole(client, interaction, "dromiRoleId", "dromi");
                        break;
                    }
                    case "twitch": {
                        SetRole(client, interaction, "twitchRoleId", "twitch");
                        break;
                    }
                    case "member": {
                        SetRole(client, interaction, "memberRoleId", "member");
                        break;
                    }
                    default:
                        break;
                }
            }
            case "channels": {
                switch (sub) {
                    case "activity": {
                        SetChannel(client, interaction, "activityChannelId", "activity");
                        break;
                    }
                    case "joined": {
                        SetChannel(client, interaction, "joinedChannelId", "joined");
                        break;
                    }
                    case "news": {
                        SetChannel(client, interaction, "newsChannelId", "news");
                        break;
                    }
                    default:
                        break;
                }
            }
            default:
                break;
        }
    },
};