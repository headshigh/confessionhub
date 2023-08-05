"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useSignIn } from "@clerk/nextjs"
import { OAuthStrategy } from "@clerk/nextjs/dist/types/server"
import { Input } from "@/components/ui/input"
import React from "react"
import { Label } from "@/components/ui/label"
import useState from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
function Login() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>("oauth_google");
  const buttons=[{
name:"google",strategy:"oauth_google",icon:"google"
  },{
    name:"github",strategy:"oauth_github",icon:"gitHub"
  }]satisfies {name:string,strategy:OAuthStrategy,icon:keyof typeof Icons}[]
  const { isLoaded, signIn } = useSignIn();
const handlesignin=async(strategy:OAuthStrategy)=>{
  try{

    setIsLoading(strategy)
    await signIn.authenticateWithRedirect({
      strategy: strategy,
      redirectUrl: "/",
      redirectUrlComplete: "/",
    })
  }catch(err){
  }
}
  return (
    <div className="flex items-center justify-center min-h-screen">  <Card className="max-w-[500px]">
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl">Create an account</CardTitle>
      <CardDescription>
        Enter your email below to create your account
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
      <div className="grid grid-cols-2 gap-6">
        {buttons.map(button=>
        { 
          const Icon=Icons[button.icon];
          return <Button onClick={()=>handlesignin(button.strategy)} variant="outline">{isLoading==button.strategy?<Icons.spinner className="mr-2 animate-spin"/> :<Icon  className="mr-2 h-4 w-4"/>}{button.name}</Button>}
        )}
  
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
          <Label htmlFor="email">Email / Username</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">Create account</Button>
    </CardFooter>
  </Card>
  </div>
  )
}

export default Login;