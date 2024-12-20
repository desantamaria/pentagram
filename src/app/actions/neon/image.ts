"use server";

import { neon } from "@neondatabase/serverless";

export async function createImage(imageUrl: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  // Insert the image into the Postgres database
  await sql("INSERT INTO images (url) VALUES ($1)", [imageUrl]);
}

export async function listImages() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  // Retrieve all images from the Postgres database
  const result = await sql("SELECT * FROM images");
  return result;
}
