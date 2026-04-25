"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Music, Sparkles, Loader2 } from "lucide-react";

export default function ShortsStudio() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("engaging");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgMusic, setBgMusic] = useState("cinematic");
  const audioRef = useRef(null);

  // Handle Background Music Playback
  useEffect(() => {
    if (isPlaying && result) {
      audioRef.current = new Audio(`/music/${bgMusic}.mp3`);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(e => console.error("Audio blocked by browser", e));
    } else {
      audioRef.current?.pause();
    }
    return () => audioRef.current?.pause();
  }, [isPlaying, bgMusic, result]);

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setIsPlaying(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Generation failed");

      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Controls */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-2">
            <Sparkles className="text-orange-500" />
            <h1 className="text-2xl font-bold">Shorts Studio AI</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Video Topic</label>
              <input
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                placeholder="e.g. Why most people quit early..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tone</label>
              <select
                className="w-full border p-3 rounded-xl outline-none"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="engaging">🔥 Engaging & Fast</option>
                <option value="funny">😂 Humorous</option>
                <option value="educational">🎓 Deep Learning</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Music size={16} /> Background Music
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['cinematic', 'lofi', 'aggressive'].map((m) => (
                  <button 
                    key={m}
                    onClick={() => setBgMusic(m)}
                    className={`p-2 text-xs rounded-lg border capitalize ${bgMusic === m ? 'bg-black text-white' : 'bg-gray-50'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200"
            >
              {loading ? <Loader2 className="animate-spin" /> : "CREATE SHORT"}
            </button>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>}
        </div>

        {/* Right Side: Visual Preview */}
        <div className="flex justify-center items-center bg-gray-900 rounded-3xl p-8 min-h-[600px] relative overflow-hidden">
          {result ? (
            <div className="relative w-[300px] h-[533px] bg-black rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden flex flex-col justify-end p-6 text-white">
              {/* Background Simulation */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-80 z-10" />
              <div className={`absolute inset-0 bg-gradient-to-br ${tone === 'funny' ? 'from-yellow-500/20' : 'from-blue-500/20'} to-purple-500/20 animate-pulse`} />
              
              {/* Captions Overlay */}
              <div className="relative z-20 space-y-4 mb-8">
                <div className="bg-white text-black px-2 py-1 text-xs font-black uppercase inline-block rounded">
                  {result.hook.split(' ')[0]}
                </div>
                <h2 className="text-2xl font-black leading-tight tracking-tight uppercase">
                  {result.hook}
                </h2>
                <p className="text-sm text-gray-200 font-medium leading-relaxed italic">
                  "{result.script.substring(0, 100)}..."
                </p>
                <div className="pt-4 border-t border-white/20">
                  <span className="text-orange-400 font-bold">👉 {result.cta}</span>
                </div>
              </div>

              {/* Play Button */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md p-6 rounded-full hover:scale-110 transition"
              >
                {isPlaying ? <Pause fill="white" /> : <Play fill="white" />}
              </button>
            </div>
          ) : (
            <div className="text-gray-500 text-center space-y-2">
              <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center">
                <Play className="text-gray-600" />
              </div>
              <p>Enter a topic to generate preview</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
