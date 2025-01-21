from dotenv import load_dotenv #connects and reads .env file
import os
load_dotenv()

SERVER_URL = 'localhost'
PORT = 5173
ENV = 'dev'
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
