import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ 
    debug: true, 
    received: true,
    job: body.job?.company_name 
  });
}