import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text || text.trim().length < 50) {
    return NextResponse.json({ error: "Texto muy corto" }, { status: 400 });
  }

  // Mock response — swap for real AI when available
  const parsed = {
    company_name: "Vercel",
    role: "Senior Frontend Engineer",
    level: "senior",
    stack: ["Next.js", "TypeScript", "React", "Edge Runtime"],
    responsibilities: [
      "Construir features del core de Next.js",
      "Colaborar con el equipo de producto",
      "Optimizar performance en producción"
    ],
    requirements: [
      "5+ años de experiencia",
      "Experto en React y TypeScript",
      "Experiencia con Edge Runtime"
    ],
    culture: "Remote-first, alto impacto, equipo pequeño",
    remote_friendly: true,
    latam_friendly: true,
    summary: "Rol senior en el core team de Next.js, enfocado en performance y developer experience."
  };

  return NextResponse.json({ success: true, data: parsed });
}