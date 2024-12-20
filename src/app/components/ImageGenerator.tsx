"use client";

import { useEffect, useState } from "react";
import { listImages } from "../actions/neon/image";
import { Session } from "next-auth";
import Link from "next/link";

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
  user_id?: number;
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
        console.log(imagesData);
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
          setImages(prevImages => [...prevImages, { id: Date.now(), url }]);
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
    <div className="min-h-screen flex flex-col justify-between p-8">
      <main className="flex-1">
        {/* Main content can go here */}

        <Link
          href="/api/auth/signout"
          className="mt-4 inline-block rounded border p-2"
        >
          Sign Out
        </Link>

        <h1>Welcome {session.user?.email}</h1>

        {error && (
          <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {images.length > 0 && (
          <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-lg">
            {images.map(image => (
              <img
                key={image.id}
                src={image.url}
                alt={`Generated artwork ${image.url}`}
                className="w-1/3 h-auto"
              ></img>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="w-full max-w-2xl flex items-center justify-center">
            <div
              className="w-full h-12 border-4 border-gray-300 border-t-black dark:border-gray-50"
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
        )}
      </main>

      <footer className="w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Describe the image you want to generate..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-3 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
