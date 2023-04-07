const mongoose = require("mongoose");

const dialogSchema = new mongoose.Schema({
  language: {
    type: String,
    default: "english",
  },
  expressions: [
    {
      expression: {
        type: mongoose.Types.ObjectId,
        ref: "Expression",
      },
      correspondent: {
        type: mongoose.Types.ObjectId,
        ref: "Correspondent",
      },
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
  created: {
    type: Date,
    required: true,
  },
  modified: {
    type: Date,
  },
});

const Dialogue = mongoose.model("Dialogue", dialogSchema);

module.exports = Dialogue;
