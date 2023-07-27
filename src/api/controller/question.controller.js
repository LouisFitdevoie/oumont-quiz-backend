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
      "INSERT INTO Questions (id, question_type, theme, question, answer, points, choices, explanation, image_name, is_bonus, game_id, is_asked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        question.id,
        question.questionType,
        question.theme,
        question.question,
        question.answer,
        question.points,
        choices,
        question.explanation || "",
        question.imageName || "",
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

exports.getRandomThemes = (req, res) => {
  const dataReceived = req.body;
  const numberOfRandomThemes = 2;

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

  pool.query(
    "SELECT DISTINCT theme FROM Questions WHERE game_id = ?",
    [dataReceived.gameId],
    (error, results) => {
      if (error) {
        res.status(500).send({ error: "Error while getting the themes" });
        return;
      } else if (results.length == 0) {
        res.status(400).send({ error: "No questions found for this game" });
        return;
      } else {
        let randomThemes = [];

        for (let i = 0; i < numberOfRandomThemes; i++) {
          let randomIndex = Math.floor(Math.random() * results.length);
          //*****
          //TODO - Check if questions are available for this theme before pushing it
          //*****
          randomThemes.push(results[randomIndex].theme);
          results.splice(randomIndex, 1);
        }

        res.send({ message: "Themes randomly selected", themes: randomThemes });
      }
    }
  );
};

exports.getRandomQuestionByTheme = (req, res) => {
  const dataReceived = req.body;

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

exports.getAnswer = (req, res) => {
  const dataReceived = req.body;

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
