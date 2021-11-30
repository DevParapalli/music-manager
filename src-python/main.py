from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fs_interop import fs_router
import uvicorn

app = FastAPI()
app.include_router(fs_router)

origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=7200, log_level="info", limit_concurrency=16, workers=16)