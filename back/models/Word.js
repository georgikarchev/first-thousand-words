const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: [true, "Word is required"],
  },
  language: {
    type: String,
    default: "english",
  },
  type: {
    type: String,
    default: "noun",
    enum: ["noun", "verb", "adjective", "adverb", "punctuation"],
  },
  isPlural: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    maxLength: [160, "Description can be no longer that 160 characters"],
  },
  notes: {
    type: String,
    maxLength: [160, "Notes can be no longer that 160 characters"],
  },
  // creator: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "User",
  // },
  created: {
    type: Date,
    required: true,
  },
  modified: {
    type: Date,
  },
});

const Word = mongoose.model("Word", wordSchema);

module.exports = Word;
