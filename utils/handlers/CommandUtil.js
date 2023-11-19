const { glob } = require("glob");
const { join } = require("path");
const { clientId } = require("../../config");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const TOKEN = process.env.TOKEN;

module.exports = async client => {
    let commands = [];
    (await glob(`${process.cwd()}/commands/*/*.js`)).map(commandFile => {
        const cmd = require(join(process.cwd(), commandFile));
        const dd = cmd.data;
        if (!dd.name || !dd.description) {
            return console.log(`------\n${client.timestampParser()} --> Commandes non-chargée: pas de nom/desciption\nFichier --> ${commandFile}`);
        }
        commands.push(cmd.data);
        client.commands.set(dd.name, cmd)
        console.log(`${client.timestampParser()} --> Commande chargée [🛢️] : ${dd.name}`, "\n_______________________________________")
    });

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    (async () => {
        try {
            console.log(`${client.timestampParser()} --> Started refreshing application (/) commands.`);

            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log(`${client.timestampParser()} --> Successfully reloaded application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
};