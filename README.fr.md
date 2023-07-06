[![en](https://img.shields.io/badge/language-english-red)](./README.md)
[![fr](https://img.shields.io/badge/langue-français-brightgreen)](./README.fr.md)

#Oumont Quizz

## Description

Oumont Quizz est une application web permettant de créer des quizz qui seront joués par groupe dans une salle au cours d'évènements.

## Déroulement d'une partie

### Préparation des questions

Les questions qui seront posées au cours de la partie devront être contenues dans un fichier. Ce fichier est au format `csv` et doit contenir les colonnes suivantes :

- `questionType` : Le type de question (voir plus bas)
- `theme` : Le thème de la question
- `question` : La question
- `answer` : La réponse correcte à la question
- `points` : Le nombre de points que vaut la question
- `choices` : Les 4 choix possibles pour la question si c'est une question à choix multiples (séparés par des /)
- `explanation` : Une explication sur la réponse (optionnelle)
- `isBonus` : Indique si la question est une question bonus (0 = non, 1 = oui). Si une question est une question bonus, elle ne sera pas comptabilisée dans le score final, mais permettra de faire gagner des avantages au cours de la partie

Voici un exemple de fichier :

```csv
questionType;theme;question;answer;points;choices;explanation;isBonus
multipleChoice;Devinette;Quelle est la couleur du cheval blanc d'Henri IV ?;blanc;1;blanc/noir/rouge/vert;0
open;Géographie;Quelle est la capitale de la Belgique ?;Bruxelles;1;;C'est la capitale de la Belgique;0
estimate;Espace;A combien de kilomètres se trouve la lune ?;384400;1;;La lune se trouve à 384400 km de la terre;0
multipleChoice;Culture village;Quelle est la nourriture préférée de Choco?;Les lasagnes;0;Les lasagnes/Les croquettes/Le chocolat/Les pommes;;Choco adore les lasagnes;1
```

Plusieurs types de questions sont disponibles :

| Type de question | Description                | Spécificités                                                                                                                                 |
| ---------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `multipleChoice` | Question à choix multiples | Les choix possibles sont séparés par des `/` et doivent être spécifiés dans la colonne choices. Il peut y avoir entre 2 et 4 choix possibles |
| `open`           | Question ouverte           | Rien ne doit être indiqué dans la colonne choices, ce ne sera pas pris en compte lors de l'enregistrement des questions                      |
| `estimate`       | Question d'estimation      | Rien ne doit être indiqué dans la colonne choices, ce ne sera pas pris en compte lors de l'enregistrement des questions                      |

### Initialisation de la partie

Quand l'animateur créera une nouvelle partie, il devra suivre plusieurs étapes :

1. Saisir le nom de la partie
2. Importer le fichier contenant les questions (voir _Préparation des questions_) et vérifier que les questions ont bien été importées. Si ce n'est pas le cas, vérifier que le fichier est bien au format `csv`, qu'il contient les colonnes requises et qu'il suit la mise en forme décrite plus haut
3. Saisir le nombre de questions qui seront posées au cours de l'étape de qualification
4. Si l'animateur veut que des questions bonus soit posées au cours de la partie, il devra cliquer sur le bouton `Oui` et saisir le nombre de questions bonus qu'il souhaite poser. L'ordinateur caclulera ensuite à quelle fréquence les questions bonus seront posées au cours de la partie. Si l'animateur ne souhaite pas poser de questions bonus, il devra cliquer sur le bouton `Non`
5. Saisir le nombre de questions qui seront posées pendant les demi-finales
6. Saisir le nombre de questions qui seront posées pendant la petite finale qui opposera les 2 groupes ayant obtenu le moins de points pendant les demi-finales pour déterminer la 3ème et 4ème place
7. Saisir le nombre de questions qui seront posées pendant la finale qui opposera les 2 groupes ayant obtenu le plus de points pendant les demi-finales pour déterminer la 1ère et 2ème place
8. Saisir le temps de réponse maximum pour chaque type de question (en secondes)
9. Saisir le nombre de personnes qui devront composer un groupe (par défaut, 4 personnes)
10. Saisir les noms des groupes qui participeront à la partie

Une fois que toutes ces étapes sont terminées, l'animateur peut cliquer sur le bouton `Commencer la partie` pour lancer la partie et démarrer l'étape de qualification.

### Etape de qualification

A chaque question, un groupe sera tiré au hasard par l'ordinateur pour choisir le thème de la question qui va être posée. Quand un groupe est sélectionné, il ne pourra plus être sélectionné à nouveau pour choisir un thème tant que tous les groupes n'auront pas été sélectionnés une fois.
Une fois que le groupe aura sélectionné le thème, une question sera choisie au hasard et sera posée à l'ensemble des groupes qui répondront sur une feuille de réponse qui sera récupérée par l'animateur entre chaque question avant que la réponse ne soit donnée.
Pour les questions bonus, si l'animateur a choisi d'en inclure dans la partie, un groupe sera sélectionné au hasard pour y répondre. Si le groupe répond correctement, il gagnera un avantage (voir _Avantages_). Si le groupe répond incorrectement, il ne se passera rien.
Dans tous les cas, chaque question posée ne pourra plus être posée à nouveau au cours de la partie.
Une fois que le nombre de questions défini par l'animateur pour l'étape de qualification a été atteint (sans compter les questions bonus), l'étape de qualification est terminée.

### Calcul des points pour l'étape de qualification

A la suite de l'étape de qualification, l'animateur doit saisir les réponses de chaque groupe dans l'application.
Pour les questions à choix multiples et les questions ouvertes, il devra simplement spécifier si le groupe a répondu correctement ou non.
Pour les questions d'estimation, il devra saisir la réponse donnée par le groupe et l'ordinateur calculera le nombre de points que le groupe a obtenu en fonction de la réponse donnée et de la réponse correcte.
Une fois que toutes les réponses ont été saisies, l'ordinateur calcule le score de chaque groupe et affiche le classement des groupes en fonction de leur score sous la forme d'un diagramme en bâtonnets horizontal.
Les 4 groupes ayant obtenu le plus de points sont qualifiés pour les demi-finales.

### Etape finale

## Calcul des points pour l'étape de qualification

Les groupes répondent sur une feuille de réponse qui sera récupérée par l'animateur entre chaque question avant que la réponse ne soit donnée.
A la fin de l'étape de qualification, une pause est faite pour que l'animateur puisse saisir les réponses des groupes dans l'application.

##
