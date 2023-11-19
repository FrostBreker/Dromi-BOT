const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

class MiscModals {
    static NewsMakerModal() {
        const Title = new TextInputBuilder()
            .setLabel("Title")
            .setCustomId("title")
            .setPlaceholder("Title")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const Description = new TextInputBuilder()
            .setLabel("Description")
            .setCustomId("description")
            .setPlaceholder("Description")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const Image = new TextInputBuilder()
            .setLabel("Image")
            .setCustomId("image")
            .setPlaceholder("Image")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const Thumbnail = new TextInputBuilder()
            .setLabel("Thumbnail")
            .setCustomId("thumbnail")
            .setPlaceholder("Thumbnail")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        return new ModalBuilder()
            .setTitle("News Maker")
            .setCustomId("newMakerModal")
            .addComponents(
                new ActionRowBuilder().addComponents(Title),
                new ActionRowBuilder().addComponents(Description),
                new ActionRowBuilder().addComponents(Image),
                new ActionRowBuilder().addComponents(Thumbnail),
            );
    }
}

module.exports = MiscModals;