const Word = require("../models/Word");
const Expression = require("../models/Expression");
const { removeEmptyAttributes, isEmpty } = require("../utils/jsUtils");
const { isValidMongoId } = require("../utils/validators");

const expressionService = require("./expressionService");

exports.getMany = async (query) => {
  let qry = {};
  let result = { data: {}, count: 0 };

  result.count = await Word.find({}).countDocuments();

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

  result.data = await Word.find(qry.find)
    .sort(qry.sort)
    .skip(qry.skip)
    .limit(qry.limit)
    .lean();
  return result;
};

exports.getById = async (id) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid word id");
  }

  const word = await Word.findById(id).lean();

  if (!word) {
    throw new Error("Word does not exist");
  }

  return word;
};

exports.create = async (data) => {
  const { word, type, isPlural, published, description, notes } = data;

  const newWord = removeEmptyAttributes(data);
  newWord.created = new Date();

  return await Word.create(newWord);
};

exports.update = async (id, data) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid word id");
  }

  const word = await Word.findById(id);

  if (!word) {
    throw new Error("Word does not exist");
  }

  const newData = removeEmptyAttributes(data);

  if (newData.word) {
    word.word = newData.word;
  }

  if (newData.language) {
    word.language = newData.language;
  }

  if (newData.type) {
    word.type = newData.type;
  }

  if (newData.isPlural) {
    word.isPlural = newData.isPlural;
  }

  if (newData.published) {
    word.published = newData.published;
  }

  if (newData.description) {
    word.description = newData.description;
  }

  if (newData.notes) {
    word.notes = newData.notes;
  }

  if (!isEmpty(newData)) {
    word.modified = new Date();
    return await word.save();
  }

  throw new Error("Bad input");
};

exports.deleteOne = async (id) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid word id");
  }

  // 1. check if word exists
  const word = await Word.findById(id);

  if (!word) {
    throw new Error("Word does not exist");
  }

  // 2. check if word is used in Expressions, Dialogs and Texts
  const expressionsWithThatWord = await Expression.find({ words: id }).lean();
  if (expressionsWithThatWord.length !== 0) {
    throw new Error("Being used");
  }

  return await Word.findByIdAndDelete(id);
};
