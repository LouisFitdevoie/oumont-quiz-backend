const uuid = require("uuid");

const database = require("../../database.js");
const Group = require("../model/Group.js");
const pool = database.pool;

//Function to create a group
exports.createGroup = (req, res) => {
  const dataReceived = req.body;
  const groupToCreate = new Group("", "", 0, []);

  //Verify if the request is valid
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
    //Verify if the game id exists
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
          //Create the group
          pool.query(
            "INSERT INTO `Groups` (id, name, game_id, points, bonus, is_qualified, ranking) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              groupToCreate.id,
              groupToCreate.name,
              groupToCreate.gameId,
              groupToCreate.points,
              "",
              false,
              0,
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

//Function to get all groups for a game
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
    //Getting all groups for a game
    pool.query(
      "SELECT * FROM `Groups` WHERE game_id = ?",
      [gameId],
      (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
          res.status(200).send({
            message: "No groups found for this game",
            groups: [],
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
              ranking: result[i].ranking,
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

//Function to update the points for a group
exports.updatePointsForGroup = (req, res) => {
  const dataReceived = req.body;
  //Verify if the request is valid
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
      //Getting the points for the group
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
            //Calculating the new points and updating it in the DB
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

//Function to update the isQualified status for a group --> this function is not used in the app for now
exports.updateQualifiedStatusForGroup = (req, res) => {
  const dataReceived = req.body;

  //Verify if the request is valid
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

  if (dataReceived.hasOwnProperty("ranking") == false) {
    res.status(400).send({
      error: "Missing ranking",
    });
    return;
  } else if (isNaN(dataReceived.ranking)) {
    res.status(400).send({
      error: "Ranking must be a number",
    });
    return;
  } else if (dataReceived.ranking < 1) {
    res.status(400).send({
      error: "Ranking must be greater than 0",
    });
    return;
  }

  if (dataReceived.ranking > 0 && dataReceived.ranking < 5) {
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
          "UPDATE `Groups` SET is_qualified = ?, points = ?, ranking = ? WHERE id = ?",
          [
            dataReceived.isQualified,
            0,
            dataReceived.ranking,
            dataReceived.groupId,
          ],
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
  } else {
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
          "UPDATE `Groups` SET is_qualified = ?, ranking = ? WHERE id = ?",
          [
            dataReceived.isQualified,
            dataReceived.ranking,
            dataReceived.groupId,
          ],
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
  }
};

//Function to update the name of a group
exports.updateGroupName = (req, res) => {
  const dataReceived = req.body;

  //Verify if the request is valid
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

  //Verify if the group exists
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
      //Update the group name
      pool.query(
        "UPDATE `Groups` SET name = ? WHERE id = ?",
        [dataReceived.name, dataReceived.groupId],
        (err, result) => {
          if (err) {
            res.status(500).send({
              error: "Error while updating the group name",
            });
            return;
          }
          res.status(200).send({
            message: "Group name successfully updated",
          });
        }
      );
    }
  );
};

//Function to delete a group
exports.deleteGroup = (req, res) => {
  const dataReceived = req.body;

  //Verify if the request is valid
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

  //Verify if the group exists
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
      //Delete the group
      pool.query(
        "DELETE FROM `Groups` WHERE id = ?",
        [dataReceived.groupId],
        (err, result) => {
          if (err) {
            res.status(500).send({
              error: "Error while deleting the group",
            });
            return;
          }
          res.status(200).send({
            message: "Group successfully deleted",
          });
        }
      );
    }
  );
};
