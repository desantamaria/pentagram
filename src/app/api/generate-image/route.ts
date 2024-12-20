import { NextResponse } from "next/server";
import { Logger } from "@/app/utils/logger";
import { put } from "@vercel/blob";
import { createImage } from "@/app/actions/neon/image";

const logger = new Logger("generate");

export async function POST(request: Request) {
  try {
    // Retrieve Prompt
    const body = await request.json();
    const { text } = body;

    const url = new URL(process.env.MODAL_URL || "");
    url.searchParams.set("prompt", text);

    logger.info(`Fetching response from Modal: ${url.toString()}`);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.MODAL_API_KEY || "",
        Accept: "image/jpeg",
      },
    });

    // Error Handling
    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`API Response: ${errorText}`);
      throw new Error(
        `HTTP error status: ${response.status} message: ${errorText}`
      );
    }

    // Upload Image to Vercel Blob
    const imageBuffer = await response.arrayBuffer();
    const filename = `${crypto.randomUUID()}.jpg`;
    logger.info(`Uploading image to vercel blob: ${filename}`);
    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    logger.info(`Image successfully uploaded: ${blob.url}`);

    // Create Entry in Neon Database
    logger.info(`Creating Database entry for: ${blob.url}`);
    createImage(blob.url);

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    });
  } catch (error) {
    logger.error(`Failed to process request: ${error}`);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
