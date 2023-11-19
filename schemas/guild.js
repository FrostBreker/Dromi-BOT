const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
  guildId: String,
  guildName: String,
  ownerId: String,
  settings: {
    type: {
      roles: {
        type: {
          administatorRoleId: String,
          dromiRoleId: String,
          twitchRoleId: String,
          youtubeRoleId: String,
          newsRoleId: String,
          memberRoleId: String,
        }
      },
      channels: {
        type: {
          activityChannelId: {
            type: String,
            default: null,
          },
          rulesChannelId: {
            type: String,
            default: null,
          },
          chooseRoleChannelId: {
            type: String,
            default: null,
          },
          justJoinedChannelId: {
            type: String,
            default: null,
          },
          joinedChannelId: {
            type: String,
            default: null,
          },
          newsChannelId: {
            type: String,
            default: null,
          },
          boostChannelId: {
            type: String,
            default: null,
          },
        }
      },
      twitch: {
        type: {
          notification: {
            type: {
              enabled: {
                type: Boolean,
                default: false,
              },
              channelId: {
                type: String,
                default: null,
              },
              interval: {
                type: Number,
                default: 5,
              },
            },
          },
        },
      }
    },
  },
  chatStats: {
    type: [{
      timestamp: String,
      messagesPerUsers: {
        type: [{
          userId: String,
          channels: {
            type: [{
              channelId: String,
              messages: Number
            }]
          },
        }]
      }
    }]
  },
  voicesStats: {
    type: [{
      timestamp: String,
      usersPerChannel: {
        type: [{
          userId: String,
          channels: {
            type: [{
              channelId: String,
              time: Number
            }]
          },
        }]
      }
    }]
  },
  leaderboards: {
    type: {
      channelId: {
        type: String,
        default: null,
      },
      messageId: {
        type: String,
        default: null,
      },
    }
  }
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guilds", guildSchema);