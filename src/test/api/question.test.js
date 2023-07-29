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
let questionAskedId = "";

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
              "multipleChoice;Devinette;Quelle est la couleur du cheval blanc d'Henri IV ?;blanc;1;blanc/noir/rouge/vert;;;0",
              "open;Géographie;Quelle est la capitale de la Belgique ?;Bruxelles;1;;C'est la capitale de la Belgique;;0",
              "estimate;Espace;A combien de kilomètres de la Terre se trouve la Lune ?;384400;1;;La lune se trouve à 384400 km de la terre;;0",
              "multipleChoice;Culture village;Quelle est la nourriture préférée de Choco?;Les lasagnes;0;Les lasagnes/Les croquettes/Le chocolat/Les pommes;;Choco adore les lasagnes;;1",
              "open;Musique;Quel est le nom de ce chanteur ?;Rick Astley;1;;C'est Rick Astley;example.jpg;0",
            ],
          })
          .end((err, res) => {
            res.should.be.a("object");
            res.body.should.have.property("message");
            res.body.message.should.be.eql("5 question(s) created");
            done();
          });
      });
  });

  it("should return an error if the questions have already been created for this game", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questions")
      .send({
        gameId: gameIdCreated,
        fileLines: [
          "multipleChoice;Devinette;Quelle est la couleur du cheval blanc d'Henri IV ?;blanc;1;blanc/noir/rouge/vert;;;0",
          "open;Géographie;Quelle est la capitale de la Belgique ?;Bruxelles;1;;C'est la capitale de la Belgique;;0",
          "estimate;Espace;A combien de kilomètres de la Terre se trouve la Lune ?;384400;1;;La lune se trouve à 384400 km de la terre;;0",
          "multipleChoice;Culture village;Quelle est la nourriture préférée de Choco?;Les lasagnes;0;Les lasagnes/Les croquettes/Le chocolat/Les pommes;;Choco adore les lasagnes;;1",
          "open;Musique;Quel est le nom de ce chanteur ?;Rick Astley;1;;C'est Rick Astley;example.jpg;0",
        ],
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.status.should.be.eql(400);
        res.body.should.have.property("error");
        res.body.error.should.be.eql(
          "All questions already exist for this game"
        );
        done();
      });
  });

  it("should create only the questions that do not already exist", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questions")
      .send({
        gameId: gameIdCreated,
        fileLines: [
          "multipleChoice;Devinette;Quelle est la couleur du cheval blanc d'Henri IV ?;blanc;1;blanc/noir/rouge/vert;;;0",
          "open;Géographie;Quelle est la capitale de la Belgique ?;Bruxelles;1;;C'est la capitale de la Belgique;;0",
          "estimate;Espace;A combien de kilomètres de la Terre se trouve la Lune ?;384400;1;;La lune se trouve à 384400 km de la terre;;0",
          "multipleChoice;Culture village;Quelle est la nourriture préférée de Choco?;Les lasagnes;0;Les lasagnes/Les croquettes/Le chocolat/Les pommes;;Choco adore les lasagnes;;1",
          "open;Musique;Quel est le nom de ce chanteur ?;Rick Astley;1;;C'est Rick Astley;example.jpg;0",
          "open;Cinéma;Qui est le réalisateur du film Oppenheimer ?;Christopher Nolan;1;;C'est Christopher Nolan;;0",
        ],
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.status.should.be.eql(201);
        res.body.should.have.property("message");
        res.body.message.should.be.eql(
          "Only 1 question(s) created as 5 question(s) already exists for this game"
        );
        done();
      });
  });
});

