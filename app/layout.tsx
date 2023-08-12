import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { Inter } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={`${inter.className}  dark bg-black  `}>
          <div className="fixed top-0 w-full  z-30">
            <Navbar className="" />
          </div>
          <div className=" mt-3  md:mt-16">{children}</div>
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
