"use client";

import { useEffect, useState } from "react";
import { getImage, listImages } from "../actions/neon/image";
import { Session } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImageGeneratorProps {
  generateImage: (
    text: string,
    username: string
  ) => Promise<{
    success: boolean;
    imageUrl?: string;
    error?: string;
  }>;
}

interface Image {
  id: number;
  url: string;
  latency?: number;
  prompt?: string;
  username?: string;
}

export default function ImageGenerator({
  generateImage,
  session,
}: ImageGeneratorProps & { session: Session }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesData = (await listImages()) as Image[];
        setImages(imagesData);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!session.user?.email) {
        throw new Error("No Email Provided");
      }

      const result = await generateImage(inputText, session.user?.email);

      if (!result.success) {
        throw new Error(result.error || "Failed to generate image");
      }

      if (result.imageUrl) {
        const img = new Image();
        const url = result.imageUrl;
        img.onload = () => {
          setImages(prevImages => [{ id: Date.now(), url }, ...prevImages]);
        };
        img.src = url;
      } else {
        throw new Error("No Image URL received");
      }

      setInputText("");
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate image"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-l from-gray-200 via-fuchsia-200 to-stone-100 flex flex-col justify-between p-8">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-lg">
            <svg
              aria-hidden="true"
              className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-purple-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="text-gray-700 font-medium">Generating...</span>
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="flex justify-between items-center gap-2 mb-10">
          <div className="flex items-center gap-2">
            <h1 className="scroll-m-20 text-1xl font-extrabold tracking-tight lg:text-2xl">
              Pentagram
            </h1>
            <img src="/logo.png" alt="Logo" width={30} height={30}></img>
          </div>
          <div className="flex justify-end items-center gap-2">
            <h1>
              Welcome{" "}
              <span className="text-purple-500">{session.user?.email}</span>{" "}
            </h1>
            <Button asChild>
              <Link
                href="/api/auth/signout"
                className="text-white relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 
              bg-[size:200%_auto] hover:bg-[position:100%_0] motion-safe:transition-[background-position] 
              motion-safe:duration-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
              >
                Sign Out
              </Link>
            </Button>
          </div>
        </div>

        <div className="h-[80vh] flex flex-col items-center justify-center gap-3 overflow-scroll">
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
              {images.map(image => (
                <div key={image.id} className="relative group">
                  <ImageModal imageUrl={image.url} />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
              {error}
            </div>
          )}
        </div>
      </main>

      <footer className="w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Describe the image you want to generate..."
              disabled={isLoading}
            ></Input>

            <Button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="text-white relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 
              bg-[size:200%_auto] hover:bg-[position:100%_0] motion-safe:transition-[background-position] 
              motion-safe:duration-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
            >
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
}

function ImageModal({ imageUrl }: { imageUrl: string }) {
  const [image, setImage] = useState<Image | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageData = (await getImage(imageUrl)) as Image[];
        setImage(imageData[0]);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImage();
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        <img
          src={imageUrl}
          alt={`Generated artwork ${imageUrl}`}
          className="w-full h-auto rounded-lg transition-all duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-xl hover:cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Image Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center">
            <img
              src={imageUrl}
              alt={`Generated artwork ${imageUrl}`}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Created by</h3>
              <p className="text-gray-600">{image?.username || "Anonymous"}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Prompt</h3>
              <p className="text-gray-600 break-words">
                {image?.prompt || "No prompt available"}
              </p>
            </div>

            {image?.latency && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Generation Time</h3>
                <p className="text-gray-600">
                  {image.latency.toFixed(2)} seconds
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Image ID</h3>
              <p className="text-gray-600 font-mono text-sm">
                {image?.id || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
