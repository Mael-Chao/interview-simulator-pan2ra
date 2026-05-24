"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const ROLES = ["Frontend", "Backend", "Fullstack", "DevOps", "Mobile"];

function TypingText({ text, speed = 30, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="terminal-cursor">&#9607;</span>}
    </span>
  );
}

function TerminalLine({ prefix = "$", children, delay = 0, onDone }: {
  prefix?: string;
  children: string;
  delay?: number;
  onDone?: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return <div style={{ height: "24px" }} />;

  return (
    <div style={{ display: "flex", gap: "12px", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.6" }}>
      <span style={{ color: "#00ff88", userSelect: "none" }}>{prefix}</span>
      <TypingText text={children} speed={30} onDone={onDone} />
    </div>
  );
}

export default function LandingPage() {
  const [step, setStep] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (step < 4) return;
    const interval = setInterval(() => {
      setRoleIndex(prev => (prev + 1) % ROLES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c0a",
      color: "#c8d4c8",
      fontFamily: "'JetBrains Mono', monospace",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Grid background */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "1100px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "60px",
        alignItems: "center",
      }}>

        {/* Terminal window */}
        <div style={{
          border: "1px solid rgba(0,255,136,0.2)",
          borderRadius: "8px",
          background: "rgba(8,12,10,0.95)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}>
          {/* Terminal header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            background: "rgba(0,255,136,0.04)",
            borderBottom: "1px solid rgba(0,255,136,0.1)",
          }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e", display: "block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "block" }} />
            </div>
            <span style={{ flex: 1, textAlign: "center", fontSize: "11px", color: "rgba(200,212,200,0.4)", letterSpacing: "0.05em" }}>
              interview-simulator &#8212; bash
            </span>
            <div style={{ width: 52 }} />
          </div>

          {/* Terminal body */}
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "4px", minHeight: "340px" }}>
            <TerminalLine delay={200} onDone={() => setStep(1)}>
              simulate --region=LATAM --lang=es
            </TerminalLine>

            {step >= 1 && (
              <div style={{ padding: "8px 0 8px 20px", borderLeft: "1px solid rgba(0,255,136,0.15)", margin: "4px 0" }}>
                <div style={{ fontSize: "12px", lineHeight: "1.8", color: "rgba(200,212,200,0.7)" }}>Inicializando simulador...</div>
                <div style={{ fontSize: "12px", lineHeight: "1.8", color: "#00ff88" }}>&#10003; Region: America Latina</div>
                <div style={{ fontSize: "12px", lineHeight: "1.8", color: "#00ff88" }}>&#10003; Idioma: Espanol</div>
                <div style={{ fontSize: "12px", lineHeight: "1.8", color: "#00ff88" }}>&#10003; Modelo: Claude (Anthropic)</div>
              </div>
            )}

            {step >= 1 && (
              <TerminalLine delay={800} onDone={() => setStep(2)}>
                load --job-posting="jobs.vercel.com/senior-engineer"
              </TerminalLine>
            )}

            {step >= 2 && (
              <div style={{ padding: "8px 0 8px 20px", borderLeft: "1px solid rgba(0,255,136,0.15)", margin: "4px 0" }}>
                <div style={{ fontSize: "12px", lineHeight: "1.8", color: "rgba(200,212,200,0.7)" }}>Analizando oferta...</div>
                <div style={{ fontSize: "12px", lineHeight: "1.8", color: "rgba(200,212,200,0.7)" }}>
                  <span style={{ color: "#ffcc00" }}>&#8594;</span> Empresa: <span style={{ color: "white" }}>Vercel</span>
                </div>
                <div style={{ fontSize: "12px", lineHeight: "1.8", color: "rgba(200,212,200,0.7)" }}>
                  <span style={{ color: "#ffcc00" }}>&#8594;</span> Stack: <span style={{ color: "white" }}>Next.js · TypeScript · Edge Runtime</span>
                </div>
                <div style={{ fontSize: "12px", lineHeight: "1.8", color: "#00ff88" }}>&#10003; Preguntas personalizadas generadas</div>
              </div>
            )}

            {step >= 2 && (
              <TerminalLine delay={600} onDone={() => setStep(3)}>
                start-interview --mode=technical
              </TerminalLine>
            )}

            {step >= 3 && (
              <div style={{
                margin: "8px 0",
                padding: "12px",
                background: "rgba(0,255,136,0.03)",
                border: "1px solid rgba(0,255,136,0.1)",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}>
                <div style={{ display: "flex", gap: "10px", fontSize: "12px", lineHeight: "1.6" }}>
                  <span style={{ color: "#00aaff", fontWeight: 600, whiteSpace: "nowrap", fontSize: "11px" }}>[Entrevistador]</span>
                  <span style={{ color: "rgba(200,212,200,0.85)" }}>
                    Explica como funciona el sistema de cache en Next.js 14 y como lo usarias en una app con datos en tiempo real.
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", fontSize: "12px" }}>
                  <span style={{ color: "#00ff88", fontWeight: 600, fontSize: "11px" }}>[Tu]</span>
                  <span style={{ color: "#00ff88", animation: "blink 1s step-end infinite" }}>&#9607;</span>
                </div>
              </div>
            )}

            {step >= 3 && (
              <TerminalLine delay={1200} onDone={() => { setStep(4); setShowCTA(true); }} prefix=">">
                Sistema listo. Comenzamos?
              </TerminalLine>
            )}
          </div>
        </div>

        {/* Hero section */}
        <div style={{
          opacity: showCTA ? 1 : 0,
          transform: showCTA ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "11px",
            letterSpacing: "0.1em",
            color: "#00ff88",
            textTransform: "uppercase",
            marginBottom: "20px",
            padding: "4px 10px",
            border: "1px solid rgba(0,255,136,0.2)",
            borderRadius: "2px",
          }}>
            <span style={{
              width: 6, height: 6,
              borderRadius: "50%",
              background: "#00ff88",
              boxShadow: "0 0 6px #00ff88",
              display: "inline-block",
            }} />
            LATAM · Remote-first · En espanol
          </div>

          <h1 style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#e8f0e8",
            marginBottom: "20px",
            letterSpacing: "-0.02em",
          }}>
            Practica la entrevista<br />
            de <span style={{ color: "#00ff88" }} key={roleIndex}>{ROLES[roleIndex]}</span><br />
            que realmente importa
          </h1>

          <p style={{
            fontSize: "13px",
            lineHeight: 1.8,
            color: "rgba(200,212,200,0.55)",
            marginBottom: "32px",
            maxWidth: "420px",
          }}>
            Pega cualquier job posting. La IA analiza la empresa, el rol y el stack,
            y conduce una entrevista tecnica realista en espanol — disenado para
            developers en LATAM que aplican a roles remotos.
          </p>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "40px" }}>
            <button onClick={() => router.push("/auth/login")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 22px",
              background: "#00ff88",
              color: "#080c0a",
              fontFamily: "monospace",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}>
              Comenzar
            </button>
            <button style={{
              padding: "11px 18px",
              background: "transparent",
              color: "rgba(200,212,200,0.5)",
              fontFamily: "monospace",
              fontSize: "13px",
              border: "1px solid rgba(200,212,200,0.15)",
              borderRadius: "3px",
              cursor: "pointer",
            }}>
              Ver demo
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {[
              { num: "+50", label: "empresas en base" },
              { num: "100%", label: "en espanol" },
              { num: "LATAM", label: "remote-first" },
            ].map((stat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                {i > 0 && <div style={{ width: 1, height: 28, background: "rgba(200,212,200,0.1)" }} />}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 600, color: "#e8f0e8" }}>{stat.num}</span>
                  <span style={{ fontSize: "10px", color: "rgba(200,212,200,0.4)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .terminal-cursor {
          display: inline-block;
          animation: blink 1s step-end infinite;
          color: #00ff88;
        }
      `}</style>
    </div>
  );
}
