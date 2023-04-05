const Expression = require("../models/Expression");
const Text = require("../models/Text");
const Dialogue = require("../models/Dialogue");
const { removeEmptyAttributes, isEmpty } = require("../utils/jsUtils");
const { isValidMongoId } = require("../utils/validators");
const { default: mongoose } = require("mongoose");

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
  if (!isValidMongoId(id)) {
    throw new Error("Invalid expression id");
  }

  const expression = await Expression.findById(id).lean();

  if (!expression) {
    throw new Error("Expression does not exist");
  }

  return expression;
};

exports.create = async (data, type) => {
  const { words } = data;

  const existingExpression = await Expression.find({ words: words });

  if (existingExpression && existingExpression.length) {
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

exports.update = async (id, data) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid expression id");
  }
  
  const expression = await Expression.findById(id);
  
  if (!expression) {
    throw new Error("Expression does not exist");
  }
  
  const newData = removeEmptyAttributes(data);

  if (newData.words) {
    expression.words = newData.words;
  }

  if (newData.language) {
    expression.language = newData.language;
  }

  if (newData.type) {
    expression.type = newData.type;
  }

  if (newData.published) {
    expression.published = newData.published;
  }

  if (newData.description) {
    expression.description = newData.description;
  }

  if (newData.notes) {
    expression.notes = newData.notes;
  }

  if (!isEmpty(newData)) {
    expression.modified = new Date();
    return await expression.save();
  }

  throw new Error("Bad input");
};

exports.deleteOne = async (id) => {
  if (!isValidMongoId(id)) {
    throw new Error("Invalid expression id");
  }
  
  // 1. check if expression exists
  const expression = await Expression.findById(id);
  
  if (!expression) {
    throw new Error("Expression does not exist");
  }

  // 2. check if expression is used in Dialogs and Texts
  // TODO: check if expression is used in Dialogs and Texts - if Yes - Output Error "Cant't delete."
  // let isInUse = await Text.find({"expressions": { expression: id }});
  // isInUse = isInUse.length !== 0 ? await Dialogue.find({"expressions": { expression: id }}) : false;
  

  let isInUse = await Dialogue.find({"expressions.expression": {$eq: mongoose.Bson.ObjectId.Parse("642c325e91e0513e58c10f28")}});

  // const mongoId = await mongoose.Types.ObjectId.Parse(id);
  // const exFound = await Dialog.find();
  // console.log("--->", exFound);


  if (isInUse.length === 0) {
    throw new Error("Being used");
  }

  return await Expression.findByIdAndDelete(id).lean();
};

exports.findExpressionsWithWord = async (wordId) => {
  if(!isValidMongoId(wordId)) {
    throw new Error("Invalid word id");
  }

  const expressions = await Expression.find({words: wordId});
  
  return expressions;
};