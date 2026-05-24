import { NextResponse } from "next/server";

const GEMINI_API_KEY = "AIzaSyD6aEfDxvgouRqZ3l1zfpJwjaOamjQI1gc" //process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text || text.trim().length < 50) {
    return NextResponse.json({ error: "Texto muy corto" }, { status: 400 });
  }

  const prompt = `Eres un analizador experto de ofertas de trabajo tech.
Analiza esta oferta y responde SOLO con un objeto JSON, sin texto adicional, sin markdown, sin backticks.

Oferta:
${text}

Responde exactamente con esta estructura:
{
  "company_name": "nombre de la empresa",
  "role": "titulo del puesto",
  "level": "junior|mid|senior",
  "stack": ["tecnologia1", "tecnologia2"],
  "responsibilities": ["responsabilidad1", "responsabilidad2"],
  "requirements": ["requisito1", "requisito2"],
  "culture": "descripcion breve de la cultura de la empresa",
  "remote_friendly": true,
  "latam_friendly": true,
  "summary": "resumen de 2 lineas de la oferta"
}`;

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();
  console.log("Gemini status:", response.status);
  console.log("Gemini response:", JSON.stringify(data, null, 2));

  
  let result = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (result.startsWith("```")) {
    result = result.split("```")[1];
    if (result.startsWith("json")) result = result.slice(4);
  }

  try {
    const parsed = JSON.parse(result.trim());
    return NextResponse.json({ success: true, data: parsed });
  } catch {
    return NextResponse.json({ error: "Error parseando respuesta", raw: data }, { status: 500 });
  }
}