const router = require("express").Router();
const wordService = require("../services/wordService");
const cardService = require("../services/cardService");
const measurementService = require("../services/measurementService");
const {
  DEFAULT_DB_FETCH_LIMIT,
  PASSWORD_VALIDATION_REGEXP,
  PASSWORD_VALIDATION_ALLOWED_CHARACTERS,
} = require("../constants");

const { json, query } = require("express");
const { getErrorMessage } = require("../utils/errorUtils");

router.get("/", async (req, res) => {
  const query = { ...req.query };
  query.skip = query.skip ? query.skip : 0;
  query.limit = query.limit ? query.limit : DEFAULT_DB_FETCH_LIMIT;
  query.sortBy = query.sortBy ? query.sortBy : "name";
  query.orderBy = query.orderBy ? query.orderBy : "asc";

  try {
    const result = await wordService.getMany(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await wordService.getById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { word } = req.body;

    if (!word) {
      throw new Error("Word must be defined");
    }

    const result = await wordService.createUser({ word });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await wordService.delete(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/word", async (req, res) => {
  try {
    const id = req.params.id;
    const { word } = req.body;

    if (!word) {
      throw new Error("Word must be defined.");
    }

    const result = await wordService.updateWord(id, word);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/is-plural", async (req, res) => {
  try {
    const id = req.params.id;
    const { isPlural } = req.body;

    if (isPlural == null) {
      throw new Error("New isPlural must be defined.");
    }

    const result = await wordService.updateIsPlural(id, isPlural);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/published", async (req, res) => {
  try {
    const id = req.params.id;
    const { published } = req.body;

    if (published == null) {
      throw new Error("New status must be defined.");
    }

    const result = await wordService.updatePublished(id, published);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/description", async (req, res) => {
  try {
    const id = req.params.id;
    const { description } = req.body;

    if (!description) {
      throw new Error("Notes must be defined.");
    }

    const result = await wordService.updateDescription(id, description);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/notes", async (req, res) => {
  try {
    const id = req.params.id;
    const { notes } = req.body;

    if (!notes) {
      throw new Error("Notes must be defined.");
    }

    const result = await wordService.updateNotes(id, notes);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});