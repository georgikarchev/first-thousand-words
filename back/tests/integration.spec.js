process.env.NODE_ENV = "test";

const Word = require("../models/Word");

const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../index");
const Expression = require("../models/Expression");

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

  
  let firstWordId;
  let secondWordId;

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
          done();
        });
    });

    it("READ single word - FAIL: Invalid word id", (done) => {
      chai
        .request(server)
        .get(`/words/AAA57b593c224c77a986569`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.error.should.be.a("string");
          res.body.error.should.be.eql("Invalid word id");
          done();
        });
    });

    it("UPDATE word - FAIL - Bad input", (done) => {
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

    it("UPDATE word - FAIL - Invalid word id", (done) => {
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

    it("UPDATE word - FAIL - Word does not exist", (done) => {
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
  });


  /*
   * Texts - Delete
   */
  
  /*
   * Dialogs - Delete
   */
  
  /*
   * Expressions - Delete
   */
  
  
  /*
   * Words - Delete
   */
  describe("DELETE /words", () => {
    it("DELETE one word", (done) => {
      chai
        .request(server)
        .delete(`/words/${firstWordId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body._id.should.be.a("string");
          res.body._id.should.be.eq(secondWordId);
          done();
        });
    });
  });
  
  describe("DELETE /words", () => {
    it("DELETE one word", (done) => {
      chai
        .request(server)
        .delete(`/words/${firstWordId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body._id.should.be.a("string");
          res.body._id.should.be.eq(secondWordId);
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
});
