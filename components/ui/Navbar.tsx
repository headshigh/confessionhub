"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Card } from "./card";
import { UserButton, UserProfile, useUser } from "@clerk/nextjs";
import { useState } from "react";
export function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { isSignedIn } = useUser();
  const [active, setActive] = useState("feed");
  console.log(active);
  console.log(isSignedIn);
  return (
    <Card
      className={cn(
        " items-center justify-between  py-8 space-x-4 lg:space-x-6 bg-black  hidden sm:flex border-b-1 border-r-0 border-l-0 mb-6 rounded-none px-6",
        className
      )}
      {...props}
    >
      <Link href={"/"}>
        <div>
          <span className="text-3xl">CH</span>
        </div>
      </Link>
      <div className="flex gap-x-20 ">
        <Link
          onClick={() => setActive("feed")}
          href="/"
          className={`${
            active !== "feed" ? "text-muted-foreground" : ""
          } text-sm font-medium transition-colors hover:text-white`}
        >
          Feed
        </Link>
        <Link
          onClick={() => setActive("communities")}
          href="/communities"
          className={`${
            active !== "community" ? "text-muted-foreground" : ""
          } text-sm font-medium transition-colors hover:text-white`}
        >
          Communities
        </Link>
        <div>
          <UserButton />
        </div>
      </div>
    </Card>
  );
}
