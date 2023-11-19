const { SlashCommandBuilder } = require("discord.js");
const { generateImageWithText, generateImageBan, generateImageJoined, generateImageKicked, generateImageTimeout } = require("../../images/Canva");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("send-image")
        .setDescription("Set guild settings")
        .addUserOption(option => option.setName("user").setDescription("User to generate image").setRequired(true)),
    autoComplete: async (client, interaction) => {
        const subGroup = interaction.options.getSubcommandGroup();
        const sub = interaction.options.getSubcommand();
        const focusedOption = interaction.options.getFocused(true);
        let choices;

        if (subGroup !== null) {
            // switch (subGroup) {
            //     case "links": {
            //         switch (sub) {
            //             case 'remove': {
            //                 switch (focusedOption.name) {
            //                     case 'url': {
            //                         choices = await client.formatLinks(interaction.guild);
            //                         break;
            //                     };
            //                     default:
            //                         break;
            //                 };
            //             };
            //             default:
            //                 break;
            //         };
            //     };
            //     default:
            //         break;
            // };
        };
        await interaction.respond(choices);
    },
    runSlash: async (client, interaction) => {
        const user = interaction.options.getUser("user");
        const message = await interaction.reply({ content: `<@${interaction.user.id}>`, files: [await generateImageJoined(user, interaction.guild.memberCount)], fetchReply: true });
        await message.react("👍");
        await message.react("👎");
    },
};