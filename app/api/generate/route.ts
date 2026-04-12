import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topic, tone } = await req.json();

    const prompt = `You are an expert viral YouTube Shorts scriptwriter specializing in motivational content that gets millions of views.

Write a ${tone || "aggressive"} motivational YouTube Short script about: "${
      topic || "never giving up on your dreams"
    }"

Tone definitions:
- aggressive: high-energy, in-your-face, bold claims, fire metaphors, urgency
- stoic: calm authority, disciplined, no fluff
- spiritual: deeper meaning, purpose-driven
- raw: street-level honesty, conversational

Structure (4 segments):
- hook: under 10 words, powerful scroll-stopper
- body1: short emotional build
- body2: core insight
- cta: short action line with 1 emoji

Respond ONLY with valid JSON. No markdown. No explanation.

{
  "hook": "...",
  "body1": "...",
  "body2": "...",
  "cta": "..."
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    const text =
      data.content?.map((item: any) => item.text || "").join("") || "";

    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error("Generate Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Script generation failed",
      },
      { status: 500 }
    );
  }
}