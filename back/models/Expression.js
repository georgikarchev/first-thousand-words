const mongoose = require("mongoose");

const expressionSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "declarative",
    enum: ["declarative", "exclamatory", "interrogative", "imperative"],
  },
  language: {
    type: String,
    default: "english",
  },
  words: {
    type: [mongoose.Types.ObjectId],
    ref: "Word",
    required: true,
  },
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

expressionSchema.virtual("expression").get(async function () {
  return await this.populate("words")
    .lean()
    .map((w, i) => {
      return i > 0 && w.type !== punctuation ? ` ${w}` : w;
    })
    .join("");
});

const Expression = mongoose.model("Expression", expressionSchema);

module.exports = Expression;
