const mongoose = require("mongoose");

const textSchema = new mongoose.Schema({
  language: {
    type: String,
    default: "english",
  },
  title: {
    type: String,
  },
  expressions: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Expression",
    },
  ],
  published: {
    type: Boolean,
    default: false,
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

const Text = mongoose.model("Text", textSchema);

module.exports = Text;
