import { NextResponse } from "next/server";

const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/ai/run/@cf/meta/llama-3.1-8b-instruct`;

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text || text.trim().length < 50) {
    return NextResponse.json({ error: "Texto muy corto" }, { status: 400 });
  }

  const prompt = `Analiza esta oferta de trabajo tech y responde SOLO con un objeto JSON valido, sin texto adicional, sin markdown, sin backticks.

Oferta:
${text}

Responde exactamente con esta estructura JSON:
{
  "company_name": "nombre de la empresa",
  "role": "titulo del puesto",
  "level": "junior o mid o senior",
  "stack": ["tecnologia1", "tecnologia2"],
  "responsibilities": ["responsabilidad1", "responsabilidad2"],
  "requirements": ["requisito1", "requisito2"],
  "culture": "descripcion breve de la cultura",
  "remote_friendly": true,
  "latam_friendly": true,
  "summary": "resumen de 2 lineas de la oferta"
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
          { role: "system", content: "Eres un analizador experto de ofertas de trabajo tech. Responde SOLO con JSON valido, sin texto adicional ni backticks." },
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
    // Fallback si el JSON no parsea
    return NextResponse.json({
      success: true,
      data: {
        company_name: "Empresa",
        role: "Developer",
        level: "mid",
        stack: ["JavaScript"],
        responsibilities: [],
        requirements: [],
        culture: "Remote-first",
        remote_friendly: true,
        latam_friendly: true,
        summary: "No se pudo analizar la oferta. Intenta de nuevo.",
      }
    });
  }
}