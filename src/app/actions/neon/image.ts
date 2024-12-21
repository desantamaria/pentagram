"use server";

import { neon } from "@neondatabase/serverless";

export async function createImage(
  imageUrl: string,
  prompt: string,
  username: string,
  latency: number
) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  // Insert the image into the Postgres database
  await sql(
    "INSERT INTO images (url, prompt, username, latency) VALUES ($1, $2, $3, $4)",
    [imageUrl, prompt, username, latency]
  );
}

export async function listImages() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  // Retrieve all images from the Postgres database
  const result = await sql("SELECT * FROM images");
  return result;
}

export async function getImage(url: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  // Retrieve a specific image from the Postgres database by URL
  const result = await sql("SELECT * FROM images WHERE url = $1", [url]);
  return result;
}
