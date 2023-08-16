[![en](https://img.shields.io/badge/language-english-red)](./README.md)
[![fr](https://img.shields.io/badge/langue-français-brightgreen)](./README.fr.md)

# Oumont Quiz

## Description

Oumont Quiz est une application web permettant de créer des quiz qui seront joués par groupe dans une salle au cours d'évènements.

## Déroulement d'une partie

### Préparation des questions

Les questions qui seront posées au cours de la partie devront être contenues dans un fichier. Ce fichier est au format `csv` et doit contenir les colonnes suivantes :

- `questionType` : Le type de question (voir plus bas)
- `theme` : Le thème de la question
- `question` : La question
- `answer` : La réponse correcte à la question
- `points` : Le nombre de points que vaut la question
- `choices` : Les 4 choix possibles pour la question si c'est une question à choix multiples (séparés par des `/`)
- `explanation` : Une explication sur la réponse (optionnelle)
- `imageName` : Le nom de l'image à afficher avec la question (optionnel). L'image doit se trouver dans le dossier `public/images`.
- `isBonus` : Indique si la question est une question bonus (0 = non, 1 = oui). Si une question est une question bonus, elle ne sera pas comptabilisée dans le score final, mais permettra de faire gagner des avantages au cours de la partie

Voici un exemple de fichier valide :

```csv
questionType;theme;question;answer;points;choices;explanation;isBonus
multipleChoice;Devinette;Quelle est la couleur du cheval blanc d'Henri IV ?;blanc;1;blanc/noir/rouge/vert;;;0
open;Géographie;Quelle est la capitale de la Belgique ?;Bruxelles;1;;C'est la capitale de la Belgique;;0
estimate;Espace;A combien de kilomètres de la Terre se trouve la Lune ?;384400;1;;La lune se trouve à 384400 km de la terre;;0
multipleChoice;Culture village;Quelle est la nourriture préférée de Choco?;Les lasagnes;0;Les lasagnes/Les croquettes/Le chocolat/Les pommes;;Choco adore les lasagnes;;1
open;Musique;Quel est le nom de ce chanteur ?;Rick Astley;1;;C'est Rick Astley;example.jpg;
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

### Partie

Au début de la partie, un groupe est tiré au hasard par l'ordinateur pour choisir un thème parmi ceux affichés à l'écran. Une fois que le thème a été choisi, l'ordinateur choisit une question au hasard parmi les questions qui n'ont pas encore été posées dans ce thème et la pose à l'ensemble des groupes qui répondront sur une feuille de réponse qu'ils devront déposer dans une urne à la fin de chaque question avant que la réponse ne soit affichée.
A la fin des trois questions, on devra choisir de soit passer à un nouveau thème, soit faire une pause, soit terminer la partie. Si on choisit de passer à un nouvbeau thème, trois questions seront posées sur le thème sélectionné par le groupe avant qu'un autre groupe ne soit sélectionné pour choisir un nouveau thème. Si on choisit de faire une pause, l'utilisateur devra rentrer les réponses données par les groupes afin de pouvoir calculer les scores. Au moment où ils voudront reprendre la partie, un classement intermédiaire s'affichera à l'écran avant de reprendre la partie. Si on choisit de terminer la partie, l'utilisateur devra rentrer les réponses données par les groupes afin de pouvoir calculer les scores. Une fois que les réponses ont été saisies, l'ordinateur calcule le score de chaque groupe et affiche le classement des groupes sous la forme d'un diagramme en bâtonnets horizontal.

### Calcul des points

Quand l'utilisateur voudra saisir les réponses données par les groupes, il devra saisir les réponses données par chaque groupe pour chaque question.
Pour les questions à choix multiples et les questions ouvertes, il devra simplement spécifier si le groupe a répondu correctement ou non.
Pour les questions d'estimation, il devra saisir la réponse donnée par le groupe et l'ordinateur calculera le nombre de points que le groupe a obtenu en fonction de la réponse donnée et de la réponse correcte.
Une fois que toutes les réponses ont été saisies, l'ordinateur calcule le score de chaque groupe et affiche le classement des groupes sous la forme d'un diagramme en bâtonnets horizontal.

## Avantages

Les avantages seront développés dans un second temps. Pour le moment, ils ne sont pas disponibles.
Les avantages sont des bonus que les groupes peuvent obtenir en répondant correctement à une question bonus.
Les avantages disponibles sont les suivants :

| Avantage  | Description                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `joker1`  | Le groupe peut choisir de gagner deux fois le nombre de points qu'ils peuvent obtenir à la prochaine question en répondant correctement. S'ils répondent mal, ils ne perdent pas et ne gagnent pas de points. |
| `joker2`  | Le groupe peut choisir de retirer 1 point à une autre équipe.                                                                                                                                                 |
| `joker3`  | Le groupe peut décider de répondre 2 fois à une question. Une seule réponse correcte sera acceptée.                                                                                                           |

D'autres avantages seront peut être ajoutés dans le futur.
