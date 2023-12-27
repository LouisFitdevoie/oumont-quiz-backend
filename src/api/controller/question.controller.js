const uuid = require("uuid");
const path = require("path");

const database = require("../../database.js");
const Question = require("../model/Question.js");
const pool = database.pool;

//Function to create a question
exports.createQuestions = (req, res) => {
  const dataReceived = req.body;

  //Verify if the request is valid
  if (dataReceived.hasOwnProperty("gameId") == false) {
    res.status(400).send({
      error: "Missing game id",
    });
    return;
  } else if (dataReceived.gameId == "") {
    res.status(400).send({
      error: "Game id cannot be empty",
    });
    return;
  } else if (!uuid.validate(dataReceived.gameId)) {
    res.status(400).send({
      error: "Game id is not valid",
    });
    return;
  }
  const gameId = dataReceived.gameId;

  if (dataReceived.hasOwnProperty("fileLines") == false) {
    res.status(400).send({
      error: "Missing file lines to create the questions",
    });
    return;
  } else if (Array.isArray(dataReceived.fileLines) == false) {
    res.status(400).send({
      error: "The file lines must be an array",
    });
    return;
  } else if (dataReceived.fileLines.length == 0) {
    res.status(400).send({
      error: "The file lines array cannot be empty",
    });
    return;
  }

  let fileLines = dataReceived.fileLines;
  let questionArray = [];

  //Creating an array of questions from the file lines
  fileLines.forEach((line) => {
    questionArray.push(new Question(line, gameId));
  });

  let questionAlreadyExisting = 0;
  let promises = [];
  //Creating promises to insert each question in the database AND verifying if the question already exists
  questionArray.forEach((question) => {
    const promise = new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM Questions WHERE game_id = ? AND question = ?",
        [question.gameId, question.question],
        (error, results) => {
          if (error) {
            console.error(error);
            reject(error);
          } else if (results.length > 0) {
            // Do nothing
            questionAlreadyExisting++;
            resolve();
          } else {
            // Insert the question
            pool.query(
              "INSERT INTO Questions (id, question_type, theme, question, answer, points, choices, explanation, image_name, is_bonus, game_id, is_asked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                question.id,
                question.questionType,
                question.theme,
                question.question,
                question.answer,
                question.points,
                question.choices,
                question.explanation || "",
                question.imageName || "",
                Boolean(question.isBonus),
                question.gameId,
                question.isAsked,
              ],
              (error, results) => {
                if (error) {
                  console.error(error);
                  reject(error);
                } else {
                  resolve();
                }
              }
            );
          }
        }
      );
    });

    promises.push(promise);
  });

  //Executing all the promises
  Promise.all(promises)
    .then(() => {
      if (questionAlreadyExisting == 0) {
        res.status(201).send({
          message: `${questionArray.length} question(s) created`,
        });
        return;
      } else if (questionAlreadyExisting == questionArray.length) {
        res.status(400).send({
          error: "All questions already exist for this game",
        });
        return;
      } else {
        res.status(201).send({
          message: `Only ${
            questionArray.length - questionAlreadyExisting
          } question(s) created as ${questionAlreadyExisting} question(s) already exists for this game`,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        error: "Error while creating the questions",
      });
    });
};

