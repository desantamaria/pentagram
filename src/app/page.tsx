"use server";

import { auth } from "@/auth";
import { generateImage } from "./actions/generateImage";
import ImageGenerator from "./components/ImageGenerator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  return (
    <>
      {!session ? (
        <>
          <div className="h-screen w-screen bg-gradient-to-l from-gray-200 via-fuchsia-200 to-stone-100 flex flex-col justify-center items-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Welcome to the Pentagram
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6 mb-3">
              Please sign in to access.
            </p>
            <Button asChild>
              <Link
                href="/api/auth/signin"
                className="text-white relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 
              bg-[size:200%_auto] hover:bg-[position:100%_0] motion-safe:transition-[background-position] 
              motion-safe:duration-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Sign In
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <ImageGenerator generateImage={generateImage} session={session} />
        </>
      )}
    </>
  );
}
