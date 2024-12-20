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
          <h1 className="mb-4 text-2xl">Welcome to the Pentagram</h1>
          <p className="mb-4">Please sign in to access.</p>
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
        </>
      ) : (
        <>
          <ImageGenerator generateImage={generateImage} session={session} />
        </>
      )}
    </>
  );
}
