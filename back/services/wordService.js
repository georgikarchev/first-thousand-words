const User = require("../models/User");
const Word = require("../models/Word");
const { removeEmptyAttributes } = require("../utils/jsUtils");

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
  const word = await Word.findById(id).lean();

  if (!word) {
    throw new Error("Word does not exist.");
  }

  return word;
};

exports.create = async (data) => {
  const { word, type, isPlural, published, description, notes } = data;

  const existingCreator = await User.findById(req.user._id);

  if (!existingCreator) {
    throw new Error("Creator does not exist");
  }

  const newWord = removeEmptyAttributes(data);
  newWord.created = new Date();

  return await Word.create(newWord);
};

exports.delete = async (id) => {
  // 1. check if word exists
  const word = await Word.findById(id);

  if (!word) {
    throw new Error("Word does not exist.");
  }

  // 2. check if word is used in Expressions, Dialogs and Texts
  // TODO: check if word is used in Expressions, Dialogs and Texts - if Yes - Output Error "Cant't delete."
  if (true) {
    throw new Error("Word can't be deleted because it is being used.");
  }

  word.remove().exec();

  return word;
};

exports.updateWord = async (id, value) => {
  const word = await Word.findById(id);

  if (!word) {
    throw new Error("Word does not exist");
  }

  if (word.word !== value) {
    word.word = value;
    word.modified = new Date();
    await word.save();
  }

  return word.lean();
};

exports.updateType = async (id, type) => {
  const word = await Word.findById(id);

  if (!word) {
    throw new Error("Word does not exist");
  }

  if (word.type !== type) {
    word.type = type;
    word.modified = new Date();
    await word.save();
  }

  return word.lean();
};

exports.updateIsPlural = async (id, isPlural) => {
  if(typeof isPlural == "boolean") {
    throw new Error ("New value must be boolean");
  }

  const word = await Word.findById(id);

  if (!word) {
    throw new Error("Word does not exist");
  }

  if (word.isPlural !== isPlural) {
    word.isPlural = isPlural;
    word.modified = new Date();
    await word.save();
  }

  return word.lean();
};

exports.updatePublished = async (id, published) => {
  const word = await Word.findById(id);

  if (!word) {
    throw new Error("Word does not exist");
  }

  if (word.published !== published) {
    word.published = published;
    word.modified = new Date();
    await word.save();
  }

  return word.lean();
};

exports.updateDescription = async (id, value) => {
  const word = await Word.findById(id);

  if (!word) {
    throw new Error("Word does not exist");
  }

  if (word.description !== value) {
    word.description = value;
    word.modified = new Date();
    await word.save();
  }

  return word.lean();
};

exports.updateNotes = async (id, value) => {
  const word = await Word.findById(id);

  if (!word) {
    throw new Error("Word does not exist");
  }

  if (word.notes !== value) {
    word.notes = value;
    word.modified = new Date();
    await word.save();
  }

  return word.lean();
};