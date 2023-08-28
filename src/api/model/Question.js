const uuid = require("uuid");

class Question {
  // Create a question from a line of the question file
  constructor(fileLine, gameId) {
    const line = fileLine.split(";");
    this.id = uuid.v4();
    this.questionType = line[0];
    this.theme = line[1];
    this.question = decodeUnicode(line[2]);
    this.answer = decodeUnicode(line[3]);
    this.points = parseInt(line[4]);
    this.choices = decodeUnicode(line[5]); // For the DB, it will be a string like "1/2/3/4"
    this.explanation = decodeUnicode(line[6]);
    this.imageName = line[7];
    this.isBonus = new Boolean(parseInt(line[8]));
    this.gameId = gameId;
    this.isAsked = false;
  }
}

const decodeUnicode = (text) => {
  return text.replace(/\\u([\dA-F]{4})/gi, (match, grp) =>
    String.fromCharCode(parseInt(grp, 16))
  );
};

module.exports = Question;
