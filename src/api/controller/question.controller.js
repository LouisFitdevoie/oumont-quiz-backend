const uuid = require("uuid");

const database = require("../../database.js");
const Question = require("../model/Question.js");
const pool = database.pool;

exports.createQuestions = (req, res) => {
  const dataReceived = req.body;

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

  fileLines.forEach((line) => {
    questionArray.push(new Question(line, gameId));
  });

  questionArray.forEach((question) => {
    let choices = "";
    if (question.questionType == "multipleChoice") {
      const choicesToAdd = question.choices;
      for (let i = 0; i < choicesToAdd.length; i++) {
        if (i == choicesToAdd.length - 1) {
          choices += choicesToAdd[i];
        } else {
          choices += choicesToAdd[i] + "/";
        }
      }
    }
    pool.query(
      "INSERT INTO Questions (id, question_type, theme, question, answer, points, choices, explanation, is_bonus, game_id, is_asked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        question.id,
        question.questionType,
        question.theme,
        question.question,
        question.answer,
        question.points,
        choices,
        question.explanation || "",
        Boolean(question.isBonus),
        question.gameId,
        question.isAsked,
      ],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send({
            error: "Error while creating the questions",
          });
          return;
        }
      }
    );
  });

  res.status(200).send({
    message: `${questionArray.length} question(s) created`,
  });
};
