const { addStreamer } = require("./AddStreamer");
const { removeStreamer } = require("./RemoveStreamer");
const { updateStreamer } = require("./UpdateStreamer");

module.exports = {
    AddTwitchStreamer: addStreamer,
    RemoveTwitchStreamer: removeStreamer,
    UpdateTwitchStreamer: updateStreamer,
}