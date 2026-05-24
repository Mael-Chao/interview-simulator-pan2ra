import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  const { messages, job, isFirst } = await request.json();

  const systemContext = `Eres un entrevistador tecnico senior conduciendo una entrevista en espanol para el puesto de ${job.role} en ${job.company_name}.

Stack requerido: ${job.stack?.join(", ")}.
Nivel: ${job.level}.
Cultura: ${job.culture}.

Reglas:
- Habla SIEMPRE en espanol
- Haz UNA sola pregunta a la vez
- Empieza con una presentacion breve y una pregunta de calentamiento
- Progresa de preguntas generales a tecnicas especificas del stack
- Da seguimiento a las respuestas del candidato con preguntas relacionadas
- Se profesional pero amigable
- Contexto LATAM: el candidato aplica a un rol remoto desde America Latina
- Maximo 3 oraciones por respuesta`;

  const prompt = isFirst
    ? `${systemContext}\n\nComienza la entrevista con una presentacion breve y la primera pregunta.`
    : `${systemContext}\n\nConversacion hasta ahora:\n${messages.map((m: any) => `${m.role === "interviewer" ? "Entrevistador" : "Candidato"}: ${m.content}`).join("\n")}\n\nResponde como entrevistador.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!message) {
      return NextResponse.json({ message: "Un momento, continuamos en breve..." });
    }

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ message: "Error de conexion. Intenta de nuevo." });
  }
}