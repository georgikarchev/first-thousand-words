const Text = require("../models/Text");
const { removeEmptyAttributes, isEmpty } = require("../utils/jsUtils");
const { isValidMongoId } = require("../utils/validators");

exports.getMany = async (query) => {
  let qry = {};
  let result = { data: {}, count: 0 };

  // TODO: FIX The count gets the number of all found text documents, ano not the number of the one, which satisfy the qry.find
  result.count = await Text.find({}).countDocuments();

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

  result.data = await Text.find(qry.find)
    .sort(qry.sort)
    .skip(qry.skip)
    .limit(qry.limit)
    .populate({
      path : 'expressions',
      populate : {
        path : 'words'
      }
    })
    .lean();
  return result;
};

exports.getById = async (id) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid text id");
  }

  const text = await Text
    .findById(id)
    .populate({
      path : 'expressions',
      populate : {
        path : 'words'
      }
    })
    .lean();

  if (!text) {
    throw new Error("Text does not exist.");
  }

  return text;
};

exports.create = async (data) => {
  const { expressions, title } = data;

  const newText = { expressions: expressions, title };
  
  if(!expressions.length > 0) {
    throw new Error("Bad input");
  }
  expressions.forEach(expressionId => {
    if (!isValidMongoId(expressionId)) {
      throw new Error("Bad input");
    }
  });


  newText.created = new Date();

  return await Text.create(newText);
};

exports.update = async (id, data) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid text id");
  }
  
  const text = await Text.findById(id);
  
  if (!text) {
    throw new Error("Text does not exist");
  }
  
  const newData = removeEmptyAttributes(data);
  
  if (newData.language) {
    text.language = newData.language;
  }

  if (newData.expressions) {
    if(!Array.isArray(newData.expressions)) {
      throw new Error("Bad input");
    }


    newData.expressions.forEach(expressionId => {
      if (!isValidMongoId(expressionId)) {
        throw new Error("Bad input");
      }
    });

    text.expressions = newData.expressions;
  }

  if (newData.published) {
    text.published = newData.published;
  }

  if (newData.description) {
    text.description = newData.description;
  }

  if (newData.notes) {
    text.notes = newData.notes;
  }

  if (!isEmpty(newData)) {
    text.modified = new Date();
    return await text.save();
  }

  throw new Error("Bad input");
};

exports.deleteOne = async (id) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid text id");
  }
  
  // 1. check if text exists
  const text = await Text.findById(id);
  
  if (!text) {
    throw new Error("Text does not exist.");
  }

  return await Text.findByIdAndDelete(id).lean();
};