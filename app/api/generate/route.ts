import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY || !process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { success: false, error: "API Keys missing in Environment Variables" },
        { status: 500 }
      );
    }

    const { topic, tone } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, error: "Topic is required" }, { status: 400 });
    }

    // 1. Generate Script via Claude
    const prompt = `Generate a viral YouTube Shorts script about ${topic} in a ${tone} tone. Return ONLY valid JSON: {"hook": "...", "script": "...", "cta": "..."}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
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

    const aiData = await anthropicRes.json();
    const textOutput = aiData?.content?.[0]?.text;
    const cleanedJson = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedScript = JSON.parse(cleanedJson);

    // 2. Generate Audio via ElevenLabs
    // We combine the hook and script for the full voiceover
    const fullText = `${parsedScript.hook}. ${parsedScript.script}`;
    
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: fullText,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.5 },
      }),
    });

    if (!ttsResponse.ok) throw new Error("TTS Generation Failed");

    // Convert audio binary to base64 so it can be sent in JSON
    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({ 
      success: true, 
      data: {
        ...parsedScript,
        audio: `data:audio/mpeg;base64,${audioBase64}` 
      } 
    });

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
