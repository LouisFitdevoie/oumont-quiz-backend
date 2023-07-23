const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

require("../../main.js").startServer();

before(function (done) {
  this.timeout(10000);
  setTimeout(done, 2000);
});
const serverAddress = `${process.env.API_HOST}:${process.env.API_PORT}`;
const baseURL = `/api/${process.env.API_VERSION}`;

let gameId = "";

describe("GET /games without game in the DB", () => {
  it("should return an error message if there is no game in the DB", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/games")
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property("error").eql("No game found");
        done();
      });
  });
});

describe("POST /game", () => {
  it("should return an error message if the name is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("error").eql("Missing name");
        done();
      });
  });
  it("should return an error message if the number of qualifying questions is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("Missing the number of qualifying questions");
        done();
      });
  });
  it("should return an error message if the number of qualifying questions is not an integer", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: "test",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("The number of qualifying questions must be an integer");
        done();
      });
  });
  it("should return an error message if the bonus questions is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("Missing the bonus questions");
        done();
      });
  });
  it("should return an error message if the bonus questions is not a boolean", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: "test",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("The bonus questions must be a boolean");
        done();
      });
  });
  it("should return an error message if the bonus question is true and the number of bonus questions is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: true,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("Missing the number of bonus questions");
        done();
      });
  });
  it("should return an error message if the bonus question is true and the number of bonus questions is not an integer", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: true,
        bonusQuestionsNumber: "test",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("The number of bonus questions must be an integer");
        done();
      });
  });
  it("should return an error message if the semi-finals number of questions is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("Missing the number of semi-finals questions");
        done();
      });
  });
  it("should return an error message if the semi-finals number of questions is not an integer", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: "test",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("The number of semi-finals questions must be an integer");
        done();
      });
  });
  it("should return an error message if the small final number of questions is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("Missing the number of small final questions");
        done();
      });
  });
  it("should return an error message if the small final number of questions is not an integer", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: "test",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("The number of small final questions must be an integer");
        done();
      });
  });
  it("should return an error message if the final number of questions is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: 10,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("Missing the number of final questions");
        done();
      });
  });
  it("should return an error message if the final number of questions is not an integer", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: 10,
        finalNumberQuestions: "test",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("The number of final questions must be an integer");
        done();
      });
  });
  it("should return an error message if the time to answer QCM is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: 10,
        finalNumberQuestions: 10,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("Missing the time to answer MCQ questions");
        done();
      });
  });
  it("should return an error message if the time to answer open questions is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: 10,
        finalNumberQuestions: 10,
        timeToAnswerQCM: 10,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("Missing the time to answer open questions");
        done();
      });
  });
  it("should return an error message if the time to answer estimate questions is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: 10,
        finalNumberQuestions: 10,
        timeToAnswerQCM: 10,
        timeToAnswerOpen: 10,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("Missing the time to answer estimate questions");
        done();
      });
  });
  it("should return an error message if the time to answer QCM is not an integer", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: 10,
        finalNumberQuestions: 10,
        timeToAnswerQCM: "test",
        timeToAnswerOpen: 10,
        timeToAnswerEstimate: 10,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("The time to answer must be an integer");
        done();
      });
  });
  it("should return an error message if the time to answer open questions is not an integer", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: 10,
        finalNumberQuestions: 10,
        timeToAnswerQCM: 10,
        timeToAnswerOpen: "test",
        timeToAnswerEstimate: 10,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("The time to answer must be an integer");
        done();
      });
  });
  it("should return an error message if the time to answer estimate questions is not an integer", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: 10,
        finalNumberQuestions: 10,
        timeToAnswerQCM: 10,
        timeToAnswerOpen: 10,
        timeToAnswerEstimate: "test",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("The time to answer must be an integer");
        done();
      });
  });
  it("should return an error message if the number of persons per group is not an integer", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: 10,
        finalNumberQuestions: 10,
        timeToAnswerQCM: 10,
        timeToAnswerOpen: 10,
        timeToAnswerEstimate: 10,
        personsPerGroup: "test",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("error")
          .eql("The number of persons per group must be an integer");
        done();
      });
  });

  it("should return a success message if the game is created", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/game")
      .send({
        name: "Test",
        qualifyingNumberQuestions: 10,
        bonusQuestions: false,
        semiFinalsNumberQuestions: 10,
        smallFinalNumberQuestions: 10,
        finalNumberQuestions: 10,
        timeToAnswerQCM: 10,
        timeToAnswerOpen: 10,
        timeToAnswerEstimate: 10,
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have
          .property("message")
          .eql("Game successfully created");
        res.body.should.have.property("gameId");
        gameId = res.body.gameId;
        done();
      });
  });
});

describe("GET /game/:gameId", () => {
  it("should return an error message if the game ID is not a UUID", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/game/test")
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("error").eql("Invalid game id");
        done();
      });
  });

  it("should return an error message if the game ID does not exist", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/game/00000000-0000-0000-0000-000000000000")
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property("error").eql("Game not found");
        done();
      });
  });

  it("should return the game if the game ID exists", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/game/" + gameId)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("game");
        res.body.game.should.have.property("id").eql(gameId);
        res.body.game.should.have.property("name").eql("Test");
        res.body.game.should.have.property("qualifyingNumberQuestions").eql(10);
        res.body.game.should.have.property("bonusQuestions").eql(false);
        res.body.game.should.have.property("bonusQuestionsNumber").eql(0);
        res.body.game.should.have.property("semiFinalsNumberQuestions").eql(10);
        res.body.game.should.have.property("smallFinalNumberQuestions").eql(10);
        res.body.game.should.have.property("finalNumberQuestions").eql(10);
        res.body.game.should.have.property("timeToAnswer").eql("10,10,10");
        res.body.game.should.have.property("personsPerGroup").eql(4);
        res.body.game.should.have.property("createdAt").not.eql(null);
        done();
      });
  });
});

describe("GET /games after adding a game in the DB", () => {
  it("should return an array with one game", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/games")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("games");
        res.body.games.should.be.a("array");
        res.body.games.length.should.be.eql(1);
        res.body.games[0].should.have.property("gameId").eql(gameId);
        res.body.games[0].should.have.property("name").eql("Test");
        res.body.games[0].should.have.property("createdAt").not.eql(null);
        done();
      });
  });
});

after((done) => {
  const database = require("../../database.js");
  const pool = database.pool;
  process.env.TEST_FILES_COMPLETED++;
  if (process.env.TEST_FILES_COMPLETED == process.env.TEST_FILES_TOTAL) {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query("DELETE FROM `Groups`", (err, result) => {
        if (err) throw err;
        connection.query("DELETE FROM `Questions`", (err, result) => {
          if (err) throw err;
          connection.query("DELETE FROM `Games`", (err, result) => {
            if (err) throw err;
            connection.release();
            done();
          });
        });
      });
    });
  } else {
    done();
  }
});
