"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ReportPage() {
  const [report, setReport] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const messages = sessionStorage.getItem("session_messages");
    const jobData = sessionStorage.getItem("job_parsed");

    if (!messages || !jobData) {
      router.push("/dashboard");
      return;
    }

    const parsedJob = JSON.parse(jobData);
    const parsedMessages = JSON.parse(messages);
    setJob(parsedJob);

    const run = async () => {
      // 1. Refrescar sesion
      const supabase = createClient();
      await supabase.auth.refreshSession();
      console.log("Session refreshed");

      // 2. Generar reporte con IA
      const reportRes = await fetch("/api/interview/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: parsedMessages,
          job: parsedJob,
        }),
      });

      const reportData = await reportRes.json();
      console.log("Report generated:", reportData.success);
      setReport(reportData.data);
      setLoading(false);

      // 3. Guardar en Supabase
      console.log("About to save...");
      const saveRes = await fetch("/api/interview/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: parsedJob,
          messages: parsedMessages,
          report: reportData.data,
        }),
      });

      const saveData = await saveRes.json();
      console.log("Save response:", saveData);
    };

    run().catch(console.error);
  }, [router]);

  if (loading) return (
    <div style={{
      minHeight: "100vh",
      background: "#080c0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace",
      color: "#00ff88",
      fontSize: "13px",
      gap: "8px",
    }}>
      <span>Generando reporte</span>
      <span style={{ animation: "blink 1s step-end infinite" }}>&#9607;</span>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );

  if (!report) return null;

  const scoreColor = report.score >= 80 ? "#00ff88" : report.score >= 60 ? "#ffcc00" : "#ff6b6b";

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
          Pan2ra
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
          volver al dashboard
        </button>
      </nav>

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "11px", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
            $ generate --report
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#e8f0e8", marginBottom: "4px" }}>
            Reporte de entrevista
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(200,212,200,0.4)" }}>
            {job?.company_name} · {job?.role}
          </p>
        </div>

        <div style={{
          padding: "24px",
          border: `1px solid ${scoreColor}33`,
          borderRadius: "4px",
          background: `${scoreColor}08`,
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}>
          <div style={{
            fontSize: "56px",
            fontWeight: 800,
            color: scoreColor,
            lineHeight: 1,
            fontFamily: "system-ui, sans-serif",
          }}>
            {report.score}
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#e8f0e8", marginBottom: "4px" }}>
              {report.score >= 80 ? "Excelente desempeno" : report.score >= 60 ? "Buen desempeno" : "Necesitas practicar mas"}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(200,212,200,0.4)" }}>
              sobre 100 puntos
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "#00ff88", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Fortalezas
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {report.strengths?.map((s: string, i: number) => (
              <div key={i} style={{
                display: "flex",
                gap: "10px",
                padding: "10px 14px",
                background: "rgba(0,255,136,0.04)",
                border: "1px solid rgba(0,255,136,0.1)",
                borderRadius: "3px",
                fontSize: "13px",
                lineHeight: 1.5,
              }}>
                <span style={{ color: "#00ff88", flexShrink: 0 }}>&#10003;</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "#ffcc00", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Areas de mejora
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {report.weaknesses?.map((w: string, i: number) => (
              <div key={i} style={{
                display: "flex",
                gap: "10px",
                padding: "10px 14px",
                background: "rgba(255,204,0,0.04)",
                border: "1px solid rgba(255,204,0,0.1)",
                borderRadius: "3px",
                fontSize: "13px",
                lineHeight: 1.5,
              }}>
                <span style={{ color: "#ffcc00", flexShrink: 0 }}>&#8594;</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "rgba(200,212,200,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Patrones detectados
          </div>
          <div style={{
            padding: "16px",
            background: "rgba(0,255,136,0.02)",
            border: "1px solid rgba(0,255,136,0.08)",
            borderRadius: "3px",
            fontSize: "13px",
            lineHeight: 1.7,
            color: "rgba(200,212,200,0.65)",
          }}>
            {report.patterns}
          </div>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "11px", color: "rgba(200,212,200,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Plan de estudio
          </div>
          <div style={{
            padding: "16px",
            background: "rgba(0,255,136,0.02)",
            border: "1px solid rgba(0,255,136,0.08)",
            borderRadius: "3px",
            fontSize: "13px",
            lineHeight: 1.9,
            color: "rgba(200,212,200,0.65)",
            whiteSpace: "pre-wrap",
          }}>
            {report.study_plan}
          </div>
        </div>

        <button
          onClick={() => {
            sessionStorage.removeItem("session_messages");
            sessionStorage.removeItem("job_parsed");
            sessionStorage.removeItem("job_raw");
            router.push("/dashboard/new");
          }}
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
          Nueva entrevista &#8594;
        </button>

      </main>
    </div>
  );
}