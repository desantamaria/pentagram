"use server";

import { neon } from "@neondatabase/serverless";

export async function createImage(imageUrl: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  // Insert the comment from the form into the Postgres database
  await sql("INSERT INTO images (image) VALUES ($1)", [imageUrl]);
}
