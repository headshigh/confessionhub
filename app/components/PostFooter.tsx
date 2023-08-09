"use client";
import React, { useState } from "react";
import { CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  TrashIcon,
  GearIcon,
  HeartFilledIcon,
  HeartIcon,
  ChatBubbleIcon,
  DotsVerticalIcon,
  CheckIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import {
  deleteOne,
  hasLiked,
  likeItem,
  unlikeItem,
} from "../actions/actions";
import { currentUser, useUser } from "@clerk/nextjs";
import Spinner from "@/components/Spinner";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
function PostFooter({
  commentCount,
  likeCount,
  hasLiked,
  usecase,
  id,
  userId,
}: {
  commentCount?: number;
  userId: string;
  likeCount: number;
  hasLiked: boolean;
  id: number;
  usecase: string;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(hasLiked);
  const [likeCountState, setLikeCount] = useState(Number(likeCount));
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const me = useUser();
  const { toast } = useToast();
  return (
    <div>
      <CardFooter className="flex gap-5">
        <div className="flex items-center gap-2">
          {liked ? (
            <HeartFilledIcon
              className="w-[24px] h-[20px] cursor-pointer"
              onClick={async () => {
                try {
                  setLikeCount((prev) => prev - 1);
                  setLiked(false);
                  const like = await unlikeItem(id.toString(), usecase);
                  if (like == "never liked!") {
                    setLikeCount((prev) => prev - 1);
                    setLiked(false);
                  }
                } catch (err) {
                  //if unable to unlike
                  setLikeCount((prev) => prev - 1);
                  setLiked(false);
                }
              }}
            />
          ) : (
            <HeartIcon
              onClick={async () => {
                try {
                  setLikeCount((prev) => prev + 1);
                  setLiked(true);
                  const msg = await likeItem(id.toString(), usecase);
                  if (msg == "already liked!") {
                    setLikeCount((prev) => prev - 1);
                  }
                } catch (err) {
                  setLikeCount((prev) => prev - 1);
                  setLiked(false);
                  console.log(err);
                }
              }}
              className="w-[24px] h-[20px] cursor-pointer"
            />
          )}
          <h1>{likeCountState}</h1>
        </div>
        {commentCount && (
          <div className="flex items-center gap-2">
            <ChatBubbleIcon className="w-[24px] h-[20px]" />
            <h1>{commentCount}</h1>
          </div>
        )}
        <div className="flex items-center hover:bg-secondary p-0.5 delay-100 ease-in    rounded">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsVerticalIcon className="w-[24px] h-[20px]" />
                <span className=" sr-only">open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 px-1 py-2  bg-black z-50 border border-input">
              <DropdownMenuSeparator />
              <DropdownMenuGroup className=" space-y-3 ">
                {me.user?.id == userId && (
                  <DropdownMenuItem
                    className="flex hover:bg-secondary hover:border-input rounded px-0.5 py-0.5 items-center "
                    onClick={async () => {
                      setLoading(true);
                      await deleteOne(id, usecase);
                      toast({
                        title: "Successfully deleated",
                      });
                      router.push("/");
                      setLoading(false);
                    }}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <TrashIcon className="mr-2 h-4 w-4" />
                    )}
                    <span>Delete</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="flex hover:bg-secondary rounded px-0.5 py-0.5 items-center">
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  <span
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? (
                      <div className="flex gap-1 items-center">
                        Copied
                        <CheckIcon className="h-5 w-5" />
                      </div>
                    ) : (
                      "Copy Link"
                    )}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex hover:bg-secondary rounded px-0.5 py-0.5  items-center">
                  <GearIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </div>
  );
}

export default PostFooter;
