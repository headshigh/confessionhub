import { getPosts } from "@/app/actions/actions";
import { db } from "@/lib/db";
import { communitymembers, communitytable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import React, { useState } from "react";
import { post } from "../../../lib/db/schema";
import { SinglePost } from "@/app/components/SinglePost";
import { CommunityCard } from "@/components/CommunityCard";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs";
import { hasLiked } from "../../actions/actions";
async function SingleCommunityView({ params }: { params: any }) {
  const me = await currentUser();
  const hasJoined =
    (await db
      .select()
      .from(communitymembers)
      .where(
        and(
          eq(communitymembers.communityId, params.id),
          eq(communitymembers.userId, me?.id.toString() || "")
        )
      )) == null
      ? false
      : true;
  const communityPosts = await db.query.communitytable.findFirst({
    with: {
      posts: {
        with: {
          community: true,
        },
      },
    },
    where: (table, { eq }) => eq(table.id, params.id),
  });
  console.log(hasJoined);
  if (!communityPosts) return null;
  const communitPostsPromises = communityPosts.posts.map(async (post) => ({
    ...post,
    hasLiked: (await hasLiked(post.id, "post")) || false,
  }));
  const finalPosts = await Promise.all(communitPostsPromises);
  console.log(finalPosts);
  return (
    <div>
      <div className="w-full h-20 mb-2 mt-28    tracking-widest bg-slate-400 flex justify-center items-center">
        <div>
          <div className="flex gap-5">
            <h1 className="font-bold text-3xl">{communityPosts?.name}</h1>
            <Button>{hasJoined ? "Leave" : "Join"}</Button>
          </div>
          <p className="text-center">{communityPosts.description}</p>
        </div>
      </div>
      {/* {communityPosts.posts.map(post=>)} */}
      <div className="flex ">
        <div className="flex flex-col w-9/12   items-end">
          {finalPosts?.map((post) => (
            <SinglePost data={post} />
          ))}
        </div>
      </div>
      {finalPosts.length == 0 && (
        <h1 className="text-2xl text-center">No posts to show</h1>
      )}
    </div>
  );
}

export default SingleCommunityView;
