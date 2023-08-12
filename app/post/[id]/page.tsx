import { db } from "@/lib/db";
import { useRouter } from "next/navigation";
import React from "react";
import { communitytable, post } from "@/lib/db/schema";
import { eq, param } from "drizzle-orm";
import { SinglePost } from "@/app/components/SinglePost";
import { comment } from "../../../lib/db/schema";
import Comment from "@/app/components/Comment";
import { hasLiked } from "@/app/actions/actions";

const getSinglePost = async (id: any) => {
  const posts = await db
    .select({
      content: post.content,
      id: post.id,
      likes: post.likes,
      userId: post.userId,
      createdAt: post.createdAt,
      community: {
        name: communitytable.name,
        id: communitytable.id,
      },
    })
    .from(post)
    .leftJoin(communitytable, eq(post.communityId, communitytable.id))
    .where(eq(id, post.id));
  const promises = posts.map(async (post) => {
    return {
      ...post,
      hasLiked: await hasLiked(post.id, "post"),
    };
  });
  next: {
    tags: ["singlepost"];
  }
  const mappedPosts = await Promise.all(promises);
  return mappedPosts;
};

async function SingePostView({ params }: { params: any }) {
  const postdata = await getSinglePost(params.id);
  console.log(postdata[0]);
  return (
    <div className="text-white  flex  flex-col items-center mt-28">
      {postdata ? <SinglePost data={postdata[0]} /> : <h1>Loading..</h1>}
      <Comment postId={params.id} />
    </div>
  );
}
export default SingePostView;
