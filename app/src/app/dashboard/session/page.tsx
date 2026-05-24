"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Message {
  role: "interviewer" | "candidate";
  content: string;
}

export default function SessionPage() {
  const [job, setJob] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("job_parsed");
    if (!stored) {
      router.push("/dashboard/new");
      return;
    }
    setJob(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = async () => {
    setStarted(true);
    setLoading(true);

    const res = await fetch("/api/interview/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [],
        job,
        isFirst: true,
      }),
    });

    const data = await res.json();
    setMessages([{ role: "interviewer", content: data.message }]);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "candidate", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/interview/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: newMessages,
        job,
        isFirst: false,
      }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "interviewer", content: data.message }]);
    setLoading(false);
  };

  if (!job) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c0a",
      color: "#c8d4c8",
      fontFamily: "monospace",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Navbar */}
      <nav style={{
        borderBottom: "1px solid rgba(0,255,136,0.1)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <span style={{ color: "#00ff88", fontSize: "13px", fontWeight: 600 }}>
          interview-simulator
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "11px", color: "rgba(200,212,200,0.4)" }}>
            {job.company_name} · {job.role}
          </span>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              fontSize: "11px",
              color: "rgba(200,212,200,0.3)",
              background: "transparent",
              border: "1px solid rgba(200,212,200,0.1)",
              padding: "4px 10px",
              borderRadius: "2px",
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            terminar
          </button>
        </div>
      </nav>

      {/* Chat */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "32px",
        maxWidth: "700px",
        width: "100%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>
        {!started ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: "24px",
            paddingTop: "80px",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                $ start-interview --ready
              </div>
              <h2 style={{ fontSize: "20px", color: "#e8f0e8", marginBottom: "8px" }}>
                Entrevista para {job.company_name}
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(200,212,200,0.4)", lineHeight: 1.6, maxWidth: "400px" }}>
                La entrevista sera en espanol. El entrevistador hara preguntas tecnicas basadas en el job posting. Responde como lo harias en una entrevista real.
              </p>
            </div>
            <button
              onClick={startInterview}
              style={{
                padding: "12px 32px",
                background: "#00ff88",
                color: "#080c0a",
                fontFamily: "monospace",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Comenzar →
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                alignItems: msg.role === "candidate" ? "flex-end" : "flex-start",
              }}>
                <span style={{
                  fontSize: "10px",
                  color: msg.role === "interviewer" ? "#00aaff" : "#00ff88",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  {msg.role === "interviewer" ? "Entrevistador" : "Tu"}
                </span>
                <div style={{
                  maxWidth: "85%",
                  padding: "12px 16px",
                  background: msg.role === "interviewer"
                    ? "rgba(0,170,255,0.05)"
                    : "rgba(0,255,136,0.05)",
                  border: `1px solid ${msg.role === "interviewer" ? "rgba(0,170,255,0.15)" : "rgba(0,255,136,0.15)"}`,
                  borderRadius: "4px",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "rgba(200,212,200,0.85)",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "10px", color: "#00aaff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Entrevistador
                </span>
                <div style={{
                  padding: "12px 16px",
                  background: "rgba(0,170,255,0.05)",
                  border: "1px solid rgba(0,170,255,0.15)",
                  borderRadius: "4px",
                  fontSize: "13px",
                  color: "#00aaff",
                }}>
                  <span style={{ animation: "blink 1s step-end infinite" }}>▋</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      {started && (
        <div style={{
          borderTop: "1px solid rgba(0,255,136,0.1)",
          padding: "16px 32px",
          maxWidth: "700px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          gap: "12px",
          flexShrink: 0,
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Tu respuesta... (Enter para enviar, Shift+Enter para nueva linea)"
            rows={3}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              background: "rgba(0,255,136,0.03)",
              border: "1px solid rgba(0,255,136,0.15)",
              borderRadius: "3px",
              color: "#c8d4c8",
              fontFamily: "monospace",
              fontSize: "13px",
              lineHeight: 1.6,
              resize: "none",
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "0 20px",
              background: input.trim() ? "#00ff88" : "rgba(0,255,136,0.1)",
              color: input.trim() ? "#080c0a" : "rgba(200,212,200,0.2)",
              fontFamily: "monospace",
              fontSize: "13px",
              fontWeight: 700,
              border: "none",
              borderRadius: "3px",
              cursor: input.trim() ? "pointer" : "not-allowed",
              alignSelf: "stretch",
            }}
          >
            →
          </button>
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}