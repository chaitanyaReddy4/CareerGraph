from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.driver import verify_connection
from app.routes.roles import router as roles_router
from app.routes.jobs import router as jobs_router

app = FastAPI(
    title="CareerGraph API",
    description="Graph-powered career and job intelligence API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roles_router)
app.include_router(jobs_router)


@app.get("/api/health")
def health_check():
    database_connected = verify_connection()

    return {
        "status": "ok" if database_connected else "degraded",
        "service": "CareerGraph API",
        "database": "connected" if database_connected else "unavailable",
    }