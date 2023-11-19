const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: String,
  guildId: String,
  username: String,
  joinedTimestamp: String,
  joinedCounter: {
    type: Number,
    default: 0,
  },
  voiceActivity: {
    type: {
      channels: [{
        channelId: String,
        time: Number,
      }],
      xp: Number,
    },
    default: {
      channels: [],
      xp: 0,
    },
  },
  messageActivity: {
    type: {
      channels: [{
        channelId: String,
        time: Number,
      }],
    },
    default: {
      channels: [],
    },
  },
  guildActivity: {
    type: {
      ban: {
        type: {
          counter: Number,
          lastTimestamp: Number,
        }
      },
      kick: {
        type: {
          counter: Number,
          lastTimestamp: Number,
        },
      },
      timeout: {
        type: {
          counter: Number,
          lastTimestamp: Number,
        },
      },
    },
    default: {
      ban: {
        counter: 0,
        lastTimestamp: 0,
      },
      kick: {
        counter: 0,
        lastTimestamp: 0,
      },
      timeout: {
        counter: 0,
        lastTimestamp: 0,
      },
    },
  },
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);