process.env.NODE_ENV = "test";

const Word = require("../models/Word");

const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../index");
const Expression = require("../models/Expression");
const Correspondent = require("../models/Correspondent");
const Dialogue = require("../models/Dialogue");

const should = chai.should();
// Set up the chai Http assertion library
chai.use(chaiHttp);

// TESTS
describe("API unit and integration tests", () => {


  before((done) => {
    Word.deleteMany({}, (err) => {
      done();
    });
  });

  before((done) => {
    Expression.deleteMany({}, (err) => {
      done();
    });
  });

  before((done) => {
    Correspondent.deleteMany({}, (err) => {
      done();
    });
  });

  before((done) => {
    Dialogue.deleteMany({}, (err) => {
      done();
    });
  });

  let firstWordId, secondWordId;
  let firstExpressionId, secondExpressionId;
  let firstCorrespondentId, secondCorrespondentId;
  let firstDialogueId, secondDialogueId;


  /*
   * Words
   */
  describe("/words Create Read Update (CRU)", () => {
    it("CREATE word - FAIL: Bad input", (done) => {
      chai
        .request(server)
        .post("/words")
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Bad input");
          done();
        });
    });

    it("READ words - No results.", (done) => {
      chai
        .request(server)
        .get("/words")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(0);
          done();
        });
    });

    it("CREATE word 'hello'", (done) => {
      chai
        .request(server)
        .post("/words")
        .send({
          word: "hello",
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.word.should.be.eql("hello");
          res.body.type.should.be.eql("noun");
          res.body.isPlural.should.be.eql(false);
          res.body.published.should.be.eql(true);
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });

    it("CREATE another word 'run'", (done) => {
      chai
        .request(server)
        .post("/words")
        .send({
          word: "run",
          type: "verb",
          isPlural: "false",
          published: "true",
          description: "test description",
          notes: "test notes",
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.word.should.be.eql("run");
          res.body.type.should.be.eql("verb");
          res.body.isPlural.should.be.eql(false);
          res.body.published.should.be.eql(true);
          res.body.description.should.be.eql("test description");
          res.body.notes.should.be.eql("test notes");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });

    it("READ words - Two results.", (done) => {
      chai
        .request(server)
        .get("/words")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(2);

          firstWordId = res.body.data[0]._id;
          secondWordId = res.body.data[1]._id;

          firstWordId.length.should.be.eq(24);
          secondWordId.length.should.be.eq(24);

          done();
        });
    });

    it("READ single word", (done) => {
      chai
        .request(server)
        .get(`/words/${firstWordId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          res.body._id.should.be.eq(firstWordId);
          done();
        });
    });

    it("READ single word - FAIL: Invalid word id", (done) => {
      chai
        .request(server)
        .get(`/words/AAA57b593c224c77a986569`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Invalid word id");
          done();
        });
    });

    it("READ single word - FAIL: Word does not exist", (done) => {
      chai
        .request(server)
        .get(`/words/652c1ba5f75450cbcaecebdb`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Word does not exist");
          done();
        });
    });

    it("UPDATE word - FAIL: Bad input", (done) => {
      chai
        .request(server)
        .put(`/words/${firstWordId}`)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Bad input");
          done();
        });
    });

    it("UPDATE word - FAIL: Invalid word id", (done) => {
      chai
        .request(server)
        .put(`/words/AAA57b593c224c77a986569`)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Invalid word id");
          done();
        });
    });

    it("UPDATE word - FAIL: Word does not exist", (done) => {
      chai
        .request(server)
        .put(`/words/14257b593c224c77a9865698`)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Word does not exist");
          done();
        });
    });

    it("UPDATE word - SUCCESS", (done) => {
      chai
        .request(server)
        .put(`/words/${firstWordId}`)
        .send({
          word: "running",
          type: "noun",
          isPlural: "true",
          published: "false",
          description: "updated test description",
          notes: "updated test notes",
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.word.should.be.eql("running");
          res.body.type.should.be.eql("noun");
          res.body.isPlural.should.be.eql(true);
          res.body.published.should.be.eql(false);
          res.body.description.should.be.eql("updated test description");
          res.body.notes.should.be.eql("updated test notes");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });
  });

  /*
   * Expressions
   */
  describe("/expressions Create Read Update (CRU)", () => {
    it("READ expression - No results.", (done) => {
      chai
        .request(server)
        .get("/expressions")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(0);
          done();
        });
    });


    it("CREATE an expression with the first found word", (done) => {
      chai
        .request(server)
        .post("/expressions")
        .send({
          words: [firstWordId],
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.words.should.be.a("array");
          res.body.type.should.be.eql("declarative");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });


    it("CREATE 2nd expression with the 2nd found word", (done) => {
      chai
        .request(server)
        .post("/expressions")
        .send({
          words: [secondWordId],
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.words.should.be.a("array");
          res.body.type.should.be.eql("declarative");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });


    it("READ expressions - Two results.", (done) => {
      chai
        .request(server)
        .get("/expressions")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(2);

          firstExpressionId = res.body.data[0]._id;
          secondExpressionId = res.body.data[1]._id;

          firstExpressionId.length.should.be.eq(24);
          secondExpressionId.length.should.be.eq(24);

          done();
        });
    });

    it("READ single expression", (done) => {
      chai
        .request(server)
        .get(`/expressions/${firstExpressionId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });

    it("READ single expression - FAIL: Invalid expression id", (done) => {
      chai
        .request(server)
        .get(`/expressions/AAA57b593c224c77a986569`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Invalid expression id");
          done();
        });
    });

    it("READ single expression - FAIL: Expression does not exist", (done) => {
      chai
        .request(server)
        .get(`/expressions/14257b593c224c77a9865698`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Expression does not exist");
          done();
        });
    });

    it("UPDATE expression - FAIL: Bad input", (done) => {
      chai
        .request(server)
        .put(`/expressions/${firstExpressionId}`)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Bad input");
          done();
        });
    });

    it("UPDATE expressions - FAIL: Invalid expression id", (done) => {
      chai
        .request(server)
        .put(`/expressions/AAA57b593c224c77a986569`)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Invalid expression id");
          done();
        });
    });
    
    it("UPDATE expressions - FAIL: Expression does not exist", (done) => {
      chai
        .request(server)
        .put(`/expressions/14257b593c224c77a9865698`)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Expression does not exist");
          done();
        });
    });

    it("UPDATE expression - SUCCESS", (done) => {
      chai
        .request(server)
        .put(`/expressions/${firstExpressionId}`)
        .send({
          words: [firstWordId, secondWordId],
          type: "imperative",
          published: "false",
          description: "updated test description",
          notes: "updated test notes",
        })
        .end((err, res) => {
          // console.log(res.body);

          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.words.should.be.eql([firstWordId, secondWordId]);
          res.body.type.should.be.eql("imperative");
          res.body.published.should.be.eql(false);
          res.body.description.should.be.eql("updated test description");
          res.body.notes.should.be.eql("updated test notes");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });
  });


  /*
   * Correspondents
   */
  describe("/correspondents Create Read Update (CRU)", () => {


    it("READ correspondent - No results.", (done) => {
      chai
        .request(server)
        .get("/correspondents")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(0);
          done();
        });
    });


    it("CREATE a correspondent", (done) => {
      chai
        .request(server)
        .post("/correspondents")
        .send({
          name: "Johnny",
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.name.should.be.a("string");
          res.body.species.should.be.eql("human");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });


    it("CREATE 2nd correspondent", (done) => {
      chai
        .request(server)
        .post("/correspondents")
        .send({
          name: "Amy",
          sex: "female"
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.name.should.be.eql("Amy");
          res.body.sex.should.be.eq("female");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });


    it("READ correspondents - Two results.", (done) => {
      chai
        .request(server)
        .get("/correspondents")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(2);

          firstCorrespondentId = res.body.data[0]._id;
          secondCorrespondentId = res.body.data[1]._id;

          firstCorrespondentId.length.should.be.eq(24);
          secondCorrespondentId.length.should.be.eq(24);

          done();
        });
    });

    it("READ single correspondent", (done) => {
      chai
        .request(server)
        .get(`/correspondents/${firstCorrespondentId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          res.body._id.should.be.eq(firstCorrespondentId);
          done();
        });
    });

    it("READ single correspondent - FAIL: Invalid correspondent id", (done) => {
      chai
        .request(server)
        .get(`/correspondents/AAA57b593c224c77a986569`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Invalid correspondent id");
          done();
        });
    });

    it("UPDATE correspondent - FAIL: Bad input", (done) => {
      chai
        .request(server)
        .put(`/correspondents/${firstCorrespondentId}`)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Bad input");
          done();
        });
    });

    it("UPDATE correspondents - FAIL: correspondents does not exist", (done) => {
      chai
        .request(server)
        .put(`/correspondents/14257b593c224c77a9865698`)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Correspondent does not exist");
          done();
        });
    });

    it("UPDATE correspondent - SUCCESS", (done) => {
      chai
        .request(server)
        .put(`/correspondents/${firstCorrespondentId}`)
        .send({
          name: "Johnonna",
          species: "monkey",
          sex: "female",
          language: ["english", "spanish"],
          published: "false",
          description: "updated test description",
          notes: "updated test notes",
        })
        .end((err, res) => {
          // console.log(res.body);

          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.name.should.be.eql("Johnonna");
          res.body.species.should.be.eql("monkey");
          res.body.sex.should.be.eql("female");
          res.body.language.should.be.eql(["english", "spanish"]);
          res.body.published.should.be.eql(false);
          res.body.description.should.be.eql("updated test description");
          res.body.notes.should.be.eql("updated test notes");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });
  });



  /*
   * Dialogs
   */
  describe("/dialogues Create Read Update (CRU)", () => {
    it("READ dialogue - No results.", (done) => {
      chai
        .request(server)
        .get("/dialogues")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(0);
          done();
        });
    });

    it("CREATE a dialogue with the first found expression & first found correspondent", (done) => {
      chai
        .request(server)
        .post("/dialogues")
        .send({
          expressions: [{
            expression: firstExpressionId,
            correspondent: firstCorrespondentId
          }],
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.expressions.should.be.a("array");
          res.body.language.should.be.eql("english");
          res.body.published.should.be.eql(false);
          should.not.exist(res.body.description);
          should.not.exist(res.body.notes);
          should.not.exist(res.body.modified);
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });

    it("CREATE 2nd dialogue with the 2nd found word", (done) => {
      chai
        .request(server)
        .post("/dialogues")
        .send({
          expressions: [{
            expression: secondExpressionId,
            correspondent: secondCorrespondentId
          }],
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.expressions.should.be.a("array");
          res.body.language.should.be.eql("english");
          res.body.published.should.be.eql(false);
          should.not.exist(res.body.description);
          should.not.exist(res.body.notes);
          should.not.exist(res.body.modified);
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          done();
        });
    });

    it("READ dialogues - Two results.", (done) => {
      chai
        .request(server)
        .get("/dialogues")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(2);

          firstDialogueId = res.body.data[0]._id;
          secondDialogueId = res.body.data[1]._id;

          firstDialogueId.length.should.be.eq(24);
          secondDialogueId.length.should.be.eq(24);

          done();
        });
    });

    it("READ single dialogue", (done) => {
      chai
        .request(server)
        .get(`/dialogues/${firstDialogueId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          res.body._id.should.be.eq(firstDialogueId);
          done();
        });
    });

    it("READ single dialogue - FAIL: Invalid dialogue id", (done) => {
      chai
        .request(server)
        .get(`/dialogues/AAA57b593c224c77a986569`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Invalid dialogue id");
          done();
        });
    });

    it("UPDATE dialogue - FAIL: Bad input", (done) => {
      chai
        .request(server)
        .put(`/dialogues/${firstDialogueId}`)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Bad input");
          done();
        });
    });

    it("UPDATE dialogue - FAIL 2 - Bad input", (done) => {
      chai
        .request(server)
        .put(`/dialogues/${firstDialogueId}`)
        .send({
          expressions: [{
            expression: secondExpressionId
          }],
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Bad input");
          done();
        });
    });

    it("UPDATE dialogues - FAIL: dialogues does not exist", (done) => {
      chai
        .request(server)
        .put(`/dialogues/14257b593c224c77a9865698`)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Dialogue does not exist");
          done();
        });
    });

    it("UPDATE dialogue - SUCCESS", (done) => {
      const newExpressions = [
        {
          expression: firstExpressionId,
          correspondent: firstCorrespondentId
        },
        {
          expression: secondExpressionId,
          correspondent: secondCorrespondentId
        }
      ];

      chai
        .request(server)
        .put(`/dialogues/${firstDialogueId}`)
        .send({
          expressions: newExpressions,
          language: "german",
          published: "true",
          description: "updated test description",
          notes: "updated test notes",
        })
        .end((err, res) => {
          // console.log(res.body);

          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.expressions[0].expression.should.be.eql(firstExpressionId);
          res.body.expressions[0].correspondent.should.be.eql(firstCorrespondentId);
          res.body.expressions[1].expression.should.be.eql(secondExpressionId);
          res.body.expressions[1].correspondent.should.be.eql(secondCorrespondentId);
          res.body.language.should.be.eql("german");
          res.body.published.should.be.eql(true);
          res.body.description.should.be.eql("updated test description");
          res.body.notes.should.be.eql("updated test notes");
          res.body._id.should.be.a("string");
          res.body._id.length.should.be.eq(24);
          res.body._id.should.be.eq(firstDialogueId);
          done();
        });
    });
  
  });

  /*
   * Words, Correspondents, Expressions - Delete FAIL: Being used
   */
  describe("/words, /correspondents, /expressions Words, Correspondents, Expressions - Delete FAIL: Being used", () => {
    it("DELETE one Expression - FAIL: Expression does not exist", (done) => {
      chai
        .request(server)
        .delete(`/expressions/${firstExpressionId}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Being used");
          done();
        });
    });
  });
  

  /*
   * Texts - Delete
   */

  /*
   * Dialogs - Delete
   */
  describe("/dialogues DELETE", () => {
    it("DELETE one dialogue - FAIL: Invalid dialogue id", (done) => {
      chai
        .request(server)
        .delete(`/dialogues/AAA57b593c224c77a986569`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Invalid dialogue id");
          done();
        });
    });

    it("DELETE one dialogue - FAIL: Dialogue does not exist.", (done) => {
      chai
        .request(server)
        .delete(`/dialogues/652c1ba5f75450cbcaecebdb`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Dialogue does not exist.");
          done();
        });
    });

    it("DELETE one dialogue", (done) => {
      chai
        .request(server)
        .delete(`/dialogues/${firstDialogueId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body._id.should.be.a("string");
          res.body._id.should.be.eq(firstDialogueId);
          done();
        });
    });

    it("READ dialogues - One result.", (done) => {
      chai
        .request(server)
        .get("/dialogues")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(1);
          firstDialogueId = res.body.data[0]._id;
          firstDialogueId.length.should.be.eq(24);
          done();
        });
    });


  });

  /*
   * Expressions - Delete
   */
  describe("/expressions DELETE", () => {

    it("DELETE one Expression - FAIL: Invalid expression id", (done) => {
      chai
        .request(server)
        .delete(`/expressions/AAA57b593c224c77a986569`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Invalid expression id");
          done();
        });
    });

    it("DELETE one Expression - FAIL: Expression does not exist", (done) => {
      chai
        .request(server)
        .delete(`/expressions/699c1ba5f75450cbcaecebdb`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Expression does not exist");
          done();
        });
    });

    it("DELETE one expression", (done) => {
      chai
        .request(server)
        .delete(`/expressions/${firstExpressionId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body._id.should.be.a("string");
          res.body._id.should.be.eq(firstExpressionId);
          done();
        });
    });
  });

  /*
   * Words - Delete
   */
  describe("/words DELETE", () => {
    it("DELETE one Word - FAIL: Invalid word id", (done) => {
      chai
        .request(server)
        .delete(`/words/AAA57b593c224c77a986569`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Invalid word id");
          done();
        });
    });

    it("DELETE one Word - FAIL: Word does not exist", (done) => {
      chai
        .request(server)
        .delete(`/words/699c1ba5f75450cbcaecebdb`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Word does not exist");
          done();
        });
    });

    it("DELETE one word", (done) => {
      chai
        .request(server)
        .delete(`/words/${firstWordId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body._id.should.be.a("string");
          res.body._id.should.be.eq(firstWordId);
          done();
        });
    });

    it("READ words - One results.", (done) => {
      chai
        .request(server)
        .get("/words")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(1);
          firstWordId = res.body.data[0]._id;
          firstWordId.length.should.be.eq(24);
          done();
        });
    });
  });

  /*
   * Correspondents - Delete
   */
  it("DELETE one Correspondent - FAIL: Invalid correspondent id", (done) => {
    chai
      .request(server)
      .delete(`/correspondents/AAA57b593c224c77a986569`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.error.should.be.a("string");
        res.body.error.should.be.eql("Invalid correspondent id");
        done();
      });
  });

  it("DELETE one Correspondent - FAIL: Correspondent does not exist", (done) => {
    chai
      .request(server)
      .delete(`/correspondents/699c1ba5f75450cbcaecebdb`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.error.should.be.a("string");
        res.body.error.should.be.eql("Correspondent does not exist");
        done();
      });
  });

  describe("/correspondents DELETE", () => {
    it("DELETE one correspondent", (done) => {
      chai
        .request(server)
        .delete(`/correspondents/${firstCorrespondentId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body._id.should.be.a("string");
          res.body._id.should.be.eq(firstCorrespondentId);
          done();
        });
    });

    it("READ correspondents - One results.", (done) => {
      chai
        .request(server)
        .get("/correspondents")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(1);
          firstCorrespondentId = res.body.data[0]._id;
          firstCorrespondentId.length.should.be.eq(24);
          done();
        });
    });
  });



});
