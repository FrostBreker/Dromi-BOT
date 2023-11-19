const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { SetTwitchNotificationSettings } = require("../../commandsAction/Twitch/Twitch/Settings");
const { AddTwitchStreamer, RemoveTwitchStreamer, UpdateTwitchStreamer } = require("../../commandsAction/Twitch/Twitch/Streamers");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("twitch")
        .setDescription("Set twitch settings")
        .setDefaultMemberPermissions(8)
        .addSubcommandGroup(group =>
            group
                .setName("settings")
                .setDescription("Set twitch settings")
                .addSubcommand(sub =>
                    sub
                        .setName("notification")
                        .setDescription("Set twitch notification settings")
                        .addBooleanOption(option =>
                            option
                                .setName("enabled")
                                .setDescription("Enable or disable twitch notifications")
                                .setRequired(true)
                        )
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription("The twitch channel")
                                .setRequired(false)
                                .addChannelTypes(ChannelType.GuildText)
                        )
                        .addIntegerOption(option =>
                            option
                                .setName("interval")
                                .setDescription("The interval between each check (in minutes)")
                                .setMaxValue(60)
                                .setMinValue(1)
                                .setRequired(false)
                        )
                )
        )
        .addSubcommandGroup(group =>
            group
                .setName("streamers")
                .setDescription("Add, remove, update a streamer")
                //On Add send twitch profile with button || Yes or No!
                .addSubcommand(sub =>
                    sub
                        .setName("add")
                        .setDescription("Add a streamer")
                        .addUserOption(option =>
                            option
                                .setName("user")
                                .setDescription("The streamer's user on Discord")
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName("twitch")
                                .setDescription("The streamer's username")
                                .setRequired(true)
                        )
                        .addBooleanOption(option =>
                            option
                                .setName("notification")
                                .setDescription("Enable or disable twitch notifications for this streamer")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("remove")
                        .setDescription("Remove a streamer")
                        .addStringOption(option =>
                            option
                                .setName("twitch")
                                .setDescription("The streamer's username")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("update")
                        .setDescription("Update a streamer")
                        .addStringOption(option =>
                            option
                                .setName("twitch")
                                .setDescription("The streamer's username")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                        .addBooleanOption(option =>
                            option
                                .setName("notification")
                                .setDescription("Enable or disable twitch notifications for this streamer")
                                .setRequired(true)
                        )
                ),
        ),
    autoComplete: async (client, interaction) => {
        const subGroup = interaction.options.getSubcommandGroup();
        const sub = interaction.options.getSubcommand();
        const focusedOption = interaction.options.getFocused(true);
        let choices;

        if (subGroup !== null) {
            switch (subGroup) {
                case "streamers": {
                    switch (sub) {
                        case 'remove': {
                            switch (focusedOption.name) {
                                case 'twitch': {
                                    choices = await client.formatStreamers(interaction.guild.id);
                                    break;
                                };
                                default:
                                    break;
                            };
                        };
                        case 'update': {
                            switch (focusedOption.name) {
                                case 'twitch': {
                                    choices = await client.formatStreamers(interaction.guild.id);
                                    break;
                                };
                                default:
                                    break;
                            };
                        };
                        default:
                            break;
                    };
                };
                default:
                    break;
            };
        };
        await interaction.respond(choices);
    },
    runSlash: async (client, interaction) => {
        const subGroup = interaction.options.getSubcommandGroup();
        const sub = interaction.options.getSubcommand();

        switch (subGroup) {
            case "settings": {
                switch (sub) {
                    case "notification": {
                        SetTwitchNotificationSettings(client, interaction)
                        break;
                    }
                    default:
                        break;
                }
            }
            case "streamers": {
                switch (sub) {
                    case "add": {
                        AddTwitchStreamer(client, interaction);
                        break;
                    }
                    case "remove": {
                        RemoveTwitchStreamer(client, interaction);
                        break;
                    }
                    case "update": {
                        UpdateTwitchStreamer(client, interaction);
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