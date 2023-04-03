const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,
  },
  language: {
    type: String,
    default: "english",
  },
  description: {
    type: String,
    maxLength: [160, "Description can be no longer that 160 characters"],
  },
  notes: {
    type: String,
    maxLength: [160, "Notes can be no longer that 160 characters"],
  },
  created: {
    type: Date,
    required: true,
  },
  modified: {
    type: Date,
  },
});

const Character = mongoose.model("Character", characterSchema);

module.exports = Character;