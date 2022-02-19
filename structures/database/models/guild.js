const mongoose = require("mongoose");

let guildsSchema = mongoose.Schema({
  id: { type: String, required: true },
  prefix: { type: String, default: null },
});
module.exports = mongoose.model("guilds", guildsSchema);