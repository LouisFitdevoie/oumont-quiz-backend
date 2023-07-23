const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

before(function (done) {
  this.timeout(10000);
  setTimeout(done, 2000);
});
const serverAddress = `${process.env.API_HOST}:${process.env.API_PORT}`;
const baseURL = `/api/${process.env.API_VERSION}`;

let groupId = "";
let gameIdCreated = "";

describe("POST /group", () => {
  it("should return an error if the name is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/group")
      .send()
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Missing group name");
        done();
      });
  });

  it("should return an error if the name is empty", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/group")
      .send({
        name: "",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Group name cannot be empty");
        done();
      });
  });

  it("should return an error if the game id is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/group")
      .send({
        name: "Group 1",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Missing game id");
        done();
      });
  });

  it("should return an error if the game id is empty", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/group")
      .send({
        name: "Group 1",
        gameId: "",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Game id cannot be empty");
        done();
      });
  });

  it("should return an error if the game id is not valid", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/group")
      .send({
        name: "Group 1",
        gameId: "invalid",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Game id is not valid");
        done();
      });
  });

  it("should return an error if the game id does not exist", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/group")
      .send({
        name: "Group 1",
        gameId: "00000000-0000-0000-0000-000000000000",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Game id does not exist");
        done();
      });
  });

  it("should create a group", (done) => {
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
          .post(baseURL + "/group")
          .send({
            name: "Group 1",
            gameId: gameIdCreated,
          })
          .end((err, res) => {
            groupId = res.body.groupId;
            res.should.be.a("object");
            res.body.should.have.property("message");
            res.body.message.should.be.eql("Group successfully created");
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
