import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "12px", color: "rgba(200,212,200,0.4)" }}>
            {user.user_metadata?.user_name || user.email}
          </span>
          <Link href="/api/auth/signout" style={{
            fontSize: "11px",
            color: "rgba(200,212,200,0.3)",
            textDecoration: "none",
            border: "1px solid rgba(200,212,200,0.1)",
            padding: "4px 10px",
            borderRadius: "2px",
          }}>
            salir
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "11px", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
            $ new-session --type=technical
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#e8f0e8", marginBottom: "8px" }}>
            Nueva entrevista
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(200,212,200,0.4)", lineHeight: 1.6 }}>
            Pega la descripcion del puesto y generamos una entrevista personalizada.
          </p>
        </div>

        <Link href="/dashboard/new" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
          background: "#00ff88",
          color: "#080c0a",
          fontSize: "13px",
          fontWeight: 600,
          borderRadius: "3px",
          textDecoration: "none",
        }}>
          Comenzar entrevista →
        </Link>

        {/* Sessions placeholder */}
        <div style={{ marginTop: "60px" }}>
          <div style={{ fontSize: "11px", color: "rgba(200,212,200,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
            Sesiones anteriores
          </div>
          <div style={{
            padding: "32px",
            border: "1px solid rgba(0,255,136,0.08)",
            borderRadius: "4px",
            textAlign: "center",
            color: "rgba(200,212,200,0.25)",
            fontSize: "12px",
          }}>
            Aun no tienes sesiones. Comienza tu primera entrevista.
          </div>
        </div>
      </main>
    </div>
  );
}