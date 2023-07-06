/*
Read file
File name: groupNames.txt
File content: the names of the groups that participates at the event with one group name per line

.env file: var to contain the number of people per group, file path to the group names file, file path to the questions file

Function: read file
Function: create a group object for each group name with the following properties: uuid, name, number of points. Then add the group object to an array of groups
Function: select a random group from the list of groups, each time a group is selected, remove it from the list, if the list is empty then copy the content of the array of groups created by the function above

1) Create new game
2) Add questions and themes from a file to the game
3) Show questions and themes imported to the game for the user to verify if everything is ok
4) Save questions and themes to the db
5) Ask user how many questions will be asked for the qualifying round
6) Ask user which theme will be used for the questions that are asked to get a bonus power during the qualifying round (bonus power TBD)
7) Ask user how many questions will be asked during the winner bracket semi-final
8) Ask user how many questions will be asked during the winner bracket loser final
9) Ask user how many questions will be asked during the winner bracket final
10) Ask user when are the bonus questions asked (frequency or random?)
11) Ask user how long the groups have to answer the questions -> different type of questions have different time to answer (Default: MCQ -> 5s; Estimate -> 10s; Open question -> 10s; Bonus question -> 10s)
12) Ask user how many persons per group (default = 4)
13) Ask user to add the names of the groups that will participate at the event
13) Ask user to start the game
14) For each question, select a random group from the list of groups to select the theme for the question (each time a group is selected, remove it from the list so it doesn't get selected twice while all the groups don't have a theme selected). If all the questions for a theme have been asked, remove the theme from the list of themes so it doesn't get selected again
15) Select a random question from the theme selected by the group and remove it from the list of questions to not ask the same question twice
16) Let the groups answer the question
17) When the time is up, stop the timer and wait for the admin members to collect the answers THEN show the correct answer (and explication ?)
18) For the bonus questions, select a random group from the list to answer the question and gain a bonus power (randomly selected from the list of bonus powers and showed to the user before the group is selected)
19) Repeat steps 14 to 18 until the number of questions asked for the qualifying round is reached (excluded the bonus questions)
20) Break to let the user enter all the answers to the questions for each groups
21) For each group, show the question number and the correct answer, then let the user input if the answer was correct or not
22) Calculate the score for each group
23) When all the answers are entered, show the ranking of the groups with a graph (horizontal lines with the name of the group and the score and the line width proportional to the score)
24) The first 4 groups are qualified for the winner bracket
25) First semi final is between the first and the fourth group, second semi final is between the second and the third group, then loser final between the losers of the semi-finals and then final
----> Semi finals and finals format TBD -> same as the qualifying round or first to answer correctly gets the point?
When the game is over, show a podium with the 3 first groups and their score and below that the ranking of all the groups with their score ordered by score

*/
require("dotenv").config();
