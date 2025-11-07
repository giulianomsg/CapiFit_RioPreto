-- CapiFit Database Schema
-- Version 1.0

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `workout_plans`;
DROP TABLE IF EXISTS `diet_plans`;
DROP TABLE IF EXISTS `users`;

--
-- Table structure for table `users`
--
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('trainer', 'student') NOT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `workout_plans` (templates)
--
CREATE TABLE `workout_plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `creator_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `diet_plans` (templates)
--
CREATE TABLE `diet_plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `creator_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Table structure for table `students` (linking table)
--
CREATE TABLE `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `trainer_id` INT NOT NULL,
  `subscription_plan` VARCHAR(100) DEFAULT 'Trial',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `last_active` VARCHAR(100) DEFAULT 'agora mesmo',
  `workout_plan_id` INT DEFAULT NULL,
  `diet_plan_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`trainer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`workout_plan_id`) REFERENCES `workout_plans`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`diet_plan_id`) REFERENCES `diet_plans`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Insert a default trainer user for testing purposes
-- Password is 'password123'
--
INSERT INTO `users` (`name`, `email`, `password`, `role`, `avatar_url`) VALUES
('Treinador Padrão', 'treinador@capifit.com', '$2a$10$GplA.dGq0kU5X.g1042juey9i.3zLwVjq.ufrfUs4M0s2J5o.L5iG', 'trainer', 'https://picsum.photos/seed/trainer/200/200');
