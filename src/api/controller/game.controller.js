const uuid = require("uuid");

const database = require("../../database.js");
const Game = require("../model/Game.js");
const pool = database.pool;

exports.createGame = (req, res) => {
  const dataReceived = req.body;
  const gameToCreate = new Game("", 0, false, 0, 0, 0, 0, [0, 0, 0]);

  if (dataReceived.hasOwnProperty("name") == false) {
    res.status(400).send({
      error: "Missing name",
    });
    return;
  }
  gameToCreate.name = dataReceived.name.trim();

  if (dataReceived.hasOwnProperty("qualifyingNumberQuestions") == false) {
    res.status(400).send({
      error: "Missing the number of qualifying questions",
    });
    return;
  }

  const qualifyingNumberQuestions = parseInt(
    dataReceived.qualifyingNumberQuestions
  );
  if (
    !isNaN(qualifyingNumberQuestions) &&
    Number.isInteger(qualifyingNumberQuestions)
  ) {
    gameToCreate.qualifyingNumberQuestions = qualifyingNumberQuestions;
  } else {
    res.status(400).send({
      error: "The number of qualifying questions must be an integer",
    });
    return;
  }

  if (dataReceived.hasOwnProperty("bonusQuestions") == false) {
    res.status(400).send({
      error: "Missing the bonus questions",
    });
    return;
  } else if (dataReceived.bonusQuestions == true) {
    gameToCreate.bonusQuestions = true;
    if (dataReceived.hasOwnProperty("bonusQuestionsNumber") == false) {
      res.status(400).send({
        error: "Missing the number of bonus questions",
      });
      return;
    }
    const bonusQuestionsNumber = parseInt(dataReceived.bonusQuestionsNumber);
    if (
      !isNaN(bonusQuestionsNumber) &&
      Number.isInteger(bonusQuestionsNumber)
    ) {
      gameToCreate.bonusQuestionsNumber = bonusQuestionsNumber;
    } else {
      res.status(400).send({
        error: "The number of bonus questions must be an integer",
      });
      return;
    }
  } else if (dataReceived.bonusQuestions == false) {
    gameToCreate.bonusQuestions = false;
    gameToCreate.bonusQuestionsNumber = 0;
  } else {
    res.status(400).send({
      error: "The bonus questions must be a boolean",
    });
    return;
  }

  if (dataReceived.hasOwnProperty("semiFinalsNumberQuestions") == false) {
    res.status(400).send({
      error: "Missing the number of semi-finals questions",
    });
    return;
  }
  const semiFinalsNumberQuestions = parseInt(
    dataReceived.semiFinalsNumberQuestions
  );
  if (
    !isNaN(semiFinalsNumberQuestions) &&
    Number.isInteger(semiFinalsNumberQuestions)
  ) {
    gameToCreate.semiFinalsNumberQuestions = semiFinalsNumberQuestions;
  } else {
    res.status(400).send({
      error: "The number of semi-finals questions must be an integer",
    });
    return;
  }

  if (dataReceived.hasOwnProperty("smallFinalNumberQuestions") == false) {
    res.status(400).send({
      error: "Missing the number of small final questions",
    });
    return;
  }
  const smallFinalNumberQuestions = parseInt(
    dataReceived.smallFinalNumberQuestions
  );
  if (
    !isNaN(smallFinalNumberQuestions) &&
    Number.isInteger(smallFinalNumberQuestions)
  ) {
    gameToCreate.smallFinalNumberQuestions = smallFinalNumberQuestions;
  } else {
    res.status(400).send({
      error: "The number of small final questions must be an integer",
    });
    return;
  }

  if (dataReceived.hasOwnProperty("finalNumberQuestions") == false) {
    res.status(400).send({
      error: "Missing the number of final questions",
    });
    return;
  }
  const finalNumberQuestions = parseInt(dataReceived.finalNumberQuestions);
  if (!isNaN(finalNumberQuestions) && Number.isInteger(finalNumberQuestions)) {
    gameToCreate.finalNumberQuestions = finalNumberQuestions;
  } else {
    res.status(400).send({
      error: "The number of final questions must be an integer",
    });
    return;
  }

  if (dataReceived.hasOwnProperty("timeToAnswerQCM") == false) {
    res.status(400).send({
      error: "Missing the time to answer MCQ questions",
    });
    return;
  }
  if (dataReceived.hasOwnProperty("timeToAnswerOpen") == false) {
    res.status(400).send({
      error: "Missing the time to answer open questions",
    });
    return;
  }
  if (dataReceived.hasOwnProperty("timeToAnswerEstimate") == false) {
    res.status(400).send({
      error: "Missing the time to answer estimate questions",
    });
    return;
  }
  const timeToAnswerQCM = parseInt(dataReceived.timeToAnswerQCM);
  const timeToAnswerOpen = parseInt(dataReceived.timeToAnswerOpen);
  const timeToAnswerEstimate = parseInt(dataReceived.timeToAnswerEstimate);
  if (
    !isNaN(timeToAnswerQCM) &&
    Number.isInteger(timeToAnswerQCM) &&
    !isNaN(timeToAnswerOpen) &&
    Number.isInteger(timeToAnswerOpen) &&
    !isNaN(timeToAnswerEstimate) &&
    Number.isInteger(timeToAnswerEstimate)
  ) {
    gameToCreate.timeToAnswer = `${timeToAnswerQCM},${timeToAnswerOpen},${timeToAnswerEstimate}`;
  } else {
    res.status(400).send({
      error: "The time to answer must be an integer",
    });
    return;
  }

  if (dataReceived.hasOwnProperty("personsPerGroup")) {
    const personsPerGroup = parseInt(dataReceived.personsPerGroup);
    if (!isNaN(personsPerGroup) && Number.isInteger(personsPerGroup)) {
      gameToCreate.personsPerGroup = personsPerGroup;
    } else {
      res.status(400).send({
        error: "The number of persons per group must be an integer",
      });
      return;
    }
  }

  pool.query(
    "INSERT INTO Games (id, name, qualifying_number_questions, bonus_questions, bonus_questions_number, semi_finals_number_questions, small_final_number_questions, final_number_questions, time_to_answer, persons_per_group, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      gameToCreate.id,
      gameToCreate.name,
      gameToCreate.qualifyingNumberQuestions,
      gameToCreate.bonusQuestions,
      gameToCreate.bonusQuestionsNumber,
      gameToCreate.semiFinalsNumberQuestions,
      gameToCreate.smallFinalNumberQuestions,
      gameToCreate.finalNumberQuestions,
      gameToCreate.timeToAnswer,
      gameToCreate.personsPerGroup,
      gameToCreate.created_at,
    ],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send({
          error: "Error while creating the game",
        });
        return;
      } else {
        res.status(201).send({
          message: "Game successfully created",
          gameId: gameToCreate.id,
        });
      }
    }
  );
};

