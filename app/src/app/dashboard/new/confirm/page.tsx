"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmPage() {
  const [job, setJob] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("job_parsed");
    if (!stored) {
      router.push("/dashboard/new");
      return;
    }
    setJob(JSON.parse(stored));
  }, [router]);

  if (!job) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c0a",
      color: "#c8d4c8",
      fontFamily: "monospace",
    }}>
      <nav style={{
        borderBottom: "1px solid rgba(0,255,136,0.1)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ color: "#00ff88", fontSize: "13px", fontWeight: 600 }}>
          interview-simulator-Pan2ra
        </span>
        <a href="/dashboard/new" style={{
          fontSize: "11px",
          color: "rgba(200,212,200,0.3)",
          textDecoration: "none",
        }}>
          ← editar
        </a>
      </nav>

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
            $ analysis --complete
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#e8f0e8", marginBottom: "4px" }}>
            {job.company_name}
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(200,212,200,0.5)" }}>
            {job.role} · {job.level}
          </p>
        </div>

        {/* Stack */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "rgba(200,212,200,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
            Stack detectado
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {job.stack?.map((tech: string) => (
              <span key={tech} style={{
                padding: "4px 10px",
                background: "rgba(0,255,136,0.08)",
                border: "1px solid rgba(0,255,136,0.2)",
                borderRadius: "2px",
                fontSize: "12px",
                color: "#00ff88",
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{
          padding: "16px",
          background: "rgba(0,255,136,0.03)",
          border: "1px solid rgba(0,255,136,0.1)",
          borderRadius: "4px",
          fontSize: "13px",
          lineHeight: 1.7,
          color: "rgba(200,212,200,0.7)",
          marginBottom: "24px",
        }}>
          {job.summary}
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
          {job.remote_friendly && (
            <span style={{ fontSize: "11px", color: "#00ff88", padding: "4px 10px", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "2px" }}>
              ✓ Remote friendly
            </span>
          )}
          {job.latam_friendly && (
            <span style={{ fontSize: "11px", color: "#00ff88", padding: "4px 10px", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "2px" }}>
              ✓ LATAM friendly
            </span>
          )}
        </div>

        <button
          onClick={() => router.push("/dashboard/session")}
          style={{
            width: "100%",
            padding: "14px",
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
          Comenzar entrevista →
        </button>
      </main>
    </div>
  );
}