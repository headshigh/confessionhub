ALTER TABLE `comment` MODIFY COLUMN `userId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `comment` DROP COLUMN `created_at`;