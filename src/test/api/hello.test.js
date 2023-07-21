const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

const serverAddress = `http://${process.env.API_HOST}:${process.env.API_PORT}`;
const baseURL = "/api/" + process.env.API_VERSION;

describe("GET /", () => {
  it("should return Hello API World!", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/")
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("message");
        res.body.should.have.property("status");
        res.body.status.should.be.eql(200);
        res.body.message.should.be.eql("Hello API World!");
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
      connection.query("DELETE FROM Groups", (err, result) => {
        if (err) throw err;
        connection.query("DELETE FROM Questions", (err, result) => {
          if (err) throw err;
          connection.query("DELETE FROM Games", (err, result) => {
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
