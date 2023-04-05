const Correspondent = require("../models/Correspondent");
const Dialogue = require("../models/Dialogue");
const { removeEmptyAttributes, isEmpty } = require("../utils/jsUtils");
const { isValidMongoId } = require("../utils/validators");

exports.getMany = async (query) => {
  let qry = {};
  let result = { data: {}, count: 0 };

  result.count = await Correspondent.find({}).countDocuments();

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

  result.data = await Correspondent.find(qry.find)
    .sort(qry.sort)
    .skip(qry.skip)
    .limit(qry.limit)
    .lean();
  return result;
};

exports.getById = async (id) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid correspondent id");
  }

  const correspondent = await Correspondent.findById(id).lean();

  if (!correspondent) {
    throw new Error("Correspondent does not exist.");
  }

  return correspondent;
};

exports.create = async (data, type) => {
  const newData = removeEmptyAttributes(data);
  newData.created = new Date();

  return await Correspondent.create(newData);
};

exports.update = async (id, data) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid dialogue id");
  }

  const dialogue = await Correspondent.findById(id);

  if (!dialogue) {
    throw new Error("Correspondent does not exist");
  }

  const newData = removeEmptyAttributes(data);

  if (newData.name) {
    dialogue.name = newData.name;
  }

  if (newData.species) {
    dialogue.species = newData.species;
  }

  if (newData.sex) {
    dialogue.sex = newData.sex;
  }
  
  if (newData.language) {
    dialogue.language = newData.language;
  }

  if (newData.published) {
    dialogue.published = newData.published;
  }

  if (newData.description) {
    dialogue.description = newData.description;
  }

  if (newData.notes) {
    dialogue.notes = newData.notes;
  }

  if (!isEmpty(newData)) {
    dialogue.modified = new Date();
    return await dialogue.save();
  }

  throw new Error("Bad input");
};

exports.deleteOne = async (id) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid correspondent id");
  }

  // 1. check if dialogue exists
  const dialogue = await Correspondent.findById(id);

  if (!dialogue) {
    throw new Error("Correspondent does not exist");
  }

  // 2. Check if correspondent is used in a dialogue
  const dialoguesWithThatCorrespondent = await Dialogue.find({
    expressions: { correspondent: id },
  }).lean();
  if (dialoguesWithThatCorrespondent.length !== 0) {
    throw new Error("Correspondent can't be deleted because it is being used");
  }

  return await Correspondent.findByIdAndDelete(id).lean();
};
