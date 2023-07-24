const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

before(function (done) {
  this.timeout(10000);
  setTimeout(done, 2000);
});
const serverAddress = `http://${process.env.API_HOST}:${process.env.API_PORT}`;
const baseURL = "/api/" + process.env.API_VERSION;

let gameIdCreated = "";

describe("POST /questions", () => {
  it("should return an error if the game ID is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questions")
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Missing game id");
        done();
      });
  });

  it("should return an error if the game ID is empty", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questions")
      .send({
        gameId: "",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Game id cannot be empty");
        done();
      });
  });

  it("should return an error if the game ID is not valid", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questions")
      .send({
        gameId: "123",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Game id is not valid");
        done();
      });
  });

  it("should return an error if the file lines are missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questions")
      .send({
        gameId: "00000000-0000-0000-0000-000000000000",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql(
          "Missing file lines to create the questions"
        );
        done();
      });
  });

  it("should return an error if the file lines are not an array", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questions")
      .send({
        gameId: "00000000-0000-0000-0000-000000000000",
        fileLines: "test",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("The file lines must be an array");
        done();
      });
  });

  it("should return an error if the file lines array is empty", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questions")
      .send({
        gameId: "00000000-0000-0000-0000-000000000000",
        fileLines: [],
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("The file lines array cannot be empty");
        done();
      });
  });

  it("should return a success message if the questions were created successfully", (done) => {
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
        gameIdCreated = res.body.gameId;
        chai
          .request(serverAddress)
          .post(baseURL + "/questions")
          .send({
            gameId: gameIdCreated,
            fileLines: [
              "multipleChoice;Devinette;Quelle est la couleur du cheval blanc d'Henri IV ?;blanc;1;blanc/noir/rouge/vert;;0",
              "open;Géographie;Quelle est la capitale de la Belgique ?;Bruxelles;1;;C'est la capitale de la Belgique;0",
              "estimate;Espace;A combien de kilomètres de la Terre se trouve la Lune ?;384400;1;;La lune se trouve à 384400 km de la terre;0",
              "multipleChoice;Culture village;Quelle est la nourriture préférée de Choco?;Les lasagnes;0;Les lasagnes/Les croquettes/Le chocolat/Les pommes;;Choco adore les lasagnes;1",
            ],
          })
          .end((err, res) => {
            res.should.be.a("object");
            res.body.should.have.property("message");
            res.body.message.should.be.eql("4 question(s) created");
            done();
          });
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
