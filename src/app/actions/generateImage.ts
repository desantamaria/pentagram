"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function generateImage(text: string, username: string) {
  try {
    console.log(API_URL);
    const response = await fetch(`${API_URL}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.MODAL_API_KEY || "",
      },
      body: JSON.stringify({ text: text, username: username }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Server Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate image",
    };
  }
}
