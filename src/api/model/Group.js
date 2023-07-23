const uuid = require("uuid");

class Group {
  constructor(name, gameId, points, bonus = []) {
    this.id = uuid.v4();
    this.name = name;
    this.gameId = gameId;
    this.points = parseInt(points);
    this.bonus = bonus; // For the DB, will need to be a string like "1,2,3"
    this.isQualified = false;
  }
}

module.exports = Group;
