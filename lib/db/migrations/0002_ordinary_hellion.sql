CREATE TABLE `like_table` (
	`postId` varchar(255) NOT NULL,
	`commentId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `like_table_commentId_postId_userId` PRIMARY KEY(`commentId`,`postId`,`userId`)
);
