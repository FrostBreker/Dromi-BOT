const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { embedOptions } = require("../config");

class MiscButtons {
    static yesOrNoButtons() {
        const noButton = new ButtonBuilder()
            .setCustomId("no")
            .setLabel("No")
            .setEmoji(embedOptions.icons.no)
            .setStyle(ButtonStyle.Danger);

        const yesButton = new ButtonBuilder()
            .setCustomId("yes")
            .setLabel("Yes")
            .setEmoji(embedOptions.icons.yes)
            .setStyle(ButtonStyle.Success);

        return new ActionRowBuilder()
            .addComponents(yesButton, noButton);
    }

    static acceptRulesButton() {
        const acceptButton = new ButtonBuilder()
            .setCustomId("acceptRules")
            .setLabel("Accept")
            .setEmoji(embedOptions.icons.yes)
            .setStyle(ButtonStyle.Success);

        return new ActionRowBuilder()
            .addComponents(acceptButton);
    }
}

module.exports = MiscButtons;