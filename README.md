[![en](https://img.shields.io/badge/language-english-brightgreen)](./README.md)
[![fr](https://img.shields.io/badge/langue-français-red)](./README.fr.md)

# Oumont Quiz

## Description

Oumont Quiz is a web application for creating quizes to be played by groups in a room during events.

## Installation of the application

### Prerequisites

To be able to install and use the application, you must have installed on your computer:

- Docker
- NPM
- Node.js

### Installation

To install the application, you must follow the following steps:

1. Download the source code of the frontend application to your computer
2. Download the source code of the backend application to your computer
3. Open a terminal and go to the folder containing the source code of the frontend application
4. Run the command `npm install` to install the dependencies of the frontend application
5. Open a terminal and go to the folder containing the source code of the backend application
6. Run the command `npm install` to install the dependencies of the backend application
7. Run the command `docker-compose up` to create the container containing the database on docker
8. Open the file [generates_tables.sql](./generate_tables.sql) and insert the passwords of the users that will be created in the database (lines 127, 130, 133)
9. Open the container in docker, connect to the database and copy-paste the SQL code contained in the file `generate_tables.sql` in the container to create the database, tables and users necessary for the application to work
10. Create a `.env` file in the folder containing the source code of the backend application and insert the following environment variables:

```env
DB_PASSWORD_PROD=SAME_PASSWORD_AS_IN_GENERATE_TABLES.SQL
DB_PASSWORD_TEST=SAME_PASSWORD_AS_IN_GENERATE_TABLES.SQL
DB_PASSWORD_DEV=SAME_PASSWORD_AS_IN_GENERATE_TABLES.SQL
DB_USER_PROD=oumont_quiz // Do not modify
DB_USER_TEST=oumont_quiz_test // Do not modify
DB_USER_DEV=oumont_quiz_dev // Do not modify
DATABASE_PORT=3306 // Port on which the database will be accessible (Do not modify)
NODE_ENV=development // Do not modify
DATABASE_PROD=oumont_quiz // Do not modify
DATABASE_TESTING=oumont_quiz_test // Do not modify
DATABASE_DEV=oumont_quiz_dev // Do not modify
DATABASE_HOST=localhost // Host on which the database will be accessible
API_VERSION=v1  // API version (Do not modify)
API_PORT=8000 // Port on which the backend application will be accessible
API_HOST=localhost
TEST_FILES_TOTAL=3 // Do not modify
TEST_FILES_COMPLETED=0 // Do not modify
NOT_DECADE_THEMES_WEIGHT=2 // Weight of themes that are not decades
```

12. Open a terminal and go to the folder containing the source code of the backend application
13. Run the command `npm start` to start the backend application
14. Open a terminal and go to the folder containing the source code of the frontend application
15. Run the command `npm start` to start the frontend application
16. Open a browser and go to the address `http://localhost:3000` to access the application

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
3. Enter the maximum response time for each type of question (in seconds).
4. Enter the number of people required to make up a group (4 by default).
5. Enter the names of the groups who will take part in the game.

Once all these steps have been completed, the host can click on the `Start Game` button to launch the game and start the qualifying round. Once the game has started, the host won't be able to modify the game settings. He will only be able to pause the game or end it.

### Game

At the start of the game, a group is randomly drawn by the computer to choose a theme from those displayed on the screen. Once the theme has been chosen, the computer randomly chooses a question from the questions not yet asked in that theme, and asks it to all the groups, who answer on an answer sheet which they must drop into an urn at the end of each question before the answer is displayed.
At the end of the three questions, the choice is between moving on to a new theme, taking a break or ending the game. If you choose to move on to a new theme, three questions will be asked on the theme selected by the group before another group is selected to choose a new theme. If a break is chosen, the user must enter the answers given by the groups in order to calculate the scores. When they want to resume the game, an intermediate ranking will be displayed on the screen before the game is resumed. If you choose to end the game, you'll have to enter the answers given by the groups in order to calculate the scores. Once the answers have been entered, the computer calculates the score for each group and displays the group rankings in the form of a horizontal bar chart.

### Points calculation

When the user wants to enter the answers given by the groups, he will have to enter the answers given by each group for each question.
Once all the answers have been entered, the computer will calculate the points of every group and display the ranking of the qualifying round in the form of a horizontal bar chart.
