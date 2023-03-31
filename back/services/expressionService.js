const Expression = require("../models/Expression");
const Text = require("../models/Text");
const { removeEmptyAttributes } = require("../utils/jsUtils");
const { isValidMongoId } = require("../utils/validators");
const Dialog = require("../models/Dialogue");

exports.getMany = async (query) => {
  let qry = {};
  let result = { data: {}, count: 0 };

  result.count = await Expression.find({}).countDocuments();

  qry.limit = query.limit ? query.limit : 20;
  result.limit = qry.limit;

  qry.skip = query.skip
    ? query.skip < result.count
      ? query.skip
      : result.count
    : 0;
  result.skip = qry.skip;

  qry.find = {};

  if (query.creator) {
    qry.find.creator = query.creator;
  }

  qry.active = query.active === false ? false : true;

  qry.orderBy = query.orderBy === "desc" ? "desc" : "asc";

  qry.sort = {};

  if (query.sortBy) {
    qry.sort[query.sortBy] = qry.orderBy;
  } else {
    qry.sort = { name: qry.orderBy };
  }

  result.data = await Expression.find(qry.find)
    .sort(qry.sort)
    .skip(qry.skip)
    .limit(qry.limit)
    .lean();
  return result;
};

exports.getById = async (id) => {
  const expression = await Expression.findById(id).lean();

  if (!expression) {
    throw new Error("Expression does not exist.");
  }

  return expression;
};

exports.create = async (data, type) => {
  const { words } = data;

  const existingExpression = await Expression.find({ words: words });

  if (existingExpression) {
    // Expression already exists - return existing expression
    return existingExpression;
  }

  const newExpression = { words: words };
  if (type != null) {
    newExpression.type = type;
  }
  newExpression.created = new Date();

  return await Expression.create(newExpression);
};

exports.delete = async (id) => {
  // 1. check if expression exists
  const expression = await Expression.findById(id);

  if (!expression) {
    throw new Error("Expression does not exist.");
  }

  // 2. check if expression is used in Dialogs and Texts
  // TODO: check if expression is used in Dialogs and Texts - if Yes - Output Error "Cant't delete."
  let isInUse = Text.find({"expressions": { expression: id }});
  isInUse ??= Dialog.find({"expressions": { expression: id }});

  if (isInUse) {
    throw new Error("Expression can't be deleted because it is being used.");
  }

  word.remove().exec();

  return word;
};

exports.findExpressionsWithWord = async (wordId) => {
  if(!isValidMongoId(wordId)) {
    throw new Error("Invalid word id");
  }

  const expressions = await Expression.find({words: wordId});
  console.log(expressions);
  
  return expressions;
};

// exports.updateExpression = async (id, value) => {
//   const word = await Expression.findById(id);

//   if (!word) {
//     throw new Error("Expression does not exist");
//   }

//   if (word.word !== value) {
//     word.word = value;
//     word.modified = new Date();
//     await word.save();
//   }

//   return word.lean();
// };

// exports.updateType = async (id, type) => {
//   const word = await Expression.findById(id);

//   if (!word) {
//     throw new Error("Expression does not exist");
//   }

//   if (word.type !== type) {
//     word.type = type;
//     word.modified = new Date();
//     await word.save();
//   }

//   return word.lean();
// };

// exports.updateIsPlural = async (id, isPlural) => {
//   if (typeof isPlural == "boolean") {
//     throw new Error("New value must be boolean");
//   }

//   const word = await Expression.findById(id);

//   if (!word) {
//     throw new Error("Expression does not exist");
//   }

//   if (word.isPlural !== isPlural) {
//     word.isPlural = isPlural;
//     word.modified = new Date();
//     await word.save();
//   }

//   return word.lean();
// };

// exports.updatePublished = async (id, published) => {
//   const word = await Expression.findById(id);

//   if (!word) {
//     throw new Error("Expression does not exist");
//   }

//   if (word.published !== published) {
//     word.published = published;
//     word.modified = new Date();
//     await word.save();
//   }

//   return word.lean();
// };

// exports.updateDescription = async (id, value) => {
//   const word = await Expression.findById(id);

//   if (!word) {
//     throw new Error("Expression does not exist");
//   }

//   if (word.description !== value) {
//     word.description = value;
//     word.modified = new Date();
//     await word.save();
//   }

//   return word.lean();
// };

// exports.updateNotes = async (id, value) => {
//   const word = await Expression.findById(id);

//   if (!word) {
//     throw new Error("Expression does not exist");
//   }

//   if (word.notes !== value) {
//     word.notes = value;
//     word.modified = new Date();
//     await word.save();
//   }

//   return word.lean();
// };
