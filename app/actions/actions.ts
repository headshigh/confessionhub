"use server";
import {
  communitymembers,
  communitytable,
  comment,
  post,
  likeTable,
} from "../../lib/db/schema";
import { eq, ne, isNull, or, sql, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { currentUser, useUser } from "@clerk/nextjs";
import { ok } from "assert";
import { ca } from "drizzle-orm/column.d-9d2f4045";
import { table } from "console";
import Error from "next/error";
import { ErrorProps } from "next/error";
export const joinCommunity = async (id: string) => {
  try {
    const me = await currentUser();
    console.log("joining community... ");
    if (!me) return null;
    await db
      .insert(communitymembers)
      .values({ userId: me?.id, communityId: id });
    return true;
  } catch (err) {
    console.log(err);
  }
};
export const createPost = async (
  content: string,
  userId: string,
  communityId: string
) => {
  try {
    console.log("creating post... ", communityId);
    await db.insert(post).values({
      content,
      userId,
      communityId: communityId,
    });
    return true;
  } catch (err) {
    console.log(err);
  }
};
export const getPosts = async () => {
  //gets posts from communities user has joined in
  const me = await currentUser();
  try {
    // const posts = await db.query.post.findMany({
    //   with: {
    //     community: {
    //       columns: {
    //         name: true,
    //         id: true,
    //       },
    //     },
    //   },
    //   limit: 25,
    // });
    // return posts;
    const posts = await db
      .select({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        userId: post.userId,
        likes: post.likes,
        community: {
          id: communitytable.id,
          name: communitytable.name,
        },
      })
      .from(post)
      .leftJoin(communitytable, eq(post.communityId, communitytable.id))
      .leftJoin(
        communitymembers,
        eq(communitymembers.communityId, post.communityId)
      )
      .where(eq(communitymembers.userId, me?.id || ""));
    const promises = posts.map(async (post) => {
      return {
        ...post,
        hasLiked: (await hasLiked(post.id, "post")) || false,
      };
    });
    const mappedPosts = await Promise.all(promises);
    return mappedPosts;
  } catch (err) {
    console.log(err);
  }
};
export const getNotJoinedCommunities = async (userId: string) => {
  try {
    const communities = await db
      .selectDistinct({
        id: communitytable.id,
        name: communitytable.name,
        description: communitytable.description,
        createdAt: communitytable.createdAt,
      })
      .from(communitytable)
      .leftJoin(
        communitymembers,
        eq(communitytable.id, communitymembers.communityId)
      )
      .where(
        (table) =>
          sql` ${communitytable.id} not in (select communityId from ${communitymembers} where ${communitymembers.userId}=${userId})`
      );
    return communities;
  } catch (err) {
    console.log(err);
  }
};
export const getJoinedCommunities = async (userId: string) => {
  try {
    const communities = await db
      .select({
        id: communitytable.id,
        name: communitytable.name || "",
        description: communitytable.description || "",
        createdAt: communitytable.createdAt,
      })
      .from(communitytable)
      .leftJoin(
        communitymembers,
        eq(communitytable.id, communitymembers.communityId)
      )
      .where(or(eq(communitymembers.userId, userId)));
    return communities;
  } catch (err) {
    console.log(err);
  }
};
export const createComment = async (
  content: string,
  userId: string,
  postId: string
) => {
  try {
    await db.insert(comment).values({ content, userId, postId }); ///fix it
    return true;
  } catch (err) {
    console.log(err);
  }
};
export const getLikesCount = async (id: string, usecase: string) => {
  try {
    if (usecase == "post") {
      return db
        .select({ count: sql<number>`count(*)` })
        .from(likeTable)
        .where(eq(likeTable.postId, id));
    } else {
      return db
        .selectDistinct({ count: sql<number>`count(*)` })
        .from(likeTable)
        .where(eq(likeTable.commentId, id));
    }
  } catch (err) {
    console.log(err);
  }
};
export const likeItem = async (id: string, usecase: string) => {
  try {
    const me = await currentUser();
    if (!me) return;
    if (usecase == "post") {
      const hasPrevLiked = await db
        .select()
        .from(likeTable)
        .where(and(eq(likeTable.postId, id), eq(likeTable.userId, me.id)));
      if (hasPrevLiked.length > 0) return "already liked!";
      return db
        .insert(likeTable)
        .values({ postId: id, userId: me?.id, commentId: "" });
    } else {
      const hasPrevLiked = await db
        .select()
        .from(likeTable)
        .where(and(eq(likeTable.commentId, id), eq(likeTable.userId, me.id)));
      if (hasPrevLiked.length > 0) return "already liked!";
      return db
        .insert(likeTable)
        .values({ postId: "", userId: me?.id, commentId: id });
    }
  } catch (err) {
    console.log(err);
  }
};
export const unlikeItem = async (id: string, usecase: string) => {
  try {
    const me = await currentUser();
    if (!me) return;
    if (usecase == "post") {
      const hasPrevLiked = await db
        .select()
        .from(likeTable)
        .where(and(eq(likeTable.postId, id), eq(likeTable.userId, me.id)));
      if (hasPrevLiked.length == 0) return "never liked!";
      return db
        .delete(likeTable)
        .where(and(eq(likeTable.postId, id), eq(likeTable.userId, me?.id)));
    } else {
      const hasPrevLiked = await db
        .select()
        .from(likeTable)
        .where(and(eq(likeTable.commentId, id), eq(likeTable.userId, me.id)));
      if (hasPrevLiked.length == 0) return "never liked!";
      return db
        .delete(likeTable)
        .where(and(eq(likeTable.commentId, id), eq(likeTable.userId, me?.id)));
    }
  } catch (err) {
    console.log(err);
  }
};
// export const deleteItem = async (id: number, usecase: string) => {
//   if ((usecase = "post")) {
//     return await db.delete(post).where(eq(post.id, id));
//   } else {
//     return await db.delete(comment).where(eq(comment.id, id));
//   }
// };
export const hasLiked = async (id: number, usecase: string) => {
  try {
    const me = await currentUser();
    if (!me) return;
    if (usecase == "post") {
      const hasPrevLiked = await db
        .select()
        .from(likeTable)
        .where(
          and(eq(likeTable.postId, id.toString()), eq(likeTable.userId, me.id))
        );
      return hasPrevLiked.length > 0;
    } else {
      const hasPrevLiked = await db
        .select()
        .from(likeTable)
        .where(
          and(
            eq(likeTable.commentId, id.toString()),
            eq(likeTable.userId, me.id)
          )
        );
      return hasPrevLiked.length > 0;
    }
  } catch (err) {
    console.log(err);
  }
};
export const getCommentsCount = async (id: string) => {
  try {
    return db
      .select({ count: sql<number>`count(*)` })
      .from(comment)
      .where(eq(comment.postId, id));
  } catch (err) {
    console.log(err);
  }
};
export const deleteOne = async (id: number, usecase: string) => {
  try {
    const me = await currentUser();
    const activetable = usecase == "post" ? post : comment;
    console.log(activetable);
    const postorcomment = await db
      .selectDistinct()
      .from(activetable)
      .where(eq(activetable.id, id));
    if (postorcomment[0].userId != me?.id) return null;
    await db.delete(activetable).where(eq(activetable.id, id));
    if (activetable == post) {
      //delete all comments of that posts and likes for that post
      await db.delete(comment).where(eq(comment.postId, id.toString()));
      await db.delete(likeTable).where(eq(likeTable.postId, id.toString()));
    } else {
      await db.delete(likeTable).where(eq(likeTable.commentId, id.toString()));
    }
    return true;
  } catch (err) {
    console.log(err);
  }
};
///donot need to infer use server inside actions here in this route
