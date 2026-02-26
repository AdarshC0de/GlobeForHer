const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  lat: Number,
  lng: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Photo", photoSchema);