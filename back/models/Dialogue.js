const mongoose = require("mongoose");

const dialogSchema = new mongoose.Schema({
  participants: [
    {
      type: String,
      required: [true, "Participants is required"],
    }
  ],
  expressions: [
    {
      expression: {
        type: mongoose.Types.ObjectId,
        ref: "Expression",
      },
      participant: {
        type: String,
        validate: [
          function (value) {
            return this.participants && this.participants.indexOf(value) !== -1;
          },
          "Participant does not exist."
        ],
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

const Dialog = mongoose.model("Dialog", dialogSchema);

module.exports = Dialog;
