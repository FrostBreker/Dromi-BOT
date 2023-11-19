const mongoose = require("mongoose");

const streamerSchema = mongoose.Schema({
  userId: String,
  guildId: String,
  username: String,
  twitchId: String,
  twitchUsername: String,
  notification: {
    type: Boolean,
    default: false,
  },
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Streamers", streamerSchema);