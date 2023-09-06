require("dotenv").config();
const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");

const gameController = require("./api/controller/game.controller.js");
const groupController = require("./api/controller/group.controller.js");
const questionController = require("./api/controller/question.controller.js");

exports.startServer = () => {
  const app = express();

  const databasePort = process.env.DATABASE_PORT || 3306;

  let db = {
    database: "",
    user: "",
    password: "",
  };
  if (process.env.NODE_ENV == "production") {
    db.database = process.env.DATABASE_PROD;
    db.user = process.env.DB_USER_PROD;
    db.password = process.env.DB_PASSWORD_PROD;
  } else if (process.env.NODE_ENV == "development") {
    db.database = process.env.DATABASE_DEV;
    db.user = process.env.DB_USER_DEV;
    db.password = process.env.DB_PASSWORD_DEV;
  } else if (process.env.NODE_ENV == "testing") {
    db.database = process.env.DATABASE_TESTING;
    db.user = process.env.DB_USER_TEST;
    db.password = process.env.DB_PASSWORD_TEST;
  }
  const baseURL = `/api/${process.env.API_VERSION}`;

  const db_connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: db.user,
    password: db.password,
    database: db.database,
    port: databasePort,
  });

  db_connection.connect(function (err) {
    if (err) throw err;
    console.log(`Connected to the database on port ${databasePort}!`);
  });

  const apiPort = process.env.API_PORT || 8000;

  app.listen(apiPort, () => {
    console.log(`Server started on port ${apiPort}`);
  });

  app.use(express.json());
  app.use(cors({ origin: "http://localhost:3000" }));

  //***** GAMES *****//

  app.get(baseURL + "/", (req, res) => {
    res.json({
      message: "Hello API World!",
      status: 200,
    });
  });

  app.post(baseURL + "/game", (req, res) => {
    gameController.createGame(req, res);
  });

  app.get(baseURL + "/game/:id", (req, res) => {
    gameController.getGameById(req, res);
  });

  app.get(baseURL + "/games", (req, res) => {
    gameController.getAllGames(req, res);
  });

  app.delete(baseURL + "/game/:gameId", (req, res) => {
    gameController.deleteGameById(req, res);
  });

  //***** GROUPS *****//

  app.post(baseURL + "/group", (req, res) => {
    groupController.createGroup(req, res);
  });

  app.get(baseURL + "/group", (req, res) => {
    groupController.getAllGroupsForGame(req, res);
  });

  app.put(baseURL + "/group", (req, res) => {
    groupController.updatePointsForGroup(req, res);
  });

  app.put(baseURL + "/group/updateQualifiedStatus", (req, res) => {
    groupController.updateQualifiedStatusForGroup(req, res);
  });

  app.put(baseURL + "/group/updateName", (req, res) => {
    groupController.updateGroupName(req, res);
  });

  app.delete(baseURL + "/group", (req, res) => {
    groupController.deleteGroup(req, res);
  });

  //***** QUESTIONS *****//

  app.post(baseURL + "/questions", (req, res) => {
    questionController.createQuestions(req, res);
  });

  app.get(baseURL + "/randomThemes", (req, res) => {
    questionController.getRandomThemes(req, res);
  });

  app.get(baseURL + "/randomQuestion", (req, res) => {
    questionController.getRandomQuestionByTheme(req, res);
  });

  app.get(baseURL + "/answer", (req, res) => {
    questionController.getAnswer(req, res);
  });

  app.get(baseURL + "/questionImage", (req, res) => {
    questionController.getQuestionImage(req, res);
  });

  app.get(baseURL + "/question/:questionId", (req, res) => {
    questionController.getQuestionById(req, res);
  });

  app.get(baseURL + "/questions", (req, res) => {
    questionController.getAllQuestions(req, res);
  });

  app.delete(baseURL + "/questions/:gameId", (req, res) => {
    questionController.deleteQuestionsForGameId(req, res);
  });
};