exports.getGameById = (req, res) => {
  const gameId = req.params.id;

  if (!uuid.validate(gameId)) {
    res.status(400).send({
      error: "Invalid game id",
    });
    return;
  }

  pool.query("SELECT * FROM Games WHERE id = ?", [gameId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send({
        error: "Error while getting the game",
      });
      return;
    } else if (results.length == 0) {
      res.status(404).send({
        error: "Game not found",
      });
      return;
    } else {
      res.status(200).send({
        message: "Game successfully retrieved",
        game: {
          id: results[0].id,
          name: results[0].name,
          qualifyingNumberQuestions: results[0].qualifying_number_questions,
          bonusQuestions: Boolean(results[0].bonus_questions),
          bonusQuestionsNumber: results[0].bonus_questions_number,
          semiFinalsNumberQuestions: results[0].semi_finals_number_questions,
          smallFinalNumberQuestions: results[0].small_final_number_questions,
          finalNumberQuestions: results[0].final_number_questions,
          timeToAnswer: results[0].time_to_answer,
          personsPerGroup: results[0].persons_per_group,
          createdAt: results[0].created_at,
        },
      });
    }
  });
};

exports.getAllGames = (req, res) => {
  pool.query("SELECT id, name, created_at FROM Games", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send({
        error: "Error while getting the games",
      });
      return;
    } else if (results.length == 0) {
      res.status(404).send({
        error: "No game found",
      });
      return;
    } else {
      let resultArray = [];
      for (let i = 0; i < results.length; i++) {
        resultArray.push({
          gameId: results[i].id,
          name: results[i].name,
          createdAt: results[i].created_at,
        });
      }
      res.status(200).send({
        message: "Games successfully retrieved",
        games: resultArray,
      });
    }
  });
};
