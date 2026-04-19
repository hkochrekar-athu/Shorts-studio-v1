"use client";

import { useState } from "react";

export default function ShortsStudio() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("engaging");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, tone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Shorts Studio</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Enter topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <select
        className="w-full border p-2 rounded"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
      >
        <option value="engaging">Engaging</option>
        <option value="funny">Funny</option>
        <option value="educational">Educational</option>
      </select>

      <button
        onClick={generate}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="border p-4 rounded space-y-2">
          <h2 className="font-semibold">Hook</h2>
          <p>{result.hook}</p>

          <h2 className="font-semibold">Script</h2>
          <p>{result.script}</p>

          <h2 className="font-semibold">CTA</h2>
          <p>{result.cta}</p>
        </div>
      )}
    </div>
  );
}