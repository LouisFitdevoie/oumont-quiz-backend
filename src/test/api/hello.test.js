const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

require("../../main.js").startServer();

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
