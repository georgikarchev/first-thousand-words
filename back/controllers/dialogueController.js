const dialogueService = require("../services/dialogueService");
const { DEFAULT_DB_FETCH_LIMIT } = require("../constants");

const { getErrorMessage } = require("../utils/errorUtils");

exports.getMany = async (req, res) => {
  const query = { ...req.query };
  query.skip = query.skip ? query.skip : 0;
  query.limit = query.limit ? query.limit : DEFAULT_DB_FETCH_LIMIT;
  query.sortBy = query.sortBy ? query.sortBy : "created";
  query.orderBy = query.orderBy ? query.orderBy : "asc";

  try {
    const result = await dialogueService.getMany(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
};

exports.getOne = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await dialogueService.getById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
};

exports.createOne = async (req, res) => {
  try {
    const { expressions } = req.body;

    if (!expressions) {
      throw new Error("Bad input");
    }

    const result = await dialogueService.create({expressions});

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
};

exports.deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await dialogueService.deleteOne(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await dialogueService.update(id, req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
};