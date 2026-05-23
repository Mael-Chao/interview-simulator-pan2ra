"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGitHub = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleMagicLink = async () => {
    if (!email) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace",
      padding: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "380px",
        border: "1px solid rgba(0,255,136,0.2)",
        borderRadius: "8px",
        background: "rgba(8,12,10,0.95)",
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
            auth — login
          </span>
          <div style={{ width: 52 }} />
        </div>

        <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          <div>
            <div style={{ fontSize: "11px", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
              $ identify --user
            </div>
            <div style={{ fontSize: "13px", color: "rgba(200,212,200,0.5)" }}>
              Inicia sesion para continuar
            </div>
          </div>

          {/* GitHub */}
          <button
            onClick={handleGitHub}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              padding: "11px",
              background: "#00ff88",
              color: "#080c0a",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "monospace",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continuar con GitHub
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(200,212,200,0.1)" }} />
            <span style={{ fontSize: "11px", color: "rgba(200,212,200,0.3)", letterSpacing: "0.05em" }}>o</span>
            <div style={{ flex: 1, height: 1, background: "rgba(200,212,200,0.1)" }} />
          </div>

          {/* Magic Link */}
          {!sent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleMagicLink()}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(0,255,136,0.04)",
                  border: "1px solid rgba(0,255,136,0.15)",
                  borderRadius: "3px",
                  color: "#c8d4c8",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                onClick={handleMagicLink}
                disabled={loading || !email}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: "transparent",
                  color: email ? "rgba(200,212,200,0.8)" : "rgba(200,212,200,0.3)",
                  fontSize: "13px",
                  fontFamily: "monospace",
                  border: "1px solid rgba(200,212,200,0.15)",
                  borderRadius: "3px",
                  cursor: email ? "pointer" : "not-allowed",
                }}
              >
                {loading ? "Enviando..." : "Enviar magic link"}
              </button>
            </div>
          ) : (
            <div style={{
              padding: "14px",
              background: "rgba(0,255,136,0.05)",
              border: "1px solid rgba(0,255,136,0.2)",
              borderRadius: "3px",
              fontSize: "12px",
              color: "#00ff88",
              lineHeight: 1.6,
            }}>
              &#10003; Link enviado a {email}<br />
              <span style={{ color: "rgba(200,212,200,0.4)" }}>Revisa tu bandeja de entrada</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
