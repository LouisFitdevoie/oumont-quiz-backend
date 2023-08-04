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

describe("GET /group?gameId=:gameId without groups in the DB", () => {
  it("should return an error if the game id is missing", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/group")
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
      .get(baseURL + "/group?gameId=")
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
      .get(baseURL + "/group?gameId=invalid")
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Game id is not valid");
        done();
      });
  });

  it("should return an error if no group exists for the game", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/group?gameId=00000000-0000-0000-0000-000000000000")
      .end((err, res) => {
        console.log(res.body);
        res.should.be.a("object");
        res.body.should.have.property("message");
        res.body.should.have.property("groups");
        res.body.message.should.be.eql("No groups found for this game");
        res.body.groups.should.be.a("array");
        res.body.groups.length.should.be.eql(0);
        done();
      });
  });
});

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
            res.should.be.a("object");
            res.body.should.have.property("message");
            res.body.message.should.be.eql("Group successfully created");
            done();
          });
      });
  });
});

describe("GET /group?gameId=:gameId with groups in the DB", () => {
  it("should return the groups for the game", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/group?gameId=" + gameIdCreated)
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.be.eql("Groups successfully retrieved");
        res.body.should.have.property("groups");
        res.body.groups.should.be.a("array");
        res.body.groups.length.should.be.eql(1);
        res.body.groups[0].should.have.property("id");
        res.body.groups[0].should.have.property("name");
        res.body.groups[0].should.have.property("gameId");
        res.body.groups[0].should.have.property("points");
        res.body.groups[0].should.have.property("bonus");
        res.body.groups[0].should.have.property("isQualified");
        res.body.groups[0].should.have.property("ranking");
        res.body.groups[0].id.should.be.a("string");
        groupId = res.body.groups[0].id;
        res.body.groups[0].name.should.be.eql("Group 1");
        res.body.groups[0].gameId.should.be.eql(gameIdCreated);
        res.body.groups[0].points.should.be.eql(0);
        res.body.groups[0].bonus.should.be.eql("");
        res.body.groups[0].isQualified.should.be.eql(false);
        res.body.groups[0].ranking.should.be.eql(0);
        done();
      });
  });
});

describe("PUT /group", () => {
  it("should return an error if the group id is missing", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group")
      .send()
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Missing group id");
        done();
      });
  });

  it("should return an error if the group id is empty", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group")
      .send({
        groupId: "",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Group id cannot be empty");
        done();
      });
  });

  it("should return an error if the group id is not valid", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group")
      .send({
        groupId: "invalid",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Group id is not valid");
        done();
      });
  });

  it("should return an error if the points are missing", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group")
      .send({
        groupId: groupId,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Missing points");
        done();
      });
  });

  it("should return an error if the points are not a number", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group")
      .send({
        groupId: groupId,
        points: "invalid",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Points must be a number");
        done();
      });
  });

  it("should return an error if the group id does not exist", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group")
      .send({
        groupId: "00000000-0000-0000-0000-000000000000",
        points: 10,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Group not found");
        done();
      });
  });

  it("should update the points for the group", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group")
      .send({
        groupId: groupId,
        points: 10,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.eql("Points successfully updated");
        done();
      });
  });
});

describe("PUT /group/updateQualifiedStatus", () => {
  it("should return an error if the group id is missing", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group/updateQualifiedStatus")
      .send()
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Missing group id");
        done();
      });
  });

  it("should return an error if the group id is empty", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group/updateQualifiedStatus")
      .send({
        groupId: "",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Group id cannot be empty");
        done();
      });
  });

  it("should return an error if the group id is not valid", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group/updateQualifiedStatus")
      .send({
        groupId: "invalid",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Group id is not valid");
        done();
      });
  });

  it("should return an error if the isQualified is missing", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group/updateQualifiedStatus")
      .send({
        groupId: groupId,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Missing qualified status");
        done();
      });
  });

  it("should return an error if the isQualified is not a boolean", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group/updateQualifiedStatus")
      .send({
        groupId: groupId,
        isQualified: "invalid",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Qualified status must be a boolean");
        done();
      });
  });

  it("should return an error if the ranking is missing", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group/updateQualifiedStatus")
      .send({
        groupId: groupId,
        isQualified: true,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Missing ranking");
        done();
      });
  });

  it("should return an error if the ranking is not a number", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group/updateQualifiedStatus")
      .send({
        groupId: groupId,
        isQualified: true,
        ranking: "invalid",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Ranking must be a number");
        done();
      });
  });

  it("should return an error if the ranking is negative", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group/updateQualifiedStatus")
      .send({
        groupId: groupId,
        isQualified: true,
        ranking: -1,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Ranking must be greater than 0");
        done();
      });
  });

  it("should return an error if the group does not exist", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group/updateQualifiedStatus")
      .send({
        groupId: "00000000-0000-0000-0000-000000000000",
        isQualified: true,
        ranking: 1,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Group not found");
        done();
      });
  });

  it("should return a success message if the group exists", (done) => {
    chai
      .request(serverAddress)
      .put(baseURL + "/group/updateQualifiedStatus")
      .send({
        groupId: groupId,
        isQualified: true,
        ranking: 1,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.eql("Qualified status successfully updated");
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
