"use client";
import { PersonIcon, ClockIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { communitymembers, communitytable } from "../lib/db/schema";
import { joinCommunity } from "@/app/actions/actions"; //server action for client component
import { useState } from "react";
import Link from "next/link";
import { currentUser, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
export interface communitytype {
  id: number;
  name: string;
  createdAt: Date;
  description: string;
}
export function CommunityCard({
  data,
  className,
  hasJoined,
}: {
  data: communitytype;
  className?: string;
  hasJoined: boolean;
}) {
  const [joined, setJoined] = useState(hasJoined);
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const { toast } = useToast();
  const router = useRouter();
  console.log(user);
  return (
    <Card className={` bg-black w-[180px]  md:w-[250px]  ${className}`}>
      <CardHeader className=" grid-cols-[1fr_110px] items-start gap-4 space-y-0 flex">
        <Link href={`/community/${data.id}`}>
          <div className="space-y-1">
            <CardTitle>{data?.name.toString()}</CardTitle>
            <CardDescription>{data?.description.toString()}</CardDescription>
          </div>
        </Link>
        <div className="flex items-center justify-between  rounded-md  text-secondary-foreground">
          {/* <Separator orientation="vertical" className="h-[20px]" /> */}
          {!loading ? (
            <Button
              disabled={joined}
              onClick={async () => {
                try {
                  if (user.isSignedIn == false) {
                    router.push("/signin");
                    return;
                  }
                  setLoading(true);
                  await joinCommunity(`${data.id}`);
                  setJoined(true);
                  setLoading(false);
                } catch (err) {
                  setJoined(false);
                  console.log(err);
                }
              }}
            >
              {!joined ? (
                "Join"
              ) : (
                <div className="flex items-center gap-2 ">
                  <h1>Joined</h1>
                  <CheckIcon className="h-5 w-5 " />
                </div>
              )}
            </Button>
          ) : (
            <Button>Loading...</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <PersonIcon className="mr-1 h-3 w-3" />
            20k
          </div>
          <div className="flex items-center">
            <ClockIcon className="mr-1 h-3 w-3" />
            {`${new Date(data.createdAt.toString()).toLocaleString("default", {
              month: "short",
            })}  
              ${new Date(data.createdAt.toString()).getFullYear()}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
