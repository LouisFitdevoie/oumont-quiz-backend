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
          "open;Géographie;Quelle est la capitale de la France ?;Paris;1;;C'est la capitale de la France;;0",
          "open;Géographie;Quelle est la capitale de l'Allemagne ?;Berlin;1;;C'est la capitale de l'Allemagne;;0",
          "estimate;Espace;A combien de kilomètres de la Terre se trouve la Lune ?;384400;1;;La lune se trouve à 384400 km de la terre;;0",
          "multipleChoice;Culture village;Quelle est la nourriture préférée de Choco?;Les lasagnes;0;Les lasagnes/Les croquettes/Le chocolat/Les pommes;;Choco adore les lasagnes;;1",
          "open;Musique;Quel est le nom de ce chanteur ?;Rick Astley;1;;C'est Rick Astley;example.jpg;0",
          "open;Cinéma;Qui est le réalisateur du film Oppenheimer ?;Christopher Nolan;1;;C'est Christopher Nolan;;0",
          "open;Cinéma;Qui est le réalisateur du film Interstellar ?;Christopher Nolan;1;;C'est Christopher Nolan;;0",
          "open;Cinéma;Qui est le réalisateur du film Inception ?;Christopher Nolan;1;;C'est Christopher Nolan;;0",
        ],
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.status.should.be.eql(201);
        res.body.should.have.property("message");
        res.body.message.should.be.eql(
          "Only 5 question(s) created as 5 question(s) already exists for this game"
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
      .get(baseURL + "/randomThemes?gameId=")
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
      .get(baseURL + "/randomThemes?gameId=123")
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
      .get(
        baseURL + "/randomThemes?gameId=00000000-0000-0000-0000-000000000000"
      )
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.eql("No game found with this id");
        done();
      });
  });

  it("should return an array with two random themes", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/randomThemes?gameId=" + gameIdCreated)
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
      .get(baseURL + "/randomQuestion?gameId=")
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
      .get(baseURL + "/randomQuestion?gameId=123")
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
      .get(baseURL + "/randomQuestion?gameId=" + gameIdCreated)
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
      .get(baseURL + "/randomQuestion?gameId=" + gameIdCreated + "&theme=")
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
      .get(
        baseURL + "/randomQuestion?gameId=" + gameIdCreated + "&theme=Espace"
      )
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
      .get(
        baseURL + "/randomQuestion?gameId=" + gameIdCreated + "&theme=Espace"
      )
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
        res.body.answer.should.be.eql("384400");
        res.body.explanation.should.be.eql(
          "La lune se trouve à 384400 km de la terre"
        );
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

  it("should return an error if the imageName does not contain a .", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/questionImage?imageName=123")
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
      .get(baseURL + "/questionImage?imageName=123..456")
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
      .get(baseURL + "/questionImage?imageName=123456.pdf")
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });

  it("should return the image", (done) => {
    chai
      .request(serverAddress)
      .get(baseURL + "/questionImage?imageName=example.jpg")
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.header("content-type", "image/jpeg");
        done();
      });
  });
});

describe("POST /questionJSON", () => {
  it("should return an error if the question object is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Question object is missing");
        done();
      });
  });

  it("should return an error if the question type is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {},
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Question type is missing");
        done();
      });
  });

  it("should return an error if the question type is not valid", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "test",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Question type is not valid");
        done();
      });
  });

  it("should return an error if the theme is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Theme is missing");
        done();
      });
  });

  it("should return an error if the theme is empty", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Theme cannot be empty");
        done();
      });
  });

  it("should return an error if the question is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Question is missing");
        done();
      });
  });

  it("should return an error if the question is empty", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Question cannot be empty");
        done();
      });
  });

  it("should return an error if the answer is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Answer is missing");
        done();
      });
  });

  it("should return an error if the answer is empty", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Answer cannot be empty");
        done();
      });
  });

  it("should return an error if the points are missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "test",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Points is missing");
        done();
      });
  });

  it("should return an error if the points are empty", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "test",
          points: "",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Points cannot be empty");
        done();
      });
  });

  it("should return an error if the points are not a number", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "test",
          points: "test",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Points is not valid");
        done();
      });
  });

  it("should return an error if the points are negative", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "test",
          points: "-1",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Points cannot be negative");
        done();
      });
  });

  it("should return an error if the choices are missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "test",
          points: "1",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Choices is missing");
        done();
      });
  });

  it("should return an error if the choices are empty and the question type is multiple choice", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "test",
          points: "1",
          choices: "",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql(
          "Choices cannot be empty if the question type is multiple choice"
        );
        done();
      });
  });

  it("should return an error if there is less than 2 choices and the question type is multiple choice", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "test",
          points: "1",
          choices: "test",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql(
          "Must be at least 2 choices if the question type is multiple choice"
        );
        done();
      });
  });

  it("should return an error if the game id is missing", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "test",
          points: "1",
          choices: "test1/test2/test3/test4",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Game id is missing");
        done();
      });
  });

  it("should return an error if the game id is empty", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "test",
          points: "1",
          choices: "test1/test2/test3/test4",
          gameId: "",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Game id cannot be empty");
        done();
      });
  });

  it("should return an error if the game id is not valid", (done) => {
    chai
      .request(serverAddress)
      .post(baseURL + "/questionJSON")
      .send({
        question: {
          questionType: "multipleChoice",
          theme: "test",
          question: "test",
          answer: "test",
          points: "1",
          choices: "test1/test2/test3/test4",
          gameId: "123",
        },
      })
      .end((err, res) => {
        res.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.eql("Game id is not valid");
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
