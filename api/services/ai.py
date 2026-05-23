import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
import os
os.environ["HTTPS_PROXY"] = "http://127.0.0.1:8080"
os.environ["HTTP_PROXY"] = "http://127.0.0.1:8080"

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

async def parse_job_posting(text: str) -> dict:
    prompt = f"""
Eres un analizador experto de ofertas de trabajo tech.
Analiza esta oferta y responde SOLO con un objeto JSON, sin texto adicional, sin markdown, sin backticks.

Oferta:
{text}

Responde exactamente con esta estructura:
{{
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
}}
"""
    response = model.generate_content(prompt)
    text_response = response.text.strip()
    
    # Limpiar si viene con backticks
    if text_response.startswith(""):
        text_response = text_response.split("")[1]
        if text_response.startswith("json"):
            text_response = text_response[4:]
    
    return json.loads(text_response.strip())