//Function to create a question from a json object
exports.createQuestionFromJSON = (req, res) => {
  if (req.body.hasOwnProperty("question") == false) {
    res.status(400).send({
      error: "Question object is missing",
    });
    return;
  }
  const question = req.body.question;

  if (question.hasOwnProperty("questionType") == false) {
    res.status(400).send({
      error: "Question type is missing",
    });
    return;
  } else if (
    question.questionType != "multipleChoice" &&
    question.questionType != "open" &&
    question.questionType != "estimate"
  ) {
    res.status(400).send({
      error: "Question type is not valid",
    });
    return;
  }

  if (question.hasOwnProperty("theme") == false) {
    res.status(400).send({
      error: "Theme is missing",
    });
    return;
  } else if (question.theme.trim() == "") {
    res.status(400).send({
      error: "Theme cannot be empty",
    });
    return;
  }

  if (question.hasOwnProperty("question") == false) {
    res.status(400).send({
      error: "Question is missing",
    });
    return;
  } else if (question.question.trim() == "") {
    res.status(400).send({
      error: "Question cannot be empty",
    });
    return;
  }

  if (question.hasOwnProperty("answer") == false) {
    res.status(400).send({
      error: "Answer is missing",
    });
    return;
  } else if (question.answer.trim() == "") {
    res.status(400).send({
      error: "Answer cannot be empty",
    });
    return;
  }

  if (question.hasOwnProperty("points") == false) {
    res.status(400).send({
      error: "Points is missing",
    });
    return;
  } else if (question.points.trim() == "") {
    res.status(400).send({
      error: "Points cannot be empty",
    });
    return;
  } else if (isNaN(parseInt(question.points))) {
    res.status(400).send({
      error: "Points is not valid",
    });
    return;
  } else if (parseInt(question.points) < 0) {
    res.status(400).send({
      error: "Points cannot be negative",
    });
    return;
  }

  if (question.hasOwnProperty("choices") == false) {
    res.status(400).send({
      error: "Choices is missing",
    });
    return;
  } else if (
    question.questionType == "multipleChoice" &&
    question.choices == ""
  ) {
    res.status(400).send({
      error: "Choices cannot be empty if the question type is multiple choice",
    });
    return;
  } else if (
    question.questionType == "multipleChoice" &&
    question.choices.split("/").length < 2
  ) {
    res.status(400).send({
      error:
        "Must be at least 2 choices if the question type is multiple choice",
    });
    return;
  }

  if (question.hasOwnProperty("gameId") == false) {
    res.status(400).send({
      error: "Game id is missing",
    });
    return;
  } else if (question.gameId == "") {
    res.status(400).send({
      error: "Game id cannot be empty",
    });
    return;
  } else if (!uuid.validate(question.gameId)) {
    res.status(400).send({
      error: "Game id is not valid",
    });
    return;
  }

  const questionToCreate = {
    id: uuid.v4(),
    questionType: question.questionType,
    theme: question.theme,
    question: decodeUnicode(question.question),
    answer: decodeUnicode(question.answer),
    points: parseInt(question.points),
    choices: decodeUnicode(question.choices),
    explanation: decodeUnicode(question.explanation),
    imageName: question.imageName,
    isBonus: Boolean(question.isBonus),
    gameId: question.gameId,
    isAsked: false,
  };

  //Verify if the game exists
  pool.query(
    "SELECT * FROM Games WHERE id = ?",
    [questionToCreate.gameId],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send({
          error: "Error while getting the game",
        });
        return;
      } else if (results.length == 0) {
        res.status(400).send({
          error: "No game found with this id",
        });
        return;
      } else {
        //Verify if the question already exists
        pool.query(
          "SELECT * FROM Questions WHERE game_id = ? AND question = ?",
          [questionToCreate.gameId, questionToCreate.question],
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).send({
                error: "Error while getting the question",
              });
              return;
            }

            if (results.length > 0) {
              res.status(400).send({
                error: "Question already exists for this game",
              });
              return;
            } else {
              //Insert the question
              pool.query(
                "INSERT INTO Questions (id, question_type, theme, question, answer, points, choices, explanation, image_name, is_bonus, game_id, is_asked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  questionToCreate.id,
                  questionToCreate.questionType,
                  questionToCreate.theme,
                  questionToCreate.question,
                  questionToCreate.answer,
                  questionToCreate.points,
                  questionToCreate.choices,
                  questionToCreate.explanation,
                  questionToCreate.imageName,
                  questionToCreate.isBonus,
                  questionToCreate.gameId,
                  questionToCreate.isAsked,
                ],
                (error, results) => {
                  if (error) {
                    console.log(error);
                    res.status(500).send({
                      error: "Error while creating the question",
                    });
                    return;
                  } else {
                    res.status(201).send({
                      message: "Question created",
                    });
                    return;
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};

//Function to get random themes for a game
exports.getRandomThemes = (req, res) => {
  const dataReceived = req.query;
  const numberOfRandomThemes = 2; //Change this value to get more or less random themes BUT need to change the front-end too

  //Verify if the request is valid
  if (dataReceived.hasOwnProperty("gameId") == false) {
    res.status(400).send({ error: "Game id must be provided" });
    return;
  } else if (dataReceived.gameId == "") {
    res.status(400).send({ error: "Game id cannot be empty" });
    return;
  } else if (!uuid.validate(dataReceived.gameId)) {
    res.status(400).send({ error: "Game id is not valid" });
    return;
  } else {
    //Verify if the game exists
    pool.query(
      "SELECT * FROM Games WHERE id = ?",
      [dataReceived.gameId],
      (error, results) => {
        if (error) {
          res.status(500).send({ error: "Error while getting the game" });
          return;
        } else if (results.length == 0) {
          res.status(400).send({ error: "No game found with this id" });
          return;
        } else {
          //Getting all the themes that have at least 3 questions not asked for this game
          pool.query(
            "SELECT theme FROM Questions WHERE game_id = ? AND is_asked = false GROUP BY theme HAVING COUNT(*) >= 3",
            [dataReceived.gameId],
            (error, results) => {
              if (error) {
                res
                  .status(500)
                  .send({ error: "Error while getting the themes" });
                return;
              } else if (results.length == 0) {
                res.send({
                  message: "No themes found for this game",
                  themes: [],
                });
                return;
              } else if (results.length < numberOfRandomThemes) {
                //If there are less themes than the number of random themes we want, we return all the themes left
                let themes = [];
                results.forEach((result) => {
                  themes.push(result.theme);
                });
                res.send({
                  message: "Themes randomly selected",
                  themes: themes,
                });
              } else {
                let randomThemes = [];

                //Getting random themes
                for (let i = 0; i < numberOfRandomThemes; i++) {
                  let randomIndex = Math.floor(Math.random() * results.length);
                  randomThemes.push(results[randomIndex].theme);
                  results.splice(randomIndex, 1);
                }

                res.send({
                  message: "Themes randomly selected",
                  themes: randomThemes,
                });
              }
            }
          );
        }
      }
    );
  }
};

//Function to get a random question for a theme
exports.getRandomQuestionByTheme = (req, res) => {
  const dataReceived = req.query;

  //Verify if the request is valid
  if (dataReceived.hasOwnProperty("gameId") == false) {
    res.status(400).send({ error: "Game id must be provided" });
    return;
  } else if (dataReceived.gameId == "") {
    res.status(400).send({ error: "Game id cannot be empty" });
    return;
  } else if (!uuid.validate(dataReceived.gameId)) {
    res.status(400).send({ error: "Game id is not valid" });
    return;
  }

  if (dataReceived.hasOwnProperty("theme") == false) {
    res.status(400).send({ error: "Theme must be provided" });
    return;
  } else if (dataReceived.theme == "") {
    res.status(400).send({ error: "Theme cannot be empty" });
    return;
  }

  //TODO - Depending on the bonus, we need to know if we return the bonus question or not (TBD)
  //Selecting a random question for the theme and the game that is not yet asked
  pool.query(
    "SELECT * FROM Questions WHERE game_id = ? AND theme = ? AND is_asked = false",
    [dataReceived.gameId, dataReceived.theme],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Error while getting the question" });
        return;
      } else if (results.length == 0) {
        res.status(400).send({ error: "No questions found for this theme" });
        return;
      } else {
        let randomIndex = Math.floor(Math.random() * results.length);
        let question = results[randomIndex];

        //Updating the question to set it as asked so it is not asked again
        pool.query(
          "UPDATE Questions SET is_asked = true WHERE id = ?",
          [question.id],
          (error, results) => {
            if (error) {
              res.status(500).send({
                error: "Error while updating the question",
              });
              return;
            } else {
              res.send({
                message: "Question randomly selected",
                question: {
                  id: question.id,
                  questionType: question.question_type,
                  question: question.question,
                  answer: question.answer,
                  points: question.points,
                  choices: question.choices,
                  explanation: question.explanation,
                  imageName: question.image_name,
                },
              });
            }
          }
        );
      }
    }
  );
};

//Function to get the answer for a question with its id
exports.getAnswer = (req, res) => {
  const dataReceived = req.body;

  //Verify if the request is valid
  if (dataReceived.hasOwnProperty("questionId") == false) {
    res.status(400).send({ error: "Question id must be provided" });
    return;
  } else if (dataReceived.questionId == "") {
    res.status(400).send({ error: "Question id cannot be empty" });
    return;
  } else if (!uuid.validate(dataReceived.questionId)) {
    res.status(400).send({ error: "Question id is not valid" });
    return;
  }

  //Getting the answer for the question with its id and that is already asked
  pool.query(
    "SELECT * FROM Questions WHERE id = ? AND is_asked = true",
    [dataReceived.questionId],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Error while getting the answer" });
        return;
      } else if (results.length == 0) {
        res.status(400).send({ error: "No asked question found with this id" });
        return;
      } else {
        let question = results[0];
        res.send({
          message: "Answer retrieved",
          answer: question.answer,
          explanation: question.explanation,
          choices: question.choices,
          points: question.points,
        });
      }
    }
  );
};

