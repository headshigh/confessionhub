import {
  mysqlTable,
  serial,
  text,
  varchar,
  mysqlEnum,
  primaryKey,
  int,
  timestamp,
  mysqlDatabase,
} from "drizzle-orm/mysql-core";

import { relations } from "drizzle-orm";
export const post = mysqlTable("post", {
  id: serial("id").primaryKey().autoincrement(),
  content: text("content").notNull(),
  likes: int("likes").default(0),
  userId: varchar("userId", { length: 255 }).notNull(),
  communityId: varchar("communityId", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
//each post is related with a community

export const postrelation = relations(post, ({ many, one }) => ({
  comments: many(comment),
  community: one(communitytable, {
    fields: [post.communityId],
    references: [communitytable.id],
  }),
}));
export const comment = mysqlTable("comment", {
  id: serial("id").primaryKey().autoincrement(),
  content: text("content").notNull(),
  likes: int("likes"),
  userId: varchar("userId", { length: 255 }).notNull(),
  postId: varchar("post_id",{length:255}).notNull(),
  // createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const commentrelation = relations(comment, ({ one }) => ({
  post: one(post, { fields: [comment.postId], references: [post.id] }),
}));
export const communitytable = mysqlTable("communitytable", {
  id: serial("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  // type: mysqlEnum("communityEnum", ["PRIVATE", "PUBLIC"]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const communityToPostRelation = relations(
  communitytable,
  ({ many }) => ({
    posts: many(post),
  })
);
export const communitymembers = mysqlTable(
  "communitymembers",
  {
    communityId: varchar("communityId", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.communityId, table.userId),
    };
  }
);
export const communitymembersrelation = relations(
  communitymembers,
  ({ one }) => ({
    community: one(communitytable, {
      fields: [communitymembers.communityId],
      references: [communitytable.id],
    }),
  })
);
export const likeTable=mysqlTable("like_table",{
  postId:varchar("postId",{length:255}).default(''),
  commentId:varchar("commentId",{length:255}).default(''),
  userId:varchar("userId",{length:255}).default(''),
},(table)=>{
  return {
    pk:primaryKey(table.postId,table.commentId,table.userId)
  }
})
export const likeTableRelation=relations(likeTable,({one})=>({
  post:one(post,{
    fields:[likeTable.postId],
    references:[post.id]
  }),
  comment:one(comment,{
    fields:[likeTable.commentId],
    references:[comment.id]
  }),
}))