describe("GET /randomThemes", () => {
  it("should return an error if the game ID is missing", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomThemes")
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Game id must be provided");
        done();
      });
  });

  it("should return an error if the game ID is empty", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomThemes")
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
      .get(baseURL + "/randomThemes")
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

  it("should return an error if no questions are associated to this game id", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomThemes")
      .send({
        gameId: "00000000-0000-0000-0000-000000000000",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("No questions found for this game");
        done();
      });
  });

  it("should return an array with two random themes", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomThemes")
      .send({
        gameId: gameIdCreated,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("message");
        res.body.should.have.property("themes");
        res.body.message.should.be.eql("Themes randomly selected");
        res.body.themes.should.be.a("array");
        res.body.themes.length.should.be.eql(2);
        done();
      });
  });
});

describe("GET /randomQuestion", () => {
  it("should return an error if the game ID is missing", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomQuestion")
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("Game id must be provided");
        done();
      });
  });

  it("should return an error if the game ID is empty", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomQuestion")
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
      .get(baseURL + "/randomQuestion")
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

  it("should return an error if the theme is not provided", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomQuestion")
      .send({
        gameId: gameIdCreated,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Theme must be provided");
        done();
      });
  });

  it("should return an error if the theme is empty", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomQuestion")
      .send({
        gameId: gameIdCreated,
        theme: "",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Theme cannot be empty");
        done();
      });
  });

  it("should return a question if the theme is valid", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomQuestion")
      .send({
        gameId: gameIdCreated,
        theme: "Géographie",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("message");
        res.body.should.have.property("question");
        res.body.message.should.be.eql("Question randomly selected");
        res.body.question.should.be.a("object");
        res.body.question.should.have.property("id");
        questionAskedId = res.body.question.id;
        res.body.question.should.have.property("questionType");
        res.body.question.should.have.property("question");
        res.body.question.should.have.property("answer");
        res.body.question.should.have.property("points");
        res.body.question.should.have.property("choices");
        res.body.question.should.have.property("explanation");
        done();
      });
  });

  it("should return an error if no questions are found for this theme", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomQuestion")
      .send({
        gameId: gameIdCreated,
        theme: "Géographie",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("No questions found for this theme");
        done();
      });
  });
});

describe("GET /answer", () => {
  it("should return an error if the question id is not provided", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/answer")
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Question id must be provided");
        done();
      });
  });

  it("should return an error if the question id is empty", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/answer")
      .send({
        questionId: "",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Question id cannot be empty");
        done();
      });
  });

  it("should return an error if the question id is not valid", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/answer")
      .send({
        questionId: "123",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Question id is not valid");
        done();
      });
  });

  it("should return an error if the id is not found in the database", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/answer")
      .send({
        questionId: "00000000-0000-0000-0000-000000000000",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("No asked question found with this id");
        done();
      });
  });

  it("should return the answer of the question", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/answer")
      .send({
        questionId: questionAskedId,
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("message");
        res.body.should.have.property("answer");
        res.body.should.have.property("explanation");
        res.body.should.have.property("choices");
        res.body.should.have.property("points");
        res.body.message.should.be.eql("Answer retrieved");
        res.body.answer.should.be.eql("Bruxelles");
        res.body.explanation.should.be.eql("C'est la capitale de la Belgique");
        res.body.choices.should.be.eql("");
        res.body.points.should.be.eql(1);
        done();
      });
  });
});

describe("GET /questionImage", () => {
  it("should return an error if the imageName is not provided", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/questionImage")
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Image name must be provided");
        done();
      });
  });

  it("should return an error if the imageName is empty", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/questionImage")
      .send({
        imageName: "",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Image name cannot be empty");
        done();
      });
  });

  it("should return an error if the imageName does not contain a .", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/questionImage")
      .send({
        imageName: "123",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Image name is not valid");
        done();
      });
  });

  it("should return an error if the imageName contain ..", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/questionImage")
      .send({
        imageName: "123..456",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Image name is not valid");
        done();
      });
  });

  it("should return an error if the extension is not valid", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/questionImage")
      .send({
        imageName: "123456789012345678901234567890123456.pdf",
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });

  it("should return the image", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/questionImage")
      .send({
        imageName: "example.jpg",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.header("content-type", "image/jpeg");
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
