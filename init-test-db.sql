DROP DATABASE IF EXISTS `prgms_notes`;
CREATE SCHEMA `prgms_notes` DEFAULT CHARACTER SET utf8mb4;
USE `prgms_notes`

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(256) NOT NULL,
  `encrypted_password` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_unique_email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `content` text NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `note_user_id` (`user_id`),
  CONSTRAINT `note_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,'test@example.com','$2b$10$432oW5OwXPcHPcmyQghkxeICMi65DGPdFnDv21dJ2QU3CSj.xFbi6');
UNLOCK TABLES;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
INSERT INTO `notes` VALUES (1,'Test (1)','<p>This note is for testing.</p><p>Note number: 1</p>',1,'2024-01-24 05:47:47','2024-01-24 05:48:04'),(2,'Test (2)','<p>This note is for testing.</p><p>Note number: 2</p>',1,'2024-01-24 05:48:08','2024-01-24 05:48:23');
UNLOCK TABLES;

