"use server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GearIcon, FileTextIcon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostFooter from "./PostFooter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  HeartFilledIcon,
  HeartIcon,
  CommitIcon,
  ChatBubbleIcon,
  DotsVerticalIcon,
} from "@radix-ui/react-icons";
import { clerkClient } from "@clerk/nextjs";
import { getCommentsCount, getLikesCount, hasLiked } from "../actions/actions";
import { communitytable } from "../../lib/db/schema";

const getPostUser = async (userid: string) => {
  return await clerkClient.users.getUser(userid);
};
interface dataprops {
  hasLiked: boolean | undefined;
  id: number;
  content: string;
  createdAt: Date;
  userId: string;
  likes: number | null;
  community: {
    id: number;
    name: string;
  } | null;
}
export async function SinglePost({ data }: { data: dataprops }) {
  console.log(data.hasLiked);
  const user = await getPostUser(data?.userId.toString());
  const likescount = await getLikesCount(data?.id.toString(), "post");
  const commentscount = await getCommentsCount(data.id.toString());
  // const currUser = currentUser();
  // console.log(currUser);
  return (
    <Card className="w-[290px] sm:w-[400px] lg:w-[750px] pt-4 bg-black">
      <CardContent>
        {/* <Separator className="my-4" /> */}
        <div className="space-y-4">
          <div className="grid gap-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.profileImageUrl} />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-col font-[400]   ">
                    <Link href={`/community/${data?.community?.id}`}>
                      <p className="text-lg font-medium leading-none">
                        {data?.community?.name.toString()}
                      </p>
                    </Link>
                    <div className="flex gap-1 items-center">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <Link href={`/post/${data.id}`}>
        <CardContent>{data.content}</CardContent>
      </Link>
      <PostFooter
        usecase="post"
        hasLiked={data?.hasLiked || false}
        userId={data.userId}
        id={Number(data.id)}
        commentCount={commentscount ? commentscount[0].count : 0}
        likeCount={likescount ? likescount[0].count : 0}
      />
    </Card>
  );
}
