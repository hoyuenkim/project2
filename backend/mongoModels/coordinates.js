const mongoose = require("mongoose");

const coordinatesSchema = new mongoose.Schema({
  division: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  ShopId: {
    type: Number,
    required: true,
  },
  location: {
    type: { type: String },
    coordinates: [Number],
  },
});

coordinatesSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("coordinates", coordinatesSchema);
