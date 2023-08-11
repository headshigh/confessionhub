import React from "react";
import { db } from "@/lib/db";
import { comment, post } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SingleComment } from "./SingleComment";
import CreateComment from "./CreateComment";
import { getLikesCount } from "../actions/actions";
import { hasLiked } from "../actions/actions";
const getComments = async (id: any) => {
  const comments = await db
    .select({
      likes: comment.likes,
      id: comment.id,
      // createdAt: comment.createdAt,
      postId: comment.postId,
      userId: comment.userId,
      content: comment.content,
    })
    .from(comment)
    .leftJoin(post, eq(comment.postId, post.id))
    .where(eq(post.id, id));
  const promises = comments.map(async (comment) => {
    return {
      ...comment,
      hasLiked: await hasLiked(comment.id, "comment"),
    };
  });
  const mappedcomment = await Promise.all(promises);
  next: {
    tags: ["comments"];
  }
  return mappedcomment;
};
async function Comment({ postId }: { postId: string }) {
  const comments = await getComments(postId);
  console.log(comments);
  console.log("comments", comments);
  return (
    <div className="flex flex-col mt-7">
      {!comments && <h1>loading..</h1>}
      <CreateComment postId={postId} />
      <div>
        {comments.map((comment) => (
          <SingleComment data={comment} />
        ))}
      </div>
    </div>
  );
}

export default Comment;
