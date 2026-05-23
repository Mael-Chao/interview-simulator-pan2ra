from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import jobs

app = FastAPI(title="Interview Simulator LATAM", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Interview Simulator API running"}

@app.get("/health")
def health():
    return {"status": "healthy"}