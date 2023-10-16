const uuid = require("uuid");

const database = require("../../database.js");
const Game = require("../model/Game.js");
const pool = database.pool;

//Function to create a game
exports.createGame = (req, res) => {
  const dataReceived = req.body;
  const gameToCreate = new Game("", [0, 0, 0]);

  //Verify if the request is valid
  if (dataReceived.hasOwnProperty("name") == false) {
    res.status(400).send({
      error: "Missing name",
    });
    return;
  }
  gameToCreate.name = dataReceived.name.trim();

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

  //Create the game in the DB
  pool.query(
    "INSERT INTO Games (id, name, time_to_answer, persons_per_group, created_at) VALUES (?, ?, ?, ?, ?)",
    [
      gameToCreate.id,
      gameToCreate.name,
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

//Function to get a game by its id
exports.getGameById = (req, res) => {
  const gameId = req.params.id;

  //Verify if the request is valid
  if (!uuid.validate(gameId)) {
    res.status(400).send({
      error: "Invalid game id",
    });
    return;
  }

  //Get the game from the DB
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
          timeToAnswer: results[0].time_to_answer,
          personsPerGroup: results[0].persons_per_group,
          createdAt: results[0].created_at,
        },
      });
    }
  });
};

//Function to get all the games
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

//Function to delete a game by its id
exports.deleteGameById = (req, res) => {
  const gameId = req.params.gameId;
  console.log("DELETING GAME FOR ID: " + gameId);

  if (gameId == "") {
    res.status(400).send({ error: "Game id cannot be empty" });
    return;
  } else if (!uuid.validate(gameId)) {
    res.status(400).send({ error: "Game id is not valid" });
    return;
  }

  pool.query("DELETE FROM Games WHERE id = ?", [gameId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send({
        error: "Error while deleting the game",
      });
      return;
    } else if (results.affectedRows == 0) {
      res.status(404).send({
        error: "Game not found",
      });
      return;
    } else {
      res.status(200).send({
        message: "Game successfully deleted",
      });
    }
  });
};
