import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { messages, job } = await request.json();

  // Mock report — swap for real AI when available
  const report = {
    score: 72,
    strengths: [
      "Buena comprension de los conceptos fundamentales de React",
      "Capacidad para explicar soluciones de forma clara",
      "Conocimiento del stack requerido por la empresa",
    ],
    weaknesses: [
      "Profundizar en optimizacion de performance en Next.js",
      "Ampliar conocimiento de Edge Runtime y funciones serverless",
      "Practicar explicacion de decisiones de arquitectura",
    ],
    patterns: "Tendencia a dar respuestas correctas pero superficiales. Cuando se profundiza con follow-ups, el conocimiento es solido pero necesita mas confianza para elaborar sin que se le pida.",
    study_plan: `1. **Esta semana:** Leer la documentacion oficial de Next.js sobre caching y Edge Runtime\n2. **Proxima semana:** Construir un proyecto pequeño usando App Router con datos en tiempo real\n3. **Semana 3:** Practicar system design en voz alta — explica tus decisiones mientras codeas\n4. **Semana 4:** Hacer 2-3 entrevistas mock mas en este simulador con el mismo rol`,
  };

  return NextResponse.json({ success: true, data: report });
}