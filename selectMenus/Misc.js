const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, parseEmoji } = require("discord.js");

class MiscSelectMenus {
    static getCountryRoleSelectMenu() {
        const countryRoleSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("countryRoleMenuChooser")
            .setOptions([
                new StringSelectMenuOptionBuilder().setLabel(`Algérie`).setValue("830547586699231273").setEmoji(parseEmoji("🇩🇿")),
                new StringSelectMenuOptionBuilder().setLabel(`Canada`).setValue("830547587459055646").setEmoji(parseEmoji("🇨🇦")),
                new StringSelectMenuOptionBuilder().setLabel(`Espagne`).setValue("830547588075356191").setEmoji(parseEmoji("🇪🇸")),
                new StringSelectMenuOptionBuilder().setLabel(`France`).setValue("830547589237440532").setEmoji(parseEmoji("🇫🇷")),
                new StringSelectMenuOptionBuilder().setLabel(`Australie`).setValue("830547590026231859").setEmoji(parseEmoji("🇦🇺")),
                new StringSelectMenuOptionBuilder().setLabel(`Maroc`).setValue("830547590771900438").setEmoji(parseEmoji("🇲🇦")),
                new StringSelectMenuOptionBuilder().setLabel(`USA`).setValue("830547591862550558").setEmoji(parseEmoji("🇺🇸")),
                new StringSelectMenuOptionBuilder().setLabel(`Portugal`).setValue("830547592651079780").setEmoji(parseEmoji("🇵🇹")),
                new StringSelectMenuOptionBuilder().setLabel(`Suisse`).setValue("830547593683533834").setEmoji(parseEmoji("🇨🇭")),
                new StringSelectMenuOptionBuilder().setLabel(`Italie`).setValue("830547594446635038").setEmoji(parseEmoji("🇮🇹")),
                new StringSelectMenuOptionBuilder().setLabel(`Turquie`).setValue("830547595230707732").setEmoji(parseEmoji("🇹🇷")),
                new StringSelectMenuOptionBuilder().setLabel(`Belgique`).setValue("830547595944263750").setEmoji(parseEmoji("🇧🇪")),
            ])
            .setPlaceholder("Choose your country")
            .setMinValues(0)

        return new ActionRowBuilder().addComponents(countryRoleSelectMenu);
    }

    static getMusicRoleSelectMenu() {
        const musicRoleSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("musicRoleMenuChooser")
            .setOptions([
                new StringSelectMenuOptionBuilder().setLabel(`Beatboxer`).setValue("830547596338266173").setEmoji(parseEmoji("🎧")),
                new StringSelectMenuOptionBuilder().setLabel(`Beatmaker`).setValue("830547597683982406").setEmoji(parseEmoji("🎼")),
                new StringSelectMenuOptionBuilder().setLabel(`Musician`).setValue("830547598523105280").setEmoji(parseEmoji("🎹")),
                new StringSelectMenuOptionBuilder().setLabel(`Kicker`).setValue("830547599370223626").setEmoji(parseEmoji("🎤")),
            ])
            .setPlaceholder("Choose your music role")
            .setMinValues(0)

        return new ActionRowBuilder().addComponents(musicRoleSelectMenu);
    }

    static getAgeRoleSelectMenu() {
        const ageRoleSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("ageRoleMenuChooser")
            .setOptions([
                new StringSelectMenuOptionBuilder().setLabel(`-15`).setValue("830547599785328661").setEmoji(parseEmoji("👶")),
                new StringSelectMenuOptionBuilder().setLabel(`15-24`).setValue("830547601874878464").setEmoji(parseEmoji("👦")),
                new StringSelectMenuOptionBuilder().setLabel(`+25`).setValue("830547602659475536").setEmoji(parseEmoji("👴")),
            ])
            .setPlaceholder("Choose your age")
            .setMinValues(0)
            .setMaxValues(1)

        return new ActionRowBuilder().addComponents(ageRoleSelectMenu);
    }

    static getNotificationRoleSelectMenu(roles) {
        const notificationRoleSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("notificationRoleMenuChooser")
            .setOptions([
                new StringSelectMenuOptionBuilder().setLabel(`Twitch Notification`).setValue(roles.twitchRoleId).setEmoji(parseEmoji("🔴")),
                new StringSelectMenuOptionBuilder().setLabel(`Youtube Notification`).setValue(roles.youtubeRoleId).setEmoji(parseEmoji("📺")),
                new StringSelectMenuOptionBuilder().setLabel(`News Notification`).setValue(roles.newsRoleId).setEmoji(parseEmoji("📰")),
            ])
            .setPlaceholder("Choose your notification")
            .setMaxValues(3)
            .setMinValues(0)

        return new ActionRowBuilder().addComponents(notificationRoleSelectMenu);
    }
}

module.exports = MiscSelectMenus;