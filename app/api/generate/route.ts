import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ Validate env
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { topic, tone } = body;

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic is required" },
        { status: 400 }
      );
    }

    const prompt = `
Generate a viral YouTube Shorts script.

Topic: ${topic}
Tone: ${tone || "engaging"}

Return ONLY valid JSON:

{
  "hook": "...",
  "script": "...",
  "cta": "..."
}
`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic error:", errText);

      return NextResponse.json(
        { success: false, error: "AI request failed" },
        { status: 500 }
      );
    }

    const data = await response.json();

    const text = data?.content?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Empty AI response" },
        { status: 500 }
      );
    }

    // ✅ Clean response
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parse failed:", cleaned);

      return NextResponse.json(
        { success: false, error: "Invalid AI format" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (err) {
    console.error("Server error:", err);

    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}