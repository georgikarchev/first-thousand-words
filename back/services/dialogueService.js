const Expression = require("../models/Expression");
const Text = require("../models/Text");
const Dialogue = require("../models/Dialogue");
const { removeEmptyAttributes, isEmpty } = require("../utils/jsUtils");
const { isValidMongoId } = require("../utils/validators");
const { default: mongoose } = require("mongoose");

exports.getMany = async (query) => {
  let qry = {};
  let result = { data: {}, count: 0 };

  result.count = await Dialogue.find({}).countDocuments();

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

  result.data = await Dialogue.find(qry.find)
    .sort(qry.sort)
    .skip(qry.skip)
    .limit(qry.limit)
    .lean();
  return result;
};

exports.getById = async (id) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid dialogue id");
  }

  const dialogue = await Dialogue.findById(id).lean();

  if (!dialogue) {
    throw new Error("Dialogue does not exist.");
  }

  return dialogue;
};

exports.create = async (data, type) => {
  const { expressions } = data;

  const newDialogue = { expressions: expressions };
  
  if(!expressions.length > 0) {
    throw new Error("Bad input");
  }

  expressions.forEach(e => {
    if(!e.expression) { //|| typeof e.expression !== mongoose.Types.ObjectId
      throw new Error("Bad input");
    }

    if(!e.correspondent) { //|| typeof e.correspondent !== mongoose.Types.ObjectId
      throw new Error("Bad input");
    }
  });


  newDialogue.created = new Date();

  return await Dialogue.create(newDialogue);
};

exports.update = async (id, data) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid dialogue id");
  }
  
  const dialogue = await Dialogue.findById(id);
  
  if (!dialogue) {
    throw new Error("Dialogue does not exist");
  }
  
  const newData = removeEmptyAttributes(data);
  
  if (newData.language) {
    dialogue.language = newData.language;
  }

  if (newData.expressions) {

    newData.expressions.forEach(e => {
      if(!e.expression) { //|| typeof e.expression !== mongoose.Types.ObjectId
        throw new Error("Bad input");
      }
  
      if(!e.correspondent) { //|| typeof e.correspondent !== mongoose.Types.ObjectId
        throw new Error("Bad input");
      }
    });

    dialogue.expressions = newData.expressions;
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
    throw new Error("Invalid dialogue id");
  }
  
  // 1. check if dialogue exists
  const dialogue = await Dialogue.findById(id);
  
  if (!dialogue) {
    throw new Error("Dialogue does not exist.");
  }

  return await Dialogue.findByIdAndDelete(id).lean();
};