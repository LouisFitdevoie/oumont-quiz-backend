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

  //***** BUGGED *****/
  //* Return that no database is selected

  // it("should return a success message if the game is created", (done) => {
  //   chai
  //     .request(serverAddress)
  //     .post(baseURL + "/game")
  //     .send({
  //       name: "Test",
  //       qualifyingNumberQuestions: 10,
  //       bonusQuestions: false,
  //       semiFinalsNumberQuestions: 10,
  //       smallFinalNumberQuestions: 10,
  //       finalNumberQuestions: 10,
  //       timeToAnswerQCM: 10,
  //       timeToAnswerOpen: 10,
  //       timeToAnswerEstimate: 10,
  //     })
  //     .end((err, res) => {
  //       res.should.have.status(201);
  //       res.body.should.have
  //         .property("message")
  //         .eql("Game successfully created");
  //       done();
  //     });
  // });
});
