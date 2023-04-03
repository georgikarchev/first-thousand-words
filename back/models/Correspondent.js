const mongoose = require("mongoose");

const correspondentSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,
  },
  species: {
    type: String,
    default: "human"
  },
  sex: {
    type: String,
    enum: ["male","female"],
    default: "female",
  },
  language: {
    type: [String],
    default: ["english"],
  },
  published: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    maxLength: [160, "Description can be no longer that 160 correspondents"],
  },
  notes: {
    type: String,
    maxLength: [160, "Notes can be no longer that 160 correspondents"],
  },
  created: {
    type: Date,
    required: true,
  },
  modified: {
    type: Date,
  },
});

const Correspondent = mongoose.model("Correspondent", correspondentSchema);

module.exports = Correspondent;