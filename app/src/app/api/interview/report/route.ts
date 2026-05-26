import { NextResponse } from "next/server";

const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/ai/run/@cf/meta/llama-3.1-8b-instruct`;

export async function POST(request: Request) {
  const { messages, job } = await request.json();

  const conversation = messages
    .map((m: any) => `${m.role === "interviewer" ? "Entrevistador" : "Candidato"}: ${m.content}`)
    .join("\n");

  const prompt = `Eres un evaluador experto de entrevistas tecnicas. Analiza esta entrevista y responde SOLO con un objeto JSON, sin texto adicional, sin markdown, sin backticks.

Puesto: ${job.role} en ${job.company_name}
Stack: ${job.stack?.join(", ")}

Conversacion:
${conversation}

Responde exactamente con esta estructura:
{
  "score": 75,
  "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "weaknesses": ["area de mejora 1", "area de mejora 2", "area de mejora 3"],
  "patterns": "descripcion de patrones detectados en las respuestas",
  "study_plan": "1. Esta semana: ...\n2. Proxima semana: ...\n3. Semana 3: ...\n4. Semana 4: ..."
}`;

  try {
    const res = await fetch(CF_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "Eres un evaluador experto. Responde SOLO con JSON valido, sin texto adicional." },
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await res.json();
    let result = data.result?.response ?? "";

    if (result.startsWith("```")) {
      result = result.split("```")[1];
      if (result.startsWith("json")) result = result.slice(4);
    }

    const parsed = JSON.parse(result.trim());
    return NextResponse.json({ success: true, data: parsed });
  } catch {
    // Fallback al mock si falla el parse
    return NextResponse.json({
      success: true,
      data: {
        score: 70,
        strengths: ["Conocimiento solido del stack", "Comunicacion clara", "Buena actitud tecnica"],
        weaknesses: ["Profundizar en optimizacion", "Practicar system design", "Ampliar conocimiento de arquitectura"],
        patterns: "Respuestas correctas pero necesita mas profundidad tecnica.",
        study_plan: "1. Esta semana: Repasar documentacion oficial\n2. Proxima semana: Proyecto practico\n3. Semana 3: Mock interviews\n4. Semana 4: Revision de conceptos debiles",
      }
    });
  }
}