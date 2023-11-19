const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { SetupRules } = require("../../commandsAction/Misc/Setup/SetupRules");
const { SetupChooseChannel } = require("../../commandsAction/Misc/Setup/SetupChooseChannel");
const { SetupStats } = require("../../commandsAction/Misc/Setup/SetupStats");
const { SetupLeaderboards } = require("../../commandsAction/Misc/Setup/SetupLeaderboards");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the guild")
        .setDefaultMemberPermissions(8)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("rules")
                .setDescription("Setup the rules channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("Rules channel")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("choose")
                .setDescription("Setup the choose role channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("Choose role channel")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("stats")
                .setDescription("Initialize the stats")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("leaderboards")
                .setDescription("Setup the leaderboard channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("Leaderboard channel")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        ),
    runSlash: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "rules":
                return SetupRules(client, interaction);
            case "choose":
                return SetupChooseChannel(client, interaction);
            case "stats":
                return SetupStats(client, interaction);
            case "leaderboards":
                return SetupLeaderboards(client, interaction);
            default:
                break;
        }
    },
};