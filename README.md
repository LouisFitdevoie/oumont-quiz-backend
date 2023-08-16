[![en](https://img.shields.io/badge/language-english-brightgreen)](./README.md)
[![fr](https://img.shields.io/badge/langue-français-red)](./README.fr.md)

# Oumont Quiz

## Description

Oumont Quiz is a web application for creating quizes to be played by groups in a room during events.

## Game flow

### Questions preparation

The questions to be asked during the game must be contained in a file. This file is in `csv` format and must contain the following columns:

- `questionType`: The question type (see below)
- `theme`: The topic of the question
- `question`: The question
- `answer`: The correct answer to the question
- `points`: The number of points the question is worth
- `choices`: The 4 possible choices for the question if it's a multiple choice question (separated by `/`)
- `explanation`: An explanation of the answer (optional)
- `imageName`: The name of the image to be displayed with the question (optional). The image should be in the `public/images` folder.
- `isBonus`: Indicates whether the question is a bonus question (0 = no, 1 = yes). If a question is a bonus question, it will not be counted in the final score, but the group will earn advantages during the game.

Here's an example of a valid file:

```csv
questionType;theme;question;answer;points;choices;explanation;imageName;isBonus
multipleChoice;Riddle;What's the color of Henri IV's white horse?;white;1;white/black/red/green;;;0
open;Geography;What's the capital of Belgium?;Brussels;1;;That's Belgium's capital;;0
estimate;Space;How many kilometers separate the Earth from the Moon?;384400;1;;Moon is 384400km away from Earth;;0
multipleChoice;Village culture;What's Choco's favorite food?;Lasagne;0;Lasagne/Croquettes/Chocolate/Apples;;Choco really likes lasagne;;1
open;Music;What's the name of this singer ?;Rick Astley;1;;It's Rick Astley;example.jpg;0
```

Several types of questions are available:

| Question type    | Description              | Spécificités                                                                                                               |
| ---------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `multipleChoice` | Multiple choice question | The possible answers are separated by `/` and must be specified in the choices column.There may be 2 to 4 possible choices |
| `open`           | Open question            | The choices column must remain empty, the content won't be taken into account while saving the questions                   |
| `estimate`       | Estimate question        | The choices column must remain empty, the content won't be taken into account while saving the questions                   |

### Game initialization

When the host creates a new game, he or she must follow several steps:

1. Choose a name for the game
2. Import the question file (see _Questions preparation_) and check that the questions have been imported. If not, check that the file is in `csv` format, contains the required columns and follows the formatting described above.
3. Enter the number of questions to be asked during the qualifying round.
4. If the host wants bonus questions to be asked during the game, he/she should click on the `Yes` button and enter the number of bonus questions he/she wants to ask. The computer will then calculate how often bonus questions will be asked during the game. If you do not wish to ask bonus questions, click on the `No` button.
5. Enter the number of questions to be asked during the semi-finals.
6. Enter the number of questions to be asked during the small final, which will determine the 3rd place.
7. Enter the number of questions to be asked during the final, which will determine the 1st and 2nd place.
8. Enter the maximum response time for each type of question (in seconds).
9. Enter the number of people required to make up a group (4 by default).
10. Enter the names of the groups who will take part in the game.

Once all these steps have been completed, the host can click on the `Start Game` button to launch the game and start the qualifying round.

### Game

At the start of the game, a group is randomly drawn by the computer to choose a theme from those displayed on the screen. Once the theme has been chosen, the computer randomly chooses a question from the questions not yet asked in that theme, and asks it to all the groups, who answer on an answer sheet which they must drop into an urn at the end of each question before the answer is displayed.
At the end of the three questions, the choice is between moving on to a new theme, taking a break or ending the game. If you choose to move on to a new theme, three questions will be asked on the theme selected by the group before another group is selected to choose a new theme. If a break is chosen, the user must enter the answers given by the groups in order to calculate the scores. When they want to resume the game, an intermediate ranking will be displayed on the screen before the game is resumed. If you choose to end the game, you'll have to enter the answers given by the groups in order to calculate the scores. Once the answers have been entered, the computer calculates the score for each group and displays the group rankings in the form of a horizontal bar chart.

### Points calculation

When the user wants to enter the answers given by the groups, he will have to enter the answers given by each group for each question.
For the multiple choice questions and the open questions, the host only has to specify if the answer is correct or not.
For the estimate questions, the host has to enter the answer given by the group and the computer will calculate the points earned by the group depending on the answer given and the correct answer.
Once all the answers have been entered, the computer will calculate the points of every group and display the ranking of the qualifying round in the form of a horizontal bar chart.

## Advantages

The advantages will be developed in the future. For now, they are not available.
The advantages are bonuses that the groups can earn by correctly answering a bonus question.
The available advantages are the following:

| Advantage | Description                                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `joker1`  | The group can earn twice the amount of points for the next question by answering correctly. If they answer incorrectly, they won't lose or win any point. |
| `joker2`  | The group can remove 1 point to another group.                                                                                                            |
| `joker3`  | The group can answer twice to a question. Only one correct answer will be accepted.                                                                       |

Other advantages may be added in the future.
