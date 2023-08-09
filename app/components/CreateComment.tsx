"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createPost,
  getJoinedCommunities,
  createComment,
} from "../actions/actions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { communitytable } from "../../lib/db/schema";
import {
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectValue,
  Select,
  SelectLabel,
} from "@radix-ui/react-select";
import { useToast } from "@/components/ui/use-toast";
function CreateComment({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const user = useUser();
  const toast = useToast();
  console.log(user);
  //////bug empty string due to onchange in select of radix ui....check community state ///fix the select component

  const router = useRouter();
  return (
    <div>
      <form>
        <div className="flex items-center gap-2 w-[90%] sm:w-[400px] lg:w-[750px]">
          <Input
            onChange={(e) => setContent(e.target.value)}
            value={content}
            id="email"
            type="text"
            className="w-full"
            placeholder="Comment"
          />

          <Button
            disabled={loading}
            onClick={async () => {
              if (!user || !user.user || !user.user.id) {
                router.push("/signin");
                return;
              }
              setLoading(true);
              setContent("");
              await createComment(content, user.user?.id, postId);
              toast({
                title: "Successfully created a comment",
              });
              setLoading(false);
            }}
          >
            {loading ? "Loading.." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateComment;
