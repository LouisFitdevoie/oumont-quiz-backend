const uuid = require("uuid");

class Group {
  constructor(name, gameId, points, bonus = [], isQualified = false) {
    this.id = uuid.v4();
    this.name = name;
    this.gameId = gameId;
    this.points = parseInt(points);
    this.bonus = bonus;
    this.isQualified = new Boolean(isQualified);
  }
}

module.exports = Group;
