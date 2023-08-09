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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  HeartIcon,
  ChatBubbleIcon,
  DotsVerticalIcon,
} from "@radix-ui/react-icons";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { getLikesCount, hasLiked } from "../actions/actions";
import PostFooter from "./PostFooter";
const getPostUser = async (userid: string) => {
  try {
    return await clerkClient.users.getUser(userid);
  } catch (err) {
    console.log(err);
  }
};
interface datatype {
  likes: number | null;
  id: number;
  createdAt?: Date;
  postId: string;
  userId: string;
  content: string;
  hasLiked: boolean | undefined;
}
export async function SingleComment({ data }: { data: datatype }) {
  const user = await getPostUser(data.userId.toString());
  const me = await currentUser();
  const likes = await getLikesCount(data.id.toString(), "comment");
  return (
    <Card className="w-[280px] sm:w-[400px] lg:w-[750px] pt-4 bg-black">
      <CardContent>
        {/* <Separator className="my-4" /> */}
        <div className="space-y-4">
          <div className="grid gap-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user ? user.profileImageUrl : ""} />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-col font-[400]   ">
                    <div className="flex gap-1 items-center">
                      <p className="text-sm font-medium leading-none">
                        {user
                          ? `${user.firstName} ${user.lastName}`
                          : "Deleated User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user ? `@${user.username}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <h1>{data.content.toString()}</h1>
      </CardContent>
      <PostFooter
        usecase="comment"
        hasLiked={data.hasLiked || false}
        userId={data.userId}
        likeCount={likes ? likes[0].count : 0}
        id={data.id}
      />
    </Card>
  );
}
