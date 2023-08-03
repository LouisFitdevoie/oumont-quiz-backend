const uuid = require("uuid");

class Game {
  constructor(name, timeToAnswer, personsPerGroup = 4) {
    this.id = uuid.v4();
    this.name = name;

    timeToAnswer.forEach((time) => {
      time = parseInt(time);
    });
    this.timeToAnswer = timeToAnswer; // For the DB, it will be a string like "10,15,20"
    this.personsPerGroup = parseInt(personsPerGroup);
    this.created_at = new Date();
  }
}

module.exports = Game;
