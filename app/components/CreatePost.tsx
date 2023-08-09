"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPost, getJoinedCommunities } from "../actions/actions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, Half1Icon } from "@radix-ui/react-icons";
import { communitytable } from "../../lib/db/schema";
import type { communitytype } from "@/components/CommunityCard";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { useToast } from "@/components/ui/use-toast";
// import {
//   SelectItem,
//   SelectTrigger,
//   SelectContent,
//   SelectGroup,
//   SelectValue,
//   Select,
//   SelectLabel,
// } from "@radix-ui/react-select";
export default function CreatePost({ joined }: { joined: communitytype[] }) {
  console.log(joined);
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  console.log(selectedCommunity);
  //////bug empty string due to onchange in select of radix ui....check community state ///fix the select component

  const id = joined.find((communit) => {
    console.log(communit.name);
    return (
      communit.id.toString() ==
      (selectedCommunity ? selectedCommunity.toString() : "")
    );
  });
  const router = useRouter();
  const { toast } = useToast();
  return (
    <div>
      <form>
        <div className="flex items-center gap-2 w-[100%] sm:w-[400px] lg:w-[750px]">
          <Input
            onChange={(e) => setContent(e.target.value)}
            id="email"
            value={content}
            type="text"
            className="w-full"
            placeholder="Post content"
          />
          <div>
            {/* <Select
              // value={selectedCommunity}
              onValueChange={setSelectedCommunity}
            >
              <SelectTrigger className="w-[180px] border  border-input ">
                <SelectValue placeholder="Community" />
              </SelectTrigger>
              <SelectContent className="delay-500 ease-in-out min-h-6">
                <SelectGroup className="px-3 border border-input py-2 mt-2 ">
                  <SelectLabel> Communities</SelectLabel>
                  {joined.length > 0 &&
                    joined.map((community) => (
                      <SelectItem
                        className="my-1"
                        value={community.id.toString()}
                      >
                        {community.name.toString()}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select> */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="ml-auto min-w-max">
                  {id ? id.name.toString() : "Community"}
                  <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command
                  value={selectedCommunity}
                  onValueChange={setSelectedCommunity}
                >
                  <CommandInput placeholder="Select a community" />
                  <CommandList>
                    <CommandEmpty>No Communities found </CommandEmpty>
                    <CommandGroup>
                      {joined.map((community) => (
                        <CommandItem
                          value={community.id.toString()}
                          className="teamaspace-y-1 flex flex-col items-start px-4 py-2"
                        >
                          <p>{community.name.toString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {community.description.toString().length > 25
                              ? community.description.toString().slice(0, 25) +
                                "..."
                              : community.description.toString()}
                          </p>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Button
            disabled={loading}
            onClick={async () => {
              if (!user || !user.user || !user.user.id) {
                router.push("/signin");
                return;
              }
              setLoading(true);
              setContent("");
              if (selectedCommunity == "") {
                toast({
                  title: "please select a community",
                });
                return;
              }
              await createPost(content, user.user?.id, selectedCommunity);
              toast({
                title: "Created a new post",
                description: "Please refresh to see effect",
              });
              setLoading(false);
              router.push("/");
            }}
          >
            {loading ? "Loading.." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
