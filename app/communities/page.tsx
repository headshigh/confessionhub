import React from "react";
import {
  getJoinedCommunities,
  getNotJoinedCommunities,
} from "../actions/actions";
import { currentUser } from "@clerk/nextjs";
import { CommunityCard } from "@/components/CommunityCard";
import { join } from "path";

async function Page() {
  const me = await currentUser();
  const notJoined = await getNotJoinedCommunities(me?.id || "");
  console.log(notJoined);
  const joined = await getJoinedCommunities(me?.id || "");
  console.log(notJoined);
  return (
    <div className="mt-32 px-2 ">
      <h1 className="text-2xl font-bold tracking-wider mb-2">
        Your Communities
      </h1>
      <div className="">
        <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-2  p-4 ">
          {joined?.map((community) => (
            <CommunityCard hasJoined={true} data={community} />
          ))}
        </div>
        <h1 className="text-2xl font-bold tracking-wider mb-2">
          Explore Communities
        </h1>
        <div className="">
          <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-2  p-4 ">
            {notJoined?.map((community) => (
              <CommunityCard hasJoined={false} data={community} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
