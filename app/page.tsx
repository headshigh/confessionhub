import React, { Suspense, useEffect, useState } from "react";
import { SinglePost } from "@/app/components/SinglePost";
import { CommunityCard } from "@/components/CommunityCard";
import CreatePost from "./components/CreatePost";
import { getPosts, getNotJoinedCommunities } from "./actions/actions";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { getJoinedCommunities } from "./actions/actions";
export default async function page() {
  // const posts=await db.select().from(post);
  //reletional
  // await db.execute(sql`DROP TABLE IF EXISTS communitymembers, post, communitytable, comment;
  // `);

  //given userid before join and after join userid null
  //communitytable.id   not is select communityId from communitymember where
  // const currUser=await currentUser();
  const me = await currentUser();
  const posts = (await getPosts()) || [];
  console.log(posts);
  const communities = await getNotJoinedCommunities(me?.id || "");
  const joinedCommuniteis = (await getJoinedCommunities(me?.id || "")) || [];
  return (
    <div className="flex sm:justify-start lg:justify-center lg:w-4/5 ">
      <div className="flex flex-col  w-3/4 items-center gap-y-5 mt-16">
        <CreatePost joined={joinedCommuniteis} />
        {posts?.length == 0 && (
          <h1 className="text-lg tracking-wider font-medium">
            Join Communities to start viewing posts
          </h1>
        )}
        <div>{posts && posts.map((post) => <SinglePost data={post} />)}</div>
      </div>
      <div className="fixed  hidden md:block right-16 mt-14">
        <h1 className="text-xl  pb-5">Explore Communities</h1>
        <div className="flex flex-col gap-4">
          {communities &&
            communities.map((community) => (
              <CommunityCard data={community} hasJoined={false} />
            ))}
        </div>
      </div>
    </div>
  );
}
