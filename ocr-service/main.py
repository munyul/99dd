from fastapi import FastAPI

app = FastAPI(title="OCR Service")


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}
