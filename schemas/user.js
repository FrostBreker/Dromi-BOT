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
      voiceTotalXp: {
        type: Number,
        default: 0,
      },
      voiceLevel: {
        type: Number,
        default: 0,
      },
    },
    default: {
      voiceTotalXp: 0,
      voiceLevel: 0,
    },
  },
  messageActivity: {
    type: {
      chatTotalXp: {
        type: Number,
        default: 0,
      },
      chatLevel: {
        type: Number,
        default: 0,
      },
    },
    default: {
      chatTotalXp: 0,
      chatLevel: 0,
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