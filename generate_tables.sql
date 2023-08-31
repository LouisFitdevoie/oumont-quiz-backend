DROP DATABASE IF EXISTS `oumont_quiz`;

CREATE DATABASE `oumont_quiz`;

USE `oumont_quiz`;

CREATE TABLE `Games` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `time_to_answer` VARCHAR(255) NOT NULL,
  `persons_per_group` INT NOT NULL,
  `created_at` DATETIME NOT NULL
);

CREATE TABLE `Groups` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `bonus` VARCHAR(255) NOT NULL,
  `is_qualified` BOOLEAN NOT NULL,
  `ranking` INT NOT NULL
);

CREATE TABLE `Questions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `question_type` VARCHAR(255) NOT NULL,
  `theme` VARCHAR(255) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `choices` VARCHAR(255) NOT NULL,
  `explanation` TEXT,
  `image_name` VARCHAR(255) NOT NULL,
  `is_bonus` BOOLEAN NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
  `is_asked` BOOLEAN NOT NULL
);

ALTER TABLE `Groups` ADD CONSTRAINT `fk_game_id_groups` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);
ALTER TABLE `Questions` ADD CONSTRAINT `fk_game_id_questions` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);

DROP DATABASE IF EXISTS `oumont_quiz_test`;

CREATE DATABASE `oumont_quiz_test`;

USE `oumont_quiz_test`;

CREATE TABLE `Games` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `time_to_answer` VARCHAR(255) NOT NULL,
  `persons_per_group` INT NOT NULL,
  `created_at` DATETIME NOT NULL
);

CREATE TABLE `Groups` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `bonus` VARCHAR(255) NOT NULL,
  `is_qualified` BOOLEAN NOT NULL,
  `ranking` INT NOT NULL
);

CREATE TABLE `Questions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `question_type` VARCHAR(255) NOT NULL,
  `theme` VARCHAR(255) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `choices` VARCHAR(255) NOT NULL,
  `explanation` TEXT,
  `image_name` VARCHAR(255) NOT NULL,
  `is_bonus` BOOLEAN NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
  `is_asked` BOOLEAN NOT NULL
);

ALTER TABLE `Groups` ADD CONSTRAINT `fk_game_id_groups_test` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);
ALTER TABLE `Questions` ADD CONSTRAINT `fk_game_id_questions_test` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);

DROP DATABASE IF EXISTS `oumont_quiz_dev`;

CREATE DATABASE `oumont_quiz_dev`;

USE `oumont_quiz_dev`;

CREATE TABLE `Games` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `time_to_answer` VARCHAR(255) NOT NULL,
  `persons_per_group` INT NOT NULL,
  `created_at` DATETIME NOT NULL
);

CREATE TABLE `Groups` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `bonus` VARCHAR(255) NOT NULL,
  `is_qualified` BOOLEAN NOT NULL,
  `ranking` INT NOT NULL
);

CREATE TABLE `Questions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `question_type` VARCHAR(255) NOT NULL,
  `theme` VARCHAR(255) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `choices` VARCHAR(255) NOT NULL,
  `explanation` TEXT,
  `image_name` VARCHAR(255) NOT NULL,
  `is_bonus` BOOLEAN NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
  `is_asked` BOOLEAN NOT NULL
);

ALTER TABLE `Groups` ADD CONSTRAINT `fk_game_id_groups_dev` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);
ALTER TABLE `Questions` ADD CONSTRAINT `fk_game_id_questions_dev` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);