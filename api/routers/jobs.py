from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai import parse_job_posting

router = APIRouter(prefix="/jobs", tags=["jobs"])

class JobPostingInput(BaseModel):
    text: str
    url: str | None = None

@router.post("/parse")
async def parse_job(input: JobPostingInput):
    if len(input.text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Texto muy corto")
    
    try:
        parsed = await parse_job_posting(input.text)
        return {"success": True, "data": parsed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))