const mongoose = require("mongoose");

exports.isValidMongoId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return false;
  }
  return true;
}
