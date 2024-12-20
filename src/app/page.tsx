"use server";

import { auth } from "@/auth";
import { generateImage } from "./actions/generateImage";
import ImageGenerator from "./components/ImageGenerator";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <>
      {!session ? (
        <>
          <h1 className="mb-4 text-2xl">Welcome to the Pentagram</h1>
          <p className="mb-4">Please sign in to access.</p>
          <Link
            href="/api/auth/signin"
            className="inline-block rounded border p-2"
          >
            Sign In
          </Link>
        </>
      ) : (
        <>
          <ImageGenerator generateImage={generateImage} session={session} />
        </>
      )}
    </>
  );
}
