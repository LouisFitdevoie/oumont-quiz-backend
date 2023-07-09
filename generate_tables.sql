DROP DATABASE IF EXISTS `oumont-quizz`;

CREATE DATABASE `oumont-quizz`;

USE `oumont-quizz`;

CREATE TABLE `Games` {
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `qualifying_number_questions` INT NOT NULL,
  `bonus_questions` BOOLEAN NOT NULL,
  `bonus_questions_number` INT NOT NULL,
  `semi_finals_number_questions` INT NOT NULL,
  `small_final_number_questions` INT NOT NULL,
  `final_number_questions` INT NOT NULL,
  `time_to_answer` VARCHAR(255) NOT NULL,
  `persons_per_group` INT NOT NULL,
}

CREATE TABLE `Groups` {
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `bonus` VARCHAR(255) NOT NULL,
  `is_qualified` BOOLEAN NOT NULL,
}

CREATE TABLE `Questions` {
  `id` VARCHAR(255) PRIMARY KEY,
  `question_type` VARCHAR(255) NOT NULL,
  `theme` VARCHAR(255) NOT NULL,
  `question` VARCHAR(255) NOT NULL,
  `answer` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `choices` VARCHAR(255) NOT NULL,
  `explanation` TEXT,
  `is_bonus` BOOLEAN NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
}

ALTER TABLE `Groups` ADD CONSTRAINT `fk_game_id` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);
ALTER TABLE `Questions` ADD CONSTRAINT `fk_game_id` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);

DROP DATABASE IF EXISTS `oumont-quizz-test`;

CREATE DATABASE `oumont-quizz-test`;

USE `oumont-quizz-test`;

CREATE TABLE `Games` {
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `qualifying_number_questions` INT NOT NULL,
  `bonus_questions` BOOLEAN NOT NULL,
  `bonus_questions_number` INT NOT NULL,
  `semi_finals_number_questions` INT NOT NULL,
  `small_final_number_questions` INT NOT NULL,
  `final_number_questions` INT NOT NULL,
  `time_to_answer` VARCHAR(255) NOT NULL,
  `persons_per_group` INT NOT NULL,
}

CREATE TABLE `Groups` {
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `bonus` VARCHAR(255) NOT NULL,
  `is_qualified` BOOLEAN NOT NULL,
}

CREATE TABLE `Questions` {
  `id` VARCHAR(255) PRIMARY KEY,
  `question_type` VARCHAR(255) NOT NULL,
  `theme` VARCHAR(255) NOT NULL,
  `question` VARCHAR(255) NOT NULL,
  `answer` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `choices` VARCHAR(255) NOT NULL,
  `explanation` TEXT,
  `is_bonus` BOOLEAN NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
}

ALTER TABLE `Groups` ADD CONSTRAINT `fk_game_id` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);
ALTER TABLE `Questions` ADD CONSTRAINT `fk_game_id` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);

DROP DATABASE IF EXISTS `oumont-quizz-dev`;

CREATE DATABASE `oumont-quizz-dev`;

USE `oumont-quizz-dev`;

CREATE TABLE `Games` {
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `qualifying_number_questions` INT NOT NULL,
  `bonus_questions` BOOLEAN NOT NULL,
  `bonus_questions_number` INT NOT NULL,
  `semi_finals_number_questions` INT NOT NULL,
  `small_final_number_questions` INT NOT NULL,
  `final_number_questions` INT NOT NULL,
  `time_to_answer` VARCHAR(255) NOT NULL,
  `persons_per_group` INT NOT NULL,
}

CREATE TABLE `Groups` {
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `bonus` VARCHAR(255) NOT NULL,
  `is_qualified` BOOLEAN NOT NULL,
}

CREATE TABLE `Questions` {
  `id` VARCHAR(255) PRIMARY KEY,
  `question_type` VARCHAR(255) NOT NULL,
  `theme` VARCHAR(255) NOT NULL,
  `question` VARCHAR(255) NOT NULL,
  `answer` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `choices` VARCHAR(255) NOT NULL,
  `explanation` TEXT,
  `is_bonus` BOOLEAN NOT NULL,
  `game_id` VARCHAR(255) NOT NULL,
}

ALTER TABLE `Groups` ADD CONSTRAINT `fk_game_id` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);
ALTER TABLE `Questions` ADD CONSTRAINT `fk_game_id` FOREIGN KEY (`game_id`) REFERENCES `Games`(`id`);