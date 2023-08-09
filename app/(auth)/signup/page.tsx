"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Icons } from "@/components/icons";
import Link from "next/link";
import loginimage from "../../../public/craiyon_083841_A_winding_path_through_a_desolate_landscape_leading_to_a_foreboding_mountain_super_hi.png";
import { useSignIn, useSignUp } from "@clerk/nextjs";

import Image from "next/image";
import { OAuthStrategy } from "@clerk/nextjs/dist/types/server";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
function Create({ searchParams }: { searchParams: any }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>();
  const buttons = [
    {
      name: "google",
      strategy: "oauth_google",
      icon: "google",
    },
    {
      name: "github",
      strategy: "oauth_github",
      icon: "gitHub",
    },
  ] satisfies {
    name: string;
    strategy: OAuthStrategy;
    icon: keyof typeof Icons;
  }[];
  const router = useRouter();

  const handlesignin = async (strategy: OAuthStrategy) => {
    try {
      setIsLoading(strategy);
      await signIn?.authenticateWithRedirect({
        strategy: strategy,
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.log(err);
    }
  };
  console.log(userName, password);
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (!isLoaded) {
        return;
      }
      if (password.length < 8) {
        toast({ title: "length of password must me more than 8 characters" });
        return;
      }
      const result = await signUp?.create({
        username: userName,
        password,
      });

      if (result?.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        /*Investigate why the login hasn't completed */
        toast({ title: "unable to signup" });
        console.log(result);
      }
    } catch (err: any) {
      toast({ title: err.errors[0].longMessage });
      console.log(err);
      console.error("errors", err.errors[0].longMessage);
    }
  };
  // return (
  //   <Card className="flex items-center   justify-between  min-h-screen">
  //     <Card className="max-w-max flex bg-black">
  //       <CardContent className="">
  //         <Image
  //           className="h-screen object-contain"
  //           alt="imag"
  //           src={loginimage}
  //         />
  //       </CardContent>
  //       <CardContent className="flex items-center">
  //         <SignIn redirectUrl={redirectUrl || "/"} />
  //       </CardContent>
  //     </Card>
  //   </Card>
  // );
  return (
    <div className="flex items-center px-6 mt-28 justify-around h-[80vh] ">
      <Card className="h-[80vh] hidden md:block ">
        <Image src={loginimage} className="h-full w-full" alt="image" />
      </Card>
      <Card className="max-w-[500px] bg-black">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create your Account </CardTitle>
          <CardDescription>
            Enter your Username below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            {buttons.map((button) => {
              const Icon = Icons[button.icon];
              return (
                <Button
                  onClick={() => handlesignin(button.strategy)}
                  variant="outline"
                >
                  {isLoading == button.strategy ? (
                    <Icons.spinner className="mr-2 animate-spin" />
                  ) : (
                    <Icon className="mr-2 h-4 w-4" />
                  )}
                  {button.name}
                </Button>
              );
            })}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor=""> Username</Label>
            <Input
              onChange={(e) => setUserName(e.target.value)}
              id="email"
              type="text"
              placeholder="nischal"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={async (e) => await handleSubmit(e)}
            className="w-full"
          >
            Sign Up
          </Button>
        </CardFooter>
        <CardFooter>
          <h1 className=" pb-2">
            Already have a account?{" "}
            <Link className=" underline" href="/login">
              Log In
            </Link>
          </h1>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Create;
