CREATE TABLE `comment` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`content` text NOT NULL,
	`likes` int,
	`userId` int NOT NULL,
	`post_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communitymembers` (
	`communityId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `communitymembers_communityId_userId` PRIMARY KEY(`communityId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `communitytable` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `communitytable_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`content` text NOT NULL,
	`likes` int DEFAULT 0,
	`userId` varchar(255) NOT NULL,
	`communityId` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_id` PRIMARY KEY(`id`)
);
