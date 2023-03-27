const router = require("express").Router();

const wordController = require("./controllers/wordController");

router.use("/words", wordController);


// custom 404
router.use("/404", (req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// TODO: Security - Uncomment following lines in production
// custom error handler
// router.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// });

module.exports = router;
