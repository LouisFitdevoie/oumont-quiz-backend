const uuid = require("uuid");

class Game {
  constructor(
    name,
    qualifyingNumberQuestions,
    bonusQuestions,
    bonusQuestionsNumber,
    semiFinalsNumberQuestions,
    smallFinalNumberQuestions,
    finalNumberQuestions,
    timeToAnswer,
    personsPerGroup = 4
  ) {
    this.id = uuid.v4();
    this.name = name;
    this.qualifyingNumberQuestions = parseInt(qualifyingNumberQuestions);
    this.bonusQuestions = new Boolean(bonusQuestions);
    this.bonusQuestionsNumber = parseInt(bonusQuestionsNumber);
    this.semiFinalsNumberQuestions = parseInt(semiFinalsNumberQuestions);
    this.smallFinalNumberQuestions = parseInt(smallFinalNumberQuestions);
    this.finalNumberQuestions = parseInt(finalNumberQuestions);

    timeToAnswer.forEach((time) => {
      time = parseInt(time);
    });
    this.timeToAnswer = timeToAnswer;
    this.personsPerGroup = parseInt(personsPerGroup);
  }
}

module.exports = Game;
