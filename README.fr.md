[![en](https://img.shields.io/badge/language-english-red)](./README.md)
[![fr](https://img.shields.io/badge/langue-français-brightgreen)](./README.fr.md)

# Oumont Quiz

## Description

Oumont Quiz est une application web permettant de créer des quiz qui seront joués par groupe dans une salle au cours d'évènements.

## Installation de l'application

### Prérequis

Pour pouvoir installer et utiliser l'application, vous devez avoir installé sur votre ordinateur :

- Docker
- NPM
- Node.js

### Installation

Pour installer l'application, vous devez suivre les étapes suivantes :

1. Télécharger le code source de l'application frontend sur votre ordinateur
2. Télécharger le code source de l'application backend sur votre ordinateur
3. Ouvrir un terminal et se placer dans le dossier contenant le code source de l'application frontend
4. Exécuter la commande `npm install` pour installer les dépendances de l'application frontend
5. Ouvrir un terminal et se placer dans le dossier contenant le code source de l'application backend
6. Exécuter la commande `npm install` pour installer les dépendances de l'application backend
7. Exécuter la commande `docker-compose up` pour créer le container contenant la base de données sur docker
8. Ouvrir le fichier [generates_tables.sql](./generate_tables.sql) et insérer les mots de passe des utilisateurs qui seront créés dans la base de données (lignes 127, 130, 133)
9. Ouvrir le container dans docker, se connecter à la base de données et copier-coller le code SQL contenu dans le fichier `generate_tables.sql` dans le container pour créer la base de données, les tables et les utilisateurs nécessaires au fonctionnement de l'application
10. Créer un fichier `.env` dans le dossier contenant le code source de l'application backend et y insérer les variables d'environnement suivantes :

```env
DB_PASSWORD_PROD=SAME_PASSWORD_AS_IN_GENERATE_TABLES.SQL
DB_PASSWORD_TEST=SAME_PASSWORD_AS_IN_GENERATE_TABLES.SQL
DB_PASSWORD_DEV=SAME_PASSWORD_AS_IN_GENERATE_TABLES.SQL
DB_USER_PROD=oumont_quiz // Ne pas modifier
DB_USER_TEST=oumont_quiz_test // Ne pas modifier
DB_USER_DEV=oumont_quiz_dev // Ne pas modifier
DATABASE_PORT=3306 // Port sur lequel la base de données sera accessible (Ne pas modifier)
NODE_ENV=development // Ne pas modifier
DATABASE_PROD=oumont_quiz // Ne pas modifier
DATABASE_TESTING=oumont_quiz_test // Ne pas modifier
DATABASE_DEV=oumont_quiz_dev // Ne pas modifier
DATABASE_HOST=localhost // Host sur lequel la base de données sera accessible
API_VERSION=v1  // Version de l'API (Ne pas modifier)
API_PORT=8000 // Port sur lequel l'application backend sera accessible
API_HOST=localhost
TEST_FILES_TOTAL=3 // Ne pas modifier
TEST_FILES_COMPLETED=0 // Ne pas modifier
NOT_DECADE_THEMES_WEIGHT=2 // Poids des thèmes qui ne sont pas des décennies
```

12. Ouvrir un terminal et se placer dans le dossier contenant le code source de l'application backend
13. Exécuter la commande `npm start` pour démarrer l'application backend
14. Ouvrir un terminal et se placer dans le dossier contenant le code source de l'application frontend
15. Exécuter la commande `npm start` pour démarrer l'application frontend
16. Ouvrir un navigateur et se rendre à l'adresse `http://localhost:3000` pour accéder à l'application

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
open;Musique;Quel est le nom de ce chanteur ?;Rick Astley;1;;C'est Rick Astley;example.jpg;0
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
3. Saisir le temps de réponse maximum pour chaque type de question (en secondes)
4. Saisir le nombre de personnes qui devront composer un groupe (par défaut, 4 personnes)
5. Saisir les noms des groupes qui participeront à la partie

Une fois que toutes ces étapes sont terminées, l'animateur peut cliquer sur le bouton `Commencer la partie` pour lancer la partie. Une fois que la partie a été lancée, l'animateur ne pourra plus modifier les paramètres de la partie. Il pourra seulement mettre la partie en pause ou la terminer.

### Partie

Au début de la partie, un groupe est tiré au hasard par l'ordinateur pour choisir un thème parmi ceux affichés à l'écran. Une fois que le thème a été choisi, l'ordinateur choisit une question au hasard parmi les questions qui n'ont pas encore été posées dans ce thème et la pose à l'ensemble des groupes qui répondront sur une feuille de réponse qu'ils devront déposer dans une urne à la fin de chaque question avant que la réponse ne soit affichée.
A la fin des trois questions, on devra choisir de soit passer à un nouveau thème, soit faire une pause, soit terminer la partie. Si on choisit de passer à un nouveau thème, trois questions seront posées sur le thème sélectionné par le groupe avant qu'un autre groupe ne soit sélectionné pour choisir un nouveau thème. Si on choisit de faire une pause, l'utilisateur devra rentrer les réponses données par les groupes afin de pouvoir calculer les scores. Au moment où ils voudront reprendre la partie, un classement intermédiaire s'affichera à l'écran avant de reprendre la partie. Si on choisit de terminer la partie, l'utilisateur devra rentrer les réponses données par les groupes afin de pouvoir calculer les scores. Une fois que les réponses ont été saisies, l'ordinateur calcule le score de chaque groupe et affiche le classement des groupes sous la forme d'un diagramme en bâtonnets horizontal.

### Calcul des points

Quand l'utilisateur voudra saisir les réponses données par les groupes, il devra saisir les réponses données par chaque groupe pour chaque question.
Une fois que toutes les réponses ont été saisies, l'ordinateur calcule le score de chaque groupe et affiche le classement des groupes sous la forme d'un diagramme en bâtonnets horizontal.
