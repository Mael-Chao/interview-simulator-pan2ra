import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { job, messages, report } = await request.json();

  // Guardar job posting
  const { data: jobData, error: jobError } = await supabase
    .from("job_postings")
    .insert({
      user_id: user.id,
      company_name: job.company_name,
      role: job.role,
      stack: job.stack,
      level: job.level,
      parsed_data: job,
    })
    .select()
    .single();

  if (jobError) {
    return NextResponse.json({ error: jobError.message }, { status: 500 });
  }

  // Guardar sesión
  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      user_id: user.id,
      job_posting_id: jobData.id,
      role: job.role,
      level: job.level,
      status: "completed",
      ended_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 500 });
  }

  // Guardar mensajes
  const messagesData = messages.map((m: any) => ({
    session_id: sessionData.id,
    role: m.role,
    content: m.content,
  }));

  await supabase.from("messages").insert(messagesData);

  // Guardar reporte
  await supabase.from("reports").insert({
    session_id: sessionData.id,
    user_id: user.id,
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    patterns: report.patterns,
    study_plan: report.study_plan,
    score: report.score,
  });

    console.log("Session saved:", sessionData.id);
  return NextResponse.json({ success: true, session_id: sessionData.id });
}