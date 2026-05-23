import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "12px",
    }}>
      <div style={{ color: "#00ff88", fontSize: "12px" }}>&#10003; Autenticado</div>
      <div style={{ fontSize: "14px" }}>{user.email}</div>
      <div style={{ fontSize: "12px", color: "rgba(200,212,200,0.4)" }}>{user.user_metadata?.user_name}</div>
    </div>
  );
}