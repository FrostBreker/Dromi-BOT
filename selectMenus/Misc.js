const { RoleSelectMenuBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, parseEmoji } = require("discord.js");

class MiscSelectMenus {
    // static getRolesSelectMenu() {
    //     const rolesSelectMenu = new StringSelectMenuBuilder()
    //         .setCustomId("rolesMenuChooser")
    //         .addDefaultRoles([
    //             "830547488717013002",
    //             "830547576314396733",
    //             "830547487285706782",
    //             "830547586699231273",
    //             "830547587459055646",
    //             "830547588075356191",
    //             "830547589237440532",
    //             "830547590026231859",
    //             "830547590771900438",
    //             "830547591862550558",
    //             "830547592651079780",
    //             "830547593683533834",
    //             "830547594446635038",
    //             "830547595230707732",
    //             "830547595944263750",
    //             "830547596338266173",
    //             "830547597683982406",
    //             "830547598523105280",
    //             "830547599370223626",
    //             "830547599785328661",
    //             "830547601874878464",
    //             "830547602659475536",
    //             "830547603639763074",
    //             "830547604337197098",
    //             "830547605410676746"
    //         ])
    //         .setPlaceholder("Choose your role")
    //         .setMaxValues(25)
    //         .setMinValues(0)

    //     return new ActionRowBuilder().addComponents(rolesSelectMenu);
    // }

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