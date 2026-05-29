import { NextResponse } from "next/server";

const CF_TOKEN = "cfut_VvOcA7cKsB532QaLq6lVCT8Qrt2ETbSQJcAHj1G0b9848c36";
const CF_ACCOUNT = "492641f1f7ca32bd05d21dd83e05595b";
const CF_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/ai/run/@cf/meta/llama-3.1-8b-instruct`;

export async function POST(request: Request) {
  const { messages, job, isFirst } = await request.json();

  const systemPrompt = `Eres un entrevistador tecnico senior conduciendo una entrevista en español para el puesto de ${job.role} en ${job.company_name}.

Stack requerido: ${job.stack?.join(", ")}.
Nivel: ${job.level}.
Cultura: ${job.culture}.

Reglas:
- Habla SIEMPRE en español
- Haz UNA sola pregunta a la vez
- Empieza con una presentacion breve y una pregunta de calentamiento
- Progresa de preguntas generales a tecnicas especificas del stack
- Da seguimiento a las respuestas del candidato
- Se profesional pero amigable
- Contexto LATAM: el candidato aplica a un rol remoto desde America Latina
- Maximo 3 oraciones por respuesta`;

  const cfMessages = isFirst
    ? [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Comienza la entrevista con una presentacion breve y la primera pregunta." }
      ]
    : [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role === "interviewer" ? "assistant" : "user",
          content: m.content,
        })),
      ];

  try {
    console.log("Reaching CF fetch...");
    const res = await fetch(CF_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: cfMessages }),
    });

    const data = await res.json();
    // Debug temporal — devolver todo
    return NextResponse.json({ 
      debug: true,
      status: res.status,
      data: data,
      message: data.result?.response ?? "sin respuesta"
    });
    const message = data.result?.response ?? "";
    

    if (!message) {
      return NextResponse.json({ message: "Un momento, continuamos en breve..." });
    }
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ message: "Error de conexion. Intenta de nuevo." });
  }
}