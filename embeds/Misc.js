const { EmbedBuilder } = require("discord.js");
const { embedOptions } = require("../config");

class MiscEmbed {
    static successCommand(title, description) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + title)
            .setDescription(description)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }

    static errorCommand(title, description) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.error} ` + title)
            .setDescription(description)
            .setColor(embedOptions.colors.error)
            .setTimestamp();
    }

    static async rulesEmbed(guild) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.rules} Règlement`)
            .setDescription(`**Bonjour!** Bienvenue sur **${guild.name}**\n\n- ➣ Aucune **pub** en message privé.\n- ➣ Aucun **DOX/AFFICHE** sous peine d'un ban permanent\n- ➣ Aucun **SPAM** de message cancer dans les channels publique.\n- ➣ Les insultes sont toléré mais les insulte **raciales** ou **sexistes** ne le sont pas\n- ➣ Les **liens** sont interdits sauf dans les chanels approprié\n- ➣ Ne pas **spam les modo** une fois suffit\n- ➣ Si vous avez un quelconque problème n'hésitez pas a faire un ⁠ticket\n- ➣ **Amusez vous bien**`)
            .setColor(embedOptions.colors.info)
            .setThumbnail(await guild.iconURL({ dynamic: true }))
            .setImage("https://cdn-longterm.mee6.xyz/plugins/embeds/images/830547170980921346/f69fb42dbe18a94a014ac690d1c4998fb22cf77aa3417c6d1da1e3a5a634a9f5.png")
            .setTimestamp();
    }

    static async newsMakerEmbed(guild, title, description, image, thumbnail) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.notification} | ${title}`)
            .setDescription(description)
            .setImage(image ? image : null)
            .setThumbnail(thumbnail ? thumbnail : null)
            .setColor(embedOptions.colors.info)
            .setFooter({
                text: `${guild.name}`,
                icon: await guild.iconURL({ dynamic: true })
            })
            .setTimestamp();
    }
}

module.exports = MiscEmbed;