//Function to get the image for a question
exports.getQuestionImage = (req, res) => {
  const dataReceived = req.query;

  //Verify if the request is valid
  if (dataReceived.hasOwnProperty("imageName") == false) {
    res.status(400).send({ error: "Image name must be provided" });
    return;
  } else if (dataReceived.imageName == "") {
    res.status(400).send({ error: "Image name cannot be empty" });
    return;
  } else if (!dataReceived.imageName.includes(".")) {
    res.status(400).send({ error: "Image name is not valid" });
    return;
  } else if (dataReceived.imageName.includes("..")) {
    res.status(400).send({ error: "Image name is not valid" });
    return;
  }

  const imageName = dataReceived.imageName;
  const extensionsAllowes = ["jpg", "png", "gif", "jpeg"];

  //Verify if the extension is allowed from the list above
  if (
    !extensionsAllowes.includes(
      imageName.split(".")[imageName.split(".").length - 1]
    )
  ) {
    res.status(400).send({ error: "Image name is not valid" });
    return;
  }

  //Sending the image
  res.sendFile(
    imageName,
    {
      root: path.join(__dirname, "../../../public/images"),
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

//Function to get a question by its id
exports.getQuestionById = (req, res) => {
  const dataReceived = req.params;

  //Verify if the request is valid
  if (dataReceived.hasOwnProperty("questionId") == false) {
    res.status(400).send({ error: "Question id must be provided" });
    return;
  } else if (dataReceived.questionId == "") {
    res.status(400).send({ error: "Question id cannot be empty" });
    return;
  } else if (!uuid.validate(dataReceived.questionId)) {
    res.status(400).send({ error: "Question id is not valid" });
    return;
  }

  //Getting the question with its id
  pool.query(
    "SELECT * FROM Questions WHERE id = ?",
    [dataReceived.questionId],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Error while getting the question" });
        return;
      } else if (results.length == 0) {
        res.status(400).send({ error: "No question found with this id" });
        return;
      } else {
        let question = results[0];
        res.send({
          message: "Question retrieved",
          question: {
            id: question.id,
            questionType: question.question_type,
            question: question.question,
            answer: question.answer,
            points: question.points,
            choices: question.choices,
            explanation: question.explanation,
            imageName: question.image_name,
          },
        });
      }
    }
  );
};

//Function to get all the questions
exports.getAllQuestions = (req, res) => {
  pool.query("SELECT * FROM Questions", (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error while getting the questions" });
      return;
    } else if (results.length == 0) {
      res.status(400).send({ error: "No questions found" });
      return;
    } else {
      let questions = [];
      results.forEach((result) => {
        questions.push({
          id: result.id,
          questionType: result.question_type,
          question: result.question,
          answer: result.answer,
          points: result.points,
          choices: result.choices,
          explanation: result.explanation,
          theme: result.theme,
          imageName: result.image_name,
        });
      });
      res.send({
        message: "Questions retrieved",
        questions: questions,
      });
    }
  });
};

//Function to delete all the questions for a game
exports.deleteQuestionsForGameId = (req, res) => {
  const gameId = req.params.gameId;
  console.log("DELETE QUESTIONS FOR GAME ID: " + gameId);

  if (gameId == "") {
    res.status(400).send({ error: "Game id cannot be empty" });
    return;
  } else if (!uuid.validate(gameId)) {
    res.status(400).send({ error: "Game id is not valid" });
    return;
  }

  pool.query(
    "DELETE FROM Questions WHERE game_id = ?",
    [gameId],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Error while deleting the questions" });
        return;
      } else {
        res.send({
          message: "Questions deleted",
        });
      }
    }
  );
};

const decodeUnicode = (text) => {
  return text.replace(/\\u([\dA-F]{4})/gi, (match, grp) =>
    String.fromCharCode(parseInt(grp, 16))
  );
};
