"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSessionPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (text.trim().length < 50) {
      setError("El texto es muy corto. Pega la descripcion completa del puesto.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/jobs/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!data.success) {
        setError("Error analizando el job posting. Intenta de nuevo.");
        setLoading(false);
        return;
      }

      // Guardar en sessionStorage y redirigir
      sessionStorage.setItem("job_parsed", JSON.stringify(data.data));
      sessionStorage.setItem("job_raw", text);
      router.push("/dashboard/new/confirm");

    } catch {
      setError("Error de conexion. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c0a",
      color: "#c8d4c8",
      fontFamily: "monospace",
    }}>
      {/* Navbar */}
      <nav style={{
        borderBottom: "1px solid rgba(0,255,136,0.1)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ color: "#00ff88", fontSize: "13px", fontWeight: 600 }}>
          interview-simulator
        </span>
        <a href="/dashboard" style={{
          fontSize: "11px",
          color: "rgba(200,212,200,0.3)",
          textDecoration: "none",
        }}>
          ← volver
        </a>
      </nav>

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
            $ load --job-posting
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#e8f0e8", marginBottom: "8px" }}>
            Pega el job posting
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(200,212,200,0.4)", lineHeight: 1.6 }}>
            Copia y pega la descripcion completa del puesto. La IA analizara la empresa, el rol y el stack para generar preguntas personalizadas.
          </p>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="We are looking for a Senior Frontend Engineer..."
          rows={14}
          style={{
            width: "100%",
            padding: "16px",
            background: "rgba(0,255,136,0.03)",
            border: "1px solid rgba(0,255,136,0.15)",
            borderRadius: "4px",
            color: "#c8d4c8",
            fontFamily: "monospace",
            fontSize: "13px",
            lineHeight: 1.7,
            resize: "vertical",
            outline: "none",
            marginBottom: "16px",
          }}
        />

        {error && (
          <div style={{
            padding: "12px",
            background: "rgba(255,80,80,0.05)",
            border: "1px solid rgba(255,80,80,0.2)",
            borderRadius: "3px",
            fontSize: "12px",
            color: "#ff6b6b",
            marginBottom: "16px",
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "rgba(200,212,200,0.25)" }}>
            {text.length} caracteres
          </span>
          <button
            onClick={handleSubmit}
            disabled={loading || text.trim().length < 50}
            style={{
              padding: "11px 28px",
              background: text.trim().length >= 50 ? "#00ff88" : "rgba(0,255,136,0.15)",
              color: text.trim().length >= 50 ? "#080c0a" : "rgba(200,212,200,0.3)",
              fontFamily: "monospace",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              borderRadius: "3px",
              cursor: text.trim().length >= 50 ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Analizando..." : "Analizar →"}
          </button>
        </div>
      </main>
    </div>
  );
}