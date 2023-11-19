const mongoose = require('mongoose');
const fs = require('fs');
const { Guild, User, Streamer } = require('../schemas');

module.exports = async client => {
    //GUILDS FUNCTIONS
    //create a guild
    client.createGuild = async guild => {
        try {
            const merged = Object.assign(
                { _id: new mongoose.Types.ObjectId() },
                {
                    guildId: guild.id,
                    guildName: guild.name,
                    ownerId: guild.ownerID
                }
            );
            const createGuild = await new Guild(merged);
            return await createGuild.save().then(g => {
                console.log(
                    `${client.timestampParser()} --> New guild created --> ${g.guildName} (${g.guildId})`
                );
                return g;
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //get a guild
    client.getGuild = async guild => {
        try {
            const guildDB = await Guild.findOne({ guildId: guild.id });
            if (guildDB) return guildDB;
            else return await client.createGuild(guild);
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Get guild by id
    client.getGuildById = async guildId => {
        try {
            const guild = await Guild.findOne({ guildId: guildId });
            if (guild) return guild;
            else return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Update a guild
    client.updateGuild = async guildDB => {
        try {
            if (!guildDB) return null;
            return await guildDB.save().then(g => {
                console.log(
                    `${client.timestampParser()} --> Guild updated --> ${g.guildName} (${g.guildId})`
                );
                return g;
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //USER FUNCTIONS
    //Create user
    client.createUser = async (member) => {
        try {
            const guild = member.guild;
            const user = member.user;
            const merged = Object.assign(
                { _id: new mongoose.Types.ObjectId() },
                {
                    userId: user.id,
                    guildId: guild.id,
                    username: user.username,
                    joinedTimestamp: member.joinedTimestamp,
                }
            );
            const createUser = await new User(merged);
            return await createUser.save().then(u => {
                console.log(
                    `${client.timestampParser()} --> New user created --> ${u.username} (${u.userId})`
                );
                return u;
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Get user
    client.getUser = async (member) => {
        try {
            const guild = member.guild;
            const user = member.user;
            const userDB = await User.findOne({ userId: user.id, guildId: guild.id });
            if (userDB) return userDB;
            else return await client.createUser(member);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    //Get user by id
    client.getUserById = async (userId, guildId) => {
        try {
            const user = await User.findOne({ userId: userId, guildId: guildId });
            if (user) return user;
            else return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    //STREAMER FUNCTIONS
    //Create streamer
    client.createStreamer = async (guildId, { userId, username, twitchId, twitchUsername, notification }) => {
        try {
            const merged = Object.assign(
                { _id: new mongoose.Types.ObjectId() },
                {
                    userId: userId,
                    guildId: guildId,
                    username: username,
                    twitchId: twitchId,
                    twitchUsername: twitchUsername,
                    notification: notification
                }
            );
            const createStreamer = await new Streamer(merged);
            return await createStreamer.save().then(s => {
                console.log(`${client.timestampParser()} --> New streamer created --> ${s.username} (${s.userId})`);
                return s;
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Get streamer by twitch id
    client.getStreamerById = async (twitchId) => {
        try {
            const streamer = await Streamer.findOne({ twitchId: twitchId });
            if (streamer) return streamer;
            else return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Get streamer by twitch username
    client.getStreamerByUsername = async (twitchUsername) => {
        try {
            const streamer = await Streamer.findOne({ twitchUsername: twitchUsername });
            if (streamer) return streamer;
            else return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Get All streamer and format for auto complete
    client.formatStreamers = async (guildId) => {
        try {
            const streamers = await Streamer.find({ guildId: guildId });
            if (!streamers) return null;
            let choices = [];
            streamers.forEach(streamer => {
                choices.push({ name: streamer.twitchUsername, value: streamer.twitchId });
            });
            return choices;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Delete streamer
    client.deleteStreamer = async (guildId, twitchId) => {
        try {
            const streamer = await Streamer.findOneAndDelete({ guildId: guildId, twitchId: twitchId });
            console.log(`${client.timestampParser()} --> Streamer deleted --> ${streamer.username} (${streamer.userId})`);
            if (!streamer) return null;
            return streamer;
        } catch (err) {
            console.log(err);
            return null;
        }
    };


    //SETTINGS FUNCTIONS

    //Settings setter
    client.settingsSetter = async (documentId, type, value) => {
        try {
            return await Guild.findByIdAndUpdate(
                { _id: documentId },
                {
                    $set: {
                        [`settings.${type}`]: value
                    }
                }
            ).then(g => {
                console.log(
                    `${client.timestampParser()} --> Settings updated (${type}) --> ${g.guildName} (${g.guildId})`
                );
                return g;
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Settings Pusher
    client.settingsPusher = async (documentId, type, value) => {
        try {
            return await Guild.findByIdAndUpdate(
                { _id: documentId },
                {
                    $push: {
                        [`settings.${type}`]: value
                    }
                },
                { new: true }
            ).then(g => {
                console.log(
                    `${client.timestampParser()} --> Settings updated (${type}) --> ${g.guildName} (${g.guildId})`
                );
                return g;
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Settings Getter by type
    client.settingsGetter = async (guildId, type) => {
        try {
            const guild = await Guild.findOne({
                guildId: guildId
            });
            if (!guild) return null;
            const types = type.split(".")
            let data = guild.settings;
            for (let i = 0; i < types.length; i++) {
                data = data[types[i]];
            }
            console.log(`${client.timestampParser()} --> Settings getted (${type}) --> ${guild.guildName} (${guild.guildId})`);
            return data;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Settings puller by id
    client.settingsPuller = async (guildId, type, _id) => {
        try {
            const guild = await Guild.findOne({
                guildId: guildId
            });
            if (!guild) return null;
            const types = type.split(".")
            let data = guild.settings;
            for (let i = 0; i < types.length; i++) {
                data = data[types[i]];
            }
            obj = data.find(e => String(e._id).toString() === _id);
            data = data.pull(obj);
            return await client.settingsSetter(guild._id, type, data);
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //MISC FUNCTIONS
    //Get the timestamp
    /* The `client.timestampParser` function is a helper function that takes an optional `num` parameter.
      It creates a new `Date` object using the `num` parameter if it is provided, otherwise it uses the
      current timestamp (`Date.now()`). */
    client.timestampParser = num => {
        const date = new Date(num ? num : Date.now()).toLocaleDateString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return date.toString();
    };

    //Check if a value is empty
    /* The `client.isEmpty` function is a helper function that checks if a value is empty. It takes a value
      as a parameter and returns a boolean value indicating whether the value is empty or not. */
    client.isEmpty = value => {
        return (
            value === undefined ||
            value === null ||
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            (typeof value === 'string' && value.trim().length === 0)
        );
    };

    //Load json file and parse it
    /* The `client.loadJson` function is a helper function that loads a JSON file from the specified path
      and parses it into a JavaScript object. */
    client.loadJson = path => {
        try {
            const data = fs.readFileSync(path);
            return JSON.parse(data);
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Save json file
    client.saveJson = (path, data) => {
        try {
            const json = JSON.stringify(data);
            return fs.writeFileSync(path, json, { encoding: 'utf8', flag: 'w' });
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Generate random id
    client.generateId = () => {
        return Math.random().toString(36).substr(2, 5);
    };

    //Get day string
    client.getDayString = (day) => {
        let d;
        switch (day) {
            case 1:
                d = "monday";
                break;
            case 2:
                d = "tuesday";
                break;
            case 3:
                d = "wednesday";
                break;
            case 4:
                d = "thursday";
                break;
            case 5:
                d = "friday";
                break;
            case 6:
                d = "saturday";
                break;
            case 0:
                d = "sunday";
                break;
        }
        return d;
    };

    //Delete message
    client.deleteMessage = async (channel, messageId) => {
        try {
            const messages = await channel.messages.fetch();
            if (messages.has(messageId)) {
                await messages.get(messageId).delete();
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    };
};
