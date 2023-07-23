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

// FOR LATER :
// Mettre à jour les points après les résultats des finales pour déterminer le classement en récupérant les points du 5e groupe et en ajoutant des points aaux 4 groupes participants pour être placés correctement dans le classement final

module.exports = Group;
