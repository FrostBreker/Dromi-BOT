const mongoose = require('mongoose');
const fs = require('fs');
const { Guild, User, Streamer } = require('../schemas');
const moment = require("moment");

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

    //XP FUNCTIONS

    //calculate remaining xp to next levelm
    client.calculateRemainingXpToNextLevel = (xp) => {
        if (xp < 200) return 200 - xp;
        const rank = client.calculateXpLevel(xp);
        const nextRank = rank + 1;
        const nextRankXp = client.calculatePointsByRank(nextRank);
        return nextRankXp - xp;
    }

    //Calculate points by rank
    client.calculatePointsByRank = (rank) => {
        if (rank === 0) return 200;
        return 200 + (rank - 1) * 100;
    };

    //Calculate XP level
    client.calculateXpLevel = (xp) => {
        if (xp < 200) return 0;
        //Always round down
        return Math.floor((xp - 200) / 100 + 1);
    };

    //Add xp to a user
    client.addXpToUser = async (user, amount, type) => {
        try {
            if (client.isEmpty(user)) return null;
            if (amount <= 0) return 401;
            let hasPassed = false;
            if (type === "chat") {
                const oldRank = client.calculateXpLevel(user.chatTotalXp);
                user.messageActivity.chatTotalXp += amount;
                const newRank = client.calculateXpLevel(user.chatTotalXp);
                if (newRank > oldRank) {
                    hasPassed = true;
                    user.messageActivity.chatLevel = newRank;
                }
            } else {
                const oldRank = client.calculateXpLevel(user.voiceTotalXp);
                user.voiceActivity.voiceTotalXp += amount;
                const newRank = client.calculateXpLevel(user.voiceTotalXp);
                if (newRank > oldRank) {
                    hasPassed = true;
                    user.voiceActivity.voiceLevel = newRank;
                }
            }
            return await user.save().then(u => {
                console.log(`${client.timestampParser()} --> User xp updated -> <@${u.userId}>`)
                return {
                    newUserDB: u,
                    hasPassed: hasPassed
                }
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    };

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

    //STATS FUNCTIONS
    //Create a stats
    client.createStats = async (guildDB) => {
        try {
            if (!guildDB) return null;
            guildDB.chatStats.push({
                timestamp: Date.now(),
                messagesPerUsers: []
            });
            guildDB.voicesStats.push({
                timestamp: Date.now(),
                usersPerChannel: []
            });
            return await guildDB.save().then(g => {
                console.log(`${client.timestampParser()} --> New stats created -> ${g.guildId} (${g._id})`)
                return g
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    //Get last stats
    client.getLastStats = async (guildDB, type) => {
        try {
            if (!guildDB) return null;
            if (type === "chat") {
                const lastStats = guildDB.chatStats[guildDB.chatStats.length - 1];
                return lastStats;
            } else if (type === "voices") {
                const lastStats = guildDB.voicesStats[guildDB.voicesStats.length - 1];
                return lastStats;
            } else return null;
        } catch (err) {
            return null;
        }
    }

    //Update stats by userId and type
    client.updateStats = async (guildDB, userId, type, options) => {
        try {
            if (!guildDB) return null;
            if (!userId) return null;
            if (!type) return null;
            if (!options) return null;

            if (type === "chat") {
                const lastStats = guildDB.chatStats[guildDB.chatStats.length - 1];
                const user = lastStats.messagesPerUsers.find(u => u.userId === userId);
                if (!user) {
                    lastStats.messagesPerUsers.push({
                        userId: userId,
                        channels: [{
                            channelId: options.channelId,
                            messages: 1
                        }]
                    });
                } else {
                    const channel = user.channels.find(c => c.channelId === options.channelId);
                    if (!channel) {
                        user.channels.push({
                            channelId: options.channelId,
                            messages: 1
                        });
                    } else {
                        channel.messages += 1;
                    }
                }
            } else if (type === "voices") {
                const lastStats = guildDB.voicesStats[guildDB.voicesStats.length - 1];
                const user = lastStats.usersPerChannel.find(u => u.userId === userId);
                if (!user) {
                    lastStats.usersPerChannel.push({
                        userId: userId,
                        channels: [{
                            channelId: options.channelId,
                            time: options.time
                        }]
                    });
                } else {
                    const channel = user.channels.find(c => c.channelId === options.channelId);
                    if (!channel) {
                        user.channels.push({
                            channelId: options.channelId,
                            time: options.time
                        });
                    } else {
                        if (options.time) channel.time += options.time;
                    }
                }
            } else return null;
            return await guildDB.save().then(g => {
                console.log(`${client.timestampParser()} --> Stats updated -> ${g.guildName} (${g._id})`)
                return g
            });
        } catch (err) {
            return null;
        }
    };

    //User get stats (chat: most used channel with messages, voices: most used channel with time and all messages sent, and all time in vc) Send everythign in object, calculate the stats and return it in an object, no type
    client.getUserStats = async (guildDB, userId) => {
        try {
            if (!guildDB) return null;
            if (!userId) return null;
            //Calculate :
            //Chat:
            //      - Most used CHannel
            //      - Number of messages sent in this channel
            //      - Number of messages sent in all channels all time
            //Voices:
            //      - Most used Channel
            //      - Time spent in this channel
            //      - Time spent in all channels all time

            const chatStats = guildDB.chatStats;
            const voicesStats = guildDB.voicesStats;

            const userChatStats = chatStats.map(s => {
                const user = s.messagesPerUsers.find(u => u.userId === userId);
                if (!user) return null;
                const channels = user.channels;
                const totalMessages = channels.reduce((a, b) => a + b.messages, 0);
                return {
                    timestamp: s.timestamp,
                    totalMessages: totalMessages,
                    channels: channels
                }
            }).filter(s => s !== null);

            const userVoicesStats = voicesStats.map(s => {
                const user = s.usersPerChannel.find(u => u.userId === userId);
                if (!user) return null;
                const channels = user.channels;
                const totalTime = channels.reduce((a, b) => a + b.time, 0);
                return {
                    timestamp: s.timestamp,
                    totalTime: totalTime,
                    channels: channels
                }
            }).filter(s => s !== null);

            const chatStatsResult = {
                mostUsedChannel: null,
                totalMessages: 0,
                channels: []
            };

            const voicesStatsResult = {
                mostUsedChannel: null,
                totalTime: 0,
                channels: []
            };

            if (userChatStats.length > 0) {
                const channels = userChatStats.map(s => s.channels).flat();
                const mostUsedChannel = channels.sort((a, b) => b.messages - a.messages)[0];
                chatStatsResult.mostUsedChannel = mostUsedChannel;
                chatStatsResult.totalMessages = userChatStats.reduce((a, b) => a + b.totalMessages, 0);
                chatStatsResult.channels = channels;
            }

            if (userVoicesStats.length > 0) {
                const channels = userVoicesStats.map(s => s.channels).flat();
                const mostUsedChannel = channels.sort((a, b) => b.time - a.time)[0];
                voicesStatsResult.mostUsedChannel = mostUsedChannel;
                voicesStatsResult.totalTime = userVoicesStats.reduce((a, b) => a + b.totalTime, 0);
                voicesStatsResult.channels = channels;
            }

            return {
                chat: chatStatsResult,
                voices: voicesStatsResult
            };
        } catch (err) {
            return null;
        }
    };

    //Get top 10 users with most messages sent Lifetime
    client.getTop10UsersWithMostMessagesLifetime = async (guildDB) => {
        try {
            if (!guildDB) return null;
            const chatStats = guildDB.chatStats;
            const users = chatStats.map(s => s.messagesPerUsers).flat();
            const usersWithTotalMessages = users.map(u => {
                const channels = u.channels;
                const totalMessages = channels.reduce((a, b) => a + b.messages, 0);
                return {
                    userId: u.userId,
                    totalMessages: totalMessages
                }
            });

            const filtered = usersWithTotalMessages.reduce((acc, current) => {
                const x = acc.find(item => item.userId === current.userId);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    acc.map(a => {
                        if (a.userId === current.userId) {
                            a.totalMessages += current.totalMessages;
                        }
                    });
                    return acc;
                }
            }, []);

            const usersWithTotalMessagesSorted = filtered.sort((a, b) => b.totalMessages - a.totalMessages);
            const top10 = usersWithTotalMessagesSorted.slice(0, 10);
            return top10;
        } catch (err) {
            return null;
        }
    };

    //Get top 10 users with most messages sent on this week
    client.getTop10UsersWithMostMessagesThisWeek = async (guildDB) => {
        try {
            if (!guildDB) return null;
            const chatStats = guildDB.chatStats;
            const startOfWeek = moment().startOf('week'); // Start of the current week (Monday)
            const endOfWeek = moment().endOf('day'); // End of the current day

            const filteredChatStats = chatStats.filter(stat => moment(parseInt(stat.timestamp)).isBetween(startOfWeek, endOfWeek));

            const users = filteredChatStats.map(s => s.messagesPerUsers).flat();
            const usersWithTotalMessages = users.map(u => {
                const channels = u.channels;
                const totalMessages = channels.reduce((a, b) => a + b.messages, 0);
                return {
                    userId: u.userId,
                    totalMessages: totalMessages
                };
            });
            const filtered = usersWithTotalMessages.reduce((acc, current) => {
                const x = acc.find(item => item.userId === current.userId);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    acc.map(a => {
                        if (a.userId === current.userId) {
                            a.totalMessages += current.totalMessages;
                        }
                    });
                    return acc;
                }
            }, []);

            const usersWithTotalMessagesSorted = filtered.sort((a, b) => b.totalMessages - a.totalMessages);
            const top10 = usersWithTotalMessagesSorted.slice(0, 10);
            return top10;
        } catch (err) {
            return null;
        }
    };

    //Get top 10 users with most time spent in voice channels Lifetime
    client.getTop10UsersWithMostTimeSpentInVoiceChannelsLifetime = async (guildDB) => {
        try {
            if (!guildDB) return null;
            const voicesStats = guildDB.voicesStats;
            const users = voicesStats.map(s => s.usersPerChannel).flat();
            const usersWithTotalTime = users.map(u => {
                const channels = u.channels;
                const totalTime = channels.reduce((a, b) => a + b.time, 0);
                return {
                    userId: u.userId,
                    totalTime: totalTime
                }
            });

            const filtered = usersWithTotalTime.reduce((acc, current) => {
                const x = acc.find(item => item.userId === current.userId);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    acc.map(a => {
                        if (a.userId === current.userId) {
                            a.totalTime += current.totalTime;
                        }
                    });
                    return acc;
                }
            }, []);

            const usersWithTotalTimeSorted = filtered.sort((a, b) => b.totalTime - a.totalTime);
            const top10 = usersWithTotalTimeSorted.slice(0, 10);
            return top10;
        } catch (err) {
            return null;
        }
    };

    //Get top 10 users with most time spent in voice channels on this week
    client.getTop10UsersWithMostTimeSpentInVoiceChannelsThisWeek = async (guildDB) => {
        try {
            if (!guildDB) return null;
            const voicesStats = guildDB.voicesStats;
            const startOfWeek = moment().startOf('week'); // Start of the current week (Monday)
            const endOfWeek = moment().endOf('day'); // End of the current day

            const filteredVoicesStats = voicesStats.filter(stat => moment(parseInt(stat.timestamp)).isBetween(startOfWeek, endOfWeek));

            const users = filteredVoicesStats.map(s => s.usersPerChannel).flat();
            const usersWithTotalTime = users.map(u => {
                const channels = u.channels;
                const totalTime = channels.reduce((a, b) => a + b.time, 0);
                return {
                    userId: u.userId,
                    totalTime: totalTime
                }
            });

            const filtered = usersWithTotalTime.reduce((acc, current) => {
                const x = acc.find(item => item.userId === current.userId);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    acc.map(a => {
                        if (a.userId === current.userId) {
                            a.totalTime += current.totalTime;
                        }
                    });
                    return acc;
                }
            }, []);

            const usersWithTotalTimeSorted = filtered.sort((a, b) => b.totalTime - a.totalTime);
            const top10 = usersWithTotalTimeSorted.slice(0, 10);
            return top10;
        } catch (err) {
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

    //Convert ms to time if only second return only second if only minute return only minute etc...
    client.convertMsToTime = (ms) => {
        if (ms === 0) return "0 second(s)"
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const secondsLeft = seconds % 60;
        const minutesLeft = minutes % 60;
        const hoursLeft = hours % 24;

        const daysStr = days ? `${days} day${days > 1 ? "s" : ""}` : "";
        const hoursStr = hoursLeft ? `${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}` : "";
        const minutesStr = minutesLeft ? `${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}` : "";
        const secondsStr = secondsLeft ? `${secondsLeft} second${secondsLeft > 1 ? "s" : ""}` : "";

        return `${daysStr} ${hoursStr} ${minutesStr} ${secondsStr}`;
    };
};
