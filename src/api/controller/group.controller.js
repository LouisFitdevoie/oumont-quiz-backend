const uuid = require("uuid");

const database = require("../../database.js");
const Group = require("../model/Group.js");
const pool = database.pool;

exports.createGroup = (req, res) => {
  const dataReceived = req.body;
  const groupToCreate = new Group("", "", 0, []);

  if (dataReceived.hasOwnProperty("name") == false) {
    res.status(400).send({
      error: "Missing group name",
    });
    return;
  } else if (dataReceived.name == "") {
    res.status(400).send({
      error: "Group name cannot be empty",
    });
    return;
  }
  groupToCreate.name = dataReceived.name.trim();

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
  } else {
    pool.query(
      "SELECT id FROM Games WHERE id = ?",
      [dataReceived.gameId],
      (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
          res.status(400).send({
            error: "Game id does not exist",
          });
          return;
        } else {
          groupToCreate.gameId = dataReceived.gameId;
          pool.query(
            "INSERT INTO `Groups` (id, name, game_id, points, bonus, is_qualified) VALUES (?, ?, ?, ?, ?, ?)",
            [
              groupToCreate.id,
              groupToCreate.name,
              groupToCreate.gameId,
              groupToCreate.points,
              "",
              false,
            ],
            (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send({
                  error: "Error while creating the group",
                });
                return;
              } else {
                res.status(201).send({
                  message: "Group successfully created",
                });
              }
            }
          );
        }
      }
    );
  }
};

exports.getAllGroupsForGame = (req, res) => {
  if (req.query.hasOwnProperty("gameId") == false) {
    res.status(400).send({
      error: "Missing game id",
    });
    return;
  }

  const gameId = req.query.gameId;
  if (gameId == "") {
    res.status(400).send({
      error: "Game id cannot be empty",
    });
    return;
  } else if (!uuid.validate(gameId)) {
    res.status(400).send({
      error: "Game id is not valid",
    });
    return;
  } else {
    pool.query(
      "SELECT * FROM `Groups` WHERE game_id = ?",
      [gameId],
      (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
          res.status(404).send({
            error: "No groups found for this game",
          });
          return;
        } else {
          let resultArray = [];
          for (let i = 0; i < result.length; i++) {
            resultArray.push({
              id: result[i].id,
              name: result[i].name,
              gameId: result[i].game_id,
              points: result[i].points,
              bonus: result[i].bonus,
              isQualified: Boolean(result[i].is_qualified),
            });
          }
          res.status(200).send({
            message: "Groups successfully retrieved",
            groups: resultArray,
          });
        }
      }
    );
  }
};

exports.updatePointsForGroup = (req, res) => {
  const dataReceived = req.body;
  if (dataReceived.hasOwnProperty("groupId") == false) {
    res.status(400).send({
      error: "Missing group id",
    });
    return;
  } else if (dataReceived.groupId == "") {
    res.status(400).send({
      error: "Group id cannot be empty",
    });
    return;
  } else if (!uuid.validate(dataReceived.groupId)) {
    res.status(400).send({
      error: "Group id is not valid",
    });
    return;
  }

  if (dataReceived.hasOwnProperty("points") == false) {
    res.status(400).send({
      error: "Missing points",
    });
    return;
  } else {
    const points = parseInt(dataReceived.points);
    if (isNaN(points)) {
      res.status(400).send({
        error: "Points must be a number",
      });
      return;
    } else {
      let pointsUpdated = points;
      pool.query(
        "SELECT points FROM `Groups` WHERE id = ?",
        [dataReceived.groupId],
        (err, result) => {
          if (err) throw err;
          if (result.length == 0) {
            res.status(404).send({
              error: "Group not found",
            });
            return;
          } else {
            pointsUpdated += parseInt(result[0].points);
            pool.query(
              "UPDATE `Groups` SET points = ? WHERE id = ?",
              [pointsUpdated, dataReceived.groupId],
              (err, result) => {
                if (err) throw err;
                res.status(200).send({
                  message: "Points successfully updated",
                });
              }
            );
          }
        }
      );
    }
  }
};

exports.updateQualifiedStatusForGroup = (req, res) => {
  const dataReceived = req.body;

  if (dataReceived.hasOwnProperty("groupId") == false) {
    res.status(400).send({
      error: "Missing group id",
    });
    return;
  } else if (dataReceived.groupId == "") {
    res.status(400).send({
      error: "Group id cannot be empty",
    });
    return;
  } else if (!uuid.validate(dataReceived.groupId)) {
    res.status(400).send({
      error: "Group id is not valid",
    });
    return;
  }

  if (dataReceived.hasOwnProperty("isQualified") == false) {
    res.status(400).send({
      error: "Missing qualified status",
    });
    return;
  } else if (typeof dataReceived.isQualified != "boolean") {
    res.status(400).send({
      error: "Qualified status must be a boolean",
    });
    return;
  }

  pool.query(
    "SELECT id FROM `Groups` WHERE id = ?",
    [dataReceived.groupId],
    (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.status(404).send({
          error: "Group not found",
        });
        return;
      }
      pool.query(
        "UPDATE `Groups` SET is_qualified = ?, points = ? WHERE id = ?",
        [dataReceived.isQualified, 0, dataReceived.groupId],
        (err, result) => {
          if (err) {
            res.status(500).send({
              error: "Error while updating the qualified status",
            });
            return;
          }
          res.status(200).send({
            message: "Qualified status successfully updated",
          });
        }
      );
    }
  );
};
