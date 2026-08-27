from fastapi import FastAPI

app = FastAPI(
    title="CareerGraph API",
    description="Graph-powered career and job intelligence API",
    version="1.0.0",
)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "CareerGraph API",
    }