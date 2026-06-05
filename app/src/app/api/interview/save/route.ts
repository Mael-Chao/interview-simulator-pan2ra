import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const { job, messages, report, user_id } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data: jobData, error: jobError } = await supabase
    .from("job_postings")
    .insert({
      user_id,
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

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      user_id,
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

  const messagesData = messages.map((m: any) => ({
    session_id: sessionData.id,
    role: m.role,
    content: m.content,
  }));

  await supabase.from("messages").insert(messagesData);

  await supabase.from("reports").insert({
    session_id: sessionData.id,
    user_id,
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    patterns: report.patterns,
    study_plan: report.study_plan,
    score: report.score,
  });

  return NextResponse.json({ success: true, session_id: sessionData.id });
}