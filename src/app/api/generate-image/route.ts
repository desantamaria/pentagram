import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    // TODO: Call your Image Generation API here
    // For now, we'll just echo back the text

    fetch(
      "https://desantamaria--example-text-to-image-inference-web-dev.modal.run"
    )
      .then(response => response.json())
      .then(data => console.log(data));

    return NextResponse.json({
      success: true,
      message: `Received: ${text}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
