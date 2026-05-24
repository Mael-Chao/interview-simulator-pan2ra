import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: sessions } = await supabase
    .from("sessions")
    .select(`
      id,
      role,
      level,
      status,
      started_at,
      job_postings (company_name),
      reports (score)
    `)
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(10);

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

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: "40px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
              $ dashboard --user
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#e8f0e8", marginBottom: "4px" }}>
              Mis entrevistas
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(200,212,200,0.4)" }}>
              {sessions?.length || 0} sesiones completadas
            </p>
          </div>
          <Link href="/dashboard/new" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 22px",
            background: "#00ff88",
            color: "#080c0a",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "3px",
            textDecoration: "none",
          }}>
            Nueva entrevista →
          </Link>
        </div>

        {/* Sessions list */}
        {sessions && sessions.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sessions.map((session: any) => {
              const score = session.reports?.[0]?.score;
              const scoreColor = score >= 80 ? "#00ff88" : score >= 60 ? "#ffcc00" : "#ff6b6b";
              const date = new Date(session.started_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div key={session.id} style={{
                  padding: "16px 20px",
                  border: "1px solid rgba(0,255,136,0.1)",
                  borderRadius: "4px",
                  background: "rgba(0,255,136,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "14px", color: "#e8f0e8", fontWeight: 600 }}>
                      {session.job_postings?.company_name || "Empresa"}
                    </span>
                    <span style={{ fontSize: "12px", color: "rgba(200,212,200,0.4)" }}>
                      {session.role} · {session.level} · {date}
                    </span>
                  </div>
                  {score !== undefined && (
                    <div style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: scoreColor,
                      fontFamily: "system-ui, sans-serif",
                    }}>
                      {score}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}