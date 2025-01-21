from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from constants import SERVER_URL, PORT, ENV

@asynccontextmanager
async def lifespan(app: FastAPI):
    # FastAPI's lifespan is a feature that allows you to define setup and cleanup logic for your application. It is useful for managing resources like database connections, cache, or any initialization and teardown tasks.

    # Key Points:
    # Setup Logic: IT'S THE CODE THAT GETS EXECUTED BEFORE the app starts serving requests (e.g., connecting to a database).
    # Teardown Logic: Runs after the app stops (e.g., closing connections).
    # How to Use:
    # Define a generator function using @asynccontextmanager.
    # Use it with FastAPI’s lifespan parameter.
    # Purpose: Ensures proper resource management throughout the app's lifecycle.
    yield
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials=True,
    allow_methods= ["*"],
    allow_headers = ["*"],
)

@app.get("/")
async def health():
    return {'message': 'Server is running'}

if __name__ == '__main__':
     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

