'use client'

import { useState, useEffect, useRef } from "react";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#06060f;--s1:#0c0c1e;--s2:#10102a;--s3:#161630;
      --border:rgba(255,255,255,0.06);--borderB:rgba(255,255,255,0.12);
      --text:#eeeeff;--muted:#4a4a6a;--muted2:#7070a0;
      --a:#ff5722;--a2:#ffab00;--ag:rgba(255,87,34,0.15);--agg:rgba(255,87,34,0.4);
      --green:#00e676;--blue:#448aff;--purple:#e040fb;
      --fh:'Syne',sans-serif;--fb:'Bebas Neue',sans-serif;--fm:'JetBrains Mono',monospace;
    }
    body{background:var(--bg);font-family:var(--fh);color:var(--text)}
    ::-webkit-scrollbar{width:3px;background:transparent}
    ::-webkit-scrollbar-thumb{background:var(--a);border-radius:99px}
    textarea,input{font-family:var(--fh)}
    textarea:focus,input:focus{outline:none}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes glowPulse{0%,100%{box-shadow:0 0 20px var(--agg)}50%{box-shadow:0 0 50px var(--agg),0 0 100px rgba(255,87,34,0.15)}}
    @keyframes wordIn{0%{opacity:0;transform:scale(0.5) translateY(20px)}70%{transform:scale(1.08) translateY(-2px)}100%{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes cinIn{from{opacity:0;letter-spacing:0.5em}to{opacity:1;letter-spacing:inherit}}
    @keyframes typeIn{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0% 0 0)}}
    @keyframes barPulse{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  `}</style>
);

const THEMES = [
  {id:"inferno", name:"Inferno",  bg:"#08040c", c1:"#ff5722", c2:"#ffab00", tc:"#fff8f0", glow:"rgba(255,87,34,.28)"},
  {id:"arctic",  name:"Arctic",   bg:"#04080f", c1:"#448aff", c2:"#00e676", tc:"#e8f4ff", glow:"rgba(68,138,255,.28)"},
  {id:"void",    name:"Void",     bg:"#070008", c1:"#e040fb", c2:"#ff4081", tc:"#f5e0ff", glow:"rgba(224,64,251,.25)"},
  {id:"empire",  name:"Empire",   bg:"#0a0700", c1:"#ffab00", c2:"#ff5722", tc:"#fffbe0", glow:"rgba(255,171,0,.28)"},
  {id:"matrix",  name:"Matrix",   bg:"#01090a", c1:"#00e676", c2:"#64ffda", tc:"#e0ffe8", glow:"rgba(0,230,118,.28)"},
  {id:"chrome",  name:"Chrome",   bg:"#06060a", c1:"#cfd8dc", c2:"#90a4ae", tc:"#f0f4f8", glow:"rgba(207,216,220,.18)"},
];

const CAPTION_STYLES = [
  {id:"bold",       name:"Bold Punch",    desc:"All-caps heavy impact"},
  {id:"cinematic",  name:"Cinematic",     desc:"Elegant letter reveal"},
  {id:"word",       name:"Word by Word",  desc:"Each word pops in"},
  {id:"typewriter", name:"Typewriter",    desc:"Character by character"},
];

const MUSIC_TRACKS = [
  {id:"epic",    name:"Titan Rising",   vibe:"Epic orchestral",  bpm:128, emoji:"🎼"},
  {id:"trap",    name:"Dark Trap",      vibe:"Heavy 808s",       bpm:140, emoji:"🎵"},
  {id:"cine",    name:"Cinematic Rise", vibe:"Emotional build",  bpm:90,  emoji:"🎹"},
  {id:"lofi",    name:"Lo-Fi Grind",    vibe:"Chill beats",      bpm:85,  emoji:"🎧"},
  {id:"rock",    name:"Power Surge",    vibe:"Hard rock energy", bpm:155, emoji:"🎸"},
  {id:"piano",   name:"Awakening",      vibe:"Solo piano",       bpm:72,  emoji:"🎶"},
];

const ANIM_PRESETS = [
  {id:"fade",   name:"Fade & Rise",  icon:"✦"},
  {id:"zoom",   name:"Zoom Punch",   icon:"◉"},
  {id:"glitch", name:"Glitch Flash", icon:"⚡"},
  {id:"slide",  name:"Slide In",     icon:"→"},
  {id:"shake",  name:"Impact Shake", icon:"❋"},
];

const BATCH_TOPICS = ["discipline","morning routine","entrepreneurship","failure","consistency","mindset","success","focus","sacrifice","hustle","faith","resilience"];

/* ─── PHONE PREVIEW ─── */
function PhonePreview({ script, theme, captionStyle, segment, isPlaying, hasMusic, musicVol }) {
  const t = THEMES.find(x => x.id === theme) || THEMES[0];
  const segs = script ? [
    {text: script.hook,  label:"HOOK"},
    {text: script.body1, label:"PART 1"},
    {text: script.body2, label:"PART 2"},
    {text: script.cta,   label:"CTA"},
  ] : [];
  const cur = segs[Math.min(segment, segs.length - 1)];

  const getStyle = () => {
    const base = { color: t.tc, textAlign:"center", maxWidth:"84%", zIndex:2, position:"relative" };
    if (captionStyle === "bold")       return {...base, fontFamily:"'Bebas Neue',sans-serif", fontSize: segment===0?"2.5rem":"1.55rem", letterSpacing:"0.06em", lineHeight:1.1};
    if (captionStyle === "cinematic")  return {...base, fontFamily:"Georgia,serif", fontStyle:"italic", fontSize: segment===0?"1.8rem":"1.2rem", letterSpacing:"0.1em", lineHeight:1.45};
    if (captionStyle === "typewriter") return {...base, fontFamily:"'JetBrains Mono',monospace", fontSize: segment===0?"1.2rem":"0.95rem", letterSpacing:"0.02em", lineHeight:1.65};
    return {...base, fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize: segment===0?"1.95rem":"1.2rem", lineHeight:1.25};
  };

  const getAnim = () => {
    if (captionStyle === "bold")       return "wordIn 0.45s cubic-bezier(.17,.67,.35,1.3) both";
    if (captionStyle === "cinematic")  return "cinIn 0.7s ease both";
    if (captionStyle === "typewriter") return "typeIn 0.9s steps(30) both";
    return "fadeUp 0.5s ease both";
  };

  return (
    <div style={{width:"100%", maxWidth:"240px", margin:"0 auto"}}>
      <div style={{
        background:"#111120", borderRadius:"36px", padding:"10px",
        border:"2px solid #22223a",
        boxShadow:"0 40px 80px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.04), inset 0 1px 0 rgba(255,255,255,.07)",
      }}>
        <div style={{borderRadius:"28px", overflow:"hidden", position:"relative", aspectRatio:"9/16", background:t.bg}}>
          {/* Ambient glow */}
          <div style={{position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 65%, ${t.glow} 0%, transparent 65%)`, pointerEvents:"none"}} />
          {/* Grid */}
          <div style={{position:"absolute", inset:0, opacity:.035,
            backgroundImage:`linear-gradient(${t.c1} 1px,transparent 1px),linear-gradient(90deg,${t.c1} 1px,transparent 1px)`,
            backgroundSize:"28px 28px", pointerEvents:"none"}} />
          {/* Top bar */}
          <div style={{position:"absolute", top:0, left:0, right:0, height:"2px",
            background:`linear-gradient(90deg,transparent,${t.c1},${t.c2},transparent)`}} />
          {/* Notch */}
          <div style={{position:"absolute", top:"7px", left:"50%", transform:"translateX(-50%)",
            width:"56px", height:"13px", background:"#111120", borderRadius:"0 0 9px 9px", zIndex:10}} />
          {/* Progress */}
          <div style={{position:"absolute", top:"28px", left:"50%", transform:"translateX(-50%)",
            display:"flex", gap:"4px", zIndex:5}}>
            {segs.map((_,i) => (
              <div key={i} style={{width: i===segment?"20px":"6px", height:"3px", borderRadius:"99px",
                background: i<=segment ? t.c1 : "rgba(255,255,255,.12)", transition:"all .3s"}} />
            ))}
          </div>
          {/* Label */}
          {cur && <div style={{position:"absolute", top:"40px", left:"50%", transform:"translateX(-50%)",
            fontFamily:"var(--fm)", fontSize:".48rem", letterSpacing:".22em", color:t.c1, opacity:.75,
            whiteSpace:"nowrap", zIndex:5}}>{cur.label}</div>}
          {/* Content */}
          <div style={{position:"absolute", inset:0, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", padding:".9rem"}}>
            {cur ? (
              <div key={`${segment}-${captionStyle}`} style={{...getStyle(), animation:getAnim(),
                textShadow:`0 0 35px ${t.glow}, 0 2px 6px rgba(0,0,0,.6)`}}>
                {cur.text}
              </div>
            ) : (
              <div style={{color:"rgba(255,255,255,.12)", fontFamily:"var(--fm)", fontSize:".68rem",
                textAlign:"center", lineHeight:2.2}}>Generate a script<br/>to preview</div>
            )}
          </div>
          {/* Music bars */}
          {isPlaying && hasMusic && musicVol > 0 && (
            <div style={{position:"absolute", bottom:"36px", left:"50%", transform:"translateX(-50%)",
              display:"flex", gap:"3px", alignItems:"flex-end", height:"14px", zIndex:5}}>
              {[.4,.9,.6,1,.7,.8,.5,.95].map((h,i) => (
                <div key={i} style={{width:"3px", height:`${h*100}%`, borderRadius:"2px",
                  background:t.c1, opacity:.65,
                  animation:`barPulse ${.4+i*.07}s ease-in-out infinite`, animationDelay:`${i*.055}s`}} />
              ))}
            </div>
          )}
          {/* Playing dot */}
          {isPlaying && <div style={{position:"absolute", top:"48px", right:"11px", width:"7px", height:"7px",
            borderRadius:"50%", background:t.c1, animation:"blink 1s infinite", zIndex:5}} />}
          {/* Corners */}
          <div style={{position:"absolute", bottom:"10px", right:"10px", width:"18px", height:"18px",
            borderRight:`1px solid ${t.c1}45`, borderBottom:`1px solid ${t.c1}45`}} />
          <div style={{position:"absolute", bottom:0, left:"18%", right:"18%", height:"2px",
            background:`linear-gradient(90deg,transparent,${t.c2},transparent)`}} />
        </div>
      </div>
      <div style={{textAlign:"center", marginTop:"9px", fontFamily:"var(--fm)",
        fontSize:".55rem", letterSpacing:".14em", color:t.c1, opacity:.55, textTransform:"uppercase"}}>
        {THEMES.find(x=>x.id===theme)?.name} · {CAPTION_STYLES.find(x=>x.id===captionStyle)?.name}
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function ShortsStudio() {
  const [tab, setTab] = useState("studio");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("aggressive");
  const [theme, setTheme] = useState("inferno");
  const [captionStyle, setCaptionStyle] = useState("bold");
  const [script, setScript] = useState(null);
  const [editScript, setEditScript] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState("");
  const [segment, setSegment] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [musicVol, setMusicVol] = useState(40);
  const [previewTrack, setPreviewTrack] = useState(null);
  // Animation builder state
  const [animPreset, setAnimPreset] = useState("fade");
  const [textSize, setTextSize] = useState(60);
  const [animSpeed, setAnimSpeed] = useState(50);
  const [particles, setParticles] = useState(true);
  const [textPos, setTextPos] = useState("center");
  // Batch state
  const [batchTopics, setBatchTopics] = useState(["discipline","mindset","success"]);
  const [customTopic, setCustomTopic] = useState("");
  const [batchScripts, setBatchScripts] = useState([]);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  const intervalRef = useRef(null);

  const tones = [
    {id:"aggressive", label:"🔥 Aggressive", desc:"Intense, confrontational"},
    {id:"stoic",      label:"🧱 Stoic",       desc:"Calm power, no fluff"},
    {id:"spiritual",  label:"✨ Spiritual",   desc:"Soul-level, deeper purpose"},
    {id:"raw",        label:"😤 Raw & Real",  desc:"Honest, street-level"},
  ];

  const generateScript = async () => {
    setGenerating(true);
    setGenStatus("Writing your script…");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user", content:`You are an expert viral YouTube Shorts scriptwriter specializing in motivational content that gets millions of views.

Write a ${tone} motivational YouTube Short script about: "${topic || "never giving up on your dreams"}"

Tone definitions:
- aggressive: high-energy, in-your-face, bold claims, fire metaphors, urgency
- stoic: calm authority, ancient wisdom applied now, no emotion just facts and discipline
- spiritual: soul-level awakening, higher purpose, connection to something greater
- raw: street-level honesty, vulnerable, conversational, no corporate speak

Structure (4 segments for a ~15 second Short):
- hook: 1 ultra-punchy sentence that STOPS the scroll (under 10 words, declarative, powerful)
- body1: 1-2 short sentences building emotion and context (under 25 words total)
- body2: 1-2 sentences delivering the core insight or truth (under 25 words total)  
- cta: 1 action line with 1 emoji (under 8 words)

Respond ONLY with valid JSON, no markdown, no backticks, no explanation:
{"hook":"...","body1":"...","body2":"...","cta":"..."}`}]
        })
      });
      const data = await res.json();
      const txt = data.content.map(x=>x.text||"").join("").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(txt);
      setScript(parsed); setEditScript(parsed);
      setGenStatus("✓ Script ready");
      setSegment(0); setIsPlaying(false);
    } catch {
      const fallback = {
        hook:"Most people quit before the miracle happens.",
        body1:"They grind for months, get close, and walk away on day 89 of 90.",
        body2:"The only thing between you and your goal is the decision to continue.",
        cta:"Follow for daily fire 🔥"
      };
      setScript(fallback); setEditScript(fallback);
      setGenStatus("✓ Sample script loaded");
    }
    setGenerating(false);
    setTimeout(()=>setGenStatus(""), 3000);
  };

  const togglePlay = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      if (!script) return;
      setIsPlaying(true); setSegment(0);
      let seg = 0;
      intervalRef.current = setInterval(() => {
        seg++;
        if (seg >= 4) { clearInterval(intervalRef.current); setIsPlaying(false); setSegment(0); return; }
        setSegment(seg);
      }, 3500);
    }
  };

  useEffect(()=>()=>clearInterval(intervalRef.current),[]);

  const runBatch = async () => {
    if (!batchTopics.length) return;
    setBatchGenerating(true); setBatchProgress(0); setBatchScripts([]);
    const results = [];
    for (let i=0; i<batchTopics.length; i++) {
      const topic = batchTopics[i];
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            model:"claude-sonnet-4-20250514", max_tokens:600,
            messages:[{role:"user", content:`Write a viral motivational YouTube Short script about "${topic}". Return ONLY valid JSON with keys hook, body1, body2, cta. No markdown.`}]
          })
        });
        const data = await res.json();
        const txt = data.content.map(x=>x.text||"").join("").replace(/```json|```/g,"").trim();
        results.push({topic, ...JSON.parse(txt), id:Date.now()+i});
      } catch {
        results.push({topic, hook:`Discipline beats motivation every time.`, body1:`Motivation is a feeling. Discipline is a decision.`, body2:`Show up every single day, regardless of how you feel.`, cta:`Save this for hard days 🧱`, id:Date.now()+i});
      }
      setBatchProgress(Math.round(((i+1)/batchTopics.length)*100));
      await new Promise(r=>setTimeout(r,300));
    }
    setBatchScripts(results);
    setBatchGenerating(false);
  };

  const TABS = [
    {id:"studio",  label:"Studio",   icon:"⚡"},
    {id:"animate", label:"Animate",  icon:"🎬"},
    {id:"music",   label:"Music",    icon:"🎵"},
    {id:"batch",   label:"Batch",    icon:"📦"},
  ];

  const activeScript = editScript || script;
  const themeObj = THEMES.find(x=>x.id===theme)||THEMES[0];

  return (
    <div style={{minHeight:"100vh", background:"var(--bg)", fontFamily:"var(--fh)", color:"var(--text)"}}>
      <G />

      {/* HEADER */}
      <header style={{
        background:"rgba(6,6,15,.96)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid var(--border)", padding:"0 1.75rem",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        height:"56px", position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{display:"flex", alignItems:"center", gap:"11px"}}>
          <div style={{width:"30px", height:"30px", borderRadius:"8px",
            background:"linear-gradient(135deg,#ff5722,#ff8f00)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px",
            boxShadow:"0 0 18px rgba(255,87,34,.5)"}}>⚡</div>
          <div>
            <div style={{fontWeight:800, fontSize:".95rem", letterSpacing:"-0.02em", lineHeight:1}}>
              SHORTS<span style={{color:"var(--a)"}}>STUDIO</span>
            </div>
            <div style={{fontFamily:"var(--fm)", fontSize:".48rem", color:"var(--muted)", letterSpacing:".18em", marginTop:"2px"}}>
              MOTIVATION · YOUTUBE SHORTS
            </div>
          </div>
        </div>

        <nav style={{display:"flex", gap:"3px"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:".4rem .85rem", borderRadius:"7px", border:"none", cursor:"pointer",
              background: tab===t.id ? "var(--a)" : "transparent",
              color: tab===t.id ? "#fff" : "var(--muted2)",
              fontFamily:"var(--fh)", fontWeight: tab===t.id?700:500, fontSize:".78rem",
              transition:"all .2s", display:"flex", alignItems:"center", gap:"5px",
            }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>

        <div style={{fontFamily:"var(--fm)", fontSize:".55rem", color:"var(--muted)",
          padding:"3px 9px", border:"1px solid var(--border)", borderRadius:"99px", letterSpacing:".1em"}}>
          AI-POWERED
        </div>
      </header>

      {/* MAIN */}
      <main style={{
        maxWidth:"1140px", margin:"0 auto", padding:"1.75rem",
        display:"grid",
        gridTemplateColumns: tab==="batch" ? "1fr" : "1fr 250px",
        gap:"1.75rem", alignItems:"start",
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>

          {/* ══ STUDIO TAB ══ */}
          {tab==="studio" && <>
            {/* Topic input */}
            <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.25rem"}}>
              <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:".6rem"}}>Topic / Niche</div>
              <div style={{display:"flex", gap:"8px"}}>
                <input value={topic} onChange={e=>setTopic(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&generateScript()}
                  placeholder="e.g. discipline, morning routine, failure, entrepreneurship…"
                  style={{flex:1, background:"var(--s2)", border:"1px solid var(--border)", borderRadius:"10px",
                    color:"var(--text)", fontFamily:"var(--fh)", fontSize:".88rem", padding:".72rem 1rem",
                    transition:"border-color .2s"}}
                  onFocus={e=>e.target.style.borderColor="var(--a)"}
                  onBlur={e=>e.target.style.borderColor="var(--border)"} />
                <button onClick={generateScript} disabled={generating}
                  style={{background: generating?"#1e1e30":"linear-gradient(135deg,#ff5722,#ff8f00)",
                    border:"none", borderRadius:"10px", cursor:generating?"not-allowed":"pointer",
                    color:generating?"#444":"#fff", fontFamily:"var(--fh)", fontWeight:700,
                    fontSize:".85rem", padding:".72rem 1.4rem", letterSpacing:".04em",
                    animation:generating?"none":"glowPulse 3s infinite", whiteSpace:"nowrap",
                    transition:"all .2s"}}>
                  {generating ? (
                    <span style={{display:"flex", alignItems:"center", gap:"8px"}}>
                      <span style={{width:"13px", height:"13px", border:"2px solid rgba(255,255,255,.25)",
                        borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .7s linear infinite",
                        display:"inline-block"}} />
                      Writing…
                    </span>
                  ) : "⚡ Generate"}
                </button>
              </div>
              {genStatus && <div style={{fontFamily:"var(--fm)", fontSize:".62rem", marginTop:"8px",
                color:genStatus.startsWith("✓")?"var(--green)":"var(--a)"}}>{genStatus}</div>}
            </div>

            {/* Tone + Theme */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem"}}>
              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.1rem"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:".7rem"}}>Tone</div>
                <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
                  {tones.map(t=>(
                    <button key={t.id} onClick={()=>setTone(t.id)} style={{
                      padding:".55rem .8rem", borderRadius:"8px", cursor:"pointer",
                      background: tone===t.id ? "rgba(255,87,34,.1)" : "transparent",
                      border:`1px solid ${tone===t.id?"rgba(255,87,34,.35)":"var(--border)"}`,
                      fontFamily:"var(--fh)", fontSize:".8rem", textAlign:"left", transition:"all .2s",
                      color: tone===t.id?"var(--a)":"var(--muted2)", fontWeight: tone===t.id?700:400,
                    }}>
                      {t.label}
                      <span style={{display:"block", fontFamily:"var(--fm)", fontSize:".56rem", color:"var(--muted)", marginTop:"2px", fontWeight:300}}>{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.1rem"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:".7rem"}}>Visual Theme</div>
                <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
                  {THEMES.map(t=>(
                    <button key={t.id} onClick={()=>setTheme(t.id)} style={{
                      padding:".48rem .8rem", borderRadius:"8px", cursor:"pointer",
                      background: theme===t.id ? `${t.glow.replace(".28","0.08")}` : "transparent",
                      border:`1px solid ${theme===t.id?t.c1+"55":"var(--border)"}`,
                      fontFamily:"var(--fh)", fontSize:".8rem", textAlign:"left", transition:"all .2s",
                      color: theme===t.id?t.c1:"var(--muted2)",
                      display:"flex", alignItems:"center", gap:"8px",
                    }}>
                      <div style={{width:"9px", height:"9px", borderRadius:"50%", flexShrink:0,
                        background:`linear-gradient(135deg,${t.c1},${t.c2})`,
                        boxShadow: theme===t.id?`0 0 7px ${t.c1}`:"none"}} />
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Caption Style */}
            <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.1rem"}}>
              <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:".7rem"}}>Caption Animation Style</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px"}}>
                {CAPTION_STYLES.map(s=>(
                  <button key={s.id} onClick={()=>setCaptionStyle(s.id)} style={{
                    padding:".65rem .9rem", borderRadius:"9px", cursor:"pointer",
                    background: captionStyle===s.id?"rgba(255,87,34,.1)":"var(--s2)",
                    border:`1px solid ${captionStyle===s.id?"rgba(255,87,34,.35)":"var(--border)"}`,
                    fontFamily:"var(--fh)", fontSize:".8rem", textAlign:"left", transition:"all .2s",
                    color: captionStyle===s.id?"var(--a)":"var(--muted2)",
                  }}>
                    <div style={{fontWeight: captionStyle===s.id?700:500}}>{s.name}</div>
                    <div style={{fontFamily:"var(--fm)", fontSize:".56rem", color:"var(--muted)", marginTop:"2px"}}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Script Editor */}
            {editScript && (
              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.25rem", animation:"fadeUp .4s ease"}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem"}}>
                  <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)"}}>✏️ Script Editor</div>
                  <div style={{display:"flex", gap:"7px"}}>
                    <button onClick={()=>setScript({...editScript})} style={{
                      background:"rgba(255,87,34,.12)", border:"1px solid rgba(255,87,34,.25)",
                      borderRadius:"8px", cursor:"pointer", color:"var(--a)",
                      fontFamily:"var(--fh)", fontSize:".75rem", fontWeight:600, padding:".42rem .9rem",
                      transition:"all .2s"}}>Apply</button>
                    <button onClick={()=>navigator.clipboard?.writeText(`${editScript.hook}\n\n${editScript.body1}\n\n${editScript.body2}\n\n${editScript.cta}`)}
                      style={{background:"transparent", border:"1px solid var(--borderB)", borderRadius:"8px",
                        cursor:"pointer", color:"var(--muted2)", fontFamily:"var(--fh)", fontSize:".75rem",
                        padding:".42rem .9rem", transition:"all .2s"}}>📋 Copy</button>
                  </div>
                </div>
                {[
                  {key:"hook",  label:"🎯 Hook",   rows:2, hint:"Stop the scroll"},
                  {key:"body1", label:"🔥 Part 1",  rows:2, hint:"Build emotion"},
                  {key:"body2", label:"⚡ Part 2",  rows:2, hint:"Core truth"},
                  {key:"cta",   label:"👇 CTA",     rows:1, hint:"Drive action"},
                ].map(f=>(
                  <div key={f.key} style={{marginBottom:"12px"}}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}>
                      <span style={{fontFamily:"var(--fm)", fontSize:".58rem", color:"var(--a)", letterSpacing:".1em"}}>{f.label}</span>
                      <span style={{fontFamily:"var(--fm)", fontSize:".55rem", color:"var(--muted)"}}>{f.hint}</span>
                    </div>
                    <textarea rows={f.rows} value={editScript[f.key]||""} onChange={e=>setEditScript(p=>({...p,[f.key]:e.target.value}))}
                      style={{width:"100%", background:"var(--s2)", border:"1px solid var(--border)",
                        borderRadius:"9px", color:"var(--text)", fontFamily:"var(--fh)", fontSize:".85rem",
                        padding:".68rem .9rem", lineHeight:1.55, resize:"none", transition:"border-color .2s"}}
                      onFocus={e=>e.target.style.borderColor="var(--a)"}
                      onBlur={e=>e.target.style.borderColor="var(--border)"} />
                  </div>
                ))}
              </div>
            )}

            {/* Workflow */}
            {script && (
              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.1rem", animation:"fadeUp .5s ease"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:".8rem"}}>🚀 Production Workflow</div>
                <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"7px", marginBottom:"10px"}}>
                  {[
                    {n:"ElevenLabs", d:"AI voiceover",  c:"var(--a)",      i:"🎙"},
                    {n:"CapCut",     d:"Edit+captions",  c:"var(--blue)",   i:"✂️"},
                    {n:"Runway ML",  d:"AI animation",   c:"var(--purple)", i:"🎞"},
                  ].map(item=>(
                    <div key={item.n} style={{padding:".7rem", borderRadius:"10px", background:"var(--s2)",
                      border:`1px solid ${item.c}22`, textAlign:"center"}}>
                      <div style={{fontSize:"1.1rem", marginBottom:"3px"}}>{item.i}</div>
                      <div style={{fontSize:".78rem", fontWeight:700, color:item.c}}>{item.n}</div>
                      <div style={{fontFamily:"var(--fm)", fontSize:".56rem", color:"var(--muted)", marginTop:"2px"}}>{item.d}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontFamily:"var(--fm)", fontSize:".62rem", color:"var(--muted2)", lineHeight:1.8,
                  padding:".65rem .85rem", background:"var(--s2)", borderRadius:"9px"}}>
                  Copy script → paste into <span style={{color:"var(--a)"}}>ElevenLabs</span> for voice →
                  import into <span style={{color:"var(--blue)"}}>CapCut</span> with background footage →
                  export as 1080×1920 → publish
                </div>
              </div>
            )}
          </>}

          {/* ══ ANIMATE TAB ══ */}
          {tab==="animate" && (
            <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.25rem"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:".8rem"}}>Animation Preset</div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"7px"}}>
                  {ANIM_PRESETS.map(p=>(
                    <button key={p.id} onClick={()=>setAnimPreset(p.id)} style={{
                      padding:".65rem .9rem", borderRadius:"9px", cursor:"pointer",
                      background: animPreset===p.id?"rgba(255,87,34,.12)":"var(--s2)",
                      border:`1px solid ${animPreset===p.id?"rgba(255,87,34,.4)":"var(--border)"}`,
                      color: animPreset===p.id?"var(--a)":"var(--muted2)",
                      fontFamily:"var(--fh)", fontSize:".82rem", display:"flex", alignItems:"center",
                      gap:"8px", transition:"all .2s", fontWeight: animPreset===p.id?700:400,
                    }}>
                      <span style={{fontSize:".9rem"}}>{p.icon}</span> {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.25rem"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:"1rem"}}>Text Controls</div>
                {[
                  {label:"Text Size",        value:textSize,  set:setTextSize,  min:30, max:100},
                  {label:"Animation Speed",  value:animSpeed, set:setAnimSpeed, min:10, max:100},
                ].map(ctrl=>(
                  <div key={ctrl.label} style={{marginBottom:"14px"}}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:"6px"}}>
                      <span style={{fontFamily:"var(--fm)", fontSize:".6rem", color:"var(--muted2)", textTransform:"uppercase", letterSpacing:".1em"}}>{ctrl.label}</span>
                      <span style={{fontFamily:"var(--fm)", fontSize:".62rem", color:"var(--a)"}}>{ctrl.value}%</span>
                    </div>
                    <input type="range" min={ctrl.min} max={ctrl.max} value={ctrl.value}
                      onChange={e=>ctrl.set(+e.target.value)}
                      style={{width:"100%", accentColor:"var(--a)", cursor:"pointer"}} />
                  </div>
                ))}
              </div>

              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.25rem"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:".75rem"}}>Text Position</div>
                <div style={{display:"flex", gap:"7px"}}>
                  {["top","center","bottom"].map(pos=>(
                    <button key={pos} onClick={()=>setTextPos(pos)} style={{
                      flex:1, padding:".55rem", borderRadius:"8px", cursor:"pointer",
                      background: textPos===pos?"rgba(255,87,34,.12)":"var(--s2)",
                      border:`1px solid ${textPos===pos?"rgba(255,87,34,.4)":"var(--border)"}`,
                      color: textPos===pos?"var(--a)":"var(--muted2)",
                      fontFamily:"var(--fh)", fontSize:".78rem", transition:"all .2s",
                    }}>
                      {pos==="top"?"▲ Top":pos==="center"?"● Center":"▼ Bottom"}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.25rem",
                display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  <div style={{fontSize:".85rem", fontWeight:600}}>Particle Effects</div>
                  <div style={{fontFamily:"var(--fm)", fontSize:".58rem", color:"var(--muted)", marginTop:"2px"}}>Animated sparks behind text</div>
                </div>
                <button onClick={()=>setParticles(!particles)} style={{
                  width:"42px", height:"23px", borderRadius:"99px", border:"none", cursor:"pointer",
                  background: particles?"var(--a)":"var(--s3)", position:"relative", transition:"background .2s",
                }}>
                  <div style={{position:"absolute", top:"3px", width:"17px", height:"17px",
                    borderRadius:"50%", background:"#fff", transition:"left .2s",
                    left: particles?"22px":"3px"}} />
                </button>
              </div>

              <div style={{background:"rgba(0,230,118,.04)", border:"1px solid rgba(0,230,118,.15)", borderRadius:"16px", padding:"1.25rem"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".58rem", color:"var(--green)", letterSpacing:".12em", marginBottom:".75rem"}}>🎬 EXPORT SPECS</div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
                  {[["Resolution","1080×1920"],["Format","MP4 H.264"],["Frame Rate","60 FPS"],["Duration","15–60s"]].map(([k,v])=>(
                    <div key={k}>
                      <div style={{fontFamily:"var(--fm)", fontSize:".56rem", color:"var(--muted)", textTransform:"uppercase", marginBottom:"2px"}}>{k}</div>
                      <div style={{fontSize:".85rem", fontWeight:700, color:"var(--text)"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:"12px", padding:".65rem", borderRadius:"9px", background:"var(--s2)",
                  fontFamily:"var(--fm)", fontSize:".62rem", color:"var(--muted2)", lineHeight:1.75}}>
                  Apply these animation settings in <span style={{color:"var(--green)"}}>CapCut</span> or <span style={{color:"var(--green)"}}>Runway ML</span> when building your final video.
                </div>
              </div>
            </div>
          )}

          {/* ══ MUSIC TAB ══ */}
          {tab==="music" && (
            <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.25rem"}}>
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem"}}>
                  <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)"}}>🎵 Background Music</div>
                  <div style={{display:"flex", alignItems:"center", gap:"9px"}}>
                    <span style={{fontFamily:"var(--fm)", fontSize:".58rem", color:"var(--muted2)"}}>VOL</span>
                    <input type="range" min={0} max={100} value={musicVol} onChange={e=>setMusicVol(+e.target.value)}
                      style={{width:"75px", accentColor:"var(--a)", cursor:"pointer"}} />
                    <span style={{fontFamily:"var(--fm)", fontSize:".62rem", color:"var(--a)", minWidth:"26px"}}>{musicVol}%</span>
                  </div>
                </div>

                <div style={{display:"flex", flexDirection:"column", gap:"6px"}}>
                  {MUSIC_TRACKS.map(track=>{
                    const isSel = selectedTrack?.id===track.id;
                    const isPrev = previewTrack?.id===track.id;
                    return (
                      <div key={track.id} onClick={()=>setSelectedTrack(isSel?null:track)}
                        style={{
                          display:"flex", alignItems:"center", gap:"10px",
                          padding:".65rem .9rem", borderRadius:"10px", cursor:"pointer",
                          background: isSel?"rgba(255,87,34,.1)":"var(--s2)",
                          border:`1px solid ${isSel?"rgba(255,87,34,.3)":"var(--border)"}`,
                          transition:"all .2s",
                        }}>
                        {isPrev ? (
                          <div style={{display:"flex", gap:"2px", alignItems:"flex-end", height:"18px", minWidth:"22px"}}>
                            {[.5,.9,.6,1,.7,.8].map((h,i)=>(
                              <div key={i} style={{width:"3px", height:`${h*100}%`, background:"var(--a)", borderRadius:"2px",
                                animation:`barPulse ${.35+i*.05}s ease-in-out infinite`, animationDelay:`${i*.04}s`}} />
                            ))}
                          </div>
                        ) : (
                          <span style={{fontSize:"1.05rem", minWidth:"22px", textAlign:"center"}}>{track.emoji}</span>
                        )}
                        <div style={{flex:1}}>
                          <div style={{fontSize:".82rem", fontWeight:600, color:isSel?"var(--a)":"var(--text)"}}>{track.name}</div>
                          <div style={{fontFamily:"var(--fm)", fontSize:".58rem", color:"var(--muted)", marginTop:"1px"}}>{track.vibe} · {track.bpm} BPM</div>
                        </div>
                        <button onClick={e=>{
                          e.stopPropagation();
                          setPreviewTrack(isPrev?null:track);
                        }} style={{
                          background:"transparent", border:"1px solid var(--borderB)", borderRadius:"7px",
                          cursor:"pointer", color:"var(--muted2)", fontFamily:"var(--fh)",
                          fontSize:".7rem", padding:".28rem .6rem", transition:"all .2s",
                        }}>
                          {isPrev?"■":"▶"}
                        </button>
                        {isSel && <div style={{width:"7px", height:"7px", borderRadius:"50%", background:"var(--a)",
                          animation: isPlaying?"blink 1s infinite":"none", flexShrink:0}} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{background:"rgba(68,138,255,.05)", border:"1px solid rgba(68,138,255,.15)", borderRadius:"16px", padding:"1.25rem"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".58rem", color:"var(--blue)", letterSpacing:".12em", marginBottom:".75rem"}}>💡 ROYALTY-FREE SOURCES</div>
                <div style={{fontSize:".82rem", color:"var(--muted2)", lineHeight:1.8}}>
                  For real YouTube Shorts use <span style={{color:"var(--text)", fontWeight:600}}>YouTube Audio Library</span>, <span style={{color:"var(--text)", fontWeight:600}}>Epidemic Sound</span>, or <span style={{color:"var(--text)", fontWeight:600}}>Artlist</span> to avoid copyright strikes.
                </div>
                <div style={{marginTop:"12px", display:"flex", flexDirection:"column", gap:"5px"}}>
                  {[
                    {name:"YouTube Audio Library", free:true,  url:"studio.youtube.com"},
                    {name:"Epidemic Sound",         free:false, url:"epidemicsound.com"},
                    {name:"Artlist",                free:false, url:"artlist.io"},
                    {name:"Pixabay Music",          free:true,  url:"pixabay.com/music"},
                  ].map(s=>(
                    <div key={s.name} style={{display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:".5rem .7rem", borderRadius:"8px", background:"var(--s2)"}}>
                      <span style={{fontSize:".8rem", color:"var(--text)"}}>{s.name}</span>
                      <span style={{fontFamily:"var(--fm)", fontSize:".58rem",
                        color:s.free?"var(--green)":"var(--a2)",
                        background:s.free?"rgba(0,230,118,.1)":"rgba(255,171,0,.1)",
                        padding:"2px 8px", borderRadius:"99px",
                        border:`1px solid ${s.free?"rgba(0,230,118,.25)":"rgba(255,171,0,.25)"}`}}>
                        {s.free?"FREE":"PAID"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ BATCH TAB ══ */}
          {tab==="batch" && (
            <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"16px", padding:"1.25rem"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".58rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:".8rem"}}>Select Topics</div>
                <div style={{display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"12px"}}>
                  {BATCH_TOPICS.map(t=>{
                    const on = batchTopics.includes(t);
                    return (
                      <button key={t} onClick={()=>setBatchTopics(prev=>on?prev.filter(x=>x!==t):[...prev,t])} style={{
                        padding:"4px 11px", borderRadius:"99px", cursor:"pointer", fontSize:".7rem",
                        fontFamily:"var(--fm)", letterSpacing:".1em", textTransform:"uppercase",
                        color: on?"var(--a)":"var(--muted2)",
                        borderColor: on?"rgba(255,87,34,.5)":"var(--border)",
                        background: on?"rgba(255,87,34,.1)":"transparent",
                        border:`1px solid`, transition:"all .2s",
                      }}>{t}</button>
                    );
                  })}
                </div>
                <div style={{display:"flex", gap:"8px"}}>
                  <input value={customTopic} onChange={e=>setCustomTopic(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"&&customTopic.trim()){setBatchTopics(p=>[...p,customTopic.trim()]);setCustomTopic("");}}}
                    placeholder="Add custom topic…"
                    style={{flex:1, background:"var(--s2)", border:"1px solid var(--border)", borderRadius:"9px",
                      color:"var(--text)", fontFamily:"var(--fh)", fontSize:".85rem", padding:".65rem .9rem"}} />
                  <button onClick={()=>{if(customTopic.trim()){setBatchTopics(p=>[...p,customTopic.trim()]);setCustomTopic("");}}}
                    style={{background:"rgba(255,87,34,.12)", border:"1px solid rgba(255,87,34,.25)", borderRadius:"9px",
                      cursor:"pointer", color:"var(--a)", fontFamily:"var(--fh)", fontSize:".8rem", fontWeight:600,
                      padding:".65rem 1.1rem", whiteSpace:"nowrap"}}>+ Add</button>
                </div>
              </div>

              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".62rem", color:"var(--muted2)"}}>
                  {batchTopics.length} topics → {batchTopics.length} scripts
                </div>
                <button onClick={runBatch} disabled={batchGenerating||!batchTopics.length}
                  style={{background:batchGenerating||!batchTopics.length?"#1e1e30":"linear-gradient(135deg,#ff5722,#ff8f00)",
                    border:"none", borderRadius:"10px", cursor:batchGenerating?"not-allowed":"pointer",
                    color:batchGenerating?"#444":"#fff", fontFamily:"var(--fh)", fontWeight:700,
                    fontSize:".85rem", padding:".72rem 1.5rem", animation:(!batchGenerating&&batchTopics.length)?"glowPulse 3s infinite":"none"}}>
                  {batchGenerating ? (
                    <span style={{display:"flex", alignItems:"center", gap:"8px"}}>
                      <span style={{width:"13px", height:"13px", border:"2px solid rgba(255,255,255,.25)",
                        borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block"}} />
                      {batchProgress}% done…
                    </span>
                  ) : `⚡ Generate ${batchTopics.length} Scripts`}
                </button>
              </div>

              {batchGenerating && (
                <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"12px", padding:"1rem"}}>
                  <div style={{fontFamily:"var(--fm)", fontSize:".6rem", color:"var(--muted2)", marginBottom:"8px"}}>Generating scripts…</div>
                  <div style={{height:"4px", background:"var(--s3)", borderRadius:"99px", overflow:"hidden"}}>
                    <div style={{height:"100%", width:`${batchProgress}%`, borderRadius:"99px",
                      background:"linear-gradient(90deg,var(--a),var(--a2))", transition:"width .3s"}} />
                  </div>
                </div>
              )}

              {batchScripts.length>0 && (
                <>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div style={{fontFamily:"var(--fm)", fontSize:".6rem", color:"var(--green)"}}>✅ {batchScripts.length} Scripts Ready</div>
                    <button onClick={()=>navigator.clipboard?.writeText(batchScripts.map((s,i)=>`=== SCRIPT ${i+1}: ${s.topic.toUpperCase()} ===\nHOOK: ${s.hook}\n\n${s.body1}\n\n${s.body2}\n\nCTA: ${s.cta}`).join("\n\n"))}
                      style={{background:"rgba(255,87,34,.1)", border:"1px solid rgba(255,87,34,.25)", borderRadius:"8px",
                        cursor:"pointer", color:"var(--a)", fontFamily:"var(--fh)", fontSize:".75rem",
                        fontWeight:600, padding:".4rem .9rem"}}>📋 Copy All</button>
                  </div>
                  <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                    {batchScripts.map((s,i)=>(
                      <div key={s.id} style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"14px",
                        padding:"1.1rem", animation:`fadeUp .4s ease ${i*0.05}s both`}}>
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
                          <span style={{fontFamily:"var(--fm)", fontSize:".58rem", color:"var(--a)", textTransform:"uppercase", letterSpacing:".1em"}}>
                            #{i+1} · {s.topic}
                          </span>
                          <button onClick={()=>navigator.clipboard?.writeText(`${s.hook}\n\n${s.body1}\n\n${s.body2}\n\n${s.cta}`)}
                            style={{background:"transparent", border:"1px solid var(--borderB)", borderRadius:"6px",
                              cursor:"pointer", color:"var(--muted2)", fontFamily:"var(--fh)", fontSize:".68rem",
                              padding:".22rem .55rem"}}>Copy</button>
                        </div>
                        <div style={{fontSize:".88rem", fontWeight:700, color:"var(--text)", marginBottom:"6px"}}>{s.hook}</div>
                        <div style={{fontSize:".78rem", color:"var(--muted2)", lineHeight:1.65}}>{s.body1} {s.body2}</div>
                        <div style={{fontSize:".75rem", color:"var(--a)", marginTop:"6px", fontFamily:"var(--fm)"}}>{s.cta}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: PHONE PREVIEW ── */}
        {tab!=="batch" && (
          <div style={{position:"sticky", top:"68px", display:"flex", flexDirection:"column", gap:"1rem"}}>
            <div style={{fontFamily:"var(--fm)", fontSize:".55rem", color:"var(--muted)", letterSpacing:".15em",
              textTransform:"uppercase", textAlign:"center"}}>Live Preview</div>

            <PhonePreview
              script={activeScript}
              theme={theme}
              captionStyle={captionStyle}
              segment={segment}
              isPlaying={isPlaying}
              hasMusic={!!selectedTrack}
              musicVol={musicVol}
            />

            {/* Playback controls */}
            <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"14px", padding:".9rem"}}>
              <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                <button onClick={togglePlay} disabled={!script} style={{
                  width:"40px", height:"40px", borderRadius:"50%", border:"none",
                  background: script?"linear-gradient(135deg,#ff5722,#ff8f00)":"var(--s3)",
                  cursor: script?"pointer":"not-allowed", fontSize:"1rem", flexShrink:0,
                  boxShadow: script?"0 0 20px rgba(255,87,34,.4)":"none",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {isPlaying?"⏸":"▶"}
                </button>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"var(--fm)", fontSize:".58rem", color:"var(--muted2)", marginBottom:"5px"}}>
                    {isPlaying?`Playing · Segment ${segment+1}/4`:"Preview your Short"}
                  </div>
                  <div style={{display:"flex", gap:"3px"}}>
                    {[0,1,2,3].map(i=>(
                      <div key={i} style={{flex:1, height:"3px", borderRadius:"99px",
                        background: i<=segment&&isPlaying?"var(--a)":"var(--s3)", transition:"background .3s"}} />
                    ))}
                  </div>
                </div>
                <span style={{fontFamily:"var(--fm)", fontSize:".58rem", color:"var(--muted)"}}>~14s</span>
              </div>

              {selectedTrack && (
                <div style={{marginTop:"10px", padding:".6rem", borderRadius:"9px", background:"var(--s2)",
                  display:"flex", alignItems:"center", gap:"8px"}}>
                  <span style={{fontSize:".9rem"}}>{selectedTrack.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:".75rem", fontWeight:600, color:"var(--text)"}}>{selectedTrack.name}</div>
                    <div style={{fontFamily:"var(--fm)", fontSize:".55rem", color:"var(--muted)"}}>Vol {musicVol}%</div>
                  </div>
                  {isPlaying && (
                    <div style={{display:"flex", gap:"2px", alignItems:"flex-end", height:"13px"}}>
                      {[.5,.9,.6,1].map((h,i)=>(
                        <div key={i} style={{width:"3px", height:`${h*100}%`, background:"var(--a)", borderRadius:"1px",
                          animation:`barPulse ${.35+i*.06}s ease-in-out infinite`, animationDelay:`${i*.04}s`}} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Jump to segment */}
            {script && (
              <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"14px", padding:".9rem"}}>
                <div style={{fontFamily:"var(--fm)", fontSize:".55rem", letterSpacing:".15em", textTransform:"uppercase",
                  color:"var(--muted)", marginBottom:".65rem"}}>Jump to Segment</div>
                {[{i:0,label:"Hook",icon:"🎯"},{i:1,label:"Part 1",icon:"🔥"},{i:2,label:"Part 2",icon:"⚡"},{i:3,label:"CTA",icon:"👇"}].map(s=>(
                  <button key={s.i} onClick={()=>{setSegment(s.i);setIsPlaying(false);clearInterval(intervalRef.current);}}
                    style={{
                      width:"100%", padding:".42rem .7rem", borderRadius:"7px", border:"none",
                      cursor:"pointer", marginBottom:"3px",
                      background: segment===s.i?"rgba(255,87,34,.1)":"transparent",
                      color: segment===s.i?"var(--a)":"var(--muted2)",
                      fontFamily:"var(--fh)", fontSize:".78rem", textAlign:"left",
                      display:"flex", alignItems:"center", gap:"8px", transition:"all .15s",
                    }}>
                    <span style={{fontSize:".85rem"}}>{s.icon}</span> {s.label}
                    {segment===s.i && <div style={{marginLeft:"auto", width:"6px", height:"6px",
                      borderRadius:"50%", background:"var(--a)"}} />}
                  </button>
                ))}
              </div>
            )}

            {/* Quick theme switcher */}
            <div style={{background:"var(--s1)", border:"1px solid var(--border)", borderRadius:"14px", padding:".9rem"}}>
              <div style={{fontFamily:"var(--fm)", fontSize:".55rem", letterSpacing:".15em", textTransform:"uppercase",
                color:"var(--muted)", marginBottom:".65rem"}}>Quick Theme</div>
              <div style={{display:"flex", gap:"6px", flexWrap:"wrap"}}>
                {THEMES.map(t=>(
                  <button key={t.id} onClick={()=>setTheme(t.id)} title={t.name} style={{
                    width:"26px", height:"26px", borderRadius:"50%", border:"none", cursor:"pointer",
                    background:`linear-gradient(135deg,${t.c1},${t.c2})`,
                    boxShadow: theme===t.id?`0 0 10px ${t.c1}, 0 0 0 2px var(--bg), 0 0 0 3px ${t.c1}`:"none",
                    transition:"all .2s", transform: theme===t.id?"scale(1.15)":"scale(1)",
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
